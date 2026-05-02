"use client";

import { useState } from "react";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export default function FreeAuditPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const website = formData.get("url") as string;
    const business = formData.get("business") as string;
    const frustration = formData.get("frustration") as string;

    // Combine into the message field for the existing API schema
    const message = `[VIDEO AUDIT REQUEST]
    
BUSINESS TYPE:
${business}

BIGGEST FRUSTRATION:
${frustration}`;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website, message }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0D0D0D]">
        <section className="pt-[160px] pb-24 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left Column: Copy */}
            <div>
              <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-4">
                Personalized Video Teardown
              </span>
              <h1 className="font-serif text-[clamp(36px,5vw,56px)] tracking-[-0.025em] leading-[1.1] text-white mb-6">
                Stop guessing why your site is slow or losing leads.
              </h1>
              <p className="text-[17px] text-white/60 leading-[1.7] font-light mb-8">
                Generic audit tools give you useless scores like "68/100." I give you a brutal, 5-minute Loom video where a real human developer looks under the hood of your site.
              </p>
              
              <ul className="space-y-6 mb-10">
                <li className="flex gap-4 items-start">
                  <span className="text-[#C4A35A] text-[20px] leading-none mt-1">▹</span>
                  <div>
                    <h3 className="text-white text-[16px] font-medium mb-1">Performance Reality Check</h3>
                    <p className="text-[14px] text-white/50 leading-[1.6]">I'll show you exactly which plugins or bloated scripts are killing your conversion rate.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-[#C4A35A] text-[20px] leading-none mt-1">▹</span>
                  <div>
                    <h3 className="text-white text-[16px] font-medium mb-1">UX & Conversion Blocks</h3>
                    <p className="text-[14px] text-white/50 leading-[1.6]">I'll identify the friction points causing visitors to bounce instead of buying.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-[#C4A35A] text-[20px] leading-none mt-1">▹</span>
                  <div>
                    <h3 className="text-white text-[16px] font-medium mb-1">3 Actionable Fixes</h3>
                    <p className="text-[14px] text-white/50 leading-[1.6]">You walk away with a specific list of 3 things you can fix today. No obligations.</p>
                  </div>
                </li>
              </ul>
              
              <p className="text-[14px] text-white/40 italic">
                * Note: I record these manually. To ensure I can deliver high quality, I only accept requests from serious businesses facing actual technical problems.
              </p>
            </div>

            {/* Right Column: Form */}
            <div className="bg-[#141414] border border-white/[0.06] p-8 md:p-10 rounded-xl h-fit">
              <h2 className="text-white text-[22px] font-medium mb-6">Request Your Audit</h2>
              
              {status === "success" ? (
                <div className="bg-green-900/20 border border-green-500/30 rounded-sm p-6 text-center">
                  <h3 className="text-green-400 font-medium mb-2">Request Received</h3>
                  <p className="text-[14px] text-white/60">
                    Appreciate your request! if it’s a match, you’ll get a personalized Loom video in your inbox soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">First Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Work Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">Website URL *</label>
                    <input
                      type="url"
                      name="url"
                      required
                      placeholder="https://"
                      className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">What does your business actually do? *</label>
                    <input
                      type="text"
                      name="business"
                      required
                      placeholder="e.g., We sell custom furniture in Ohio."
                      className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] text-white/60 mb-2 uppercase tracking-wide">What is your biggest frustration with the site right now? *</label>
                    <textarea
                      name="frustration"
                      required
                      rows={3}
                      placeholder="e.g., WooCommerce checkout is too slow, or I'm losing traffic."
                      className="w-full bg-[#0D0D0D] border border-white/[0.08] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#C4A35A] transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#C4A35A] text-[#0D0D0D] py-4 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Submitting..." : "Get My Video Audit"}
                  </button>

                  {status === "error" && (
                    <p className="text-red-400 text-[13px] text-center mt-4">
                      Something went wrong. Please try again or email me directly.
                    </p>
                  )}
                </form>
              )}
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
