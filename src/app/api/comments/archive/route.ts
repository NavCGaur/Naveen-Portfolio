import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { appendArchivedComment } from "@/lib/github-comments";

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
    return htmlPage("Invalid Link", "No token provided.", "#6A6A6A");
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const { slug, name, email, comment } = payload as {
      slug: string;
      name: string;
      email: string;
      comment: string;
    };

    if (!slug || !name || !comment) {
      return htmlPage("Invalid Token", "Token is missing required fields.", "#ef4444");
    }

    // Archive includes email (for your reference only — this file is private)
    await appendArchivedComment({
      id: crypto.randomUUID(),
      slug,
      name,
      email,
      comment,
      date: new Date().toISOString(),
      isAuthor: false,
      replies: [],
    });

    return htmlPage(
      "Comment Archived 🗑️",
      `The comment from <strong>${name}</strong> on <em>${slug}</em> has been archived. It will not appear on the site.`,
      "#C4A35A"
    );
  } catch (err) {
    console.error("Archive error:", err);
    const isExpired = String(err).includes("expired");
    return htmlPage(
      isExpired ? "Link Expired" : "Error",
      isExpired
        ? "This archive link has expired (7-day limit)."
        : "Failed to archive comment. Check server logs.",
      "#ef4444"
    );
  }
}
