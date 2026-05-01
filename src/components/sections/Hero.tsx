"use client";

import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

const stats = [
  { num: "5+", label: "Years building on WordPress" },
  { num: "24hr", label: "Average emergency fix turnaround" },
  { num: "Full-Stack", label: "Server, database & front-end" },
];

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-[120px] pb-20 px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="max-w-[720px]">
          {/* Eyebrow */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 text-[12px] font-medium tracking-[0.12em] uppercase text-gold-dark mb-8 px-3.5 py-1.5 border border-gold bg-gold-light rounded-full"
          >
            <span className="w-1.5 h-1.5 bg-gold rounded-full" />
            WordPress &amp; Full-Stack Developer
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            className="font-serif text-[clamp(40px,6.5vw,72px)] leading-[1.05] tracking-[-0.03em] text-ink mb-7"
          >
            Your slow website is silently{" "}
            <em className="italic text-gold-dark">losing customers</em>
            <br />
            every single day.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeUp}
            className="text-[18px] text-ink-muted max-w-[580px] leading-[1.7] mb-12 font-light"
          >
            I help business owners fix slow, broken, or underperforming WordPress sites so they load instantly, rank better, and convert visitors into leads.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
            className="flex gap-4 items-center flex-wrap"
          >
            <a
              href="#contact"
              id="hero-cta-primary"
              className="group relative overflow-hidden inline-block bg-ink text-white px-7 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] transition-all duration-300"
            >
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
              <span className="relative z-10">Let&apos;s Talk →</span>
            </a>
            <a
              href="#services"
              id="hero-cta-services"
              className="group relative overflow-hidden inline-block text-ink px-7 py-3.5 rounded-sm text-[15px] font-medium border border-black/[0.18] hover:border-ink hover:bg-black/[0.02] transition-all duration-300"
            >
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-dark to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
              <span className="relative z-10">See Services</span>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={fadeUp}
            className="flex gap-12 pt-10 border-t border-black/[0.09] flex-wrap mt-[72px]"
          >
            {stats.map((s) => (
              <div key={s.num}>
                <div className="font-serif text-[38px] text-ink leading-none tracking-[-0.03em]">
                  {s.num}
                </div>
                <div className="text-[14px] text-ink-faint mt-1.5">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
