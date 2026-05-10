"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { trackCommentSubmitted } from "@/lib/ga";

const commentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(1000, "Please keep comments under 1000 characters"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export default function CommentForm({ slug }: { slug: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  const commentValue = watch("comment", "");

  const onSubmit = async (data: CommentFormValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/comments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, slug }),
      });
      if (!res.ok) throw new Error("Submit failed");
      trackCommentSubmitted(slug);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        style={{
          background: "rgba(34,197,94,0.06)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: "10px",
          padding: "28px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "28px", marginBottom: "10px" }}>✅</div>
        <div style={{ color: "var(--bt-heading)", fontSize: "16px", fontWeight: 500, marginBottom: "6px" }}>
          Comment submitted for moderation
        </div>
        <div style={{ color: "var(--bt-text-muted)", fontSize: "14px" }}>
          I&apos;ll review it shortly. Approved comments appear here after the next site build.
        </div>
        <button
          onClick={() => setStatus("idle")}
          style={{
            marginTop: "16px",
            fontSize: "13px",
            color: "#C4A35A",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Leave another comment
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bt-input-bg)",
    border: "1px solid var(--bt-border-md)",
    borderRadius: "6px",
    padding: "10px 14px",
    fontSize: "15px",
    color: "var(--bt-heading)",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    color: "var(--bt-text-muted)",
    marginBottom: "6px",
    letterSpacing: "0.01em",
  };

  const errorStyle: React.CSSProperties = {
    color: "#f87171",
    fontSize: "12px",
    marginTop: "4px",
  };

  return (
    <div>
      <h3 style={{ fontSize: "18px", fontWeight: 500, color: "var(--bt-heading)", marginBottom: "20px", fontFamily: "var(--font-dm-serif)" }}>
        Leave a Comment
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label htmlFor="comment-name" style={labelStyle}>Name *</label>
            <input
              id="comment-name"
              {...register("name")}
              placeholder="Your name"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(196,163,90,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--bt-border-md)")}
            />
            {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="comment-email" style={labelStyle}>Email * <span style={{ color: "var(--bt-text-faint)", fontSize: "11px" }}>(not shown publicly)</span></label>
            <input
              id="comment-email"
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(196,163,90,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--bt-border-md)")}
            />
            {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="comment-text" style={labelStyle}>
            Comment *{" "}
            <span style={{ color: commentValue.length > 900 ? "#f87171" : "var(--bt-text-faint)", fontSize: "11px" }}>
              {commentValue.length}/1000
            </span>
          </label>
          <textarea
            id="comment-text"
            {...register("comment")}
            rows={4}
            placeholder="Share your thoughts..."
            style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(196,163,90,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--bt-border-md)")}
          />
          {errors.comment && <p style={errorStyle}>{errors.comment.message}</p>}
        </div>

        {status === "error" && (
          <p style={{ color: "#f87171", fontSize: "14px" }}>
            Something went wrong. Please try again.
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "var(--bt-text-faint)" }}>
            Comments are moderated before appearing on the site.
          </p>
          <button
            type="submit"
            disabled={status === "submitting"}
            style={{
              background: status === "submitting" ? "rgba(196,163,90,0.5)" : "#C4A35A",
              color: "#0D0D0D",
              border: "none",
              borderRadius: "6px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: status === "submitting" ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              fontFamily: "inherit",
            }}
          >
            {status === "submitting" ? "Submitting…" : "Submit Comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
