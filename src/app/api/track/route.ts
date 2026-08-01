import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Pass along the client IP from Vercel headers if available
    const ip = req.headers.get("x-forwarded-for") || "Unknown";
    const userAgent = req.headers.get("user-agent") || "Unknown";
    
    const eventLog = {
      ip,
      userAgent,
      event: body.event, // e.g., 'scroll_depth', 'cta_click'
      page: body.page,
      data: body.data,   // e.g., { depth: 50 } or { link: 'github' }
      timestamp: new Date().toISOString()
    };

    // The Vercel log drain captures this output!
    console.log(`[TRAFFIC_LOG]: ${JSON.stringify(eventLog)}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
