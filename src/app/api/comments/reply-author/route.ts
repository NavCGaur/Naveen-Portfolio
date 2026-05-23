import { NextRequest, NextResponse } from "next/server";
import { appendReplyToComment, appendApprovedComment } from "@/lib/github-comments";
import type { CommentNode } from "@/lib/github-comments";

export async function POST(request: NextRequest) {
  // Verify admin secret via Authorization header
  const authHeader = request.headers.get("Authorization");
  const expectedToken = `Bearer ${process.env.ADMIN_SECRET}`;
  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, parentId, comment } = body as {
      slug: string;
      parentId?: string;
      comment: string;
    };

    if (!slug || !comment || comment.trim().length < 2) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reply: CommentNode = {
      id: crypto.randomUUID(),
      name: "Naveen",
      comment: comment.trim(),
      date: new Date().toISOString(),
      isAuthor: true,
      replies: [],
    };

    if (parentId) {
      await appendReplyToComment(slug, parentId, reply);
    } else {
      // Author posting a top-level comment (edge case)
      await appendApprovedComment(slug, reply);
    }

    return NextResponse.json({ success: true, id: reply.id }, { status: 200 });
  } catch (error) {
    console.error("Author reply error:", error);
    return NextResponse.json({ error: "Failed to post reply." }, { status: 500 });
  }
}
