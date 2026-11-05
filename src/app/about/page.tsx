import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Naveen Gaur | Developer, Educator & Lifelong Learner",
  description:
    "Meet Naveen Gaur — full-stack WordPress developer, educator teaching 40+ village children in the Himalayas, and creator of LoopLearnX. Based in Uttarakhand, India.",
  alternates: {
    canonical: "https://naveengaur.com/about",
  },
  openGraph: {
    title: "About Naveen Gaur | Developer, Educator & Lifelong Learner",
    description:
      "I build websites, solve real business problems, and help businesses grow online. I'm also passionate about education and using technology to create a positive impact.",
    url: "https://naveengaur.com/about",
    siteName: "Naveen Gaur",
    images: [
      {
        url: "/images/about/mountain-valley-selfie.webp",
        width: 1200,
        height: 630,
        alt: "Naveen Gaur in Uttarakhand Himalayas",
      },
    ],
    type: "profile",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://naveengaur.com/about#webpage",
        "url": "https://naveengaur.com/about",
        "name": "About Naveen Gaur - Developer, Educator and Lifelong Learner",
        "description": "Full-stack developer, WordPress specialist, and community educator living and working in Uttarakhand, India.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://naveengaur.com/#website",
          "name": "Naveen Gaur",
          "url": "https://naveengaur.com"
        }
      },
      {
        "@type": "Person",
        "@id": "https://naveengaur.com/#person",
        "name": "Naveen Gaur",
        "url": "https://naveengaur.com",
        "image": "https://naveengaur.com/images/about/mountain-valley-selfie.webp",
        "jobTitle": "Full-Stack WordPress Developer & Educator",
        "worksFor": {
          "@type": "Organization",
          "name": "Self-Employed"
        },
        "homeLocation": {
          "@type": "Place",
          "name": "Uttarakhand, India"
        },
        "description": "Senior WordPress developer with 5+ years of experience delivering 50+ projects, verified Google page-one rankings, and community education initiatives.",
        "knowsAbout": [
          "WordPress Development",
          "Technical SEO",
          "Core Web Vitals Optimization",
          "WooCommerce Engineering",
          "WhatsApp Automation",
          "Elementary Education & Digital Literacy"
        ],
        "sameAs": [
          "https://github.com/NavCGaur",
          "https://www.linkedin.com/in/naveengaur/"
        ]
      }
    ]
  };

  return (
    <>
      <Nav />
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] selection:bg-[#C4A35A]/30">
        {/* ── 1. HERO SECTION ── */}
        <section className="pt-[140px] md:pt-[160px] pb-16 md:pb-24 px-6 md:px-10 hd:px-14 border-b border-black/[0.06]">
          <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">
              
              {/* Left Column: Heading & Introduction */}
              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-6 h-[2px] bg-[#0F766E]"></span>
                  <span className="text-[12px] font-bold tracking-[0.18em] uppercase text-[#0F766E]">
                    ABOUT ME
                  </span>
                </div>

                <h1 className="font-serif text-[clamp(38px,5.5vw,62px)] leading-[1.1] tracking-[-0.025em] text-[#0D0D0D] mb-6 font-bold">
                  A Developer, Educator and Lifelong Learner
                </h1>

                <div className="w-12 h-[3px] bg-[#0F766E] mb-6"></div>

                <p className="text-[17px] md:text-[19px] text-[#374151] leading-[1.7] font-normal max-w-[580px]">
                  I build websites, solve real business problems, and help businesses grow online. I'm also passionate about education and using technology to create a positive impact, especially for underprivileged children.
                </p>
              </div>

              {/* Right Column: Mountain Valley River Selfie */}
              <div className="relative">
                <div className="relative mx-auto max-w-[420px] lg:max-w-[460px]">
                  {/* Backdrop accent shape */}
                  <div className="absolute -inset-3 bg-gradient-to-tr from-[#0F766E]/10 via-[#C4A35A]/15 to-transparent rounded-3xl -rotate-1 filter blur-sm"></div>

                  <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-[0_16px_40px_rgba(0,0,0,0.08)] bg-white aspect-[2/3]">
                    <Image
                      src="/images/about/mountain-valley-selfie.jpg"
                      alt="Naveen Gaur in Uttarakhand Himalayas with mountain valley and river"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 460px"
                      className="object-cover object-[center_35%] hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 text-white">
                      <div className="text-[14px] font-medium tracking-wide">Naveen Gaur</div>
                      <div className="text-[12px] text-white/80">Uttarakhand, Himalayas · India</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ── 2. MY JOURNEY SECTION ── */}
        <section className="py-20 md:py-28 px-6 md:px-10 hd:px-14 border-b border-black/[0.06]">
          <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2F1] text-[#00695C] text-[13px] font-semibold mb-10">
              <span className="w-2 h-2 rounded-full bg-[#00695C]"></span>
              My Journey
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr_0.8fr] gap-8 lg:gap-10 items-start">
              
              {/* Column 1: Story Narrative */}
              <div className="space-y-5 text-[#374151] text-[16px] leading-[1.75]">
                <p>
                  I'm an engineer by training and a problem-solver by nature. I began my career in the IT industry, where I worked on complex software projects, built scalable applications, and gained a strong foundation in technology, product development, and working with diverse teams.
                </p>
                <p>
                  Over time, I found my true calling in building end-to-end digital solutions for businesses. For the past <strong>5+ years</strong>, I've been helping business owners create professional WordPress websites, improve their search visibility, and grow online. I've worked on <strong>50+ projects</strong> across industries, from local businesses to global clients.
                </p>
                <div className="pt-2">
                  <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm">
                    <span className="text-[12px] uppercase font-bold tracking-wider text-[#0F766E] block mb-1">
                      Core Philosophy
                    </span>
                    <p className="text-[14px] text-[#4B5563] italic">
                      "A website should not just look beautiful — it must load instantly, rank on Google, and solve measurable business problems."
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 2: Experience Highlights (Feature Cards) */}
              <div className="space-y-4">
                {/* Highlight 1 */}
                <div className="p-5 rounded-xl bg-white border border-black/[0.06] shadow-sm flex items-start gap-4 hover:border-[#0F766E]/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#E0F2F1] text-[#00695C] flex items-center justify-center shrink-0 font-bold text-[18px]">
                    🎓
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-[#0D0D0D] mb-1">
                      Engineering Background
                    </h2>
                    <p className="text-[14px] text-[#4B5563] leading-[1.5]">
                      A strong technical foundation in problem solving and technology
                    </p>
                  </div>
                </div>

                {/* Highlight 2 */}
                <div className="p-5 rounded-xl bg-white border border-black/[0.06] shadow-sm flex items-start gap-4 hover:border-[#0F766E]/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#E0F2F1] text-[#00695C] flex items-center justify-center shrink-0 font-bold text-[18px]">
                    💼
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-[#0D0D0D] mb-1">
                      IT Industry Experience
                    </h2>
                    <p className="text-[14px] text-[#4B5563] leading-[1.5]">
                      Hands-on experience in software development and product projects
                    </p>
                  </div>
                </div>

                {/* Highlight 3 */}
                <div className="p-5 rounded-xl bg-white border border-black/[0.06] shadow-sm flex items-start gap-4 hover:border-[#0F766E]/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#E0F2F1] text-[#00695C] flex items-center justify-center shrink-0 font-bold text-[18px]">
                    &lt;/&gt;
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-[#0D0D0D] mb-1">
                      Full Stack &amp; WordPress Expert
                    </h2>
                    <p className="text-[14px] text-[#4B5563] leading-[1.5]">
                      5+ years of hands-on experience building, optimizing and scaling websites
                    </p>
                  </div>
                </div>

                {/* Highlight 4 */}
                <div className="p-5 rounded-xl bg-white border border-black/[0.06] shadow-sm flex items-start gap-4 hover:border-[#0F766E]/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#E0F2F1] text-[#00695C] flex items-center justify-center shrink-0 font-bold text-[18px]">
                    📚
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-[#0D0D0D] mb-1">
                      50+ Projects Delivered
                    </h2>
                    <p className="text-[14px] text-[#4B5563] leading-[1.5]">
                      Websites, custom solutions and SEO-driven projects for diverse businesses.
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 3: Impact Stats */}
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-black/[0.06] shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#F0FDF4] text-[#15803D] flex items-center justify-center shrink-0 text-[20px]">
                    🖥️
                  </div>
                  <div>
                    <div className="font-serif text-[24px] font-bold text-[#0D0D0D]">5+ Years</div>
                    <div className="text-[13px] text-[#4B5563]">Full Stack &amp; WordPress Experience</div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-black/[0.06] shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#F0FDF4] text-[#15803D] flex items-center justify-center shrink-0 text-[20px]">
                    📦
                  </div>
                  <div>
                    <div className="font-serif text-[24px] font-bold text-[#0D0D0D]">50+</div>
                    <div className="text-[13px] text-[#4B5563]">Projects Delivered</div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-black/[0.06] shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#F0FDF4] text-[#15803D] flex items-center justify-center shrink-0 text-[20px]">
                    👥
                  </div>
                  <div>
                    <div className="font-serif text-[24px] font-bold text-[#0D0D0D]">40+</div>
                    <div className="text-[13px] text-[#4B5563]">Children I Teach Regularly</div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-black/[0.06] shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#F0FDF4] text-[#15803D] flex items-center justify-center shrink-0 text-[20px]">
                    📈
                  </div>
                  <div>
                    <div className="font-serif text-[24px] font-bold text-[#0D0D0D]">Real Results</div>
                    <div className="text-[13px] text-[#4B5563]">Page 1 Google Rankings for Client Websites</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ── 3. GIVING BACK THROUGH EDUCATION ── */}
        <section className="py-20 md:py-28 px-6 md:px-10 hd:px-14 bg-[#F5F7F5] border-b border-black/[0.06]">
          <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto">
            
            {/* Full Width Banner Image */}
            <div className="relative rounded-2xl overflow-hidden border border-black/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.06)] bg-white aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.35/1] w-full mb-12">
              <Image
                src="/images/about/class.webp"
                alt="Naveen Gaur with 40+ village students in Uttarakhand"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center hover:scale-[1.01] transition-transform duration-500"
              />
            </div>

            {/* Content Below Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.85fr] gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Education Narrative */}
              <div>
                <h2 className="font-serif text-[clamp(28px,3.8vw,42px)] leading-[1.2] font-bold text-[#0D0D0D] mb-5">
                  Giving Back Through Education
                </h2>
                
                <p className="text-[16px] text-[#374151] leading-[1.75] mb-4">
                  Education has always been close to my heart. I regularly teach around <strong>40 underprivileged children</strong> from nearby villages, helping them build a strong foundation in academics and digital skills.
                </p>

                <p className="text-[16px] text-[#374151] leading-[1.75] mb-6">
                  To make learning more engaging and effective, I created <strong className="text-[#0D0D0D]">LoopLearnX</strong> — a simple learning app with lessons, practice exercises and progress tracking. It has made a real difference in how the children learn, stay motivated, and perform in their studies.
                </p>

                <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#00695C] bg-[#E0F2F1] px-4 py-2 rounded-full">
                  <span>📱</span>
                  <span>LoopLearnX — Self-developed learning platform</span>
                </div>
              </div>

              {/* Right Column: Handwritten Heart Callout Card */}
              <div>
                <div className="p-8 md:p-10 rounded-2xl bg-[#E6F4EA] border border-[#A7D7B5] shadow-sm text-center flex flex-col items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-white text-[#137333] flex items-center justify-center text-[22px] mb-4 shadow-xs">
                    💚
                  </div>
                  <blockquote className="font-serif italic text-[18px] md:text-[20px] text-[#137333] leading-[1.6]">
                    "For me, this is more than teaching — it's a small contribution to a more equitable and opportunity-rich society."
                  </blockquote>
                  <span className="block mt-4 text-[13px] font-semibold tracking-wider text-[#137333]/70 uppercase">
                    — Naveen Gaur
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ── 4. LIFE IN THE MOUNTAINS & WHAT DRIVES ME ── */}
        <section className="py-20 md:py-28 px-6 md:px-10 hd:px-14 border-b border-black/[0.06]">
          <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
              
              {/* Left Column: Life in the Mountains */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2F1] text-[#00695C] text-[12px] font-semibold mb-4">
                  🏔️ Mountain Life
                </div>
                <h2 className="font-serif text-[clamp(26px,3.5vw,36px)] leading-[1.2] font-bold text-[#0D0D0D] mb-4">
                  Life in the Mountains
                </h2>
                <p className="text-[16px] text-[#374151] leading-[1.75]">
                  I live with my family in a peaceful and remote part of the Uttarakhand mountains. The calm, natural surroundings keep me grounded, focused and inspired. It's a simple life, but a deeply fulfilling one — with time for meaningful work, learning, teaching, and being with my family.
                </p>
              </div>

              {/* Middle Column: Family Photo */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden border border-black/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.06)] bg-white aspect-[3/4] max-w-[340px] mx-auto relative">
                  <Image
                    src="/images/about/family-mountains.jpg"
                    alt="Naveen Gaur with family in the Uttarakhand mountains"
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    className="object-cover object-center hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Right Column: What Drives Me */}
              <div className="bg-white p-7 md:p-8 rounded-2xl border border-black/[0.08] shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2F1] text-[#00695C] flex items-center justify-center font-bold text-[15px]">
                    ♡
                  </div>
                  <h3 className="font-serif text-[22px] font-bold text-[#0D0D0D]">
                    What Drives Me
                  </h3>
                </div>

                <ul className="space-y-3.5 text-[15px] text-[#374151]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#0F766E] font-bold shrink-0 text-[17px]">✓</span>
                    <span>Solving real problems with technology</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0F766E] font-bold shrink-0 text-[17px]">✓</span>
                    <span>Helping businesses grow online</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0F766E] font-bold shrink-0 text-[17px]">✓</span>
                    <span>Making quality education more accessible</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0F766E] font-bold shrink-0 text-[17px]">✓</span>
                    <span>Living a meaningful and balanced life</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0F766E] font-bold shrink-0 text-[17px]">✓</span>
                    <span>Continuously learning and sharing what I learn</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>


        {/* ── 5. WORK WITH ME / CONNECT SECTION ── */}
        <section className="py-20 px-6 md:px-10 hd:px-14 bg-[#0D0D0D] text-white">
          <div className="max-w-[900px] mx-auto text-center">
            <span className="text-[#C4A35A] text-[12px] font-bold tracking-widest uppercase block mb-3">
              Let's Connect
            </span>
            <h2 className="font-serif text-[clamp(30px,4.5vw,46px)] leading-[1.2] font-bold mb-6">
              Interested in Working Together or Talking Tech &amp; Education?
            </h2>
            <p className="text-white/60 text-[17px] leading-[1.7] max-w-[620px] mx-auto mb-10">
              Whether you need a dedicated freelance WordPress developer, want to improve your search visibility with real Page-1 SEO, or simply want to say hello.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/freelance-wordpress-developer"
                className="bg-[#C4A35A] text-[#0D0D0D] px-8 py-4 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors shadow-lg shadow-[#C4A35A]/10"
              >
                Explore WordPress Services
              </Link>
              <a
                href="https://wa.me/919920899845?text=Hi%20Naveen,%20I'm%20reaching%20out%20after%20reading%20your%20About%20page"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 text-white px-7 py-4 rounded-sm text-[15px] font-medium hover:bg-white/5 transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]"></span>
                Message on WhatsApp
              </a>
              <a
                href="https://cal.com/naveen-gaur/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/20 text-white/80 px-7 py-4 rounded-sm text-[15px] font-medium hover:bg-white/5 transition-colors"
              >
                Schedule Video Call
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
