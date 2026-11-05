import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { upsertLead } from "@/lib/leads";
import { computeLeadScore } from "@/lib/lead-scoring";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  website: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

async function generatePersonalizedAcknowledgement(name: string, message: string, website?: string): Promise<string> {
  const defaultAck = `Hi ${name},\n\nThank you for reaching out through my website. I have received your enquiry regarding your project${website ? ` (${website})` : ""}.\n\nI am reviewing your details and will get back to you shortly to discuss how we can best tackle this together and arrange a time to connect.\n\nBest regards,\nNaveen Gaur\nSenior WordPress & Web Developer\nnaveengaur.com`;

  if (!GEMINI_API_KEY) return defaultAck;

  try {
    const prompt = `You are writing a professional, personalized confirmation email on behalf of Naveen Gaur (senior WordPress & full-stack developer at naveengaur.com) to a prospective client who just submitted an inquiry.

Client Name: ${name}
Client Website: ${website || "Not provided"}
Client Message:
${message}

Guidelines:
1. Warm, professional, consultative tone.
2. Acknowledge their specific problem or project type directly (e.g. WooCommerce checkout, speed optimization, new custom theme, ongoing maintenance) so they know it was read.
3. If they left out key context (like their current host, tech stack, or deadline), ask one gentle, relevant follow-up question.
4. If the message indicates they want to discuss or schedule a call, mention that they can request a 15-minute scoping call (held over Google Meet with slots converted to their local timezone) directly at https://cal.com/naveengaur/15min. Naveen reviews and approves each booking personally. Otherwise, say that Naveen will review their requirements and reach out shortly.
5. Sign off as:
Best regards,
Naveen Gaur
Senior WordPress & Web Developer
naveengaur.com

Output plain text email body only (no Markdown formatting like asterisks or hashtags, no subject line).`;

    const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generated && generated.trim().length > 50) {
        return generated.trim();
      }
    }
  } catch (err) {
    console.error("Gemini acknowledgement generation error:", err);
  }

  return defaultAck;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data: any = {};
    let isFormUrlEncoded = false;

    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      isFormUrlEncoded = true;
      const formData = await request.formData();
      const rawData = Object.fromEntries(formData.entries());

      let nameVal = (rawData.name as string) || "";
      if (!nameVal.trim()) {
        if (rawData.type === "migration_request") {
          nameVal = "Migration Client";
        } else if (rawData.email) {
          nameVal = (rawData.email as string).split("@")[0];
        } else {
          nameVal = "Website Client";
        }
      }

      const websiteVal = (rawData.website || rawData.url || "") as string;
      const budgetVal = (rawData.budget || rawData.volume || rawData.traffic || rawData.host || "") as string;

      const messageParts = [
        rawData.message as string,
        rawData.company ? `Company: ${rawData.company}` : "",
        rawData.current_host ? `Current Host: ${rawData.current_host}` : "",
        rawData.new_host ? `New Host: ${rawData.new_host}` : "",
        rawData.type ? `Inquiry Type: ${rawData.type}` : "",
      ];
      const messageVal = messageParts.filter(Boolean).join("\n");

      data = {
        name: nameVal,
        email: rawData.email,
        website: websiteVal || undefined,
        budget: budgetVal || undefined,
        message: messageVal,
      };
    } else {
      data = await request.json();
    }

    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      if (isFormUrlEncoded) {
        const referer = request.headers.get("referer") || "/";
        const redirectUrl = new URL(referer);
        redirectUrl.searchParams.set("status", "error");
        return NextResponse.redirect(redirectUrl.toString().split("#")[0] + "#audit", 303);
      }
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, website, budget, message } = parsed.data;

    // 1. Compute lead score
    const isAgency = Boolean(data.company || /agency|partner|white-label/i.test(message));
    const scoreResult = computeLeadScore({
      hasDefinedScope: message.length > 30,
      hasBudget: Boolean(budget),
      isAgencyRecurring: isAgency,
      timelineUnder30Days: /asap|immediately|this month|urgent|week/i.test(message),
      requestsDiscoveryCall: /call|meeting|speak|zoom/i.test(message),
    });

    // 2. Persist lead to MongoDB
    try {
      await upsertLead({
        name,
        email,
        website,
        budget,
        message,
        source: isFormUrlEncoded ? "contact_form" : "agency_form",
        leadType: isAgency ? "agency" : "direct",
        leadScore: scoreResult,
        status: "new",
      });
    } catch (dbErr) {
      console.error("Failed to save lead to MongoDB:", dbErr);
    }

    // 3. Send internal notification email to Naveen
    const subjectPrefix = scoreResult.label === "hot" ? "🔥 [HOT LEAD] " : "";
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "naveencg070@gmail.com",
      replyTo: email,
      subject: `${subjectPrefix}New enquiry from ${name} (${scoreResult.numeric} pts) — naveengaur.com`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAFAF8; border-radius: 8px;">
          <h2 style="color: #0D0D0D; font-size: 22px; margin-bottom: 24px;">New Portfolio Enquiry</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px; width: 120px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><a href="mailto:${email}" style="color: #C4A35A;">${email}</a></td>
            </tr>
            ${
              website
                ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Website</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><a href="${website}" style="color: #C4A35A;">${website}</a></td>
            </tr>`
                : ""
            }
            ${
              budget
                ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Budget / Detail</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;">${budget}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Lead Score</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;">
                <strong>${scoreResult.numeric} points (${scoreResult.label.toUpperCase()})</strong>
                ${scoreResult.reasons.length ? `<br/><span style="font-size: 12px; color: #777;">${scoreResult.reasons.join(", ")}</span>` : ""}
              </td>
            </tr>
          </table>

          <div style="margin-top: 24px;">
            <p style="color: #4A4A4A; font-size: 14px; margin-bottom: 8px;">Message details:</p>
            <div style="background: white; border: 1px solid #EAEAEA; border-radius: 6px; padding: 16px; color: #0D0D0D; font-size: 14px; line-height: 1.65; white-space: pre-wrap;">${message}</div>
          </div>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #EAEAEA; font-size: 12px; color: #9A9A9A;">
            Sent from naveengaur.com contact form · Stored in MongoDB Atlas
          </div>
        </div>
      `,
    });

    // 4. Send personalized AI acknowledgement email to prospect
    try {
      const ackBody = await generatePersonalizedAcknowledgement(name, message, website);
      await resend.emails.send({
        from: "Naveen Gaur <onboarding@resend.dev>",
        to: email,
        replyTo: process.env.CONTACT_EMAIL || "hello@naveengaur.com",
        subject: `Thank you for contacting Naveen Gaur`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FFFFFF; color: #111111; line-height: 1.6; border: 1px solid #EAEAEA; border-radius: 8px;">
            <div style="white-space: pre-wrap; font-size: 15px;">${ackBody}</div>
            <hr style="border: 0; border-top: 1px solid #EAEAEA; margin: 28px 0;" />
            <p style="font-size: 12px; color: #888888; margin: 0;">
              Naveen Gaur · Senior WordPress & Full-Stack Developer · <a href="https://naveengaur.com" style="color: #C4A35A; text-decoration: none;">naveengaur.com</a>
            </p>
          </div>
        `,
      });
    } catch (ackErr) {
      console.error("Failed to send prospect acknowledgement email:", ackErr);
    }

    if (isFormUrlEncoded) {
      const referer = request.headers.get("referer") || "/";
      const redirectUrl = new URL(referer);
      redirectUrl.searchParams.set("status", "success");
      return NextResponse.redirect(redirectUrl.toString().split("#")[0] + "#audit", 303);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    const contentType = request.headers.get("content-type") || "";
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const referer = request.headers.get("referer") || "/";
      const redirectUrl = new URL(referer);
      redirectUrl.searchParams.set("status", "error");
      return NextResponse.redirect(redirectUrl.toString().split("#")[0] + "#audit", 303);
    }
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
