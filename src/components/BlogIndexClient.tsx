"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { BlogPostMeta, CategoryInfo } from "@/lib/blog";
import { categoryToSlug } from "@/lib/utils";

interface Props {
  posts: BlogPostMeta[];
  categories: CategoryInfo[];
}

const cardBadge = "bg-[#C4A35A]/10 text-[#725921] border border-[#C4A35A]/20";

function filterPosts(posts: BlogPostMeta[], query: string): BlogPostMeta[] {
  if (!query.trim()) return posts;
  const q = query.toLowerCase();
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export default function BlogIndexClient({ posts, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Initialise from ?q= on first render
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  const filteredPosts = filterPosts(posts, query);

  // Debounce: update URL after 300 ms idle
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      startTransition(() => {
        router.replace(`${pathname}${qs ? "?" + qs : ""}`, { scroll: false });
      });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const clearSearch = useCallback(() => setQuery(""), []);

  const isActivePill = (slug?: string) =>
    slug === undefined; // on /blog all = active, none of the category pills

  return (
    <section className="py-12 px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto">

        {/* ── Filter bar ──────────────────────────────── */}
        <div className="border-b blog-border pb-8 mb-8">

          {/* Description & Search container */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
           

            {/* Search input */}
            <div className="relative w-full md:w-[360px] shrink-0">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] blog-text-faint pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                id="blog-search"
                type="search"
                placeholder="Search all articles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                className="w-full pl-11 pr-10 py-2.5 rounded-lg border blog-border bg-transparent text-[14px] blog-heading placeholder:blog-text-faint focus:outline-none focus:border-[#C4A35A]/70 transition-colors duration-200"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center blog-text-faint hover:text-[#C4A35A] transition-colors text-lg leading-none"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2" role="navigation" aria-label="Filter by topic">
            {/* All — always "active" on this page */}
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.06em] uppercase border bg-[#C4A35A] text-[#0D0D0D] border-[#C4A35A]"
            >
              All
              <span className="text-[10px] font-normal tabular-nums opacity-60">
                {posts.length}
              </span>
            </span>

            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.06em] uppercase transition-all duration-200 border blog-text-muted border-[#C4A35A]/30 hover:border-[#C4A35A]/70 hover:text-[#C4A35A]"
              >
                {cat.name}
                <span className="text-[10px] font-normal tabular-nums opacity-50">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>

          {/* Results info */}
          {query.trim() && (
            <p className="mt-4 text-[13px] blog-text-faint">
              <span className="blog-heading font-medium">{filteredPosts.length}</span>{" "}
              result{filteredPosts.length !== 1 ? "s" : ""} for &ldquo;
              <span className="blog-heading font-medium">{query}</span>&rdquo;
              {filteredPosts.length === 0 && (
                <span className="block mt-1">
                  Try a different search term or{" "}
                  <button
                    onClick={clearSearch}
                    className="text-[#C4A35A] hover:underline"
                  >
                    browse all {posts.length} articles
                  </button>
                  .
                </span>
              )}
            </p>
          )}
        </div>

        {/* ── Posts grid ─────────────────────────────── */}
        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[17px] blog-text-faint mb-4">
              No articles match &ldquo;{query}&rdquo;.
            </p>
            <button
              onClick={clearSearch}
              className="text-[14px] text-[#C4A35A] hover:underline"
            >
              Clear search → browse all {posts.length} articles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              // Outer wrapper is a div — the category badge inside is a <Link>.
              // Using a div+onClick avoids an <a> nested inside an <a> (invalid HTML).
              <div
                key={post.slug}
                role="article"
                onClick={() => router.push(`/blog/${post.slug}`)}
                className="group relative overflow-hidden blog-card border blog-border hover:border-[#C4A35A]/40 rounded-xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-none transition-all duration-300 p-8 flex flex-col cursor-pointer"
              >
                {/* Gold accent bottom bar on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4A35A] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />

                <div className="flex items-center gap-3 mb-5">
                  {/* This Link is the ONLY anchor — card is not a link, so no nesting */}
                  <Link
                    href={`/blog/category/${categoryToSlug(post.category)}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-[12px] font-bold tracking-[0.05em] uppercase px-3 py-1 rounded-sm hover:opacity-80 transition-opacity ${cardBadge}`}
                  >
                    {post.category}
                  </Link>
                </div>

                <h2 className="font-serif font-bold text-[22px] tracking-[0.03em] leading-[1.3] blog-heading group-hover:text-[#C4A35A] transition-colors duration-200 mb-4">
                  {post.title}
                </h2>

                <p className="text-[16px] blog-text-muted leading-[1.65] mb-8 line-clamp-3 font-normal">
                  {post.description}
                </p>

                <div className="flex items-center justify-between text-[13px] blog-text-faint mt-auto">
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
