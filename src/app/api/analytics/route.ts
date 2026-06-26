import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/analytics
 *
 * Proxies requests to the Oracle VPS analytics server.
 * The VPS server is at ANALYTICS_VPS_URL (e.g. http://80.225.210.41:8787)
 * and requires an X-Analytics-Key header.
 *
 * Query params forwarded:
 *   site   — e.g. naveengaur.com
 *   period — 24h | 7d | 30d
 */
export async function GET(req: NextRequest) {
  const vpsUrl = process.env.ANALYTICS_VPS_URL;
  const apiKey = process.env.ANALYTICS_API_KEY;

  if (!vpsUrl || !apiKey) {
    return NextResponse.json(
      {
        error: "Analytics server not configured",
        hint: "Set ANALYTICS_VPS_URL and ANALYTICS_API_KEY in .env.local",
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const site = searchParams.get("site") || "naveengaur.com";
  const period = searchParams.get("period") || "7d";

  const upstream = `${vpsUrl}/api/analytics?site=${encodeURIComponent(site)}&period=${encodeURIComponent(period)}`;

  try {
    const res = await fetch(upstream, {
      headers: {
        "X-Analytics-Key": apiKey,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: `VPS returned ${res.status}`, detail: body },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const isTimeout =
      message.toLowerCase().includes("timeout") ||
      message.toLowerCase().includes("abort");

    return NextResponse.json(
      {
        error: isTimeout
          ? "VPS request timed out"
          : "Failed to reach analytics server",
        detail: message,
        hint: isTimeout
          ? "The VPS may be overloaded or unreachable. Check if analytics_server.py is running."
          : "Check ANALYTICS_VPS_URL and that port 8787 is open in Oracle Cloud security list.",
      },
      { status: 502 }
    );
  }
}
