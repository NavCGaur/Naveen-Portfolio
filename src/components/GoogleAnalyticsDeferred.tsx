"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_GA_ID = "G-F9CBSECZV2";

export default function GoogleAnalyticsDeferred({ gaId }: { gaId?: string }) {
  const pathname = usePathname();
  const activeGaId = gaId || process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_ID;

  // Track SPA page route changes
  useEffect(() => {
    if (activeGaId && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", activeGaId, {
        page_path: pathname,
      });
    }
  }, [pathname, activeGaId]);

  if (!activeGaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${activeGaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${activeGaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

