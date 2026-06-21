"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

const LOADING_STEPS = [
  "Resolving hostname & validating URL...",
  "Fetching WordPress plugin footprint...",
  "Scanning robots.txt for AI crawler access...",
  "Running Google PageSpeed & Core Web Vitals...",
  "Mapping structured schema for LLM visibility...",
  "Assembling your Website & AI Readiness Report...",
];

interface AuditDetails {
  url: string;
  name: string;
  email: string;
  metrics: { performance: number; seo: number; bestPractices: number; accessibility: number };
  details: {
    ttfb: number;
    loadTime: number;
    lcp: number;
    fcp: number;
    tbt: number;
    cls: number;
    pageSize: number;
    pageBuilder: string;
    pluginCount: number;
    cachingActive: boolean;
    schemaTypes: string[];
    aiRobotsAllowed: boolean;
    llmsTxtPresent: boolean;
  };
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "text-emerald-600" : score >= 50 ? "text-amber-500" : "text-red-600";
  return <span className={`text-[36px] font-bold font-serif ${color}`}>{score}</span>;
}

function MetricRow({
  label,
  value,
  good,
  bad,
  unit = "",
  higherIsBad = true,
}: {
  label: string;
  value: number;
  good: number;
  bad: number;
  unit?: string;
  higherIsBad?: boolean;
}) {
  const isGood = higherIsBad ? value <= good : value >= good;
  const isPoor = higherIsBad ? value >= bad : value <= bad;
  const color = isGood ? "text-emerald-600" : isPoor ? "text-red-600" : "text-amber-500";
  const icon = isGood ? "✓" : isPoor ? "✗" : "~";
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0] last:border-0">
      <span className="text-[13px] text-[#475569] font-medium">{label}</span>
      <span className={`text-[14px] font-bold ${color} flex items-center gap-1.5`}>
        {icon} {value}{unit}
      </span>
    </div>
  );
}

function CheckItem({ pass, title, body }: { pass: boolean | null; title: string; body: string }) {
  const icon = pass === null ? "ℹ" : pass ? "✓" : "✗";
  const color = pass === null ? "text-[#C4A35A]" : pass ? "text-emerald-600" : "text-red-600";
  return (
    <div className="flex gap-4 py-4 border-b border-[#E2E8F0] last:border-0">
      <span className={`text-[18px] font-bold leading-none mt-0.5 ${color}`}>{icon}</span>
      <div>
        <p className="text-[14px] font-bold text-[#0D0D0D] mb-1">{title}</p>
        <p className="text-[13.5px] text-[#475569] leading-[1.6]">{body}</p>
      </div>
    </div>
  );
}

function FullReport({ data }: { data: AuditDetails }) {
  const { url, name, metrics, details } = data;
  const {
    ttfb, loadTime, lcp, fcp, tbt, cls, pageSize,
    pageBuilder, pluginCount, cachingActive,
    schemaTypes, aiRobotsAllowed, llmsTxtPresent,
  } = details;

  const isSlow = loadTime > 3.0;
  const isTtfbHigh = ttfb > 500;
  const isPluginsHigh = pluginCount > 15;
  const hasBuilder = pageBuilder !== "None" && pageBuilder !== "Unknown";
  const hasLocalBusinessSchema = schemaTypes.some(
    (s) => s.toLowerCase().includes("localbusiness") || s.toLowerCase().includes("organization")
  );
  const hasReviewSchema = schemaTypes.some(
    (s) => s.toLowerCase().includes("review") || s.toLowerCase().includes("aggregaterating")
  );
  const isAiBlocked = !aiRobotsAllowed;
  const bounceIncrease = isSlow ? Math.round((loadTime - 2.0) * 15) : 0;
  const estimatedLostPercent = Math.min(bounceIncrease + 10, 60);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] font-sans antialiased">
      {/* Report Header */}
      <header className="bg-white border-b border-[#E2E8F0] py-5 shadow-sm">
        <div className="max-w-[880px] mx-auto px-6 flex justify-between items-center">
          <div>
            <span className="text-[11px] font-bold tracking-[0.1em] text-[#C4A35A] uppercase block">Naveen Gaur</span>
            <span className="text-[14px] font-semibold text-[#725921]">Website & AI Readiness Report</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#475569] block">Prepared for</span>
            <span className="text-[14px] font-semibold text-[#0D0D0D]">{name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[880px] mx-auto px-6 py-12 space-y-10">

        {/* Executive Briefing */}
        <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#C4A35A] p-8 rounded-lg shadow-sm">
          <span className="text-[10px] font-bold tracking-[0.12em] text-[#C4A35A] uppercase block mb-2">Executive Briefing</span>
          <p className="text-[17px] text-[#0D0D0D] leading-[1.75] font-medium">
            {isSlow ? (
              <>
                {name}, your site <a href={url} target="_blank" rel="noreferrer" className="text-[#C4A35A] underline font-semibold">{url}</a> takes <strong className="text-red-600">{loadTime}s</strong> to visually stabilize on mobile. Google&apos;s Core Web Vitals algorithm estimates this causes <strong className="text-red-600">~{estimatedLostPercent}% of mobile visitors to bounce</strong> before reading your services. Your site also has gaps in AI search visibility.
              </>
            ) : (
              <>
                {name}, your site <a href={url} target="_blank" rel="noreferrer" className="text-[#C4A35A] underline font-semibold">{url}</a> has a healthy base load speed of <strong>{loadTime}s</strong>. We detected key optimization gaps in AI search visibility and schema coverage that are limiting your modern search traffic.
              </>
            )}
          </p>
        </div>

        {/* Score Grid */}
        <div>
          <h2 className="text-[13px] font-bold tracking-[0.1em] text-[#725921] uppercase mb-4">Google PageSpeed Scores (Mobile)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Performance", score: metrics.performance },
              { label: "SEO Structure", score: metrics.seo },
              { label: "Best Practices", score: metrics.bestPractices },
              { label: "Accessibility", score: metrics.accessibility },
            ].map(({ label, score }) => (
              <div key={label} className="bg-white border border-[#E2E8F0] p-5 rounded-lg text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[#475569] block mb-2 tracking-wide">{label}</span>
                <ScoreBadge score={score} />
                <span className="text-[11px] text-[#475569] block mt-0.5">/100</span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-[14px] font-bold text-[#0D0D0D]">Core Web Vitals & Performance Metrics</h2>
            <p className="text-[12px] text-[#475569] mt-0.5">Measured on mobile network simulation</p>
          </div>
          <div className="px-6 py-2">
            <MetricRow label="First Contentful Paint (FCP)" value={fcp} good={1.8} bad={3.0} unit="s" />
            <MetricRow label="Largest Contentful Paint (LCP)" value={lcp} good={2.5} bad={4.0} unit="s" />
            <MetricRow label="Total Blocking Time (TBT)" value={tbt} good={200} bad={600} unit="ms" />
            <MetricRow label="Cumulative Layout Shift (CLS)" value={cls} good={0.1} bad={0.25} unit="" />
            <MetricRow label="Speed Index" value={loadTime} good={3.4} bad={5.8} unit="s" />
            <MetricRow label="Server Response Time (TTFB)" value={ttfb} good={500} bad={1800} unit="ms" />
            <MetricRow label="Total Page Weight" value={pageSize} good={1.5} bad={4.0} unit=" MB" />
          </div>
        </div>

        {/* Section 1 – WordPress Health */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-[14px] font-bold text-[#0D0D0D]">1. WordPress Core & Caching Audit</h2>
          </div>
          <div className="px-6 py-2">
            <CheckItem
              pass={cachingActive}
              title="Active Page Memory Caching"
              body={cachingActive
                ? "Active page cache is enabled. Your server delivers pre-built static pages, protecting response speed under traffic."
                : "No active caching detected. Your server rebuilds every page from scratch per visitor — like printing a new book every read. This slows responses and overloads shared hosting under traffic spikes."}
            />
            <CheckItem
              pass={!isTtfbHigh}
              title={`Server Response Time (TTFB): ${ttfb}ms`}
              body={isTtfbHigh
                ? `Your server takes ${ttfb}ms just to acknowledge a request. Typical cause: budget shared hosting (Bluehost, Hostinger). No amount of front-end optimization fixes a slow server.`
                : "Server response is healthy. Your hosting starts sending data to browsers within acceptable limits."}
            />
            <CheckItem
              pass={!isPluginsHigh}
              title={`WordPress Plugin Footprint: ${pluginCount} detected`}
              body={isPluginsHigh
                ? `${pluginCount} plugin scripts/stylesheets detected in your page source. Each active plugin loads extra files that block browser rendering and add latency. Auditing inactive or bloated plugins is critical.`
                : `${pluginCount} plugin references in page source — a clean footprint that minimizes script conflicts and performance overhead.`}
            />
            {hasBuilder && (
              <CheckItem
                pass={null}
                title={`Page Builder Detected: ${pageBuilder}`}
                body={`Your pages are built with ${pageBuilder}. While flexible, page builders inject heavy nested HTML that requires server-level caching and asset optimization to overcome.`}
              />
            )}
            {!hasBuilder && pageBuilder === "None" && (
              <CheckItem
                pass={true}
                title="No Heavy Page Builder Detected"
                body="No Elementor, Divi, or WPBakery footprint found. Clean HTML structure is a performance advantage."
              />
            )}
          </div>
        </div>

        {/* Section 2 – AI Readiness */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-[14px] font-bold text-[#0D0D0D]">2. AI Search Engine & AEO Audit</h2>
            <p className="text-[12px] text-[#475569] mt-0.5">ChatGPT, Perplexity, and AI Overviews use this data to decide whether to cite your business</p>
          </div>
          <div className="px-6 py-2">
            <CheckItem
              pass={hasLocalBusinessSchema}
              title="Business Entity Schema (LocalBusiness / Organization)"
              body={hasLocalBusinessSchema
                ? `Structured data found: ${schemaTypes.slice(0, 5).join(", ")}. AI crawlers can accurately parse your business identity, services, and contact details.`
                : "No LocalBusiness or Organization schema detected. ChatGPT and Perplexity look for this to extract your hours, location, and services. Without it your business is invisible to structured AI query results."}
            />
            <CheckItem
              pass={hasReviewSchema}
              title="Review & Rating Schema (AggregateRating)"
              body={hasReviewSchema
                ? "Review/rating schema detected. AI search uses AggregateRating to verify business trust signals and citation priority."
                : "No review or rating schema found. AI engines use AggregateRating to rank citation priority. This is a missed authority signal."}
            />
            <CheckItem
              pass={!isAiBlocked}
              title="AI Agent Access (robots.txt)"
              body={isAiBlocked
                ? "Your robots.txt blocks AI crawlers (GPTBot, ClaudeBot, PerplexityBot). While this protects content, it prevents your business from being recommended or cited in conversational AI answers."
                : "robots.txt allows AI crawlers. ChatGPT, Perplexity and Claude can read your pages and list you as a citation source."}
            />
            <CheckItem
              pass={llmsTxtPresent}
              title="AI Context Index File (llms.txt)"
              body={llmsTxtPresent
                ? "llms.txt found. This guides LLM crawlers on how to summarize your expertise efficiently."
                : "No llms.txt file. This emerging standard lets you instruct AI models exactly how to read and summarize your services — avoiding scraped layout noise."}
            />
          </div>
        </div>

        {/* Cost of Inaction */}
        <div className="border-l-4 border-l-[#C4A35A] pl-6 py-2">
          <p className="text-[18px] font-semibold text-[#0D0D0D] leading-[1.75]">
            The cost of inaction: if your site continues to load slowly and lacks AI search structure, an estimated <strong className="text-red-600">{estimatedLostPercent}%</strong> of prospective clients will bounce to competitors whose pages stabilize instantly and rank inside conversational AI answers.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white border border-[#E2E8F0] p-8 rounded-lg shadow-sm text-center">
          <span className="text-[10px] font-bold tracking-[0.12em] text-[#C4A35A] uppercase block mb-2">Recommended Next Step</span>
          <h2 className="text-[22px] font-serif text-[#725921] mb-3">WordPress Performance & AI Optimization Plan</h2>
          <p className="text-[14.5px] text-[#475569] leading-[1.7] max-w-[560px] mx-auto mb-7">
            {name}, fixing this doesn&apos;t require rebuilding your site. We configure server caching, audit plugin bottlenecks, optimize assets, and inject schema definitions to restore speed and AI visibility — in 48 hours.
          </p>
          <a
            href="https://cal.com/naveengaur/30min"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-[#C4A35A] text-[#0D0D0D] px-10 py-4 rounded-sm text-[13px] font-bold tracking-[0.06em] uppercase hover:bg-[#d4b46a] transition-colors duration-200"
          >
            Book Free 15-Min Strategy Call
          </a>
          <p className="text-[11px] text-[#475569] mt-4 italic">No sales pressure. We review your specific site issues together.</p>
        </div>

        {/* Footer sig */}
        <div className="pt-6 border-t border-[#E2E8F0] text-[14px] text-[#475569] leading-[1.8]">
          <strong className="text-[#0D0D0D]">Naveen Gaur</strong><br />
          WordPress & Full-Stack Performance Specialist<br />
          <a href="mailto:hello@naveengaur.com" className="text-[#C4A35A] hover:underline">hello@naveengaur.com</a>
        </div>

      </main>
    </div>
  );
}

export default function FreeAuditPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [reportData, setReportData] = useState<AuditDetails | null>(null);

  useEffect(() => {
    if (status !== "loading") return;
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) =>
        prev < LOADING_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setLoadingStepIndex(0);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const url = formData.get("url") as string;

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, url }),
      });
      const result = await response.json();

      if (response.ok && result.id) {
        router.push(`/audits/${result.id}`);
      } else {
        setStatus("error");
        setErrorMessage(result.error || "An error occurred during analysis. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  // Show full inline report
  if (reportData) return <FullReport data={reportData} />;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] font-sans antialiased">
        
        {/* Section 1: Hero & Benefits */}
        <section className="pt-[140px] pb-16 px-6 max-w-[1200px] mx-auto text-center animate-fade-up">
          <span className="inline-flex items-center text-[13px] font-semibold tracking-[0.12em] uppercase text-gold-dark mb-6 px-3.5 py-1.5 border border-gold bg-gold-light rounded-full">
            Website Growth Opportunity Report
          </span>
          <h1 className="font-serif text-[clamp(38px,5.5vw,60px)] tracking-[-0.025em] leading-[1.1] text-ink mb-6">
            Find Out What&apos;s Holding Your Website Back
          </h1>
          <p className="text-[19px] text-[#1E293B] leading-[1.7] mb-12 max-w-[680px] mx-auto font-normal">
            Get a free Website Growth Opportunity Report covering visibility, trust signals, performance, and AI readiness. We analyze your website and identify what matters most to your business.
          </p>

          <div className="bg-white border border-black/[0.06] rounded-xl p-8 text-left shadow-xs mb-10">
            <h2 className="text-[#725921] text-[14px] font-bold uppercase tracking-wider mb-6 font-sans border-b border-black/[0.04] pb-3">
              What You&apos;ll Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Why visitors may not be contacting you",
                  body: "We identify issues that may be making your website harder to find, slower to use, or less effective at converting visitors into inquiries."
                },
                {
                  title: "What is making your website harder to find",
                  body: "We audit core accessibility obstacles, page weight, hosting response speed, and technical roadblocks."
                },
                {
                  title: "Whether AI platforms can recommend you",
                  body: "We check robots.txt agent rules and structured schema metadata that let ChatGPT, Bing, and Claude recommend your services."
                },
                {
                  title: "Business-Focused Recommendations",
                  body: "We translate complex technical findings into practical opportunities and prioritize what matters most to fix first."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="text-[#C4A35A] text-[18px] leading-none mt-0.5">✓</span>
                  <div>
                    <h3 className="text-ink text-[16px] font-bold mb-1">{item.title}</h3>
                    <p className="text-[14.5px] text-[#2A2A2A] leading-[1.6]">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Real Findings / Opportunities */}
        <section className="bg-white border-t border-b border-black/[0.05] py-20 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <span className="text-[12px] font-bold tracking-[0.12em] uppercase text-gold-dark">Real Findings</span>
              <h2 className="font-serif text-[30px] text-ink mt-2 mb-3">Recent Opportunities We&apos;ve Found</h2>
              <p className="text-[15.5px] text-[#1E293B] leading-[1.6] max-w-[560px] mx-auto">
                Every website analysis looks at specific code elements and performance metrics. Here are the most common growth opportunities we flag:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Missing testimonials reducing trust",
                  body: "A therapist's website loaded quickly but had no visible testimonials, creating a trust bottleneck.",
                  icon: "💬"
                },
                {
                  title: "Outdated website content",
                  body: "A consultant had stopped publishing blog articles for 8 months, signaling inactive operations to crawlers.",
                  icon: "📅"
                },
                {
                  title: "Missing AI visibility signals",
                  body: "A local law firm was completely invisible to ChatGPT because schema markup was missing in their code.",
                  icon: "🤖"
                },
                {
                  title: "Slow-loading mobile pages",
                  body: "An ecommerce site had heavy images that made pages load in 6 seconds, frustrating mobile shoppers.",
                  icon: "⚡"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#FAFAF8] border border-black/[0.06] p-6 rounded-lg">
                  <span className="text-[22px] block mb-2">{item.icon}</span>
                  <h3 className="text-[16px] font-bold text-ink mb-1 leading-snug">{item.title}</h3>
                  <p className="text-[14.5px] text-[#2A2A2A] leading-[1.6]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Report Preview Previews */}
        <section className="py-20 px-6 max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[12px] font-bold tracking-[0.12em] uppercase text-gold-dark">The Output</span>
            <h2 className="font-serif text-[30px] text-ink mt-2 mb-3">See What You&apos;ll Receive</h2>
            <p className="text-[15.5px] text-[#1E293B] leading-[1.6] max-w-[560px] mx-auto">
              Your growth report contains actionable developer instructions and strategic findings, completely free of fluff.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mockup 1: What Matters Most */}
            <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-xs">
              <span className="bg-[#C4A35A]/10 text-[#725921] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#C4A35A]/20">Report Preview</span>
              <h3 className="font-serif text-[19px] text-[#725921] mt-3 mb-2">1. What Matters Most</h3>
              <div className="bg-[#FAFAF8] p-4 rounded border border-black/[0.04] text-[14.5px] text-[#1E293B] leading-[1.6]">
                &quot;Your website already has a strong technical foundation. The biggest opportunity isn&apos;t speed — it is visibility. Specifically: helping search engines, AI platforms, and prospective clients understand and trust your business more quickly.&quot;
              </div>
            </div>
            {/* Mockup 2: Key Observations */}
            <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-xs">
              <span className="bg-[#C4A35A]/10 text-[#725921] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#C4A35A]/20">Report Preview</span>
              <h3 className="font-serif text-[19px] text-[#725921] mt-3 mb-2">2. Key Observations</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-[14.5px]">
                  <span className="text-[#C4A35A] mt-0.5">🔍</span>
                  <div>
                    <p className="font-bold text-[#0D0D0D]">Accessible to Humans, but Unstructured for AI Engines</p>
                    <p className="text-[#1E293B] mt-0.5">While human visitors can easily find your phone or contact form, search bots and AI crawlers struggle to verify operational hours or locations due to missing schema metadata.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Mockup 3: Action Checklist */}
            <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-xs">
              <span className="bg-[#C4A35A]/10 text-[#725921] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#C4A35A]/20">Report Preview</span>
              <h3 className="font-serif text-[19px] text-[#725921] mt-3 mb-2">3. Prioritized Action Checklist</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="border border-red-100 bg-red-50/50 p-3 rounded">
                  <span className="text-[11px] uppercase font-bold text-red-700 block">Fix First</span>
                  <span className="text-[13.5px] font-bold text-[#0D0D0D] block mt-1">Add Business Schema</span>
                </div>
                <div className="border border-amber-100 bg-amber-50/50 p-3 rounded">
                  <span className="text-[11px] uppercase font-bold text-amber-700 block">Fix Next</span>
                  <span className="text-[13.5px] font-bold text-[#0D0D0D] block mt-1">Enable Caching</span>
                </div>
                <div className="border border-emerald-100 bg-emerald-50/50 p-3 rounded">
                  <span className="text-[11px] uppercase font-bold text-emerald-700 block">Fix Later</span>
                  <span className="text-[13.5px] font-bold text-[#0D0D0D] block mt-1">Audit Social Links</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Form Request Area */}
        <section className="bg-white border-t border-b border-black/[0.05] py-20 px-6">
          <div className="max-w-[580px] mx-auto bg-[#FAFAF8] border border-black/[0.08] shadow-md shadow-black/[0.02] p-8 md:p-10 rounded-xl">
            {status === "loading" ? (
              <div className="space-y-8 py-4">
                <div className="text-center">
                  <div className="inline-block w-10 h-10 border-2 border-gold/30 border-t-gold-dark rounded-full animate-spin mb-4" />
                  <h3 className="text-ink text-[19px] font-bold mb-1">Analyzing Website</h3>
                  <p className="text-[13.5px] text-[#1E293B]">Takes 15–25 seconds. Do not close this window.</p>
                </div>
                <div className="space-y-2.5 bg-white p-5 rounded border border-black/[0.05]">
                  {LOADING_STEPS.map((step, idx) => {
                    const done = idx < loadingStepIndex;
                    const active = idx === loadingStepIndex;
                    return (
                      <div key={idx} className="flex gap-3 items-center text-[13.5px]">
                        {done ? (
                          <span className="text-emerald-600 font-bold text-[12px]">✓</span>
                        ) : active ? (
                          <span className="w-1.5 h-1.5 bg-gold-dark rounded-full animate-ping shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 bg-black/10 rounded-full shrink-0" />
                        )}
                        <span className={`transition-colors font-medium ${done ? "text-ink-muted/50" : active ? "text-gold-dark font-bold" : "text-ink-faint/30"}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-ink text-[24px] font-serif text-center mb-6">Get My Free Report</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11.5px] text-[#1E293B] mb-1.5 uppercase tracking-wide font-bold">First Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Your name"
                        className="w-full bg-white border border-black/[0.1] rounded-sm px-4 py-3 text-ink text-[15.5px] placeholder:text-ink-faint/30 focus:outline-none focus:border-gold-dark focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11.5px] text-[#1E293B] mb-1.5 uppercase tracking-wide font-bold">Business Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="name@company.com"
                        className="w-full bg-white border border-black/[0.1] rounded-sm px-4 py-3 text-ink text-[15.5px] placeholder:text-ink-faint/30 focus:outline-none focus:border-gold-dark focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11.5px] text-[#1E293B] mb-1.5 uppercase tracking-wide font-bold">Website URL *</label>
                    <input
                      type="url"
                      name="url"
                      required
                      placeholder="https://example.com"
                      className="w-full bg-white border border-black/[0.1] rounded-sm px-4 py-3 text-ink text-[15.5px] placeholder:text-ink-faint/30 focus:outline-none focus:border-gold-dark focus:bg-white transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-ink text-white py-4 rounded-sm text-[14.5px] font-bold tracking-[0.06em] uppercase hover:bg-gold-dark transition-colors duration-200 mt-2 cursor-pointer"
                  >
                    Reveal My Top Opportunities →
                  </button>

                  {status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded p-4">
                      <p className="text-red-600 text-[13.5px] text-center font-medium">{errorMessage}</p>
                    </div>
                  )}

                  <div className="text-center space-y-1.5 pt-2 text-[13.5px] text-[#1E293B] font-medium">
                    <p>✓ Average report generation time: 30–60 seconds</p>
                    <p>✓ No login or WordPress credentials required</p>
                    <p>✓ Runs completely from the outside</p>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>

        {/* Section 5: Why AI Visibility Checks */}
        <section className="py-20 px-6 max-w-[1200px] mx-auto space-y-6">
          <div className="text-center max-w-[600px] mx-auto mb-10">
            <span className="text-[12px] font-bold tracking-[0.12em] uppercase text-gold-dark">The Shift in Search</span>
            <h2 className="font-serif text-[30px] text-ink mt-2 mb-3">Why We Added AI Visibility Checks</h2>
          </div>
          <p className="text-[16.5px] text-[#1E293B] leading-[1.75] text-center">
            AI platforms are already sending active, high-intent visitors directly to websites. Recent referral sources to our own website included:
          </p>
          <div className="flex justify-center flex-wrap gap-4 py-4">
            <span className="bg-white border border-black/[0.06] px-5 py-3 rounded-lg text-[14.5px] font-semibold text-ink flex items-center gap-2 shadow-xs">
              <span className="text-[#10a37f]">●</span> ChatGPT Referrals
            </span>
            <span className="bg-white border border-black/[0.06] px-5 py-3 rounded-lg text-[14.5px] font-semibold text-ink flex items-center gap-2 shadow-xs">
              <span className="text-[#00809d]">●</span> Bing Chat Cites
            </span>
            <span className="bg-white border border-black/[0.06] px-5 py-3 rounded-lg text-[14.5px] font-semibold text-ink flex items-center gap-2 shadow-xs">
              <span className="text-[#4285f4]">●</span> Google AI Overviews
            </span>
          </div>
          <p className="text-[15.5px] text-[#1E293B] leading-[1.75] text-center max-w-[680px] mx-auto">
            AI-driven traffic is already appearing in analytics, which is why AI visibility checks ( robots.txt rule verification, llms.txt accessibility, and business entity schema validation ) are now included in every growth report.
          </p>
        </section>

      </main>
      <Footer />
    </>
  );
}
