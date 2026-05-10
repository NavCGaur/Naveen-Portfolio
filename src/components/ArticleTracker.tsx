"use client";

import { useEffect, useRef } from "react";
import { trackScrollDepth, trackTimeOnPage } from "@/lib/ga";

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;
const TIME_MILESTONES = [30, 60, 120, 300] as const; // seconds

export default function ArticleTracker({ slug }: { slug: string }) {
  const firedDepths = useRef(new Set<number>());
  const firedTimes = useRef(new Set<number>());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // ── Scroll depth ────────────────────────────────────────────────────────
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const threshold of SCROLL_THRESHOLDS) {
        if (pct >= threshold && !firedDepths.current.has(threshold)) {
          firedDepths.current.add(threshold);
          trackScrollDepth(threshold, slug);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // fire immediately in case page is short

    // ── Time on page ────────────────────────────────────────────────────────
    for (const seconds of TIME_MILESTONES) {
      const t = setTimeout(() => {
        if (!firedTimes.current.has(seconds)) {
          firedTimes.current.add(seconds);
          trackTimeOnPage(seconds, slug);
        }
      }, seconds * 1000);
      timers.current.push(t);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [slug]);

  return null; // invisible — no DOM output
}
