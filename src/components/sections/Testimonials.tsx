"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface VideoTestimonial {
  id: string;
  youtubeId: string;
  client: string;
  role: string;
  company: string;
  companyUrl?: string;
  project: string;
  quote: string;
  rating: number;
  tag: string;
}

// Future-proof: Add more video testimonials here as you receive them!
const videoTestimonials: VideoTestimonial[] = [
  {
    id: "kat-grace",
    youtubeId: "QRADwVth1XY",
    client: "Katie Grace",
    role: "Founder & Trauma-Informed Practitioner",
    company: "Kat Grace Healing",
    companyUrl: "https://katgrace.com",
    project: "WordPress Redesign, Performance Tuning & Ongoing Retainer",
    quote:
      "Naveen was absolutely incredible to work with. He took my vision and transformed it into a website that is not only beautiful and fast, but truly supports my clients. His communication and ongoing support have been exceptional.",
    rating: 5,
    tag: "WordPress Redesign & Ongoing Retainer",
  },
];

const testimonials = [
  {
    id: 1,
    client: "Marcus Vance",
    project: "Site Growth & Performance Audit",
    content: "Naveen was absolutely outstanding to work with! I had built the front end of my website but was struggling with the back end, and Naveen delivered truly exceptional results. He significantly improved the website's performance. Now, my website loads much faster across all devices and is ranking higher in search results, which is a massive win for my business.",
    rating: 5,
  },
  {
    id: 2,
    client: "Sarah Lin",
    project: "Custom Web App Development",
    content: "Naveen has been great to work with! He is very communicative, and is proficient in custom development. His attention to detail and willingness to go over all of my questions and comments at length has been extremely helpful, and I appreciate that level of care being taken with a project.",
    rating: 5,
  },
  {
    id: 3,
    client: "David Jenkins",
    project: "Custom Dashboard Integration",
    content: "Naveen has been exceptional in bringing our ideas to life, whether it's implementing complex backend processes or designing professional, industry-specific workflows. He delivered a professional platform tailored perfectly to our needs.",
    rating: 5,
  },
  {
    id: 4,
    client: "Elena Rostova",
    project: "Emergency Fixes & Integration",
    content: "Rehired Naveen and he delivered top-quality work on time again. His professionalism and dedication is impressive, goes the extra mile to make your project even better. Highly recommend his services!",
    rating: 5,
  },
  {
    id: 5,
    client: "Dr. Adrian Cole",
    project: "Ongoing Retainer & Feature Additions",
    content: "He is really a perfect guy and helped my project too much. He is also suggesting what could be beneficial for your project depending on your needs. He implemented extra features seamlessly. Always available and gets the job done before milestones.",
    rating: 5,
  },
  {
    id: 6,
    client: "Julian Brooks",
    project: "Emergency Support & Troubleshooting",
    content: "Very quick and responsive and a pleasure to work with. Is a very reliable person to have on your team when you need to resolve issues fast!",
    rating: 5,
  }
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-[15px] h-[15px] text-gold fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const limit = showAll ? testimonials.length : (isMobile ? 3 : testimonials.length);
  const visibleTestimonials = testimonials.slice(0, limit);

  return (
    <section id="testimonials" className="py-[100px] px-6 md:px-10 hd:px-14 bg-[#EBE9E0]">
      <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto">
        
        {/* Section Header */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="block text-[13px] font-medium tracking-[0.08em] uppercase text-gold-dark mb-4 text-center"
        >
          Client Feedback &amp; Proof
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-serif font-bold text-[clamp(28px,4vw,42px)] tracking-[-0.01em] leading-[1.1] text-ink mb-12 text-center"
        >
          What people say about my work
        </motion.h2>

        {/* ═══════════════════════════════════════════════════════════════
            FEATURED VIDEO TESTIMONIALS (Top Prominence)
            ═══════════════════════════════════════════════════════════════ */}
        {videoTestimonials.length > 0 && (
          <div className="mb-16">
            {videoTestimonials.length === 1 ? (
              // Single Featured Video Hero Spotlight
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group relative overflow-hidden bg-[#0D0D0D] border-2 border-gold/40 rounded-2xl p-6 md:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              >
                {/* Gold accent line at top */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />

                {/* Badge Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-gold">
                      Featured Video Testimonial
                    </span>
                    <span className="text-[11px] text-white/50 hidden sm:inline">• Verified Client Review</span>
                  </div>

                  <span className="text-[11px] font-medium tracking-wide uppercase px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                    {videoTestimonials[0].tag}
                  </span>
                </div>

                {/* 2-Column Responsive Layout */}
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left: Responsive 16:9 Video Player */}
                  <div className="lg:col-span-7">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/15 shadow-2xl">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoTestimonials[0].youtubeId}?rel=0`}
                        title={`${videoTestimonials[0].client} — Client Video Testimonial`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    </div>
                    <p className="text-[12px] text-white/40 mt-2.5 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Click to watch Katie&apos;s firsthand experience working with Naveen
                    </p>
                  </div>

                  {/* Right: Client Details & Quote */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <StarRating count={videoTestimonials[0].rating} />
                      
                      <blockquote className="font-serif italic text-white/95 text-[18px] md:text-[20px] leading-[1.6] mb-6">
                        &ldquo;{videoTestimonials[0].quote}&rdquo;
                      </blockquote>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <div className="text-[18px] font-bold text-white tracking-wide">
                        {videoTestimonials[0].client}
                      </div>
                      <div className="text-[13px] text-white/70 mt-0.5">
                        {videoTestimonials[0].role}
                      </div>
                      <div className="text-[14px] text-gold font-medium mt-1">
                        {videoTestimonials[0].company}
                      </div>

                      {videoTestimonials[0].companyUrl && (
                        <a
                          href={videoTestimonials[0].companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[12px] text-gold/80 hover:text-gold transition-colors mt-3 font-medium underline underline-offset-4"
                        >
                          Visit {videoTestimonials[0].companyUrl.replace("https://", "")}
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              // Multiple Video Grid (automatically activates when more videos are added!)
              <div className="grid md:grid-cols-2 gap-8">
                {videoTestimonials.map((v) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden bg-[#0D0D0D] border border-gold/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/15 shadow-md mb-5">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0`}
                          title={`${v.client} — Client Video Testimonial`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                          className="absolute inset-0 w-full h-full border-0"
                        />
                      </div>
                      <StarRating count={v.rating} />
                      <blockquote className="text-[15px] text-white/90 italic leading-[1.6] mb-5">
                        &ldquo;{v.quote}&rdquo;
                      </blockquote>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <div className="text-[16px] font-bold text-white">{v.client}</div>
                      <div className="text-[13px] text-gold">{v.company}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            DIVIDER FOR WRITTEN REVIEWS
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-10 sm:w-16 bg-black/20" />
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-ink-muted">
              More Client Reviews &amp; Endorsements
            </span>
            <span className="h-px w-10 sm:w-16 bg-black/20" />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            WRITTEN TESTIMONIALS MASONRY GRID
            ═══════════════════════════════════════════════════════════════ */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((t, i) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: showAll ? 0 : i * 0.08 }}
                className="group relative overflow-hidden break-inside-avoid bg-[#141414] border border-white/[0.07] rounded-xl p-8 hover:border-gold/40 transition-all duration-300 inline-block w-full shadow-sm hover:shadow-md"
              >
                {/* Quote mark */}
                <span className="relative z-10 font-serif text-[48px] text-gold leading-[0.8] mb-3 block">
                  &ldquo;
                </span>

                {/* Quote text */}
                <p className="relative z-10 text-[16px] text-white/90 leading-[1.75] mb-7 italic font-normal">
                  {t.content}
                </p>

                {/* Footer divider + attribution */}
                <div className="relative z-10 pt-5 border-t border-white/[0.08]">
                  <StarRating />
                  <div className="text-[16px] font-medium text-white">
                    {t.client}
                  </div>
                  <div className="text-[13px] text-gold mt-0.5 tracking-wide">
                    {t.project}
                  </div>
                </div>

                {/* Gold accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-b-xl z-20" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Toggle Button for Mobile */}
        {isMobile && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group relative overflow-hidden inline-block bg-ink border border-gold/30 text-gold px-8 py-3 rounded-md text-[15px] font-medium tracking-[0.05em] hover:bg-gold hover:text-ink hover:border-gold transition-all duration-300 shadow-md cursor-pointer"
            >
              <span className="relative z-10">{showAll ? "Show Less" : "More Reviews →"}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
