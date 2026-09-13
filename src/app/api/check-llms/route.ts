import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const site = searchParams.get("site");

  if (!site) {
    return NextResponse.json({ error: "Missing site parameter" }, { status: 400 });
  }

  // Normalize: strip trailing slash, ensure https
  let base = site.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(base)) {
    base = "https://" + base;
  }

  const url = `${base}/llms.txt`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "LlmsTxtChecker/1.0 (naveengaur.com)",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    const contentType = response.headers.get("content-type") ?? "";
    const isPlainText = contentType.includes("text/plain") || contentType.includes("text/");

    if (response.ok && isPlainText) {
      // Read first 500 chars to confirm it's not an HTML 404 page served with 200
      const body = await response.text();
      const snippet = body.slice(0, 500).trim();
      const looksLikeHtml = /<(!DOCTYPE|html|head|body)/i.test(snippet);

      if (looksLikeHtml) {
        return NextResponse.json({ found: false, status: response.status, url });
      }

      return NextResponse.json({
        found: true,
        status: response.status,
        url,
        preview: snippet,
      });
    }

    // 2xx but not plain text → likely HTML / wrong content
    if (response.ok) {
      const body = await response.text();
      const snippet = body.slice(0, 300).trim();
      const looksLikeHtml = /<(!DOCTYPE|html|head|body)/i.test(snippet);
      return NextResponse.json({
        found: !looksLikeHtml,
        status: response.status,
        url,
        preview: !looksLikeHtml ? snippet.slice(0, 500) : undefined,
      });
    }

    return NextResponse.json({ found: false, status: response.status, url });
  } catch (err: any) {
    const isTimeout = err?.name === "AbortError";
    return NextResponse.json(
      { found: false, error: isTimeout ? "Request timed out" : "Could not reach site", url },
      { status: 200 }
    );
  }
}
