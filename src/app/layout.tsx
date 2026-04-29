import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

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
    default: "Naveen Gaur — WordPress & Web Developer",
    template: "%s | Naveen Gaur",
  },
  description:
    "I build, fix, and maintain WordPress websites for small businesses and founders. Fast, secure, and reliable sites — no surprise downtime, no disappearing developers.",
  keywords: [
    "WordPress developer",
    "WordPress maintenance",
    "website security",
    "WordPress speed optimization",
    "SEO WordPress",
    "full stack developer",
    "WordPress retainer",
    "website emergency fix",
    "WordPress support",
    "freelance web developer India",
    "Naveen Gaur",
  ],
  authors: [{ name: "Naveen Gaur", url: "https://naveengaur.com" }],
  creator: "Naveen Gaur",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://naveengaur.com",
    siteName: "Naveen Gaur",
    title: "Naveen Gaur — WordPress & Web Developer",
    description:
      "I build, fix, and maintain WordPress websites for small businesses and founders. Fast, secure, reliable sites — no surprise downtime.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Naveen Gaur — WordPress & Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naveen Gaur — WordPress & Web Developer",
    description:
      "I build, fix, and maintain WordPress websites. Fast, secure, reliable — no surprise downtime.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable} overflow-x-hidden`}>
      <body className="overflow-x-hidden antialiased bg-surface text-ink font-sans">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
