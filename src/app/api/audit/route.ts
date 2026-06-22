import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dns from "dns";
import { promisify } from "util";
import crypto from "crypto";
import { Resend } from "resend";
import { saveAudit, AuditReport } from "@/lib/github-audits";

const resend = new Resend(process.env.RESEND_API_KEY);

export const maxDuration = 60;

const lookup = promisify(dns.lookup);
const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const PAGESPEED_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const auditRequestSchema = z.object({
  url: z.string().url("Please enter a valid website URL"),
  name: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
});

// SSRF guard: block private/loopback IPs
async function checkUrlSafety(targetUrl: string): Promise<{ safe: boolean; reason?: "invalid" | "private" | "dns_failed" }> {
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
      return { safe: false, reason: "private" };
    }
    let address: string;
    try {
      const res = await lookup(hostname);
      address = res.address;
    } catch {
      return { safe: false, reason: "dns_failed" };
    }
    const parts = address.split(".").map(Number);
    if (parts[0] === 10) return { safe: false, reason: "private" };
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return { safe: false, reason: "private" };
    if (parts[0] === 192 && parts[1] === 168) return { safe: false, reason: "private" };
    if (parts[0] === 169 && parts[1] === 254) return { safe: false, reason: "private" };
    return { safe: true };
  } catch {
    return { safe: false, reason: "invalid" };
  }
}

// In-memory rate limiter: 2 audits per IP per 24h
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) { rateLimitMap.set(ip, { count: 1, resetTime: now + 86400000 }); return true; }
  if (now > entry.resetTime) { rateLimitMap.set(ip, { count: 1, resetTime: now + 86400000 }); return true; }
  if (entry.count >= 2) return false;
  entry.count += 1;
  return true;
}

// Parse RSS/Atom feed XML to extract pubDates
function parseRssDates(xml: string): Date[] {
  const dates: Date[] = [];
  // Try RSS <pubDate> and Atom <published>/<updated>
  const matches = xml.matchAll(/<(?:pubDate|published|updated)>([^<]+)<\/(?:pubDate|published|updated)>/gi);
  for (const m of matches) {
    const d = new Date(m[1].trim());
    if (!isNaN(d.getTime())) dates.push(d);
  }
  return dates.sort((a, b) => b.getTime() - a.getTime()); // newest first
}

function daysBetween(a: Date, b: Date): number {
  return Math.abs((a.getTime() - b.getTime()) / 86400000);
}

interface GeminiAnalysisResponse {
  businessCategory: "local-service" | "professional-service" | "ecommerce" | "content-saas";
  executiveSummary: string;
  observations: Array<{ title: string; body: string }>;
}

async function generateAiAnalysis(
  summary: Record<string, unknown>
): Promise<GeminiAnalysisResponse | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const prompt = `You are a senior digital consultant reviewing a website audit.
Analyze the following website findings and output exactly one JSON object.
JSON Keys to include:
1. "businessCategory": MUST be exactly one of: "local-service", "professional-service", "ecommerce", or "content-saas". Choose based on the business name, URL, and metadata provided.
2. "executiveSummary": Write a 3 to 4 sentence executive summary aimed at a non-technical founder.
   CRITICAL rules for executiveSummary:
   - Base it ONLY on the provided findings.
   - Do NOT assume, estimate, or state anything about customer/revenue loss or website traffic.
   - Do NOT invent or speculate about the business background, goals, or historical outcomes.
   - Strictly summarize the observed facts regarding page speed, caching, testimonials count, blog rhythm, and AI access.
3. "observations": Exactly 3 short business observations (2-3 sentences each) connecting related findings.
   Rules for observations:
   - Never mention revenue loss or customer loss.
   - Never use technical jargon (do not write LCP, TBT, schema, robots.txt, llms.txt).
   - Frame everything as opportunities, not problems.
   - Use second-person ("your website", "your business").

Website findings:
${JSON.stringify(summary, null, 2)}

Output ONLY a valid JSON object matching this schema:
{
  "businessCategory": "local-service" | "professional-service" | "ecommerce" | "content-saas",
  "executiveSummary": "...",
  "observations": [{"title":"...","body":"..."}]
}`;

    const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 800 },
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.businessCategory === "string" &&
      typeof parsed.executiveSummary === "string" &&
      Array.isArray(parsed.observations)
    ) {
      return {
        businessCategory: parsed.businessCategory as any,
        executiveSummary: parsed.executiveSummary,
        observations: parsed.observations.slice(0, 3),
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function sendAuditErrorEmail(url: string, name: string, email: string, errorMsg: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({
      from: "Audit System Alert <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL || "hello@naveengaur.com", "naveencg070@gmail.com"],
      subject: `🚨 ALERT: Website Audit Error for ${url || "Unknown URL"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FFF5F5; border: 2px solid #E53E3E; border-radius: 8px;">
          <h2 style="color: #E53E3E; font-size: 20px; margin-bottom: 16px; font-weight: bold;">Audit Error Encountered</h2>
          <p style="color: #2D3748; font-size: 15px; line-height: 1.6;">
            A user encountered a failure while attempting to run an audit. Details are below:
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #FED7D7; color: #4A5568; font-size: 14px; font-weight: bold; width: 120px;">Client Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #FED7D7; color: #1A202C; font-size: 14px;">${name || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #FED7D7; color: #4A5568; font-size: 14px; font-weight: bold;">Client Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #FED7D7; color: #1A202C; font-size: 14px;"><a href="mailto:${email || ""}">${email || "N/A"}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #FED7D7; color: #4A5568; font-size: 14px; font-weight: bold;">Website URL</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #FED7D7; color: #1A202C; font-size: 14px;"><a href="${url || "#"}" target="_blank">${url || "N/A"}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #FED7D7; color: #4A5568; font-size: 14px; font-weight: bold;">Error Message</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #FED7D7; color: #E53E3E; font-size: 14px; font-weight: bold;">${errorMsg}</td>
            </tr>
          </table>

          <div style="font-size: 12px; color: #718096; border-top: 1px solid #FED7D7; padding-top: 16px;">
            Sent automatically from naveengaur.com audit portal
          </div>
        </div>
      `
    });
  } catch (e) {
    console.error("Failed to send error alert email:", e);
  }
}

export async function POST(request: NextRequest) {
  let url = "";
  let name = "";
  let email = "";

  try {
    if (!PAGESPEED_API_KEY) {
      return NextResponse.json({ error: "PageSpeed API key is not configured on the server." }, { status: 500 });
    }

    try {
      const body = await request.json();
      const parsed = auditRequestSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input. " + parsed.error.issues[0]?.message }, { status: 400 });
      }
      url = parsed.data.url;
      name = parsed.data.name || "Anonymous Visitor";
      email = parsed.data.email || "anonymous@naveengaur.com";
    } catch {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      await sendAuditErrorEmail(url, name, email, "Rate limit exceeded (Max 2 audits per 24 hours per IP)");
      return NextResponse.json({ error: "Rate limit exceeded. Maximum 2 audits per 24 hours per IP." }, { status: 429 });
    }

    const cleanUrl = url.trim().replace(/\/$/, "");
    const safety = await checkUrlSafety(cleanUrl);
    if (!safety.safe) {
      if (safety.reason === "dns_failed") {
        return NextResponse.json(
          { error: "This website domain could not be resolved. Please verify the spelling and try again." },
          { status: 400 }
        );
      }
      if (safety.reason === "private") {
        await sendAuditErrorEmail(cleanUrl, name, email, "Access to private or local network addresses forbidden (SSRF Block)");
        return NextResponse.json({ error: "Access to private or local network addresses is forbidden." }, { status: 400 });
      }
      return NextResponse.json({ error: "Please enter a valid website URL." }, { status: 400 });
    }

    const urlObj = new URL(cleanUrl);
    const origin = urlObj.origin;

    // ── Fetch all data in parallel ──────────────────────────────────────────
    const [htmlRes, robotsRes, llmsRes, psRes, rssRes] = await Promise.all([
      fetch(cleanUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
        signal: AbortSignal.timeout(15000),
      }).then(async (res) => {
        if (!res.ok) return null;
        const html = await res.text();
        return { ok: true, headers: res.headers, html };
      }).catch(() => null),

      fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(5000) })
        .then(async (res) => { if (!res.ok) return null; return { ok: true, text: await res.text() }; })
        .catch(() => null),

      fetch(`${origin}/llms.txt`, { signal: AbortSignal.timeout(5000) })
        .then(async (res) => { if (res.ok) { await res.text(); return true; } return false; })
        .catch(() => false),

      fetch(`${PAGESPEED_ENDPOINT}?url=${encodeURIComponent(cleanUrl)}&category=performance&category=seo&category=best-practices&category=accessibility&key=${PAGESPEED_API_KEY}`,
        { signal: AbortSignal.timeout(48000) }).catch(() => null),

      // RSS blog feed — try common paths
      Promise.any([
        fetch(`${origin}/feed`, { signal: AbortSignal.timeout(6000) }),
        fetch(`${origin}/rss.xml`, { signal: AbortSignal.timeout(6000) }),
        fetch(`${origin}/blog/feed`, { signal: AbortSignal.timeout(6000) }),
        fetch(`${origin}/feed.xml`, { signal: AbortSignal.timeout(6000) }),
      ]).then(async (res) => res.ok ? res.text() : null).catch(() => null),
    ]);

    // ── HTML Analysis ───────────────────────────────────────────────────────
    let cachingActive = false;
    let pageBuilder: string = "None";
    let pluginCount = 0;
    const schemaTypes: string[] = [];
    let businessName: string | undefined;
    let businessType: string | undefined;
    // Layer 1 flags
    let hasMissingH1 = false;
    let hasMissingMetaDesc = false;
    let hasOutdatedCopyright = false;
    let noPhoneNumber = false;
    let noCtaButton = false;
    let noSocialLinks = false;
    // Business intelligence
    let hasAboutPage = false;
    let hasTeamPage = false;
    let hasPrivacyPolicy = false;
    let hasTerms = false;
    let hasTestimonialsSection = false;
    let testimonialCount = 0;
    let hasNamedAttribution = false;
    let hasTestimonialPhotos = false;
    let hasAddress = false;
    let hasEmail = false;
    let hasContactForm = false;
    let hasMapsEmbed = false;
    let hasBusinessHours = false;
    let hasCityInH1 = false;
    let hasServiceArea = false;

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

      // Page builder detection
      if (html.includes("elementor-")) pageBuilder = "Elementor";
      else if (html.includes("wp-content/themes/divi")) pageBuilder = "Divi";
      else if (html.includes("js_composer") || html.includes("wpb-js-composer")) pageBuilder = "WPBakery";
      else if (html.includes("wp-block-") || html.includes("wp-includes/css/dist/block-library")) pageBuilder = "Gutenberg";
      else if (html.includes("wp-content")) pageBuilder = "Unknown";

      const pluginMatches = html.match(/wp-content\/plugins\/([^/]+)\//g);
      if (pluginMatches) pluginCount = new Set(pluginMatches.map((p) => p.split("/")[2])).size;

      // Schema extraction
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
            const parsedSchema = JSON.parse(content);
            extractTypes(parsedSchema);
            if (!businessName && parsedSchema && typeof parsedSchema === "object") {
              const s = parsedSchema as Record<string, unknown>;
              if (typeof s["name"] === "string" && s["name"]) businessName = s["name"];
              if (typeof s["@type"] === "string" && s["@type"] && !businessType) businessType = s["@type"];
              // Address from schema
              if (s["address"] && typeof s["address"] === "object") hasAddress = true;
              // Hours from schema
              if (s["openingHours"] || s["openingHoursSpecification"]) hasBusinessHours = true;
            }
          } catch { /* skip invalid JSON */ }
        }
      }

      // Business name fallback — title tag
      if (!businessName) {
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) {
          const segment = titleMatch[1].trim().split(/\s*[|\u2014\-]\s*/)[0].trim();
          if (segment.length > 2 && segment.length < 80) businessName = segment;
        }
      }
      if (!businessName) {
        const h1Match = html.match(/<h1[^>]*>([^<]{2,80})<\/h1>/i);
        if (h1Match) businessName = h1Match[1].replace(/<[^>]+>/g, "").trim();
      }

      // ── Layer 1: Objective Facts ──
      hasMissingH1 = !/<h1[\s>]/i.test(html);
      hasMissingMetaDesc = !/<meta[^>]+name=["']description["'][^>]*content=["'][^"']{10,}/i.test(html);
      const currentYear = new Date().getFullYear();
      const copyrightMatch = html.match(/[\u00A9&copy;\u00a9]\s*(\d{4})|copyright\s+(\d{4})/i);
      if (copyrightMatch) {
        const foundYear = parseInt(copyrightMatch[1] || copyrightMatch[2], 10);
        if (foundYear > 0 && foundYear < currentYear) hasOutdatedCopyright = true;
      }
      noPhoneNumber = !/\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(html);
      const ctaPattern = /(<button[^>]*>|<a[^>]*>)[^<]*(book|schedule|call|contact|get|buy|order|reserve|start|sign up|free)[^<]*(<\/button>|<\/a>)/i;
      noCtaButton = !ctaPattern.test(html);
      noSocialLinks = !/(facebook\.com|instagram\.com|linkedin\.com|twitter\.com|x\.com|youtube\.com)/i.test(html);

      // ── Business Credibility Signals ──
      // Nav links for about/team/privacy/terms
      const navLinks = html.match(/href=["'][^"']*["']/gi)?.map(h => h.toLowerCase()) ?? [];
      hasAboutPage = navLinks.some(h => /\/(about|about-us|our-story|who-we-are)/.test(h));
      hasTeamPage = navLinks.some(h => /\/(team|our-team|meet-the-team|staff|people)/.test(h));
      hasPrivacyPolicy = navLinks.some(h => /\/(privacy|privacy-policy)/.test(h));
      hasTerms = navLinks.some(h => /\/(terms|terms-of-service|tos|legal)/.test(h));

      // Testimonials
      const testimonialPattern = /class=["'][^"']*(testimonial|review|quote|feedback|client-say)[^"']*["']/i;
      hasTestimonialsSection = testimonialPattern.test(html) || /<blockquote/i.test(html);
      if (hasTestimonialsSection) {
        const testimonialBlocks = html.match(/<blockquote[^>]*>[\s\S]*?<\/blockquote>/gi) ?? [];
        testimonialCount = testimonialBlocks.length || (html.match(/class=["'][^"']*testimonial[^"']*["']/gi) ?? []).length;
        // Named attribution: patterns like — Name, - Name, <cite>, <strong> inside testimonial areas
        hasNamedAttribution = /(<cite|<strong)[^>]*>[A-Z][a-z]+ [A-Z][a-z]+/.test(html) ||
          /[—\-]\s*[A-Z][a-z]+ [A-Z][a-z]+/.test(html);
        // Photos near testimonials (img inside blockquote or testimonial divs)
        hasTestimonialPhotos = /<blockquote[^>]*>[\s\S]*?<img[\s\S]*?<\/blockquote>/i.test(html);
      }
      const hasReviewSchemaLocal = schemaTypes.some(t => t.toLowerCase().includes("review") || t.toLowerCase().includes("aggregaterating"));

      // ── Contact Analysis ──
      hasEmail = /mailto:[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(html);
      hasContactForm = /<form[^>]*>[\s\S]*?<input[^>]*>[\s\S]*?<\/form>/i.test(html);
      hasMapsEmbed = /(maps\.google\.com|google\.com\/maps|map\.bing\.com)/i.test(html);
      if (!hasBusinessHours) {
        hasBusinessHours = /(mon[–\-]fri|open\s+\d|hours?:|monday|9am|10am|we are open)/i.test(html);
      }

      // ── Local SEO Signals ──
      const h1Text = (html.match(/<h1[^>]*>([^<]*)<\/h1>/i)?.[1] ?? "").toLowerCase();
      // City in H1: at least a capitalized word that's not common words
      hasCityInH1 = /\b[A-Z][a-z]{3,}\b/.test(html.match(/<h1[^>]*>([^<]*)<\/h1>/i)?.[1] ?? "") &&
        !/^(Welcome|Home|About|Services|Our|The|Get|Book|Free|Best|Top)\b/i.test(h1Text);
      hasServiceArea = /(serving|we serve|service area|near |in [A-Z][a-z]+,)/i.test(html.substring(0, 5000));
      if (!hasAddress) {
        // Street address patterns
        hasAddress = /\d{2,5}\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Blvd|Lane|Ln)/i.test(html);
      }
    }

    // ── Robots.txt Analysis ──────────────────────────────────────────────────
    let aiRobotsAllowed = true;
    if (robotsRes && robotsRes.ok) {
      const lines = robotsRes.text.split("\n").map((l) => l.trim().toLowerCase());
      let trackingAI = false;
      for (const line of lines) {
        if (line.startsWith("user-agent:")) {
          const agent = line.replace("user-agent:", "").trim();
          trackingAI = ["gptbot", "claudebot", "perplexitybot", "*"].includes(agent);
        }
        if (trackingAI && line.startsWith("disallow:")) {
          const rule = line.replace("disallow:", "").trim();
          if (rule === "/" || rule === "") aiRobotsAllowed = false;
        }
      }
    }
    const llmsTxtPresent = robotsRes != null && (llmsRes ?? false);

    // ── Blog / RSS Analysis ──────────────────────────────────────────────────
    let blogData: { exists: boolean; totalPosts: number; daysSinceLastPost?: number; avgIntervalDays?: number; recentAvgIntervalDays?: number; historicAvgIntervalDays?: number; contentSlowing?: boolean; } | undefined;
    if (rssRes) {
      const dates = parseRssDates(rssRes);
      if (dates.length > 0) {
        const daysSinceLastPost = daysBetween(dates[0], new Date());
        const intervals: number[] = [];
        for (let i = 0; i < dates.length - 1; i++) {
          intervals.push(daysBetween(dates[i], dates[i + 1]));
        }
        const avgIntervalDays = intervals.length > 0
          ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
          : undefined;
        const recentIntervals = intervals.slice(0, 3);
        const historicIntervals = intervals.slice(3, 10);
        const recentAvg = recentIntervals.length > 0
          ? Math.round(recentIntervals.reduce((a, b) => a + b, 0) / recentIntervals.length)
          : undefined;
        const historicAvg = historicIntervals.length > 0
          ? Math.round(historicIntervals.reduce((a, b) => a + b, 0) / historicIntervals.length)
          : undefined;
        const contentSlowing = recentAvg && historicAvg ? (recentAvg > 30 && recentAvg > historicAvg * 2) : false;
        blogData = {
          exists: true,
          totalPosts: dates.length,
          daysSinceLastPost: Math.round(daysSinceLastPost),
          avgIntervalDays,
          recentAvgIntervalDays: recentAvg,
          historicAvgIntervalDays: historicAvg,
          contentSlowing,
        };
      } else {
        blogData = { exists: false, totalPosts: 0 };
      }
    } else {
      blogData = { exists: false, totalPosts: 0 };
    }

    // ── PageSpeed Analysis ───────────────────────────────────────────────────
    if (!psRes?.ok) {
      await sendAuditErrorEmail(cleanUrl, name, email, "PageSpeed API request timed out or returned error code");
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
    const networkItems: Array<{ transferSize?: number }> = audits["network-requests"]?.details?.items ?? [];
    const pageSize = parseFloat((networkItems.reduce((acc, r) => acc + (r.transferSize ?? 0), 0) / 1048576).toFixed(2));
    // Images missing alt text from PageSpeed
    const imagesWithoutAlt: number = audits["image-alt"]?.details?.items?.length ?? 0;

    // ── Scores ───────────────────────────────────────────────────────────────
    const hasLocalSchema = schemaTypes.some(s => s.toLowerCase().includes("localbusiness") || s.toLowerCase().includes("organization"));
    const hasReviewSchemaFlag = schemaTypes.some(s => s.toLowerCase().includes("review") || s.toLowerCase().includes("aggregaterating"));
    const hasSocialLinks = !noSocialLinks;
    const hasPhone = !noPhoneNumber;

    // Business Credibility Score (max 10)
    let credScore = 0;
    if (hasAboutPage) credScore += 1;
    if (hasTeamPage) credScore += 1;
    if (hasPrivacyPolicy) credScore += 1;
    if (hasTerms) credScore += 0.5;
    if (hasTestimonialsSection) credScore += 2;
    if (hasReviewSchemaFlag) credScore += 1.5;
    if (hasSocialLinks) credScore += 1.5;
    if (hasAddress) credScore += 1;
    if (hasPhone) credScore += 1.5;
    const credibilityScore = Math.min(Math.round(credScore), 10);

    // Local SEO Readiness Score (max 8 → normalise to 10)
    let localScore = 0;
    if (hasPhone) localScore += 1.5;
    if (hasAddress) localScore += 1.5;
    if (hasLocalSchema) localScore += 2;
    if (hasMapsEmbed) localScore += 1.5;
    if (hasCityInH1) localScore += 1;
    if (hasServiceArea) localScore += 1;
    if (hasBusinessHours) localScore += 1.5;
    const localSeoScore = Math.min(Math.round((localScore / 10) * 10), 10);

    // Online Authority Score (max 10)
    let onlineAuthScore = 0;
    if (hasAboutPage || hasTeamPage) onlineAuthScore += 2;
    if (hasTestimonialsSection) onlineAuthScore += 2;
    if (hasReviewSchemaFlag) onlineAuthScore += 1.5;
    if (hasSocialLinks) onlineAuthScore += 1.5;
    if (hasPrivacyPolicy && hasTerms) onlineAuthScore += 1.5;
    if (ttfb < 500 || cachingActive) onlineAuthScore += 2;
    if (loadTime < 3.0) onlineAuthScore += 1.5;
    const onlineAuthorityScore = Math.min(Math.round(onlineAuthScore), 10);

    // ── Gemini AI Synthesis ──────────────────────────────────────────────────
    const blogSummary = blogData?.exists
      ? blogData.contentSlowing
        ? `slowing — was every ${blogData.historicAvgIntervalDays} days, now ${blogData.recentAvgIntervalDays} days between posts`
        : blogData.daysSinceLastPost && blogData.daysSinceLastPost > 90
          ? `inactive — last post ${blogData.daysSinceLastPost} days ago`
          : `active — ${blogData.totalPosts} posts, last posted ${blogData.daysSinceLastPost} days ago`
      : "no blog detected";

    const synthesisSummary = {
      businessName: businessName ?? name,
      blog: blogSummary,
      testimonials: testimonialCount > 0 ? `${testimonialCount} found, named attribution: ${hasNamedAttribution}` : "none found",
      credibilityScore: `${credibilityScore}/10`,
      localSeoScore: `${localSeoScore}/10`,
      onlineAuthorityScore: `${onlineAuthorityScore}/10`,
      phone: hasPhone,
      email: hasEmail,
      address: hasAddress,
      businessHours: hasBusinessHours,
      mapsEmbed: hasMapsEmbed,
      aboutPage: hasAboutPage,
      aiReadiness: !aiRobotsAllowed ? "blocked" : hasLocalSchema ? "ready" : "missing signals",
      mobilePerformance: lcp > 4 ? "slow" : lcp > 2.5 ? "moderate" : "good",
      caching: cachingActive ? "enabled" : "disabled",
      metaDescription: hasMissingMetaDesc ? "missing" : "present",
      copyrightYear: hasOutdatedCopyright ? "outdated" : "current",
    };

    let businessCategory: "local-service" | "professional-service" | "ecommerce" | "content-saas" = 
      hasLocalSchema || hasMapsEmbed ? "local-service" : "professional-service";
    let executiveSummaryText = `Your website has a website foundation score of ${Math.round((performance + seo + accessibility) / 3)}/100. Caching is ${cachingActive ? "active" : "missing"}, and server response is ${ttfb}ms. Testimonials were ${hasTestimonialsSection ? "" : "not "}detected on your homepage, and AI search crawler access is ${aiRobotsAllowed ? "enabled" : "disabled"}.`;
    let aiObs: Array<{ title: string; body: string }> = [];

    const aiRes = await generateAiAnalysis(synthesisSummary);
    if (aiRes) {
      businessCategory = aiRes.businessCategory;
      executiveSummaryText = aiRes.executiveSummary;
      aiObs = aiRes.observations;
    }

    // ── Assemble Report ──────────────────────────────────────────────────────
    const reportId = crypto.randomUUID();
    const report: AuditReport = {
      id: reportId,
      url: cleanUrl,
      name,
      email,
      status: "completed",
      timestamp: new Date().toISOString(),
      metrics: { performance, seo, bestPractices, accessibility },
      businessCategory,
      executiveSummary: executiveSummaryText,
      aiObservations: aiObs,
      details: {
        ttfb, loadTime, lcp, fcp, tbt, cls, pageSize,
        pageBuilder: pageBuilder as "Elementor" | "Divi" | "WPBakery" | "Gutenberg" | "None" | "Unknown",
        pluginCount, cachingActive,
        schemaTypes: Array.from(new Set(schemaTypes)),
        aiRobotsAllowed, llmsTxtPresent,
        businessName, businessType,
        hasMissingH1, hasMissingMetaDesc, hasOutdatedCopyright,
        noPhoneNumber, noCtaButton, noSocialLinks, imagesWithoutAlt,
        blog: blogData,
        credibility: {
          score: credibilityScore,
          hasAboutPage, hasTeamPage, hasPrivacyPolicy, hasTerms,
          hasTestimonials: hasTestimonialsSection,
          hasReviewSchema: hasReviewSchemaFlag,
          hasSocialLinks, hasAddress, hasPhone,
        },
        localSeo: {
          score: localSeoScore,
          hasPhone, hasAddress,
          hasLocalSchema, hasMapsEmbed, hasCityInH1, hasServiceArea, hasBusinessHours,
        },
        onlineAuthority: {
          score: onlineAuthorityScore,
          hasAboutOrTeam: hasAboutPage || hasTeamPage,
          hasTestimonials: hasTestimonialsSection,
          hasReviewSchema: hasReviewSchemaFlag,
          hasSocialLinks,
          hasLegalPages: hasPrivacyPolicy && hasTerms,
          hasGoodSpeedOrCache: ttfb < 500 || cachingActive,
        },
        testimonials: {
          found: hasTestimonialsSection,
          count: testimonialCount,
          hasNamedAttribution,
          hasSchema: hasReviewSchemaFlag,
          hasPhotos: hasTestimonialPhotos,
        },
        contact: {
          hasPhone, hasEmail, hasForm: hasContactForm,
          hasAddress, hasMapsEmbed, hasBusinessHours,
        },
      },
    };

    const saved = await saveAudit(reportId, report);
    if (!saved) console.error(`Failed to save audit ${reportId} to GitHub`);
    console.log(`Audit complete for ${cleanUrl} | ID: ${reportId} | Saved: ${saved} | Category: ${businessCategory}`);

    // Send notification email with client details and audit link
    try {
      const websiteHost = request.headers.get("host") || "naveengaur.com";
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const reportLink = `${protocol}://${websiteHost}/audits/${reportId}`;

      await resend.emails.send({
        from: "Website Auditor <onboarding@resend.dev>",
        to: [process.env.CONTACT_EMAIL || "hello@naveengaur.com", "naveencg070@gmail.com"],
        replyTo: email,
        subject: `New Website Audit Run: ${cleanUrl}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAFAF8; border-radius: 8px;">
            <h2 style="color: #725921; font-size: 20px; margin-bottom: 24px; font-weight: bold;">New Website Audit Completed</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px; width: 150px;">Client Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><strong>${name}</strong></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Client Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><a href="mailto:${email}" style="color: #C4A35A; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Website Audited</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><a href="${cleanUrl}" target="_blank" style="color: #C4A35A; text-decoration: none;">${cleanUrl}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Audit Category</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px; text-transform: capitalize;">${businessCategory}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Lighthouse Scores</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;">
                  Perf: <strong>${performance}</strong> | SEO: <strong>${seo}</strong> | Best Prac: <strong>${bestPractices}</strong> | Access: <strong>${accessibility}</strong>
                </td>
              </tr>
            </table>

            <div style="margin-top: 24px; text-align: center;">
              <a href="${reportLink}" target="_blank" style="display: inline-block; background: #C4A35A; color: #0D0D0D; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 4px; font-size: 14px;">
                View Completed Report Online
              </a>
            </div>

            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #EAEAEA; font-size: 12px; color: #9A9A9A;">
              Sent automatically from naveengaur.com audit portal
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send audit notification email:", emailErr);
    }

    return NextResponse.json({ success: true, id: reportId, report }, { status: 200 });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Audit API critical error:", err);
    await sendAuditErrorEmail(url, name, email, `Critical Server Error: ${errMsg}`);
    return NextResponse.json({ error: "Server error while running audit. Please try again." }, { status: 500 });
  }
}
