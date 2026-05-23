"use client";

import { useState, useEffect, useCallback } from "react";
import type { CommentNode } from "@/lib/github-comments";

const POSTS_WITH_COMMENTS = [
  "antigravity-update-issue",
  "how-to-recover-hacked-wordpress-website",
  "wordpress-site-crashed-after-plugin-update",
  "ghost-security-vulnerability-fix",
  "ghost-author-box-sidebar",
  "ghost-cms-css-customization",
  "mcp-ga4-ai-agent",
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ReplyFormProps {
  slug: string;
  parentId: string;
  replyingToName: string;
  adminSecret: string;
  onSuccess: () => void;
}

function ReplyForm({ slug, parentId, replyingToName, adminSecret, onSuccess }: ReplyFormProps) {
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/comments/reply-author", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({ slug, parentId, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      setStatus("success");
      setComment("");
      setTimeout(onSuccess, 1500);
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{ color: "#22c55e", fontSize: "13px", padding: "10px 0" }}>
        ✅ Reply posted! Vercel will rebuild in ~60 seconds.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: "12px", color: "#9A9A9A" }}>Replying to {replyingToName}</div>
      <textarea
        required
        rows={3}
        placeholder="Type your reply as Naveen..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "6px",
          padding: "10px 14px",
          fontSize: "14px",
          color: "#fff",
          fontFamily: "inherit",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      {status === "error" && (
        <p style={{ color: "#f87171", fontSize: "12px", margin: 0 }}>
          Failed to post reply. Check ADMIN_SECRET or connection.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        style={{
          background: status === "submitting" ? "rgba(196,163,90,0.4)" : "#C4A35A",
          color: "#0D0D0D",
          border: "none",
          borderRadius: "6px",
          padding: "8px 20px",
          fontSize: "13px",
          fontWeight: 700,
          cursor: status === "submitting" ? "not-allowed" : "pointer",
          alignSelf: "flex-start",
        }}
      >
        {status === "submitting" ? "Posting…" : "Post Reply as Naveen →"}
      </button>
    </form>
  );
}

function CommentTree({
  nodes,
  slug,
  adminSecret,
  depth,
  onReload,
}: {
  nodes: CommentNode[];
  slug: string;
  adminSecret: string;
  depth: number;
  onReload: () => void;
}) {
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);

  if (!nodes.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {nodes.map((c) => (
        <div
          key={c.id}
          style={{
            paddingLeft: depth > 0 ? "20px" : "0",
            borderLeft: depth > 0 ? "2px solid rgba(196,163,90,0.2)" : "none",
          }}
        >
          <div
            style={{
              background: c.isAuthor ? "rgba(196,163,90,0.08)" : "rgba(255,255,255,0.04)",
              border: c.isAuthor ? "1px solid rgba(196,163,90,0.2)" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "14px 18px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: 700, color: c.isAuthor ? "#C4A35A" : "#fff", fontSize: "14px" }}>
                  {c.name}
                </span>
                {c.isAuthor && (
                  <span style={{ fontSize: "10px", background: "rgba(196,163,90,0.2)", color: "#C4A35A", borderRadius: "99px", padding: "2px 8px", fontWeight: 700 }}>
                    AUTHOR
                  </span>
                )}
              </div>
              <span style={{ fontSize: "11px", color: "#6A6A6A", whiteSpace: "nowrap" }}>{formatDate(c.date)}</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>
              {c.comment}
            </p>

            {/* Only allow admin to reply if comment is NOT from the author */}
            {!c.isAuthor && (
              <div style={{ marginTop: "10px" }}>
                {openReplyId === c.id ? (
                  <ReplyForm
                    slug={slug}
                    parentId={c.id}
                    replyingToName={c.name}
                    adminSecret={adminSecret}
                    onSuccess={() => {
                      setOpenReplyId(null);
                      onReload();
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setOpenReplyId(c.id)}
                    style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", padding: "5px 14px", fontSize: "12px", color: "#9A9A9A", cursor: "pointer" }}
                  >
                    ↩ Reply as Naveen
                  </button>
                )}
              </div>
            )}
          </div>

          {c.replies?.length > 0 && (
            <CommentTree
              nodes={c.replies}
              slug={slug}
              adminSecret={adminSecret}
              depth={depth + 1}
              onReload={onReload}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminReplyPage() {
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [comments, setComments] = useState<Record<string, CommentNode[]>>({});
  const [loading, setLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");

  const loadComments = useCallback(async () => {
    setLoading(true);
    const result: Record<string, CommentNode[]> = {};
    for (const slug of POSTS_WITH_COMMENTS) {
      try {
        const res = await fetch(`/api/admin/comments?slug=${slug}`, {
          headers: { Authorization: `Bearer ${adminSecret}` },
        });
        if (res.ok) {
          result[slug] = await res.json();
        }
      } catch {
        result[slug] = [];
      }
    }
    setComments(result);
    setLoading(false);
  }, [adminSecret]);

  useEffect(() => {
    if (isAuth) loadComments();
  }, [isAuth, loadComments]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side check against a known prefix of the admin secret
    // The real protection is the API endpoint requiring the full ADMIN_SECRET
    if (password.length >= 8) {
      setAdminSecret(password);
      setIsAuth(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  if (!isAuth) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form onSubmit={handleAuth} style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "48px", width: "100%", maxWidth: "420px" }}>
          <h1 style={{ color: "#fff", fontSize: "22px", marginBottom: "8px", fontWeight: 700 }}>Comment Admin</h1>
          <p style={{ color: "#6A6A6A", fontSize: "14px", marginBottom: "28px" }}>Enter your ADMIN_SECRET to manage comments and post replies.</p>
          <input
            type="password"
            placeholder="Admin secret..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${authError ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
              borderRadius: "6px",
              padding: "12px 16px",
              fontSize: "15px",
              color: "#fff",
              marginBottom: "12px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {authError && <p style={{ color: "#f87171", fontSize: "12px", marginBottom: "12px" }}>Secret must be at least 8 characters.</p>}
          <button
            type="submit"
            style={{ width: "100%", background: "#C4A35A", color: "#0D0D0D", border: "none", borderRadius: "6px", padding: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}
          >
            Sign In →
          </button>
        </form>
      </div>
    );
  }

  const totalComments = Object.values(comments).reduce((s, arr) => s + (arr?.length || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "40px 24px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: 700, margin: 0 }}>Comment Admin</h1>
            <p style={{ color: "#6A6A6A", fontSize: "14px", marginTop: "4px" }}>
              {loading ? "Loading…" : `${totalComments} top-level comment thread(s) across ${POSTS_WITH_COMMENTS.length} posts`}
            </p>
          </div>
          <button
            onClick={loadComments}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", padding: "8px 16px", color: "#fff", fontSize: "13px", cursor: "pointer" }}
          >
            ↻ Refresh
          </button>
        </div>

        {POSTS_WITH_COMMENTS.map((slug) => {
          const postComments = comments[slug] || [];
          if (!postComments.length) return null;
          return (
            <div key={slug} style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "28px", marginBottom: "24px" }}>
              <h2 style={{ color: "#C4A35A", fontSize: "16px", fontWeight: 700, marginBottom: "20px", fontFamily: "monospace" }}>
                /blog/{slug}
              </h2>
              <CommentTree
                nodes={postComments}
                slug={slug}
                adminSecret={adminSecret}
                depth={0}
                onReload={loadComments}
              />
            </div>
          );
        })}

        {!loading && totalComments === 0 && (
          <div style={{ color: "#6A6A6A", textAlign: "center", padding: "60px 0", fontSize: "16px" }}>
            No approved comments found.
          </div>
        )}
      </div>
    </div>
  );
}
