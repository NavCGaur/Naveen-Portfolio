import { MetadataRoute } from "next";
import { getAllPosts, getAllCategories } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categories = getAllCategories();

  // Individual blog post URLs — use actual post date for lastModified
  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://naveengaur.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Category index pages — use date of most recent post in the category
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => {
    const catPosts = posts.filter(
      (p) =>
        p.category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ===
        cat.slug
    );
    const latestDate =
      catPosts.length > 0 ? new Date(catPosts[0].date) : new Date();
    return {
      url: `https://naveengaur.com/blog/category/${cat.slug}`,
      lastModified: latestDate,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    };
  });

  return [
    {
      url: "https://naveengaur.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://naveengaur.com/blog",
      lastModified: posts.length > 0 ? new Date(posts[0].date) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://naveengaur.com/free-audit",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://naveengaur.com/agency",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://naveengaur.com/migration",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://naveengaur.com/whatsapp-automation",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://naveengaur.com/hosting-automation",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://naveengaur.com/wordpress-maintenance",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://naveengaur.com/how-it-works",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Category pages
    ...categoryUrls,
    // Individual blog posts
    ...blogUrls,
  ];
}
