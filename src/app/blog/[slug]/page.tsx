import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://naveengaur.com/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `https://naveengaur.com/blog/${slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ["Naveen Gaur"],
      tags: [post.category, "WordPress", "freelance WordPress developer"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function ArticleJsonLd({ post }: { post: BlogPost }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Naveen Gaur",
      url: "https://naveengaur.com",
    },
    publisher: {
      "@type": "Person",
      name: "Naveen Gaur",
      url: "https://naveengaur.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://naveengaur.com/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: [
      post.category,
      "WordPress",
      "WordPress developer",
      "freelance WordPress developer",
    ].join(", "),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <ArticleJsonLd post={post} />
      <main className="min-h-screen bg-[#0D0D0D]">
        {/* Article Header */}
        <header className="pt-[140px] pb-12 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[760px] mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-[#C4A35A] transition-colors mb-8"
            >
              ← Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#C4A35A] px-2.5 py-1 rounded-full bg-[#C4A35A]/10 border border-[#C4A35A]/20">
                {post.category}
              </span>
              <span className="text-[13px] text-white/30">{post.readingTime}</span>
            </div>
            <h1 className="font-serif text-[clamp(28px,4vw,48px)] tracking-[-0.025em] leading-[1.15] text-white mb-6">
              {post.title}
            </h1>
            <p className="text-[18px] text-white/60 leading-[1.7] font-light mb-8">
              {post.description}
            </p>
            <div className="flex items-center gap-3 pt-6 border-t border-white/[0.06]">
              <div className="w-8 h-8 rounded-full bg-[#C4A35A]/20 flex items-center justify-center text-[#C4A35A] text-[13px] font-medium">
                N
              </div>
              <div>
                <div className="text-[14px] text-white font-medium">Naveen Gaur</div>
                <div className="text-[12px] text-white/40">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="py-14 px-6 md:px-10">
          <div className="max-w-[760px] mx-auto prose-blog">
            <MDXRemote source={post.content} />
          </div>
        </article>

        {/* CTA Footer */}
        <section className="pb-24 px-6 md:px-10">
          <div className="max-w-[760px] mx-auto">
            <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-10 text-center">
              <h2 className="font-serif text-[clamp(22px,3vw,32px)] text-white mb-4">
                Need help with your WordPress site?
              </h2>
              <p className="text-[16px] text-white/55 max-w-[420px] mx-auto leading-[1.7] mb-8">
                I fix WordPress crashes, remove malware, and optimize performance for small
                businesses. Fast turnaround, direct access, no agency overhead.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-[#C4A35A] text-[#0D0D0D] px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200"
              >
                Get in Touch →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
