import { NextRequest, NextResponse } from "next/server";
import { listAudits } from "@/lib/github-audits";

/**
 * GET /api/private/audits
 * Returns all audit reports from GitHub (newest-first).
 * No auth — route security is through URL obscurity.
 */
export async function GET() {
  try {
    const audits = await listAudits();
    return NextResponse.json({ audits, count: audits.length });
  } catch (err) {
    console.error("Error in /api/private/audits:", err);
    return NextResponse.json({ error: "Failed to fetch audits" }, { status: 500 });
  }
}

/**
 * POST /api/private/audits
 * Trigger a new audit run from the admin dashboard (URL-only mode, no email required).
 * Proxies to the main /api/audit endpoint with admin flag.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Forward to the main audit API with admin bypass
    const host = req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const auditUrl = `${proto}://${host}/api/audit`;

    const auditRes = await fetch(auditUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass through the real IP so rate limiting works
        "x-forwarded-for": req.headers.get("x-forwarded-for") || "127.0.0.1",
        // Admin bypass marker — rate limit check will skip for 127.0.0.1
        "x-admin": "1",
      },
      body: JSON.stringify({
        url,
        name: "Admin",
        email: process.env.CONTACT_EMAIL || "admin@naveengaur.com",
      }),
      signal: AbortSignal.timeout(125_000), // audit can take up to 120s
    });

    const data = await auditRes.json();
    return NextResponse.json(data, { status: auditRes.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
