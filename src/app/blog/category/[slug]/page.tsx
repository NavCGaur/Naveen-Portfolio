import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCategories,
  getPostsByCategory,
  getAllPosts,
} from "@/lib/blog";
import { categoryToSlug } from "@/lib/utils";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import BlogFilterBar from "@/components/BlogFilterBar";

// ─── Static generation ───────────────────────────────────────────────────────

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = getAllCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};

  const categoryDescriptions: Record<string, string> = {
    wordpress:
      "WordPress crash recovery, speed optimization, malware removal, security hardening, and maintenance. Written from real client work.",
    "ghost-cms":
      "Self-host Ghost CMS like a developer. SMTP setup, theme development, VPS installation, staff management, and pricing guides.",
    "whatsapp-and-automation":
      "WhatsApp automation with Baileys, custom CRM integrations, broadcast messaging, and AI-powered homework evaluation bots.",
    "developer-tooling":
      "Developer environment guides — IDE configuration, update loops, antivirus conflicts, and toolchain setup.",
    "analytics-and-seo":
      "Google Analytics for AI agents, Search Console diagnostics, sitemap fixes, and technical SEO troubleshooting.",
    infrastructure:
      "Server infrastructure guides — WHMCS automation, async provisioning, network routing, and hosting migration strategies.",
  };

  const description =
    categoryDescriptions[slug] ??
    `Practical ${cat.name} guides written from real client work. ${cat.count} technical articles by Naveen Gaur, full-stack consultant.`;

  return {
    title: `${cat.name} Articles — Technical Guides | Naveen Gaur`,
    description,
    alternates: {
      canonical: `https://naveengaur.com/blog/category/${slug}`,
    },
    openGraph: {
      type: "website",
      url: `https://naveengaur.com/blog/category/${slug}`,
      title: `${cat.name} Articles — Technical Guides | Naveen Gaur`,
      description,
    },
  };
}

// ─── Schema ──────────────────────────────────────────────────────────────────

function CategoryCollectionSchema({
  categoryName,
  categorySlug,
  posts,
}: {
  categoryName: string;
  categorySlug: string;
  posts: ReturnType<typeof getPostsByCategory>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} — Technical Guides by Naveen Gaur`,
    description: `All ${categoryName} articles by Naveen Gaur — practical guides from real client work.`,
    url: `https://naveengaur.com/blog/category/${categorySlug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Blog",
          item: "https://naveengaur.com/blog",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: categoryName,
          item: `https://naveengaur.com/blog/category/${categorySlug}`,
        },
      ],
    },
    author: {
      "@type": "Person",
      name: "Naveen Gaur",
      url: "https://naveengaur.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://naveengaur.com/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  default: "bg-[#C4A35A]/10 text-[#725921] border border-[#C4A35A]/20",
};

function filterPosts(
  posts: ReturnType<typeof getPostsByCategory>,
  query: string
) {
  if (!query) return posts;
  const q = query.toLowerCase();
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { q } = await searchParams;
  const query = q ?? "";

  const categories = getAllCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const allPosts = getAllPosts();
  const categoryPosts = getPostsByCategory(slug);
  const posts = filterPosts(categoryPosts, query);

  return (
    <>
      <Nav />
      <CategoryCollectionSchema
        categoryName={cat.name}
        categorySlug={slug}
        posts={categoryPosts}
      />
      <main className="min-h-screen blog-bg">

        {/* ── Hero ──────────────────────────────────────── */}
        <section className="pt-[140px] pb-12 px-6 md:px-10 border-b blog-border">
          <div className="max-w-[1100px] mx-auto">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[13px] blog-text-faint mb-6"
            >
              <Link
                href="/blog"
                className="hover:text-[#C4A35A] transition-colors duration-150"
              >
                Blog
              </Link>
              <span className="opacity-40">›</span>
              <span className="blog-heading">{cat.name}</span>
            </nav>

            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              Field Notes — {cat.name}
            </span>
            <h1 className="font-serif font-bold text-[clamp(36px,5vw,64px)] tracking-[0.02em] leading-[1.1] blog-heading mb-5">
              {cat.name} guides
            </h1>
            <p className="text-[19px] blog-text-muted max-w-[560px] leading-[1.7] font-normal">
              {cat.count} article{cat.count !== 1 ? "s" : ""} on {cat.name} —
              documented from real client work by Naveen Gaur.
            </p>
          </div>
        </section>

        {/* ── Filter bar + Posts ────────────────────────── */}
        <section className="py-12 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">

            <Suspense fallback={<div className="h-[88px] mb-8" />}>
              <BlogFilterBar
                categories={categories}
                activeCategory={slug}
                initialQuery={query}
                totalCount={allPosts.length}
                filteredCount={posts.length}
              />
            </Suspense>

            {posts.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-[17px] blog-text-faint mb-4">
                  No {cat.name} articles match &ldquo;{query}&rdquo;.
                </p>
                <Link
                  href={`/blog/category/${slug}`}
                  className="text-[14px] text-[#C4A35A] hover:underline"
                >
                  Clear search → see all {cat.count} {cat.name} articles
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group relative overflow-hidden blog-card border blog-border hover:border-[#C4A35A]/40 rounded-xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-none transition-all duration-300 p-8 flex flex-col"
                  >
                    {/* Gold accent bottom bar on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4A35A] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />

                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className={`text-[12px] font-bold tracking-[0.05em] uppercase px-3 py-1 rounded-sm ${categoryColors.default}`}
                      >
                        {post.category}
                      </span>
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
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────── */}
        <section className="pb-24 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">
            <div className="blog-card border blog-border rounded-xl p-10 md:p-14 text-center">
              <h2 className="font-serif text-[clamp(24px,3vw,36px)] blog-heading mb-4">
                Need hands-on help with {cat.name}?
              </h2>
              <p className="text-[17px] blog-text-muted max-w-[520px] mx-auto leading-[1.7] mb-8">
                Reading helps. Getting it solved today is better. I work
                directly with founders and agencies — no account managers, no
                wait queues.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-[#C4A35A] text-[#0D0D0D] px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200"
              >
                Let&apos;s Talk →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
