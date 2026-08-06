"use client";

import { useState } from "react";
import Link from "next/link";
import { trackOutboundClick } from "@/lib/ga";
import type { BlogPost } from "@/lib/blog";

interface Props {
  post: BlogPost;
}

export default function DynamicArticleCTA({ post }: Props) {
  const isWhatsApp =
    post.category === "WhatsApp & Automation" ||
    post.slug.includes("whatsapp") ||
    post.slug.includes("baileys") ||
    (post.tags && post.tags.some((t) => /whatsapp|baileys/i.test(t)));

  const isWordPress =
    post.category === "WordPress" ||
    post.slug.includes("wordpress");

  let heading = "Need custom full-stack development or cloud architecture help?";
  let description =
    "I build high-performance web applications, custom APIs, and scalable cloud infrastructure for tech founders. Fast turnaround, direct access, no agency overhead.";
  let whatsappMessage = `Hi Naveen, I read your article "${post.title}" and would like to discuss a project.`;
  let emailSubject = `Project Inquiry - ${post.title}`;

  if (isWhatsApp) {
    heading = "Building a Production WhatsApp Bot or Scaling Baileys?";
    description =
      "I build, debug, and scale enterprise WhatsApp automations, multi-device bots, and custom CRM integrations. Direct access, zero agency overhead.";
    whatsappMessage = `Hi Naveen, I read your article "${post.title}" and need help with my WhatsApp automation project.`;
    emailSubject = `WhatsApp Automation Inquiry - ${post.title}`;
  } else if (isWordPress) {
    heading = "Need help with your WordPress site?";
    description =
      "I fix WordPress crashes, remove malware, and optimize performance for small businesses. Fast turnaround, direct access, no agency overhead.";
    whatsappMessage = `Hi Naveen, I read your article "${post.title}" and need help fixing my WordPress site.`;
    emailSubject = `WordPress Support Inquiry - ${post.title}`;
  }

  const encodedWhatsAppUrl = `https://wa.me/919920899845?text=${encodeURIComponent(whatsappMessage)}`;
  const encodedEmailUrl = `mailto:hello@naveengaur.com?subject=${encodeURIComponent(emailSubject)}`;
  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=hello@naveengaur.com&su=${encodeURIComponent(emailSubject)}`;

  const [copied, setCopied] = useState(false);

  return (
    <div className="blog-card border blog-border rounded-xl p-8 md:p-10 text-center shadow-lg relative">
      <span className="inline-block text-[12px] font-bold tracking-[0.08em] uppercase text-[#C4A35A] px-3 py-1 rounded-sm bg-[#C4A35A]/10 border border-[#C4A35A]/20 mb-4">
        {isWhatsApp ? "WhatsApp & Automation Consulting" : isWordPress ? "WordPress Specialist" : "Full-Stack & Cloud Architecture"}
      </span>
      <h2 className="font-serif text-[clamp(22px,3vw,32px)] blog-heading mb-4 leading-[1.2]">
        {heading}
      </h2>
      <p className="text-[16px] blog-text-muted max-w-[540px] mx-auto leading-[1.7] mb-8">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-[560px] mx-auto">
        <a
          href={encodedWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackOutboundClick("whatsapp_article_cta", post.slug)}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-[#0D0D0D] py-3.5 px-6 rounded-sm text-[15px] font-bold uppercase tracking-[0.05em] hover:bg-[#20bd5a] transition-all duration-300 shadow-md hover:scale-[1.02]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Chat on WhatsApp
        </a>

        <a
          href={gmailWebUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackOutboundClick("email_article_cta", post.slug);
            try { navigator.clipboard.writeText("hello@naveengaur.com"); } catch (e) {}
            setCopied(true);
          }}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#C4A35A] text-[#0D0D0D] py-3.5 px-6 rounded-sm text-[15px] font-bold uppercase tracking-[0.05em] hover:bg-[#d4b46a] transition-all duration-300 shadow-md hover:scale-[1.02]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send Email Inquiry
        </a>
      </div>

      {copied && (
        <div className="mt-4 p-4 bg-[#C4A35A]/15 border border-[#C4A35A]/40 rounded-md text-[14px] text-[#0D0D0D] font-medium max-w-[560px] mx-auto text-center shadow-lg">
          <div className="text-[#725921] font-bold mb-1">✅ Opening Web Gmail & Copied to Clipboard!</div>
          <div className="text-[#2A2A2A] text-[13px] mb-2">
            Direct Email: <strong className="text-[#725921] underline">hello@naveengaur.com</strong>
          </div>
          <div className="flex justify-center gap-3 mt-2">
            <a
              href={encodedEmailUrl}
              className="text-[12px] text-[#725921] font-bold underline hover:text-black"
            >
              Prefer Desktop Mail App? Click here
            </a>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-black/10 text-[14px] font-bold text-[#0D0D0D] flex items-center justify-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shadow-[0_0_8px_rgba(37,211,102,0.6)] animate-pulse"></span>
        <span>Direct access to Naveen Gaur • Response within 24 hours</span>
      </div>
    </div>
  );
}
