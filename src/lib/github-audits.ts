const GITHUB_API = "https://api.github.com";

function githubHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_PAT}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

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
  details?: {
    ttfb: number; // in ms
    loadTime: number; // in s
    lcp: number; // in s
    fcp: number; // in s
    tbt: number; // in ms
    cls: number; // unitless
    pageSize: number; // in MB
    pageBuilder: "Elementor" | "Divi" | "WPBakery" | "Gutenberg" | "None" | "Unknown";
    pluginCount: number;
    cachingActive: boolean;
    schemaTypes: string[];
    aiRobotsAllowed: boolean;
    llmsTxtPresent: boolean;
  };
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
    // Check if file already exists to get SHA (for updates, though ID is UUID so highly unlikely)
    const checkRes = await fetch(url, { headers: githubHeaders() });
    let sha: string | undefined = undefined;
    if (checkRes.status === 200) {
      const checkData = await checkRes.json() as { sha: string };
      sha = checkData.sha;
    }

    const encoded = Buffer.from(JSON.stringify(audit, null, 2)).toString("base64");
    const body: Record<string, unknown> = {
      message: `chore: save website audit report ${id}`,
      content: encoded,
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(url, {
      method: "PUT",
      headers: githubHeaders(),
      body: JSON.stringify(body),
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
