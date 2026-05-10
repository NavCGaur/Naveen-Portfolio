"use client";

import { useState } from "react";
import { trackArticleShare } from "@/lib/ga";

interface ArticleShareButtonsProps {
  slug: string;
  title: string;
}

export default function ArticleShareButtons({ slug, title }: ArticleShareButtonsProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const url = `https://naveengaur.com/blog/${slug}`;

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
    trackArticleShare("twitter", slug);
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
    trackArticleShare("linkedin", slug);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      trackArticleShare("link", slug);
    } catch {
      // fail silently
    }
  };

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.18s",
    border: "1px solid var(--bt-border-md)",
    background: "var(--bt-input-bg)",
    color: "var(--bt-text-muted)",
  };

  return (
    <div
      className="flex items-center gap-2 sm:gap-3 py-5 border-y blog-border mb-12 overflow-x-auto no-scrollbar"
    >
      {/* Twitter / X */}
      <button onClick={shareTwitter} style={btnBase} className="flex-1 sm:flex-none justify-center min-w-fit" aria-label="Share on X (Twitter)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.713 5.88zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span className="hidden sm:inline">Share on X</span>
        <span className="sm:hidden text-[11px]">X</span>
      </button>

      {/* LinkedIn */}
      <button onClick={shareLinkedIn} style={btnBase} className="flex-1 sm:flex-none justify-center min-w-fit" aria-label="Share on LinkedIn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        <span>LinkedIn</span>
      </button>

      {/* Copy Link */}
      <button
        onClick={copyLink}
        style={{
          ...btnBase,
          ...(linkCopied ? { borderColor: "rgba(34,197,94,0.4)", color: "#22c55e", background: "rgba(34,197,94,0.06)" } : {}),
        }}
        className="flex-1 sm:flex-none justify-center min-w-fit"
        aria-label="Copy article link"
      >
        {linkCopied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[11px] sm:text-[13px]">Copied</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="hidden sm:inline">Copy Link</span>
            <span className="sm:hidden text-[11px]">Link</span>
          </>
        )}
      </button>
    </div>
  );
}
