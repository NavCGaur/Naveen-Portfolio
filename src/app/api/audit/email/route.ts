import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

const emailRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  url: z.string().url("Invalid website URL"),
  reportLink: z.string().url("Invalid report link"),
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service is not configured on the server." }, { status: 500 });
    }

    const body = await request.json();
    const parsed = emailRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const { email, url, reportLink } = parsed.data;

    // Send email using Resend
    const result = await resend.emails.send({
      from: "Website Audit Portal <onboarding@resend.dev>",
      to: [email],
      subject: `Your Website Growth Opportunity Report for ${new URL(url).hostname}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAFAF8; border: 1px solid #E2E8F0; border-radius: 8px; color: #0D0D0D;">
          <h2 style="color: #725921; font-size: 20px; margin-top: 0; font-weight: bold; border-bottom: 1px solid #E2E8F0; padding-bottom: 16px;">
            Growth Opportunity Report
          </h2>
          <p style="font-size: 15px; line-height: 1.6; color: #1E293B;">
            Here is the link to your interactive website audit and conversion report. You can review your speed metrics, trust signals, and AI readiness at any time:
          </p>
          
          <div style="margin: 28px 0; text-align: center;">
            <a href="${reportLink}" target="_blank" style="background-color: #C4A35A; color: #0D0D0D; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 4px; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em;">
              View Report Online
            </a>
          </div>

          <p style="font-size: 13.5px; line-height: 1.5; color: #475569;">
            <strong>Target Site:</strong> <a href="${url}" target="_blank" style="color: #C4A35A; text-decoration: underline;">${url}</a><br />
            <strong>Link:</strong> <a href="${reportLink}" target="_blank" style="color: #C4A35A; text-decoration: underline;">${reportLink}</a>
          </p>

          <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 28px 0;" />

          <p style="font-size: 13px; line-height: 1.6; color: #475569; margin-bottom: 0;">
            Best regards,<br />
            <strong>Naveen Gaur</strong><br />
            WordPress & Full-Stack Developer<br />
            <a href="mailto:hello@naveengaur.com" style="color: #C4A35A; text-decoration: none;">hello@naveengaur.com</a>
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Resend send failed:", result.error);
      return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in email audit route:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
