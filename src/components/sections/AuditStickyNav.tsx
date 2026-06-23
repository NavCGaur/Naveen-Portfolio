"use client";

import { useEffect, useState, useRef } from "react";

interface AuditStickyNavProps {
  discoveryLabel: string;
}

export default function AuditStickyNav({ discoveryLabel }: AuditStickyNavProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const navRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "technical-foundation", label: "Technical Foundation" },
    { id: "trust-credibility", label: "Trust & Credibility" },
    { id: "ai-discovery", label: discoveryLabel },
    { id: "prioritized-checklist", label: "Action Checklist" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160; // offset for sticky main nav (72px) + section nav (48px) + breathing room

      // Find which section is currently in view
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            // Scroll nav item into view on mobile
            const activeTab = document.getElementById(`nav-link-${section.id}`);
            if (activeTab && navRef.current) {
              const navWidth = navRef.current.offsetWidth;
              const tabLeft = activeTab.offsetLeft;
              const tabWidth = activeTab.offsetWidth;
              navRef.current.scrollLeft = tabLeft - navWidth / 2 + tabWidth / 2;
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 130; // offset for both sticky headers
      window.scrollTo({
        top,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="fixed top-[72px] z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm print:hidden">
      <div className="max-w-[1040px] mx-auto px-6 relative flex items-center">
        {/* Navigation scroll container */}
        <div
          ref={navRef}
          className="flex gap-5 overflow-x-auto whitespace-nowrap py-4.5 scrollbar-none w-full scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              id={`nav-link-${section.id}`}
              onClick={() => scrollToSection(section.id)}
              className={`px-4.5 py-2 rounded-full text-[14.5px] font-semibold transition-all duration-200 cursor-pointer ${
                activeSection === section.id
                  ? "bg-[#C4A35A]/15 text-[#725921] font-bold border border-[#C4A35A]/30"
                  : "text-[#475569] hover:text-[#0D0D0D] hover:bg-slate-50 border border-transparent"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
        
        {/* Subtle right-side fade indicator for mobile scrolling */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
      </div>
    </div>
  );
}
