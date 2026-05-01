import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { ProjectModalProvider } from "@/hooks/use-project-modal";
import { ProjectModal } from "@/components/project-modal";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://naveengaur.com"),
  title: {
    default: "Naveen Gaur — Freelance WordPress Developer & Bug Fix Expert",
    template: "%s | Naveen Gaur",
  },
  description:
    "Freelance WordPress developer specializing in crash recovery, speed optimization, malware removal, and monthly maintenance for small businesses. Fast turnaround, direct access, no agency middlemen.",
  keywords: [
    "freelance WordPress developer",
    "WordPress bug fix",
    "WordPress crash recovery",
    "WordPress speed optimization",
    "WordPress malware removal",
    "WordPress hacked site fix",
    "WordPress maintenance retainer",
    "hire WordPress developer",
    "WordPress emergency fix",
    "WordPress security expert",
    "WordPress plugin conflict fix",
    "slow WordPress website fix",
    "WordPress developer for hire",
    "Naveen Gaur",
    "naveengaur.com",
  ],
  authors: [{ name: "Naveen Gaur", url: "https://naveengaur.com" }],
  creator: "Naveen Gaur",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://naveengaur.com",
    siteName: "Naveen Gaur — Freelance WordPress Developer",
    title: "Naveen Gaur — Freelance WordPress Developer & Bug Fix Expert",
    description:
      "WordPress crash recovery, speed optimization, malware removal, and monthly maintenance. Fast turnaround, direct access, no agency bloat.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Naveen Gaur — Freelance WordPress Developer & Bug Fix Expert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naveen Gaur — Freelance WordPress Developer & Bug Fix Expert",
    description:
      "WordPress crash recovery, speed optimization, malware removal, and monthly maintenance. Fast. Direct. Reliable.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://naveengaur.com",
  },
  verification: {
    google: "myFFUTOLVxofWjLoYics0kdwH_OziZzdIKBtaDZHXBA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable} overflow-x-hidden`}>
      <body className="overflow-x-hidden antialiased bg-surface text-ink font-sans">
        {/* Google Analytics 4 — set NEXT_PUBLIC_GA_ID in .env.local + Vercel env vars */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
        <JsonLd />
        <ProjectModalProvider>
          {children}
          <ProjectModal />
        </ProjectModalProvider>
      </body>
    </html>
  );
}
