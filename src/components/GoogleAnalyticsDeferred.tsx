"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GoogleAnalyticsDeferred({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId) return;

    const loadGA = () => {
      // Prevent double loading
      if ((window as any).ga4_loaded) return;
      (window as any).ga4_loaded = true;

      // Load GTag script
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize GTag data layer
      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtag = (...args: any[]) => {
        (window as any).dataLayer.push(args);
      };
      (window as any).gtag = gtag;
      gtag("js", new Date());
      gtag("config", gaId, { page_path: window.location.pathname });

      // Clean up event listeners
      removeListeners();
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    
    const removeListeners = () => {
      events.forEach((event) => {
        window.removeEventListener(event, loadGA);
      });
    };

    events.forEach((event) => {
      window.addEventListener(event, loadGA, { passive: true });
    });

    // Fallback to load after 4 seconds if no user interaction
    const timeoutId = setTimeout(loadGA, 4000);

    return () => {
      removeListeners();
      clearTimeout(timeoutId);
    };
  }, [gaId]);

  // Track page path changes in single-page app navigation
  useEffect(() => {
    if (gaId && (window as any).gtag) {
      (window as any).gtag("config", gaId, { page_path: pathname });
    }
  }, [pathname, gaId]);

  return null;
}
