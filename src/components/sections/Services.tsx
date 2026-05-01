"use client";

import { motion } from "framer-motion";

const oneTimeServices = [
  {
    id: "speed",
    name: "Speed Optimization",
    detail: "Turn a slow site into a fast, high-performing asset that keeps visitors engaged.",
    price: "From $99",
    sub: "One-time fix",
  },
  {
    id: "bug-fixing",
    name: "Bug Fixing & Recovery",
    detail: "Fix crashes, plugin conflicts, and critical errors without breaking your site.",
    price: "From $60",
    sub: "Rapid response",
  },
  {
    id: "security",
    name: "Security & Malware Removal",
    detail: "Clean hacked websites and protect them from future attacks.",
    price: "From $150",
    sub: "Complete cleanup",
  },
];

const essentialFeatures = [
  "24/7 uptime monitoring with instant alerts",
  "Weekly off-site backups (restore in minutes)",
  "Supervised theme & plugin updates",
  "Security scanning & malware watch",
  "Monthly plain-English health report",
];

const growthFeatures = [
  "Everything in Essential",
  "Continuous Core Web Vitals & speed tuning",
  "SEO monitoring, fixes & monthly insights",
  "Priority support — you skip the queue",
  "1 hr/month of hands-on development, no ticket system",
];

function CheckIcon() {
  return (
    <span className="inline-block w-4 h-4 min-w-[16px] rounded-full border-[1.5px] border-gold bg-gold-light bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2210%22%20height%3D%228%22%20viewBox%3D%220%200%2010%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%204L3.5%206.5L9%201%22%20stroke%3D%22%23C4A35A%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-center" />
  );
}

export default function Services() {
  return (
    <section id="services" className="py-[100px] px-6 md:px-10 bg-surface">
      <div className="max-w-[1100px] mx-auto">

        {/* One-Time Services */}
        <div className="mb-[72px]">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="block text-[11px] font-medium tracking-[0.14em] uppercase text-gold-dark mb-4"
          >
            Solution
          </motion.span>
          <div className="grid md:grid-cols-2 gap-4 md:gap-16 items-start md:items-end mb-[60px]">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-serif text-[clamp(30px,4vw,46px)] tracking-[-0.025em] leading-[1.1] text-ink"
            >
              I Don't Just Fix Websites — I Make Them Work for You
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-[17px] text-ink-muted leading-[1.7] font-light"
            >
              Whether your site is slow, broken, or underperforming, I identify the root cause and fix it permanently — not temporarily.
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
                className={`group relative overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-12 items-start md:items-center px-6 md:px-8 py-6 md:py-7 bg-white hover:bg-gold-light/50 transition-colors duration-300 ${i < oneTimeServices.length - 1 ? "border-b border-black/[0.09]" : ""}`}
              >
                {/* Gold accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-10" />
                <div>
                  <div className="text-[16px] font-medium text-ink mb-1">{s.name}</div>
                  <div className="text-[14px] text-ink-muted">{s.detail}</div>
                </div>
                <div className="md:text-right">
                  <div className="font-serif text-[22px] text-ink whitespace-nowrap">{s.price}</div>
                  <div className="text-[12px] text-ink-faint font-sans mt-0.5">{s.sub}</div>
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
            className="block text-[11px] font-medium tracking-[0.14em] uppercase text-gold-dark mb-4"
          >
            Monthly Retainers
          </motion.span>
          <div className="grid md:grid-cols-2 gap-4 md:gap-16 items-start md:items-end mb-[60px]">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-serif text-[clamp(30px,4vw,46px)] tracking-[-0.025em] leading-[1.1] text-ink"
            >
              Never think about your site again
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-[17px] text-ink-muted leading-[1.7] font-light"
            >
              Ongoing Maintenance: Keep your site updated, secure, and running smoothly — without your involvement.
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
              <div className="text-[14px] font-medium tracking-[0.06em] uppercase text-ink-faint mb-4">Essential</div>
              <div className="font-serif text-[48px] tracking-[-0.04em] text-ink leading-none mb-1.5">$29</div>
              <div className="text-[14px] text-ink-faint mb-7">per month</div>
              <div className="text-[15px] font-medium text-ink mb-2 leading-[1.4]">
                Your site stays online, backed up, and out of trouble.
              </div>
              <div className="text-[14px] text-ink-muted mb-7 leading-[1.6]">
                The baseline every site needs — especially if you don&apos;t have time to babysit updates.
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
              <div className="text-[14px] font-medium tracking-[0.06em] uppercase text-white/40 mb-4">Growth &amp; Performance</div>
              <div className="font-serif text-[48px] tracking-[-0.04em] text-gold leading-none mb-1.5">$99</div>
              <div className="text-[14px] text-white/35 mb-7">per month</div>
              <div className="text-[15px] font-medium text-white mb-2 leading-[1.4]">
                Your site stays online and keeps getting better.
              </div>
              <div className="text-[14px] text-white/50 mb-7 leading-[1.6]">
                Ideal if you care about speed, search rankings, and having a developer you can actually reach.
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

        {/* Services CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-24 pt-16 border-t border-black/[0.09] text-center"
        >
          <h3 className="font-serif text-[clamp(24px,3vw,32px)] text-ink mb-4">
            Not sure what you need?
          </h3>
          <p className="text-[17px] text-ink-muted max-w-[480px] mx-auto leading-[1.7] mb-8">
            Let's jump on a quick call. I'll look at your site and tell you exactly what's required—no sales pressure.
          </p>
          <a
            href="#contact"
            className="inline-block bg-ink text-white px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-ink-muted transition-colors duration-200"
          >
            Schedule a Free Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
