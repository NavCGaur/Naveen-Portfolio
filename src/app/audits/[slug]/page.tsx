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

function getScoreLabel(score: number): string {
  if (score >= 8) return "Strong";
  if (score >= 5) return "Moderate";
  return "Needs Work";
}

function getScoreLabelColorClass(score: number): string {
  if (score >= 8) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 5) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
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

    const reportUrl = `https://naveengaur.com/audits/${slug}`;
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
    // Business identification
    const businessName = details?.businessName ?? name;
    // Layer 1 objective facts
    const hasMissingH1 = details?.hasMissingH1 ?? false;
    const hasMissingMetaDesc = details?.hasMissingMetaDesc ?? false;
    const hasOutdatedCopyright = details?.hasOutdatedCopyright ?? false;
    const noPhoneNumber = details?.noPhoneNumber ?? false;
    const noCtaButton = details?.noCtaButton ?? false;
    const noSocialLinks = details?.noSocialLinks ?? false;
    const imagesWithoutAlt = details?.imagesWithoutAlt ?? 0;
    const lcp = details?.lcp ?? 0;
    const tbt = details?.tbt ?? 0;

    const blog = details?.blog;
    const credibility = details?.credibility;
    const localSeo = details?.localSeo;
    const onlineAuthority = details?.onlineAuthority;
    const testimonials = details?.testimonials;
    const contact = details?.contact;
    const aiObservations = audit.aiObservations ?? [];
    const executiveSummary = audit.executiveSummary ?? "";
    const businessCategory = audit.businessCategory ?? "professional-service";

    // Resolve Credibility details & score fallbacks
    const hasAboutPage = credibility?.hasAboutPage ?? false;
    const hasTeamPage = credibility?.hasTeamPage ?? false;
    const hasPrivacyPolicy = credibility?.hasPrivacyPolicy ?? false;
    const hasTerms = credibility?.hasTerms ?? false;
    const hasTestimonialsValue = credibility?.hasTestimonials ?? (testimonials?.found ?? false);
    const hasReviewSchemaValue = credibility?.hasReviewSchema ?? (schemaTypes.some(s => s.toLowerCase().includes("review") || s.toLowerCase().includes("aggregaterating")));
    const hasSocialLinksValue = credibility?.hasSocialLinks ?? !noSocialLinks;
    const hasAddressValue = credibility?.hasAddress ?? (contact?.hasAddress ?? false);
    const hasPhoneValue = credibility?.hasPhone ?? !noPhoneNumber;

    let calculatedCredibilityScore = credibility?.score;
    if (calculatedCredibilityScore === undefined || calculatedCredibilityScore === 0) {
      let credScore = 0;
      if (hasAboutPage) credScore += 1;
      if (hasTeamPage) credScore += 1;
      if (hasPrivacyPolicy) credScore += 1;
      if (hasTerms) credScore += 0.5;
      if (hasTestimonialsValue) credScore += 2;
      if (hasReviewSchemaValue) credScore += 1.5;
      if (hasSocialLinksValue) credScore += 1.5;
      if (hasAddressValue) credScore += 1;
      if (hasPhoneValue) credScore += 1.5;
      calculatedCredibilityScore = Math.min(Math.round(credScore), 10);
    }

    // Local SEO Score fallback
    const hasLocalSchemaVal = localSeo?.hasLocalSchema ?? (schemaTypes.some(s => s.toLowerCase().includes("localbusiness") || s.toLowerCase().includes("organization")));
    const hasMapsEmbedVal = localSeo?.hasMapsEmbed ?? (contact?.hasMapsEmbed ?? false);
    const hasCityInH1Val = localSeo?.hasCityInH1 ?? false;
    const hasServiceAreaVal = localSeo?.hasServiceArea ?? false;
    const hasBusinessHoursVal = localSeo?.hasBusinessHours ?? (contact?.hasBusinessHours ?? false);

    let calculatedLocalSeoScore = localSeo?.score;
    if (calculatedLocalSeoScore === undefined || calculatedLocalSeoScore === 0) {
      let localScore = 0;
      if (hasPhoneValue) localScore += 1.5;
      if (hasAddressValue) localScore += 1.5;
      if (hasLocalSchemaVal) localScore += 2;
      if (hasMapsEmbedVal) localScore += 1.5;
      if (hasCityInH1Val) localScore += 1;
      if (hasServiceAreaVal) localScore += 1;
      if (hasBusinessHoursVal) localScore += 1.5;
      calculatedLocalSeoScore = Math.min(Math.round((localScore / 8) * 10), 10);
    }

    // Online Authority Score fallback
    const hasAboutOrTeamVal = onlineAuthority?.hasAboutOrTeam ?? (hasAboutPage || hasTeamPage);
    const hasTestimonialsVal = onlineAuthority?.hasTestimonials ?? hasTestimonialsValue;
    const hasReviewSchemaVal = onlineAuthority?.hasReviewSchema ?? hasReviewSchemaValue;
    const hasSocialLinksVal = onlineAuthority?.hasSocialLinks ?? hasSocialLinksValue;
    const hasLegalPagesVal = onlineAuthority?.hasLegalPages ?? (hasPrivacyPolicy && hasTerms);
    const hasGoodSpeedOrCacheVal = onlineAuthority?.hasGoodSpeedOrCache ?? (ttfb < 500 || cachingActive);

    let calculatedOnlineAuthorityScore = onlineAuthority?.score;
    if (calculatedOnlineAuthorityScore === undefined || calculatedOnlineAuthorityScore === 0) {
      let onlineAuthScore = 0;
      if (hasAboutOrTeamVal) onlineAuthScore += 2;
      if (hasTestimonialsVal) onlineAuthScore += 2;
      if (hasReviewSchemaVal) onlineAuthScore += 1.5;
      if (hasSocialLinksVal) onlineAuthScore += 1.5;
      if (hasLegalPagesVal) onlineAuthScore += 1.5;
      if (hasGoodSpeedOrCacheVal) onlineAuthScore += 2;
      if (loadTime < 3.0) onlineAuthScore += 1.5;
      calculatedOnlineAuthorityScore = Math.min(Math.round(onlineAuthScore), 10);
    }

    const discoveryScore = businessCategory === "local-service" 
      ? calculatedLocalSeoScore 
      : calculatedOnlineAuthorityScore;
    const discoveryLabel = businessCategory === "local-service" 
      ? "Local Search Readiness" 
      : "Online Discovery & Authority";

    const isSlow = loadTime > 3.0;
    const isTtfbHigh = ttfb > 500;
    const isPluginsHigh = pluginCount > 15;
    const hasBuilder = pageBuilder !== "None" && pageBuilder !== "Unknown";
    const isCachingMissing = !cachingActive;
    const hasLocalBusinessSchema = schemaTypes.some(s => s.toLowerCase().includes("localbusiness") || s.toLowerCase().includes("organization"));
    const hasReviewSchema = schemaTypes.some(s => s.toLowerCase().includes("review") || s.toLowerCase().includes("aggregaterating"));
    const isAiBlocked = !aiRobotsAllowed;

    // Verdict helpers for Mobile section
    const lcpVerdict = lcp === 0 ? null : lcp <= 2.5 ? "good" : lcp <= 4.0 ? "needs-work" : "poor";
    const tbtVerdict = tbt === 0 ? null : tbt <= 200 ? "good" : tbt <= 600 ? "needs-work" : "poor";
    const speedVerdict = loadTime === 0 ? null : loadTime <= 3.4 ? "good" : loadTime <= 5.8 ? "needs-work" : "poor";
    const sizeVerdict = pageSize === 0 ? null : pageSize < 2 ? "good" : pageSize < 5 ? "needs-work" : "poor";

    const verdictLabel = (v: string | null) =>
      v === "good" ? "Fast ✓" : v === "needs-work" ? "Needs Improvement ⚠️" : v === "poor" ? "Slow ❌" : "N/A";
    const verdictColor = (v: string | null) =>
      v === "good" ? "text-emerald-700" : v === "needs-work" ? "text-amber-700" : v === "poor" ? "text-red-700" : "text-[#475569]";

    // Layer 1 observed facts count
    const observedIssues = [
      hasMissingH1, 
      hasMissingMetaDesc, 
      hasOutdatedCopyright, 
      noPhoneNumber, 
      noCtaButton, 
      noSocialLinks, 
      imagesWithoutAlt > 0
    ].filter(Boolean).length;

    // Build list of contradictions dynamically based on findings
    const contradictionBullets: Array<{ title: string; body: string }> = [];

    // 1. Content Cadence Shift
    if (blog && blog.exists && blog.contentSlowing) {
      contradictionBullets.push({
        title: "Strong Content Library, but Publishing Has Slowed",
        body: `Your website has a solid content footprint of ${blog.totalPosts} articles, but recent publishing intervals show a slowdown (${blog.recentAvgIntervalDays} days average vs. ${blog.historicAvgIntervalDays} days historically). Resuming a regular rhythm keeps search engines crawling your site frequently.`
      });
    }

    // 2. Performance vs Trust
    const foundationScore = Math.round((performance + seo + accessibility) / 3);
    if (foundationScore >= 80 && (!testimonials || !testimonials.found || (credibility && credibility.score < 5))) {
      contradictionBullets.push({
        title: "Excellent Performance, but Low Trust Signals",
        body: "Your site loads extremely fast on mobile devices, but it currently lacks visible testimonials or reviews. Adding verified client stories is the single most important factor for converting this fast-loading traffic."
      });
    }

    // 3. Contactable vs AI Visibility
    if (contact && (contact.hasPhone || contact.hasEmail || contact.hasForm) && !hasLocalBusinessSchema) {
      contradictionBullets.push({
        title: "Accessible to Humans, but Unstructured for AI Engines",
        body: "While human visitors can easily locate your contact details on the page, search engines and AI chatbots may struggle to reliably extract and verify your operational information (like business name, hours, or services) due to missing structured schema metadata in your site's code."
      });
    }

    // Build dynamic list of top opportunities sorted by priority / impact
    const opportunitiesList = [];
    
    if (!hasLocalBusinessSchema || isAiBlocked || !llmsTxtPresent) {
      opportunitiesList.push({
        id: "ai-visibility",
        title: "Improve AI Search Visibility",
        impact: "High",
        difficulty: "Easy",
        time: "1–2 hrs",
        why: !hasLocalBusinessSchema 
          ? "No Organization or LocalBusiness structured schema detected in homepage code." 
          : isAiBlocked 
          ? "AI crawler agents are currently restricted in your robots.txt file." 
          : "Missing llms.txt standard representation for LLM indexing.",
        body: "AI engines like ChatGPT and search bots like Perplexity look for structured details (like Schema markup) and open access rules to discover and recommend your business in conversational answers."
      });
    }

    if (!testimonials || !testimonials.found) {
      opportunitiesList.push({
        id: "testimonials",
        title: "Add Client Testimonials",
        impact: "High",
        difficulty: "Easy",
        time: "1–2 hrs",
        why: "No client testimonials or reviews were detected on your homepage.",
        body: "Your homepage currently lacks visible client stories or reviews. Social proof is the single most critical factor for converting website traffic into direct inquiries."
      });
    }

    if (isCachingMissing) {
      opportunitiesList.push({
        id: "caching",
        title: "Enable Page Caching",
        impact: "Medium",
        difficulty: "Easy",
        time: "<1 hr",
        why: "Your hosting response headers do not show active caching parameters.",
        body: "Without server caching, your website re-generates every page from scratch for every single visitor. Caching helps handle traffic spikes smoothly without slowing down."
      });
    }

    if (blog && blog.exists && blog.contentSlowing) {
      opportunitiesList.push({
        id: "blog-cadence",
        title: "Resume Consistent Publishing",
        impact: "Medium",
        difficulty: "Medium",
        time: "2–4 hrs",
        why: `Recent publishing rhythm has slowed down (${blog.recentAvgIntervalDays} days average vs ${blog.historicAvgIntervalDays} days historically).`,
        body: "Your site has a solid library of content, but publishing has slowed down recently. Setting up a consistent rhythm signals active operations to both Google and AI search engines."
      });
    }

    if (isSlow) {
      opportunitiesList.push({
        id: "speed",
        title: "Reduce Page Load Weight",
        impact: "Medium",
        difficulty: "Medium",
        time: "2–4 hrs",
        why: `PageSpeed visual load time measured at ${loadTime}s on simulated mobile networks.`,
        body: "A lighter page loads faster on mobile networks. Compressing images and optimizing assets will reduce page weight for faster mobile browsing and better user experience."
      });
    }

    if (hasMissingMetaDesc || hasMissingH1) {
      opportunitiesList.push({
        id: "seo-basics",
        title: "Fix Core SEO Structure",
        impact: "Medium",
        difficulty: "Easy",
        time: "1 hr",
        why: hasMissingH1 ? "Missing a primary H1 heading on the homepage." : "Missing homepage meta description tag.",
        body: "Your page is missing a primary H1 title or meta description. Standardizing these core SEO elements ensures correct header ranking and clean snippet presentation in search results."
      });
    }

    // Get top 3 opportunities sorted by Impact (High first)
    const sortedOpportunities = opportunitiesList.sort((a, b) => {
      const impactMap: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      return impactMap[b.impact] - impactMap[a.impact];
    }).slice(0, 3);

    // Assemble dynamic list of recommendations
    const fixFirstRecs = [];
    const fixNextRecs = [];
    const fixLaterRecs = [];

    // FIX FIRST
    if (!hasLocalBusinessSchema) {
      fixFirstRecs.push({
        task: "Add Business Schema",
        impact: "High",
        effort: "Low",
        why: "No Organization or LocalBusiness schema detected in homepage code."
      });
    }
    if (isCachingMissing) {
      fixFirstRecs.push({
        task: "Enable Page Caching",
        impact: "High",
        effort: "Low",
        why: "Your hosting response headers do not show active caching parameters."
      });
    }
    if (isSlow) {
      fixFirstRecs.push({
        task: "Fix Mobile Loading Speed",
        impact: "High",
        effort: "Medium",
        why: `PageSpeed visual load time measured at ${loadTime}s on simulated mobile networks.`
      });
    }
    if (isAiBlocked) {
      fixFirstRecs.push({
        task: "Allow AI Agents in robots.txt",
        impact: "High",
        effort: "Low",
        why: "Robots.txt contains rules blocking GPTBot, ClaudeBot, or Perplexity."
      });
    }

    // FIX NEXT
    if (!testimonials || !testimonials.found) {
      fixNextRecs.push({
        task: "Add Social Proof & Reviews",
        impact: "Medium",
        effort: "Medium",
        why: "No client testimonials or reviews were detected on your homepage."
      });
    }
    if (!blog || !blog.exists) {
      fixNextRecs.push({
        task: "Launch Company Blog / Resource Page",
        impact: "Medium",
        effort: "Medium",
        why: "No active blog section or RSS feed was found on your website."
      });
    } else if (blog.contentSlowing) {
      fixNextRecs.push({
        task: "Resume Consistent Blog Cadence",
        impact: "Medium",
        effort: "Medium",
        why: `Recent publishing rhythm slowed down to ${blog.recentAvgIntervalDays} days average interval.`
      });
    }
    if (!llmsTxtPresent) {
      fixNextRecs.push({
        task: "Create llms.txt Context File",
        impact: "Medium",
        effort: "Low",
        why: "No llms.txt summary index file was found at your root domain."
      });
    }
    if (imagesWithoutAlt > 15) {
      fixNextRecs.push({
        task: "Bulk Add Image Alt Descriptions",
        impact: "Medium",
        effort: "Medium",
        why: `PageSpeed audit flagged ${imagesWithoutAlt} images on your homepage missing alt text.`
      });
    }
    if (contact && (!contact.hasPhone || (!contact.hasForm && !contact.hasEmail))) {
      fixNextRecs.push({
        task: "Resolve Contact Access Friction",
        impact: "Medium",
        effort: "Low",
        why: "Homepage lacks a visible phone number or direct communication channels."
      });
    }

    // FIX LATER
    if (hasOutdatedCopyright) {
      fixLaterRecs.push({
        task: "Update Footer Copyright Year",
        impact: "Low",
        effort: "Low",
        why: "Your footer copyright statement displays an outdated year."
      });
    }
    if (imagesWithoutAlt > 0 && imagesWithoutAlt <= 15) {
      fixLaterRecs.push({
        task: "Add Image Alt Descriptions",
        impact: "Low",
        effort: "Low",
        why: `PageSpeed audit flagged ${imagesWithoutAlt} images on your homepage missing alt text.`
      });
    }
    if (noSocialLinks) {
      fixLaterRecs.push({
        task: "Link Social Profiles in Footer",
        impact: "Low",
        effort: "Low",
        why: "No active links to Facebook, Instagram, LinkedIn, or YouTube detected."
      });
    }

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
          {/* Section 0: Title */}
          <div className="mb-8 text-center md:text-left">
            <span className="bg-[#C4A35A]/10 text-[#725921] border border-[#C4A35A]/30 text-[10px] font-bold uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-full">
              Website Growth Opportunity Report
            </span>
            <h1 className="text-[clamp(32px,4.5vw,46px)] font-serif tracking-[-0.02em] text-[#725921] mt-4 mb-2 leading-[1.15]">
              {businessName} — Growth Opportunity Report
            </h1>
            <p className="text-[14px] text-[#475569] font-light">
              Analysis conducted on {dateStr} • <a href={url} target="_blank" rel="noreferrer" className="text-[#C4A35A] hover:underline font-medium">{url}</a>
            </p>
          </div>

          {/* What We Like — positive observations first to reduce defensiveness */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs mb-8">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#725921] mb-5">What We Like About Your Website</h2>
            <div className="space-y-4">
              {/* Positive: server is healthy */}
              {!isTtfbHigh && (
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                  <div>
                    <p className="text-[14.5px] font-semibold text-[#0D0D0D] leading-snug">Healthy hosting infrastructure</p>
                    <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your server responds quickly, which is the foundation a well-performing website needs.</p>
                  </div>
                </div>
              )}
              {/* Positive: caching is on */}
              {!isCachingMissing && (
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                  <div>
                    <p className="text-[14.5px] font-semibold text-[#0D0D0D] leading-snug">Page caching is active</p>
                    <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your site is set up to serve pages efficiently, which protects speed under real traffic.</p>
                  </div>
                </div>
              )}
              {/* Positive: AI crawlers are allowed */}
              {!isAiBlocked && (
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                  <div>
                    <p className="text-[14.5px] font-semibold text-[#0D0D0D] leading-snug">Open to modern AI search</p>
                    <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your website allows AI platforms like ChatGPT and Bing to crawl and reference your content.</p>
                  </div>
                </div>
              )}
              {/* Positive: site loads under 4 seconds */}
              {!isSlow && (
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                  <div>
                    <p className="text-[14.5px] font-semibold text-[#0D0D0D] leading-snug">Acceptable mobile load speed</p>
                    <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your pages load within a reasonable range, meaning most visitors won't immediately drop off.</p>
                  </div>
                </div>
              )}
              {/* Positive: schema found */}
              {hasLocalBusinessSchema && (
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                  <div>
                    <p className="text-[14.5px] font-semibold text-[#0D0D0D] leading-snug">Business identity structured for search</p>
                    <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Google and AI tools can identify your business type and core details from your website's code.</p>
                  </div>
                </div>
              )}
              {/* Fallback positive if all checks pass */}
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                <div>
                  <p className="text-[14.5px] font-semibold text-[#0D0D0D] leading-snug">Clear, established web presence</p>
                  <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">You already have a website that represents your business — the optimizations below build on that foundation.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Section: What Matters Most & Executive Summary */}
          <div className="bg-[#FAFAF8] border border-black/[0.08] rounded-xl p-7 mb-8 shadow-xs">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#725921] mb-4">What Matters Most</h2>
            
            {/* Dynamic performance summary */}
            <div className="text-[16px] font-medium text-[#0D0D0D] leading-[1.6] mb-5 font-serif">
              {foundationScore >= 80 ? (
                <p>
                  Your website already has a strong technical foundation. The biggest opportunity isn&apos;t speed — it is <strong>visibility and trust</strong>. Specifically: helping search engines, AI platforms, and prospective clients understand and trust your business more quickly.
                </p>
              ) : (
                <p>
                  The primary bottleneck for your website is <strong>technical performance</strong>. Slow mobile loading times create friction for incoming visitors. Prioritize enabling page caching and reducing asset weight to build a stable foundation, then focus on authority and AI visibility.
                </p>
              )}
            </div>

            {/* Factual Executive Summary generated by Gemini */}
            {executiveSummary && (
              <div className="border-t border-black/[0.05] pt-5 mb-5 text-[14.5px] text-[#475569] leading-[1.6]">
                <p className="italic font-light">"{executiveSummary}"</p>
              </div>
            )}

            {/* Programmatic Contradictions list */}
            {contradictionBullets.length > 0 && (
              <div className="border-t border-black/[0.05] pt-5 space-y-4">
                <span className="block text-[11px] uppercase font-bold text-[#475569] tracking-wider mb-2">Key Observations</span>
                {contradictionBullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-[13.5px]">
                    <span className="text-[16px] shrink-0 mt-0.5">🔍</span>
                    <div>
                      <p className="font-bold text-[#0D0D0D] leading-snug">{bullet.title}</p>
                      <p className="text-[#475569] mt-0.5 leading-[1.5]">{bullet.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Synthesis observations */}
          {aiObservations && aiObservations.length > 0 && (
            <div className="bg-gradient-to-br from-[#725921]/5 via-[#C4A35A]/5 to-[#FAFAF8] border border-[#C4A35A]/30 rounded-xl p-7 shadow-xs mb-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[18px]">✨</span>
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#725921]">AI Strategic Synthesis</h2>
                <span className="ml-auto bg-[#C4A35A]/15 text-[#725921] border border-[#C4A35A]/30 text-[9px] font-bold uppercase tracking-[0.05em] px-2.5 py-0.5 rounded-full">Gemini Insights</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiObservations.map((obs, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-xs border border-black/[0.05] p-5 rounded-lg shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-[14px] font-bold text-[#725921] mb-2 font-serif">{obs.title}</h3>
                      <p className="text-[13px] text-[#475569] leading-[1.6]">{obs.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Growth Audit Score Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Card 1: Technical Foundation */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-xs text-center flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold text-[#475569] block mb-2 tracking-wide">Technical Foundation</span>
                <div className="text-[44px] font-bold font-serif text-[#725921] leading-none my-2">
                  {Math.round((performance + seo + accessibility) / 3)}<span className="text-[20px] font-sans text-[#475569]/60 font-normal">/100</span>
                </div>
                <p className="text-[13px] text-[#475569] px-2 leading-[1.5]">Speed index, caching status, core web vitals, and search accessibility.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-black/[0.04]">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  Math.round((performance + seo + accessibility) / 3) >= 80 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : Math.round((performance + seo + accessibility) / 3) >= 50
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {Math.round((performance + seo + accessibility) / 3) >= 80 ? "Healthy" : Math.round((performance + seo + accessibility) / 3) >= 50 ? "Needs Work" : "Critical"}
                </span>
              </div>
            </div>

            {/* Card 2: Trust & Credibility */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-xs text-center flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold text-[#475569] block mb-2 tracking-wide">Trust &amp; Credibility</span>
                <div className="text-[44px] font-bold font-serif text-[#725921] leading-none my-2">
                  {Math.round(calculatedCredibilityScore * 10)}<span className="text-[20px] font-sans text-[#475569]/60 font-normal">/100</span>
                </div>
                <p className="text-[13px] text-[#475569] px-2 leading-[1.5]">Customer stories, team transparency, social proof, and legal trust pages.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-black/[0.04]">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  Math.round(calculatedCredibilityScore * 10) >= 70 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : Math.round(calculatedCredibilityScore * 10) >= 40
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {Math.round(calculatedCredibilityScore * 10) >= 70 ? "Strong" : Math.round(calculatedCredibilityScore * 10) >= 40 ? "Moderate" : "Weak"}
                </span>
              </div>
            </div>

            {/* Card 3: AI & Discovery Readiness */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-xs text-center flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold text-[#475569] block mb-2 tracking-wide">{discoveryLabel}</span>
                <div className="text-[44px] font-bold font-serif text-[#725921] leading-none my-2">
                  {Math.round(discoveryScore * 10)}<span className="text-[20px] font-sans text-[#475569]/60 font-normal">/100</span>
                </div>
                <p className="text-[13px] text-[#475569] px-2 leading-[1.5]">Structured schema data, AI bot rules, and organic discovery signals.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-black/[0.04]">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  Math.round(discoveryScore * 10) >= 75 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : Math.round(discoveryScore * 10) >= 45
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {Math.round(discoveryScore * 10) >= 75 ? "Ready" : Math.round(discoveryScore * 10) >= 45 ? "Moderate" : "Weak Signals"}
                </span>
              </div>
            </div>
          </div>

          {/* Business Credibility & Local Search / Online Authority Scores */}
          {credibility && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Credibility card */}
              <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-[#E2E8F0] pb-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#475569]">Business Credibility</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getScoreLabelColorClass(credibility.score)}`}>
                    {credibility.score}/10 — {getScoreLabel(credibility.score)}
                  </span>
                </div>
                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] leading-none shrink-0">{credibility.hasAboutPage ? "✓" : "⚠️"}</span>
                    <span className={credibility.hasAboutPage ? "text-emerald-700 font-semibold" : "text-[#475569]"}>About page linked in navigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] leading-none shrink-0">{credibility.hasTeamPage ? "✓" : "⚠️"}</span>
                    <span className={credibility.hasTeamPage ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Team / Staff section or page</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] leading-none shrink-0">{credibility.hasTestimonials ? "✓" : "⚠️"}</span>
                    <span className={credibility.hasTestimonials ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Customer testimonials visible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] leading-none shrink-0">{credibility.hasReviewSchema ? "✓" : "⚠️"}</span>
                    <span className={credibility.hasReviewSchema ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Structured review schema code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] leading-none shrink-0">{credibility.hasSocialLinks ? "✓" : "⚠️"}</span>
                    <span className={credibility.hasSocialLinks ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Active social media channels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] leading-none shrink-0">{credibility.hasPrivacyPolicy && credibility.hasTerms ? "✓" : "⚠️"}</span>
                    <span className={credibility.hasPrivacyPolicy && credibility.hasTerms ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Standard legal pages (Privacy / Terms)</span>
                  </div>
                </div>
              </div>

              {/* Local SEO scorecard OR Online Authority scorecard depending on business category */}
              {businessCategory === "local-service" && localSeo ? (
                <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-[#E2E8F0] pb-3">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#475569]">Local Search Readiness</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getScoreLabelColorClass(localSeo.score)}`}>
                      {localSeo.score}/10 — {getScoreLabel(localSeo.score)}
                    </span>
                  </div>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{localSeo.hasLocalSchema ? "✓" : "⚠️"}</span>
                      <span className={localSeo.hasLocalSchema ? "text-emerald-700 font-semibold" : "text-[#475569]"}>LocalBusiness schema code configured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{localSeo.hasPhone ? "✓" : "⚠️"}</span>
                      <span className={localSeo.hasPhone ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Phone number visible on homepage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{localSeo.hasAddress ? "✓" : "⚠️"}</span>
                      <span className={localSeo.hasAddress ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Physical address or location visible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{localSeo.hasMapsEmbed ? "✓" : "⚠️"}</span>
                      <span className={localSeo.hasMapsEmbed ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Interactive Google Maps embed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{localSeo.hasBusinessHours ? "✓" : "⚠️"}</span>
                      <span className={localSeo.hasBusinessHours ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Operation hours clearly displayed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{localSeo.hasCityInH1 || localSeo.hasServiceArea ? "✓" : "⚠️"}</span>
                      <span className={localSeo.hasCityInH1 || localSeo.hasServiceArea ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Local keyword presence (City / Service Area)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-[#E2E8F0] pb-3">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#475569]">Online Authority &amp; Discovery</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getScoreLabelColorClass(onlineAuthority?.score ?? 0)}`}>
                      {onlineAuthority?.score ?? 0}/10 — {getScoreLabel(onlineAuthority?.score ?? 0)}
                    </span>
                  </div>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{onlineAuthority?.hasAboutOrTeam ? "✓" : "⚠️"}</span>
                      <span className={onlineAuthority?.hasAboutOrTeam ? "text-emerald-700 font-semibold" : "text-[#475569]"}>About or Team page linked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{onlineAuthority?.hasTestimonials ? "✓" : "⚠️"}</span>
                      <span className={onlineAuthority?.hasTestimonials ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Social proof (testimonials/reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{onlineAuthority?.hasReviewSchema ? "✓" : "⚠️"}</span>
                      <span className={onlineAuthority?.hasReviewSchema ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Aggregate rating / review schema</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{onlineAuthority?.hasSocialLinks ? "✓" : "⚠️"}</span>
                      <span className={onlineAuthority?.hasSocialLinks ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Active social profiles linked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{onlineAuthority?.hasLegalPages ? "✓" : "⚠️"}</span>
                      <span className={onlineAuthority?.hasLegalPages ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Legal trust indicators (Privacy &amp; Terms)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] leading-none shrink-0">{onlineAuthority?.hasGoodSpeedOrCache ? "✓" : "⚠️"}</span>
                      <span className={onlineAuthority?.hasGoodSpeedOrCache ? "text-emerald-700 font-semibold" : "text-[#475569]"}>Technical caching &amp; response speed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Top Opportunities */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs mb-10 overflow-hidden">
            <div className="px-7 pt-6 pb-4 border-b border-[#E2E8F0]">
              <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#725921]">Top Opportunities</h2>
              <p className="text-[13px] text-[#475569] mt-1">Based on your website data, these are the changes most likely to improve customer discovery.</p>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {sortedOpportunities.length > 0 ? (
                sortedOpportunities.map((opp) => (
                  <div key={opp.id} className="px-7 py-5 grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-12 sm:col-span-7">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          opp.impact === "High" 
                            ? "text-red-600 bg-red-50 border-red-100" 
                            : "text-amber-700 bg-amber-50 border-amber-100"
                        }`}>
                          {opp.impact} Impact
                        </span>
                      </div>
                      <p className="text-[14.5px] font-semibold text-[#0D0D0D]">{opp.title}</p>
                      <p className="text-[13px] text-[#475569] mt-1 leading-[1.5]">{opp.body}</p>
                      <p className="text-[11.5px] text-[#725921] italic mt-2">Why we flagged this: {opp.why}</p>
                    </div>
                    <div className="col-span-12 sm:col-span-5 flex sm:justify-end gap-6 text-center mt-2 sm:mt-0">
                      <div>
                        <p className="text-[10px] uppercase text-[#475569] font-bold tracking-wider">Difficulty</p>
                        <p className="text-[13px] font-semibold text-[#0D0D0D] mt-0.5">{opp.difficulty}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-[#475569] font-bold tracking-wider">Est. Time</p>
                        <p className="text-[13px] font-semibold text-[#0D0D0D] mt-0.5">{opp.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-7 py-5">
                  <p className="text-[14px] font-semibold text-emerald-700">✓ No critical opportunities detected.</p>
                  <p className="text-[13px] text-[#475569] mt-1">Your website foundation is solid. Consider focusing on content and authority growth.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Strategy Companion — collapsed into a subtle disclosure widget */}
          <details className="group bg-[#FAFAF8] border border-black/[0.07] rounded-lg mb-12 print:hidden">
            <summary className="flex items-center gap-2 px-5 py-3.5 cursor-pointer list-none text-[13px] font-semibold text-[#475569] hover:text-[#0D0D0D] transition-colors select-none">
              <span className="text-[#C4A35A]">💡</span>
              Want an AI-generated implementation plan?
              <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-[#C4A35A] group-open:opacity-0">Show</span>
            </summary>
            <div className="px-5 pb-5 pt-1 border-t border-black/[0.05]">
              <p className="text-[13px] text-[#475569] leading-[1.6] mb-3">
                This report URL is readable by AI assistants. Share it with <strong>ChatGPT, Gemini, Perplexity, or Claude</strong> to get a tailored developer roadmap.
              </p>
              <div className="bg-white border border-black/[0.06] rounded p-3.5 font-mono text-[12px] text-[#475569] select-all cursor-pointer hover:bg-slate-50 transition-colors">
                "Here is my website audit report: {reportUrl}. Based on these findings, create a step-by-step developer plan to fix the top issues."
              </div>
            </div>
          </details>

          {/* Section 3: Can AI Recommend Your Business? */}
          <section className="mb-12">
            <h2 className="text-[19px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
              1. Can AI Recommend Your Business?
            </h2>
            
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                <span className="text-[13px] uppercase font-bold text-[#475569]">AI Search &amp; Chatbot Audit</span>
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                  hasLocalBusinessSchema && !isAiBlocked
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : !hasLocalBusinessSchema && isAiBlocked
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  Status: {hasLocalBusinessSchema && !isAiBlocked ? "Ready" : !hasLocalBusinessSchema && isAiBlocked ? "Missing Signals" : "Partially Ready"}
                </span>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-3">
                  <span className="text-[18px] leading-none mt-0.5">{hasLocalBusinessSchema ? "✅" : "❌"}</span>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0D0D0D]">Business Entity Schema</h4>
                    <p className="text-[13.5px] text-[#475569] mt-0.5 leading-[1.6]">
                      {hasLocalBusinessSchema 
                        ? "Business schema definitions found. AI engines (like ChatGPT or OpenAI's GPTBot) can successfully identify your operational details."
                        : "No LocalBusiness or Organization schema detected. AI engines require structured data to fetch details like your hours, location, and services."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-[18px] leading-none mt-0.5">{!isAiBlocked ? "✅" : "❌"}</span>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0D0D0D]">AI Agent Access (robots.txt)</h4>
                    <p className="text-[13.5px] text-[#475569] mt-0.5 leading-[1.6]">
                      {!isAiBlocked 
                        ? "AI crawlers are allowed. ChatGPT, Perplexity, and Claude can read your content and cite your website."
                        : "Your configuration blocks AI search crawlers, preventing your business from being recommended in conversational AI search."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-[18px] leading-none mt-0.5">{llmsTxtPresent ? "✅" : "⚠️"}</span>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0D0D0D]">AI Context Index File (llms.txt)</h4>
                    <p className="text-[13.5px] text-[#475569] mt-0.5 leading-[1.6]">
                      {llmsTxtPresent
                        ? "llms.txt file is present. AI crawlers have a clear, summarized guide to read your expertise efficiently."
                        : "No llms.txt file detected. Creating one guides models on how to read and summarize your services without scraping irrelevant layout blocks."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#FAFAF8] border border-black/[0.04] p-4 rounded-lg mt-6 text-[13px] text-[#475569] leading-[1.6]">
                <strong>Why this matters:</strong> AI search engines bypass traditional keywords. They use structured schemas and accessible index files to verify authority and recommend regional businesses.
              </div>
            </div>
          </section>

          {/* Section 4: Website Performance Check */}
          <section className="mb-12">
            <h2 className="text-[19px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
              2. Website Performance Check
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className={`text-[20px] leading-none ${isCachingMissing ? 'text-red-600' : 'text-green-600'}`}>
                  {isCachingMissing ? "❌" : "✓"}
                </span>
                <div>
                  <h4 className="text-[15px] font-bold text-[#0D0D0D]">Active Page Memory Caching</h4>
                  <p className="text-[14.5px] text-[#475569] mt-1 leading-[1.6]">
                    {isCachingMissing ? (
                      "Active Page Cache is disabled. Without caching, your server is forced to rebuild your web page from scratch for every single visitor, slowing down responses and increasing server load under traffic spikes."
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
                  <p className="text-[14.5px] text-[#475569] mt-1 leading-[1.6]">
                    {isTtfbHigh ? (
                      "Your hosting server takes over 500ms just to acknowledge requests. This can be caused by congested hosting environments and affects overall mobile performance."
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
                  <h4 className="text-[15px] font-bold text-[#0D0D0D]">WordPress Plugin Footprint: {pluginCount} plugins</h4>
                  <p className="text-[14.5px] text-[#475569] mt-1 leading-[1.6]">
                    {isPluginsHigh ? (
                      `Your page source loads assets from ${pluginCount} active WordPress plugins. Each active plugin loads extra script files and stylesheets, blocking browser rendering on mobile screens.`
                    ) : (
                      `Your page source indicates a clean plugin footprint of ${pluginCount} plugins. This minimizes script conflicts and performance leaks.`
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Mobile Visitor Experience — verdict cards, not raw numbers */}
          <section className="mb-12">
            <h2 className="text-[19px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
              3. Mobile Visitor Experience
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* LCP */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <p className="text-[11px] uppercase font-bold text-[#475569] tracking-wider mb-2">How fast does your main content appear?</p>
                <p className={`text-[15px] font-bold mb-1 ${verdictColor(lcpVerdict)}`}>{verdictLabel(lcpVerdict)}</p>
                <p className="text-[13px] text-[#475569] leading-[1.5]">
                  {lcpVerdict === "good" && "The main content on your page loads quickly. Visitors on mobile see it within Google's recommended window."}
                  {lcpVerdict === "needs-work" && `Your page's main content takes ${lcp}s to appear — Google recommends under 2.5s for a good mobile experience.`}
                  {lcpVerdict === "poor" && `At ${lcp}s, your page is slow to show its main content. Visitors on mobile are likely to leave before it finishes loading.`}
                  {lcpVerdict === null && "No data available for this metric."}
                </p>
              </div>
              {/* TBT / Interactivity */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <p className="text-[11px] uppercase font-bold text-[#475569] tracking-wider mb-2">Can visitors interact without delay?</p>
                <p className={`text-[15px] font-bold mb-1 ${verdictColor(tbtVerdict)}`}>{verdictLabel(tbtVerdict)}</p>
                <p className="text-[13px] text-[#475569] leading-[1.5]">
                  {tbtVerdict === "good" && "Your page responds quickly to taps and clicks. Background scripts are not blocking the user's experience."}
                  {tbtVerdict === "needs-work" && `Background scripts freeze your page for ${tbt}ms. Visitors may tap buttons and get no response until scripts finish.`}
                  {tbtVerdict === "poor" && `Your page freezes for ${tbt}ms while scripts load — well above Google's 200ms benchmark. Buttons may feel unresponsive on mobile.`}
                  {tbtVerdict === null && "No data available for this metric."}
                </p>
              </div>
              {/* Speed Index / Visual fill */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <p className="text-[11px] uppercase font-bold text-[#475569] tracking-wider mb-2">How quickly does the page look ready?</p>
                <p className={`text-[15px] font-bold mb-1 ${verdictColor(speedVerdict)}`}>{verdictLabel(speedVerdict)}</p>
                <p className="text-[13px] text-[#475569] leading-[1.5]">
                  {speedVerdict === "good" && "Your page fills visually fast — visitors see a fully rendered layout without long blank-screen waits."}
                  {speedVerdict === "needs-work" && `The page takes ${loadTime}s to look complete. Parts of the screen may appear blank or shift while loading.`}
                  {speedVerdict === "poor" && `At ${loadTime}s, your page loads significantly slower than industry benchmarks. Most mobile visitors experience a long blank wait.`}
                  {speedVerdict === null && "No data available for this metric."}
                </p>
              </div>
              {/* Page Weight */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <p className="text-[11px] uppercase font-bold text-[#475569] tracking-wider mb-2">How much data does your homepage load?</p>
                <p className={`text-[15px] font-bold mb-1 ${verdictColor(sizeVerdict)}`}>
                  {sizeVerdict === "good" ? "Lightweight ✓" : sizeVerdict === "needs-work" ? "Moderate ⚠️" : sizeVerdict === "poor" ? "Heavy ❌" : "N/A"}
                </p>
                <p className="text-[13px] text-[#475569] leading-[1.5]">
                  {sizeVerdict === "good" && `Your homepage downloads ${pageSize} MB — well within mobile-friendly limits. Visitors on slower connections load it comfortably.`}
                  {sizeVerdict === "needs-work" && `At ${pageSize} MB, your homepage is moderately sized. Visitors on 4G connections may notice a delay, especially first-time visitors without cached data.`}
                  {sizeVerdict === "poor" && `Your homepage downloads ${pageSize} MB of data — significantly more than recommended. This increases load time noticeably on mobile networks.`}
                  {sizeVerdict === null && "No data available for this metric."}
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Content & Publishing Analysis */}
          <section className="mb-12">
            <h2 className="text-[19px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
              4. Content &amp; Publishing Analysis
            </h2>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs">
              {blog && blog.exists ? (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                    <span className="text-[13px] uppercase font-bold text-[#475569]">Blog / Content Activity</span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      blog.contentSlowing
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : blog.daysSinceLastPost && blog.daysSinceLastPost > 90
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {blog.contentSlowing
                        ? "Publishing Slowdown"
                        : blog.daysSinceLastPost && blog.daysSinceLastPost > 90
                        ? "Inactive Content"
                        : "Active Content Rhythm"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left mb-6">
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[11px] uppercase font-bold text-[#475569] mb-1">Posts in Active Feed</span>
                      <span className="text-[24px] font-serif font-bold text-[#725921]">{blog.totalPosts}</span>
                    </div>
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[11px] uppercase font-bold text-[#475569] mb-1">Last Published</span>
                      <span className="text-[18px] font-semibold text-[#0D0D0D]">
                        {blog.daysSinceLastPost !== undefined
                          ? blog.daysSinceLastPost === 0
                            ? "Today"
                            : blog.daysSinceLastPost === 1
                            ? "Yesterday"
                            : `${blog.daysSinceLastPost} days ago`
                          : "Unknown"}
                      </span>
                    </div>
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[11px] uppercase font-bold text-[#475569] mb-1">Average Interval</span>
                      <span className="text-[18px] font-semibold text-[#0D0D0D]">
                        {blog.avgIntervalDays !== undefined ? `Every ${blog.avgIntervalDays} days` : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="text-[13.5px] text-[#475569] leading-[1.6] space-y-3">
                    {blog.contentSlowing && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-amber-500 font-bold">⚠️</span>
                        <p>
                          <strong>Publishing slowdown detected:</strong> Your recent posting interval has increased to <strong>{blog.recentAvgIntervalDays} days</strong> compared to your historical average of <strong>{blog.historicAvgIntervalDays} days</strong>. Restoring a consistent rhythm signals activity to search engine bots.
                        </p>
                      </div>
                    )}
                    {!blog.contentSlowing && blog.daysSinceLastPost && blog.daysSinceLastPost > 90 && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-red-500 font-bold">⚠️</span>
                        <p>
                          <strong>Content is outdated:</strong> The last post was <strong>{blog.daysSinceLastPost} days ago</strong>. When search engine bots crawl a site that hasn't published fresh content in months, they slow down their crawl frequency.
                        </p>
                      </div>
                    )}
                    {!blog.contentSlowing && (!blog.daysSinceLastPost || blog.daysSinceLastPost <= 90) && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <p>
                          <strong>Active, healthy blogging footprint:</strong> You are consistently updating your website. This is a very positive signal for topical authority and keeps organic traffic coming back.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
                    <span className="text-[13px] uppercase font-bold text-[#475569]">Content Strategy</span>
                    <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-[11px] font-bold">
                      No Blog Detected
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-red-500 text-[18px] mt-0.5">⚠️</span>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#0D0D0D]">Blogging / Articles Section is Missing</h4>
                      <p className="text-[13.5px] text-[#475569] mt-1 leading-[1.6]">
                        We couldn't detect an active RSS blog feed on your website. Starting a structured resource section or company blog is one of the highest-yield activities for service business websites. It creates multiple entry points from Google search queries and positions your brand as a helpful expert.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 7: Trust Signals (Testimonials) */}
          <section className="mb-12">
            <h2 className="text-[19px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
              5. Trust Signals &amp; Credibility
            </h2>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs">
              {testimonials && testimonials.found ? (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                    <span className="text-[13px] uppercase font-bold text-[#475569]">Social Proof Metrics</span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      testimonials.hasNamedAttribution && testimonials.hasPhotos
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {testimonials.hasNamedAttribution && testimonials.hasPhotos ? "Strong Trust Signals" : "Basic Trust Signals"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left mb-6">
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[11px] uppercase font-bold text-[#475569] mb-1">Testimonials Found</span>
                      <span className="text-[24px] font-serif font-bold text-[#725921]">{testimonials.count || "Yes"}</span>
                    </div>
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[11px] uppercase font-bold text-[#475569] mb-1">Named Attribution</span>
                      <span className="text-[18px] font-semibold text-[#0D0D0D]">
                        {testimonials.hasNamedAttribution ? "Yes ✓" : "Missing ⚠️"}
                      </span>
                    </div>
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[11px] uppercase font-bold text-[#475569] mb-1">Client Photos</span>
                      <span className="text-[18px] font-semibold text-[#0D0D0D]">
                        {testimonials.hasPhotos ? "Yes ✓" : "Missing ⚠️"}
                      </span>
                    </div>
                  </div>
                  <div className="text-[13.5px] text-[#475569] leading-[1.6] space-y-3">
                    {!testimonials.hasNamedAttribution && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-amber-500 font-bold">⚠️</span>
                        <p>
                          <strong>Anonymized testimonials reduce trust:</strong> Testimonials without full names or company roles look manufactured. Ensure every review has a clear, authentic client name.
                        </p>
                      </div>
                    )}
                    {!testimonials.hasPhotos && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-amber-500 font-bold">⚠️</span>
                        <p>
                          <strong>No customer headshots detected:</strong> Adding small photos of your clients alongside their reviews increases trust by up to 34% by proving they are real people.
                        </p>
                      </div>
                    )}
                    {!testimonials.hasSchema && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-amber-500 font-bold">⚠️</span>
                        <p>
                          <strong>Missing Review Schema code:</strong> Even though reviews are visually on the page, they aren't coded in a format Google can read. Adding aggregate review schemas can surface gold star ratings in organic Google results.
                        </p>
                      </div>
                    )}
                    {testimonials.hasNamedAttribution && testimonials.hasPhotos && !testimonials.hasSchema && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-[#C4A35A] font-bold">✓</span>
                        <p>
                          <strong>Strong visual trust signals:</strong> The testimonials are well-formatted and attributed, though adding search schema would optimize Google discovery.
                        </p>
                      </div>
                    )}
                    {testimonials.hasNamedAttribution && testimonials.hasPhotos && testimonials.hasSchema && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <p>
                          <strong>Exceptional trust signals:</strong> Your site has fully validated reviews with photos and structured search schema. This maximizes conversions of incoming traffic.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
                    <span className="text-[13px] uppercase font-bold text-[#475569]">Social Proof Strategy</span>
                    <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-[11px] font-bold">
                      No Testimonials Found
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-red-500 text-[18px] mt-0.5">⚠️</span>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#0D0D0D]">Lack of Social Proof on Homepage</h4>
                      <p className="text-[13.5px] text-[#475569] mt-1 leading-[1.6]">
                        We couldn't detect client testimonials or reviews on your homepage. When visitors land on a service website, their primary question is *"Can I trust this business?"* Adding at least 3 detailed testimonials (with full names and photos) will immediately reduce bounce rates and increase contact inquiries.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 8: Contact Accessibility */}
          <section className="mb-12">
            <h2 className="text-[19px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
              6. Contact &amp; Client Accessibility
            </h2>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs">
              {contact ? (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                    <span className="text-[13px] uppercase font-bold text-[#475569]">Contact Channels Audit</span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      contact.hasPhone && (contact.hasEmail || contact.hasForm)
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {contact.hasPhone && (contact.hasEmail || contact.hasForm) ? "Accessible" : "Friction Points Found"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[15px]">{contact.hasPhone ? "✓" : "❌"}</span>
                      <span className="text-[13px] font-medium text-[#475569]">Phone Number</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[15px]">{contact.hasEmail ? "✓" : "❌"}</span>
                      <span className="text-[13px] font-medium text-[#475569]">Email Address</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[15px]">{contact.hasForm ? "✓" : "❌"}</span>
                      <span className="text-[13px] font-medium text-[#475569]">Contact Form</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[15px]">{contact.hasAddress ? "✓" : "❌"}</span>
                      <span className="text-[13px] font-medium text-[#475569]">Physical Address</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[15px]">{contact.hasMapsEmbed ? "✓" : "❌"}</span>
                      <span className="text-[13px] font-medium text-[#475569]">Google Maps Embed</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[15px]">{contact.hasBusinessHours ? "✓" : "❌"}</span>
                      <span className="text-[13px] font-medium text-[#475569]">Business Hours</span>
                    </div>
                  </div>

                  <div className="text-[13.5px] text-[#475569] leading-[1.6] space-y-2">
                    {!contact.hasPhone && (
                      <p className="flex items-start gap-2 text-amber-700">
                        <span className="mt-0.5">⚠️</span>
                        <span><strong>Phone number is missing:</strong> Adding a click-to-call phone number in your header/footer can raise mobile conversion rates by 20% or more.</span>
                      </p>
                    )}
                    {!contact.hasForm && !contact.hasEmail && (
                      <p className="flex items-start gap-2 text-red-700">
                        <span className="mt-0.5">⚠️</span>
                        <span><strong>No online contact path:</strong> We found neither an email link nor a submission form. Visitors have no way to message you directly from the site.</span>
                      </p>
                    )}
                    {contact.hasPhone && (contact.hasEmail || contact.hasForm) && (
                      <p className="flex items-start gap-2 text-emerald-700">
                        <span className="mt-0.5">✓</span>
                        <span><strong>Easy communication paths:</strong> Visitors have multiple ways to contact your business, reducing purchase friction.</span>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-[#475569]">Contact details analysis not available.</p>
              )}
            </div>
          </section>

          {/* Section 7: Prioritized Action Checklist */}
          <section className="mb-12">
            <h2 className="text-[19px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
              7. Prioritized Action Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fix First column */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-1.5 mb-4 border-b border-[#E2E8F0] pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-red-600">Fix First (High Priority)</p>
                </div>
                {fixFirstRecs.length > 0 ? (
                  <ul className="space-y-4">
                    {fixFirstRecs.map((rec, idx) => (
                      <li key={idx} className="border-b border-black/[0.03] pb-3 last:border-0 last:pb-0">
                        <p className="text-[13.5px] font-bold text-[#0D0D0D] leading-snug">→ {rec.task}</p>
                        <div className="flex gap-1.5 mt-2">
                          <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase bg-red-50 text-red-700 border border-red-100">
                            Impact: {rec.impact}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase bg-slate-50 text-[#475569] border border-black/[0.04]">
                            Effort: {rec.effort}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#475569] mt-2 italic leading-relaxed">Why we flagged this: {rec.why}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-emerald-700 font-semibold leading-relaxed">✓ No high-priority bottlenecks detected.</p>
                )}
              </div>

              {/* Fix Next column */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-1.5 mb-4 border-b border-[#E2E8F0] pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">Fix Next (Medium Priority)</p>
                </div>
                {fixNextRecs.length > 0 ? (
                  <ul className="space-y-4">
                    {fixNextRecs.map((rec, idx) => (
                      <li key={idx} className="border-b border-black/[0.03] pb-3 last:border-0 last:pb-0">
                        <p className="text-[13.5px] font-bold text-[#0D0D0D] leading-snug">→ {rec.task}</p>
                        <div className="flex gap-1.5 mt-2">
                          <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-100">
                            Impact: {rec.impact}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase bg-slate-50 text-[#475569] border border-black/[0.04]">
                            Effort: {rec.effort}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#475569] mt-2 italic leading-relaxed">Why we flagged this: {rec.why}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-emerald-700 font-semibold leading-relaxed">✓ No medium-priority bottlenecks detected.</p>
                )}
              </div>

              {/* Fix Later column */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-1.5 mb-4 border-b border-[#E2E8F0] pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-500"></span>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#475569]">Fix Later (Low Priority)</p>
                </div>
                {fixLaterRecs.length > 0 ? (
                  <ul className="space-y-4">
                    {fixLaterRecs.map((rec, idx) => (
                      <li key={idx} className="border-b border-black/[0.03] pb-3 last:border-0 last:pb-0">
                        <p className="text-[13.5px] font-bold text-[#0D0D0D] leading-snug">→ {rec.task}</p>
                        <div className="flex gap-1.5 mt-2">
                          <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase bg-slate-100 text-[#475569] border border-slate-200">
                            Impact: {rec.impact}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase bg-slate-50 text-[#475569] border border-black/[0.04]">
                            Effort: {rec.effort}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#475569] mt-2 italic leading-relaxed">Why we flagged this: {rec.why}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-emerald-700 font-semibold leading-relaxed">✓ All minor optimizations are complete.</p>
                )}
              </div>
            </div>
          </section>

          {/* What We Also Noticed — Layer 1 Objective Facts (Alfred-style small observations) */}
          {observedIssues > 0 && (
            <section className="mb-12">
              <h2 className="text-[19px] font-serif text-[#725921] border-b border-[#E2E8F0] pb-2 mb-6">
                8. A Few Other Things We Noticed
              </h2>
              <div className="space-y-3">
                {hasMissingMetaDesc && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[16px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">No search description found</p>
                      <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your website is missing a meta description — the short summary text Google shows under your link in search results. Without one, Google picks text at random, which often looks unprofessional.</p>
                    </div>
                  </div>
                )}
                {hasOutdatedCopyright && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[16px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">Copyright year appears outdated</p>
                      <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your website's footer displays a copyright year that isn't {new Date().getFullYear()}. While small, this signals to new visitors that the site may not be actively maintained — which can reduce trust on first visit.</p>
                    </div>
                  </div>
                )}
                {noPhoneNumber && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[16px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">No phone number detected</p>
                      <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">We didn't find a phone number on your homepage. For local businesses, a visible phone number increases both trust and conversions — especially for visitors arriving from mobile search who want to call directly.</p>
                    </div>
                  </div>
                )}
                {noCtaButton && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[16px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">Primary call-to-action may not be prominent</p>
                      <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">We didn't detect a clear "Book," "Contact," or "Get Started" action on your homepage. A visible CTA is the most direct route from a visitor's interest to a conversation or booking.</p>
                    </div>
                  </div>
                )}
                {hasMissingH1 && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[16px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">No main heading detected</p>
                      <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your page appears to be missing a primary H1 heading. Search engines use this to understand what your page is about, and its absence may reduce how confidently Google ranks your page for relevant searches.</p>
                    </div>
                  </div>
                )}
                {noSocialLinks && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[16px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">No social media links detected</p>
                      <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">We did not find links to major social channels (Facebook, Instagram, LinkedIn, etc.) on your homepage. Social profiles are an important validation signal for both human visitors and Google search bots.</p>
                    </div>
                  </div>
                )}
                {imagesWithoutAlt > 0 && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[16px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">Images missing alt-text: {imagesWithoutAlt}</p>
                      <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">We detected {imagesWithoutAlt} images on your homepage missing text descriptions ("alt-text"). Alt descriptions allow screen readers to describe images to visually impaired visitors and assist search engines in indexing your media search relevance.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Cost of Inaction */}
          <div className="border-l-4 border-l-[#C4A35A] pl-6 my-12 text-[17px] leading-[1.75] text-[#475569] font-medium">
            <strong>The opportunity cost:</strong> Each month without these improvements may reduce your visibility in both traditional search and AI-powered discovery, allowing competitors to capture the customers searching for what you offer.
          </div>

          <section className="bg-white border border-[#E2E8F0] p-8 rounded-lg shadow-sm text-center">
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#C4A35A] uppercase block mb-2">Recommended Solution</span>
            <h2 className="text-[22px] font-serif text-[#725921] mb-4">Want a Prioritized Action Plan?</h2>
            <p className="text-[15px] text-[#475569] leading-[1.7] max-w-[620px] mx-auto mb-8 font-normal">
              I&apos;ll personally review this report with you on a free 15-minute call and show you:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[580px] mx-auto text-left mb-8 text-[14px] text-[#0D0D0D]">
              <div className="flex items-start gap-2">
                <span className="text-[#C4A35A] font-bold shrink-0">✓</span> Which recommendations matter most to your business
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#C4A35A] font-bold shrink-0">✓</span> Which ones can safely be ignored
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#C4A35A] font-bold shrink-0">✓</span> What I&apos;d fix first if this were my website
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#C4A35A] font-bold shrink-0">✓</span> Whether these changes are worth investing in
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a 
                href="https://cal.com/naveengaur/30min" 
                target="_blank" 
                rel="noreferrer"
                className="w-full md:w-auto bg-[#C4A35A] text-[#0D0D0D] px-8 py-4 rounded-sm text-[13px] font-bold tracking-[0.05em] uppercase hover:bg-[#d4b46a] transition-colors"
              >
                Book Free 15-Min Strategy Call
              </a>
            </div>
            <p className="text-[11.5px] text-[#475569] mt-4 italic">
              No sales pressure. We review your specific site issues together.
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
  
  const reportUrl = `https://naveengaur.com/audits/${slug}`;
  
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

          {/* AI Strategy Companion Callout */}
          <div className="bg-[#FAFAF8] border border-black/[0.08] p-6 rounded-lg mb-12 flex items-start gap-4 shadow-sm print:hidden">
            <span className="text-[20px] mt-0.5">💡</span>
            <div>
              <h4 className="text-[14.5px] font-bold text-[#0D0D0D] mb-1">AI-Powered Strategy Companion</h4>
              <p className="text-[13.5px] text-[#475569] leading-[1.6]">
                This report is fully crawlable and readable by large language models. You can share this URL with <strong>ChatGPT, Gemini, Perplexity, or Claude</strong> to automatically generate a tailored developer implementation roadmap.
              </p>
              <div className="bg-white border border-black/[0.06] rounded p-3.5 mt-4 font-mono text-[12.5px] text-[#475569] select-all cursor-pointer hover:bg-slate-50 transition-colors shadow-xs">
                "Here is my website performance and AI readiness report: {reportUrl}. Based on these metrics and findings, can you generate a step-by-step developer implementation plan to fix these issues?"
              </div>
            </div>
          </div>

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
