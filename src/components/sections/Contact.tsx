"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import * as ga from "@/lib/ga";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  website: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [hasStartedForm, setHasStartedForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const handleFormFocus = () => {
    if (!hasStartedForm) {
      ga.event({ action: "form_start", category: "conversion", label: "Contact Form" });
      setHasStartedForm(true);
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    ga.event({ action: "form_submit_attempt", category: "conversion", label: "Contact Form" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      ga.event({ action: "generate_lead", category: "conversion", label: "Contact Form Success" });
      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error(error);
      ga.event({ action: "form_error", category: "conversion", label: "Contact Form Error" });
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-[100px] px-6 md:px-10 hd:px-14 bg-[#0A0A0A] text-white border-t border-white/[0.06]">
      <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <span className="block text-[13px] font-medium tracking-[0.08em] uppercase text-gold mb-3">
            Work Together
          </span>
          <h2 className="font-serif font-bold text-[clamp(30px,4.2vw,44px)] tracking-[-0.01em] leading-[1.1] mb-4 max-w-[680px] mx-auto">
            Want to get more out of your website for your business? Let&apos;s make it happen.
          </h2>
          {/* Reassurance line */}
          <p className="text-[16.5px] text-white/80 leading-[1.65] font-normal max-w-[620px] mx-auto mb-8">
            Whether you need a quick fix, faster loading times, better Google traffic, or peace of mind — tell me what you&apos;d like to improve and I&apos;ll take care of everything.
          </p>

          {/* Contact Action Buttons Grid (WhatsApp + Book Call) */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/919920899845?text=Hi%20Naveen,%20I%20found%20your%20portfolio%20and%20I'd%20like%20to%20discuss%20my%20website."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.event({ action: "click", category: "conversion", label: "WhatsApp" })}
              className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 border border-gold text-gold bg-gold/[0.08] px-7 py-3.5 rounded-md text-[15.5px] font-medium tracking-[0.03em] hover:bg-gold hover:text-ink transition-all duration-300 shadow-md shadow-gold/5"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Chat on WhatsApp
              </span>
            </a>

            {/* Book a Call Button */}
            <a
              href="https://cal.com/naveengaur"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.event({ action: "click", category: "conversion", label: "Book a Call" })}
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white bg-white/[0.05] px-7 py-3.5 rounded-md text-[15.5px] font-medium tracking-[0.03em] hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Book a 15-Min Call</span>
            </a>
          </div>
        </motion.div>

        {/* Form Container Card + Balanced Columns */}
        <div className="grid lg:grid-cols-[60fr_40fr] gap-10 items-stretch">
          {/* High Contrast Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#171717] p-8 sm:p-10 rounded-xl border border-white/[0.12] shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
              <h3 className="text-[20px] font-semibold text-white">Send an Enquiry</h3>
              <span className="text-[12px] uppercase tracking-wider text-gold-dark font-medium bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                Direct Contact
              </span>
            </div>
            
            {submitStatus === "success" ? (
              <div className="bg-gold/10 border border-gold/30 rounded-lg p-8 text-center my-6">
                <div className="text-gold mb-3">
                  <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-[18px] font-semibold text-white mb-2">Message sent successfully!</div>
                <div className="text-[15px] text-white/70">I&apos;ll review your details and respond within 24 hours.</div>
                <button 
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-6 text-[14px] text-gold hover:text-gold-light underline font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-[13.5px] font-medium text-white/90 mb-2 uppercase tracking-wide">
                      Name <span className="text-gold">*</span>
                    </label>
                    <input
                      id="name"
                      {...register("name")}
                      onFocus={handleFormFocus}
                      className="w-full bg-[#222222] border border-white/[0.18] hover:border-white/30 rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200"
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-[#ff6b6b] text-[12.5px] mt-1.5 font-medium">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[13.5px] font-medium text-white/90 mb-2 uppercase tracking-wide">
                      Email <span className="text-gold">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      onFocus={handleFormFocus}
                      className="w-full bg-[#222222] border border-white/[0.18] hover:border-white/30 rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200"
                      placeholder="you@company.com"
                    />
                    {errors.email && <p className="text-[#ff6b6b] text-[12.5px] mt-1.5 font-medium">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-[13.5px] font-medium text-white/90 mb-2 uppercase tracking-wide">
                    Website <span className="text-white/40 text-[12px] lowercase font-normal">(optional)</span>
                  </label>
                  <input
                    id="website"
                    {...register("website")}
                    className="w-full bg-[#222222] border border-white/[0.18] hover:border-white/30 rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200"
                    placeholder="https://yoursite.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[13.5px] font-medium text-white/90 mb-2 uppercase tracking-wide">
                    Message / Goal <span className="text-gold">*</span>
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    className="w-full bg-[#222222] border border-white/[0.18] hover:border-white/30 rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 resize-none"
                    placeholder="Tell me what you're trying to fix or build..."
                  />
                  {errors.message && <p className="text-[#ff6b6b] text-[12.5px] mt-1.5 font-medium">{errors.message.message}</p>}
                </div>

                {submitStatus === "error" && (
                  <p className="text-[#ff6b6b] text-[14px] font-medium">Failed to send message. Please try again or reach out on WhatsApp.</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative overflow-hidden w-full bg-gold text-ink px-6 py-3.5 rounded-md text-[16px] font-semibold hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/10 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  <span className="relative z-10">{isSubmitting ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </motion.div>

          {/* Styled Contact Info Card (Balanced Right Column) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[#171717] p-8 sm:p-10 rounded-xl border border-white/[0.12] flex flex-col justify-between"
          >
            <div>
              <h3 className="text-[20px] font-semibold text-white mb-6 pb-4 border-b border-white/[0.08]">
                Direct Contacts
              </h3>

              <div className="space-y-6">
                {/* Email Box */}
                <div className="bg-[#222222] p-4 rounded-lg border border-white/[0.08]">
                  <div className="text-[12px] tracking-[0.08em] uppercase text-gold mb-1 font-medium">Email</div>
                  <a href="mailto:hello@naveengaur.com" className="text-[16px] text-white font-medium hover:text-gold transition-colors block">
                    hello@naveengaur.com
                  </a>
                </div>

                {/* Phone / WhatsApp Box */}
                <div className="bg-[#222222] p-4 rounded-lg border border-white/[0.08]">
                  <div className="text-[12px] tracking-[0.08em] uppercase text-gold mb-1 font-medium">Phone / WhatsApp</div>
                  <div className="text-[16px] text-white font-medium">+91 99208 99845</div>
                </div>

                {/* Availability Badge Box */}
                <div className="bg-[#222222] p-4 rounded-lg border border-white/[0.08]">
                  <div className="text-[12px] tracking-[0.08em] uppercase text-gold mb-1.5 font-medium">Current Status</div>
                  <div className="text-[15px] text-white font-medium flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shadow-[0_0_10px_rgba(37,211,102,0.8)] animate-pulse" />
                    Available for Q3 projects
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Guarantees at bottom of right card */}
            <div className="pt-6 mt-6 border-t border-white/[0.08] text-[13.5px] text-white/60 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gold">✓</span> Response within 24 hours guaranteed
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold">✓</span> Direct developer communication
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
