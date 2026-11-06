import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Resend } from "resend";
import {
  getOrCreateConversation,
  getConversationById,
  appendMessageToConversation,
  linkConversationToLead,
} from "@/lib/conversations";
import { upsertLead, findLeadByEmail, findLeadByConversationId } from "@/lib/leads";
import { computeLeadScore, LeadScoringSignals } from "@/lib/lead-scoring";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

const chatRequestSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, "Message cannot be empty"),
  sessionToken: z.string().min(1, "Session token is required"),
});

// Load knowledge base markdown
function getKnowledgeBase(): string {
  try {
    const kbPath = path.join(process.cwd(), "src", "data", "knowledge-base.md");
    if (fs.existsSync(kbPath)) {
      return fs.readFileSync(kbPath, "utf-8");
    }
  } catch (e) {
    console.warn("Could not read knowledge-base.md from disk, using fallback.", e);
  }
  return `You are Naveen Gaur's AI Assistant on naveengaur.com. Naveen is a senior WordPress & full-stack developer with 10+ years experience specializing in high-performance WordPress, custom Next.js/React development, Core Web Vitals, and WooCommerce architectures. Be polite, concise, consultative, and helpful.`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const sessionToken = searchParams.get("sessionToken");

    if (!conversationId || !sessionToken) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const conversation = await getConversationById(conversationId);
    if (!conversation || conversation.sessionToken !== sessionToken) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    return NextResponse.json({
      conversationId: conversation._id,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("GET /api/chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, sessionToken } = parsed.data;
    const conversationId = parsed.data.conversationId || crypto.randomUUID();

    // 1. Get or create conversation in MongoDB
    const conversation = await getOrCreateConversation(conversationId, sessionToken, "chat");

    // Check if human takeover or AI paused
    let existingLead = conversation.leadId
      ? await findLeadByConversationId(conversationId)
      : null;

    if (existingLead && (existingLead.humanTakeover || existingLead.aiPaused)) {
      const pausedReply = "Naveen will be in touch with you directly shortly.";
      await appendMessageToConversation(conversationId, {
        role: "user",
        content: message,
        timestamp: new Date(),
      });
      await appendMessageToConversation(conversationId, {
        role: "assistant",
        content: pausedReply,
        timestamp: new Date(),
      });
      return NextResponse.json({
        conversationId,
        sessionToken,
        reply: pausedReply,
      });
    }

    // 2. Build history for Gemini
    const kb = getKnowledgeBase();
    const systemPrompt = `You are the AI Sales and Technical Assistant for Naveen Gaur (naveengaur.com).
Refer to this knowledge base for information about Naveen's background, services, and policies:
---
${kb}
---

Your role:
1. Converse warmly, professionally, and concisely. Keep each response to 2–4 sentences or short bullet points. Never be verbose.
2. Answer questions accurately based on the knowledge base only. Never invent client details, metrics, or certifications beyond what is listed in the knowledge base.
3. If asked about pricing: NEVER bring up pricing proactively. Only provide pricing information if the visitor explicitly asks for it (e.g. "how much", "cost", "rates", "budget"). Use the approved ranges from the knowledge base (e.g. projects start from $100 depending on scope; full custom builds typically $1,500–$5,000+; emergency fixes $60–$150; audits from $29; retainers from $49/mo). Always end with: "Naveen confirms the exact milestone quote once he understands your scope."
4. If the visitor wants to schedule or book a call:
   - Provide the link ONCE: [Book 15-Min Scoping Call](https://cal.com/naveen-gaur/15min). Do NOT repeat the URL again in the same message.
   - Cal.com automatically converts slots to the visitor's local timezone.
   - Do NOT say "Naveen personally reviews each request to ensure a good fit." Just give the link.
5. HARD RULES — follow these every time:
   a. Give before you take: for technical problems, ask one diagnostic question BEFORE asking for name/email (e.g. "Is it slow on the front end, in wp-admin, or both? Did it start after a plugin update?"). Never collect contact info on the first message.
   b. Respond to urgency: if the prospect uses words like "urgent," "ASAP," "as soon as possible," acknowledge it explicitly and say you're flagging it to Naveen now. Then give the booking link.
   c. Say the pitch once: do not repeat "Naveen specialises in emergency fixes" or any service description more than once in the same conversation.
   d. Verify the email: when a prospect gives their email, your NEXT message must read it back — "Just to confirm — I've noted your email as [email]. Is that correct?"
   e. After confirming email: tell the prospect "I'll also send the booking link to [email] so you have it in your inbox."
   f. Pricing is strictly reactive: NEVER mention prices or budget ranges unless the visitor asks for them.
   g. Never show the Cal.com link more than once per message.
   h. Email correction: if the visitor corrects their email (e.g. "it's X@domain.com", "the correct one is", "I meant", "actually"), acknowledge warmly, confirm the new email by reading it back, and continue. Extract the corrected email into extractedContact.email.
6. If the visitor provides their contact info (name, email, website), acknowledge it and immediately verify the email (rule 5d above).
7. Alternative to a call: if a prospect says they prefer not to do a video call, offer: "Or I can pass a written summary to Naveen and he'll send you a written quote by email — just describe your project in a couple of lines."
8. WhatsApp: only mention it at the end if the prospect asks, as a secondary option: "You can also message Naveen on WhatsApp — though a call is usually faster for diagnosing a technical issue."

IMPORTANT OUTPUT FORMAT:
You MUST respond with a single JSON object with the following schema:
{
  "reply": "Your markdown-formatted message to the visitor",
  "extractedContact": {
    "name": "extracted full name or null",
    "email": "extracted email or null",
    "company": "extracted company or null",
    "website": "extracted URL or null",
    "budget": "extracted budget or null"
  },
  "signals": {
    "hasDefinedScope": boolean,
    "hasBudget": boolean,
    "timelineUnder30Days": boolean,
    "isAgencyRecurring": boolean,
    "isDecisionMaker": boolean,
    "requestsDiscoveryCall": boolean,
    "longTermPotential": boolean
  },
  "bookingIntent": boolean,
  "preferredDates": ["list of mentioned date/time slots if any"]
}`;

    // Format Gemini history
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I will act as Naveen Gaur's AI Sales & Technical Assistant and always return the requested JSON object format." }],
      },
    ];

    // Add previous messages (last 6 messages for context — keeps prompt under token limit)
    const recentMessages = conversation.messages.slice(-6);
    for (const msg of recentMessages) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    let assistantReply = "I'm having a brief moment of trouble — please try sending your message again, or reach out directly at hello@naveengaur.com and Naveen will get back to you.";
    let extractedContact: { name?: string | null; email?: string | null; company?: string | null; website?: string | null; budget?: string | null } = {};
    let signals: LeadScoringSignals = {};
    let bookingIntent = false;
    let preferredDates: string[] = [];

    if (GEMINI_API_KEY) {
      for (const model of GEMINI_MODELS) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(12000),
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 3000,
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 0 },
              },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

            // Robust JSON extraction — Gemini sometimes wraps response in code fences
            // Try 4 methods in sequence until one succeeds
            function tryParseJSON(text: string): Record<string, unknown> | null {
              try { return JSON.parse(text.trim()); } catch { return null; }
            }

            let parsedAI: Record<string, unknown> | null = null;

            // Attempt 1: direct parse (Gemini returns pure JSON)
            parsedAI = tryParseJSON(rawText);

            // Attempt 2: strip ALL code fences (handles ```json...``` and ```...```)
            if (!parsedAI) {
              const fenceStripped = rawText.replace(/```(?:json)?\s*([\s\S]*?)```/g, "$1").trim();
              parsedAI = tryParseJSON(fenceStripped);
              // Attempt 3: extract first {...} block from fence-stripped text
              if (!parsedAI) {
                const m = fenceStripped.match(/\{[\s\S]*\}/);
                if (m) parsedAI = tryParseJSON(m[0]);
              }
            }

            // Attempt 4: extract first {...} block from raw text directly
            if (!parsedAI) {
              const rawMatch = rawText.match(/\{[\s\S]*\}/);
              if (rawMatch) parsedAI = tryParseJSON(rawMatch[0]);
            }

            if (parsedAI) {
              if (parsedAI.reply && typeof parsedAI.reply === "string") {
                assistantReply = parsedAI.reply;
              }
              if (parsedAI.extractedContact) {
                extractedContact = parsedAI.extractedContact as typeof extractedContact;
              }
              if (parsedAI.signals) {
                signals = parsedAI.signals as typeof signals;
              }
              if (parsedAI.bookingIntent !== undefined) {
                bookingIntent = Boolean(parsedAI.bookingIntent);
              }
              if (Array.isArray(parsedAI.preferredDates)) {
                preferredDates = parsedAI.preferredDates as string[];
              }
              break; // Successfully got response, stop model loop!
            } else {
              // All JSON parse attempts failed — check if plain text reply
              const plainText = rawText.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
              if (plainText && !plainText.startsWith("{")) {
                assistantReply = plainText;
                break;
              } else {
                console.warn(`Gemini (${model}) returned unparseable response. Raw:`, rawText.slice(0, 400));
              }
            }
          } else {
            const errText = await res.text().catch(() => "");
            console.warn(`Gemini (${model}) call failed with status ${res.status}:`, errText.slice(0, 200));
            // Loop continues to next model on 429 or other error
          }
        } catch (geminiErr) {
          console.warn(`Gemini (${model}) invocation error:`, geminiErr);
        }
      }
    }

    // 3. Persist messages to conversation
    const userTimestamp = new Date();
    await appendMessageToConversation(conversationId, {
      role: "user",
      content: message,
      timestamp: userTimestamp,
    });

    const assistantTimestamp = new Date();
    await appendMessageToConversation(conversationId, {
      role: "assistant",
      content: assistantReply,
      timestamp: assistantTimestamp,
    });

    // 4. Also check regex for email in the message if not extracted by AI
    if (!extractedContact.email) {
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
      const match = message.match(emailRegex);
      if (match) {
        extractedContact.email = match[1];
      }
    }

    // 5. If email identified, create/update lead in MongoDB
    if (extractedContact.email) {
      const scoreResult = computeLeadScore(signals);
      const lead = await upsertLead({
        conversationId,
        source: "chat_widget",
        email: extractedContact.email,
        name: extractedContact.name || undefined,
        company: extractedContact.company || undefined,
        website: extractedContact.website || undefined,
        budget: extractedContact.budget || undefined,
        leadType: signals.isAgencyRecurring ? "agency" : "direct",
        leadScore: scoreResult,
        status: bookingIntent ? "booking_requested" : "ai_engaging",
        bookingRequest: bookingIntent
          ? {
              status: "requested",
              preferredDates,
              requestedAt: new Date(),
            }
          : undefined,
      });

      if (lead._id) {
        await linkConversationToLead(conversationId, lead._id);
      }

      // Notify Naveen if hot lead or booking request
      if (scoreResult.label === "hot" || bookingIntent) {
        try {
          const subject = bookingIntent
            ? `📅 Meeting Requested via Chat: ${lead.name || lead.email}`
            : `🔥 Hot Lead from Chat (${scoreResult.numeric} pts): ${lead.name || lead.email}`;

          await resend.emails.send({
            from: "Naveen Assistant <onboarding@resend.dev>",
            to: process.env.CONTACT_EMAIL || "naveencg070@gmail.com",
            replyTo: lead.email,
            subject,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0D0D0D; color: #FFFFFF; border-radius: 8px;">
                <h2 style="color: #C4A35A; margin-top: 0;">${subject}</h2>
                <p><strong>Name:</strong> ${lead.name || "Not provided"}</p>
                <p><strong>Email:</strong> <a href="mailto:${lead.email}" style="color: #C4A35A;">${lead.email}</a></p>
                ${lead.website ? `<p><strong>Website:</strong> ${lead.website}</p>` : ""}
                ${lead.budget ? `<p><strong>Budget:</strong> ${lead.budget}</p>` : ""}
                <p><strong>Score:</strong> ${scoreResult.numeric} points (${scoreResult.label.toUpperCase()})</p>
                ${scoreResult.reasons.length ? `<p><strong>Signals:</strong> ${scoreResult.reasons.join(", ")}</p>` : ""}
                ${preferredDates.length ? `<p><strong>Preferred Times:</strong> ${preferredDates.join(", ")}</p>` : ""}
                <hr style="border: 0; border-top: 1px solid #333333; margin: 20px 0;" />
                <h3 style="color: #C4A35A;">Latest Chat Excerpt:</h3>
                <div style="background: #1A1A1A; padding: 12px; border-radius: 6px; font-size: 14px; line-height: 1.5;">
                  <p><strong>User:</strong> ${message}</p>
                  <p><strong>AI Assistant:</strong> ${assistantReply}</p>
                </div>
              </div>
            `,
          });
        } catch (emailErr) {
          console.error("Failed to send hot lead email notification:", emailErr);
        }
      }
    }

    return NextResponse.json({
      conversationId,
      sessionToken,
      reply: assistantReply,
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}

