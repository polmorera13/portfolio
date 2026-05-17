import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import type { Locale } from "../types";

const LANGS: { code: Locale; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "ca", label: "CAT" },
];

export default function Header() {
  const { t } = useTranslation();
  const { currentLang, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t("nav.services"), href: "#servicios" },
    { label: t("nav.portfolio"), href: "#portfolio" },
    { label: t("nav.process"), href: "#proceso" },
    { label: t("nav.contact"), href: "#contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-18 transition-all duration-300 ${
        scrolled
          ? "bg-navy/95 backdrop-blur-md border-b border-charcoal"
          : "bg-navy/80 backdrop-blur-sm"
      }`}
      style={{ height: "72px" }}
    >
      <div className="max-w-content mx-auto section-padding h-full flex items-center justify-between gap-8">
        {/* Logo */}
        <a
          href="#"
          className="text-off-white font-bold text-lg tracking-tight shrink-0"
          style={{ letterSpacing: "-0.01em" }}
        >
          POL MORERA
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-steel-blue hover:text-off-white transition-colors duration-200 text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: lang switcher + CTA */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Language switcher */}
          <div className="flex items-center gap-1" role="group" aria-label="Language selector">
            {LANGS.map((lang, i) => (
              <span key={lang.code} className="flex items-center">
                {i > 0 && (
                  <span className="text-steel-blue/40 mx-1 text-xs select-none">·</span>
                )}
                <button
                  onClick={() => setLanguage(lang.code)}
                  className={`text-xs font-semibold transition-all duration-200 pb-0.5 ${
                    currentLang === lang.code
                      ? "text-off-white border-b-2 border-brand-blue"
                      : "text-steel-blue/60 hover:text-steel-blue border-b-2 border-transparent"
                  }`}
                  aria-pressed={currentLang === lang.code}
                  aria-label={`Switch to ${lang.label}`}
                >
                  {lang.label}
                </button>
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#contacto"
            className="bg-brand-blue text-off-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.02] shrink-0"
          >
            {t("nav.cta")}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-off-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-navy z-40 flex flex-col p-8 gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-off-white text-2xl font-semibold hover:text-brand-blue transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3 mt-4">
            {LANGS.map((lang, i) => (
              <span key={lang.code} className="flex items-center">
                {i > 0 && <span className="text-steel-blue/40 mx-1">·</span>}
                <button
                  onClick={() => setLanguage(lang.code)}
                  className={`text-sm font-semibold transition-colors pb-0.5 ${
                    currentLang === lang.code
                      ? "text-off-white border-b-2 border-brand-blue"
                      : "text-steel-blue/60 border-b-2 border-transparent"
                  }`}
                >
                  {lang.label}
                </button>
              </span>
            ))}
          </div>
          <a
            href="#contacto"
            onClick={() => setMenuOpen(false)}
            className="mt-4 bg-brand-blue text-off-white font-semibold text-base px-6 py-3.5 rounded-md text-center hover:bg-brand-blue/90 transition-colors"
          >
            {t("nav.cta")}
          </a>
        </div>
      )}
    </header>
  );
}
