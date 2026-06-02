import { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Custom WhatsApp Automation & CRM Development Services | Naveen Gaur",
  description:
    "Scale customer engagement, automate sales pipelines, and integrate custom AI agents into WhatsApp with absolute data sovereignty. Bespoke, database-driven workflows.",
  alternates: {
    canonical: "https://naveengaur.com/whatsapp-automation",
  },
};

export default function WhatsAppAutomationPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0D0D0D] text-white">
        {/* Hero Section */}
        <section className="pt-[160px] pb-24 px-6 md:px-10 border-b border-white/[0.06]">
          <div className="max-w-[900px] mx-auto">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              B2B Enterprise Automation
            </span>
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] tracking-[-0.025em] leading-[1.1] text-white mb-6">
              Bespoke WhatsApp Systems <br />
              <span className="text-[#C4A35A]">Integrated Directly into Your Stack</span>.
            </h1>
            <p className="text-[18px] text-white/60 max-w-[650px] leading-[1.7] font-light mb-10">
              Expose custom API gateways, automate CRM pipelines, and integrate conversational AI agents natively. Scale your messaging systems with absolute data sovereignty and predictable infrastructure models.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#audit"
                className="inline-block bg-[#C4A35A] text-[#0D0D0D] px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200"
              >
                Request an Automation Scoping Audit
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
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">Predictable Infrastructure Costs</span>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  Standard CRM wrappers charge seat subscriptions and conversation premiums that scale with your volume. A custom gateway routes traffic through your private virtual private server (VPS). While this introduces developer monitoring and hosting updates, it provides absolute predictability for high-volume message pipelines.
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">Sovereign Data Storage</span>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  For businesses with strict internal data standards, routing chat logs, patient details, or financial PDFs through external SaaS APIs creates compliance risks. Self-hosted custom setups store data natively inside your cloud perimeter (Supabase/Postgres), keeping communications fully secure.
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <span className="text-[#C4A35A] text-[20px] font-serif block mb-3">Bespoke AI Routing</span>
                <p className="text-[15px] text-white/50 leading-[1.6]">
                  Expose custom API pathways to orchestrate advanced multimodal models (such as Gemini Vision). Run multi-step logical state machines natively inside serverless endpoints to check databases and handle customer attachments without rigid SaaS template approvals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Offerings */}
        <section className="py-24 px-6 md:px-10 bg-[#141414] border-y border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white text-center mb-16">
              Custom-Built Automation Capabilities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Capability 1 */}
              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <span className="block text-[#C4A35A] text-[12px] font-medium tracking-widest uppercase mb-2">01 / INTEGRATIONS</span>
                <h3 className="text-white text-[22px] font-serif mb-4">Custom CRM Synchronization</h3>
                <p className="text-[15px] text-white/50 leading-[1.6] mb-6">
                  Natively link WhatsApp chats into HubSpot, Zoho CRM, Pipedrive, or custom internal databases. Enable automatic lead routing, deal status notifications, and real-time conversation logging natively inside lead accounts.
                </p>
                <ul className="space-y-2 text-[14px] text-white/60">
                  <li>✔ Automated Lead Creation via WhatsApp Webhook</li>
                  <li>✔ Real-time Deal Pipeline Status Messaging</li>
                  <li>✔ Two-way HubSpot & Zoho API data bridges</li>
                </ul>
              </div>

              {/* Capability 2 */}
              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <span className="block text-[#C4A35A] text-[12px] font-medium tracking-widest uppercase mb-2">02 / AI WORKFLOWS</span>
                <h3 className="text-white text-[22px] font-serif mb-4">Conversational Vision AI Agents</h3>
                <p className="text-[15px] text-white/50 leading-[1.6] mb-6">
                  Build multi-modal intelligent chat interfaces. Enable customers or students to send images, files, or audio buffers, routing them directly through custom prompt frameworks (like LLMs and document parsers) for instant processing.
                </p>
                <ul className="space-y-2 text-[14px] text-white/60">
                  <li>✔ Multimodal Homework Evaluation (LoopLearnX use case)</li>
                  <li>✔ Automated 24/7 B2B Lead Qualification Bots</li>
                  <li>✔ Calendar & Booking Integrations (Calendly, Cal.com)</li>
                </ul>
              </div>

              {/* Capability 3 */}
              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <span className="block text-[#C4A35A] text-[12px] font-medium tracking-widest uppercase mb-2">03 / TEAM SUPPORT</span>
                <h3 className="text-white text-[22px] font-serif mb-4">Shared Multi-Agent Helpdesks</h3>
                <p className="text-[15px] text-white/50 leading-[1.6] mb-6">
                  Bypass standard linked device limitations. Expose custom, web-based collaborative inboxes allowing support agents to concurrently handle customer chats under a single sending number, with advanced internal notes and tags.
                </p>
                <ul className="space-y-2 text-[14px] text-white/60">
                  <li>✔ Dynamic agent assignment algorithms</li>
                  <li>✔ Internal team tagging and collaborative channels</li>
                  <li>✔ Comprehensive support ticket response analytics</li>
                </ul>
              </div>

              {/* Capability 4 */}
              <div className="bg-[#0D0D0D] border border-white/[0.06] p-8 rounded-xl">
                <span className="block text-[#C4A35A] text-[12px] font-medium tracking-widest uppercase mb-2">04 / BROADCASTING</span>
                <h3 className="text-white text-[22px] font-serif mb-4">Anti-Ban Marketing Engines</h3>
                <p className="text-[15px] text-white/50 leading-[1.6] mb-6">
                  Securely send automated newsletters, promotional alerts, or transactional notifications inside groups, channels, or personal feeds utilizing custom rate-limiting queues and realistic human latency engines.
                </p>
                <ul className="space-y-2 text-[14px] text-white/60">
                  <li>✔ Dynamic queue scheduling with `p-queue`</li>
                  <li>✔ Unencrypted Channel/Newsletter Media Bug Patches</li>
                  <li>✔ Automated Recipient Unsubscribe (STOP) logic</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Case Study (LoopLearnX) */}
        <section id="case-studies" className="py-24 px-6 md:px-10">
          <div className="max-w-[900px] mx-auto">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
              Featured Deployment Case Study
            </span>
            <h2 className="font-serif text-[clamp(28px,4vw,42px)] leading-[1.2] text-white mb-6">
              LoopLearnX: Evaluating Student Notebook Homework Natively Over WhatsApp
            </h2>
            <div className="border-l-2 border-[#C4A35A] pl-6 my-8 text-white/70 italic text-[17px] leading-[1.7]">
              "Instead of forcing high school students to log into complex desktop portals to upload their written homework, we brought our education engine straight into their pockets. Students take a photo of their notebook pages, text it, and receive immediate AI grading over WhatsApp."
            </div>
            <p className="text-[16px] text-white/60 leading-[1.8] mb-6">
              To make this operation fast, secure, and reliable, we deployed a **two-tier architecture**. A lightweight Node.js gateway handles multi-file WhatsApp socket states on an Ubuntu VPS, while a serverless Next.js middleware routes the image buffer directly to the Gemini Vision API and logs the evaluation scores inside a Supabase Postgres database.
            </p>
            <p className="text-[16px] text-[#C4A35A] font-medium">
              → Result: Homework submissions moved entirely inside WhatsApp, significantly reducing user friction and dropping message routing costs to flat cloud VPS rates.
            </p>
          </div>
        </section>

        {/* Free Audit Form */}
        <section id="audit" className="py-24 px-6 md:px-10 border-t border-white/[0.06] bg-[#0A0A0A]">
          <div className="max-w-[700px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-4">
                Get Your Free WhatsApp Automation Scoping Audit
              </h2>
              <p className="text-white/50 text-[16px]">
                I will analyze your current workflows, outline custom CRM integration options, assess security boundaries, and evaluate technical maintenance risks for your custom messaging pipelines.
              </p>
            </div>

            <form
              action="/api/contact"
              method="POST"
              className="bg-[#141414] border border-white/[0.06] p-8 md:p-10 rounded-xl space-y-6"
            >
              <input type="hidden" name="type" value="whatsapp_automation_inquiry" />
              
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

              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Estimated Monthly WhatsApp Messages</label>
                <select 
                  name="volume"
                  className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors appearance-none"
                >
                  <option value="Under 1,000">Under 1,000</option>
                  <option value="1,000 - 10,000">1,000 - 10,000</option>
                  <option value="10,000 - 50,000">10,000 - 50,000</option>
                  <option value="50,000+">50,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Describe Your Target Workflow / Integration Idea</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="e.g. We want to route incoming customer photo inquiries directly to our HubSpot contacts and alert agents..."
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
