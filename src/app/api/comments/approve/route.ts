import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { Resend } from "resend";
import { appendApprovedComment, appendReplyToComment } from "@/lib/github-comments";
import type { CommentNode } from "@/lib/github-comments";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

function htmlPage(title: string, message: string, color: string) {
  return new NextResponse(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>
        body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0D0D0D; }
        .card { background: #141414; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 40px 48px; text-align: center; max-width: 480px; }
        h1 { color: #fff; font-size: 22px; margin-bottom: 12px; }
        p { color: rgba(255,255,255,0.55); font-size: 15px; line-height: 1.6; }
        .badge { display: inline-block; padding: 6px 16px; border-radius: 99px; font-size: 13px; font-weight: 600; margin-bottom: 20px; background: ${color}20; color: ${color}; border: 1px solid ${color}40; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">${title}</div>
        <h1>${title}</h1>
        <p>${message}</p>
      </div>
    </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}

export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return htmlPage("Invalid Link", "No token provided.", "#ef4444");
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const { slug, name, email, comment, parentId } = payload as {
      slug: string;
      name: string;
      email: string;
      comment: string;
      parentId?: string;
    };

    if (!slug || !name || !comment) {
      return htmlPage("Invalid Token", "Token is missing required fields.", "#ef4444");
    }

    const approved: CommentNode = {
      id: crypto.randomUUID(),
      name,
      comment,
      date: new Date().toISOString(),
      isAuthor: false,
      replies: [],
    };

    if (parentId) {
      // Nested reply — insert into the correct location in the tree
      await appendReplyToComment(slug, parentId, approved);

      // Email the reader to let them know their reply is live
      try {
        await resend.emails.send({
          from: "Naveen Gaur <onboarding@resend.dev>",
          to: email,
          replyTo: process.env.CONTACT_EMAIL || "hello@naveengaur.com",
          subject: `Your reply on naveengaur.com is now live`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAFAF8; border-radius: 8px;">
              <h2 style="color: #0D0D0D; font-size: 20px; margin-bottom: 8px;">Your reply is live ✅</h2>
              <p style="color: #6A6A6A; font-size: 14px; margin-bottom: 20px;">
                Hi <strong>${name}</strong>, your reply on the article <strong>${slug}</strong> has been approved and is now live on the site.
              </p>
              <a href="https://naveengaur.com/blog/${slug}" style="display: inline-block; background: #C4A35A; color: #0D0D0D; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
                View the conversation →
              </a>
              <p style="margin-top: 28px; font-size: 11px; color: #9A9A9A; border-top: 1px solid #EAEAEA; padding-top: 16px;">
                You are receiving this because you left a comment on naveengaur.com. Reply to this email to reach Naveen directly.
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        // Don't fail the approval if notification email fails
        console.error("Notification email failed:", emailErr);
      }

      return htmlPage(
        "Reply Approved ✅",
        `The reply from <strong>${name}</strong> on <em>${slug}</em> is now live. Vercel will rebuild in ~30–60 seconds.`,
        "#22c55e"
      );
    } else {
      // Top-level comment
      await appendApprovedComment(slug, approved);
      return htmlPage(
        "Comment Approved ✅",
        `The comment from <strong>${name}</strong> on <em>${slug}</em> is now live on the site. Vercel will rebuild in ~30–60 seconds.`,
        "#22c55e"
      );
    }
  } catch (err) {
    console.error("Approve error:", err);
    const isExpired = String(err).includes("expired");
    return htmlPage(
      isExpired ? "Link Expired" : "Error",
      isExpired
        ? "This approval link has expired (7-day limit). The comment was not approved."
        : "Failed to approve comment. Check server logs.",
      "#ef4444"
    );
  }
}
