import { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Professional WordPress Maintenance Retainers & Support | Naveen Gaur",
  description:
    "Proactive, human-monitored WordPress maintenance packages. Supervised updates in staging, secure off-site backups, 24/7 speed, security, and uptime auditing.",
  alternates: {
    canonical: "https://naveengaur.com/wordpress-maintenance",
  },
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function WordPressMaintenancePage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0D0D0D] text-white">
        {/* Hero Section */}
        <section className="pt-[160px] pb-24 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[900px] mx-auto">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              Website Care & Support Services
            </span>
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] tracking-[-0.025em] leading-[1.1] text-white mb-6">
              Proactive WordPress Support <br />
              <span className="text-[#C4A35A]">Stops Fires Before They Start</span>.
            </h1>
            <p className="text-[18px] text-white/60 max-w-[650px] leading-[1.7] font-light mb-10">
              Stop treating your WordPress site reactively. Secure a dedicated developer retainer to handle supervised updates, off-site backups, and real-time security anomalies with zero auto-update breakage.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#audit"
                className="inline-block bg-[#C4A35A] text-[#0D0D0D] px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200"
              >
                Get Started
              </a>
              <a
                href="#pricing"
                className="inline-block border border-white/20 text-white px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-white/5 transition-colors duration-200"
              >
                View Packages & Pricing
              </a>
            </div>
          </div>
        </section>

        {/* Core Benefits */}
        <section className="py-24 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="border-t border-white/[0.08] pt-6">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">Supervised Staging Updates</span>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  Automatic updates break sites when conflicts arise between themes and databases. I test every update in a dedicated staging environment first, verifying visual layouts and checkout flows before pushing changes live.
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">Secure Off-Site Backups</span>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  A host failure or hack can delete years of data. My retainers run automated off-site backups to an independent secure cloud container with 30-day retention, guaranteeing quick recovery if an emergency occurs.
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">Real-time AI-Native Auditing</span>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  Traditional plugins miss speed regressions and silent server faults. I use custom tracking scripts to analyze Google Core Web Vitals, server response latencies, and security vulnerabilities 24/7.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table Section */}
        <section id="pricing" className="py-24 px-6 md:px-10 bg-[#141414] border-y border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white text-center mb-4">
              Flexible Website Retainer Packages
            </h2>
            <p className="text-white/50 text-[16px] text-center max-w-[550px] mx-auto mb-16">
              Cancel or change plans at any time with a single email. No long-term commitments, no agency overhead.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
              {/* Professional Plan */}
              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 md:p-10 rounded-xl relative flex flex-col justify-between">
                <div>
                  <span className="block text-[#C4A35A] text-[12px] font-medium tracking-widest uppercase mb-2">01 / PROFESSIONAL CARE</span>
                  <h3 className="text-white text-[28px] font-serif mb-2">Professional Plan</h3>
                  <p className="text-white/40 text-[14px] mb-6">Best for small business sites where stability is the priority.</p>
                  
                  <div className="text-[44px] font-serif text-white mb-6">
                    $49<span className="text-[15px] text-white/50">/month</span>
                  </div>

                  <ul className="space-y-3 text-[14px] text-white/60 mb-8 border-t border-white/[0.06] pt-6">
                    <li>✔ **Supervised Updates:** Tested in staging before deploy</li>
                    <li>✔ **AI-Native Monitoring:** Real-time speed & security</li>
                    <li>✔ **Weekly Off-site Backups:** 30-day retention</li>
                    <li>✔ **No-Hack Guarantee:** Free malware cleanup if compromised</li>
                    <li>✔ **Executive Health Report:** Monthly status email</li>
                  </ul>
                </div>

                <a
                  href="#audit"
                  className="w-full text-center block border border-white/20 text-white py-3 rounded-sm text-[14px] font-medium hover:bg-white/5 transition-colors duration-200"
                >
                  Choose Professional
                </a>
              </div>

              {/* Expert Consulting Plan */}
              <div className="bg-[#0D0D0D] border border-[#C4A35A]/40 p-8 md:p-10 rounded-xl relative flex flex-col justify-between shadow-[0_10px_30px_rgba(196,163,90,0.05)]">
                <span className="absolute top-4 right-4 bg-[#C4A35A]/10 border border-[#C4A35A]/20 text-[#C4A35A] text-[10px] font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-sm">
                  Recommended
                </span>
                <div>
                  <span className="block text-[#C4A35A] text-[12px] font-medium tracking-widest uppercase mb-2">02 / ADVANCED PROACTIVE</span>
                  <h3 className="text-white text-[28px] font-serif mb-2">Expert Consulting</h3>
                  <p className="text-white/40 text-[14px] mb-6">Best for WooCommerce and high-traffic marketing sites.</p>

                  <div className="text-[44px] font-serif text-white mb-6">
                    $149<span className="text-[15px] text-white/50">/month</span>
                  </div>

                  <ul className="space-y-3 text-[14px] text-white/60 mb-8 border-t border-white/[0.06] pt-6">
                    <li>✔ **Everything in Professional Plan**</li>
                    <li>✔ **Priority 12-Hour SLA:** Move to front of queue</li>
                    <li>✔ **1 Hour of Custom Dev:** Small tweaks or code revisions</li>
                    <li>✔ **Core Web Vitals Optimization:** Speed tweaks</li>
                    <li>✔ **SEO Health Guard:** Broken links & crawl monitoring</li>
                    <li>✔ **Real-time Backups:** Save changes as they happen</li>
                  </ul>
                </div>

                <a
                  href="#audit"
                  className="w-full text-center block bg-[#C4A35A] text-[#0D0D0D] py-3 rounded-sm text-[14px] font-medium hover:bg-[#d4b46a] transition-colors duration-200"
                >
                  Choose Expert Care
                </a>
              </div>
            </div>
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
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">Is there a long-term contract?</h3>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  No. All maintenance retainers run on a month-to-month basis. You can cancel or switch tiers at any time with a single email request.
                </p>
              </div>

              <div>
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">What if my site is already hacked or broken?</h3>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  Retainers cover ongoing, proactive maintenance. If your site requires active repair before onboarding, I offer a one-time Emergency recovery package. Once the site is cleaned and stabilized, we can transfer it to a monthly plan.
                </p>
              </div>

              <div>
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">Do you support WooCommerce?</h3>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  Yes. For e-commerce stores, I recommend the **Expert Plan** to ensure real-time backups of order databases, continuous checkout flow validation, and payment API checks.
                </p>
              </div>

              <div>
                <h3 className="text-[18px] text-[#C4A35A] font-serif mb-2">Why choose you over standard managed hosting care?</h3>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  Hosting companies manage servers, not applications. Their support teams run automated scripts that frequently miss silent errors or plugin mismatches. I provide human oversight and AI-native checks to resolve issues before they affect visitors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Free Audit Form */}
        <section id="audit" className="py-24 px-6 md:px-10 border-t border-white/[0.06] bg-[#0A0A0A]">
          <div className="max-w-[700px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">
                Secure Your WordPress Retainer
              </h2>
              <p className="text-white/50 text-[16px]">
                Enter your site information below. I will run a free initial speed and security audit of your site and reach out within 24 hours to set up your care environment.
              </p>
            </div>

            {status === "success" && (
              <div className="bg-[#C4A35A]/10 border border-[#C4A35A]/30 text-[#C4A35A] rounded-sm p-5 mb-8 text-center text-[15px]">
                ✔ <strong>Scoping audit request received successfully!</strong> I will run an initial speed and security assessment of your site and contact you at your email address within 24 hours.
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-sm p-5 mb-8 text-center text-[15px]">
                ❌ <strong>Error submitting request.</strong> Please verify your email address and website URL, or reach out directly via WhatsApp.
              </div>
            )}

            <form
              action="/api/contact"
              method="POST"
              className="bg-[#141414] border border-white/[0.06] p-8 md:p-10 rounded-xl space-y-6"
            >
              <input type="hidden" name="type" value="wordpress_maintenance_inquiry" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    required
                    placeholder="https://yourdomain.com"
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Current Web Host</label>
                  <input
                    type="text"
                    name="host"
                    placeholder="e.g. Siteground, Kinsta, Hostinger"
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Estimated Monthly Pageviews</label>
                <select 
                  name="traffic"
                  className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors appearance-none"
                >
                  <option value="Under 10,000">Under 10,000</option>
                  <option value="10,000 - 50,000">10,000 - 50,000</option>
                  <option value="50,000 - 200,000">50,000 - 200,000</option>
                  <option value="200,000+">200,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Tell me about your site (WooCommerce? Target goals? Main worries?)</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="e.g. We have a WooCommerce store with 1,500 products. We want to improve our checkout load speed and ensure zero database loss..."
                  className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C4A35A] text-[#0D0D0D] py-4 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200 mt-4"
              >
                Request Scoping Audit
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
