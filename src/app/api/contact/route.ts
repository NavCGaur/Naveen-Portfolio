import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  website: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, website, budget, message } = parsed.data;

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "naveencg070@gmail.com",
      replyTo: email,
      subject: `New enquiry from ${name} — naveengaur.com`,
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
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Budget</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;">${budget}</td>
            </tr>`
                : ""
            }
          </table>

          <div style="margin-top: 24px;">
            <p style="color: #4A4A4A; font-size: 14px; margin-bottom: 8px;">Message:</p>
            <div style="background: white; border: 1px solid #EAEAEA; border-radius: 6px; padding: 16px; color: #0D0D0D; font-size: 14px; line-height: 1.65; white-space: pre-wrap;">${message}</div>
          </div>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #EAEAEA; font-size: 12px; color: #9A9A9A;">
            Sent from naveengaur.com contact form
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
