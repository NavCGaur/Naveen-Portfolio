import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { readApprovedComments } from "@/lib/github-comments";
import type { BlogPost } from "@/lib/blog";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ArticleTracker from "@/components/ArticleTracker";
import ArticleShareButtons from "@/components/ArticleShareButtons";
import ArticleCTALink from "@/components/ArticleCTALink";
import LinkedInCTA from "@/components/LinkedInCTA";
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
  const articleSchema = {
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
      sameAs: [
        "https://www.linkedin.com/in/naveen-gaur-dev/"
      ],
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

  const faqSchema = post.faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  } : null;

  const howtoSchema = post.howto ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": post.howto.name,
    "description": post.howto.description || post.description,
    "step": post.howto.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "itemListElement": [
        {
          "@type": "HowToDirection",
          "text": step.text,
        },
      ],
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howtoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howtoSchema) }}
        />
      )}
    </>
  );
}

// MDX component overrides — CopyCodeButton replaces <pre> blocks
const mdxComponents = {
  pre: CopyCodeButton,
  ArticleCTALink: ArticleCTALink,
  LinkedInCTA: LinkedInCTA,
  table: (props: any) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const comments = readApprovedComments(slug);

  return (
    <>
      <Nav />
      <ArticleJsonLd post={post} />
      <main className="min-h-screen blog-bg">
        {/* Article Header */}
        <header className="pt-[140px] pb-12 px-6 md:px-10 border-b blog-border">
          <div className="max-w-[760px] mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[13px] blog-text-faint hover:text-[#C4A35A] transition-colors mb-8"
            >
              ← Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[12px] font-bold tracking-[0.05em] uppercase text-[#725921] px-3 py-1 rounded-sm bg-[#C4A35A]/10 border border-[#C4A35A]/20">
                {post.category}
              </span>
              <span className="text-[13px] blog-text-faint font-medium tracking-wide">
                {post.readingTime}
              </span>
            </div>
            <h1 className="font-serif font-bold text-[clamp(30px,4vw,44px)] tracking-[0.01em] leading-[1.1] blog-heading mb-8">
              {post.title}
            </h1>
            <p className="text-[20px] blog-text-muted leading-[1.7] font-normal mb-10">
              {post.description}
            </p>
            <div className="flex items-center gap-3 pt-6 border-t blog-border">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C4A35A]/20">
                <img 
                  src="/images/projects/Naveen_profile_pic.jpg" 
                  alt="Naveen Gaur" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-[14px] blog-heading font-medium">Naveen Gaur</div>
                <div className="text-[12px] blog-text-faint">
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
            <MDXRemote 
              source={post.content} 
              components={mdxComponents} 
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                }
              }}
            />
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
                background: "var(--bt-card-bg)",
                border: "1px solid var(--bt-border)",
                boxShadow: "var(--bt-shadow)",
                borderRadius: "12px",
                padding: "32px",
                marginBottom: "32px",
              }}
            >
              <CommentsList slug={post.slug} comments={comments} />
              <div style={{ borderTop: "1px solid var(--bt-border)", paddingTop: "28px" }}>
                <CommentForm slug={post.slug} />
              </div>
            </div>

          </div>
        </section>

        {/* CTA Footer */}
        <section className="pb-24 px-6 md:px-10">
          <div className="max-w-[760px] mx-auto">
            <div className="blog-card border blog-border rounded-xl p-10 text-center">
              <h2 className="font-serif text-[clamp(22px,3vw,32px)] blog-heading mb-4">
                Need help with your WordPress site?
              </h2>
              <p className="text-[16px] blog-text-muted max-w-[420px] mx-auto leading-[1.7] mb-8">
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
