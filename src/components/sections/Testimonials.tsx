"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    client: "Upwork Client",
    project: "Site Growth & Performance Audit",
    content: "Naveen was absolutely outstanding to work with! I had built the front end of my website but was struggling with the back end, and Naveen delivered truly exceptional results. He significantly improved the website's performance. Now, my website loads much faster across all devices and is ranking higher in search results, which is a massive win for my business.",
    rating: 5,
  },
  {
    id: 2,
    client: "Upwork Client",
    project: "Custom Web App Development",
    content: "Naveen has been great to work with! He is very communicative, and is proficient in custom development. His attention to detail and willingness to go over all of my questions and comments at length has been extremely helpful, and I appreciate that level of care being taken with a project.",
    rating: 5,
  },
  {
    id: 3,
    client: "Business Owner",
    project: "Custom Dashboard Integration",
    content: "Naveen has been exceptional in bringing our ideas to life, whether it's implementing complex backend processes or designing professional, industry-specific workflows. He delivered a professional platform tailored perfectly to our needs.",
    rating: 5,
  },
  {
    id: 4,
    client: "Upwork Client",
    project: "Emergency Fixes & Integration",
    content: "Rehired Naveen and he delivered top-quality work on time again. His professionalism and dedication is impressive, goes the extra mile to make your project even better. Highly recommend his services!",
    rating: 5,
  },
  {
    id: 5,
    client: "Private Client",
    project: "Ongoing Retainer & Feature Additions",
    content: "He is really a perfect guy and helped my project too much. He is also suggesting what could be beneficial for your project depending on your needs. He implemented extra features seamlessly. Always available and gets the job done before milestones.",
    rating: 5,
  },
  {
    id: 6,
    client: "Upwork Client",
    project: "Emergency Support & Troubleshooting",
    content: "Very quick and responsive and a pleasure to work with. Is a very reliable person to have on your team when you need to resolve issues fast!",
    rating: 5,
  }
];

function StarRating() {
  return (
    <div className="flex gap-1 mb-5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-[15px] h-[15px] text-gold fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-[100px] px-6 md:px-10 bg-surface">
      <div className="max-w-[1200px] mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="block text-[11px] font-medium tracking-[0.14em] uppercase text-gold-dark mb-4 text-center"
        >
          Client Feedback
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-serif text-[clamp(30px,4vw,46px)] tracking-[-0.025em] leading-[1.1] text-ink mb-16 text-center"
        >
          What people say about my work
        </motion.h2>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group relative overflow-hidden break-inside-avoid bg-[#141414] border border-white/[0.07] rounded-xl p-8 hover:border-gold/40 transition-all duration-300 inline-block w-full"
            >
              {/* Quote mark */}
              <span className="relative z-10 font-serif text-[48px] text-gold leading-[0.8] mb-3 block">
                &ldquo;
              </span>

              {/* Quote text — white on dark for max contrast */}
              <p className="relative z-10 text-[15px] text-white/90 leading-[1.75] mb-7 italic">
                {t.content}
              </p>

              {/* Footer divider + attribution */}
              <div className="relative z-10 pt-5 border-t border-white/[0.08]">
                <StarRating />
                <div className="text-[14px] font-medium text-white">
                  {t.client}
                </div>
                <div className="text-[12px] text-gold mt-0.5 tracking-wide">
                  {t.project}
                </div>
              </div>

              {/* Gold accent line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-b-xl z-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
