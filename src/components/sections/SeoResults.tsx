"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface SeoResultCard {
  tag: string;
  query: string;
  achievement: string;
  title: string;
  description: string;
  href: string;
  ctaText: string;
}

const seoResults: SeoResultCard[] = [
  {
    tag: "Local SEO · Aesthetic Clinic",
    query: "Botox in Bath UK",
    achievement: "Page 1 on Google",
    title: "Local SEO for a Wellness Business",
    description:
      "A local SEO case study exploring search visibility for a wellness business.",
    href: "/blog/local-seo-case-study-botox-in-bath-uk",
    ctaText: "View Case Study",
  },
  {
    tag: "Local SEO · Holistic Practice",
    query: "Energy Healing Georgetown, Texas",
    achievement: "Page 1 on Google",
    title: "Local SEO for an Energy Healing Practice",
    description:
      "A local SEO case study focused on improving search visibility for a location-specific service.",
    href: "/blog/local-seo-case-study-energy-healing-georgetown-texas",
    ctaText: "View Case Study",
  },
  {
    tag: "Technical SEO · Developer Guide",
    query: "WhatsApp Baileys Integration 2026",
    achievement: "Rank #1 on Google",
    title: "WhatsApp Baileys Integration",
    description:
      "Technical content and practical experience in WhatsApp automation and custom integrations.",
    href: "/blog/whatsapp-baileys-integration-guide",
    ctaText: "Explore Technical Guide",
  },
];

export default function SeoResults() {
  return (
    <section id="seo-results" className="py-[100px] px-6 md:px-10 hd:px-14 bg-surface border-t border-b border-black/[0.08]">
      <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="max-w-[760px] mb-14">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="block text-[12px] font-semibold tracking-[0.12em] uppercase text-gold-dark mb-4"
          >
            Demonstrated Search Visibility
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-serif font-bold text-[clamp(28px,3.8vw,44px)] tracking-[-0.02em] leading-[1.15] text-ink mb-5"
          >
            SEO Results That Demonstrate Practical Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[16px] sm:text-[17px] text-ink-muted leading-[1.65] font-normal"
          >
            I combine website development, technical SEO, and search-focused content to help businesses improve their online visibility. Explore selected projects and the search results I&apos;ve worked toward.
          </motion.p>
        </div>

        {/* 3 Responsive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {seoResults.map((card, index) => (
            <motion.div
              key={card.query}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col justify-between bg-white rounded-xl border border-black/[0.08] hover:border-gold hover:shadow-[0px_8px_30px_rgba(196,163,90,0.18)] p-6 sm:p-7 transition-all duration-300 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] group"
            >
              <div>
                {/* Tag & Achievement Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                    {card.tag}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gold-light text-gold-dark border border-gold/40">
                    {card.achievement}
                  </span>
                </div>

                {/* Target Query pill */}
                <div className="mb-4 p-3 rounded-lg bg-[#F5F5F2] border border-black/[0.06]">
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-ink-faint mb-1">
                    Target Search Query
                  </span>
                  <p className="text-[14px] font-mono font-bold text-ink">
                    &ldquo;{card.query}&rdquo;
                  </p>
                </div>

                {/* Title & Description */}
                <h3 className="font-serif font-bold text-[20px] leading-[1.3] text-ink mb-2.5 group-hover:text-gold-dark transition-colors duration-200">
                  {card.title}
                </h3>
                <p className="text-[14px] text-ink-muted leading-[1.6] mb-6">
                  {card.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="pt-4 border-t border-black/[0.08]">
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold-dark group-hover:text-ink transition-colors duration-200"
                >
                  <span>{card.ctaText}</span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="w-4 h-4 stroke-current stroke-[1.8] group-hover:translate-x-1 transition-transform duration-200"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Supporting Anchor Link to Flagship SEO Guide */}
        <div className="mt-12 text-center">
          <Link
            href="/blog/how-to-rank-on-googles-first-page"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-muted hover:text-ink transition-colors"
          >
            <span>Want to learn how I approach ranking client websites? Read the full SEO framework</span>
            <span className="text-gold-dark font-bold">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
