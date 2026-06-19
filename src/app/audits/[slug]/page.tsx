import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { getAudit } from "@/lib/github-audits";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0; // Disable static compilation caching to support dynamic fetches

// Instruct all search engines not to index these private audit pages
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

// Heuristic to check if a slug is a UUID (UUID v4)
function isUuid(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

function getAuditBySlug(slug: string) {
  const auditDirectory = path.join(process.cwd(), "src/content/audits");
  const filePath = path.join(auditDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) return null;
  
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  return {
    meta: data,
    content: content,
  };
}

// Score styling helpers - high legibility in light theme
function getScoreColorClass(score: number | string | undefined) {
  if (score === "N/A" || score === undefined) return "text-amber-600 border-amber-200 bg-amber-50/30";
  const s = Number(score);
  if (s >= 90) return "text-emerald-600 border-emerald-200 bg-emerald-50/30";
  if (s >= 50) return "text-amber-600 border-amber-200 bg-amber-50/30";
  return "text-red-600 border-red-200 bg-red-50/30";
}

function getBadgeColorClass(value: string, key: string) {
  if (!value || value === "N/A") return "bg-amber-50 text-amber-700 border-amber-200";
  const num = parseFloat(value.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return "bg-amber-50 text-amber-700 border-amber-200";

  // Benchmarks
  let status = "good";
  if (key === "fcp") {
    if (num > 3.0) status = "poor";
    else if (num > 1.8) status = "needs-work";
  } else if (key === "lcp") {
    if (num > 4.0) status = "poor";
    else if (num > 2.5) status = "needs-work";
  } else if (key === "tbt") {
    if (num > 600) status = "poor";
    else if (num > 200) status = "needs-work";
  } else if (key === "cls") {
    if (num > 0.25) status = "poor";
    else if (num > 0.1) status = "needs-work";
  } else if (key === "speed_index") {
    if (num > 5.8) status = "poor";
    else if (num > 3.4) status = "needs-work";
  }

  if (status === "good") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "poor") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

function getBadgeText(value: string, key: string) {
  const badgeClass = getBadgeColorClass(value, key);
  if (badgeClass.includes("emerald")) return "Good";
  if (badgeClass.includes("red")) return "Critical";
  return "Needs Work";
}

const mdxComponents = {
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="table-wrapper my-8 overflow-x-auto w-full rounded-xl border border-slate-200 bg-white shadow-sm">
      <table {...props} className="w-full border-collapse text-left text-[14px]" />
    </div>
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = props.href?.startsWith("http");
    return (
      <a 
        {...props} 
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-[#C4A35A] hover:text-[#d4b46a] font-bold underline transition-colors" 
      />
    );
  },
};

export default async function AuditPage({ params }: Props) {
  const { slug } = await params;

  // CASE 1: Dynamic UUID Audit (Fetched from GitHub content store)
  if (isUuid(slug)) {
    const audit = await getAudit(slug);
    if (!audit) notFound();

    const { url, name, status, timestamp, metrics, details, error } = audit;
    const dateStr = new Date(timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (status === "pending") {
      return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-[480px] text-center bg-white border border-[#E2E8F0] p-10 rounded-lg shadow-sm">
            <div className="inline-block w-8 h-8 border-2 border-[#C4A35A]/30 border-t-[#C4A35A] rounded-full animate-spin mb-4"></div>
            <h1 className="text-[20px] font-semibold text-[#725921] mb-2 font-serif">Audit Report Generating</h1>
            <p className="text-[14px] text-[#1E293B] leading-[1.6]">
              We are analyzing your website&apos;s WordPress core parameters and querying Google PageSpeed. This page will auto-refresh.
            </p>
            <script
              dangerouslySetInnerHTML={{
                __html: `setTimeout(() => window.location.reload(), 5000);`,
              }}
            />
          </div>
        </div>
      );
    }

    if (status === "failed" || error) {
      return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-[480px] text-center bg-white border border-[#E2E8F0] p-10 rounded-lg shadow-sm">
            <span className="text-[32px] block mb-2">⚠️</span>
            <h1 className="text-[20px] font-semibold text-red-700 mb-2 font-serif">Audit Analysis Failed</h1>
            <p className="text-[14px] text-[#1E293B] leading-[1.6] mb-6">
              {error || "An unexpected error occurred while running the audit check."}
            </p>
            <Link href="/free-audit" className="bg-[#C4A35A] text-[#0D0D0D] px-6 py-3 rounded text-[13px] font-semibold tracking-[0.05em] uppercase hover:bg-[#d4b46a] transition-colors">
              Try Another URL
            </Link>
          </div>
        </div>
      );
    }

    const performance = metrics?.performance ?? 0;
    const seo = metrics?.seo ?? 0;
    const accessibility = metrics?.accessibility ?? 0;

    const loadTime = details?.loadTime ?? 0;
    const ttfb = details?.ttfb ?? 0;
    const pageSize = details?.pageSize ?? 0;
    const pluginCount = details?.pluginCount ?? 0;
    const pageBuilder = details?.pageBuilder ?? "None";
    const cachingActive = details?.cachingActive ?? false;
    const schemaTypes = details?.schemaTypes ?? [];
    const aiRobotsAllowed = details?.aiRobotsAllowed ?? true;
    const llmsTxtPresent = details?.llmsTxtPresent ?? false;

    const isSlow = loadTime > 3.0;
    const isTtfbHigh = ttfb > 500;
    const isPluginsHigh = pluginCount > 15;
    const hasBuilder = pageBuilder !== "None" && pageBuilder !== "Unknown";
    const isCachingMissing = !cachingActive;
    const hasLocalBusinessSchema = schemaTypes.some(s => s.toLowerCase().includes("localbusiness") || s.toLowerCase().includes("organization"));
    const hasReviewSchema = schemaTypes.some(s => s.toLowerCase().includes("review") || s.toLowerCase().includes("aggregaterating"));
    const isAiBlocked = !aiRobotsAllowed;

    const bounceIncrease = isSlow ? Math.round((loadTime - 2.0) * 15) : 0;
    const estimatedLostPercent = Math.min(bounceIncrease + 10, 60);

    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] font-sans antialiased selection:bg-[#C4A35A]/20">
        <header className="border-b border-[#E2E8F0] py-6 bg-white shadow-sm">
          <div className="max-w-[860px] mx-auto px-6 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold tracking-[0.08em] text-[#C4A35A] uppercase">Naveen Gaur</span>
              <span className="text-[14px] font-semibold text-[#725921]">Client Audit Portal</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#1E293B] block">Generated for:</span>
              <span className="text-[13px] font-medium text-[#0D0D0D]">{name}</span>
            </div>
          </div>
        </header>

        <main className="max-w-[860px] mx-auto px-6 py-12">
          <div className="mb-10 text-center md:text-left">
            <span className="bg-[#C4A35A]/10 text-[#725921] border border-[#C4A35A]/30 text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full">
              Private Technical Diagnosis
            </span>
            <h1 className="text-[clamp(32px,4.5vw,46px)] font-serif tracking-[-0.02em] text-[#725921] mt-4 mb-2 leading-[1.15]">
              Website &amp; AI Search Readiness Report
            </h1>
            <p className="text-[14px] text-[#1E293B] font-light">
              Analysis conducted on {dateStr} • Target website: <a href={url} target="_blank" rel="noreferrer" className="text-[#C4A35A] hover:underline font-medium">{url}</a>
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#C4A35A] p-8 rounded-lg shadow-sm mb-12">
            <h3 className="text-[#725921] text-[15px] font-bold mb-3 uppercase tracking-wide">Executive Briefing</h3>
            <div className="text-[17px] text-[#0D0D0D] leading-[1.7] font-medium">
              {isSlow ? (
                <p>
                  {name}, your home page takes <strong className="text-red-700">{loadTime} seconds</strong> to visually stabilize on mobile screens. Under Google&apos;s Core Web Vitals algorithms, this latency causes an estimated <strong className="text-red-700">{estimatedLostPercent}% of mobile visitors</strong> to bounce before reading about your services. Your site has critical performance leaks and is invisible to AI search citation queries.
                </p>
              ) : (
                <p>
                  {name}, your website has a healthy base load speed of <strong>{loadTime} seconds</strong>. However, we detected key optimization areas in your search discovery footprint and AI agent availability that are preventing you from capturing modern search traffic.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-lg text-center shadow-xs">
              <span className="text-[11px] uppercase text-[#1E293B] block font-semibold mb-1">Performance</span>
              <div className={`text-[32px] font-bold font-serif ${performance >= 80 ? 'text-green-600' : performance >= 50 ? 'text-amber-500' : 'text-red-600'}`}>
                {performance}/100
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-lg text-center shadow-xs">
              <span className="text-[11px] uppercase text-[#1E293B] block font-semibold mb-1">SEO Structure</span>
              <div className={`text-[32px] font-bold font-serif ${seo >= 80 ? 'text-green-600' : seo >= 50 ? 'text-amber-500' : 'text-red-600'}`}>
                {seo}/100
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-lg text-center shadow-xs">
              <span className="text-[11px] uppercase text-[#1E293B] block font-semibold mb-1">Accessibility</span>
              <div className={`text-[32px] font-bold font-serif ${accessibility >= 80 ? 'text-green-600' : accessibility >= 50 ? 'text-amber-500' : 'text-red-600'}`}>
                {accessibility}/100
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-lg text-center shadow-xs">
              <span className="text-[11px] uppercase text-[#1E293B] block font-semibold mb-1">AI Citations</span>
              <div className={`text-[24px] font-bold font-serif ${hasLocalBusinessSchema && !isAiBlocked ? 'text-green-600' : 'text-amber-500'}`}>
                {hasLocalBusinessSchema && !isAiBlocked ? "READY" : "UNREADY"}
              </div>
            </div>
          </div>

          <section className="space-y-12">
            <div>
              <h2 className="text-[20px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
                1. WordPress Core &amp; Caching Audit
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className={`text-[20px] leading-none ${isCachingMissing ? 'text-red-600' : 'text-green-600'}`}>
                    {isCachingMissing ? "❌" : "✓"}
                  </span>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D]">Active Page Memory Caching</h4>
                    <p className="text-[14.5px] text-[#1E293B] mt-1 leading-[1.6]">
                      {isCachingMissing ? (
                        "Active Page Cache is disabled. Without caching, your server is forced to rebuild your web page from scratch for every single visitor. This behaves like printing a new book every time someone wants to read it, slowing responses and overloading resources."
                      ) : (
                        "Active Page Cache is enabled! Your server successfully delivers pre-built static versions of your pages, protecting response speed."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className={`text-[20px] leading-none ${isTtfbHigh ? 'text-red-600' : 'text-green-600'}`}>
                    {isTtfbHigh ? "❌" : "✓"}
                  </span>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D]">Server Response Time (TTFB): {ttfb}ms</h4>
                    <p className="text-[14.5px] text-[#1E293B] mt-1 leading-[1.6]">
                      {isTtfbHigh ? (
                        "Your hosting server takes over 500ms just to acknowledge requests. This is typically caused by budget shared hosting (like Bluehost or Hostinger shared tiers). Optimizing website code won't fix a congested shared hosting server environment."
                      ) : (
                        "Your hosting server responses are healthy. The server starts sending files to the browser under standard 500ms benchmarks."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className={`text-[20px] leading-none ${isPluginsHigh ? 'text-amber-500' : 'text-green-600'}`}>
                    {isPluginsHigh ? "⚠️" : "✓"}
                  </span>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D]">WordPress Plugin Bloat: {pluginCount} plugins</h4>
                    <p className="text-[14.5px] text-[#1E293B] mt-1 leading-[1.6]">
                      {isPluginsHigh ? (
                        `Your page source indicates ${pluginCount} active WordPress plugins. Every active plugin loads extra script files and style packages, which blocks browser rendering and decreases load speed. Cleaning inactive or bloated plugins is highly recommended.`
                      ) : (
                        `Your page source indicates a clean plugin footprint of ${pluginCount} plugins. This minimizes script conflicts and performance leaks.`
                      )}
                    </p>
                  </div>
                </div>

                {hasBuilder && (
                  <div className="flex gap-4">
                    <span className="text-[#C4A35A] text-[20px] leading-none">ℹ</span>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#0D0D0D]">Page Builder Detected: {pageBuilder}</h4>
                      <p className="text-[14.5px] text-[#1E293B] mt-1 leading-[1.6]">
                        Your page is styled using the {pageBuilder} layout engine. While convenient for layout adjustments, builders inject heavy structural nesting (bloat) into the HTML source, requiring advanced speed optimization settings to bypass.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-[20px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
                2. AI Search Engine &amp; AEO Audit
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className={`text-[20px] leading-none ${!hasLocalBusinessSchema ? 'text-red-600' : 'text-green-600'}`}>
                    {!hasLocalBusinessSchema ? "❌" : "✓"}
                  </span>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D]">Business Entity Schema</h4>
                    <p className="text-[14.5px] text-[#1E293B] mt-1 leading-[1.6]">
                      {!hasLocalBusinessSchema ? (
                        "Your homepage lacks LocalBusiness or Organization structured data. AI crawlers (like OpenAI&apos;s GPTBot or Perplexity) look for these standardized schema definitions to extract business operating hours, contact coordinates, and location fields. Without this, your business remains invisible to structured AI query results."
                      ) : (
                        `LocalBusiness/Organization schema detected! Schema types found: ${schemaTypes.join(", ")}. This allows AI agents to accurately parse and verify your business details.`
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className={`text-[20px] leading-none ${!hasReviewSchema ? 'text-amber-500' : 'text-green-600'}`}>
                    {!hasReviewSchema ? "⚠️" : "✓"}
                  </span>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D]">Review &amp; Rating Schema</h4>
                    <p className="text-[14.5px] text-[#1E293B] mt-1 leading-[1.6]">
                      {!hasReviewSchema ? (
                        "Your website doesn't display review or rating schema. AI search engines use AggregateRating structures to cross-verify business quality signals. Schema-based ratings directly influence your citation priority in AI recommendations."
                      ) : (
                        "Review/Rating schema successfully detected! This signals trust and quality directly to algorithmic crawls."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className={`text-[20px] leading-none ${isAiBlocked ? 'text-red-600' : 'text-green-600'}`}>
                    {isAiBlocked ? "❌" : "✓"}
                  </span>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D]">AI Agent Access (robots.txt)</h4>
                    <p className="text-[14.5px] text-[#1E293B] mt-1 leading-[1.6]">
                      {isAiBlocked ? (
                        "Your robots.txt rules explicitly block AI search engines (like GPTBot, ClaudeBot, or PerplexityBot) from crawling your site content. While this protects intellectual property, it completely prevents your services from being recommended or cited in conversational AI search results."
                      ) : (
                        "Your robots.txt allows AI crawlers. This ensures ChatGPT and other LLMs can read your pages and list you as an active source."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className={`text-[20px] leading-none ${!llmsTxtPresent ? 'text-amber-500' : 'text-green-600'}`}>
                    {!llmsTxtPresent ? "⚠️" : "✓"}
                  </span>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D]">AI Context Index File (llms.txt)</h4>
                    <p className="text-[14.5px] text-[#1E293B] mt-1 leading-[1.6]">
                      {!llmsTxtPresent ? (
                        "No llms.txt file detected. Creating a public llms.txt file is the emerging standard to guide LLM crawlers, instructing them exactly how to summarize your page structures and read your services without scraping irrelevant layout blocks."
                      ) : (
                        "llms.txt file found! Your site provides a clean, markdown-based guide for LLMs to read and summarize your expertise efficiently."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[20px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
                3. Raw Performance Metrics (Mobile)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 bg-white border border-[#E2E8F0] p-8 rounded-lg shadow-sm">
                <div>
                  <span className="text-[11px] uppercase text-[#1E293B] block font-bold">Visual Load Time (Speed Index)</span>
                  <span className="text-[24px] font-bold text-[#0D0D0D] block mt-1">{loadTime}s</span>
                  <p className="text-[13px] text-[#1E293B] mt-1">Average time for content to visually fill the screen.</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase text-[#1E293B] block font-bold">Mobile Visual Load (LCP)</span>
                  <span className="text-[24px] font-bold text-[#0D0D0D] block mt-1">{details?.lcp ?? 0}s</span>
                  <p className="text-[13px] text-[#1E293B] mt-1">First major text block or image load benchmark.</p>
                </div>
                <div className="border-t border-[#E2E8F0] pt-4 md:border-t-0 md:pt-0">
                  <span className="text-[11px] uppercase text-[#1E293B] block font-bold">Page Freeze Delay (TBT)</span>
                  <span className="text-[24px] font-bold text-[#0D0D0D] block mt-1">{details?.tbt ?? 0}ms</span>
                  <p className="text-[13px] text-[#1E293B] mt-1">Time browser freezes due to heavy background scripts.</p>
                </div>
                <div className="border-t border-[#E2E8F0] pt-4">
                  <span className="text-[11px] uppercase text-[#1E293B] block font-bold">Total Page Weight</span>
                  <span className="text-[24px] font-bold text-[#0D0D0D] block mt-1">{pageSize} MB</span>
                  <p className="text-[13px] text-[#1E293B] mt-1">Size of homepage resources loaded on mobile network.</p>
                </div>
              </div>
            </div>
          </section>

          <div className="border-left border-l-4 border-l-[#C4A35A] pl-6 my-12 text-[18px] leading-[1.8] text-[#0D0D0D] font-semibold">
            The Cost of Inaction: If your website continues to load slowly and lacks structure for AI engines, over {estimatedLostPercent}% of prospective clients will choose competitors whose sites stabilized instantly and ranked inside conversational answers.
          </div>

          <section className="bg-white border border-[#E2E8F0] p-8 rounded-lg shadow-sm text-center">
            <span className="text-[11px] font-bold tracking-[0.1em] text-[#C4A35A] uppercase block mb-2">Recommended Solution</span>
            <h2 className="text-[24px] font-serif text-[#725921] mb-4">WordPress Performance &amp; AI Optimization Plan</h2>
            <p className="text-[15px] text-[#1E293B] leading-[1.7] max-w-[640px] mx-auto mb-8">
              {name}, resolving this doesn&apos;t require rebuilding your site or deleting your builder. We can configure server caching, audit plugin bottlenecks, optimize page assets, and inject schema definitions to restore your speeds and AI search presence in 48 hours.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a 
                href="https://cal.com/naveengaur/30min" 
                target="_blank" 
                rel="noreferrer"
                className="w-full md:w-auto bg-[#C4A35A] text-[#0D0D0D] px-8 py-4 rounded-sm text-[13px] font-bold tracking-[0.05em] uppercase hover:bg-[#d4b46a] transition-colors"
              >
                Book 15-Min Optimization Call
              </a>
            </div>
            <p className="text-[11px] text-[#1E293B] mt-4 italic">
              * Or reply directly to the email link that was sent to your inbox.
            </p>
          </section>

          <div className="mt-16 pt-8 border-t border-[#E2E8F0] text-[15px] text-[#1E293B] leading-[1.8] font-medium">
            <strong>Naveen Gaur</strong><br />
            WordPress &amp; Full-Stack Developer • Technical Architect<br />
            <a href="mailto:hello@naveengaur.com" className="text-[#C4A35A] hover:underline">hello@naveengaur.com</a>
          </div>
        </main>

        <footer className="border-t border-[#E2E8F0] py-8 bg-white mt-24 text-center text-[12px] text-[#1E293B]">
          <div className="max-w-[860px] mx-auto px-6">
            <p>© {new Date().getFullYear()} Naveen Gaur. All rights reserved. Private Client Audit Portal.</p>
          </div>
        </footer>
      </div>
    );
  }

  // CASE 2: Static MDX Audit (Fallback to pre-compiled gray-matter file)
  const audit = getAuditBySlug(slug);
  if (!audit) notFound();
  
  const { meta, content } = audit;

  const customStyles = `
    :root {
      --accent: #C4A35A;
      --text-dark: #0D0D0D;
      --text-muted: #1E293B;
      --text-paragraph: #0D0D0D;
    }
    
    .lead-paragraph {
      font-size: 18px !important;
      color: #725921 !important;
      font-weight: 700 !important;
      line-height: 1.6 !important;
      margin-bottom: 24px;
    }

    .business-impact-box {
      border-left: 4px solid #C4A35A;
      padding: 8px 0 8px 24px;
      margin: 36px 0 48px 0;
      font-size: 18.5px !important;
      line-height: 1.8 !important;
      color: #0D0D0D !important;
      font-weight: 600 !important;
    }

    .callout-box {
      background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
      color: #0D0D0D;
      padding: 30px;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      border-left: 6px solid #C4A35A;
      margin: 35px 0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01);
    }

    .callout-box h3 {
      color: #725921 !important;
      margin-top: 0 !important;
      font-size: 18px !important;
      font-weight: 700 !important;
      margin-bottom: 10px !important;
    }

    .callout-box p {
      color: #0D0D0D !important;
      margin-bottom: 0 !important;
      font-size: 15px !important;
      font-weight: 500 !important;
      line-height: 1.6 !important;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 30px 0;
    }

    .stat-card {
      background: #FFFFFF;
      border-top: 4px solid #C4A35A;
      border-radius: 8px;
      padding: 20px 25px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
      border-left: 1px solid #E2E8F0;
      border-right: 1px solid #E2E8F0;
      border-bottom: 1px solid #E2E8F0;
    }

    .stat-card.negative {
      border-top-color: #EF4444;
    }

    .stat-card.positive {
      border-top-color: #10B981;
    }

    .stat-value {
      font-family: var(--font-serif), serif;
      font-size: 40px;
      font-weight: 700;
      display: block;
      margin-bottom: 5px;
    }

    .stat-value.red-text { color: #DC2626; }
    .stat-value.green-text { color: #059669; }

    .stat-label {
      font-size: 11px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
    }

    .finding-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 25px;
      padding: 20px;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      background: #FFFFFF;
      box-shadow: 0 1px 3px rgba(0,0,0,0.01);
    }

    .finding-icon {
      font-size: 24px;
      margin-right: 20px;
      background: #F8FAFC;
      padding: 10px;
      border-radius: 8px;
      min-width: 64px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #E2E8F0;
    }

    .finding-content h3 {
      margin: 0 0 8px 0 !important;
      font-size: 16px;
      color: #0D0D0D !important;
      font-weight: 700;
    }

    .finding-content p {
      margin: 0 !important;
      font-size: 14.5px !important;
      color: #0D0D0D !important;
      line-height: 1.6 !important;
      font-weight: 500 !important;
    }

    .footer-closing {
      text-align: center;
      margin-top: 60px;
      padding-top: 40px;
      border-top: 1px solid #E2E8F0;
    }

    .footer-quote {
      font-family: var(--font-serif), serif;
      font-size: 20px;
      font-style: italic;
      color: #0D0D0D;
      max-width: 600px;
      margin: 0 auto 20px auto;
      line-height: 1.5;
      font-weight: 600;
    }

    .contact-details {
      font-size: 17px !important;
      color: #1E293B !important;
      margin-top: 30px;
      line-height: 1.8 !important;
      font-weight: 600 !important;
    }

    .contact-details strong {
      font-size: 20px !important;
      color: #0D0D0D !important;
      display: inline-block;
      margin-bottom: 6px;
    }

    article.prose p {
      color: #0D0D0D !important;
      font-weight: 500 !important;
      margin-bottom: 24px !important;
      line-height: 1.8 !important;
    }
    
    article.prose ul, article.prose ol {
      margin-bottom: 24px !important;
      padding-left: 24px !important;
    }
    
    article.prose li {
      color: #0D0D0D !important;
      font-weight: 500 !important;
      margin-bottom: 16px !important;
      line-height: 1.8 !important;
      list-style-type: disc !important;
    }
    
    article.prose li::marker {
      color: #C4A35A !important;
    }

    article.prose strong {
      color: #0D0D0D !important;
      font-weight: 700 !important;
    }

    article.prose h2, article.prose h3 {
      color: #0D0D0D !important;
      font-weight: 700 !important;
      margin-top: 40px !important;
      margin-bottom: 16px !important;
    }

    @media print {
      body {
        background: white !important;
        color: black !important;
      }
      header, main, section, div, p, span, td, th, h1, h2, h3, a, li, ul, strong {
        color: black !important;
        background: none !important;
        text-shadow: none !important;
        box-shadow: none !important;
      }
      .print\\:hidden {
        display: none !important;
      }
      .print\\:bg-none {
        background: none !important;
      }
      .print\\:border-none {
        border: none !important;
      }
      .print\\:text-black {
        color: black !important;
      }
      .print\\:border-b-2 {
        border-bottom-width: 2px !important;
        border-color: #000000 !important;
      }
      .print\\:border-black\\/10 {
        border-color: #000000 !important;
      }
      .print\\:prose-black {
        color: black !important;
      }
      .page-break {
        page-break-before: always;
        break-before: always;
      }
      h2, h3 { 
        page-break-after: avoid; 
        break-after: avoid; 
      }
      .finding-item, .stat-card, .callout-box, table, tr { 
        page-break-inside: avoid; 
        break-inside: avoid; 
        border: 2px solid #000000 !important;
        background: #ffffff !important;
      }
      .callout-box {
        border-left: 8px solid #000000 !important;
      }
      .stat-card.negative, .stat-card.positive {
        border-top: 6px solid #000000 !important;
      }
      th {
        border-bottom: 2px solid #000000 !important;
        font-weight: bold !important;
      }
    }
  `;

  return (
    <>
      <Nav />
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <div className="fixed top-20 left-0 w-full z-45 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-slate-200 py-3 px-6 md:px-10 flex justify-between items-center print:hidden shadow-sm">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C4A35A] animate-pulse"></span>
          <span className="text-[12px] font-mono tracking-widest text-[#725921] uppercase font-bold">
            Private Client Portal
          </span>
        </div>
        
        <span className="px-3.5 py-1 bg-[#C4A35A]/10 border border-[#C4A35A]/20 text-[#725921] rounded-full text-[10.5px] font-bold tracking-widest uppercase shadow-sm">
          Confidential Analysis
        </span>
      </div>

      <main className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] pt-36 pb-24 px-6 md:px-10 selection:bg-[#C4A35A] selection:text-[#0D0D0D]">
        <div className="max-w-[860px] mx-auto">
          
          <header className="text-center mb-16 border-b border-slate-200 pb-12 print:border-b-2 print:border-black">
            <h1 className="font-serif text-[clamp(32px,5vw,48px)] text-[#0D0D0D] tracking-[0.01em] leading-[1.2] mb-6">
              {meta.clientName}: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#725921] via-[#C4A35A] to-[#0D0D0D] print:text-black print:bg-none">
                Executive Visibility &amp; Growth Audit
              </span>
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-[680px] mx-auto mt-10 p-7 bg-white border border-slate-200 rounded-xl text-left print:bg-none print:border-none print:text-black shadow-sm">
              <div>
                <span className="block text-slate-500 uppercase tracking-widest font-bold text-[14px] mb-2 print:text-black/60">Client Site</span>
                <a href={meta.url} target="_blank" rel="noopener noreferrer" className="text-[19px] font-bold text-[#0D0D0D] hover:text-[#C4A35A] transition-colors print:text-black underline block">
                  {meta.url.replace("https://", "").replace("www.", "")}
                </a>
              </div>
              <div>
                <span className="block text-slate-500 uppercase tracking-widest font-bold text-[14px] mb-2 print:text-black/60">Prepared By</span>
                <span className="text-[19px] font-bold text-[#0D0D0D] print:text-black block">Naveen Gaur</span>
              </div>
              <div>
                <span className="block text-slate-500 uppercase tracking-widest font-bold text-[14px] mb-2 print:text-black/60">Date of Audit</span>
                <span className="text-[19px] font-bold text-[#0D0D0D] print:text-black block">{meta.auditDate}</span>
              </div>
            </div>
          </header>

          <section className="mb-14 print:break-inside-avoid">
            <h2 className="font-serif text-[20px] text-slate-500 tracking-wider uppercase mb-6 text-center print:text-black/80 font-bold">
              Google PageSpeed Diagnostics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Performance", score: meta.mobileScore },
                { label: "Accessibility", score: meta.mobileAccessibility },
                { label: "Best Practices", score: meta.mobileBestPractices },
                { label: "SEO", score: meta.mobileSeo },
              ].map((card, idx) => (
                <div key={idx} className="p-6 bg-white border border-slate-200 rounded-xl text-center print:border-none print:bg-none print:text-black shadow-sm">
                  <span className={`block font-serif text-[44px] font-bold mb-2 leading-none ${getScoreColorClass(card.score).split(" ")[0]} print:text-black`}>
                    {card.score}
                  </span>
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider print:text-black/60">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[14px] text-slate-700 text-center mt-6 italic print:text-black/50 font-semibold">
              * Scores reflect Google mobile simulation (the primary basis for ranking organic searches).
            </p>
          </section>

          <section className="mb-16 print:break-inside-avoid">
            <h2 className="font-serif text-[20px] text-slate-500 tracking-wider uppercase mb-6 text-center print:text-black/80 font-bold">
              The Five Core Speed Measurements
            </h2>
            <div className="table-wrapper overflow-x-auto rounded-xl border border-slate-200 bg-white print:border-none print:bg-none print:text-black shadow-sm">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 print:border-b-2 print:border-black">
                    <th className="p-4 text-[#1E293B] font-bold uppercase tracking-wider text-[11px] print:text-black">Measurement</th>
                    <th className="p-4 text-[#1E293B] font-bold uppercase tracking-wider text-[11px] print:text-black">🖥️ Desktop</th>
                    <th className="p-4 text-[#1E293B] font-bold uppercase tracking-wider text-[11px] print:text-black">📱 Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "First Contentful Paint (FCP)", key: "fcp", desktop: meta.desktopFcp, mobile: meta.mobileFcp },
                    { name: "Largest Contentful Paint (LCP)", key: "lcp", desktop: meta.desktopLcp, mobile: meta.mobileLcp },
                    { name: "Total Blocking Time (TBT)", key: "tbt", desktop: meta.desktopTbt, mobile: meta.mobileTbt },
                    { name: "Cumulative Layout Shift (CLS)", key: "cls", desktop: meta.desktopCls, mobile: meta.mobileCls },
                    { name: "Speed Index", key: "speed_index", desktop: meta.desktopSpeedIndex, mobile: meta.mobileSpeedIndex },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0 print:border-b print:border-black/10">
                      <td className="p-4 font-semibold text-[#0D0D0D] print:text-black">{row.name}</td>
                      <td className="p-4">
                        <span className="font-semibold mr-2 print:text-black text-[#0D0D0D]">{row.desktop}</span>
                        <span className={`inline-block px-2.5 py-0.5 border rounded-full text-[9px] font-bold uppercase ${getBadgeColorClass(row.desktop, row.key)} print:text-black print:border-black`}>
                          {getBadgeText(row.desktop, row.key)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold mr-2 print:text-black text-[#0D0D0D]">{row.mobile}</span>
                        <span className={`inline-block px-2.5 py-0.5 border rounded-full text-[9px] font-bold uppercase ${getBadgeColorClass(row.mobile, row.key)} print:text-black print:border-black`}>
                          {getBadgeText(row.mobile, row.key)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <article className="prose max-w-none print:prose-black">
            <MDXRemote 
              source={content} 
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                }
              }}
            />
          </article>

        </div>
      </main>
      
      <Footer />
    </>
  );
}
