import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dns from "dns";
import { promisify } from "util";

export const maxDuration = 60;

const lookup = promisify(dns.lookup);
const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;
const PAGESPEED_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

const auditRequestSchema = z.object({
  url: z.string().url("Please enter a valid website URL"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

// SSRF guard: block private/loopback IPs
async function isSafeUrl(targetUrl: string): Promise<boolean> {
  try {
    const urlObj = new URL(targetUrl);
    const hostname = urlObj.hostname;

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return false;
    }

    const { address } = await lookup(hostname);
    const parts = address.split(".").map(Number);
    if (parts[0] === 10) return false;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
    if (parts[0] === 192 && parts[1] === 168) return false;
    if (parts[0] === 169 && parts[1] === 254) return false;

    return true;
  } catch {
    return false;
  }
}

// In-memory rate limiter: 2 audits per IP per 24h
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 86400000 });
    return true;
  }
  if (now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 86400000 });
    return true;
  }
  if (entry.count >= 2) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    if (!PAGESPEED_API_KEY) {
      console.error("Missing PAGESPEED_API_KEY env variable");
      return NextResponse.json(
        { error: "PageSpeed API key is not configured on the server." },
        { status: 500 }
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 2 audits per 24 hours per IP." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = auditRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input. " + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const { url, name, email } = parsed.data;
    const cleanUrl = url.trim().replace(/\/$/, "");

    if (!(await isSafeUrl(cleanUrl))) {
      return NextResponse.json(
        { error: "Access to private or local network addresses is forbidden." },
        { status: 400 }
      );
    }

    const urlObj = new URL(cleanUrl);
    const origin = urlObj.origin;

    // Fetch all data in parallel
    const [htmlRes, robotsRes, llmsRes, psRes] = await Promise.all([
      fetch(cleanUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(15000),
      })
        .then(async (res) => {
          if (!res.ok) return null;
          const html = await res.text();
          return { ok: true, headers: res.headers, html };
        })
        .catch(() => null),

      fetch(`${origin}/robots.txt`, {
        signal: AbortSignal.timeout(5000),
      })
        .then(async (res) => {
          if (!res.ok) return null;
          const text = await res.text();
          return { ok: true, text };
        })
        .catch(() => null),

      fetch(`${origin}/llms.txt`, {
        signal: AbortSignal.timeout(5000),
      })
        .then(async (res) => {
          if (res.ok) {
            await res.text();
            return true;
          }
          return false;
        })
        .catch(() => false),

      fetch(
        `${PAGESPEED_ENDPOINT}?url=${encodeURIComponent(cleanUrl)}&category=performance&category=seo&category=best-practices&category=accessibility&key=${PAGESPEED_API_KEY}`,
        { signal: AbortSignal.timeout(48000) }
      ).catch(() => null),
    ]);

    // --- HTML Analysis ---
    let cachingActive = false;
    let pageBuilder: string = "None";
    let pluginCount = 0;
    const schemaTypes: string[] = [];

    if (htmlRes && htmlRes.ok) {
      const headers = htmlRes.headers;
      cachingActive =
        headers.has("x-litespeed-cache") ||
        headers.has("x-litespeed-cache-control") ||
        headers.has("wp-super-cache") ||
        (headers.get("x-cache")?.toLowerCase().includes("hit") ?? false) ||
        headers.get("cf-cache-status")?.toLowerCase() === "hit" ||
        (headers.get("cache-control")?.toLowerCase().includes("max-age") ?? false);

      const html = htmlRes.html;

      if (html.includes("elementor-")) pageBuilder = "Elementor";
      else if (html.includes("wp-content/themes/divi")) pageBuilder = "Divi";
      else if (html.includes("js_composer") || html.includes("wpb-js-composer")) pageBuilder = "WPBakery";
      else if (html.includes("wp-block-") || html.includes("wp-includes/css/dist/block-library")) pageBuilder = "Gutenberg";
      else if (html.includes("wp-content")) pageBuilder = "Unknown";

      const pluginMatches = html.match(/wp-content\/plugins\/([^/]+)\//g);
      if (pluginMatches) {
        pluginCount = new Set(pluginMatches.map((p) => p.split("/")[2])).size;
      }

      const schemaScripts = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
      if (schemaScripts) {
        for (const script of schemaScripts) {
          try {
            const content = script.replace(/<script[^>]*>|<\/script>/gi, "").trim();
            const extractTypes = (obj: unknown): void => {
              if (obj && typeof obj === "object") {
                const rec = obj as Record<string, unknown>;
                if (typeof rec["@type"] === "string") schemaTypes.push(rec["@type"]);
                Object.values(rec).forEach(extractTypes);
              }
            };
            extractTypes(JSON.parse(content));
          } catch {
            // skip invalid JSON
          }
        }
      }
    }

    // --- Robots.txt Analysis ---
    let aiRobotsAllowed = true;
    if (robotsRes && robotsRes.ok) {
      const text = robotsRes.text;
      const lines = text.split("\n").map((l) => l.trim().toLowerCase());
      let trackingAI = false;
      for (const line of lines) {
        if (line.startsWith("user-agent:")) {
          const agent = line.replace("user-agent:", "").trim();
          trackingAI = ["gptbot", "claudebot", "perplexitybot", "*"].includes(agent);
        }
        if (trackingAI && line.startsWith("disallow:")) {
          const rule = line.replace("disallow:", "").trim();
          if (rule === "/" || rule === "") {
            aiRobotsAllowed = false;
          }
        }
      }
    }

    const llmsTxtPresent = robotsRes != null && (llmsRes ?? false);

    // --- PageSpeed Analysis ---
    if (!psRes?.ok) {
      return NextResponse.json(
        { error: "The audit is taking longer than usual due to high traffic. Please try again in a few moments." },
        { status: 502 }
      );
    }

    const psData = await psRes.json();
    const lh = psData.lighthouseResult ?? {};
    const cats = lh.categories ?? {};
    const audits = lh.audits ?? {};

    const performance = Math.round((cats.performance?.score ?? 0) * 100);
    const seo = Math.round((cats.seo?.score ?? 0) * 100);
    const bestPractices = Math.round((cats["best-practices"]?.score ?? 0) * 100);
    const accessibility = Math.round((cats.accessibility?.score ?? 0) * 100);

    const ttfb = Math.round(audits["server-response-time"]?.numericValue ?? 0);
    const fcp = parseFloat(((audits["first-contentful-paint"]?.numericValue ?? 0) / 1000).toFixed(2));
    const lcp = parseFloat(((audits["largest-contentful-paint"]?.numericValue ?? 0) / 1000).toFixed(2));
    const tbt = Math.round(audits["total-blocking-time"]?.numericValue ?? 0);
    const cls = parseFloat((audits["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(3));
    const loadTime = parseFloat(((audits["speed-index"]?.numericValue ?? 0) / 1000).toFixed(2));

    const networkItems: Array<{ transferSize?: number }> =
      audits["network-requests"]?.details?.items ?? [];
    const pageSize = parseFloat(
      (networkItems.reduce((acc, r) => acc + (r.transferSize ?? 0), 0) / 1048576).toFixed(2)
    );

    // Assemble report inline — no storage needed
    const report = {
      url: cleanUrl,
      name,
      email,
      metrics: { performance, seo, bestPractices, accessibility },
      details: {
        ttfb, loadTime, lcp, fcp, tbt, cls, pageSize,
        pageBuilder, pluginCount, cachingActive,
        schemaTypes: Array.from(new Set(schemaTypes)),
        aiRobotsAllowed,
        llmsTxtPresent,
      },
    };

    console.log(`Audit complete for ${cleanUrl} | Perf: ${performance} | SEO: ${seo}`);

    return NextResponse.json({ success: true, report }, { status: 200 });
  } catch (err) {
    console.error("Audit API critical error:", err);
    return NextResponse.json(
      { error: "Server error while running audit. Please try again." },
      { status: 500 }
    );
  }
}
