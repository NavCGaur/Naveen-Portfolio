export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

type GtagFn = (...args: unknown[]) => void;
function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof (window as { gtag?: GtagFn }).gtag === "function") {
    (window as unknown as { gtag: GtagFn }).gtag(...args);
  }
}

// Generic low-level event — keep for backward compat with Contact form
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

// ─── Article-specific typed helpers ───────────────────────────────────────────

/** Fires scroll_depth event at 25 / 50 / 75 / 100 percent milestones */
export function trackScrollDepth(depth: 25 | 50 | 75 | 100, slug: string) {
  gtag("event", "scroll_depth", {
    event_category: "article_engagement",
    event_label: slug,
    depth_percent: depth,
  });
}

/** Fires time_on_page at 30s / 60s / 2min / 5min milestones */
export function trackTimeOnPage(seconds: 30 | 60 | 120 | 300, slug: string) {
  gtag("event", "time_on_page", {
    event_category: "article_engagement",
    event_label: slug,
    seconds_spent: seconds,
  });
}

/** Fires outbound_click when reader clicks the CTA */
export function trackOutboundClick(label: string, slug: string) {
  gtag("event", "outbound_click", {
    event_category: "conversion",
    event_label: label,
    article_slug: slug,
  });
}

/** Fires copy_code when a code block is copied */
export function trackCopyCode(slug: string) {
  gtag("event", "copy_code", {
    event_category: "article_engagement",
    event_label: slug,
  });
}

/** Fires article_share when a share button is clicked */
export function trackArticleShare(platform: "twitter" | "linkedin" | "link", slug: string) {
  gtag("event", "article_share", {
    event_category: "article_engagement",
    event_label: slug,
    share_platform: platform,
  });
}

/** Fires comment_submitted when the comment form submits successfully */
export function trackCommentSubmitted(slug: string) {
  gtag("event", "comment_submitted", {
    event_category: "article_engagement",
    event_label: slug,
  });
}
