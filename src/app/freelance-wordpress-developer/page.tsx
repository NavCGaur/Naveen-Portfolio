import { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Freelance WordPress Developer & Technical SEO Expert | Naveen Gaur",
  description:
    "Hire a senior freelance WordPress developer with verified Google page-one results, 90+ mobile Core Web Vitals, custom WooCommerce builds, and WhatsApp API automation.",
  alternates: {
    canonical: "https://naveengaur.com/freelance-wordpress-developer",
  },
  openGraph: {
    title: "Freelance WordPress Developer & Technical SEO Expert | Naveen Gaur",
    description:
      "Hire a dedicated freelance WordPress developer with verified Google page-one rankings, Core Web Vitals optimization (90+ mobile), and custom automation.",
    url: "https://naveengaur.com/freelance-wordpress-developer",
    siteName: "Naveen Gaur",
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function FreelanceWordPressDeveloperPage({ searchParams }: PageProps) {
  const { status } = await searchParams;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://naveengaur.com/freelance-wordpress-developer#service",
        "name": "Naveen Gaur - Freelance WordPress Developer & Technical SEO Consultant",
        "url": "https://naveengaur.com/freelance-wordpress-developer",
        "image": "https://naveengaur.com/images/projects/Naveen_profile_pic.jpg",
        "description": "Senior freelance WordPress developer and technical SEO specialist providing custom theme development, Core Web Vitals optimization, WooCommerce engineering, and search ranking architecture.",
        "priceRange": "$$",
        "telephone": "+91-9910260426",
        "email": "hello@naveengaur.com",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "WordPress Development & SEO Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Custom WordPress Development & Clean Architecture",
                "description": "Bespoke, high-performance WordPress builds engineered without theme or plugin bloat."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Core Web Vitals & Mobile Speed Optimization",
                "description": "Full mobile performance turnaround achieving 90+ Google Lighthouse scores and passing field data."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Technical WordPress SEO & Page-One Ranking Architecture",
                "description": "Search intent mapping, schema deployment, and internal linking structure built directly into WordPress."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "WooCommerce Store Engineering & Checkout Flow",
                "description": "Fast, high-converting WooCommerce storefronts with secure payment, custom fields, and real-time database backups."
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://naveengaur.com/freelance-wordpress-developer#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What does it cost to hire a freelance WordPress developer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Freelance WordPress development costs depend on project scope. Fixed-scope builds typically range from $1,500 to $5,000+ depending on custom functionality, WooCommerce requirements, and design complexity. Dedicated monthly retainers for ongoing development and proactive maintenance start at $149/month. I offer transparent, milestone-based pricing with zero hidden fees."
            }
          },
          {
            "@type": "Question",
            "name": "Why hire an independent freelance WordPress developer instead of an agency?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Agencies carry high overheads, account managers, and often outsource your code to junior contractors. Working directly with a senior freelance developer gives you direct technical communication via WhatsApp and Slack, faster turnarounds, and accountable engineering backed by real Google ranking proof."
            }
          },
          {
            "@type": "Question",
            "name": "Can you fix a slow WordPress or Elementor website without rebuilding it from scratch?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Most slow WordPress sites suffer from unoptimized assets, render-blocking third-party scripts, and database bloat. Through root-cause optimization, I frequently improve mobile PageSpeed from 30–40 up to 90+ (such as our 42 to 91 turnaround on ModaWellness) without breaking visual layouts."
            }
          },
          {
            "@type": "Question",
            "name": "Do you build custom plugins or API automations?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. I build custom Node.js and WordPress webhook services to connect sites with WhatsApp APIs, external CRMs, payment gateways, and custom backend databases with complete data sovereignty."
            }
          },
          {
            "@type": "Question",
            "name": "How quickly can we start on a project?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "After an initial scoping review or technical audit, projects typically kick off within 48 to 72 hours. Communication is handled directly via Slack, WhatsApp, or email with scheduled video check-ins."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Nav />
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#0D0D0D] text-white">
        {/* Hero Section */}
        <section className="pt-[150px] pb-20 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[1000px] mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C4A35A]/10 border border-[#C4A35A]/25 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C4A35A] animate-pulse"></span>
              <span className="text-[12px] font-medium tracking-wide text-[#C4A35A] uppercase">
                Senior Freelance WordPress Developer &amp; Technical SEO Architect
              </span>
            </div>

            <h1 className="font-serif text-[clamp(34px,5vw,60px)] tracking-[-0.025em] leading-[1.12] text-white mb-6">
              Hire a Dedicated Freelance WordPress Developer Who Engineers for Speed, Security, and Google Page-One Discovery
            </h1>

            <p className="text-[18px] md:text-[20px] text-white/70 max-w-[760px] leading-[1.65] font-light mb-10">
              Stop gambling on anonymous marketplace profiles or bloated agency retainers. Work directly with a senior technical developer who builds clean, lightweight WordPress websites backed by verified 90+ mobile Core Web Vitals and real Google page-one search rankings.
            </p>

            {/* Credibility Proof Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-[#141414] border border-white/[0.08] p-4 rounded-lg">
                <div className="text-[#C4A35A] text-[20px] font-serif font-bold mb-1">Page 1</div>
                <div className="text-[13px] text-white/60 leading-tight">Verified Google Search Rankings (UK &amp; USA)</div>
              </div>
              <div className="bg-[#141414] border border-white/[0.08] p-4 rounded-lg">
                <div className="text-[#C4A35A] text-[20px] font-serif font-bold mb-1">42 → 91</div>
                <div className="text-[13px] text-white/60 leading-tight">Mobile PageSpeed &amp; Core Web Vitals Turnaround</div>
              </div>
              <div className="bg-[#141414] border border-white/[0.08] p-4 rounded-lg">
                <div className="text-[#C4A35A] text-[20px] font-serif font-bold mb-1">Woo &amp; Elementor</div>
                <div className="text-[13px] text-white/60 leading-tight">Performance Tuning &amp; Zero-Bloat Engineering</div>
              </div>
              <div className="bg-[#141414] border border-white/[0.08] p-4 rounded-lg">
                <div className="text-[#C4A35A] text-[20px] font-serif font-bold mb-1">1-on-1 Direct</div>
                <div className="text-[13px] text-white/60 leading-tight">Direct Engineer Access via WhatsApp &amp; Slack</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="bg-[#C4A35A] text-[#0D0D0D] px-8 py-4 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-all duration-200 shadow-lg shadow-[#C4A35A]/10"
              >
                Book a Scoping Call
              </a>
              <a
                href="https://wa.me/919910260426?text=Hi%20Naveen,%20I'm%20looking%20to%20hire%20a%20freelance%20WordPress%20developer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#25D366]/40 bg-[#25D366]/10 text-white px-6 py-4 rounded-sm text-[15px] font-medium hover:bg-[#25D366]/20 transition-all duration-200"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]"></span>
                Chat on WhatsApp
              </a>
              <a
                href="#proof"
                className="border border-white/20 text-white/80 hover:text-white px-6 py-4 rounded-sm text-[15px] font-medium hover:bg-white/5 transition-all duration-200"
              >
                View Case Studies &amp; Proof ↓
              </a>
            </div>
          </div>
        </section>

        {/* Real-World Proof Section */}
        <section id="proof" className="py-24 px-6 md:px-10 bg-[#121212] border-b border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center max-w-[700px] mx-auto mb-16">
              <span className="text-[12px] font-semibold tracking-widest uppercase text-[#C4A35A] block mb-2">
                Demonstrated Track Record
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">
                Real Results That Separate a Senior Developer from Marketplace Freelancers
              </h2>
              <p className="text-white/60 text-[16px]">
                Most freelancers build websites that look good on desktop but load slowly and remain invisible on search engines. Every site I build is engineered for speed, clean architecture, and commercial search discovery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Case Study 1: ModaWellness */}
              <div className="bg-[#0D0D0D] border border-white/[0.08] p-8 rounded-xl flex flex-col justify-between hover:border-[#C4A35A]/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#C4A35A] bg-[#C4A35A]/10 px-2.5 py-1 rounded">
                      Local Clinic SEO &amp; Speed
                    </span>
                    <span className="text-[12px] text-white/40">Bath, UK</span>
                  </div>
                  <h3 className="text-white text-[22px] font-serif mb-3">
                    ModaWellness Aesthetic Clinic
                  </h3>
                  <div className="space-y-3 mb-6 text-[14px]">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-white/60">Ranked Query</span>
                      <strong className="text-white font-mono text-[13px]">"Botox in Bath UK" (Page 1)</strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-white/60">Mobile PageSpeed</span>
                      <strong className="text-[#C4A35A] font-bold">42 → 91 Performance</strong>
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-white/60">Execution</span>
                      <span className="text-white/80">Asset stripping, medical schema, local intent</span>
                    </div>
                  </div>
                </div>
                <a
                  href="/blog/local-seo-case-study-botox-in-bath-uk"
                  className="inline-flex items-center gap-1 text-[14px] text-[#C4A35A] font-medium hover:underline pt-4 border-t border-white/[0.06]"
                >
                  Read Full Clinic Case Study →
                </a>
              </div>

              {/* Case Study 2: Kat Grace */}
              <div className="bg-[#0D0D0D] border border-white/[0.08] p-8 rounded-xl flex flex-col justify-between hover:border-[#C4A35A]/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#C4A35A] bg-[#C4A35A]/10 px-2.5 py-1 rounded">
                      Local Practice SEO
                    </span>
                    <span className="text-[12px] text-white/40">Texas, USA</span>
                  </div>
                  <h3 className="text-white text-[22px] font-serif mb-3">
                    Kat Grace Healing
                  </h3>
                  <div className="space-y-3 mb-6 text-[14px]">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-white/60">Ranked Query</span>
                      <strong className="text-white font-mono text-[13px]">"Energy Healing Georgetown, Texas"</strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-white/60">Architecture</span>
                      <strong className="text-[#C4A35A]">URL Consolidation (No doorway spam)</strong>
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-white/60">Stack</span>
                      <span className="text-white/80">WordPress &amp; Elementor with FAQ schema</span>
                    </div>
                  </div>
                </div>
                <a
                  href="/blog/local-seo-case-study-energy-healing-georgetown-texas"
                  className="inline-flex items-center gap-1 text-[14px] text-[#C4A35A] font-medium hover:underline pt-4 border-t border-white/[0.06]"
                >
                  Read Full Practice Case Study →
                </a>
              </div>

              {/* Case Study 3: Custom Automation */}
              <div className="bg-[#0D0D0D] border border-white/[0.08] p-8 rounded-xl flex flex-col justify-between hover:border-[#C4A35A]/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#C4A35A] bg-[#C4A35A]/10 px-2.5 py-1 rounded">
                      Technical Guide &amp; Engineering
                    </span>
                    <span className="text-[12px] text-white/40">Global</span>
                  </div>
                  <h3 className="text-white text-[22px] font-serif mb-3">
                    Custom WhatsApp Automation
                  </h3>
                  <div className="space-y-3 mb-6 text-[14px]">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-white/60">Ranked Query</span>
                      <strong className="text-white font-mono text-[13px]">"Whatsapp baileys integration 2026"</strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-white/60">Google Position</span>
                      <strong className="text-[#C4A35A]">#1 on Google SERP</strong>
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-white/60">Capabilities</span>
                      <span className="text-white/80">Node.js WebSockets, CRM bridges, zero SaaS markups</span>
                    </div>
                  </div>
                </div>
                <a
                  href="/blog/whatsapp-baileys-integration-guide"
                  className="inline-flex items-center gap-1 text-[14px] text-[#C4A35A] font-medium hover:underline pt-4 border-t border-white/[0.06]"
                >
                  Read Architecture Guide →
                </a>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a
                href="/blog/how-to-rank-on-googles-first-page"
                className="inline-flex items-center gap-2 text-[15px] text-white/80 hover:text-[#C4A35A] transition-colors"
              >
                <span>Read my complete 4-stage ranking framework:</span>
                <span className="font-medium underline">"How to Rank Your WordPress Website on Google's First Page" →</span>
              </a>
            </div>
          </div>
        </section>

        {/* Comparison: Why Hire Naveen vs Platforms vs Agencies */}
        <section className="py-24 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center max-w-[700px] mx-auto mb-16">
              <span className="text-[12px] font-semibold tracking-widest uppercase text-[#C4A35A] block mb-2">
                Hiring Dilemma Solved
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">
                Why Work With an Independent Senior Developer?
              </h2>
              <p className="text-white/60 text-[16px]">
                Comparing your options when looking to hire for WordPress development and search growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Option 1: Cheap Freelancer */}
              <div className="bg-[#141414] border border-white/[0.06] p-8 rounded-xl opacity-75">
                <span className="block text-[11px] font-bold tracking-widest uppercase text-red-400 mb-2">
                  Marketplace Freelancers ($20–$35/hr)
                </span>
                <h3 className="text-white text-[20px] font-serif mb-4">Upwork / Fiverr Generalists</h3>
                <ul className="space-y-3 text-[14px] text-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Installs 40+ plugins to solve basic problems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Leaves mobile PageSpeed in the 30s and 40s</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Zero knowledge of technical SEO or schema</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Disappears when complex conflicts or errors arise</span>
                  </li>
                </ul>
              </div>

              {/* Option 2: Bloated Agency */}
              <div className="bg-[#141414] border border-white/[0.06] p-8 rounded-xl opacity-75">
                <span className="block text-[11px] font-bold tracking-widest uppercase text-amber-400 mb-2">
                  Traditional Agencies ($5k–$15k/mo)
                </span>
                <h3 className="text-white text-[20px] font-serif mb-4">Marketing &amp; Dev Agencies</h3>
                <ul className="space-y-3 text-[14px] text-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">✕</span>
                    <span>Massive agency markups and fixed-scope bureaucracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">✕</span>
                    <span>Account managers sit between you and the engineer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">✕</span>
                    <span>Work is often handed off to junior interns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">✕</span>
                    <span>Slow turnaround on simple updates and bug fixes</span>
                  </li>
                </ul>
              </div>

              {/* Option 3: Dedicated Senior Developer (Naveen) */}
              <div className="bg-[#0D0D0D] border-2 border-[#C4A35A] p-8 rounded-xl relative shadow-[0_10px_35px_rgba(196,163,90,0.08)]">
                <span className="absolute -top-3 right-6 bg-[#C4A35A] text-[#0D0D0D] text-[10px] font-bold tracking-wider uppercase px-3 py-0.5 rounded-full">
                  Recommended Model
                </span>
                <span className="block text-[11px] font-bold tracking-widest uppercase text-[#C4A35A] mb-2">
                  Senior Dedicated Specialist
                </span>
                <h3 className="text-white text-[20px] font-serif mb-4">Naveen Gaur</h3>
                <ul className="space-y-3 text-[14px] text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C4A35A] font-bold">✔</span>
                    <span><strong>Clean, performant code:</strong> Lightweight custom builds without bloat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C4A35A] font-bold">✔</span>
                    <span><strong>90+ Core Web Vitals:</strong> Engineered for sub-second mobile page loads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C4A35A] font-bold">✔</span>
                    <span><strong>SEO baked into code:</strong> Clean semantic tags, JSON-LD schema, search intent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C4A35A] font-bold">✔</span>
                    <span><strong>Direct 1-on-1 collaboration:</strong> Real-time messaging via WhatsApp and Slack</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Specialized Capabilities Section */}
        <section className="py-24 px-6 md:px-10 bg-[#141414] border-b border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center max-w-[700px] mx-auto mb-16">
              <span className="text-[12px] font-semibold tracking-widest uppercase text-[#C4A35A] block mb-2">
                Core Capabilities
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">
                Full-Stack WordPress Engineering &amp; Search Optimization
              </h2>
              <p className="text-white/60 text-[16px]">
                Whether you need a dedicated developer for an end-to-end build or an expert to fix an existing site.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Capability 1 */}
              <div className="bg-[#0D0D0D] border border-white/[0.08] p-8 rounded-xl">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">
                  01 / Custom WordPress Builds
                </span>
                <p className="text-[14px] text-white/60 leading-[1.6] mb-4">
                  Bespoke WordPress theme and template development tailored to your exact business goals. Clean PHP, modern CSS, and lightweight JavaScript engineered to load under 1.5 seconds.
                </p>
                <span className="text-[12px] text-[#C4A35A] font-mono">Clean Architecture · Zero Theme Bloat</span>
              </div>

              {/* Capability 2 */}
              <div className="bg-[#0D0D0D] border border-white/[0.08] p-8 rounded-xl">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">
                  02 / Core Web Vitals &amp; Speed
                </span>
                <p className="text-[14px] text-white/60 leading-[1.6] mb-4">
                  Root-cause diagnostic optimization. Eliminating render-blocking scripts, compressing media payloads, resolving CLS layout shifts, and configuring high-speed edge caching.
                </p>
                <span className="text-[12px] text-[#C4A35A] font-mono">90+ Lighthouse Mobile · Passing Field Data</span>
              </div>

              {/* Capability 3 */}
              <div className="bg-[#0D0D0D] border border-white/[0.08] p-8 rounded-xl">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">
                  03 / WooCommerce Engineering
                </span>
                <p className="text-[14px] text-white/60 leading-[1.6] mb-4">
                  High-converting WooCommerce store development, checkout optimization, payment gateway integration (Stripe, PayPal, Mollie), and database query tuning for multi-thousand product catalogs.
                </p>
                <span className="text-[12px] text-[#C4A35A] font-mono">Streamlined Checkout · High Concurrency</span>
              </div>

              {/* Capability 4 */}
              <div className="bg-[#0D0D0D] border border-white/[0.08] p-8 rounded-xl">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">
                  04 / Elementor Performance Tuning
                </span>
                <p className="text-[14px] text-white/60 leading-[1.6] mb-4">
                  Love the visual flexibility of Elementor but tired of sluggish load speeds? I strip redundant DOM nodes, disable unused widgets, and streamline CSS/JS execution to achieve high performance on visual builders.
                </p>
                <span className="text-[12px] text-[#C4A35A] font-mono">DOM Reduction · Unused CSS Removal</span>
              </div>

              {/* Capability 5 */}
              <div className="bg-[#0D0D0D] border border-white/[0.08] p-8 rounded-xl">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">
                  05 / Technical SEO &amp; Schema
                </span>
                <p className="text-[14px] text-white/60 leading-[1.6] mb-4">
                  Deploying hand-crafted JSON-LD schema (LocalBusiness, MedicalBusiness, Service, FAQPage), fixing canonical confusion, optimizing crawl budgets, and aligning site structure with buyer search intent.
                </p>
                <span className="text-[12px] text-[#C4A35A] font-mono">Schema.org · Google First-Page Architecture</span>
              </div>

              {/* Capability 6 */}
              <div className="bg-[#0D0D0D] border border-white/[0.08] p-8 rounded-xl">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">
                  06 / Custom API &amp; Automations
                </span>
                <p className="text-[14px] text-white/60 leading-[1.6] mb-4">
                  Connecting WordPress to external business systems: WhatsApp bots, CRM synchronization, automated lead routing, and serverless webhook pipelines built with Node.js and REST APIs.
                </p>
                <span className="text-[12px] text-[#C4A35A] font-mono">Node.js · WhatsApp Baileys · REST APIs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Engagement Models */}
        <section id="pricing" className="py-24 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center max-w-[700px] mx-auto mb-16">
              <span className="text-[12px] font-semibold tracking-widest uppercase text-[#C4A35A] block mb-2">
                Predictable Investment
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">
                Transparent Engagement Models &amp; Pricing
              </h2>
              <p className="text-white/60 text-[16px]">
                Clear deliverables with zero hidden agency markups. Choose the model that matches your business timeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Model 1: Project Build */}
              <div className="bg-[#141414] border border-white/[0.08] p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="block text-[#C4A35A] text-[11px] font-medium tracking-widest uppercase mb-2">
                    01 / FIXED-SCOPE BUILD
                  </span>
                  <h3 className="text-white text-[24px] font-serif mb-2">Project Sprint</h3>
                  <p className="text-white/40 text-[14px] mb-6">
                    For new website launches, complete redesigns, or headless migrations.
                  </p>
                  <div className="text-[36px] font-serif text-white mb-6">
                    From $1,500<span className="text-[14px] text-white/40 block font-sans font-normal">Fixed milestone delivery</span>
                  </div>
                  <ul className="space-y-3 text-[14px] text-white/70 mb-8 border-t border-white/[0.06] pt-6">
                    <li>✔ Complete scoping document &amp; timeline</li>
                    <li>✔ Custom responsive WordPress build</li>
                    <li>✔ 90+ mobile Core Web Vitals guarantee</li>
                    <li>✔ Technical SEO &amp; JSON-LD schema ready</li>
                    <li>✔ 30-day post-launch warranty &amp; support</li>
                  </ul>
                </div>
                <a
                  href="#contact"
                  className="w-full text-center block border border-white/20 text-white py-3 rounded-sm text-[14px] font-medium hover:bg-white/5 transition-colors"
                >
                  Discuss Project Scope
                </a>
              </div>

              {/* Model 2: Dedicated Retainer */}
              <div className="bg-[#0D0D0D] border-2 border-[#C4A35A] p-8 rounded-xl relative flex flex-col justify-between shadow-[0_10px_30px_rgba(196,163,90,0.06)]">
                <span className="absolute top-4 right-4 bg-[#C4A35A]/15 border border-[#C4A35A]/30 text-[#C4A35A] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-sm">
                  Most Popular
                </span>
                <div>
                  <span className="block text-[#C4A35A] text-[11px] font-medium tracking-widest uppercase mb-2">
                    02 / DEDICATED PARTNER
                  </span>
                  <h3 className="text-white text-[24px] font-serif mb-2">Dedicated Retainer</h3>
                  <p className="text-white/40 text-[14px] mb-6">
                    For growing brands, WooCommerce stores, and ongoing feature development.
                  </p>
                  <div className="text-[36px] font-serif text-white mb-6">
                    $149 – $499<span className="text-[14px] text-white/40 font-sans font-normal">/month</span>
                  </div>
                  <ul className="space-y-3 text-[14px] text-white/80 mb-8 border-t border-white/[0.06] pt-6">
                    <li>✔ Dedicated developer hours for custom features</li>
                    <li>✔ Priority 12-hour response SLA</li>
                    <li>✔ Supervised staging updates &amp; backups</li>
                    <li>✔ Continuous Core Web Vitals &amp; uptime monitoring</li>
                    <li>✔ Direct Slack / WhatsApp direct channel</li>
                    <li>✔ Month-to-month flexibility (cancel anytime)</li>
                  </ul>
                </div>
                <a
                  href="#contact"
                  className="w-full text-center block bg-[#C4A35A] text-[#0D0D0D] py-3 rounded-sm text-[14px] font-medium hover:bg-[#d4b46a] transition-colors"
                >
                  Reserve Developer Retainer
                </a>
              </div>

              {/* Model 3: Technical Audit & Overhaul */}
              <div className="bg-[#141414] border border-white/[0.08] p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="block text-[#C4A35A] text-[11px] font-medium tracking-widest uppercase mb-2">
                    03 / RAPID REPAIR
                  </span>
                  <h3 className="text-white text-[24px] font-serif mb-2">Speed &amp; SEO Audit</h3>
                  <p className="text-white/40 text-[14px] mb-6">
                    For existing sites with slow load times, indexing blockers, or broken layouts.
                  </p>
                  <div className="text-[36px] font-serif text-white mb-6">
                    $450<span className="text-[14px] text-white/40 block font-sans font-normal">One-time comprehensive diagnostic</span>
                  </div>
                  <ul className="space-y-3 text-[14px] text-white/70 mb-8 border-t border-white/[0.06] pt-6">
                    <li>✔ Full Core Web Vitals &amp; Lighthouse audit</li>
                    <li>✔ Database bloat &amp; slow query identification</li>
                    <li>✔ Google Search Console indexation review</li>
                    <li>✔ Prioritized action checklist &amp; code fixes</li>
                    <li>✔ 45-minute live walkthrough with Naveen</li>
                  </ul>
                </div>
                <a
                  href="#contact"
                  className="w-full text-center block border border-white/20 text-white py-3 rounded-sm text-[14px] font-medium hover:bg-white/5 transition-colors"
                >
                  Book Technical Audit
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 md:px-10 bg-[#121212] border-b border-white/[0.06]">
          <div className="max-w-[850px] mx-auto">
            <div className="text-center mb-16">
              <span className="text-[12px] font-semibold tracking-widest uppercase text-[#C4A35A] block mb-2">
                Clear Answers
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-white/60 text-[16px]">
                Everything you need to know about hiring me as your freelance WordPress developer.
              </p>
            </div>

            <div className="space-y-8">
              <div className="border-b border-white/[0.08] pb-6">
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">
                  What does it cost to hire a freelance WordPress developer?
                </h3>
                <p className="text-[15px] text-white/60 leading-[1.6]">
                  Pricing depends on the scope of work. Fixed-scope projects typically start at $1,500 and scale based on complexity (WooCommerce integrations, custom database models, or multisite setups). Ongoing monthly development retainers range from $149 to $499/month. You receive an itemized, transparent scope before any project begins.
                </p>
              </div>

              <div className="border-b border-white/[0.08] pb-6">
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">
                  Why hire an independent developer instead of a digital agency?
                </h3>
                <p className="text-[15px] text-white/60 leading-[1.6]">
                  Agencies carry large administrative overhead, meaning you pay for account managers, salespeople, and office space—while your code is often written by junior offshore developers. When you hire me, you work directly with a senior engineer who has proven Google page-one search results and 10+ years of technical experience.
                </p>
              </div>

              <div className="border-b border-white/[0.08] pb-6">
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">
                  Can you fix a slow WordPress or Elementor site without rebuilding from scratch?
                </h3>
                <p className="text-[15px] text-white/60 leading-[1.6]">
                  Yes. Many clients come to me with existing sites that fail Google's Core Web Vitals. Rather than forcing you into a costly rebuild, I diagnose the bottlenecks—such as render-blocking scripts, unoptimized fonts, bloated database autoloads, or redundant third-party tracking tags—and systematically resolve them. In our ModaWellness case study, we improved mobile speed from 42 to 91 while preserving the existing design.
                </p>
              </div>

              <div className="border-b border-white/[0.08] pb-6">
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">
                  Do you build custom plugins or third-party API integrations?
                </h3>
                <p className="text-[15px] text-white/60 leading-[1.6]">
                  Yes. Beyond theme development, I specialize in connecting WordPress to external systems via REST APIs, WebSockets, and webhooks. I have built production WhatsApp automation gateways using Node.js/Baileys, CRM connectors, and automated client intake flows with total data sovereignty.
                </p>
              </div>

              <div className="border-b border-white/[0.08] pb-6">
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">
                  How does communication and project management work?
                </h3>
                <p className="text-[15px] text-white/60 leading-[1.6]">
                  You have direct access to me throughout the engagement. Communication is handled via Slack, WhatsApp, or email, with scheduled video check-ins for milestone demonstrations. All code is tracked in private Git repositories, and updates are tested in dedicated staging environments before deployment to production.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Intake Section */}
        <section id="contact" className="py-24 px-6 md:px-10 bg-[#0A0A0A]">
          <div id="audit" className="max-w-[750px] mx-auto">
            <div className="text-center mb-12">
              <span className="text-[12px] font-semibold tracking-widest uppercase text-[#C4A35A] block mb-2">
                Let's Build Something Exceptional
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">
                Discuss Your WordPress Project
              </h2>
              <p className="text-white/60 text-[16px]">
                Tell me about your site, your performance goals, or what needs fixing. I will review your requirements and respond within 24 hours with an actionable scoping plan.
              </p>
            </div>

            {status === "success" && (
              <div className="bg-[#C4A35A]/10 border border-[#C4A35A]/30 text-[#C4A35A] rounded-sm p-5 mb-8 text-center text-[15px]">
                ✔ <strong>Inquiry received successfully!</strong> I will review your website details and reach out via email or WhatsApp within 24 hours.
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-sm p-5 mb-8 text-center text-[15px]">
                ❌ <strong>Error submitting inquiry.</strong> Please verify your email address and details, or message me directly on WhatsApp.
              </div>
            )}

            <form
              action="/api/contact"
              method="POST"
              className="bg-[#141414] border border-white/[0.08] p-8 md:p-10 rounded-xl space-y-6"
            >
              <input type="hidden" name="type" value="freelance_wordpress_developer_inquiry" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="sarah@yourcompany.com"
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Website URL (if existing)</label>
                  <input
                    type="url"
                    name="website"
                    placeholder="https://yourwebsite.com"
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Project Scope</label>
                  <select
                    name="budget"
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors appearance-none"
                  >
                    <option value="Dedicated Developer Retainer">Dedicated Developer Retainer ($149–$499/mo)</option>
                    <option value="New Website Build / Redesign">New Website Build / Redesign ($1,500–$5,000)</option>
                    <option value="Core Web Vitals & Speed Overhaul">Core Web Vitals &amp; Speed Overhaul ($450)</option>
                    <option value="WooCommerce Custom Development">WooCommerce Custom Development</option>
                    <option value="Custom WhatsApp / API Automation">Custom WhatsApp / API Automation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">
                  Project Details &amp; Objectives
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell me about your site, what challenges you are facing (slow speeds, checkout bugs, poor rankings, or custom features needed), and your target timeline..."
                  className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C4A35A] text-[#0D0D0D] py-4 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200"
              >
                Send Project Inquiry
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 text-[13px] text-white/50 border-t border-white/[0.06]">
                <span>Prefer direct messaging?</span>
                <a
                  href="https://wa.me/919910260426?text=Hi%20Naveen,%20I'm%20looking%20to%20hire%20a%20freelance%20WordPress%20developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline font-medium inline-flex items-center gap-1"
                >
                  WhatsApp: +91 99102 60426 →
                </a>
                <span>or</span>
                <a
                  href="https://calendly.com/naveengaur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C4A35A] hover:underline font-medium"
                >
                  Schedule 20-min Video Call →
                </a>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
