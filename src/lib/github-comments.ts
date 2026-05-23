import path from "path";
import fs from "fs";

const COMMENTS_DIR = path.join(process.cwd(), "src/data/comments");

export interface CommentNode {
  id: string;
  name: string;
  comment: string;
  date: string;
  isAuthor?: boolean;
  replies: CommentNode[];
}

// ─── Local filesystem read (used by CommentsList server component) ─────────────

export function readApprovedComments(slug: string): CommentNode[] {
  const filePath = path.join(COMMENTS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as CommentNode[];
    // Backwards-compatible: add replies:[] if missing (old flat comments)
    return data.map((c) => ({ ...c, replies: c.replies ?? [] }));
  } catch {
    return [];
  }
}

// ─── GitHub API helpers (used by approve/archive/reply API routes) ────────────

const GITHUB_API = "https://api.github.com";

function githubHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_PAT}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

async function getGitHubFile(repoPath: string) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${repoPath}`;

  console.log(`[GitHub GET] URL: ${url}`);
  console.log(`[GitHub ENV] OWNER="${owner}" REPO="${repo}" PAT_SET=${!!process.env.GITHUB_PAT}`);

  const res = await fetch(url, { headers: githubHeaders() });
  console.log(`[GitHub GET] Status: ${res.status}`);

  if (res.status === 404) return { content: [] as CommentNode[], sha: undefined };
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as { content: string; sha: string };
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  const parsed = JSON.parse(decoded) as CommentNode[];
  // Backwards-compatible
  const normalized = parsed.map((c) => ({ ...c, replies: c.replies ?? [] }));
  return { content: normalized, sha: data.sha };
}

async function putGitHubFile(
  repoPath: string,
  content: unknown[],
  sha: string | undefined,
  message: string
) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${repoPath}`;

  console.log(`[GitHub PUT] URL: ${url}`);

  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
  const body: Record<string, unknown> = { message, content: encoded };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: githubHeaders(),
    body: JSON.stringify(body),
  });

  const responseText = await res.text();
  console.log(`[GitHub PUT] Status: ${res.status} — ${responseText.substring(0, 300)}`);

  if (!res.ok) throw new Error(`GitHub PUT failed: ${res.status} ${responseText}`);
}

/** Recursive helper: find node by id and append reply to its replies array */
function insertReply(nodes: CommentNode[], parentId: string, reply: CommentNode): boolean {
  for (const node of nodes) {
    if (node.id === parentId) {
      node.replies = [...(node.replies ?? []), reply];
      return true;
    }
    if (node.replies?.length && insertReply(node.replies, parentId, reply)) {
      return true;
    }
  }
  return false;
}

/** Appends a top-level approved comment to src/data/comments/{slug}.json via GitHub API */
export async function appendApprovedComment(slug: string, comment: CommentNode) {
  const repoPath = `src/data/comments/${slug}.json`;
  const { content, sha } = await getGitHubFile(repoPath);
  const updated = [...content, comment];
  await putGitHubFile(repoPath, updated, sha, `chore: approve comment on ${slug}`);
}

/** Appends a nested reply inside a comment tree, identified by parentId */
export async function appendReplyToComment(slug: string, parentId: string, reply: CommentNode) {
  const repoPath = `src/data/comments/${slug}.json`;
  const { content, sha } = await getGitHubFile(repoPath);
  const found = insertReply(content, parentId, reply);
  if (!found) throw new Error(`Parent comment ${parentId} not found in ${slug}`);
  await putGitHubFile(repoPath, content, sha, `chore: add reply to comment ${parentId} on ${slug}`);
}

/** Appends an archived comment (with email) to src/data/comments/_archived.json via GitHub API */
export async function appendArchivedComment(entry: CommentNode & { email: string; slug: string }) {
  const repoPath = "src/data/comments/_archived.json";
  const { content, sha } = await getGitHubFile(repoPath);
  const updated = [...(content as unknown[]), { ...entry, archivedAt: new Date().toISOString() }];
  await putGitHubFile(repoPath, updated, sha, `chore: archive comment on ${entry.slug}`);
}
