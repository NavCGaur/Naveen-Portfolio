"use client";

import { useState } from "react";

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    "Hi Naveen, I was reviewing your portfolio (naveengaur.com) and would like to discuss a project."
  );
  const whatsappUrl = `https://wa.me/919920899845?text=${whatsappMessage}`;
  const emailUrl = "mailto:hello@naveengaur.com?subject=Project%20Inquiry%20-%20Naveen%20Gaur";
  const auditUrl = "/free-audit";

  return (
    <aside
      aria-label="Quick Contact Options"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 select-none pointer-events-auto"
    >
      {/* Expanded Quick Contact Options */}
      {isOpen && (
        <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-3 duration-200 ease-out">
          {/* Option 1: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-[#1F2937] hover:bg-[#25D366] text-white hover:text-black text-xs font-medium py-2 px-3.5 rounded-full shadow-lg border border-white/10 transition-all duration-200 group"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] group-hover:bg-black transition-colors" />
            <span>Chat on WhatsApp</span>
            <svg
              className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
          </a>

          {/* Option 2: Email */}
          <a
            href={emailUrl}
            className="flex items-center gap-2.5 bg-[#1F2937] hover:bg-[#C4A35A] text-white hover:text-black text-xs font-medium py-2 px-3.5 rounded-full shadow-lg border border-white/10 transition-all duration-200 group"
          >
            <span className="w-2 h-2 rounded-full bg-[#C4A35A] group-hover:bg-black transition-colors" />
            <span>Send Email Inquiry</span>
            <svg
              className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>

          {/* Option 3: Run AI Audit */}
          <a
            href={auditUrl}
            className="flex items-center gap-2.5 bg-[#1F2937] hover:bg-white text-white hover:text-black text-xs font-medium py-2 px-3.5 rounded-full shadow-lg border border-white/10 transition-all duration-200 group"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 group-hover:bg-black transition-colors" />
            <span>Run Free AI Audit</span>
            <svg
              className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </a>
        </div>
      )}

      {/* Main Pill Button */}
      <div className="flex items-center bg-[#0D0D0D]/90 backdrop-blur-md text-white rounded-full p-1.5 border border-white/15 shadow-xl transition-all duration-300 hover:border-[#C4A35A]/50">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#25D366] text-[#0D0D0D] hover:bg-[#20bd5a] transition-all duration-200 shadow-sm"
          title="Direct WhatsApp"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-7 h-7 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-1"
          title={isOpen ? "Close menu" : "More options"}
          aria-expanded={isOpen}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-45" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
