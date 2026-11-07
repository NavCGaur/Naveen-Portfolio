"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import * as ga from "@/lib/ga";

const agencySchema = z.object({
  agency: z.string().min(2, "Agency name must be at least 2 characters"),
  name: z.string().min(2, "Your name & role must be at least 2 characters"),
  email: z.string().email("Please enter a valid work email"),
  website: z.string().optional(),
  volume: z.string().min(1, "Please select an estimated project volume"),
  message: z.string().min(10, "Please describe your bottleneck or needs (at least 10 characters)"),
});

type AgencyFormValues = z.infer<typeof agencySchema>;

export default function AgencyInquirySection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [hasStartedForm, setHasStartedForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AgencyFormValues>({
    resolver: zodResolver(agencySchema),
    defaultValues: {
      volume: "1-2 projects/mo",
    },
  });

  const handleFormFocus = () => {
    if (!hasStartedForm) {
      ga.event({ action: "form_start", category: "conversion", label: "Agency Partner Form" });
      setHasStartedForm(true);
    }
  };

  const onSubmit = async (data: AgencyFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    ga.event({ action: "form_submit_attempt", category: "conversion", label: "Agency Partner Form" });

    try {
      // Synchronize with /api/contact format
      const payload = {
        name: `${data.name} (${data.agency})`,
        email: data.email,
        website: data.website || undefined,
        budget: `Agency Retainer: ${data.volume}`,
        message: `Agency: ${data.agency}\nContact: ${data.name}\nEstimated Monthly Volume: ${data.volume}\nWebsite: ${data.website || "Not provided"}\n\nTechnical Bottleneck & Requirements:\n${data.message}`,
        type: "agency_inquiry",
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit inquiry");

      ga.event({ action: "generate_lead", category: "conversion", label: "Agency Partner Form Success" });
      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Agency inquiry submission error:", error);
      ga.event({ action: "form_error", category: "conversion", label: "Agency Partner Form Error" });
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Hi Naveen, I run an agency and would like to explore a white-label WordPress partnership with you."
  );
  const whatsappUrl = `https://wa.me/919920899845?text=${whatsappMessage}`;

  return (
    <section id="apply" className="py-24 px-6 md:px-10 bg-[#0A0A0A] border-t border-white/[0.06]">
      <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#C4A35A] mb-3">
            Agency Partnerships
          </span>
          <h2 className="font-serif font-bold text-[clamp(30px,4.2vw,44px)] tracking-[-0.01em] leading-[1.1] text-white mb-4 max-w-[700px] mx-auto">
            Ready to expand your agency&apos;s development capacity?
          </h2>
          <p className="text-[16.5px] text-white/70 max-w-[620px] mx-auto leading-[1.65] font-light mb-8">
            I take on a limited number of active agency partners at a time to guarantee response SLAs. Reach out below to book an exploratory scoping call or submit your requirements.
          </p>

          {/* Action Buttons: WhatsApp + Book Call */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.event({ action: "click", category: "conversion", label: "Agency WhatsApp" })}
              className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 border border-[#C4A35A] text-[#C4A35A] bg-[#C4A35A]/[0.08] px-7 py-3.5 rounded-md text-[15px] font-medium tracking-[0.03em] hover:bg-[#C4A35A] hover:text-[#0D0D0D] transition-all duration-300 shadow-md shadow-[#C4A35A]/5"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Message on WhatsApp
              </span>
            </a>

            {/* Book a Call Button */}
            <a
              href="https://cal.com/naveen-gaur/15min"
              target="_blank"
              rel="noopener noreferrer"
              data-cal-link="naveen-gaur/15min"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              onClick={() => ga.event({ action: "click", category: "conversion", label: "Agency Book a Call" })}
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white bg-white/[0.05] px-7 py-3.5 rounded-md text-[15px] font-medium tracking-[0.03em] hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              <svg className="w-5 h-5 text-[#C4A35A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Book an Exploratory Call</span>
            </a>
          </div>
        </motion.div>

        {/* Form Container + Balanced Columns */}
        <div className="grid lg:grid-cols-[60fr_40fr] gap-10 items-stretch">
          
          {/* Left: High-Contrast Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#171717] p-8 sm:p-10 rounded-xl border border-white/[0.12] shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
              <h3 className="text-[20px] font-semibold text-white">Partner Inquiry Form</h3>
              <span className="text-[12px] uppercase tracking-wider text-[#C4A35A] font-medium bg-[#C4A35A]/10 px-3 py-1 rounded-full border border-[#C4A35A]/20">
                White-Label SLA
              </span>
            </div>

            {submitStatus === "success" ? (
              <div className="bg-[#C4A35A]/10 border border-[#C4A35A]/30 rounded-lg p-8 text-center my-6">
                <div className="text-[#C4A35A] mb-3">
                  <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-[18px] font-semibold text-white mb-2">Inquiry Submitted Successfully!</div>
                <div className="text-[15px] text-white/70">
                  I will review your agency requirements and respond within 24 hours to schedule an introductory call.
                </div>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-6 text-[14px] text-[#C4A35A] hover:text-[#d4b46a] underline font-medium"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} onFocus={handleFormFocus} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="agency" className="block text-[13px] font-medium text-white/90 mb-2 uppercase tracking-wide">
                      Agency Name <span className="text-[#C4A35A]">*</span>
                    </label>
                    <input
                      id="agency"
                      type="text"
                      {...register("agency")}
                      className="w-full bg-[#222222] border border-white/[0.18] hover:border-white/30 rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#C4A35A] focus:ring-2 focus:ring-[#C4A35A]/20 transition-all duration-200"
                      placeholder="e.g. Apex Digital Studio"
                    />
                    {errors.agency && (
                      <p className="text-[#ff6b6b] text-[12.5px] mt-1.5 font-medium">{errors.agency.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-[13px] font-medium text-white/90 mb-2 uppercase tracking-wide">
                      Your Name &amp; Role <span className="text-[#C4A35A]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      className="w-full bg-[#222222] border border-white/[0.18] hover:border-white/30 rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#C4A35A] focus:ring-2 focus:ring-[#C4A35A]/20 transition-all duration-200"
                      placeholder="e.g. Alex Morgan, Operations Director"
                    />
                    {errors.name && (
                      <p className="text-[#ff6b6b] text-[12.5px] mt-1.5 font-medium">{errors.name.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-[13px] font-medium text-white/90 mb-2 uppercase tracking-wide">
                      Work Email <span className="text-[#C4A35A]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="w-full bg-[#222222] border border-white/[0.18] hover:border-white/30 rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#C4A35A] focus:ring-2 focus:ring-[#C4A35A]/20 transition-all duration-200"
                      placeholder="alex@apexdigital.com"
                    />
                    {errors.email && (
                      <p className="text-[#ff6b6b] text-[12.5px] mt-1.5 font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-[13px] font-medium text-white/90 mb-2 uppercase tracking-wide">
                      Agency Website
                    </label>
                    <input
                      id="website"
                      type="text"
                      {...register("website")}
                      className="w-full bg-[#222222] border border-white/[0.18] hover:border-white/30 rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#C4A35A] focus:ring-2 focus:ring-[#C4A35A]/20 transition-all duration-200"
                      placeholder="https://apexdigital.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="volume" className="block text-[13px] font-medium text-white/90 mb-2 uppercase tracking-wide">
                    Estimated Monthly WordPress Volume <span className="text-[#C4A35A]">*</span>
                  </label>
                  <select
                    id="volume"
                    {...register("volume")}
                    className="w-full bg-[#222222] border border-white/[0.18] hover:border-white/30 rounded-lg px-4 py-3 text-[15px] text-white focus:outline-none focus:border-[#C4A35A] focus:ring-2 focus:ring-[#C4A35A]/20 transition-all duration-200"
                  >
                    <option value="1-2 projects/mo">1–2 builds or overhauls per month</option>
                    <option value="3-5 projects/mo">3–5 active client projects per month</option>
                    <option value="5+ projects/mo">5+ projects / full monthly retainer</option>
                    <option value="Emergency overflow only">Emergency overflow &amp; performance rescue only</option>
                  </select>
                  {errors.volume && (
                    <p className="text-[#ff6b6b] text-[12.5px] mt-1.5 font-medium">{errors.volume.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-[13px] font-medium text-white/90 mb-2 uppercase tracking-wide">
                    Biggest Current Technical Bottleneck &amp; Project Needs <span className="text-[#C4A35A]">*</span>
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    className="w-full bg-[#222222] border border-white/[0.18] hover:border-white/30 rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#C4A35A] focus:ring-2 focus:ring-[#C4A35A]/20 transition-all duration-200 resize-none"
                    placeholder="Tell me about your current pipeline, developer bottlenecks, or upcoming builds..."
                  />
                  {errors.message && (
                    <p className="text-[#ff6b6b] text-[12.5px] mt-1.5 font-medium">{errors.message.message}</p>
                  )}
                </div>

                {submitStatus === "error" && (
                  <p className="text-[#ff6b6b] text-[14px] font-medium">
                    Failed to submit inquiry. Please try again or message directly on WhatsApp.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative overflow-hidden w-full bg-[#C4A35A] text-[#0D0D0D] px-6 py-3.5 rounded-md text-[16px] font-semibold hover:bg-[#d4b46a] transition-all duration-300 shadow-lg shadow-[#C4A35A]/10 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  <span className="relative z-10">{isSubmitting ? "Submitting Inquiry..." : "Submit Partner Inquiry"}</span>
                </button>
              </form>
            )}
          </motion.div>

          {/* Right: Styled Info Card (Direct Contacts & Partnership Guarantees) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[#171717] p-8 sm:p-10 rounded-xl border border-white/[0.12] flex flex-col justify-between"
          >
            <div>
              <h3 className="text-[20px] font-semibold text-white mb-6 pb-4 border-b border-white/[0.08]">
                Direct Contacts &amp; SLA
              </h3>

              <div className="space-y-6">
                {/* Email Box */}
                <div className="bg-[#222222] p-4 rounded-lg border border-white/[0.08]">
                  <div className="text-[12px] tracking-[0.08em] uppercase text-[#C4A35A] mb-1 font-medium">
                    Direct Email
                  </div>
                  <a
                    href="mailto:hello@naveengaur.com"
                    className="text-[16px] text-white font-medium hover:text-[#C4A35A] transition-colors block"
                  >
                    hello@naveengaur.com
                  </a>
                </div>

                {/* Phone / WhatsApp Box */}
                <div className="bg-[#222222] p-4 rounded-lg border border-white/[0.08]">
                  <div className="text-[12px] tracking-[0.08em] uppercase text-[#C4A35A] mb-1 font-medium">
                    Phone &amp; WhatsApp
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[16px] text-white font-medium hover:text-[#25D366] transition-colors block"
                  >
                    +91 99208 99845
                  </a>
                </div>

                {/* Availability Badge Box */}
                <div className="bg-[#222222] p-4 rounded-lg border border-white/[0.08]">
                  <div className="text-[12px] tracking-[0.08em] uppercase text-[#C4A35A] mb-1.5 font-medium">
                    Partnership Status
                  </div>
                  <div className="text-[15px] text-white font-medium flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shadow-[0_0_10px_rgba(37,211,102,0.8)] animate-pulse" />
                    Available for Q4 agency partnerships
                  </div>
                </div>
              </div>
            </div>

            {/* Partnership Guarantees */}
            <div className="pt-6 mt-6 border-t border-white/[0.08] text-[13.5px] text-white/70 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[#C4A35A]">✓</span> Strict NDA signed before day one
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C4A35A]">✓</span> 100% white-label &amp; invisible to your client
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C4A35A]">✓</span> Dedicated Slack, Asana, or ClickUp integration
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C4A35A]">✓</span> Guaranteed turnaround response SLAs
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

