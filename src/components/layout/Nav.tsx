"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Problems I Solve", href: "#problems" },
  { label: "Services", href: "#services" },
  { label: "Why Me", href: "#why" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-md border-b border-black/[0.08] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 h-[60px] flex items-center justify-between">
        {/* Logo / Name */}
        <a
          href="#"
          className="font-serif text-[18px] tracking-tight text-ink hover:text-gold-dark transition-colors"
        >
          Naveen Gaur
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] font-medium uppercase tracking-[0.04em] text-ink-muted hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="text-[13px] font-medium bg-ink text-white px-[18px] py-2 rounded-sm hover:bg-gold-dark transition-colors"
            >
              Get in Touch
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-[2px] bg-ink transition-transform duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block w-5 h-[2px] bg-ink transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-[2px] bg-ink transition-transform duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
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
              onClick={handleLinkClick}
              className="text-[14px] font-medium text-ink-muted hover:text-ink transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={handleLinkClick}
            className="text-[14px] font-medium bg-ink text-white px-4 py-2 rounded-sm text-center hover:bg-gold-dark transition-colors"
          >
            Get in Touch
          </a>
        </div>
      )}
    </nav>
  );
}
