import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

const optinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = optinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Send confirmation & link directly to recipient email to prevent spam/fake email entries
    const guideUrl = "https://naveengaur.com/guides/non-technical-blog-writing?access=granted";

    const { data: guideData, error: guideError } = await resend.emails.send({
      from: "Naveen Gaur <hello@send.naveengaur.com>",
      to: email,
      subject: "Your Non-Technical Blog Writing Guide — naveengaur.com",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAFAF8; border-radius: 8px; color: #0D0D0D;">
          <h2 style="color: #0D0D0D; font-size: 22px; margin-bottom: 16px;">Here is your Blog Writing Guide</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #4A4A4A;">
            Thank you for requesting <strong>The Blog Writing Guide for Non-Technical Clients</strong>.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #4A4A4A;">
            This guide will help you write authentic content that ranks on Google without stressing over keyword density or technical SEO details.
          </p>
          <div style="margin: 32px 0;">
            <a href="${guideUrl}" style="background: #C4A35A; color: #0D0D0D; padding: 14px 28px; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 14px; display: inline-block;">
              Read the Blog Writing Guide →
            </a>
          </div>
          <p style="font-size: 13px; color: #777; line-height: 1.5;">
            If the button above does not work, copy and paste this link into your browser:<br/>
            <a href="${guideUrl}" style="color: #C4A35A;">${guideUrl}</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #EAEAEA; margin: 32px 0 16px 0;" />
          <p style="font-size: 12px; color: #9A9A9A; margin: 0;">
            Naveen Gaur — WordPress Development, Technical SEO & Content Systems
          </p>
        </div>
      `,
    });

    if (guideError) {
      console.error("Resend primary guide email failed:", guideError);
      return NextResponse.json(
        { error: guideError.message || "Failed to send guide email via Resend" },
        { status: 400 }
      );
    }

    // Also alert site owner of new lead capture
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Portfolio Lead <leads@send.naveengaur.com>",
        to: process.env.CONTACT_EMAIL || "hello@naveengaur.com",
        subject: `New Lead: Blog Writing Guide unlocked by ${email}`,
        html: `<p>New subscriber requested the Blog Writing Guide: <strong>${email}</strong></p>`,
      }).catch((err) => {
        console.warn("Resend owner notification failed:", err);
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Guide opt-in error:", error);
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}
