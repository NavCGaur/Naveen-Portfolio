import { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Bespoke Web Hosting Automation & CRM Provisioning Services | Naveen Gaur",
  description:
    "Scale web hosting brands, automate server provisioning (FlyWP, cPanel, Enhance), and eliminate legacy WHMCS licensing taxes. Bulletproof data-safe infrastructures.",
  alternates: {
    canonical: "https://naveengaur.com/hosting-automation",
  },
};

export default function HostingAutomationPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0D0D0D] text-white">
        {/* Hero Section */}
        <section className="pt-[160px] pb-24 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[900px] mx-auto">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              B2B Infrastructure Orchestration
            </span>
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] tracking-[-0.025em] leading-[1.1] text-white mb-6">
              Automated Server Provisioning <br />
              <span className="text-[#C4A35A]">Without the Legacy SaaS Licensing Tax</span>.
            </h1>
            <p className="text-[18px] text-white/60 max-w-[650px] leading-[1.7] font-light mb-10">
              Decouple your hosting engines from bloated billing panels. Build beautiful, modern client areas, automate domain registrations, and orchestrate server REST APIs with absolute database sovereignty and zero-data-loss billing controls.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#audit"
                className="inline-block bg-[#C4A35A] text-[#0D0D0D] px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200"
              >
                Request a Hosting Automation Scoping Audit
              </a>
              <a
                href="#case-studies"
                className="inline-block border border-white/20 text-white px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-white/5 transition-colors duration-200"
              >
                View Case Studies
              </a>
            </div>
          </div>
        </section>

        {/* Business Benefits Section */}
        <section className="py-24 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="border-t border-white/[0.08] pt-6">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">Flat Operating Cost Models</span>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  Legacy panels charge monthly subscription licensing fees *per installation*, severely penalizing hosting providers who scale across multiple niche brands. Transitioning to headless serverless architectures (Next.js + Stripe Billing) drops software license taxes to $0, restoring your business margins.
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">Strangler Fig Migrations</span>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  Ripping out a billing core is historically high-risk. We deploy the **Strangler Fig Pattern**, building modern client UIs and checkout engines around your active legacy system, capturing new users instantly while migrating legacy datasets with absolutely zero customer downtime.
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">Bulletproof Data Preservation</span>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  Standard panel integrations automatically trigger destructive deletion routines upon billing expiration. Our custom billing workflows isolate transaction triggers from server files, utilizing billing-aware soft-suspensions that protect client database tables from accidental unrecoverable data loss.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Offerings */}
        <section className="py-24 px-6 md:px-10 bg-[#141414] border-y border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white text-center mb-16">
              Custom-Built Hosting Automation Capabilities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Capability 1 */}
              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <span className="block text-[#C4A35A] text-[12px] font-medium tracking-widest uppercase mb-2">01 / INTEGRATIONS</span>
                <h3 className="text-white text-[22px] font-serif mb-4">Server API Provisioning Orchestrators</h3>
                <p className="text-[15px] text-white/50 leading-[1.6] mb-6">
                  Natively link your billing databases to dynamic WordPress and server orchestration APIs (such as FlyWP, Enhance, or cPanel/WHM panels). Automate server setups, database creations, and secure credentials management cleanly via background worker queues.
                </p>
                <ul className="space-y-2 text-[14px] text-white/60">
                  <li>✔ Automated site creation on Vercel, Netlify, or FlyWP</li>
                  <li>✔ Decoupled webhook state queues (Supabase / Postgres)</li>
                  <li>✔ Multi-server provisioning engines (Enhance, cPanel/WHM)</li>
                </ul>
              </div>

              {/* Capability 2 */}
              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <span className="block text-[#C4A35A] text-[12px] font-medium tracking-widest uppercase mb-2">02 / CLIENT EXPERIENCE</span>
                <h3 className="text-white text-[22px] font-serif mb-4">Custom Next.js & React Client Portals</h3>
                <p className="text-[15px] text-white/50 leading-[1.6] mb-6">
                  Replace dated, clunky user interfaces with a world-class portal that matches modern SaaS experiences. Enable SSO magic links straight to server administrators, expose DNS configurations, and aggregate support tickers in a high-performance custom application.
                </p>
                <ul className="space-y-2 text-[14px] text-white/60">
                  <li>✔ Single Sign-On (SSO) magic links directly to wp-admin</li>
                  <li>✔ Bespoke multi-brand branding architectures</li>
                  <li>✔ Integrated dynamic support and Slack alert triggers</li>
                </ul>
              </div>

              {/* Capability 3 */}
              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <span className="block text-[#C4A35A] text-[12px] font-medium tracking-widest uppercase mb-2">03 / DOMAINS & DNS</span>
                <h3 className="text-white text-[22px] font-serif mb-4">Registrar & DNS Automations</h3>
                <p className="text-[15px] text-white/50 leading-[1.6] mb-6">
                  Bind domain lookups directly to your checkout forms. Programmatically search registrars (NameSilo, Cloudflare, Enom), execute domain registers or transfers, and manage Cloudflare DNS configurations natively behind custom proxies.
                </p>
                <ul className="space-y-2 text-[14px] text-white/60">
                  <li>✔ Dynamic domain availability endpoints (checkRegisterAvailability)</li>
                  <li>✔ Asynchronous Global DNS propagation polling hooks</li>
                  <li>✔ Let's Encrypt SSL race condition error handlers</li>
                </ul>
              </div>

              {/* Capability 4 */}
              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <span className="block text-[#C4A35A] text-[12px] font-medium tracking-widest uppercase mb-2">04 / DISASTER RECOVERY</span>
                <h3 className="text-white text-[22px] font-serif mb-4">Automated Off-Site Backups (Wasabi S3)</h3>
                <p className="text-[15px] text-white/50 leading-[1.6] mb-6">
                  Isolate your client backups completely from your server host environment. Build secure, scheduled cron jobs that archive databases and media folders, routing them directly to redundant cloud storage vaults (such as Wasabi S3 or AWS).
                </p>
                <ul className="space-y-2 text-[14px] text-white/60">
                  <li>✔ Encrypted off-site database & file snapshots</li>
                  <li>✔ Scheduled shell automation cron scripting</li>
                  <li>✔ Secure multi-bucket redundancy pipelines</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Case Study (Brianna Coyle / WHMCS off-site migration) */}
        <section id="case-studies" className="py-24 px-6 md:px-10">
          <div className="max-w-[900px] mx-auto">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              Featured Infrastructure Case Study
            </span>
            <h2 className="font-serif text-[clamp(28px,4vw,42px)] leading-[1.2] text-white mb-6">
              WHMCS Decoupling: Scaling Multi-Brand Hosting with Zero License Penalties
            </h2>
            <div className="border-l-2 border-[#C4A35A] pl-6 my-8 text-white/70 italic text-[17px] leading-[1.7]">
              "Instead of being trapped in outdated WHMCS layouts and penalized ~$35/month per active installation for running multiple niche hosting brands (Crimson Red and CloudComb), we decoupled the provisioning engine. Client dashboards were moved to a modern React portal connecting to direct Stripe webhook queues and FlyWP APIs, dropping recurring license software costs to flat cloud VPS rates."
            </div>
            <p className="text-[16px] text-white/60 leading-[1.8] mb-6">
              To make this operation resilient, we engineered an **asynchronous database state queue**. Checkouts return an immediate 90ms payment confirmation to Vercel and log the payload, allowing a background worker to poll registrars, verify global nameserver propagation, deploy server containers, and route automated credentials securely without triggering synchronous web timeouts or Let's Encrypt SSL mismatches.
            </p>
            <p className="text-[16px] text-[#C4A35A] font-medium">
              → Result: Legacy licensing fees permanently bypassed, custom Vercel-like client dashboards deployed, and automated soft-suspension routines implemented to ensure client data is fully secure.
            </p>
          </div>
        </section>

        {/* Free Audit Form */}
        <section id="audit" className="py-24 px-6 md:px-10 border-t border-white/[0.06] bg-[#0A0A0A]">
          <div className="max-w-[700px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">
                Request a Web Hosting Automation Scoping Audit
              </h2>
              <p className="text-white/50 text-[16px]">
                I will analyze your current server architecture, assess API endpoint compatibility, review your billing software bottlenecks, and map out a zero-downtime path to drop licensing taxes and automate your provisioning.
              </p>
            </div>

            <form
              action="/api/contact"
              method="POST"
              className="bg-[#141414] border border-white/[0.06] p-8 md:p-10 rounded-xl space-y-6"
            >
              <input type="hidden" name="type" value="hosting_automation_inquiry" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    required
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

              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Work Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Active Billing Engine</label>
                  <select 
                    name="billing_engine"
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors appearance-none"
                  >
                    <option value="WHMCS">WHMCS</option>
                    <option value="Blesta">Blesta</option>
                    <option value="WooCommerce">WooCommerce</option>
                    <option value="Custom Stripe / SaaS">Custom Stripe / SaaS</option>
                    <option value="Other">Other / None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Active Server Panel</label>
                  <select 
                    name="server_panel"
                    className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors appearance-none"
                  >
                    <option value="FlyWP">FlyWP</option>
                    <option value="Enhance">Enhance Panel</option>
                    <option value="cPanel / WHM">cPanel / WHM</option>
                    <option value="RunCloud / GridPane">RunCloud / GridPane</option>
                    <option value="Other / API Custom">Other / API Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Describe Your Target Workflow / Automation Idea</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="e.g. We want to bypass WHMCS and connect custom Stripe Checkout events directly to our Enhance VPS server panels asynchronously..."
                  className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C4A35A] text-[#0D0D0D] py-4 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200 mt-4"
              >
                Request Hosting Automation Audit
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
