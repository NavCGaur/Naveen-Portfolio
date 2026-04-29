"use client";

import { motion } from "framer-motion";

const problems = [
  {
    id: "crashed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "My site crashed and I don't know why",
    desc: "A plugin update, a bad host migration, a conflict you never saw coming. I diagnose fast and get you back online.",
  },
  {
    id: "slow",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "My site is painfully slow",
    desc: "Every extra second costs you customers. I dig into your server config, database, and code — not just install a caching plugin.",
  },
  {
    id: "hacked",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "I've been hacked or suspended",
    desc: "Malware, blacklisted IPs, host suspensions. I clean the infection, remove the backdoors, and harden your site so it doesn't happen again.",
  },
  {
    id: "seo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: "No one can find me on Google",
    desc: "Poor rankings, missing meta, slow Core Web Vitals. I audit what's hurting your visibility and give you a clear plan — or just fix it.",
  },
  {
    id: "outdated",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    title: "My site looks outdated",
    desc: "Old themes, broken layouts, mobile that embarrasses you. I can rebuild or refresh without losing your content or SEO.",
  },
  {
    id: "no-contact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "I have no one I can just call",
    desc: "Agencies disappear, freelancers ghost, and support tickets take weeks. I offer direct access — you reach me, not a helpdesk.",
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
          className="font-serif text-[clamp(30px,4vw,46px)] tracking-[-0.025em] leading-[1.1] text-white mb-5"
        >
          The problems I fix every day
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[17px] text-white/55 max-w-[520px] leading-[1.7] font-light mb-14"
        >
          If any of these keep you up at night, you&apos;re in the right place.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.08] border border-white/[0.08] rounded-lg overflow-hidden">
          {problems.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-[#141414] hover:bg-[#1a1a1a] transition-colors p-9"
            >
              <div className="w-10 h-10 rounded-sm bg-gold/[0.12] flex items-center justify-center mb-5">
                {p.icon}
              </div>
              <div className="text-[15px] font-medium text-white mb-2.5">
                {p.title}
              </div>
              <div className="text-[14px] text-white/45 leading-[1.65]">
                {p.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
