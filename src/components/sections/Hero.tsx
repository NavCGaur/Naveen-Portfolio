"use client";

import * as ga from "@/lib/ga";

const stats = [
  { num: "Top Rated", label: "Upwork Verified Consultant" },
  { num: "24hr", label: "Average emergency turnaround" },
  { num: "Full-Stack", label: "Server, database & frontend" },
];

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-[120px] pb-20 px-6 md:px-10 hd:px-14">
      <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto w-full">
        <div className="max-w-[720px] hd:max-w-[840px]">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 text-[12px] font-medium tracking-[0.12em] uppercase text-gold-dark mb-8 px-3.5 py-1.5 border border-gold bg-gold-light rounded-full animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_8px_rgba(37,211,102,0.6)] animate-pulse" />
            WordPress &amp; Full-Stack Developer
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[clamp(44px,7vw,80px)] leading-[1.05] tracking-[-0.03em] text-ink mb-7 animate-fade-up animate-delay-100">
            Your website should{" "}
            <em className="italic text-gold-dark">work for you,</em>
            <br />
            not worry you.
          </h1>

          {/* Sub */}
          <p className="text-[18px] text-ink-muted max-w-[540px] leading-[1.7] mb-12 font-normal animate-fade-up animate-delay-200">
            I build, fix, and maintain WordPress sites for small businesses and
            founders who are tired of slow pages, surprise downtime, and
            developers who disappear.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center animate-fade-up animate-delay-300">
            <a
              href="/free-audit"
              id="hero-cta-services"
              onClick={() => ga.event({ action: "click", category: "engagement", label: "Hero - Free Website & AI Audit" })}
              className="group relative overflow-hidden inline-block bg-ink text-white px-7 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] border border-ink w-full sm:w-auto text-center transition-all duration-300"
            >
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
              <span className="relative z-10">Free Website & AI Audit</span>
            </a>
            <a
              href="#contact"
              id="hero-cta-primary"
              onClick={() => ga.event({ action: "click", category: "engagement", label: "Hero - Let's Talk" })}
              className="group relative overflow-hidden inline-block text-ink px-7 py-3.5 rounded-sm text-[15px] font-medium border border-black/[0.18] hover:border-ink hover:bg-black/[0.02] w-full sm:w-auto text-center transition-all duration-300"
            >
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-dark to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
              <span className="relative z-10">Let&apos;s Talk →</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-black/[0.09] mt-[72px] animate-fade-up animate-delay-400">
            {stats.map((s) => (
              <div key={s.num} className="bg-white border border-black/[0.06] shadow-sm rounded-lg p-6 hover:border-gold/30 hover:shadow-md transition-all duration-300">
                <div className="font-serif text-[32px] text-ink leading-none tracking-[-0.03em] mb-2">
                  {s.num}
                </div>
                <div className="text-[13.5px] text-ink-muted leading-tight font-sans">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
