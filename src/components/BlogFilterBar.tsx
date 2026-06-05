"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { CategoryInfo } from "@/lib/blog";

interface BlogFilterBarProps {
  categories: CategoryInfo[];
  /** Slug of the currently active category, or undefined for "All" */
  activeCategory?: string;
  /** Initial value of the search input (from server-rendered ?q=) */
  initialQuery?: string;
  /** Total post count across all categories */
  totalCount: number;
  /** Count of posts matching the current filter */
  filteredCount: number;
}

export default function BlogFilterBar({
  categories,
  activeCategory,
  initialQuery = "",
  totalCount,
  filteredCount,
}: BlogFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [, startTransition] = useTransition();

  // Debounce: update the URL ?q= param 300ms after the user stops typing.
  // The Server Component will re-render with filtered results automatically.
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

  /** Build href for a category pill, preserving any active search query. */
  const getCategoryHref = (slug?: string) => {
    const q = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
    if (!slug) return `/blog${q}`;
    return `/blog/category/${slug}${q}`;
  };

  const isActive = (slug?: string) =>
    slug === undefined ? !activeCategory : activeCategory === slug;

  return (
    <div className="border-b blog-border pb-8 mb-8">
      {/* ── Search input ────────────────────────────────── */}
      <div className="relative mb-6">
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
          placeholder="Search articles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          className="w-full md:w-[420px] pl-11 pr-10 py-2.5 rounded-lg border blog-border bg-transparent text-[14px] blog-heading placeholder:blog-text-faint focus:outline-none focus:border-[#C4A35A]/70 transition-colors duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center blog-text-faint hover:text-[#C4A35A] transition-colors text-lg leading-none"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Category pills ──────────────────────────────── */}
      <div className="flex flex-wrap gap-2" role="navigation" aria-label="Filter by topic">
        {/* "All" pill */}
        <Link
          href={getCategoryHref(undefined)}
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.06em] uppercase transition-all duration-200 border ${
            isActive(undefined)
              ? "bg-[#C4A35A] text-[#0D0D0D] border-[#C4A35A]"
              : "blog-text-muted border-[#C4A35A]/30 hover:border-[#C4A35A]/70 hover:text-[#C4A35A]"
          }`}
        >
          All
          <span
            className={`text-[10px] font-normal tabular-nums ${
              isActive(undefined) ? "opacity-60" : "opacity-50"
            }`}
          >
            {totalCount}
          </span>
        </Link>

        {/* Dynamic category pills */}
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={getCategoryHref(cat.slug)}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.06em] uppercase transition-all duration-200 border ${
              isActive(cat.slug)
                ? "bg-[#C4A35A] text-[#0D0D0D] border-[#C4A35A]"
                : "blog-text-muted border-[#C4A35A]/30 hover:border-[#C4A35A]/70 hover:text-[#C4A35A]"
            }`}
          >
            {cat.name}
            <span
              className={`text-[10px] font-normal tabular-nums ${
                isActive(cat.slug) ? "opacity-60" : "opacity-50"
              }`}
            >
              {cat.count}
            </span>
          </Link>
        ))}
      </div>

      {/* ── Results summary ─────────────────────────────── */}
      {(query.trim() || activeCategory) && (
        <p className="mt-4 text-[13px] blog-text-faint">
          {query.trim() ? (
            <>
              <span className="blog-heading font-medium">{filteredCount}</span>{" "}
              result{filteredCount !== 1 ? "s" : ""} for &ldquo;
              <span className="blog-heading font-medium">{query}</span>&rdquo;
              {activeCategory && (
                <>
                  {" "}
                  in{" "}
                  <span className="blog-heading font-medium">
                    {categories.find((c) => c.slug === activeCategory)?.name}
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <span className="blog-heading font-medium">{filteredCount}</span>{" "}
              article{filteredCount !== 1 ? "s" : ""} in{" "}
              <span className="blog-heading font-medium">
                {categories.find((c) => c.slug === activeCategory)?.name}
              </span>
            </>
          )}
          {filteredCount === 0 && (
            <span className="block mt-1">
              Try a different search term or{" "}
              <Link
                href="/blog"
                className="text-[#C4A35A] hover:underline"
              >
                browse all articles
              </Link>
              .
            </span>
          )}
        </p>
      )}
    </div>
  );
}
