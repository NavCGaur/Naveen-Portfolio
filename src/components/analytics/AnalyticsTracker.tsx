"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Reset tracked depths on path change
    trackedDepths.current.clear();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      
      if (scrollHeight <= 0) return;

      const percentage = (scrolled / scrollHeight) * 100;

      const depths = [25, 50, 75, 100];
      depths.forEach((depth) => {
        if (percentage >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          
          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "scroll_depth",
              page: pathname,
              data: { depth }
            })
          }).catch(console.error);
        }
      });
    };

    const handleCtaClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (link) {
        const href = link.getAttribute("href") || "";
        const isExternal = href.startsWith("http");
        const isEmail = href.startsWith("mailto:");
        
        let ctaType = null;
        if (isEmail) ctaType = "email_click";
        else if (href.includes("github.com")) ctaType = "github_click";
        else if (href.includes("twitter.com") || href.includes("linkedin.com")) ctaType = "social_click";
        else if (link.textContent?.toLowerCase().includes("hire")) ctaType = "hire_me_click";
        
        if (ctaType) {
          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "cta_click",
              page: pathname,
              data: { type: ctaType, href }
            })
          }).catch(console.error);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleCtaClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleCtaClick);
    };
  }, [pathname]);

  return null;
}
