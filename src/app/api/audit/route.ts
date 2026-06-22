import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dns from "dns";
import { promisify } from "util";
import crypto from "crypto";
import { Resend } from "resend";
import { saveAudit, AuditReport, DetectionState } from "@/lib/github-audits";
import robotsParser from "robots-parser";
import * as cheerio from "cheerio";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import he from "he";

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
    let hasMissingH1: DetectionState = false;
    let hasMissingMetaDesc: DetectionState = false;
    let hasOutdatedCopyright: DetectionState = false;
    let noPhoneNumber: DetectionState = false;
    let noCtaButton: DetectionState = false;
    let noSocialLinks: DetectionState = false;
    // Business intelligence
    let hasAboutPage: DetectionState = false;
    let hasTeamPage: DetectionState = false;
    let hasPrivacyPolicy: DetectionState = false;
    let hasTerms: DetectionState = false;
    let hasTestimonialsSection: DetectionState = false;
    let testimonialCount = 0;
    let hasNamedAttribution: DetectionState = false;
    let hasTestimonialPhotos: DetectionState = false;
    let hasLogoWall: DetectionState = false;
    let hasAddress: DetectionState = false;
    let hasEmail: DetectionState = false;
    let hasContactForm: DetectionState = false;
    let hasMapsEmbed: DetectionState = false;
    let hasBusinessHours: DetectionState = false;
    let hasCityInH1: DetectionState = false;
    let hasServiceArea: DetectionState = false;
    let inferredCountryCode: any = "US";

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
      const $ = cheerio.load(html);

      // Determine Region Hint
      const lang = $('html').attr('lang') || '';
      if (lang.toLowerCase().includes('en-us') || cleanUrl.endsWith('.us')) inferredCountryCode = 'US';
      else if (lang.toLowerCase().includes('en-in') || cleanUrl.endsWith('.in')) inferredCountryCode = 'IN';
      else if (lang.toLowerCase().includes('en-gb') || cleanUrl.endsWith('.uk')) inferredCountryCode = 'GB';
      else if (lang.toLowerCase().includes('en-au') || cleanUrl.endsWith('.au')) inferredCountryCode = 'AU';
      else if (lang.toLowerCase().includes('en-ca') || cleanUrl.endsWith('.ca')) inferredCountryCode = 'CA';

      // Page builder detection
      if (html.includes("elementor-")) pageBuilder = "Elementor";
      else if (html.includes("wp-content/themes/divi")) pageBuilder = "Divi";
      else if (html.includes("js_composer") || html.includes("wpb-js-composer")) pageBuilder = "WPBakery";
      else if (html.includes("wp-block-") || html.includes("wp-includes/css/dist/block-library")) pageBuilder = "Gutenberg";
      else if (html.includes("wp-content")) pageBuilder = "Unknown";

      const pluginMatches = html.match(/wp-content\/plugins\/([^/]+)\//g);
      if (pluginMatches) pluginCount = new Set(pluginMatches.map((p) => p.split("/")[2])).size;

      // Schema extraction
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const content = $(el).html();
          if (!content) return;
          const parsedSchema = JSON.parse(content);
          
          const extractTypes = (obj: unknown): void => {
            if (obj && typeof obj === "object") {
              const rec = obj as Record<string, unknown>;
              if (typeof rec["@type"] === "string") schemaTypes.push(rec["@type"]);
              Object.values(rec).forEach(extractTypes);
            }
          };
          extractTypes(parsedSchema);
          
          const extractNameAndType = (obj: unknown): void => {
            if (obj && typeof obj === "object") {
              const rec = obj as Record<string, unknown>;
              const typeStr = typeof rec["@type"] === "string" ? rec["@type"].toLowerCase() : "";
              if (
                typeStr.includes("organization") ||
                typeStr.includes("localbusiness") ||
                typeStr.includes("website") ||
                typeStr.includes("corporation")
              ) {
                if (typeof rec["name"] === "string" && rec["name"] && !businessName) {
                  businessName = he.decode(rec["name"]);
                }
                if (typeof rec["@type"] === "string" && !businessType) {
                  businessType = rec["@type"];
                }
              }
              if (!businessName && typeof rec["name"] === "string" && rec["name"]) {
                businessName = he.decode(rec["name"]);
              }
              if (rec["address"] && typeof rec["address"] === "object") hasAddress = true;
              if (rec["openingHours"] || rec["openingHoursSpecification"]) hasBusinessHours = true;
              if (rec["telephone"] && typeof rec["telephone"] === "string") noPhoneNumber = false;
              
              Object.values(rec).forEach(extractNameAndType);
            }
          };
          extractNameAndType(parsedSchema);
        } catch { /* skip invalid JSON */ }
      });

      // Business name fallback — title tag split with smart matching
      if (!businessName) {
        const titleText = $('title').first().text();
        if (titleText) {
          const segments = titleText.split(/\s*[|\u2014\-]\s*/).map(s => s.trim()).filter(Boolean);
          if (segments.length > 0) {
            let domainSlug = "";
            try {
              const host = new URL(cleanUrl).hostname.toLowerCase();
              domainSlug = host.replace(/^www\./, "").split(".")[0];
            } catch {}

            let bestSegment = segments[0];
            if (domainSlug && domainSlug.length > 2) {
              const matched = segments.find(seg => seg.toLowerCase().includes(domainSlug) || domainSlug.includes(seg.toLowerCase()));
              if (matched) {
                bestSegment = matched;
              } else {
                const cleanSlug = domainSlug.replace(/(digital|agency|tech|web|design|consulting|solutions|media|studio|group|systems|software)$/i, "");
                if (cleanSlug.length > 2) {
                  const partMatched = segments.find(seg => seg.toLowerCase().includes(cleanSlug));
                  if (partMatched) bestSegment = partMatched;
                }
              }
            }

            if (bestSegment === segments[0] && segments.length > 1) {
              const bizWords = /\b(digital|agency|solutions|services|company|group|consulting|design|media|studio|labs|tech|software|systems|limited|ltd|inc|llc|corp)\b/i;
              const hasBizWord = segments.map(seg => bizWords.test(seg));
              if (!hasBizWord[0] && hasBizWord[1]) {
                bestSegment = segments[1];
              }
            }

            if (bestSegment.length > 2 && bestSegment.length < 80) {
              businessName = he.decode(bestSegment);
            }
          }
        }
      }
      if (!businessName) {
        const h1Text = $('h1').first().text();
        if (h1Text && h1Text.length > 2 && h1Text.length < 80) businessName = he.decode(h1Text.trim());
      }

      // ── Layer 1: Objective Facts ──
      hasMissingH1 = $('h1').length === 0;
      hasMissingMetaDesc = $('meta[name="description"]').length === 0 || ($('meta[name="description"]').attr('content') || '').length < 10;
      
      const currentYear = new Date().getFullYear();
      const copyrightMatch = html.match(/[\u00A9&copy;\u00a9]\s*(\d{4})|copyright\s+(\d{4})/i);
      if (copyrightMatch) {
        const foundYear = parseInt(copyrightMatch[1] || copyrightMatch[2], 10);
        if (foundYear > 0 && foundYear < currentYear) hasOutdatedCopyright = true;
      }
      
      const allText = $('body').text() || '';
      let phoneFound = false;
      const phoneNumber = parsePhoneNumberFromString(allText, inferredCountryCode as any);
      if (phoneNumber && phoneNumber.isValid()) {
         phoneFound = true;
      } else {
         phoneFound = /\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(html);
      }
      noPhoneNumber = !phoneFound ? "unverified" : false;
      
      const ctaPattern = /(book|schedule|call|contact|get|buy|order|reserve|start|sign up|free)/i;
      let ctaFound = false;
      $('button, a').each((_, el) => {
        if (ctaPattern.test($(el).text())) ctaFound = true;
      });
      noCtaButton = !ctaFound;
      noSocialLinks = !/(facebook\.com|instagram\.com|linkedin\.com|twitter\.com|x\.com|youtube\.com)/i.test(html) ? "unverified" : false;

      // ── Business Credibility Signals ──
      hasAboutPage = $('a[href*="/about"], a[href*="/our-story"], a[href*="/who-we-are"]').length > 0 ? true : "unverified";
      hasTeamPage = $('a[href*="/team"], a[href*="/our-team"], a[href*="/meet-the-team"], a[href*="/staff"], a[href*="/people"]').length > 0 ? true : "unverified";
      hasPrivacyPolicy = $('a[href*="/privacy"]').length > 0 ? true : "unverified";
      hasTerms = $('a[href*="/terms"], a[href*="/tos"], a[href*="/legal"]').length > 0 ? true : "unverified";

      // Testimonials
      hasTestimonialsSection = $('blockquote, [class*="testimonial"], [class*="review"], [class*="quote"], [class*="client-say"]').length > 0 ? true : "unverified";
      if (hasTestimonialsSection === true) {
        testimonialCount = $('blockquote').length || $('[class*="testimonial"]').length;
        hasNamedAttribution = $('cite, strong').filter((_, el) => /[A-Z][a-z]+ [A-Z][a-z]+/.test($(el).text())).length > 0 ? true : "unverified";
        hasTestimonialPhotos = $('blockquote img, [class*="testimonial"] img').length > 0 ? true : "unverified";
      }

      // Logo wall heuristic
      let foundLogoWall = false;
      $('section, div').each((_, el) => {
        const headingText = $(el).find('h1, h2, h3, h4, h5, h6').first().text();
        if (/our (valued )?(customers|clients|partners)/i.test(headingText)) {
          const imgCount = $(el).find('img').length;
          if (imgCount >= 5) foundLogoWall = true;
        }
      });
      hasLogoWall = foundLogoWall ? true : "unverified";

      // ── Contact Analysis ──
      hasEmail = $('a[href^="mailto:"]').length > 0 ? true : "unverified";
      hasContactForm = $('form input').length > 0 ? true : "unverified";
      hasMapsEmbed = $('iframe[src*="maps.google.com"], iframe[src*="google.com/maps"], iframe[src*="map.bing.com"]').length > 0 ? true : "unverified";
      
      if ((hasBusinessHours as DetectionState) !== true) {
        hasBusinessHours = /(mon[–\-]fri|open\s+\d|hours?:|monday|9am|10am|we are open)/i.test(allText) ? true : "unverified";
      }

      // ── Local SEO Signals ──
      const h1TextContent = $('h1').first().text().toLowerCase();
      hasCityInH1 = /\b[A-Z][a-z]{3,}\b/.test($('h1').first().text()) && !/^(Welcome|Home|About|Services|Our|The|Get|Book|Free|Best|Top)\b/i.test(h1TextContent) ? true : "unverified";
      hasServiceArea = /(serving|we serve|service area|near |in [A-Z][a-z]+,)/i.test(allText.substring(0, 5000)) ? true : "unverified";
      if ((hasAddress as DetectionState) !== true) {
        hasAddress = /\d{2,5}\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Blvd|Lane|Ln)/i.test(allText) ? true : "unverified";
      }
    }

    // ── Robots.txt Analysis ──────────────────────────────────────────────────
    let aiRobotsAllowed = true;
    const blockedAiBots: string[] = [];
    if (robotsRes && robotsRes.ok) {
      const robotsTxtUrl = `${origin}/robots.txt`;
      const robots = robotsParser(robotsTxtUrl, robotsRes.text);
      const botsToCheck = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
      for (const bot of botsToCheck) {
        if (robots.isAllowed(cleanUrl, bot) === false) {
           blockedAiBots.push(bot);
        }
      }
      if (blockedAiBots.length > 0 || robots.isAllowed(cleanUrl, "*") === false) {
        aiRobotsAllowed = false;
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
    const hasSocialLinksScore: DetectionState = noSocialLinks === false ? true : noSocialLinks;
    const hasPhoneScore: DetectionState = noPhoneNumber === false ? true : noPhoneNumber;

    const calculateScore = (items: { weight: number; state: DetectionState | boolean }[], ttfbPenalty: boolean = false): number => {
      let earned = 0;
      let possible = 0;
      for (const item of items) {
        if (item.state === true) {
          earned += item.weight;
          possible += item.weight;
        } else if (item.state === false) {
          possible += item.weight;
        }
      }
      let percentage = possible > 0 ? (earned / possible) * 100 : 0;
      if (ttfbPenalty && percentage > 75) percentage = 75;
      return Math.min(Math.round(percentage / 10), 10);
    };

    // Business Credibility Score (max 10)
    const credibilityScore = calculateScore([
      { weight: 1, state: hasAboutPage },
      { weight: 1, state: hasTeamPage },
      { weight: 1, state: hasPrivacyPolicy },
      { weight: 0.5, state: hasTerms },
      { weight: 2, state: hasTestimonialsSection },
      { weight: 1.5, state: hasReviewSchemaFlag },
      { weight: 1.5, state: hasSocialLinksScore },
      { weight: 1, state: hasAddress },
      { weight: 1.5, state: hasPhoneScore }
    ], ttfb > 600);

    // Local SEO Readiness Score (max 8 → normalise to 10 via percentage)
    const localSeoScore = calculateScore([
      { weight: 1.5, state: hasPhoneScore },
      { weight: 1.5, state: hasAddress },
      { weight: 2, state: hasLocalSchema },
      { weight: 1.5, state: hasMapsEmbed },
      { weight: 1, state: hasCityInH1 },
      { weight: 1, state: hasServiceArea },
      { weight: 1.5, state: hasBusinessHours }
    ], ttfb > 600);

    // Online Authority Score (max 10)
    const onlineAuthorityScore = calculateScore([
      { weight: 2, state: hasAboutPage === true || hasTeamPage === true ? true : (hasAboutPage === "unverified" && hasTeamPage === "unverified" ? "unverified" : false) },
      { weight: 2, state: hasTestimonialsSection },
      { weight: 1.5, state: hasReviewSchemaFlag },
      { weight: 1.5, state: hasSocialLinksScore },
      { weight: 1.5, state: hasPrivacyPolicy === true && hasTerms === true ? true : (hasPrivacyPolicy === "unverified" || hasTerms === "unverified" ? "unverified" : false) },
      { weight: 2, state: ttfb < 500 || cachingActive },
      { weight: 1.5, state: loadTime < 3.0 }
    ], ttfb > 600);

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
      phone: hasPhoneScore === true ? true : false,
      email: hasEmail === true ? true : false,
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
        aiRobotsAllowed, blockedAiBots, llmsTxtPresent,
        businessName, businessType,
        hasMissingH1, hasMissingMetaDesc, hasOutdatedCopyright,
        noPhoneNumber, noCtaButton, noSocialLinks, imagesWithoutAlt,
        blog: blogData ? { ...blogData, exists: blogData.exists ? true : "unverified" } : undefined,
        credibility: {
          score: credibilityScore,
          hasAboutPage, hasTeamPage, hasPrivacyPolicy, hasTerms,
          hasTestimonials: hasTestimonialsSection,
          hasReviewSchema: hasReviewSchemaFlag,
          hasSocialLinks: hasSocialLinksScore, hasAddress, hasPhone: hasPhoneScore,
        },
        localSeo: {
          score: localSeoScore,
          hasPhone: hasPhoneScore, hasAddress,
          hasLocalSchema, hasMapsEmbed, hasCityInH1, hasServiceArea, hasBusinessHours,
        },
        onlineAuthority: {
          score: onlineAuthorityScore,
          hasAboutOrTeam: hasAboutPage === true || hasTeamPage === true ? true : (hasAboutPage === "unverified" && hasTeamPage === "unverified" ? "unverified" : false),
          hasTestimonials: hasTestimonialsSection,
          hasReviewSchema: hasReviewSchemaFlag,
          hasSocialLinks: hasSocialLinksScore,
          hasLegalPages: hasPrivacyPolicy === true && hasTerms === true ? true : (hasPrivacyPolicy === "unverified" || hasTerms === "unverified" ? "unverified" : false),
          hasGoodSpeedOrCache: ttfb < 500 || cachingActive,
        },
        testimonials: {
          found: hasTestimonialsSection,
          count: testimonialCount,
          hasNamedAttribution,
          hasSchema: hasReviewSchemaFlag,
          hasPhotos: hasTestimonialPhotos,
          hasLogoWall,
        },
        contact: {
          hasPhone: hasPhoneScore, hasEmail, hasForm: hasContactForm,
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
