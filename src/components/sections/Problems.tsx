"use client";

import { motion } from "framer-motion";

const problems = [
  {
    id: "slow",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Your site takes more than 3 seconds to load",
    desc: "Visitors leave before seeing your offer.",
  },
  {
    id: "crashed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "Your site crashes or shows errors",
    desc: "You lose trust instantly.",
  },
  {
    id: "seo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: "Your site looks fine but gets no leads",
    desc: "It's not optimized to convert.",
  },
  {
    id: "hacked",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "You keep fixing things, but issues return",
    desc: "You don't have a reliable system.",
  },
];

export default function Problems() {
  return (
    <section id="problems" className="py-[100px] px-6 md:px-10 bg-ink">
      <div className="max-w-[1100px] mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="block text-[11px] font-medium tracking-[0.14em] uppercase text-gold mb-4"
        >
          Sound familiar?
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-serif text-[clamp(30px,4vw,46px)] tracking-[-0.025em] leading-[1.1] text-white mb-5 max-w-[800px]"
        >
          If Your Website Has Any of These Problems — You're Losing Business
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[17px] text-white/75 max-w-[520px] leading-[1.7] font-light mb-14"
        >
          If any of these keep you up at night, you&apos;re in the right place.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative overflow-hidden bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.06] hover:border-gold/30 rounded-xl transition-all duration-300 p-10 py-16 min-h-[360px] flex flex-col justify-center group"
            >
              {/* Gold accent line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-10" />
              
              <div className="relative z-20 w-12 h-12 rounded-lg bg-gold/[0.12] flex items-center justify-center mb-8 group-hover:bg-gold/20 transition-colors">
                {p.icon}
              </div>
              <div className="text-[17px] font-medium text-white mb-4">
                {p.title}
              </div>
              <div className="text-[17px] text-white/75 leading-[1.7]">
                {p.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mid-page CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-20 pt-16 border-t border-white/[0.06] text-center"
        >
          <h3 className="font-serif text-[clamp(24px,3vw,32px)] text-white mb-4">
            Let's stop losing customers to technical issues.
          </h3>
          <p className="text-[17px] text-white/60 max-w-[480px] mx-auto leading-[1.7] mb-8">
            Get a clear, honest assessment of what's wrong and exactly how to fix it.
          </p>
          <a
            href="#contact"
            className="inline-block bg-gold text-ink px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-gold-light transition-colors duration-200"
          >
            Get a Free Website Audit →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
