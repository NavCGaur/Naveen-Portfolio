import type { Metadata } from "next";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Traffic Analytics | Naveen Gaur",
  description:
    "Real-time traffic analytics dashboard for naveengaur.com — powered by Oracle VPS data.",
  robots: { index: false, follow: false }, // Keep dashboard private from search engines
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
