"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const stats = [
  {
    num: "Top Rated",
    label: "top 10% of Upwork freelancers",
    showStars: false,
  },
  {
    num: "5.0",
    label: "average client rating",
    showStars: true,
  },
  {
    num: "100% JSS",
    label: "jobs delivered as promised",
    showStars: false,
  },
  {
    num: "50+",
    label: "projects completed",
    showStars: false,
  },
];

export default function UpworkStats() {
  return (
    <section id="upwork-stats" className="py-16 px-6 md:px-10 hd:px-14 bg-surface border-y border-black/[0.04]">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header with Clean Upwork Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/images/projects/upwork-logo.png"
              alt="Upwork"
              width={85}
              height={26}
              className="object-contain" // The black logo will display cleanly on the cream background
            />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-serif font-bold text-[clamp(26px,3.8vw,36px)] tracking-wide leading-[1.1] text-ink mb-4 max-w-none"
          >
            Trusted by founders across 50+ projects
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[17px] text-ink-muted leading-[1.7] max-w-[500px]"
          >
            Verified directly through Upwork&apos;s client feedback system.
          </motion.p>
        </div>

        {/* Stats Grid - Light background cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative overflow-hidden bg-white border border-black/[0.04] shadow-sm rounded-xl p-8 hover:border-gold/30 hover:shadow-md transition-all duration-300 flex flex-col justify-center min-h-[170px]"
            >
              {/* Highlight accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-b-xl z-20" />

              {/* Number and optional Stars */}
              <div className="flex items-baseline gap-2 mb-2.5 flex-wrap">
                <span className="font-serif text-[38px] font-bold text-ink tracking-tight leading-none group-hover:text-gold-dark transition-colors duration-200">
                  {s.num}
                </span>
                
                {s.showStars && (
                  <div className="flex gap-0.5 text-gold translate-y-[-4px]">
                    {[...Array(5)].map((_, idx) => (
                      <svg key={idx} className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                )}
              </div>

              {/* Label */}
              <p className="text-[12px] text-ink-muted tracking-widest uppercase font-semibold leading-relaxed">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-6 text-center"
        >
          <p className="text-[13.5px] text-ink-faint max-w-none mx-auto leading-relaxed">
            * <strong className="text-ink-muted">JSS Job Success Score:</strong> Upwork&apos;s own metric for on-time, on-specification delivery across every contract.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
