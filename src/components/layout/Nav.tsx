"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import * as ga from "@/lib/ga";

const navLinks = [
  { label: "Problems I Solve", href: "/#problems" },
  { label: "Services", href: "/#services" },
  { label: "Why Me", href: "/#why" },
  { label: "Blog", href: "/blog" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isBlogPage = pathname ? pathname.startsWith("/blog") : false;
  const isAuditsPage = pathname ? pathname.startsWith("/audits") : false;
  const isDarkPage = pathname ? (pathname !== "/" && !isBlogPage && !isAuditsPage) : true;
  const isTextLight = isDarkPage && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (label: string) => {
    ga.event({ action: "nav_click", category: "navigation", label });
    setMenuOpen(false);
  };

  const navBackground = (scrolled || isBlogPage || isAuditsPage)
    ? "bg-surface/95 backdrop-blur-md border-b border-black/[0.08] shadow-sm"
    : "bg-transparent";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBackground}`}>
      <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto w-full px-6 md:px-10 hd:px-14 h-[72px] flex items-center justify-between">
        {/* Logo / Name */}
        <a
          href="/"
          onClick={() => ga.event({ action: "logo_click", category: "navigation", label: "Logo" })}
          className={`flex items-center gap-3 font-serif text-[18px] tracking-[0.02em] transition-colors ${isTextLight ? "text-white hover:text-[#C4A35A]" : "text-ink hover:text-gold-dark"
            }`}
        >
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-gold/40 shadow-md relative">
            <img
              src="/images/projects/Naveen_profile_pic.jpg"
              alt="Naveen Gaur"
              width={50}
              height={50}
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </div>
          Naveen Gaur
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => ga.event({ action: "nav_click", category: "navigation", label: link.label })}
                className={`text-[16px] font-medium uppercase tracking-[0.05em] transition-colors ${isTextLight ? "text-white/70 hover:text-white" : "text-ink-muted hover:text-ink"
                  }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/free-audit"
              onClick={() => ga.event({ action: "nav_cta_click", category: "conversion", label: "Nav - Run AI Audit" })}
              className={`text-[15px] font-medium px-[20px] py-2.5 rounded-sm transition-colors ${isTextLight ? "bg-white text-ink hover:bg-[#C4A35A]" : "bg-ink text-white hover:bg-gold-dark"
                }`}
            >
              Run AI Audit
            </a>
          </li>
        </ul>
 
        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
          onClick={() => {
            setMenuOpen(!menuOpen);
            ga.event({ action: "mobile_menu_toggle", category: "navigation", label: menuOpen ? "Close" : "Open" });
          }}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-[2px] transition-transform duration-200 ${isTextLight ? "bg-white" : "bg-ink"} ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block w-5 h-[2px] transition-opacity duration-200 ${isTextLight ? "bg-white" : "bg-ink"} ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-[2px] transition-transform duration-200 ${isTextLight ? "bg-white" : "bg-ink"} ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>
 
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-black/[0.08] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleLinkClick(link.label)}
              className="text-[15px] font-medium text-ink-muted hover:text-ink transition-colors py-1.5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/free-audit"
            onClick={() => handleLinkClick("Mobile Nav - Run AI Audit")}
            className="text-[15px] font-medium bg-ink text-white px-4 py-2.5 rounded-sm text-center hover:bg-gold-dark transition-colors"
          >
            Run AI Audit
          </a>
        </div>
      )}
    </nav>
  );
}
