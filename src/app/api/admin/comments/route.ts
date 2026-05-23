import { NextRequest, NextResponse } from "next/server";
import { readApprovedComments } from "@/lib/github-comments";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const expectedToken = `Bearer ${process.env.ADMIN_SECRET}`;
  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const comments = readApprovedComments(slug);
  return NextResponse.json(comments);
}
