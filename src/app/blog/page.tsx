import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Blog — WordPress Tips, Speed & Security | Naveen Gaur",
  description:
    "Practical guides on WordPress crash recovery, speed optimization, malware removal, SEO, and site maintenance. Written by a freelance WordPress developer.",
  alternates: {
    canonical: "https://naveengaur.com/blog",
  },
  openGraph: {
    type: "website",
    url: "https://naveengaur.com/blog",
    title: "Blog — WordPress Tips, Speed & Security | Naveen Gaur",
    description:
      "Practical guides on WordPress crash recovery, speed optimization, malware removal, SEO, and site maintenance.",
  },
};

// Simplified category color system for a more premium, unified look
const categoryColors: Record<string, string> = {
  default: "bg-[#C4A35A]/10 text-[#725921] border border-[#C4A35A]/20",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main className="min-h-screen blog-bg">
        {/* Header */}
        <section className="pt-[140px] pb-16 px-6 md:px-10 border-b blog-border">
          <div className="max-w-[1100px] mx-auto">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              Field Notes
            </span>
            <h1 className="font-serif font-bold text-[clamp(36px,5vw,64px)] tracking-[0.01em] leading-[1.1] blog-heading mb-5">
              WordPress tips &amp; guides
            </h1>
            <p className="text-[19px] blog-text-muted max-w-[540px] leading-[1.7] font-normal">
              Practical answers to the WordPress problems that keep business owners up at night.
              Written from real client work, not theory.
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">
            {posts.length === 0 ? (
              <p className="blog-text-faint text-center py-20">No posts yet. Check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group relative overflow-hidden bg-white border blog-border hover:border-[#C4A35A]/40 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 p-8 flex flex-col"
                  >
                    {/* Gold accent line on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4A35A] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />

                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className={`text-[12px] font-bold tracking-[0.05em] uppercase px-3 py-1 rounded-sm ${
                          categoryColors.default
                        }`}
                      >
                        {post.category}
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-[22px] leading-[1.3] blog-heading group-hover:text-[#C4A35A] transition-colors duration-200 mb-4">
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

        {/* CTA */}
        <section className="pb-24 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">
            <div className="blog-card border blog-border rounded-xl p-10 md:p-14 text-center">
              <h2 className="font-serif text-[clamp(24px,3vw,36px)] blog-heading mb-4">
                Got a WordPress problem right now?
              </h2>
              <p className="text-[17px] blog-text-muted max-w-[480px] mx-auto leading-[1.7] mb-8">
                Reading is good. Getting it fixed today is better.
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
