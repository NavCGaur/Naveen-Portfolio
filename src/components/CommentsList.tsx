"use client";

import { useState } from "react";
import type { CommentNode } from "@/lib/github-comments";

interface InlineReplyFormProps {
  slug: string;
  parentId: string;
  replyingTo: string;
  onCancel: () => void;
}

function InlineReplyForm({ slug, parentId, replyingTo, onCancel }: InlineReplyFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/comments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, comment, parentId }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{
        background: "rgba(34,197,94,0.06)",
        border: "1px solid rgba(34,197,94,0.2)",
        borderRadius: "8px",
        padding: "16px 20px",
        marginTop: "12px",
        fontSize: "14px",
        color: "var(--bt-text-muted)",
      }}>
        ✅ Your reply has been submitted for moderation. I&apos;ll review it shortly.
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bt-input-bg)",
    border: "1px solid var(--bt-border-md)",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "14px",
    color: "var(--bt-heading)",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ fontSize: "12px", color: "var(--bt-text-faint)", marginBottom: "2px" }}>
        ↩ Replying to <strong style={{ color: "var(--bt-text-muted)" }}>{replyingTo}</strong>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <input
          required
          placeholder="Your name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          required
          type="email"
          placeholder="Email * (not shown)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>
      <textarea
        required
        placeholder="Your reply..."
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
      />
      {status === "error" && (
        <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>Something went wrong. Please try again.</p>
      )}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          type="submit"
          disabled={status === "submitting"}
          style={{
            background: status === "submitting" ? "rgba(196,163,90,0.5)" : "#C4A35A",
            color: "#0D0D0D",
            border: "none",
            borderRadius: "6px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: status === "submitting" ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {status === "submitting" ? "Submitting…" : "Submit Reply"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{ background: "none", border: "none", fontSize: "13px", color: "var(--bt-text-faint)", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
      <p style={{ fontSize: "11px", color: "var(--bt-text-faint)", margin: 0 }}>
        Replies are moderated before appearing.
      </p>
    </form>
  );
}

interface CommentItemProps {
  comment: CommentNode;
  slug: string;
  depth: number;
}

function CommentItem({ comment: c, slug, depth }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div
      style={{
        borderLeft: depth > 0 ? "2px solid rgba(196,163,90,0.25)" : "none",
        paddingLeft: depth > 0 ? "16px" : "0",
        marginTop: depth > 0 ? "12px" : "0",
      }}
    >
      <div
        style={{
          background: c.isAuthor ? "rgba(196,163,90,0.05)" : "var(--bt-input-bg)",
          border: c.isAuthor ? "1px solid rgba(196,163,90,0.2)" : "1px solid var(--bt-border)",
          borderRadius: "10px",
          padding: "16px 20px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          {/* Avatar */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: c.isAuthor ? "rgba(196,163,90,0.2)" : "rgba(196,163,90,0.1)",
              border: c.isAuthor ? "1px solid rgba(196,163,90,0.4)" : "1px solid rgba(196,163,90,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 600,
              color: "#C4A35A",
              flexShrink: 0,
            }}
          >
            {c.name.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--bt-heading)" }}>
                {c.name}
              </span>
              {c.isAuthor && (
                <span style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  background: "rgba(196,163,90,0.15)",
                  color: "#C4A35A",
                  border: "1px solid rgba(196,163,90,0.3)",
                  borderRadius: "99px",
                  padding: "2px 8px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}>
                  Author
                </span>
              )}
            </div>
            <div style={{ fontSize: "12px", color: "var(--bt-text-faint)" }}>
              {new Date(c.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Comment text */}
        <p style={{ fontSize: "15px", color: "var(--bt-text)", lineHeight: "1.65", margin: 0, whiteSpace: "pre-wrap" }}>
          {c.comment}
        </p>

        {/* Reply button: only show on author replies (depth 1) for readers to follow up */}
        {c.isAuthor && depth === 1 && !showReplyForm && (
          <button
            onClick={() => setShowReplyForm(true)}
            style={{
              marginTop: "12px",
              background: "none",
              border: "1px solid var(--bt-border-md)",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "12px",
              color: "var(--bt-text-muted)",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(196,163,90,0.5)";
              e.currentTarget.style.color = "#C4A35A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--bt-border-md)";
              e.currentTarget.style.color = "var(--bt-text-muted)";
            }}
          >
            ↩ Reply
          </button>
        )}

        {/* Inline reply form */}
        {showReplyForm && (
          <InlineReplyForm
            slug={slug}
            parentId={c.id}
            replyingTo={c.name}
            onCancel={() => setShowReplyForm(false)}
          />
        )}
      </div>

      {/* Render nested replies */}
      {c.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} slug={slug} depth={depth + 1} />
      ))}
    </div>
  );
}

interface CommentsListProps {
  slug: string;
  comments: CommentNode[];
}

export default function CommentsList({ slug, comments }: CommentsListProps) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 500,
          color: "var(--bt-heading)",
          marginBottom: comments.length ? "24px" : "0",
          fontFamily: "var(--font-dm-serif)",
        }}
      >
        {comments.length === 0
          ? null
          : `${comments.length} Comment${comments.length > 1 ? "s" : ""}`}
      </h3>

      {comments.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} slug={slug} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}
