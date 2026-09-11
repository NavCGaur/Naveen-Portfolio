"use client";

import { motion } from "framer-motion";

const oneTimeServices = [
  {
    id: "emergency-fix",
    name: "Emergency Fix & Recovery",
    detail:
      "Site down, hacked, or host suspended — I find the cause, fix it, and prevent it from happening again.",
    price: "$60–$150",
    sub: "Response within 4 hours",
    isUrgent: true,
    badge: "Fastest Response",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: "audit",
    name: "Site Growth & Performance Audit",
    detail:
      "I examine your speed, SEO health, security posture, and plugin architecture — then give you a specific, prioritised action plan with honest ROI estimates.",
    price: "$150",
    sub: "Delivered in 3–5 days",
    isUrgent: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    id: "custom-dev",
    name: "Custom Development",
    detail:
      "Features, integrations, or builds that plugins can't do cleanly. Quoted per project after a free scoping call.",
    price: "Custom",
    sub: "Free scoping call",
    isUrgent: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

const essentialFeatures = [
  "Updates tested safely before they touch your live site",
  "Round-the-clock monitoring so problems get caught before your customers notice",
  "Weekly off-site encrypted backups - Your site can always be restored, even in a worst-case scenario",
  "No-Hack Guarantee (Free cleanup if breached)",
  "Monthly Executive Health Report",
];

const growthFeatures = [
  "Everything in Professional",
  "Priority 12-hour response guarantee",
  "Ongoing speed tuning so Google keeps ranking you well",  
  "Monthly report flagging anything hurting your search visibility",
  "1 hr/month of custom dev / strategy calls",
];

function CheckIcon() {
  return (
    <span className="inline-block w-4 h-4 min-w-[16px] rounded-full border-[1.5px] border-gold bg-gold-light bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2210%22%20height%3D%228%22%20viewBox%3D%220%200%2010%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%204L3.5%206.5L9%201%22%20stroke%3D%22%23C4A35A%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-center" />
  );
}

export default function Services() {
  return (
    <section id="services" className="pt-[100px] pb-12 px-6 md:px-10 hd:px-14 bg-surface">
      <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto">

        {/* One-Time Services */}
        <div className="mb-[72px]">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="block text-[13px] font-medium tracking-[0.08em] uppercase text-gold-dark mb-4"
          >
            One-Time Work
          </motion.span>
          <div className="grid md:grid-cols-2 gap-4 md:gap-16 items-start md:items-end mb-[60px]">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-serif font-bold text-[clamp(28px,4vw,40px)] tracking-[0.01em] leading-[1.1] text-ink"
            >
              Fix the immediate problem
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-[17px] text-ink-muted leading-[1.7] font-normal"
            >
              No retainer required. Pay for exactly what you need, get it done right.
            </motion.p>
          </div>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="border border-black/[0.09] rounded-lg overflow-hidden flex flex-col"
          >
            {oneTimeServices.map((s, i) => (
              <li
                key={s.id}
                className={`group relative overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-12 items-start md:items-center px-6 md:px-8 py-6 md:py-7 transition-colors duration-300 ${
                  s.isUrgent
                    ? "bg-[#FFFDF9] border-l-4 border-l-[#E53E3E] hover:bg-[#FFF8EE]"
                    : "bg-white hover:bg-gold-light/50"
                } ${i < oneTimeServices.length - 1 ? "border-b border-black/[0.09]" : ""}`}
              >
                {/* Accent line on hover */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                    s.isUrgent
                      ? "from-transparent via-[#E53E3E] to-transparent"
                      : "from-transparent via-gold to-transparent"
                  } scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-10`}
                />
                
                <div className="flex items-start gap-4">
                  {/* Service Icon Box */}
                  <div
                    className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center mt-0.5 ${
                      s.isUrgent
                        ? "bg-[#FEF2F2] border border-[#FECACA]"
                        : "bg-gold-light/70 border border-gold/30"
                    }`}
                  >
                    {s.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <div className="text-[20px] font-medium text-ink">{s.name}</div>
                      {s.badge && (
                        <span className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] text-[11px] font-semibold tracking-[0.04em] uppercase px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                          {s.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[15px] text-ink-muted font-normal leading-relaxed">{s.detail}</div>
                  </div>
                </div>

                <div className="md:text-right pl-14 md:pl-0">
                  <div className="font-serif text-[22px] text-ink whitespace-nowrap">{s.price}</div>
                  <div className="text-[14px] text-ink-faint font-sans mt-0.5">{s.sub}</div>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Retainers */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="block text-[13px] font-medium tracking-[0.08em] uppercase text-gold-dark mb-4"
          >
            Monthly Retainers
          </motion.span>
          <div className="grid md:grid-cols-2 gap-4 md:gap-16 items-start md:items-end mb-[60px]">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-serif font-bold text-[clamp(28px,4vw,40px)] tracking-[-0.01em] leading-[1.1] text-ink"
            >
              Never think about your site again
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-[17px] text-ink-muted leading-[1.7] font-normal"
            >
              For owners who want their website completely handled, month after month.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Essential */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="group relative overflow-hidden border border-black/[0.09] rounded-lg p-9 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Gold accent line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-b-lg z-10" />
              <div className="text-[15px] font-medium tracking-[0.05em] uppercase text-ink-faint mb-4">Professional</div>
              <div className="font-serif font-bold text-[48px] tracking-[-0.02em] text-ink leading-none mb-1.5">$49</div>
              <div className="text-[15px] text-ink-faint mb-7">
                per month
                <span className="block text-[13px] text-ink-faint/80 mt-1 font-normal">
                  No contracts — cancel anytime
                </span>
              </div>
              <div className="text-[15px] font-medium text-ink mb-2 leading-[1.4]">
                Proactive stability and security for your business site.
              </div>
              <div className="text-[14px] text-ink-muted mb-7 leading-[1.6]">
                The baseline every professional site needs to stay fast, secure, and online.
              </div>
              <div className="h-px bg-black/[0.09] mb-6" />
              <ul className="flex flex-col gap-3">
                {essentialFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-ink-muted leading-[1.5]">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Growth — Featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="group relative border border-gold rounded-lg p-9 bg-ink hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Gold accent line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-light to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-b-lg z-10" />
              <span className="absolute -top-3 left-8 bg-gold text-ink text-[10px] font-medium tracking-[0.1em] uppercase px-3 py-1 rounded-full">
                Most Popular
              </span>
              <div className="text-[15px] font-medium tracking-[0.05em] uppercase text-white/60 mb-4">Expert Consulting</div>
              <div className="font-serif font-bold text-[48px] tracking-[-0.02em] text-gold leading-none mb-1.5">$149</div>
              <div className="text-[15px] text-white/60 mb-7">
                per month
                <span className="block text-[13px] text-white/50 mt-1 font-normal">
                  No contracts — cancel anytime
                </span>
              </div>
              <div className="text-[15px] font-medium text-white mb-2 leading-[1.4]">
                Active work to bring you more calls and bookings.
              </div>
              <div className="text-[14px] text-white/70 mb-7 leading-[1.6]">
                For consultants and coaches building toward their next level — more visibility, more bookings, more reach.
              </div>
              <div className="h-px bg-white/10 mb-6" />
              <ul className="flex flex-col gap-3">
                {growthFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-white/55 leading-[1.5]">
                    <span className="inline-block w-4 h-4 min-w-[16px] rounded-full border-[1.5px] border-gold bg-gold/15 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2210%22%20height%3D%228%22%20viewBox%3D%220%200%2010%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%204L3.5%206.5L9%201%22%20stroke%3D%22%23C4A35A%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-center" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
