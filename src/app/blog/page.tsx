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

const categoryColors: Record<string, string> = {
  "Crash Recovery": "bg-red-500/10 text-red-400 border border-red-500/20",
  "Speed Optimization": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Security: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  SEO: "bg-green-500/10 text-green-400 border border-green-500/20",
  "WordPress Development": "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  Maintenance: "bg-[#C4A35A]/10 text-[#C4A35A] border border-[#C4A35A]/20",
  WordPress: "bg-[#C4A35A]/10 text-[#C4A35A] border border-[#C4A35A]/20",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0D0D0D]">
        {/* Header */}
        <section className="pt-[140px] pb-16 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              Field Notes
            </span>
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] tracking-[-0.025em] leading-[1.1] text-white mb-5">
              WordPress tips & guides
            </h1>
            <p className="text-[18px] text-white/60 max-w-[540px] leading-[1.7] font-light">
              Practical answers to the WordPress problems that keep business owners up at night.
              Written from real client work, not theory.
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">
            {posts.length === 0 ? (
              <p className="text-white/40 text-center py-20">No posts yet. Check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group relative overflow-hidden bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.06] hover:border-[#C4A35A]/30 rounded-xl transition-all duration-300 p-8 flex flex-col"
                  >
                    {/* Gold accent line on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4A35A] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />

                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className={`text-[11px] font-medium tracking-[0.10em] uppercase px-2.5 py-1 rounded-full ${
                          categoryColors[post.category] || categoryColors["WordPress"]
                        }`}
                      >
                        {post.category}
                      </span>
                    </div>

                    <h2 className="font-serif text-[20px] leading-[1.3] text-white group-hover:text-[#C4A35A] transition-colors duration-200 mb-3 flex-1">
                      {post.title}
                    </h2>

                    <p className="text-[15px] text-white/55 leading-[1.65] mb-6 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between text-[13px] text-white/30 mt-auto">
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
            <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-10 md:p-14 text-center">
              <h2 className="font-serif text-[clamp(24px,3vw,36px)] text-white mb-4">
                Got a WordPress problem right now?
              </h2>
              <p className="text-[17px] text-white/60 max-w-[480px] mx-auto leading-[1.7] mb-8">
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
