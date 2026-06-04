"use client";

import * as ga from "@/lib/ga";
import HeroAnimation from "./HeroAnimation";

const stats = [
  { num: "5+", label: "Years building on WordPress" },
  { num: "24hr", label: "Average emergency fix turnaround" },
  { num: "Full-Stack", label: "Server, database & front-end" },
];

export default function Hero() {
  return (
    /*
      Equal edge padding on both sides (px-16 at lg) so:
        – Left text starts 64px from the left viewport edge
        – Right animation ends 64px from the right viewport edge
      No max-width centering — the grid spans the full available width.
      Grid [3fr_2fr]: left gets 60%, right gets 40% of available width.
    */
    <section className="flex flex-col pt-[90px] lg:pt-[100px] px-6 md:px-10 lg:px-[120px] overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col">

        {/* Two-Column Grid */}
        <div className="grid lg:grid-cols-[65fr_35fr] gap-8 lg:gap-10 items-center min-h-[calc(100vh-90px)] lg:min-h-[calc(100vh-100px)] py-10 lg:py-12">

          {/* ── Left Column: dominant hero text ── */}
          <div className="w-full relative z-10">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-[12px] font-medium tracking-[0.12em] uppercase text-gold-dark mb-8 px-3.5 py-1.5 border border-gold bg-gold-light rounded-full animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_8px_rgba(37,211,102,0.6)]" />
              WordPress &amp; Full-Stack Developer
            </div>

            {/* Headline — LARGE: takes advantage of the wide left column */}
            <h1 className="font-serif text-[clamp(42px,4.8vw,68px)] leading-[1.06] tracking-[-0.03em] text-ink mb-7 animate-fade-up animate-delay-100">
              Your website should{" "}
              <em className="italic text-gold-dark">work for you,</em>
              <br />
              not worry you.
            </h1>

            {/* Sub */}
            <p className="text-[17px] text-ink-muted max-w-[560px] leading-[1.7] mb-10 font-normal animate-fade-up animate-delay-200">
              I build, fix, and maintain WordPress sites for small businesses and
              founders who are tired of slow pages, surprise downtime, and
              developers who disappear.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center animate-fade-up animate-delay-300">
              <a
                href="#contact"
                id="hero-cta-primary"
                onClick={() => ga.event({ action: "click", category: "engagement", label: "Hero - Let's Talk" })}
                className="group relative overflow-hidden inline-block bg-ink text-white px-8 py-4 rounded-sm text-[15px] font-medium tracking-[0.02em] border border-ink w-full sm:w-auto text-center transition-all duration-300"
              >
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
                <span className="relative z-10">Let&apos;s Talk →</span>
              </a>
              <a
                href="/free-audit"
                id="hero-cta-services"
                onClick={() => ga.event({ action: "click", category: "engagement", label: "Hero - Free Video Audit" })}
                className="group relative overflow-hidden inline-block text-ink px-8 py-4 rounded-sm text-[15px] font-medium border border-black/[0.18] hover:border-ink hover:bg-black/[0.02] w-full sm:w-auto text-center transition-all duration-300"
              >
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-dark to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
                <span className="relative z-10">Free Video Audit</span>
              </a>
            </div>
          </div>

          {/* ── Right Column: animation — accent, receded ── */}
          <div className="hidden lg:flex items-center justify-end relative z-0 w-full opacity-[0.78] animate-fade-up animate-delay-500">
            <HeroAnimation />
          </div>

        </div>

        {/* Full-width Stats Strip */}
        <div className="border-t border-black/[0.09] py-8 flex justify-between items-start animate-fade-up animate-delay-400">
          {stats.map((s) => (
            <div key={s.num} className="flex-1 text-center first:text-left last:text-right">
              <div className="font-serif text-[34px] text-ink leading-none tracking-[-0.03em]">
                {s.num}
              </div>
              <div className="text-[13px] text-ink-muted tracking-normal mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
