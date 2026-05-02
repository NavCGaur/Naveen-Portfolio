import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Allow retrieval/search bots to ensure citations in AI search
      {
        userAgent: ["OAI-SearchBot", "PerplexityBot"],
        allow: "/",
      },
      // Optional: Manage training bots if you want to prevent ingestion
      // {
      //   userAgent: ["GPTBot", "Google-Extended"],
      //   disallow: "/",
      // }
    ],
    sitemap: "https://naveengaur.com/sitemap.xml",
  };
}
