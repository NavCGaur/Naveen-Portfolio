import { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "White-Label WordPress Developer for Agencies | Naveen Gaur",
  description:
    "Reliable, white-label WordPress development for design and marketing agencies. Strict NDAs, predictable SLAs, and invisible integration into your workflow.",
  alternates: {
    canonical: "https://naveengaur.com/agency",
  },
};

export default function AgencyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0D0D0D]">
        {/* Hero Section */}
        <section className="pt-[160px] pb-24 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[900px] mx-auto">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              Agency Partnerships
            </span>
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] tracking-[-0.025em] leading-[1.1] text-white mb-6">
              The silent technical extension of your agency.
            </h1>
            <p className="text-[18px] text-white/60 max-w-[600px] leading-[1.7] font-light mb-10">
              You design. You sell. I build. <br />
              Reliable, invisible WordPress development for agencies that need to scale without the overhead of full-time engineering hires.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#apply"
                className="inline-block bg-[#C4A35A] text-[#0D0D0D] px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200"
              >
                Apply for Partnership
              </a>
            </div>
          </div>
        </section>

        {/* Value Prop Section */}
        <section className="py-24 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
              <div>
                <h2 className="font-serif text-[clamp(28px,4vw,42px)] leading-[1.2] text-white mb-6">
                  Protecting your client relationships is my primary metric.
                </h2>
                <p className="text-[17px] text-white/55 leading-[1.7] mb-6">
                  Agencies don't just need code; they need risk management. When you hand a project to a freelancer, your reputation is on the line. I operate under the assumption that a technical failure on my end is a business failure on yours.
                </p>
                <p className="text-[17px] text-white/55 leading-[1.7]">
                  My process is built entirely around reliability, predictable communication, and absolute invisibility to your end client.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Feature 1 */}
                <div className="border-t border-white/[0.08] pt-6">
                  <span className="block text-[#C4A35A] text-[13px] font-medium tracking-wider mb-3">01 / Invisible</span>
                  <h3 className="text-white text-[18px] font-medium mb-3">100% White-Label</h3>
                  <p className="text-[14px] text-white/50 leading-[1.6]">
                    Strict NDAs signed before day one. No portfolio usage without permission. Code commits and staging environments reflect your brand, not mine.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="border-t border-white/[0.08] pt-6">
                  <span className="block text-[#C4A35A] text-[13px] font-medium tracking-wider mb-3">02 / Predictable</span>
                  <h3 className="text-white text-[18px] font-medium mb-3">Guaranteed SLAs</h3>
                  <p className="text-[14px] text-white/50 leading-[1.6]">
                    No guessing when things will be done. We establish clear turnaround times for builds, revisions, and maintenance requests upfront.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="border-t border-white/[0.08] pt-6">
                  <span className="block text-[#C4A35A] text-[13px] font-medium tracking-wider mb-3">03 / Integrated</span>
                  <h3 className="text-white text-[18px] font-medium mb-3">Your Workflow</h3>
                  <p className="text-[14px] text-white/50 leading-[1.6]">
                    I integrate directly into your Slack, Asana, Jira, or Trello. I adapt to your SOPs so your project managers don't have to learn a new system.
                  </p>
                </div>
                {/* Feature 4 */}
                <div className="border-t border-white/[0.08] pt-6">
                  <span className="block text-[#C4A35A] text-[13px] font-medium tracking-wider mb-3">04 / Scalable</span>
                  <h3 className="text-white text-[18px] font-medium mb-3">Wholesale Pricing</h3>
                  <p className="text-[14px] text-white/50 leading-[1.6]">
                    Retainer models with predictable blocks of hours, allowing you to easily mark up services and maintain healthy agency margins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-6 md:px-10 bg-[#141414] border-y border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">Capabilities</h2>
              <p className="text-white/50 text-[16px]">What you can confidently say "Yes" to selling.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <h3 className="text-white text-[18px] font-medium mb-4">Figma to WordPress</h3>
                <ul className="space-y-3">
                  <li className="text-[14px] text-white/50 flex items-start gap-2">
                    <span className="text-[#C4A35A] mt-0.5">▹</span> Pixel-perfect translation
                  </li>
                  <li className="text-[14px] text-white/50 flex items-start gap-2">
                    <span className="text-[#C4A35A] mt-0.5">▹</span> Custom Gutenberg Blocks
                  </li>
                  <li className="text-[14px] text-white/50 flex items-start gap-2">
                    <span className="text-[#C4A35A] mt-0.5">▹</span> Advanced Custom Fields (ACF)
                  </li>
                </ul>
              </div>

              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <h3 className="text-white text-[18px] font-medium mb-4">Complex eCommerce</h3>
                <ul className="space-y-3">
                  <li className="text-[14px] text-white/50 flex items-start gap-2">
                    <span className="text-[#C4A35A] mt-0.5">▹</span> WooCommerce scaling
                  </li>
                  <li className="text-[14px] text-white/50 flex items-start gap-2">
                    <span className="text-[#C4A35A] mt-0.5">▹</span> Custom checkout flows
                  </li>
                  <li className="text-[14px] text-white/50 flex items-start gap-2">
                    <span className="text-[#C4A35A] mt-0.5">▹</span> Subscription & Membership setups
                  </li>
                </ul>
              </div>

              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <h3 className="text-white text-[18px] font-medium mb-4">Performance & Security</h3>
                <ul className="space-y-3">
                  <li className="text-[14px] text-white/50 flex items-start gap-2">
                    <span className="text-[#C4A35A] mt-0.5">▹</span> Core Web Vitals optimization
                  </li>
                  <li className="text-[14px] text-white/50 flex items-start gap-2">
                    <span className="text-[#C4A35A] mt-0.5">▹</span> High-traffic database tuning
                  </li>
                  <li className="text-[14px] text-white/50 flex items-start gap-2">
                    <span className="text-[#C4A35A] mt-0.5">▹</span> Ongoing maintenance retainers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply" className="py-24 px-6 md:px-10">
          <div className="max-w-[700px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">Partner Inquiry</h2>
              <p className="text-white/50 text-[16px] max-w-[500px] mx-auto">
                I take on a maximum of 3-5 active agency partners at a time to ensure SLA compliance. Fill out the form below to initiate an exploratory call.
              </p>
            </div>

            <form
              action="/api/contact"
              method="POST"
              className="bg-[#141414] border border-white/[0.06] p-8 md:p-10 rounded-xl space-y-6"
            >
              <input type="hidden" name="type" value="agency_inquiry" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Agency Name</label>
                  <input
                    type="text"
                    name="agency"
                    required
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Your Name & Role</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
              </div>

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
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Average Monthly WordPress Volume</label>
                <select 
                  name="volume"
                  className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors appearance-none"
                >
                  <option value="1-2 projects/mo">1-2 projects/mo</option>
                  <option value="3-5 projects/mo">3-5 projects/mo</option>
                  <option value="5+ projects/mo">5+ projects/mo</option>
                  <option value="Just looking for emergency overflow">Just looking for emergency overflow</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Biggest Current Technical Bottleneck</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C4A35A] text-[#0D0D0D] py-4 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200 mt-4"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
