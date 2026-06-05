import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import BlogIndexClient from "@/components/BlogIndexClient";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:
    "Technical Field Notes — WordPress, Ghost CMS, WhatsApp & Automation | Naveen Gaur",
  description:
    "Practical technical guides on WordPress, Ghost CMS, WhatsApp automation, server infrastructure, and developer tooling. Written from real client work by a full-stack consultant — not theory.",
  alternates: {
    canonical: "https://naveengaur.com/blog",
  },
  openGraph: {
    type: "website",
    url: "https://naveengaur.com/blog",
    title:
      "Technical Field Notes — WordPress, Ghost CMS, WhatsApp & Automation | Naveen Gaur",
    description:
      "Practical technical guides on WordPress, Ghost CMS, WhatsApp automation, server infrastructure, and developer tooling. Written from real client work.",
  },
};

// ─── Schema ──────────────────────────────────────────────────────────────────

function BlogCollectionSchema({
  posts,
}: {
  posts: ReturnType<typeof getAllPosts>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Technical Field Notes — Naveen Gaur",
    description:
      "Practical technical guides on WordPress, Ghost CMS, WhatsApp automation, server infrastructure, and developer tooling. Written from real client work.",
    url: "https://naveengaur.com/blog",
    author: {
      "@type": "Person",
      name: "Naveen Gaur",
      url: "https://naveengaur.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 20).map((post, i) => ({
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

// ─── Page (pure Server Component — no searchParams) ──────────────────────────

export default function BlogIndex() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();

  return (
    <>
      <Nav />
      <BlogCollectionSchema posts={allPosts} />
      <main className="min-h-screen blog-bg">

        {/* ── Hero ──────────────────────────────────────── */}
        <section className="pt-[140px] pb-4 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              Field Notes
            </span>
           <h1 className="font-serif font-bold text-[clamp(36px,5vw,64px)] tracking-[0.02em] leading-[1.1] blog-heading">
            Technical guides from real client work 
            <span className="ml-2 text-[clamp(16px,2.5vw,24px)] italic text-gray-500 font-light">
              — documented as I solve them. Not theory.
            </span>
          </h1>


          </div>
        </section>

        {/* ── Filter + Posts (Client Component handles search & categories) ── */}
        <Suspense fallback={<div className="py-16 px-6 md:px-10 max-w-[1100px] mx-auto"><div className="h-[88px] mb-8 rounded-lg blog-border border animate-pulse" /></div>}>
          <BlogIndexClient posts={allPosts} categories={categories} />
        </Suspense>

        {/* ── CTA ───────────────────────────────────────── */}
        <section className="pb-24 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">
            <div className="blog-card border blog-border rounded-xl p-10 md:p-14 text-center">
              <h2 className="font-serif text-[clamp(24px,3vw,36px)] blog-heading mb-4">
                Got a technical problem right now?
              </h2>
              <p className="text-[17px] blog-text-muted max-w-[520px] mx-auto leading-[1.7] mb-8">
                Whether it&apos;s WordPress, Ghost CMS, a WhatsApp integration,
                or server infrastructure — reading is good, getting it fixed
                today is better.
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
