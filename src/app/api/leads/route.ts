import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { upsertLead, findLeadByEmail } from "@/lib/leads";
import { computeLeadScore } from "@/lib/lead-scoring";

const leadSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Valid email required"),
  company: z.string().optional(),
  website: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  source: z.enum(["agency_form", "chat_widget", "email_reply", "contact_form"]).optional(),
  conversationId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const score = computeLeadScore({
      hasDefinedScope: Boolean(data.message && data.message.length > 20),
      hasBudget: Boolean(data.budget),
      isAgencyRecurring: Boolean(data.company || (data.message && /agency|partner/i.test(data.message))),
    });

    const lead = await upsertLead({
      email: data.email,
      name: data.name,
      company: data.company,
      website: data.website,
      budget: data.budget,
      message: data.message,
      source: data.source || "agency_form",
      conversationId: data.conversationId,
      leadScore: score,
      status: "new",
    });

    return NextResponse.json({ success: true, lead }, { status: 200 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
