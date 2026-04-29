import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://naveengaur.com/sitemap.xml",
    host: "https://naveengaur.com",
  };
}
