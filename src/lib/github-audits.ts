const GITHUB_API = "https://api.github.com";

function githubHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_PAT}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

export type DetectionState = boolean | "unverified";

export interface AuditReport {
  id: string;
  url: string;
  name: string;
  email: string;
  status: "pending" | "completed" | "failed";
  timestamp: string;
  metrics?: {
    performance: number;
    seo: number;
    bestPractices: number;
    accessibility: number;
  };
  pageSpeedUnavailable?: boolean;
  rawHtmlLoadTime?: number;
  rawHtmlFetchFailed?: boolean;
  details?: {
    ttfb?: number; // in ms
    loadTime?: number; // in s
    lcp?: number; // in s
    fcp?: number; // in s
    tbt?: number; // in ms
    cls?: number; // unitless
    pageSize?: number; // in MB
    pageBuilder: "Elementor" | "Divi" | "WPBakery" | "Gutenberg" | "None" | "Unknown";
    pluginCount: number;
    cachingActive: boolean;
    schemaTypes: string[];
    aiRobotsAllowed: boolean;
    blockedAiBots?: string[];
    llmsTxtPresent: boolean;
    // Business identification
    businessName?: string;
    businessType?: string;
    // Layer 1 objective facts
    hasMissingH1?: DetectionState;
    hasMissingMetaDesc?: DetectionState;
    hasOutdatedCopyright?: DetectionState;
    noPhoneNumber?: DetectionState;
    noCtaButton?: DetectionState;
    noSocialLinks?: DetectionState;
    imagesWithoutAlt?: number;
    // Blog / content analysis
    blog?: {
      exists: DetectionState;
      totalPosts: number;
      daysSinceLastPost?: number;
      avgIntervalDays?: number;
      recentAvgIntervalDays?: number;
      historicAvgIntervalDays?: number;
      contentSlowing?: boolean;
    };
    // Business credibility score (0–10)
    credibility?: {
      score: number;
      hasAboutPage: DetectionState;
      hasTeamPage: DetectionState;
      hasPrivacyPolicy: DetectionState;
      hasTerms: DetectionState;
      hasTestimonials: DetectionState;
      hasReviewSchema: DetectionState;
      hasSocialLinks: DetectionState;
      hasAddress: DetectionState;
      hasPhone: DetectionState;
    };
    // Local SEO readiness score (0–10)
    localSeo?: {
      score: number;
      hasPhone: DetectionState;
      hasAddress: DetectionState;
      hasLocalSchema: DetectionState;
      hasMapsEmbed: DetectionState;
      hasCityInH1: DetectionState;
      hasServiceArea: DetectionState;
      hasBusinessHours: DetectionState;
    };
    // Online Authority & Discovery readiness score (0–10)
    onlineAuthority?: {
      score: number;
      hasAboutOrTeam: DetectionState;
      hasTestimonials: DetectionState;
      hasReviewSchema: DetectionState;
      hasSocialLinks: DetectionState;
      hasLegalPages: DetectionState;
      hasGoodSpeedOrCache: DetectionState;
    };
    // Testimonial trust signals
    testimonials?: {
      found: DetectionState;
      count: number;
      hasNamedAttribution: DetectionState;
      hasSchema: DetectionState;
      hasPhotos: DetectionState;
      hasLogoWall?: DetectionState; // Added based on plan
    };
    // Contact accessibility
    contact?: {
      hasPhone: DetectionState;
      hasEmail: DetectionState;
      hasForm: DetectionState;
      hasAddress: DetectionState;
      hasMapsEmbed: DetectionState;
      hasBusinessHours: DetectionState;
    };
  };
  // AI-generated synthesis observations (Gemini)
  aiObservations?: Array<{ title: string; body: string }>;
  executiveSummary?: string;
  businessCategory?: "local-service" | "professional-service" | "ecommerce" | "content-saas";
  error?: string;
}

export async function getAudit(id: string): Promise<AuditReport | null> {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const repoPath = `src/data/audits/${id}.json`;
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${repoPath}`;

  try {
    const res = await fetch(url, { 
      headers: githubHeaders(),
      next: { revalidate: 0 } // Bypass caching to ensure we get fresh data
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      console.error(`GitHub GET failed for audit ${id}:`, res.status, await res.text());
      return null;
    }

    const data = await res.json() as { content: string };
    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(decoded) as AuditReport;
  } catch (error) {
    console.error(`Error fetching audit ${id} from GitHub:`, error);
    return null;
  }
}

export async function saveAudit(id: string, audit: AuditReport): Promise<boolean> {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const repoPath = `src/data/audits/${id}.json`;
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${repoPath}`;

  try {
    // Skip SHA check — audit IDs are UUIDs so collisions are effectively impossible.
    // The extra GET call was costing 3–8s of sequential blocking inside Vercel's function budget.
    const encoded = Buffer.from(JSON.stringify(audit, null, 2)).toString("base64");
    const body: Record<string, unknown> = {
      message: `chore: save website audit report ${id}`,
      content: encoded,
    };

    const putRes = await fetch(url, {
      method: "PUT",
      headers: githubHeaders(),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

    if (!putRes.ok) {
      console.error(`GitHub PUT failed for audit ${id}:`, putRes.status, await putRes.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error saving audit ${id} to GitHub:`, error);
    return false;
  }
}

/**
 * List all audit reports stored in src/data/audits/ on GitHub.
 * Uses the Contents API to list the directory, then batch-fetches
 * each file in parallel (10 at a time) to avoid rate limits.
 * Returns reports sorted newest-first by timestamp.
 */
export async function listAudits(): Promise<AuditReport[]> {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  try {
    // Step 1: list directory contents
    const dirUrl = `${GITHUB_API}/repos/${owner}/${repo}/contents/src/data/audits`;
    const dirRes = await fetch(dirUrl, {
      headers: githubHeaders(),
      next: { revalidate: 0 },
    });

    if (dirRes.status === 404) return []; // directory doesn't exist yet
    if (!dirRes.ok) {
      console.error("GitHub dir list failed:", dirRes.status, await dirRes.text());
      return [];
    }

    const entries = await dirRes.json() as Array<{
      name: string;
      type: string;
      download_url: string;
      url: string;
    }>;

    const jsonEntries = entries.filter(
      (e) => e.type === "file" && e.name.endsWith(".json")
    );

    if (jsonEntries.length === 0) return [];

    // Step 2: fetch each file in parallel batches of 10
    const BATCH = 10;
    const reports: AuditReport[] = [];

    for (let i = 0; i < jsonEntries.length; i += BATCH) {
      const batch = jsonEntries.slice(i, i + BATCH);
      const results = await Promise.allSettled(
        batch.map(async (entry) => {
          // Use download_url for raw content — avoids base64 decode step
          const res = await fetch(entry.download_url, {
            next: { revalidate: 0 },
          });
          if (!res.ok) return null;
          return await res.json() as AuditReport;
        })
      );
      for (const result of results) {
        if (result.status === "fulfilled" && result.value) {
          reports.push(result.value);
        }
      }
    }

    // Sort newest-first
    return reports.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Error listing audits from GitHub:", error);
    return [];
  }
}


