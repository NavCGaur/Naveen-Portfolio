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

  const isDarkPage = pathname !== "/";
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-md border-b border-black/[0.08] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="w-full px-6 md:px-10 h-[60px] flex items-center justify-between">
        {/* Logo / Name */}
        <a
          href="/"
          onClick={() => ga.event({ action: "logo_click", category: "navigation", label: "Logo" })}
          className={`font-serif text-[18px] tracking-tight transition-colors ${
            isTextLight ? "text-white hover:text-[#C4A35A]" : "text-ink hover:text-gold-dark"
          }`}
        >
          Naveen Gaur
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => ga.event({ action: "nav_click", category: "navigation", label: link.label })}
                className={`text-[14px] font-medium uppercase tracking-[0.04em] transition-colors ${
                  isTextLight ? "text-white/70 hover:text-white" : "text-ink-muted hover:text-ink"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/free-audit"
              onClick={() => ga.event({ action: "nav_cta_click", category: "conversion", label: "Nav - Free Video Audit" })}
              className={`text-[14px] font-medium px-[18px] py-2 rounded-sm transition-colors ${
                isTextLight ? "bg-white text-ink hover:bg-[#C4A35A]" : "bg-ink text-white hover:bg-gold-dark"
              }`}
            >
              Free Video Audit
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
              className="text-[14px] font-medium text-ink-muted hover:text-ink transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/free-audit"
            onClick={() => handleLinkClick("Mobile Nav - Free Video Audit")}
            className="text-[14px] font-medium bg-ink text-white px-4 py-2 rounded-sm text-center hover:bg-gold-dark transition-colors"
          >
            Free Video Audit
          </a>
        </div>
      )}
    </nav>
  );
}

