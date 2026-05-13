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
    default: "Naveen Gaur — WordPress Performance & Full-Stack Consultant",
    template: "%s | Naveen Gaur",
  },
  description:
    "WordPress Performance Specialist & Full-Stack Consultant | Technical SEO · Emergency Recovery · Custom Web Apps | Helping Founders Fix What Others Can’t",
  keywords: [
    "WordPress Performance Specialist",
    "Full-Stack Consultant",
    "Technical SEO",
    "WordPress Emergency Recovery",
    "Custom Web Applications",
    "WordPress speed optimization",
    "WordPress malware removal",
    "WordPress maintenance retainer",
    "Naveen Gaur",
    "naveengaur.com",
  ],
  authors: [{ name: "Naveen Gaur", url: "https://naveengaur.com" }],
  creator: "Naveen Gaur",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://naveengaur.com",
    siteName: "Naveen Gaur — Performance & Full-Stack Consultant",
    title: "Naveen Gaur — WordPress Performance & Full-Stack Consultant",
    description:
      "WordPress Performance Specialist & Full-Stack Consultant | Technical SEO · Emergency Recovery · Custom Web Apps | Helping Founders Fix What Others Can’t",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Naveen Gaur — WordPress Performance & Full-Stack Consultant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naveen Gaur — WordPress Performance & Full-Stack Consultant",
    description:
      "WordPress Performance Specialist & Full-Stack Consultant | Technical SEO · Emergency Recovery · Custom Web Apps | Helping Founders Fix What Others Can’t",
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
