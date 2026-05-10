import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const commentSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(1000, "Comment must be under 1000 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { slug, name, email, comment } = parsed.data;

    // Create a signed JWT containing all comment data — expires in 7 days
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET!);
    const token = await new SignJWT({ slug, name, email, comment })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // Build approve/archive links pointing back to this Next.js deployment
    const baseUrl = new URL(request.url).origin;
    const approveUrl = `${baseUrl}/api/comments/approve?token=${token}`;
    const archiveUrl = `${baseUrl}/api/comments/archive?token=${token}`;

    // Send notification email with one-click action buttons
    await resend.emails.send({
      from: "Blog Comments <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "hello@naveengaur.com",
      replyTo: email,
      subject: `💬 New comment on: ${slug}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAFAF8; border-radius: 8px;">
          <h2 style="color: #0D0D0D; font-size: 20px; margin-bottom: 4px;">New Comment Pending Approval</h2>
          <p style="color: #6A6A6A; font-size: 13px; margin-bottom: 24px;">Article: <strong>${slug}</strong></p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px; width: 80px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><a href="mailto:${email}" style="color: #C4A35A;">${email}</a></td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <p style="color: #4A4A4A; font-size: 13px; margin-bottom: 8px;">Comment:</p>
            <div style="background: white; border: 1px solid #EAEAEA; border-radius: 6px; padding: 16px; color: #0D0D0D; font-size: 15px; line-height: 1.65; white-space: pre-wrap;">${comment}</div>
          </div>

          <div style="margin-top: 28px; display: flex; gap: 12px;">
            <a href="${approveUrl}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: 600; margin-right: 12px;">
              ✅ Approve Comment
            </a>
            <a href="${archiveUrl}" style="display: inline-block; background: #6A6A6A; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: 600;">
              🗑️ Archive
            </a>
          </div>

          <p style="margin-top: 28px; font-size: 11px; color: #9A9A9A; border-top: 1px solid #EAEAEA; padding-top: 16px;">
            Approval links expire in 7 days. Sent from naveengaur.com
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Comment submit error:", error);
    return NextResponse.json({ error: "Failed to submit comment. Please try again." }, { status: 500 });
  }
}
