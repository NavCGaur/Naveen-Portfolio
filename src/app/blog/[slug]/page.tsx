import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ArticleTracker from "@/components/ArticleTracker";
import ArticleShareButtons from "@/components/ArticleShareButtons";
import ArticleCTALink from "@/components/ArticleCTALink";
import CommentsList from "@/components/CommentsList";
import CommentForm from "@/components/CommentForm";
import CopyCodeButton from "@/components/CopyCodeButton";

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

// MDX component overrides — CopyCodeButton replaces <pre> blocks
const mdxComponents = {
  pre: CopyCodeButton,
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <ArticleJsonLd post={post} />
      <main className="min-h-screen bg-[#FAFAF8]">
        {/* Article Header */}
        <header className="pt-[140px] pb-12 px-6 md:px-10 border-b border-[#0D0D0D]/[0.06]">
          <div className="max-w-[760px] mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[13px] text-[#6A6A6A] hover:text-[#C4A35A] transition-colors mb-8"
            >
              ← Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#C4A35A] px-2.5 py-1 rounded-full bg-[#C4A35A]/10 border border-[#C4A35A]/20">
                {post.category}
              </span>
              <span className="text-[13px] text-[#6A6A6A]">{post.readingTime}</span>
            </div>
            <h1 className="font-serif text-[clamp(28px,4vw,48px)] tracking-[-0.025em] leading-[1.15] text-[#0D0D0D] mb-6">
              {post.title}
            </h1>
            <p className="text-[18px] text-[#4A4A4A] leading-[1.7] font-light mb-8">
              {post.description}
            </p>
            <div className="flex items-center gap-3 pt-6 border-t border-[#0D0D0D]/[0.06]">
              <div className="w-8 h-8 rounded-full bg-[#C4A35A]/20 flex items-center justify-center text-[#C4A35A] text-[13px] font-medium">
                N
              </div>
              <div>
                <div className="text-[14px] text-[#0D0D0D] font-medium">Naveen Gaur</div>
                <div className="text-[12px] text-[#6A6A6A]">
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

        {/* Article Body + invisible tracker */}
        <article className="py-14 px-6 md:px-10">
          <div className="max-w-[760px] mx-auto prose-blog">
            <ArticleTracker slug={post.slug} />
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        {/* Share + Comments */}
        <section className="pb-16 px-6 md:px-10">
          <div className="max-w-[760px] mx-auto">

            {/* Share buttons */}
            <ArticleShareButtons slug={post.slug} title={post.title} />

            {/* Comments section */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid rgba(13,13,13,0.06)",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                borderRadius: "12px",
                padding: "32px",
                marginBottom: "32px",
              }}
            >
              {/* Approved comments */}
              <CommentsList slug={post.slug} />

              {/* Divider only if there are comments */}
              <div style={{ borderTop: "1px solid rgba(13,13,13,0.06)", paddingTop: "28px" }}>
                <CommentForm slug={post.slug} />
              </div>
            </div>

          </div>
        </section>

        {/* CTA Footer */}
        <section className="pb-24 px-6 md:px-10">
          <div className="max-w-[760px] mx-auto">
            <div className="bg-white border border-[#0D0D0D]/[0.06] shadow-sm rounded-xl p-10 text-center">
              <h2 className="font-serif text-[clamp(22px,3vw,32px)] text-[#0D0D0D] mb-4">
                Need help with your WordPress site?
              </h2>
              <p className="text-[16px] text-[#4A4A4A] max-w-[420px] mx-auto leading-[1.7] mb-8">
                I fix WordPress crashes, remove malware, and optimize performance for small
                businesses. Fast turnaround, direct access, no agency overhead.
              </p>
              <ArticleCTALink slug={post.slug} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
