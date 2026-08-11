import { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Done-For-You llms.txt Setup Service ($10) | Get Found by ChatGPT & AI Search",
  description:
    "Get your business found and cited accurately by ChatGPT, Perplexity, and Gemini. Custom llms.txt creation, root server installation, and live verification for $10 within 48 hours.",
  alternates: {
    canonical: "https://naveengaur.com/llms-txt",
  },
  openGraph: {
    title: "Done-For-You llms.txt Setup Service ($10) | Get Found by ChatGPT & AI Search",
    description:
      "Get your business found and cited accurately by ChatGPT, Perplexity, and Gemini. Custom llms.txt creation, root server installation, and live verification for $10 within 48 hours.",
    url: "https://naveengaur.com/llms-txt",
    siteName: "Naveen Gaur — WordPress Performance Specialist & Full-Stack Consultant",
    type: "website",
  },
};

const whatsappMsg = "Hi Naveen, I want to order the $10 llms.txt setup service for my website.";
const encodedWhatsAppUrl = `https://wa.me/919920899845?text=${encodeURIComponent(whatsappMsg)}`;
const encodedEmailUrl = `mailto:hello@naveengaur.com?subject=${encodeURIComponent("Order Inquiry - $10 llms.txt Setup Service")}`;

export default async function LlmsTxtServicePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Done-For-You llms.txt Setup Service for AI Search Visibility",
    "provider": {
      "@type": "Person",
      "name": "Naveen Gaur",
      "url": "https://naveengaur.com"
    },
    "description": "Custom llms.txt creation, root directory deployment, and PageSpeed Agentic Browsing verification for businesses wanting AI search visibility in ChatGPT, Gemini, and Perplexity.",
    "offers": {
      "@type": "Offer",
      "price": "10.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-08-11"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="min-h-screen bg-[#0D0D0D] text-white">
        {/* Hero Section */}
        <section className="pt-[160px] pb-20 px-6 md:px-10 border-b border-white/[0.06] relative overflow-hidden">
          <div className="max-w-[960px] mx-auto text-center">
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-[#C4A35A] bg-[#C4A35A]/10 border border-[#C4A35A]/30 px-3.5 py-1.5 rounded-full mb-6">
              AI SEARCH VISIBILITY &amp; AGENTIC BROWSING SETUP
            </span>
            
            <h1 className="font-serif text-[clamp(36px,5.5vw,68px)] tracking-[-0.03em] leading-[1.08] text-white mb-6">
              Get Your Business Found by <br className="hidden sm:inline" />
              <span className="text-[#C4A35A]">ChatGPT, Perplexity &amp; AI Search</span>
            </h1>
            
            <p className="text-[18px] md:text-[20px] text-white/70 max-w-[720px] mx-auto leading-[1.7] font-light mb-10">
              More and more potential customers are asking AI assistants to find and recommend businesses like yours instead of typing into Google. If your website isn&apos;t set up to be understood by these tools, you risk becoming invisible to a fast-growing segment of buyers.
            </p>

            {/* Pricing Offer Pill */}
            <div className="inline-flex items-center gap-3 bg-[#141414] border border-[#C4A35A]/40 px-6 py-3 rounded-xl mb-10 shadow-lg">
              <span className="text-[13px] uppercase tracking-wider text-white/50">Launch Pricing:</span>
              <span className="text-[32px] font-serif text-[#C4A35A] font-bold">$10</span>
              <span className="text-[13px] text-white/40 line-through">(Regular: $50)</span>
              <span className="text-[11px] bg-[#25D366]/20 text-[#25D366] font-semibold px-2.5 py-0.5 rounded-full border border-[#25D366]/30 ml-2">
                Limited to first 20 clients
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-[600px] mx-auto">
              <a
                href={encodedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-[#0D0D0D] px-8 py-4 rounded-sm text-[16px] font-bold uppercase tracking-[0.04em] hover:bg-[#20bd5a] transition-all duration-300 shadow-xl hover:scale-[1.02]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Order Now — $10 (WhatsApp)
              </a>

              <a
                href="#order-form"
                className="w-full sm:w-auto inline-flex items-center justify-center border border-white/20 text-white px-7 py-4 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-white/5 transition-colors duration-200"
              >
                Or Fill Quick Form ↓
              </a>
            </div>

            <p className="text-[13px] text-white/50 mt-6 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              Takes less than 48 hours from order to live verification on your site.
            </p>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-24 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-16">
              <span className="text-[12px] font-semibold tracking-widest text-[#C4A35A] uppercase block mb-3">
                WHY YOUR WEBSITE NEEDS AN LLMS.TXT FILE
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] text-white">
                Be Found and Quoted Accurately by AI
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#141414] border border-white/[0.06] p-8 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-[#C4A35A]/10 border border-[#C4A35A]/20 flex items-center justify-center text-[#C4A35A] text-[22px] font-serif mb-6">
                  01
                </div>
                <h3 className="text-white text-[20px] font-serif mb-3">Be Findable, Not Skipped</h3>
                <p className="text-white/60 text-[15px] leading-[1.65]">
                  When someone asks ChatGPT or Perplexity &quot;who provides [your service] near me,&quot; a properly configured website is far more likely to be recognized and recommended.
                </p>
              </div>

              <div className="bg-[#141414] border border-white/[0.06] p-8 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-[#C4A35A]/10 border border-[#C4A35A]/20 flex items-center justify-center text-[#C4A35A] text-[22px] font-serif mb-6">
                  02
                </div>
                <h3 className="text-white text-[20px] font-serif mb-3">Get Quoted Accurately</h3>
                <p className="text-white/60 text-[15px] leading-[1.65]">
                  Without a clean <code className="text-[#C4A35A] bg-black/40 px-1.5 py-0.5 rounded">llms.txt</code> file, AI tools guess — often getting details wrong or skipping you for a competitor whose site structure is easier to read.
                </p>
              </div>

              <div className="bg-[#141414] border border-white/[0.06] p-8 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-[#C4A35A]/10 border border-[#C4A35A]/20 flex items-center justify-center text-[#C4A35A] text-[22px] font-serif mb-6">
                  03
                </div>
                <h3 className="text-white text-[20px] font-serif mb-3">Pass Google Agentic Checks</h3>
                <p className="text-white/60 text-[15px] leading-[1.65]">
                  Google PageSpeed Insights now evaluates Agentic Browsing readiness. A missing <code className="text-[#C4A35A] bg-black/40 px-1.5 py-0.5 rounded">llms.txt</code> is the #1 reason websites score 2/3 instead of 3/3.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-24 px-6 md:px-10 bg-[#121212] border-b border-white/[0.06]">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-16">
              <span className="text-[12px] font-semibold tracking-widest text-[#C4A35A] uppercase block mb-3">
                COMPLETE DONE-FOR-YOU PACKAGE
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] text-white mb-4">
                What Is Included in Your $10 Setup
              </h2>
              <p className="text-white/60 text-[16px]">
                You don&apos;t touch anything technical. We handle writing, formatting, root installation, and live verification.
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#C4A35A]/30 rounded-2xl p-8 md:p-12 shadow-2xl space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-[#25D366] text-[20px] font-bold mt-1">✔</span>
                <div>
                  <h3 className="text-white font-serif text-[18px] mb-1">Custom llms.txt File Authoring</h3>
                  <p className="text-white/60 text-[15px]">A structured summary written specifically for AI language models — stating your business capabilities, credentials, target audience, and primary pages in valid Markdown link syntax.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-white/[0.06]">
                <span className="text-[#25D366] text-[20px] font-bold mt-1">✔</span>
                <div>
                  <h3 className="text-white font-serif text-[18px] mb-1">Root Directory Installation</h3>
                  <p className="text-white/60 text-[15px]">Direct deployment to <code className="text-[#C4A35A]">yourdomain.com/llms.txt</code> via cPanel File Manager, hPanel, SFTP, or WordPress admin temporary access. Guaranteed proper HTTP 200 header serving.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-white/[0.06]">
                <span className="text-[#25D366] text-[20px] font-bold mt-1">✔</span>
                <div>
                  <h3 className="text-white font-serif text-[18px] mb-1">PageSpeed Agentic Browsing Verification</h3>
                  <p className="text-white/60 text-[15px]">We test and verify that your file passes Google Lighthouse &amp; PageSpeed Agentic Browsing audits without syntax or parsing errors.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-white/[0.06]">
                <span className="text-[#25D366] text-[20px] font-bold mt-1">✔</span>
                <div>
                  <h3 className="text-white font-serif text-[18px] mb-1">Confirmation &amp; Direct Verification Link</h3>
                  <p className="text-white/60 text-[15px]">Once live, we send you your active file link and audit confirmation so you can verify it directly in your browser.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works & Intake Details */}
        <section className="py-24 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[1000px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <span className="text-[12px] font-semibold tracking-widest text-[#C4A35A] uppercase block mb-3">
                  SIMPLE 5-MINUTE INTAKE
                </span>
                <h2 className="font-serif text-[clamp(26px,3.5vw,38px)] text-white mb-6">
                  What We Need From You
                </h2>
                <p className="text-white/60 text-[15px] leading-[1.65] mb-8">
                  No complex forms or technical downloads required. Takes about 5 minutes to provide:
                </p>

                <ol className="space-y-4 text-[15px] text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-[#C4A35A] font-bold font-serif text-[18px]">1.</span>
                    <span><strong>Business Name &amp; Website URL</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C4A35A] font-bold font-serif text-[18px]">2.</span>
                    <span><strong>1–2 sentences about what you do</strong> and who you serve (in your own words).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C4A35A] font-bold font-serif text-[18px]">3.</span>
                    <span><strong>Your main website pages</strong> (Home, Services, About, Contact).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C4A35A] font-bold font-serif text-[18px]">4.</span>
                    <span><strong>Service Area / Location</strong> (or fully remote).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C4A35A] font-bold font-serif text-[18px]">5.</span>
                    <span><strong>Key credentials or certifications</strong> you want AI tools to highlight.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C4A35A] font-bold font-serif text-[18px]">6.</span>
                    <span><strong>Temporary website access</strong> (simple instructions provided).</span>
                  </li>
                </ol>
              </div>

              <div className="bg-[#141414] border border-white/[0.08] p-8 md:p-10 rounded-2xl">
                <h3 className="font-serif text-[24px] text-white mb-3">Order Directly via WhatsApp</h3>
                <p className="text-white/60 text-[14px] leading-[1.6] mb-6">
                  The fastest way to get started. Message us directly on WhatsApp, answer the 5 questions, and we will send a secure payment link and handle setup within 48 hours.
                </p>

                <a
                  href={encodedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-[#0D0D0D] py-4 rounded-sm text-[15px] font-bold uppercase tracking-[0.04em] hover:bg-[#20bd5a] transition-all duration-300 shadow-lg mb-4"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  Chat &amp; Order via WhatsApp
                </a>

                <div className="text-[12px] text-[#C4A35A] font-semibold text-center border-t border-white/[0.06] pt-4">
                  Direct contact with Naveen Gaur • Response within hours
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Form Section */}
        <section id="order-form" className="py-24 px-6 md:px-10 bg-[#0A0A0A] border-b border-white/[0.06]">
          <div className="max-w-[720px] mx-auto">
            <div className="text-center mb-12">
              <span className="text-[12px] font-semibold tracking-widest text-[#C4A35A] uppercase block mb-3">
                PREFER EMAIL OR WEB FORM?
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">
                Request Your $10 llms.txt Setup
              </h2>
              <p className="text-white/60 text-[15px]">
                Submit your website details below. We will draft your custom file and email you payment instructions and live verification details within 24 hours.
              </p>
            </div>

            <form
              action="/api/contact"
              method="POST"
              className="bg-[#141414] border border-white/[0.08] p-8 md:p-10 rounded-2xl space-y-6"
            >
              <input type="hidden" name="type" value="llms_txt_service_order" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] text-white/60 mb-2 uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full bg-[#0D0D0D] border border-white/[0.1] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-white/60 mb-2 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="w-full bg-[#0D0D0D] border border-white/[0.1] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] text-white/60 mb-2 uppercase tracking-wider">Website URL *</label>
                <input
                  type="url"
                  name="website"
                  required
                  placeholder="https://yourdomain.com"
                  className="w-full bg-[#0D0D0D] border border-white/[0.1] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] text-white/60 mb-2 uppercase tracking-wider">What does your business do? (1-2 sentences) *</label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder="e.g. We are a boutique dental practice in Austin, TX specializing in cosmetic dentistry and teeth whitening."
                  className="w-full bg-[#0D0D0D] border border-white/[0.1] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C4A35A] text-[#0D0D0D] py-4 rounded-sm text-[15px] font-bold uppercase tracking-[0.05em] hover:bg-[#d4b46a] transition-all duration-200 shadow-md"
              >
                Submit Order Request ($10)
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 md:px-10">
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white text-center mb-16">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">What is an llms.txt file?</h3>
                <p className="text-[15px] text-white/60 leading-[1.65]">
                  <code className="text-[#C4A35A]">llms.txt</code> is a clean text file uploaded to your domain root (<code className="text-[#C4A35A]">yoursite.com/llms.txt</code>) that provides AI language models (ChatGPT, Perplexity, Gemini) with a direct, machine-readable summary of your business, services, and key URLs.
                </p>
              </div>

              <div>
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">How do I grant website access?</h3>
                <p className="text-[15px] text-white/60 leading-[1.65]">
                  We provide instructions for creating a temporary WordPress administrator account or uploading via cPanel/hPanel File Manager. You do not need to share main host passwords.
                </p>
              </div>

              <div>
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">Will this affect my existing website or SEO?</h3>
                <p className="text-[15px] text-white/60 leading-[1.65]">
                  No. <code className="text-[#C4A35A]">llms.txt</code> is a standalone root text file. It does not alter your visual design, theme files, database, or Google SEO. It enhances your PageSpeed Agentic Browsing score and AI conversational search visibility.
                </p>
              </div>

              <div>
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">How fast will my file be live?</h3>
                <p className="text-[15px] text-white/60 leading-[1.65]">
                  Within 48 hours of receiving your business details and access.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
