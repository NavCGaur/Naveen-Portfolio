"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-[100px] px-6 md:px-10 bg-ink text-white">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-gold mb-4">
            Work Together
          </span>
          <h2 className="font-serif text-[clamp(30px,4vw,46px)] tracking-[-0.025em] leading-[1.1] mb-5 max-w-[600px] mx-auto">
            Got a problem? Let&apos;s talk honestly about it.
          </h2>
          <p className="text-[17px] text-white/50 leading-[1.7] font-light max-w-[460px] mx-auto mb-8">
            Tell me what&apos;s going on. I&apos;ll tell you plainly what I&apos;d do, what it
            would cost, and whether I&apos;m the right person for it.
          </p>

          <a
            href="https://wa.me/919920899845?text=Hi%20Naveen,%20I%20found%20your%20portfolio%20and%20I'd%20like%20to%20discuss%20my%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#20bd5a] hover:-translate-y-px transition-all duration-150 shadow-lg shadow-[#25D366]/20"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Chat on WhatsApp
          </a>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#141414] p-8 md:p-10 rounded-lg border border-white/[0.08]"
          >
            <h3 className="text-[20px] font-medium mb-6">Or send an enquiry</h3>
            
            {submitStatus === "success" ? (
              <div className="bg-gold/10 border border-gold/20 rounded-md p-6 text-center">
                <div className="text-gold mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-[16px] font-medium text-white mb-1">Message sent successfully!</div>
                <div className="text-[14px] text-white/60">I&apos;ll get back to you as soon as possible.</div>
                <button 
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-4 text-[13px] text-gold hover:text-gold-light"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-[13px] text-white/60 mb-1.5">Name *</label>
                  <input
                    id="name"
                    {...register("name")}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-[#ff6b6b] text-[12px] mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-[13px] text-white/60 mb-1.5">Email *</label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
                    placeholder="you@company.com"
                  />
                  {errors.email && <p className="text-[#ff6b6b] text-[12px] mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="website" className="block text-[13px] text-white/60 mb-1.5">Website (Optional)</label>
                  <input
                    id="website"
                    {...register("website")}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
                    placeholder="https://yoursite.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[13px] text-white/60 mb-1.5">Message *</label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Tell me what's going on..."
                  />
                  {errors.message && <p className="text-[#ff6b6b] text-[12px] mt-1">{errors.message.message}</p>}
                </div>

                {submitStatus === "error" && (
                  <p className="text-[#ff6b6b] text-[13px]">Failed to send message. Please try again or use WhatsApp.</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold text-ink px-6 py-3 rounded-sm text-[14px] font-medium hover:bg-gold-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-10 md:pt-10"
          >
            <div>
              <div className="text-[11px] tracking-[0.1em] uppercase text-white/30 mb-2">Email</div>
              <div className="text-[16px] text-white/80">
                <a href="mailto:naveencg070@gmail.com" className="text-gold hover:text-white transition-colors font-medium">
                  naveencg070@gmail.com
                </a>
              </div>
            </div>

            <div>
              <div className="text-[11px] tracking-[0.1em] uppercase text-white/30 mb-2">Phone / WhatsApp</div>
              <div className="text-[16px] text-white/80 font-medium">+91 99208 99845</div>
            </div>

            <div>
              <div className="text-[11px] tracking-[0.1em] uppercase text-white/30 mb-2">Upwork</div>
              <div className="text-[16px] text-white/80">
                <a href="https://www.upwork.com/freelancers/naveengaur" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors font-medium">
                  View Profile →
                </a>
              </div>
            </div>

            <div>
              <div className="text-[11px] tracking-[0.1em] uppercase text-white/30 mb-2">Availability</div>
              <div className="text-[16px] text-white/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_8px_rgba(37,211,102,0.6)]"></span>
                Open to new projects
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
