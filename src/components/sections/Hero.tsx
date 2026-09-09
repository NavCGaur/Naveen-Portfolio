"use client";

import Image from "next/image";
import * as ga from "@/lib/ga";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-[100px] pb-12 px-6 md:px-10 hd:px-14 overflow-hidden relative">
      <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-8 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="max-w-[700px] relative z-10">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-[12px] font-medium tracking-[0.12em] uppercase text-gold-dark mb-8 px-3.5 py-1.5 border border-gold bg-gold-light rounded-full animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_8px_rgba(37,211,102,0.6)] animate-pulse" />
              WordPress &amp; Full-Stack Developer
            </div>

            {/* Headline - "work for you," alone on second line */}
            <h1 className="font-serif text-[clamp(42px,5.2vw,74px)] leading-[1.06] tracking-[-0.03em] text-ink mb-6 animate-fade-up animate-delay-100">
              Your website should
              <br />
              <em className="italic text-gold-dark">work for you,</em>
              <br />
              not worry you.
            </h1>

            {/* Sub */}
            <p className="text-[14px] sm:text-[17px] text-ink-muted max-w-[490px] leading-[1.65] sm:leading-[1.7] mb-8 sm:mb-10 font-normal animate-fade-up animate-delay-200">
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
                <span className="relative z-10">Free Website &amp; AI Audit</span>
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
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="relative flex justify-center lg:justify-end items-center min-h-[340px] sm:min-h-[480px] lg:min-h-[540px] mt-6 lg:mt-0 animate-fade-up animate-delay-200">

            {/* 1. Large organic background blob (Responsive height for mobile) */}
            <div
              className="absolute pointer-events-none"
              style={{
                background: '#F7F5EE',
                borderRadius: '52% 48% 63% 37% / 42% 58% 42% 58%',
                width: '100%',
                height: '80%',
                top: '10%',
                left: '0%',
                opacity: 0.45,
                zIndex: 0,
              }}
            />
            {/* Desktop override for blob 1 */}
            <style jsx>{`
              @media (min-width: 640px) {
                div :global(.blob-1) {
                  width: 110% !important;
                  height: 90% !important;
                  top: 5% !important;
                  left: -5% !important;
                }
              }
            `}</style>

            {/* 1. Large organic background blob (Ultra light, reduced height on mobile) */}
            <div
              className="absolute pointer-events-none blob-1"
              style={{
                background: '#F7F5EE',
                borderRadius: '52% 48% 63% 37% / 42% 58% 42% 58%',
                zIndex: 0,
              }}
            />

            {/* 2. Secondary soft accent blob (Ultra light) */}
            <div
              className="absolute pointer-events-none hidden sm:block"
              style={{
                background: '#F0ECE3',
                borderRadius: '65% 35% 45% 55% / 55% 45% 55% 45%',
                width: '80%',
                height: '75%',
                bottom: '0%',
                right: '-5%',
                opacity: 0.35,
                zIndex: 0,
              }}
            />

            {/* 3. Dotted grid - Top Right (Scaled/positioned cleanly on mobile) */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '2%',
                right: '2%',
                width: '120px',
                height: '120px',
                backgroundImage: 'radial-gradient(#8C7653 1.8px, transparent 1.8px)',
                backgroundSize: '14px 14px',
                opacity: 0.15,
                zIndex: 1,
              }}
            />

            {/* 4. Handwritten text with arrow - Positioned closer to face (Hidden)
            <div 
              className="absolute hidden lg:flex flex-col items-start pointer-events-none z-20 text-[#8C7653]"
              style={{
                left: '42%',
                top: '28%',
                transform: 'rotate(-4deg)'
              }}
            >
              <span className="font-serif italic text-[16px] leading-[1.3] text-left max-w-[125px] font-normal tracking-wide text-ink/80 ">
                Let&apos;s build something great together.
              </span>
              <svg className="w-7 h-9 mt-0.5 ml-4 opacity-75 text-gold-dark" viewBox="0 0 40 50" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5,5 Q18,22 10,40 M6,32 L10,41 L18,36" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            */}

            {/* 5. Main Photograph Container */}
            <div className="relative w-full max-w-[340px] sm:max-w-[460px] h-[340px] sm:h-[460px] lg:h-[520px] z-10">
              <div 
                className="w-full h-full relative"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 8%, black 22%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 8%, black 22%)'
                }}
              >
                <Image
                  src="/images/projects/hero-image-naveen.png"
                  alt="Naveen Gaur - WordPress & Full-Stack Developer"
                  fill
                  priority
                  className="object-contain object-bottom filter brightness-[1.02] contrast-[1.02]"
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 460px, 500px"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
