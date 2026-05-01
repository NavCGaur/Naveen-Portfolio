"use client";

import { motion } from "framer-motion";

const differentiators = [
  {
    num: "01",
    title: "I go deeper than most WordPress developers",
    body: "Most WordPress freelancers work only inside the dashboard. As a full-stack developer, I can diagnose and fix problems at the server level, in the database, or in custom code — which means I can solve things others can't.",
  },
  {
    num: "02",
    title: "I don't install a plugin for everything",
    body: "Plugins are often the right answer — but not always. I know when to use one and when to write lean custom code instead. Fewer plugins means a faster, more secure site.",
  },
  {
    num: "03",
    title: "You talk to me directly, always",
    body: "No account managers, no ticketing system, no three-day delays. When you reach out, you reach me. That's a deliberate choice — it's how I keep quality high.",
  },
  {
    num: "04",
    title: "I tell you what you need, not what costs more",
    body: "If the $29 plan is right for your situation, I'll say so. I'm building long-term relationships, not short-term invoices. Honesty keeps clients around.",
  },
];

const techBadges = [
  "WordPress", "WooCommerce", "PHP", "MySQL",
  "Linux / Nginx", "JavaScript", "REST APIs",
];

export default function WhyMe() {
  return (
    <section id="why" className="py-[100px] px-6 md:px-10 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="block text-[11px] font-medium tracking-[0.14em] uppercase text-gold-dark mb-4"
        >
          Why Naveen
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-serif text-[clamp(30px,4vw,46px)] tracking-[-0.025em] leading-[1.1] text-ink mb-14"
        >
          Not another plugin-pusher
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — Differentiators */}
          <div>
            {differentiators.map((d, i) => (
              <motion.div
                key={d.num}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex gap-5 mb-9"
              >
                <div className="font-serif text-[14px] text-gold min-w-[28px] pt-0.5">
                  {d.num}
                </div>
                <div>
                  <div className="text-[16px] font-medium text-ink mb-2">{d.title}</div>
                  <div className="text-[15px] text-ink-muted leading-[1.65]">{d.body}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right — Quote card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="group relative overflow-hidden bg-gold-light border border-gold rounded-lg p-10 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            {/* Gold accent line on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-dark to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-20" />
            <span className="font-serif text-[80px] text-gold leading-[0.6] mb-6 block">
              &ldquo;
            </span>
            <p className="font-serif italic text-[22px] text-ink leading-[1.45] tracking-[-0.01em] mb-7">
              Most website problems aren&apos;t complicated — they&apos;re just ignored
              until they&apos;re expensive. A small monthly investment in
              maintenance costs a fraction of one emergency recovery.
            </p>
            <div className="text-[14px] text-ink-muted mb-8">
              — Naveen Gaur, on why he offers retainers
            </div>
            <div className="pt-6 border-t border-gold">
              <div className="text-[14px] text-ink-muted mb-3">
                Comfortable working with:
              </div>
              <div className="flex flex-wrap gap-2">
                {techBadges.map((b) => (
                  <span
                    key={b}
                    className="text-[12px] px-3 py-1 border border-gold rounded-full text-gold-dark bg-white"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
