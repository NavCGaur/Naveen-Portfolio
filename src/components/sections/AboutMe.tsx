"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as ga from "@/lib/ga";

export default function AboutMe() {
  return (
    <section id="about" className="py-[100px] md:py-[120px] px-6 md:px-10 hd:px-14 bg-ink text-white relative overflow-hidden border-t border-white/[0.06]">
      {/* Subtle ambient glow for warm background depth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[760px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="block text-[13px] font-medium tracking-[0.08em] uppercase text-gold mb-4"
          >
            About Me
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-serif font-bold text-[clamp(30px,4.5vw,46px)] tracking-[-0.015em] leading-[1.15] text-white mb-4"
          >
            Beyond Development, There&apos;s a Story
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[18px] md:text-[20px] text-gold/90 font-medium leading-snug"
          >
            Developer by profession. Educator by passion.
          </motion.p>
        </div>

        {/* Narrative Body */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-6 text-[17px] md:text-[18px] text-white/80 leading-[1.85] font-normal"
        >
          <p>
            I&apos;ve always enjoyed building things, understanding how they work, and finding ways to solve problems. That curiosity led me into engineering and eventually into software development, where I&apos;ve spent years turning ideas into digital products and helping businesses grow online.
          </p>

          <p className="text-white/95 italic font-medium">
            But somewhere along the way, I found another purpose that became equally meaningful to me: teaching.
          </p>

          <p>
            Living in the Uttarakhand mountains, I teach around 40 children from underprivileged backgrounds. Their innocence, curiosity, hard work, and simple yet profound respect for nature have taught me as much as I hope I&apos;ve taught them. Being part of their lives, watching them learn, overcome difficulties, and grow in confidence is a privilege I never take for granted.
          </p>

          <p>
            That experience inspired me to build{" "}
            <a
              href="https://looplearnx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light underline underline-offset-4 decoration-gold/60 hover:decoration-gold font-semibold transition-colors"
            >
              LoopLearnX
            </a>
            , a learning application designed around their needs, helping them practise, learn at their own pace, and become more confident in their studies.
          </p>

          <p>
            I feel deeply grateful to God, my family, my clients who continue to place their trust in my work, and the community around me for the life I get to live. The opportunity to build, create, teach, learn, connect with people, and be part of their journeys in my own little way is something I consider a blessing. I don&apos;t take any of it for granted.
          </p>
        </motion.div>

        {/* Philosophy Pull-Quote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="my-10 md:my-12 p-7 md:p-9 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center relative"
        >
          <div className="w-12 h-[2px] bg-gold mx-auto mb-6" />
          <p className="font-serif italic text-[19px] md:text-[22px] text-white/95 leading-[1.6]">
            &ldquo;For me, success isn&apos;t just about what we build or achieve, but also about the lives we touch along the way.&rdquo;
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="text-center"
        >
          <Link
            href="/about"
            onClick={() => ga.event({ action: "click", category: "engagement", label: "About Section - Read My Story" })}
            className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-gold hover:bg-[#d6b76c] text-ink font-semibold px-8 py-3.5 rounded-sm text-[15px] tracking-[0.02em] transition-all duration-300 shadow-[0_4px_20px_rgba(196,163,90,0.25)]"
          >
            <span>Read My Story</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-bold">→</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
