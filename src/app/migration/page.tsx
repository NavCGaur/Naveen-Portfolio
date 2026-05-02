import { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "WordPress Migration Service | Seamless, Zero-Downtime Transfers",
  description:
    "Need to transfer your WordPress site to a new host? I provide stress-free, zero-downtime WordPress migrations with complete data integrity and performance tuning.",
  alternates: {
    canonical: "https://naveengaur.com/migration",
  },
};

export default function MigrationPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0D0D0D]">
        {/* Hero Section */}
        <section className="pt-[160px] pb-24 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[900px] mx-auto">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              Emergency & Scheduled Transfers
            </span>
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] tracking-[-0.025em] leading-[1.1] text-white mb-6">
              Transfer your WordPress site without breaking it.
            </h1>
            <p className="text-[18px] text-white/60 max-w-[600px] leading-[1.7] font-light mb-10">
              Moving hosts shouldn't mean downtime, lost data, or broken links. 
              Get a secure, zero-downtime WordPress migration handled by a professional.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-block bg-[#C4A35A] text-[#0D0D0D] px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200"
              >
                Get a Migration Quote
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
                  Why automated migration plugins fail.
                </h2>
                <p className="text-[17px] text-white/55 leading-[1.7] mb-6">
                  One-click migration plugins work great for tiny blogs. But if you run WooCommerce, have a massive database, or rely on complex caching, automated tools often time out, corrupt data, or leave your site stuck in maintenance mode.
                </p>
                <p className="text-[17px] text-white/55 leading-[1.7]">
                  I perform manual, server-level migrations to guarantee every byte of your database, media library, and SEO structure transfers perfectly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Feature 1 */}
                <div className="border-t border-white/[0.08] pt-6">
                  <span className="block text-[#C4A35A] text-[13px] font-medium tracking-wider mb-3">01</span>
                  <h3 className="text-white text-[18px] font-medium mb-3">Zero Downtime</h3>
                  <p className="text-[14px] text-white/50 leading-[1.6]">
                    Your current site stays live while I build and test the new server. DNS is only flipped when the new environment is 100% verified.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="border-t border-white/[0.08] pt-6">
                  <span className="block text-[#C4A35A] text-[13px] font-medium tracking-wider mb-3">02</span>
                  <h3 className="text-white text-[18px] font-medium mb-3">SEO Preservation</h3>
                  <p className="text-[14px] text-white/50 leading-[1.6]">
                    URLs, permalinks, and metadata are maintained precisely. Moving hosts will not cost you your Google rankings.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="border-t border-white/[0.08] pt-6">
                  <span className="block text-[#C4A35A] text-[13px] font-medium tracking-wider mb-3">03</span>
                  <h3 className="text-white text-[18px] font-medium mb-3">WooCommerce Safe</h3>
                  <p className="text-[14px] text-white/50 leading-[1.6]">
                    Live stores require database syncing right before the DNS flip to ensure no orders or customer accounts are lost in transit.
                  </p>
                </div>
                {/* Feature 4 */}
                <div className="border-t border-white/[0.08] pt-6">
                  <span className="block text-[#C4A35A] text-[13px] font-medium tracking-wider mb-3">04</span>
                  <h3 className="text-white text-[18px] font-medium mb-3">Post-Move Cleanup</h3>
                  <p className="text-[14px] text-white/50 leading-[1.6]">
                    I don't just move the site; I fix path issues, update core files, and implement basic performance tuning on the new server.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-24 px-6 md:px-10 bg-[#141414] border-t border-white/[0.06]">
          <div className="max-w-[700px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">Request a Migration</h2>
              <p className="text-white/50 text-[16px] max-w-[500px] mx-auto">
                Tell me where your site is now, where it's going, and if you are currently experiencing any downtime.
              </p>
            </div>

            <form
              action="/api/contact"
              method="POST"
              className="bg-[#0D0D0D] border border-white/[0.06] p-8 md:p-10 rounded-xl space-y-6"
            >
              <input type="hidden" name="type" value="migration_request" />
              
              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Website URL</label>
                <input
                  type="url"
                  name="url"
                  required
                  placeholder="https://"
                  className="w-full bg-[#141414] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Current Host</label>
                  <input
                    type="text"
                    name="current_host"
                    placeholder="e.g., GoDaddy, Bluehost"
                    className="w-full bg-[#141414] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">New Host</label>
                  <input
                    type="text"
                    name="new_host"
                    placeholder="e.g., Kinsta, WP Engine"
                    className="w-full bg-[#141414] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Your Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-[#141414] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Is this an emergency? (Site currently down?)</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-[#141414] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C4A35A] text-[#0D0D0D] py-4 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200 mt-4"
              >
                Get a Secure Transfer
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
