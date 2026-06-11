import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { categoryToSlug } from "./utils";

// Re-export so existing server-side callers don't need to change
export { categoryToSlug };

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTime: string;
  content: string;
  image?: string;
  faq?: Array<{ question: string; answer: string }>;
  howto?: {
    name: string;
    description?: string;
    steps: Array<{ name: string; text: string }>;
  };
  tags?: string[];
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTime: string;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  count: number;
}


export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") && !fs.statSync(path.join(BLOG_DIR, f)).isDirectory())
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPosts(): BlogPostMeta[] {
  const slugs = getAllPostSlugs();
  return slugs
    .map((slug) => {
      const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "2025-01-01",
        category: data.category || "WordPress",
        readingTime: readingTime(content).text,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Returns all unique categories derived from post frontmatter,
 * sorted by post count (most posts first).
 */
export function getAllCategories(): CategoryInfo[] {
  const posts = getAllPosts();
  const map = new Map<string, { name: string; count: number }>();

  for (const post of posts) {
    const slug = categoryToSlug(post.category);
    const existing = map.get(slug);
    if (existing) {
      existing.count++;
    } else {
      map.set(slug, { name: post.category, count: 1 });
    }
  }

  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Returns posts matching a given category slug, newest first.
 */
export function getPostsByCategory(categorySlug: string): BlogPostMeta[] {
  return getAllPosts().filter(
    (p) => categoryToSlug(p.category) === categorySlug
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "2025-01-01",
    category: data.category || "WordPress",
    readingTime: readingTime(content).text,
    content,
    image: data.image || undefined,
    faq: data.faq || undefined,
    howto: data.howto || undefined,
    tags: data.tags || undefined,
  };
}
