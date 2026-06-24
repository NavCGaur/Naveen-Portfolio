import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import he from "he";
import { computeCredibilityScore, computeLocalSeoScore, computeOnlineAuthorityScore } from "@/lib/scoring";

import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { getAudit } from "@/lib/github-audits";
import AuditStickyNav from "@/components/sections/AuditStickyNav";
import AuditEmailForm from "@/components/sections/AuditEmailForm";

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
      <table {...props} className="w-full border-collapse text-left text-[15px]" />
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

    const { url, name, status, timestamp, metrics, details, error, pageSpeedUnavailable, rawHtmlLoadTime, rawHtmlFetchFailed } = audit;
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
            <h1 className="text-[21px] font-semibold text-[#725921] mb-2 font-serif">Audit Report Generating</h1>
            <p className="text-[15px] text-[#1E293B] leading-[1.6]">
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
            <span className="text-[34px] block mb-2">⚠️</span>
            <h1 className="text-[21px] font-semibold text-red-700 mb-2 font-serif">Audit Analysis Failed</h1>
            <p className="text-[15px] text-[#1E293B] leading-[1.6] mb-6">
              {error || "An unexpected error occurred while running the audit check."}
            </p>
            <Link href="/free-audit" className="bg-[#C4A35A] text-[#0D0D0D] px-6 py-3 rounded text-[14px] font-semibold tracking-[0.05em] uppercase hover:bg-[#d4b46a] transition-colors">
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
    const blockedAiBots = details?.blockedAiBots ?? [];
    const llmsTxtPresent = details?.llmsTxtPresent ?? false;
    // Business identification
    const businessName = he.decode(details?.businessName ?? name ?? "");
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
    const isContentSlowing = blog?.contentSlowing || 
      (blog?.daysSinceLastPost !== undefined && blog?.avgIntervalDays !== undefined && blog.daysSinceLastPost > 14 && blog.daysSinceLastPost > blog.avgIntervalDays * 3);
    const credibility = details?.credibility;
    const localSeo = details?.localSeo;
    const onlineAuthority = details?.onlineAuthority;
    const testimonials = details?.testimonials;
    const contact = details?.contact;
    const aiObservations = (audit.aiObservations ?? []).map(obs => ({
      title: he.decode(obs.title ?? ""),
      body: he.decode(obs.body ?? "")
    }));
    const executiveSummary = audit.executiveSummary ? he.decode(audit.executiveSummary) : "";
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

    const calculatedCredibilityScore = credibility?.score ?? computeCredibilityScore({
      hasAboutPage,
      hasTeamPage,
      hasPrivacyPolicy,
      hasTerms,
      hasTestimonials: hasTestimonialsValue,
      hasReviewSchema: hasReviewSchemaValue,
      hasSocialLinks: hasSocialLinksValue,
      hasAddress: hasAddressValue,
      hasPhone: hasPhoneValue
    }, ttfb > 600);

    const hasLocalSchemaVal = localSeo?.hasLocalSchema ?? (schemaTypes.some(s => s.toLowerCase().includes("localbusiness") || s.toLowerCase().includes("organization")));
    const hasMapsEmbedVal = localSeo?.hasMapsEmbed ?? (contact?.hasMapsEmbed ?? false);
    const hasCityInH1Val = localSeo?.hasCityInH1 ?? false;
    const hasServiceAreaVal = localSeo?.hasServiceArea ?? false;
    const hasBusinessHoursVal = localSeo?.hasBusinessHours ?? (contact?.hasBusinessHours ?? false);

    const calculatedLocalSeoScore = localSeo?.score ?? computeLocalSeoScore({
      hasPhone: hasPhoneValue,
      hasAddress: hasAddressValue,
      hasLocalSchema: hasLocalSchemaVal,
      hasMapsEmbed: hasMapsEmbedVal,
      hasCityInH1: hasCityInH1Val,
      hasServiceArea: hasServiceAreaVal,
      hasBusinessHours: hasBusinessHoursVal
    }, ttfb > 600);

    const hasAboutOrTeamVal = onlineAuthority?.hasAboutOrTeam ?? (hasAboutPage || hasTeamPage);
    const hasTestimonialsVal = onlineAuthority?.hasTestimonials ?? hasTestimonialsValue;
    const hasReviewSchemaVal = onlineAuthority?.hasReviewSchema ?? hasReviewSchemaValue;
    const hasSocialLinksVal = onlineAuthority?.hasSocialLinks ?? hasSocialLinksValue;
    const hasLegalPagesVal = onlineAuthority?.hasLegalPages ?? (hasPrivacyPolicy && hasTerms);
    const hasGoodSpeedOrCacheVal = onlineAuthority?.hasGoodSpeedOrCache ?? (ttfb < 500 || cachingActive);

    const calculatedOnlineAuthorityScore = onlineAuthority?.score ?? computeOnlineAuthorityScore({
      hasAboutOrTeam: hasAboutOrTeamVal,
      hasTestimonials: hasTestimonialsVal,
      hasReviewSchema: hasReviewSchemaVal,
      hasSocialLinks: hasSocialLinksVal,
      hasLegalPages: hasLegalPagesVal,
      hasGoodSpeedOrCache: hasGoodSpeedOrCacheVal,
      loadTime
    }, ttfb > 600);

    const discoveryScore = businessCategory === "local-service" 
      ? calculatedLocalSeoScore 
      : calculatedOnlineAuthorityScore;
    const discoveryLabel = businessCategory === "local-service" ? "Local Search Readiness" : "AI & Discovery Readiness";

    const isSlow = !pageSpeedUnavailable && loadTime > 3.0;
    const isTtfbHigh = !pageSpeedUnavailable && ttfb > 500;
    const isPluginsHigh = !pageSpeedUnavailable && pluginCount > 15;
    const hasBuilder = pageBuilder !== "None" && pageBuilder !== "Unknown";
    const isCachingMissing = !cachingActive;
    const hasLocalBusinessSchema = schemaTypes.some(s => s.toLowerCase().includes("localbusiness") || s.toLowerCase().includes("organization"));
    const hasReviewSchema = schemaTypes.some(s => s.toLowerCase().includes("review") || s.toLowerCase().includes("aggregaterating"));
    const isAiBlocked = !aiRobotsAllowed;

    // Verdict helpers for Mobile section
    const lcpVerdict = details?.lcp === undefined ? null : lcp <= 2.5 ? "good" : lcp <= 4.0 ? "needs-work" : "poor";
    const tbtVerdict = details?.tbt === undefined ? null : tbt <= 200 ? "good" : tbt <= 600 ? "needs-work" : "poor";
    const speedVerdict = details?.loadTime === undefined ? null : loadTime <= 3.4 ? "good" : loadTime <= 5.8 ? "needs-work" : "poor";
    const sizeVerdict = details?.pageSize === undefined ? null : pageSize < 2 ? "good" : pageSize < 5 ? "needs-work" : "poor";

    const verdictLabel = (v: string | null) =>
      pageSpeedUnavailable
        ? "Diagnostics Limited"
        : v === "good" ? "Fast ✓" : v === "needs-work" ? "Needs Improvement ⚠️" : v === "poor" ? "Slow ❌" : "N/A";
    const verdictColor = (v: string | null) =>
      pageSpeedUnavailable
        ? "text-slate-500 bg-slate-100/50 border border-slate-200/50 px-2 py-0.5 rounded-full text-[12px] font-semibold tracking-wide inline-block"
        : v === "good" ? "text-emerald-700" : v === "needs-work" ? "text-amber-700" : v === "poor" ? "text-red-700" : "text-[#475569]";

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

    // 0. PageSpeed Timeout Teaser
    if (pageSpeedUnavailable) {
      const teaserText = rawHtmlFetchFailed
        ? "Google's tools and our own server both failed to get a response within 15 seconds — see Technical Foundation for details."
        : "Your server response time couldn't be measured by Google's tools — see Technical Foundation for details.";
      contradictionBullets.push({
        title: "Severely Slow Server Response",
        body: teaserText
      });
    }

    // 1. Content Cadence Shift
    if (blog && blog.exists && isContentSlowing) {
      const bodyText = `We found ${blog.totalPosts} recent articles on your site, but you haven't published a new post in a long time. When you stop posting, search engines visit less often, delaying how long it takes for your new updates to show up in search results.`;
      contradictionBullets.push({
        title: "Long Gap Since Your Last Post",
        body: bodyText
      });
    }

    // 2. Performance vs Trust
    let foundationScore: number | null = null;
    if (!pageSpeedUnavailable) {
      foundationScore = Math.round((performance + seo + accessibility) / 3);
      if (ttfb > 600 && foundationScore > 75) {
        foundationScore = 75;
      }
      if (foundationScore >= 80 && (!testimonials || !testimonials.found || (credibility && credibility.score < 5))) {
        contradictionBullets.push({
          title: "Excellent Performance, but Low Trust Signals",
          body: "Your site loads extremely fast on mobile devices, but it currently lacks visible testimonials or reviews. Adding verified client stories is the single most important factor for converting this fast-loading traffic."
        });
      }
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

    if (isTtfbHigh) {
      opportunitiesList.push({
        id: "server-ttfb",
        title: "Upgrade Hosting Response (TTFB)",
        impact: "Medium",
        difficulty: "Hard",
        time: "4+ hrs",
        why: `Your server takes ${ttfb}ms to respond, which is above the 500ms benchmark.`,
        body: "Even if your page visually loads quickly, your hosting server takes a long time to acknowledge the initial request. Migrating to a higher-performance host or optimizing your server database will establish a stronger, more scalable technical foundation."
      });
    }

    if (blog && blog.exists && isContentSlowing) {
      opportunitiesList.push({
        id: "blog-cadence",
        title: "Restart Your Blog Updates",
        impact: "Medium",
        difficulty: "Medium",
        time: "2–4 hrs",
        why: `There is a long gap of ${blog.daysSinceLastPost} days since your last post, breaking your website's usual rhythm.`,
        body: "Your website has gone quiet compared to how you used to post. When search engines and AI tools notice that you've stopped sharing fresh updates, they will scan your website less frequently. This makes it harder for new updates or services to get noticed and shown to potential clients."
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

    const sortedOpportunities = opportunitiesList.sort((a, b) => {
      const impactMap: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      return impactMap[b.impact] - impactMap[a.impact];
    }).slice(0, 3);

    const highImpactCount = sortedOpportunities.filter(o => o.impact === "High").length;
    let strengthsCount = 0;
    if (!pageSpeedUnavailable && !isTtfbHigh) strengthsCount++;
    if (!isCachingMissing) strengthsCount++;
    if (!isAiBlocked) strengthsCount++;
    if (!pageSpeedUnavailable && !isSlow) strengthsCount++;
    if (hasLocalBusinessSchema) strengthsCount++;

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
    if (isTtfbHigh && !isSlow) {
      fixNextRecs.push({
        task: "Upgrade Hosting Server (TTFB)",
        impact: "Medium",
        effort: "High",
        why: `Your server takes ${ttfb}ms to respond, dragging down your foundation score.`
      });
    }

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
        task: "Restart Regular Blog Posts",
        impact: "Medium",
        effort: "Medium",
        why: `It has been ${blog.daysSinceLastPost} days since your last post, leaving a long gap since your usual publishing schedule.`
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

    const isLocal = businessCategory === "local-service";
    
    // Pillar 2 (Trust & Credibility) checks:
    const totalTrustChecks = 9;
    const passedTrustChecks = [
      credibility?.hasAboutPage === true,
      credibility?.hasTeamPage === true,
      credibility?.hasPrivacyPolicy === true,
      credibility?.hasTerms === true,
      credibility?.hasTestimonials === true,
      credibility?.hasReviewSchema === true,
      credibility?.hasSocialLinks === true,
      localSeo?.hasAddress === true,
      localSeo?.hasPhone === true
    ].filter(Boolean).length;

    const unverifiedTrustChecks = [
      credibility?.hasAboutPage === "unverified",
      credibility?.hasTeamPage === "unverified",
      credibility?.hasPrivacyPolicy === "unverified",
      credibility?.hasTerms === "unverified",
      credibility?.hasTestimonials === "unverified",
      credibility?.hasReviewSchema === "unverified",
      credibility?.hasSocialLinks === "unverified",
      localSeo?.hasAddress === "unverified",
      localSeo?.hasPhone === "unverified"
    ].filter(Boolean).length;

    const activeTrustChecks = totalTrustChecks - unverifiedTrustChecks;

    // Pillar 3 (Local Search / AI & Discovery) checks:
    const totalDiscoveryChecks = 7;
    const passedDiscoveryChecks = isLocal
      ? [
          localSeo?.hasPhone === true,
          localSeo?.hasAddress === true,
          hasLocalBusinessSchema === true,
          localSeo?.hasMapsEmbed === true,
          localSeo?.hasCityInH1 === true,
          localSeo?.hasServiceArea === true,
          localSeo?.hasBusinessHours === true
        ].filter(Boolean).length
      : [
          (credibility?.hasAboutPage || credibility?.hasTeamPage) === true,
          onlineAuthority?.hasTestimonials === true,
          onlineAuthority?.hasReviewSchema === true,
          onlineAuthority?.hasSocialLinks === true,
          onlineAuthority?.hasLegalPages === true,
          onlineAuthority?.hasGoodSpeedOrCache === true,
          loadTime < 3.0
        ].filter(Boolean).length;

    const unverifiedDiscoveryChecks = isLocal
      ? [
          localSeo?.hasPhone === "unverified",
          localSeo?.hasAddress === "unverified",
          false, // placeholder: hasLocalBusinessSchema has no unverified state (always boolean)
          localSeo?.hasMapsEmbed === "unverified",
          localSeo?.hasCityInH1 === "unverified",
          localSeo?.hasServiceArea === "unverified",
          localSeo?.hasBusinessHours === "unverified"
        ].filter(Boolean).length
      : [
          (credibility?.hasAboutPage === "unverified" || credibility?.hasTeamPage === "unverified"),
          onlineAuthority?.hasTestimonials === "unverified",
          onlineAuthority?.hasReviewSchema === "unverified",
          onlineAuthority?.hasSocialLinks === "unverified",
          onlineAuthority?.hasLegalPages === "unverified",
          onlineAuthority?.hasGoodSpeedOrCache === "unverified",
          false // placeholder: loadTime has no unverified state (always numeric)
        ].filter(Boolean).length;

    const activeDiscoveryChecks = totalDiscoveryChecks - unverifiedDiscoveryChecks;

    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] font-sans antialiased selection:bg-[#C4A35A]/20">
        <Nav />
        <div className="pt-[140px]">
          <AuditStickyNav discoveryLabel={discoveryLabel} />

        <main id="overview" className="max-w-[860px] lg:max-w-[1040px] mx-auto px-6 py-12">
          {/* Section 0: Title */}
          <div className="mb-8 text-center md:text-left">
            <span className="bg-[#C4A35A]/10 text-[#725921] border border-[#C4A35A]/30 text-[11px] font-bold uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-full">
              Website Growth Opportunity Report
            </span>
            <h1 className="text-[clamp(34px,4.5vw,48px)] font-serif tracking-[-0.02em] text-[#725921] mt-4 mb-2 leading-[1.15]">
              {businessName} — Growth Opportunity Report
            </h1>
            <p className="text-[15px] text-[#475569] font-light">
              Analysis conducted on {dateStr} • <a href={url} target="_blank" rel="noreferrer" className="text-[#C4A35A] hover:underline font-medium">{url}</a>
            </p>
          </div>

          {/* Strengths & Thesis Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card 1: Strengths */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2 border-b border-black/[0.04] pb-2">
                  <span className="text-[20px] font-bold uppercase tracking-wider text-[#725921] font-sans">Strengths</span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {strengthsCount} found
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-[#475569] mb-4 font-sans">What we like</h3>
                <div className="space-y-4">
                  {!pageSpeedUnavailable && !isTtfbHigh && (
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                      <div>
                        <p className="text-[14.5px] font-bold text-[#0D0D0D] leading-snug">Healthy hosting infrastructure</p>
                        <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your server responds quickly, which is the foundation a well-performing website needs.</p>
                      </div>
                    </div>
                  )}
                  {!isCachingMissing && (
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                      <div>
                        <p className="text-[14.5px] font-bold text-[#0D0D0D] leading-snug">Page caching is active</p>
                        <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your site is set up to serve pages efficiently, which protects speed under real traffic.</p>
                      </div>
                    </div>
                  )}
                  {!isAiBlocked && (
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                      <div>
                        <p className="text-[14.5px] font-bold text-[#0D0D0D] leading-snug">Open to modern AI search</p>
                        <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your website allows AI platforms like ChatGPT and Bing to crawl and reference your content.</p>
                      </div>
                    </div>
                  )}
                  {!pageSpeedUnavailable && !isSlow && (
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                      <div>
                        <p className="text-[14.5px] font-bold text-[#0D0D0D] leading-snug">Acceptable mobile load speed</p>
                        <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Your pages load within a reasonable range, meaning most visitors won&apos;t immediately drop off.</p>
                      </div>
                    </div>
                  )}
                  {hasLocalBusinessSchema && (
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                      <div>
                        <p className="text-[14.5px] font-bold text-[#0D0D0D] leading-snug">Business identity structured for search</p>
                        <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">Google and AI tools can identify your business type and core details from your website&apos;s code.</p>
                      </div>
                    </div>
                  )}
                  {strengthsCount === 0 && (
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold text-[16px] mt-0.5">✓</span>
                      <div>
                        <p className="text-[14.5px] font-bold text-[#0D0D0D] leading-snug">Clear, established web presence</p>
                        <p className="text-[13px] text-[#475569] mt-0.5 leading-[1.5]">You already have a website that represents your business — the optimizations below build on that foundation.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Thesis & Observations */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2 border-b border-black/[0.04] pb-2">
                  <span className="text-[20px] font-bold uppercase tracking-wider text-[#725921] font-sans">Thesis</span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    read this
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-[#475569] mb-4 font-sans">What matters most</h3>
                
                <div className="text-[15px] text-[#475569] leading-[1.7] mb-6">
                  {foundationScore === null ? (
                    <>Your website's speed analysis is currently unmeasured because Google's testing tools timed out trying to connect. We recommend resolving host server response delays so your site can be fully benchmarked.</>
                  ) : isSlow ? (
                    <>The primary bottleneck for your website is <strong>technical performance</strong>. Slow mobile loading times create friction for incoming visitors, which needs to be resolved before focusing on visibility and trust.</>
                  ) : isTtfbHigh && foundationScore < 80 ? (
                    <>Your mobile loading times are surprisingly good, but your <strong>hosting server response (TTFB)</strong> is slow. While visitors see the page quickly today, this underlying server friction holds back your technical foundation score and limits scalability.</>
                  ) : (
                    <>Your website already has a strong technical foundation. The biggest opportunity isn&apos;t speed — it is <strong>visibility and trust</strong>: helping search engines, AI platforms, and prospective clients understand and trust your business more quickly.</>
                  )}
                </div>

                {executiveSummary && !executiveSummary.includes("website foundation score of") && (
                  <div className="bg-[#FAFAF8] border-l-4 border-[#C4A35A] p-4 rounded-r-lg mb-6 text-[14.5px] italic text-[#475569] leading-[1.6] print:bg-none print:border-l-2 print:text-black">
                    "{executiveSummary}"
                  </div>
                )}

                {/* Observations */}
                {contradictionBullets.length > 0 && (
                  <div className="border-t border-black/[0.05] pt-4 space-y-3.5">
                    <span className="block text-[12.5px] uppercase font-bold text-[#475569] tracking-wider mb-2">Key Observations</span>
                    {contradictionBullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-[13.5px]">
                        <span className="text-[15px] shrink-0 mt-0.5">🔍</span>
                        <div>
                          <p className="font-bold text-[#0D0D0D] leading-snug">{bullet.title}</p>
                          <p className="text-[#475569] mt-0.5 leading-[1.5]">{bullet.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Scores */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs mb-8">
            <div className="flex items-center justify-between mb-2 border-b border-black/[0.04] pb-2">
              <span className="text-[20px] font-bold uppercase tracking-wider text-[#725921] font-sans">The Proof</span>
              <span className="text-[12.5px] text-[#475569]/80 font-bold uppercase tracking-wider font-sans">3 pillars</span>
            </div>
            <h2 className="text-[16px] font-bold text-[#475569] mb-6 font-sans">Scores</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Technical Foundation */}
              <div className="bg-[#FAFAF8] border border-black/[0.04] p-6 rounded-xl text-center flex flex-col justify-between">
                <div>
                  <span className="text-[13.5px] uppercase font-bold text-[#475569] block mb-2 tracking-wide font-semibold">Technical Foundation</span>
                  <div className="text-[44px] font-bold font-serif text-[#725921] leading-none my-2">
                    {foundationScore !== null ? (
                      <>{foundationScore}<span className="text-[20px] font-sans text-[#475569]/60 font-normal">/100</span></>
                    ) : (
                      <span className="text-[34px] font-sans text-[#475569]/80 font-normal">--</span>
                    )}
                  </div>
                  <p className="text-[13.5px] text-[#475569] px-2 leading-[1.5]">Speed index, caching status, core web vitals, and search accessibility.</p>
                </div>
                <div className="mt-2 text-[12px] text-[#725921] font-semibold">
                  {pageSpeedUnavailable ? "PageSpeed Connection Timeout" : "Metrics Verified via PageSpeed API"}
                </div>
                <div className="mt-4 pt-3 border-t border-black/[0.04]">
                  {pageSpeedUnavailable ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-slate-100 text-slate-600 border-slate-200">
                      Diagnostics Limited
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      foundationScore !== null && foundationScore >= 80 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : foundationScore !== null && foundationScore >= 50
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {foundationScore !== null && foundationScore >= 80 ? "Healthy" : foundationScore !== null && foundationScore >= 50 ? "Needs Work" : "Critical"}
                    </span>
                  )}
                </div>
              </div>

              {/* Card 2: Trust & Credibility */}
              <div className="bg-[#FAFAF8] border border-black/[0.04] p-6 rounded-xl text-center flex flex-col justify-between">
                <div>
                  <span className="text-[13.5px] uppercase font-bold text-[#475569] block mb-2 tracking-wide font-semibold">Trust &amp; Credibility</span>
                  <div className="text-[44px] font-bold font-serif text-[#725921] leading-none my-2">
                    {Math.round(calculatedCredibilityScore * 10)}<span className="text-[20px] font-sans text-[#475569]/60 font-normal">/100</span>
                  </div>
                  <p className="text-[13.5px] text-[#475569] px-2 leading-[1.5]">Customer stories, team transparency, social proof, and legal trust pages.</p>
                </div>
                <div className="mt-2 text-[12px] text-[#725921] font-semibold">
                  {passedTrustChecks} of {activeTrustChecks} checks verified
                </div>
                <div className="mt-4 pt-3 border-t border-black/[0.04]">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
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
              <div className="bg-[#FAFAF8] border border-black/[0.04] p-6 rounded-xl text-center flex flex-col justify-between">
                <div>
                  <span className="text-[13.5px] uppercase font-bold text-[#475569] block mb-2 tracking-wide font-semibold">{discoveryLabel}</span>
                  <div className="text-[44px] font-bold font-serif text-[#725921] leading-none my-2">
                    {Math.round(discoveryScore * 10)}<span className="text-[20px] font-sans text-[#475569]/60 font-normal">/100</span>
                  </div>
                  <p className="text-[13.5px] text-[#475569] px-2 leading-[1.5]">Structured schema data, AI bot rules, and organic discovery signals.</p>
                </div>
                <div className="mt-2 text-[12px] text-[#725921] font-semibold">
                  {passedDiscoveryChecks} of {activeDiscoveryChecks} checks verified
                </div>
                <div className="mt-4 pt-3 border-t border-black/[0.04]">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
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
          </div>

          {/* Section: What to fix */}
          <div id="opportunities" className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs mb-8 overflow-hidden">
            <div className="flex items-center justify-between mb-2 border-b border-black/[0.04] pb-2">
              <span className="text-[20px] font-bold uppercase tracking-wider text-[#725921] font-sans">Opportunities</span>
              {highImpactCount > 0 ? (
                <span className="bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {highImpactCount} high impact
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  No critical gaps
                </span>
              )}
            </div>
            <h2 className="text-[16px] font-bold text-[#475569] mb-6 font-sans">What to fix</h2>

            <div className="divide-y divide-[#E2E8F0]">
              {sortedOpportunities.length > 0 ? (
                sortedOpportunities.map((opp) => (
                  <div key={opp.id} className="py-5 grid grid-cols-12 gap-4 items-start first:pt-0 last:pb-0">
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
                      <p className="text-[15px] font-bold text-[#0D0D0D]">{opp.title}</p>
                      <p className="text-[13.5px] text-[#475569] mt-1 leading-[1.5]">{opp.body}</p>
                      <p className="text-[12px] text-[#725921] italic mt-2">Why we flagged this: {opp.why}</p>
                    </div>
                    <div className="col-span-12 sm:col-span-5 flex sm:justify-end gap-6 text-center mt-2 sm:mt-0">
                      <div>
                        <p className="text-[10.5px] uppercase text-[#475569] font-bold tracking-wider font-semibold">Difficulty</p>
                        <p className="text-[13.5px] font-semibold text-[#0D0D0D] mt-0.5">{opp.difficulty}</p>
                      </div>
                      <div>
                        <p className="text-[10.5px] uppercase text-[#475569] font-bold tracking-wider font-semibold">Est. Time</p>
                        <p className="text-[13.5px] font-semibold text-[#0D0D0D] mt-0.5">{opp.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4">
                  <p className="text-[14.5px] font-bold text-[#0D0D0D] flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> Your website is in exceptionally good shape.
                  </p>
                  <p className="text-[13.5px] text-[#475569] mt-1 leading-relaxed">
                    There are no high-priority mechanical or technical opportunities remaining. These smaller refinements can help solidify your authority and edge out competitors.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Action Checklist Card (moved below Opportunities) */}
          <div id="prioritized-checklist" className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs mb-8 overflow-hidden scroll-mt-24">
            <div className="flex items-center justify-between mb-2 border-b border-black/[0.04] pb-2">
              <span className="text-[20px] font-bold uppercase tracking-wider text-[#725921] font-sans">Action Plan</span>
              <span className="bg-red-50 text-red-700 border border-red-200 text-[11.5px] font-bold px-2.5 py-0.5 rounded-full font-sans">
                {fixFirstRecs.length} high • {fixNextRecs.length} medium • {fixLaterRecs.length} low
              </span>
            </div>
            <h2 className="text-[16px] font-bold text-[#475569] mb-1 font-sans">Prioritized action checklist</h2>
            <p className="text-[13.5px] text-[#475569] mb-6 font-sans font-light">What to fix, in order — start with the left column.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fix First column */}
              <div className="bg-[#FAFAF8] border border-black/[0.02] rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-1.5 mb-4 border-b border-black/[0.04] pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-red-600">Fix First</p>
                </div>
                {fixFirstRecs.length > 0 ? (
                  <div className="space-y-4">
                    {fixFirstRecs.map((rec, idx) => (
                      <div key={idx} className="border-b border-black/[0.03] pb-3 last:border-0 last:pb-0">
                        <p className="text-[14px] font-bold text-[#0D0D0D] leading-snug">{rec.task}</p>
                        <p className="text-[12.5px] text-[#475569] mt-1 font-light leading-snug">
                          {rec.impact} impact • {rec.effort} effort
                        </p>
                        {rec.why && (
                          <p className="text-[11.5px] text-[#725921] italic mt-1 leading-relaxed">
                            Why: {rec.why}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13.5px] text-emerald-700 font-semibold leading-relaxed">✓ No high-priority bottlenecks detected.</p>
                )}
              </div>

              {/* Fix Next column */}
              <div className="bg-[#FAFAF8] border border-black/[0.02] rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-1.5 mb-4 border-b border-black/[0.04] pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-amber-700">Fix Next</p>
                </div>
                {fixNextRecs.length > 0 ? (
                  <div className="space-y-4">
                    {fixNextRecs.map((rec, idx) => (
                      <div key={idx} className="border-b border-black/[0.03] pb-3 last:border-0 last:pb-0">
                        <p className="text-[14px] font-bold text-[#0D0D0D] leading-snug">{rec.task}</p>
                        <p className="text-[12.5px] text-[#475569] mt-1 font-light leading-snug">
                          {rec.impact} impact • {rec.effort} effort
                        </p>
                        {rec.why && (
                          <p className="text-[11.5px] text-[#725921] italic mt-1 leading-relaxed">
                            Why: {rec.why}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13.5px] text-emerald-700 font-semibold leading-relaxed">✓ No medium-priority bottlenecks detected.</p>
                )}
              </div>

              {/* Fix Later column */}
              <div className="bg-[#FAFAF8] border border-black/[0.02] rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-1.5 mb-4 border-b border-black/[0.04] pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-500"></span>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-[#475569]">Fix Later</p>
                </div>
                {fixLaterRecs.length > 0 ? (
                  <div className="space-y-4">
                    {fixLaterRecs.map((rec, idx) => (
                      <div key={idx} className="border-b border-black/[0.03] pb-3 last:border-0 last:pb-0">
                        <p className="text-[14px] font-bold text-[#0D0D0D] leading-snug">{rec.task}</p>
                        <p className="text-[12.5px] text-[#475569] mt-1 font-light leading-snug">
                          {rec.impact} impact • {rec.effort} effort
                        </p>
                        {rec.why && (
                          <p className="text-[11.5px] text-[#725921] italic mt-1 leading-relaxed">
                            Why: {rec.why}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13.5px] text-emerald-700 font-semibold leading-relaxed">✓ All minor optimizations are complete.</p>
                )}
              </div>
            </div>
          </div>

          {/* Inline CTA Strip (visually interrupts the scroll) */}
          <div className="bg-[#1E1E1C] border border-[#C4A35A]/20 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm print:hidden">
            <p className="text-[17px] text-[#E2E8F0] font-sans leading-relaxed text-center sm:text-left font-medium">
              Want a professional developer to review these findings and answer your questions?
            </p>
            <a 
              href="https://cal.com/naveengaur/30min" 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#C4A35A] text-[#0D0D0D] px-6 py-3 rounded-sm text-[13.5px] font-bold tracking-[0.05em] uppercase hover:bg-[#d4b46a] transition-colors whitespace-nowrap text-center cursor-pointer font-sans"
            >
              Book 15-Min Walkthrough
            </a>
          </div>

          {/* AI Strategy Companion Card */}
          <div className="bg-white border border-[#C4A35A]/40 rounded-xl p-7 shadow-xs mb-12 print:hidden">
            <div className="flex items-center gap-2 mb-3 border-b border-black/[0.04] pb-2">
              <span className="text-[20px] font-bold uppercase tracking-wider text-[#725921] font-sans">AI Strategy Partner</span>
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11.5px] font-bold px-2.5 py-0.5 rounded-full font-sans">
                Free Developer Roadmap
              </span>
            </div>
            <h3 className="text-[16px] font-bold text-[#475569] mb-3 font-sans">Get a Developer-Ready Implementation Plan</h3>
            <p className="text-[14.5px] text-[#475569] leading-[1.6] mb-4 font-sans">
              This report is formatted to be fully readable by modern LLMs. Copy the prompt below and paste it into <strong>ChatGPT, Claude, Gemini, or Perplexity</strong> to instantly get a step-by-step developer plan to fix these issues.
            </p>
            <div className="bg-[#FAFAF8] border border-black/[0.06] rounded-lg p-4 font-mono text-[13px] text-[#475569] select-all cursor-pointer hover:bg-slate-50 transition-colors shadow-inner relative group/prompt">
              <span className="block select-none text-[10px] uppercase font-bold text-[#C4A35A] tracking-wider mb-2 font-sans">Click to Highlight &amp; Copy Prompt</span>
              "Here is my website audit report: {reportUrl}. Based on these findings, create a step-by-step developer plan to fix the top issues."
            </div>
          </div>

          {/* Section: The Full Breakdown Centered Heading */}
          <div className="text-center mt-24 mb-16 border-b border-black/[0.06] pb-10 print:border-b-2 print:border-black">
            <span className="text-[12px] font-bold tracking-[0.2em] text-[#C4A35A] uppercase block mb-3 font-sans">Deep-Dive Analysis</span>
            <h2 className="text-[30px] md:text-[36px] font-sans font-bold text-[#0D0D0D] tracking-tight leading-tight">
              The Full Breakdown
            </h2>
            <p className="text-[15.5px] text-[#475569] max-w-[600px] mx-auto mt-3 font-sans font-light">
              A detailed audit of your website's performance, credibility signals, and search discovery readiness.
            </p>
          </div>

          {/* Pillar 1: Technical Foundation */}
          <div id="technical-foundation" className="pt-16 border-t border-[#E2E8F0] mt-16 mb-8">
            <h2 className="text-[22px] font-sans font-bold text-[#725921] uppercase tracking-wide border-b border-black/[0.06] pb-2 mb-2">Pillar 1: Technical Foundation</h2>
            <p className="text-[14.5px] text-[#475569] leading-relaxed">Rolls up all hosting, server response, and mobile speed measurements.</p>
          </div>
          {/* Section 4: Website Performance Check */}
          <section className="mb-12 pl-6 border-l-2 border-[#C4A35A]/15">
            <h3 className="text-[18px] font-sans font-bold text-[#0D0D0D] mb-2">
              1. Website Performance Check
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#725921] bg-[#C4A35A]/10 px-2 py-0.5 rounded-sm">Feeds into: Technical Foundation</span>
            </div>
            <p className="text-[15px] italic text-[#475569] mb-6 font-light">
              Why this matters: Behind-the-scenes server settings determine how quickly your site is ready to draw pages. If page caching is disabled, every visitor forces your server to rebuild pages from scratch, slowing down responsiveness.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className={`text-[21px] leading-none ${isCachingMissing ? 'text-red-600' : 'text-green-600'}`}>
                  {isCachingMissing ? "❌" : "✓"}
                </span>
                <div>
                  <h4 className="text-[16px] font-bold text-[#0D0D0D]">Active Page Memory Caching</h4>
                  <p className="text-[15.5px] text-[#475569] mt-1 leading-[1.6]">
                    {isCachingMissing ? (
                      "Active Page Cache is disabled. Without caching, your server is forced to rebuild your web page from scratch for every single visitor, slowing down responses and increasing server load under traffic spikes."
                    ) : (
                      "Active Page Cache is enabled! Your server successfully delivers pre-built static versions of your pages, protecting response speed."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className={`text-[21px] leading-none ${isTtfbHigh ? 'text-red-600' : 'text-green-600'}`}>
                  {isTtfbHigh ? "❌" : "✓"}
                </span>
                <div>
                  <h4 className="text-[16px] font-bold text-[#0D0D0D]">Server Response Time (TTFB): {ttfb}ms</h4>
                  <p className="text-[15.5px] text-[#475569] mt-1 leading-[1.6]">
                    {isTtfbHigh ? (
                      "Your hosting server takes over 500ms just to acknowledge requests. This can be caused by congested hosting environments and affects overall mobile performance."
                    ) : (
                      "Your hosting server responses are healthy. The server starts sending files to the browser under standard 500ms benchmarks."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className={`text-[21px] leading-none ${isPluginsHigh ? 'text-amber-500' : 'text-green-600'}`}>
                  {isPluginsHigh ? "⚠️" : "✓"}
                </span>
                <div>
                  <h4 className="text-[16px] font-bold text-[#0D0D0D]">WordPress Plugin Footprint: {pluginCount} plugins</h4>
                  <p className="text-[15.5px] text-[#475569] mt-1 leading-[1.6]">
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
          <section className="mb-12 pl-6 border-l-2 border-[#C4A35A]/15">
            <h3 className="text-[18px] font-sans font-bold text-[#0D0D0D] mb-2">
              2. Mobile Visitor Experience
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#725921] bg-[#C4A35A]/10 px-2 py-0.5 rounded-sm">Feeds into: Technical Foundation</span>
            </div>
            <p className="text-[15px] italic text-[#475569] mb-6 font-light">
              Why this matters: Google ranks websites primarily based on mobile loading behavior. Slow page rendering freezes taps and clicks, causing up to 40% of mobile search visitors to drop off.
            </p>

            {pageSpeedUnavailable && (
              <div className="mb-6 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-5 text-[14.5px] leading-relaxed">
                {rawHtmlFetchFailed ? (
                  <>
                    <strong>⚠️ Diagnostics Limited: Website response connection timed out.</strong>
                    <p className="mt-2 text-[#475569]">
                      Both Google's speed benchmark tools and our own diagnostic servers timed out while attempting to load your homepage (failing to receive a response within 15 seconds). This is a critical infrastructure alert pointing to potential host server overload, DNS misconfiguration, or active blocking of bot crawlers.
                    </p>
                  </>
                ) : (
                  <>
                    <strong>⚠️ Diagnostics Limited: PageSpeed Insights benchmark timed out.</strong>
                    <p className="mt-2 text-[#475569]">
                      Google's official tools timed out trying to run performance metrics on your site. Our custom checks successfully loaded your home page, but recorded a severely slow load time of <strong>{rawHtmlLoadTime} seconds</strong>. When a server takes this long just to send raw HTML, automated benchmarking tools abort, search engine crawling drops off, and prospective customers encounter a blank screen.
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* LCP */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <p className="text-[12px] uppercase font-bold text-[#475569] tracking-wider mb-2">How fast does your main content appear?</p>
                <p className={`text-[16px] font-bold mb-1 ${verdictColor(lcpVerdict)}`}>{verdictLabel(lcpVerdict)}</p>
                <p className="text-[14px] text-[#475569] leading-[1.5]">
                  {pageSpeedUnavailable ? (
                    "Could not be measured because Google's speed testing tool timed out."
                  ) : (
                    <>
                      {lcpVerdict === "good" && "The main content on your page loads quickly. Visitors on mobile see it within Google's recommended window."}
                      {lcpVerdict === "needs-work" && `Your page's main content takes ${lcp}s to appear — Google recommends under 2.5s for a good mobile experience.`}
                      {lcpVerdict === "poor" && `At ${lcp}s, your page is slow to show its main content. Visitors on mobile are likely to leave before it finishes loading.`}
                      {lcpVerdict === null && "No data available for this metric."}
                    </>
                  )}
                </p>
              </div>
              {/* TBT / Interactivity */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <p className="text-[12px] uppercase font-bold text-[#475569] tracking-wider mb-2">Can visitors interact without delay?</p>
                <p className={`text-[16px] font-bold mb-1 ${verdictColor(tbtVerdict)}`}>{verdictLabel(tbtVerdict)}</p>
                <p className="text-[14px] text-[#475569] leading-[1.5]">
                  {pageSpeedUnavailable ? (
                    "Could not be measured because the page response was delayed."
                  ) : (
                    <>
                      {tbtVerdict === "good" && "Your page responds quickly to taps and clicks. Background scripts are not blocking the user's experience."}
                      {tbtVerdict === "needs-work" && `Background scripts freeze your page for ${tbt}ms. Visitors may tap buttons and get no response until scripts finish.`}
                      {tbtVerdict === "poor" && `Your page freezes for ${tbt}ms while scripts load — well above Google's 200ms benchmark. Buttons may feel unresponsive on mobile.`}
                      {tbtVerdict === null && "No data available for this metric."}
                    </>
                  )}
                </p>
              </div>
              {/* Speed Index / Visual fill */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <p className="text-[12px] uppercase font-bold text-[#475569] tracking-wider mb-2">How quickly does the page look ready?</p>
                <p className={`text-[16px] font-bold mb-1 ${verdictColor(speedVerdict)}`}>{verdictLabel(speedVerdict)}</p>
                <p className="text-[14px] text-[#475569] leading-[1.5]">
                  {pageSpeedUnavailable ? (
                    rawHtmlFetchFailed ? (
                      "Could not retrieve visual render timing (connection timeout)."
                    ) : (
                      `Our server measured raw HTML load time at ${rawHtmlLoadTime}s, but visual metrics timed out.`
                    )
                  ) : (
                    <>
                      {speedVerdict === "good" && "Your page fills visually fast — visitors see a fully rendered layout without long blank-screen waits."}
                      {speedVerdict === "needs-work" && `The page takes ${loadTime}s to look complete. Parts of the screen may appear blank or shift while loading.`}
                      {speedVerdict === "poor" && `At ${loadTime}s, your page loads significantly slower than industry benchmarks. Most mobile visitors experience a long blank wait.`}
                      {speedVerdict === null && "No data available for this metric."}
                    </>
                  )}
                </p>
              </div>
              {/* Page Weight */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
                <p className="text-[12px] uppercase font-bold text-[#475569] tracking-wider mb-2">How much data does your homepage load?</p>
                <p className={`text-[16px] font-bold mb-1 ${verdictColor(sizeVerdict)}`}>
                  {pageSpeedUnavailable ? "Diagnostics Limited" : (sizeVerdict === "good" ? "Lightweight ✓" : sizeVerdict === "needs-work" ? "Moderate ⚠️" : sizeVerdict === "poor" ? "Heavy ❌" : "N/A")}
                </p>
                <p className="text-[14px] text-[#475569] leading-[1.5]">
                  {pageSpeedUnavailable ? (
                    "Could not measure resource sizes due to connection timeout."
                  ) : (
                    <>
                      {sizeVerdict === "good" && `Your homepage downloads ${pageSize} MB — well within mobile-friendly limits. Visitors on slower connections load it comfortably.`}
                      {sizeVerdict === "needs-work" && `At ${pageSize} MB, your homepage is moderately sized. Visitors on 4G connections may notice a delay, especially first-time visitors without cached data.`}
                      {sizeVerdict === "poor" && `Your homepage downloads ${pageSize} MB of data — significantly more than recommended. This increases load time noticeably on mobile networks.`}
                      {sizeVerdict === null && "No data available for this metric."}
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Pillar 2: Trust & Credibility */}
          <div id="trust-credibility" className="pt-16 border-t border-[#E2E8F0] mt-16 mb-8">
            <h2 className="text-[22px] font-sans font-bold text-[#725921] uppercase tracking-wide border-b border-black/[0.06] pb-2 mb-2">Pillar 2: Trust &amp; Credibility</h2>
            <p className="text-[14.5px] text-[#475569] leading-relaxed">Rolls up user trust parameters, direct human communication channels, and active resource feeds.</p>
          </div>
          {/* Section 6: Content & Publishing Analysis */}
          <section className="mb-12 pl-6 border-l-2 border-[#C4A35A]/15">
            <h3 className="text-[18px] font-sans font-bold text-[#0D0D0D] mb-2">
              3. Content &amp; Publishing Analysis
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#725921] bg-[#C4A35A]/10 px-2 py-0.5 rounded-sm">Feeds into: Trust &amp; Credibility</span>
            </div>
            <p className="text-[15px] italic text-[#475569] mb-6 font-light">
              Why this matters: Regular content updates signal to search engine indexers that your company is actively operating. When publishing slows down or stops, crawlers visit your site less frequently.
            </p>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs">
              {blog && blog.exists === true ? (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                    <span className="text-[16px] uppercase font-bold text-[#475569]">Blog / Content Activity</span>
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
                      isContentSlowing
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : blog.daysSinceLastPost && blog.daysSinceLastPost > 90
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {isContentSlowing
                        ? "Publishing Slowdown"
                        : blog.daysSinceLastPost && blog.daysSinceLastPost > 90
                        ? "Inactive Content"
                        : "Active Content Rhythm"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left mb-6">
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[12px] uppercase font-bold text-[#475569] mb-1">Posts in Active Feed</span>
                      <span className="text-[26px] font-serif font-bold text-[#725921]">{blog.totalPosts}</span>
                    </div>
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[12px] uppercase font-bold text-[#475569] mb-1">Last Published</span>
                      <span className="text-[19px] font-semibold text-[#0D0D0D]">
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
                      <span className="block text-[12px] uppercase font-bold text-[#475569] mb-1">Average Interval</span>
                      <span className="text-[19px] font-semibold text-[#0D0D0D]">
                        {blog.avgIntervalDays !== undefined ? `Every ${blog.avgIntervalDays} days` : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="text-[14.5px] text-[#475569] leading-[1.6] space-y-3">
                    {isContentSlowing && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-amber-500 font-bold">⚠️</span>
                        <p>
                          <strong>Long gap since your last post:</strong> It has been <strong>{blog.daysSinceLastPost} days</strong> since your last update, which is a long gap compared to your usual schedule of updating every <strong>{blog.avgIntervalDays} days</strong>. When search engines like Google notice that your website has gone quiet, they will visit and scan your site less frequently. This makes it much harder and slower for any new updates, services, or pages you publish to show up in search results for potential clients.
                        </p>
                      </div>
                    )}
                    {!isContentSlowing && blog.daysSinceLastPost && blog.daysSinceLastPost > 90 && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-red-500 font-bold">⚠️</span>
                        <p>
                          <strong>Content is outdated:</strong> The last post was <strong>{blog.daysSinceLastPost} days ago</strong>. When search engine bots crawl a site that hasn't published fresh content in months, they slow down their crawl frequency.
                        </p>
                      </div>
                    )}
                    {!isContentSlowing && (!blog.daysSinceLastPost || blog.daysSinceLastPost <= 90) && (
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
                    <span className="text-[14px] uppercase font-bold text-[#475569]">Content Strategy</span>
                    <span className={`px-3 py-1 border rounded-full text-[12px] font-bold ${
                      blog?.exists === "unverified" 
                        ? "bg-slate-100 text-slate-600 border-slate-200" 
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {blog?.exists === "unverified" ? "Not Fully Assessed" : "No Blog Detected"}
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className={`text-[19px] mt-0.5 ${blog?.exists === "unverified" ? "text-slate-400" : "text-red-500"}`}>
                      {blog?.exists === "unverified" ? "🔍" : "❌"}
                    </span>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#0D0D0D]">
                        {blog?.exists === "unverified" ? "Verification Limited (JavaScript Required)" : "Blogging / Articles Section is Missing"}
                      </h4>
                      <p className="text-[14.5px] text-[#475569] mt-1 leading-[1.6]">
                        {blog?.exists === "unverified"
                          ? "We detected potential blog or resource links, but our automated crawler couldn't verify the actual post cadence. Ensure your RSS feeds and blog archive loops are structured clearly for engines to read."
                          : "We couldn't detect an active RSS blog feed on your website. Starting a structured resource section or company blog is one of the highest-yield activities for service business websites. It creates multiple entry points from Google search queries and positions your brand as a helpful expert."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 7: Trust Signals (Testimonials) */}
          <section className="mb-12 pl-6 border-l-2 border-[#C4A35A]/15">
            <h3 className="text-[18px] font-sans font-bold text-[#0D0D0D] mb-2">
              4. Trust Signals &amp; Credibility
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#725921] bg-[#C4A35A]/10 px-2 py-0.5 rounded-sm">Feeds into: Trust &amp; Credibility</span>
            </div>
            <p className="text-[15px] italic text-[#475569] mb-6 font-light">
              Why this matters: Trust factors (like real client names, headshots, or a client logo wall) directly determine whether a visitor converts into an inquiry. Clean social proof makes cold traffic feel comfortable reaching out.
            </p>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs">
              {testimonials && testimonials.found === true ? (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                    <span className="text-[16px] uppercase font-bold text-[#475569]">Social Proof Metrics</span>
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
                      testimonials.hasNamedAttribution && testimonials.hasPhotos
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {testimonials.hasNamedAttribution && testimonials.hasPhotos ? "Strong Trust Signals" : "Basic Trust Signals"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left mb-6">
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[12px] uppercase font-bold text-[#475569] mb-1">Testimonials</span>
                      <span className="text-[26px] font-serif font-bold text-[#725921]">{testimonials.count || "Yes"}</span>
                    </div>
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[12px] uppercase font-bold text-[#475569] mb-1">Named Attribution</span>
                      <span className="text-[19px] font-semibold text-[#0D0D0D]">
                        {testimonials.hasNamedAttribution === true ? "Yes ✓" : testimonials.hasNamedAttribution === "unverified" ? "⚠️" : "Missing ⚠️"}
                      </span>
                    </div>
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-black/[0.04]">
                      <span className="block text-[12px] uppercase font-bold text-[#475569] mb-1">Client Photos</span>
                      <span className="text-[19px] font-semibold text-[#0D0D0D]">
                        {testimonials.hasPhotos === true ? "Yes ✓" : testimonials.hasPhotos === "unverified" ? "⚠️" : "Missing ⚠️"}
                      </span>
                    </div>
                    <div className="bg-[#FAFAF8] p-4 rounded-lg border border-[#000000]/[0.04]">
                      <span className="block text-[12px] uppercase font-bold text-[#475569] mb-1">Logo Wall</span>
                      <span className="text-[19px] font-semibold text-[#0D0D0D]">
                        {testimonials.hasLogoWall === true ? "Yes ✓" : testimonials.hasLogoWall === "unverified" ? "⚠️" : "Missing ⚠️"}
                      </span>
                    </div>
                  </div>
                  <div className="text-[14.5px] text-[#475569] leading-[1.6] space-y-3">
                    {testimonials.hasNamedAttribution === false && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-amber-500 font-bold">⚠️</span>
                        <p>
                          <strong>Anonymized testimonials reduce trust:</strong> Testimonials without full names or company roles look manufactured. Ensure every review has a clear, authentic client name.
                        </p>
                      </div>
                    )}
                    {testimonials.hasPhotos === false && (
                      <div className="flex gap-2.5 items-start">
                        <span className="text-amber-500 font-bold">⚠️</span>
                        <p>
                          <strong>No customer headshots detected:</strong> Adding small photos of your clients alongside their reviews increases trust by up to 34% by proving they are real people.
                        </p>
                      </div>
                    )}
                    {testimonials.hasSchema === false && (
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
                    <span className="text-[14px] uppercase font-bold text-[#475569]">Social Proof Strategy</span>
                    <span className={`px-3 py-1 border rounded-full text-[12px] font-bold ${
                      testimonials?.found === "unverified"
                        ? "bg-slate-100 text-slate-600 border-slate-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {testimonials?.found === "unverified" ? "Not Fully Assessed" : "No Testimonials Found"}
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className={`text-[19px] mt-0.5 ${testimonials?.found === "unverified" ? "text-slate-400" : "text-red-500"}`}>
                      {testimonials?.found === "unverified" ? "🔍" : "❌"}
                    </span>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#0D0D0D]">
                        {testimonials?.found === "unverified" ? "Verification Limited (JavaScript Required)" : "Lack of Social Proof on Homepage"}
                      </h4>
                      <p className="text-[14.5px] text-[#475569] mt-1 leading-[1.6]">
                        {testimonials?.found === "unverified"
                          ? "We detected potential review layouts (like carousels or embeds), but they require JavaScript to render. Ensure critical social proof is rendered server-side so bots can read it."
                          : "We couldn't detect client testimonials or reviews on your homepage. When visitors land on a service website, their primary question is *\"Can I trust this business?\"* Adding at least 3 detailed testimonials (with full names and photos) will immediately reduce bounce rates and increase contact inquiries."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 8: Contact Accessibility */}
          <section className="mb-12 pl-6 border-l-2 border-[#C4A35A]/15">
            <h3 className="text-[18px] font-sans font-bold text-[#0D0D0D] mb-2">
              5. Contact &amp; Client Accessibility
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#725921] bg-[#C4A35A]/10 px-2 py-0.5 rounded-sm">Feeds into: Trust &amp; Credibility</span>
            </div>
            <p className="text-[15px] italic text-[#475569] mb-6 font-light">
              Why this matters: Removing booking friction (like providing a direct phone number, email link, and map location) makes it simple for humans to contact you, raising conversion rates.
            </p>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs">
              {contact ? (
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                    <span className="text-[16px] uppercase font-bold text-[#475569]">Contact Channels Audit</span>
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
                      contact.hasPhone && (contact.hasEmail || contact.hasForm)
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {contact.hasPhone && (contact.hasEmail || contact.hasForm) ? "Accessible" : "Friction Points Found"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[16px]">{contact.hasPhone === true ? "✓" : contact.hasPhone === "unverified" ? "⚠️" : "❌"}</span>
                      <span className="text-[14px] font-medium text-[#475569]">Phone Number</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[16px]">{contact.hasEmail === true ? "✓" : contact.hasEmail === "unverified" ? "⚠️" : "❌"}</span>
                      <span className="text-[14px] font-medium text-[#475569]">Email Address</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[16px]">{contact.hasForm === true ? "✓" : contact.hasForm === "unverified" ? "⚠️" : "❌"}</span>
                      <span className="text-[14px] font-medium text-[#475569]">Contact Form</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[16px]">{contact.hasAddress === true ? "✓" : contact.hasAddress === "unverified" ? "⚠️" : "❌"}</span>
                      <span className="text-[14px] font-medium text-[#475569]">Physical Address</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[16px]">{contact.hasMapsEmbed === true ? "✓" : contact.hasMapsEmbed === "unverified" ? "⚠️" : "❌"}</span>
                      <span className="text-[14px] font-medium text-[#475569]">Google Maps Embed</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#FAFAF8] p-3 rounded-lg border border-black/[0.04]">
                      <span className="text-[16px]">{contact.hasBusinessHours === true ? "✓" : contact.hasBusinessHours === "unverified" ? "⚠️" : "❌"}</span>
                      <span className="text-[14px] font-medium text-[#475569]">Business Hours</span>
                    </div>
                  </div>

                  <div className="text-[14.5px] text-[#475569] leading-[1.6] space-y-2">
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
                <p className="text-[14px] text-[#475569]">Contact details analysis not available.</p>
              )}
            </div>
          </section>

          {/* Pillar 3: AI & Discovery Readiness */}
          <div id="ai-discovery" className="pt-16 border-t border-[#E2E8F0] mt-16 mb-8">
            <h2 className="text-[22px] font-sans font-bold text-[#725921] uppercase tracking-wide border-b border-black/[0.06] pb-2 mb-2">Pillar 3: {discoveryLabel}</h2>
            <p className="text-[14.5px] text-[#475569] leading-relaxed">
              {isLocal 
                ? "Rolls up local schema identifiers, map listings, geo-relevance indicators, and AI discovery crawlers."
                : "Rolls up AI chatbot crawl rules, business schemas, and search engine metadata configurations."}
            </p>
          </div>
          
          {/* Section 3: Can AI Recommend Your Business? */}
          <section className="mb-12 pl-6 border-l-2 border-[#C4A35A]/15">
            <h3 className="text-[18px] font-sans font-bold text-[#0D0D0D] mb-2">
              6. Can AI Recommend Your Business?
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#725921] bg-[#C4A35A]/10 px-2 py-0.5 rounded-sm">Feeds into: {discoveryLabel}</span>
            </div>
            <p className="text-[15px] italic text-[#475569] mb-6 font-light">
              Why this matters: Chatbots like ChatGPT, Claude, and Perplexity crawl root pages to search for verified structured schemas and indexes. If robots.txt blocks them, your company won&apos;t be recommended in AI answer engines.
            </p>
            
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                <span className="text-[16px] uppercase font-bold text-[#475569]">AI Search &amp; Chatbot Audit</span>
                <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
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
                  <span className="text-[19px] leading-none mt-0.5">{hasLocalBusinessSchema ? "✅" : "❌"}</span>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D]">Business Entity Schema</h4>
                    <p className="text-[14.5px] text-[#475569] mt-0.5 leading-[1.6]">
                      {hasLocalBusinessSchema 
                        ? "Business schema definitions found. AI engines (like ChatGPT or OpenAI's GPTBot) can successfully identify your operational details."
                        : "No LocalBusiness or Organization schema detected. AI engines require structured data to fetch details like your hours, location, and services."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-[19px] leading-none mt-0.5">{!isAiBlocked ? "✅" : "❌"}</span>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D]">AI Agent Access (robots.txt)</h4>
                    <p className="text-[14.5px] text-[#475569] mt-0.5 leading-[1.6]">
                      {!isAiBlocked 
                        ? "AI crawlers are allowed. ChatGPT, Perplexity, and Claude can read your content and cite your website."
                        : `Your configuration blocks AI search crawlers. Specifically blocked: ${blockedAiBots.length > 0 ? blockedAiBots.join(', ') : 'All bots'}.`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-[19px] leading-none mt-0.5">{llmsTxtPresent ? "✅" : "⚠️"}</span>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D]">AI Context Index File (llms.txt)</h4>
                    <p className="text-[14.5px] text-[#475569] mt-0.5 leading-[1.6]">
                      {llmsTxtPresent
                        ? "llms.txt file is present. AI crawlers have a clear, summarized guide to read your expertise efficiently."
                        : "No llms.txt file detected. Creating one guides models on how to read and summarize your services without scraping irrelevant layout blocks."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#FAFAF8] border border-black/[0.04] p-4 rounded-lg mt-6 text-[14px] text-[#475569] leading-[1.6]">
                <strong>Why this matters:</strong> AI search engines bypass traditional keywords. They use structured schemas and accessible index files to verify authority and recommend regional businesses.
              </div>
            </div>
          </section>

          {/* What We Also Noticed — Layer 1 Objective Facts (Alfred-style small observations) */}
          {observedIssues > 0 && (
            <section className="mb-12">
              <h2 className="text-[22px] font-sans font-bold text-[#725921] uppercase tracking-wide border-b border-[#E2E8F0] pb-2 mb-6">
                7. A Few Other Things We Noticed
              </h2>
              <div className="space-y-3">
                {hasMissingMetaDesc && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[17px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[15px] font-semibold text-[#0D0D0D]">No search description found</p>
                      <p className="text-[14px] text-[#475569] mt-0.5 leading-[1.5]">Your website is missing a meta description — the short summary text Google shows under your link in search results. Without one, Google picks text at random, which often looks unprofessional.</p>
                    </div>
                  </div>
                )}
                {hasOutdatedCopyright && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[17px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[15px] font-semibold text-[#0D0D0D]">Copyright year appears outdated</p>
                      <p className="text-[14px] text-[#475569] mt-0.5 leading-[1.5]">Your website's footer displays a copyright year that isn't {new Date().getFullYear()}. While small, this signals to new visitors that the site may not be actively maintained — which can reduce trust on first visit.</p>
                    </div>
                  </div>
                )}
                {noPhoneNumber && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[17px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[15px] font-semibold text-[#0D0D0D]">No phone number detected</p>
                      <p className="text-[14px] text-[#475569] mt-0.5 leading-[1.5]">We didn't find a phone number on your homepage. For local businesses, a visible phone number increases both trust and conversions — especially for visitors arriving from mobile search who want to call directly.</p>
                    </div>
                  </div>
                )}
                {noCtaButton && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[17px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[15px] font-semibold text-[#0D0D0D]">Primary call-to-action may not be prominent</p>
                      <p className="text-[14px] text-[#475569] mt-0.5 leading-[1.5]">We didn't detect a clear "Book," "Contact," or "Get Started" action on your homepage. A visible CTA is the most direct route from a visitor's interest to a conversation or booking.</p>
                    </div>
                  </div>
                )}
                {hasMissingH1 && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[17px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[15px] font-semibold text-[#0D0D0D]">No main heading detected</p>
                      <p className="text-[14px] text-[#475569] mt-0.5 leading-[1.5]">Your page appears to be missing a primary H1 heading. Search engines use this to understand what your page is about, and its absence may reduce how confidently Google ranks your page for relevant searches.</p>
                    </div>
                  </div>
                )}
                {noSocialLinks && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[17px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[15px] font-semibold text-[#0D0D0D]">No social media links detected</p>
                      <p className="text-[14px] text-[#475569] mt-0.5 leading-[1.5]">We did not find links to major social channels (Facebook, Instagram, LinkedIn, etc.) on your homepage. Social profiles are an important validation signal for both human visitors and Google search bots.</p>
                    </div>
                  </div>
                )}
                {imagesWithoutAlt > 0 && (
                  <div className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
                    <span className="text-amber-500 text-[17px] mt-0.5 shrink-0">⚠️</span>
                    <div>
                      <p className="text-[15px] font-semibold text-[#0D0D0D]">Images missing alt-text: {imagesWithoutAlt}</p>
                      <p className="text-[14px] text-[#475569] mt-0.5 leading-[1.5]">We detected {imagesWithoutAlt} images on your homepage missing text descriptions ("alt-text"). Alt descriptions allow screen readers to describe images to visually impaired visitors and assist search engines in indexing your media search relevance.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Cost of Inaction */}
          <div className="border-l-4 border-l-[#C4A35A] pl-6 my-12 text-[18px] leading-[1.75] text-[#475569] font-medium">
            <strong>The opportunity cost:</strong> Each month without these improvements may reduce your visibility in both traditional search and AI-powered discovery, allowing competitors to capture the customers searching for what you offer.
          </div>

          <section className="bg-white border border-[#E2E8F0] p-8 rounded-lg shadow-sm text-center">
            {businessCategory === "local-service" ? (
              <>
                <span className="text-[12px] font-bold tracking-[0.15em] text-[#C4A35A] uppercase block mb-2">Local SEO Strategy</span>
                <h2 className="text-[22px] font-sans font-bold text-[#725921] mb-4">Dominate Your Local Market Search</h2>
                <p className="text-[16px] text-[#475569] leading-[1.7] max-w-[620px] mx-auto mb-8 font-normal">
                  Local search is highly competitive. Let's review this report together and build a targeted roadmap to outrank local competitors and capture high-intent service inquiries in your area.
                </p>
              </>
            ) : businessCategory === "ecommerce" ? (
              <>
                <span className="text-[12px] font-bold tracking-[0.15em] text-[#C4A35A] uppercase block mb-2">E-Commerce Growth</span>
                <h2 className="text-[22px] font-sans font-bold text-[#725921] mb-4">Optimize Your Store for Conversions</h2>
                <p className="text-[16px] text-[#475569] leading-[1.7] max-w-[620px] mx-auto mb-8 font-normal">
                  Every millisecond of load time impacts your bottom line. Let's review this technical audit to identify the exact performance bottlenecks costing you sales and build a plan to fix them.
                </p>
              </>
            ) : (
              <>
                <span className="text-[12px] font-bold tracking-[0.15em] text-[#C4A35A] uppercase block mb-2">Recommended Solution</span>
                <h2 className="text-[22px] font-sans font-bold text-[#725921] mb-4">Want a Prioritized Action Plan?</h2>
                <p className="text-[16px] text-[#475569] leading-[1.7] max-w-[620px] mx-auto mb-8 font-normal">
                  I&apos;ll personally review this report with you on a free 15-minute call and show you:
                </p>
              </>
            )}
            
            <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch mt-8 max-w-[960px] mx-auto">
              <div className="flex-1 bg-white border border-[#E2E8F0] p-6 rounded-xl text-left flex flex-col justify-between shadow-xs">
                <div>
                  <h4 className="text-[16px] font-bold text-[#0D0D0D] mb-3 font-sans">Option A: Walkthrough Call</h4>
                  <p className="text-[14px] text-[#475569] mb-4 leading-[1.6]">
                    Book a free 15-minute walkthrough call. We will review your findings together and cover:
                  </p>
                  <ul className="space-y-2 mb-6 text-[13.5px] text-[#475569]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#C4A35A] font-bold shrink-0">✓</span> Which recommendations matter most to your business
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C4A35A] font-bold shrink-0">✓</span> Which issues can safely be ignored for now
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C4A35A] font-bold shrink-0">✓</span> What I&apos;d fix first if this were my own website
                    </li>
                  </ul>
                </div>
                <div>
                  <a 
                    href="https://cal.com/naveengaur/30min" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block bg-[#C4A35A] text-[#0D0D0D] px-8 py-3.5 rounded-sm text-[14px] font-bold tracking-[0.05em] uppercase hover:bg-[#d4b46a] transition-colors w-full text-center cursor-pointer"
                  >
                    Book Free 15-Min Strategy Call
                  </a>
                  <p className="text-[12px] text-[#475569] mt-3 italic text-center">
                    No sales pressure. Just factual technical advice.
                  </p>
                </div>
              </div>

              <div className="flex-1 flex">
                <AuditEmailForm url={url} reportLink={reportUrl} />
              </div>
            </div>
          </section>

          <div className="mt-16 pt-8 border-t border-[#E2E8F0] text-[16px] text-[#1E293B] leading-[1.8] font-medium">
            <strong>Naveen Gaur</strong><br />
            WordPress &amp; Full-Stack Developer • Technical Architect<br />
            <a href="mailto:hello@naveengaur.com" className="text-[#C4A35A] hover:underline">hello@naveengaur.com</a>
          </div>
        </main>

        <footer className="border-t border-[#E2E8F0] py-8 bg-white mt-24 text-center text-[13px] text-[#1E293B]">
          <div className="max-w-[860px] lg:max-w-[1040px] mx-auto px-6">
            <p>© {new Date().getFullYear()} Naveen Gaur. All rights reserved. Private Client Audit Portal.</p>
          </div>
        </footer>
        </div>
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
          <span className="text-[13px] font-mono tracking-widest text-[#725921] uppercase font-bold">
            Private Client Portal
          </span>
        </div>
        
        <span className="px-3.5 py-1 bg-[#C4A35A]/10 border border-[#C4A35A]/20 text-[#725921] rounded-full text-[11.5px] font-bold tracking-widest uppercase shadow-sm">
          Confidential Analysis
        </span>
      </div>

      <main className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] pt-36 pb-24 px-6 md:px-10 selection:bg-[#C4A35A] selection:text-[#0D0D0D]">
        <div className="max-w-[860px] lg:max-w-[1040px] mx-auto">
          
          <header className="text-center mb-16 border-b border-slate-200 pb-12 print:border-b-2 print:border-black">
            <h1 className="font-serif text-[clamp(34px,5vw,50px)] text-[#0D0D0D] tracking-[0.01em] leading-[1.2] mb-6">
              {meta.clientName}: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#725921] via-[#C4A35A] to-[#0D0D0D] print:text-black print:bg-none">
                Executive Visibility &amp; Growth Audit
              </span>
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-[680px] mx-auto mt-10 p-7 bg-white border border-slate-200 rounded-xl text-left print:bg-none print:border-none print:text-black shadow-sm">
              <div>
                <span className="block text-slate-500 uppercase tracking-widest font-bold text-[15px] mb-2 print:text-black/60">Client Site</span>
                <a href={meta.url} target="_blank" rel="noopener noreferrer" className="text-[20px] font-bold text-[#0D0D0D] hover:text-[#C4A35A] transition-colors print:text-black underline block">
                  {meta.url.replace("https://", "").replace("www.", "")}
                </a>
              </div>
              <div>
                <span className="block text-slate-500 uppercase tracking-widest font-bold text-[15px] mb-2 print:text-black/60">Prepared By</span>
                <span className="text-[20px] font-bold text-[#0D0D0D] print:text-black block">Naveen Gaur</span>
              </div>
              <div>
                <span className="block text-slate-500 uppercase tracking-widest font-bold text-[15px] mb-2 print:text-black/60">Date of Audit</span>
                <span className="text-[20px] font-bold text-[#0D0D0D] print:text-black block">{meta.auditDate}</span>
              </div>
            </div>
          </header>

          <section className="mb-14 print:break-inside-avoid">
            <h2 className="font-serif text-[21px] text-slate-500 tracking-wider uppercase mb-6 text-center print:text-black/80 font-bold">
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
                  <span className={`block font-serif text-[48px] font-bold mb-2 leading-none ${getScoreColorClass(card.score).split(" ")[0]} print:text-black`}>
                    {card.score}
                  </span>
                  <span className="text-[12px] font-bold uppercase text-slate-500 tracking-wider print:text-black/60">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[15px] text-slate-700 text-center mt-6 italic print:text-black/50 font-semibold">
              * Scores reflect Google mobile simulation (the primary basis for ranking organic searches).
            </p>
          </section>

          {/* AI Strategy Companion Callout */}
          <div className="bg-[#FAFAF8] border border-black/[0.08] p-6 rounded-lg mb-12 flex items-start gap-4 shadow-sm print:hidden">
            <span className="text-[21px] mt-0.5">💡</span>
            <div>
              <h4 className="text-[15.5px] font-bold text-[#0D0D0D] mb-1">AI-Powered Strategy Companion</h4>
              <p className="text-[14.5px] text-[#475569] leading-[1.6]">
                This report is fully crawlable and readable by large language models. You can share this URL with <strong>ChatGPT, Gemini, Perplexity, or Claude</strong> to automatically generate a tailored developer implementation roadmap.
              </p>
              <div className="bg-white border border-black/[0.06] rounded p-3.5 mt-4 font-mono text-[13.5px] text-[#475569] select-all cursor-pointer hover:bg-slate-50 transition-colors shadow-xs">
                "Here is my website performance and AI readiness report: {reportUrl}. Based on these metrics and findings, can you generate a step-by-step developer implementation plan to fix these issues?"
              </div>
            </div>
          </div>

          <section className="mb-16 print:break-inside-avoid">
            <h2 className="font-serif text-[21px] text-slate-500 tracking-wider uppercase mb-6 text-center print:text-black/80 font-bold">
              The Five Core Speed Measurements
            </h2>
            <div className="table-wrapper overflow-x-auto rounded-xl border border-slate-200 bg-white print:border-none print:bg-none print:text-black shadow-sm">
              <table className="w-full border-collapse text-[15px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 print:border-b-2 print:border-black">
                    <th className="p-4 text-[#1E293B] font-bold uppercase tracking-wider text-[12px] print:text-black">Measurement</th>
                    <th className="p-4 text-[#1E293B] font-bold uppercase tracking-wider text-[12px] print:text-black">🖥️ Desktop</th>
                    <th className="p-4 text-[#1E293B] font-bold uppercase tracking-wider text-[12px] print:text-black">📱 Mobile</th>
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
                        <span className={`inline-block px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase ${getBadgeColorClass(row.desktop, row.key)} print:text-black print:border-black`}>
                          {getBadgeText(row.desktop, row.key)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold mr-2 print:text-black text-[#0D0D0D]">{row.mobile}</span>
                        <span className={`inline-block px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase ${getBadgeColorClass(row.mobile, row.key)} print:text-black print:border-black`}>
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
