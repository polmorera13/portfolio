import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";
import type { Locale } from "../types";
import { usePage } from "../lib/page";
import { setLanguage } from "../lib/i18n";
import { pageHref, type PageKey } from "../routes";

const LANGS: { code: Locale; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "ca", label: "CAT" },
];

export default function Header() {
  const { t } = useTranslation();
  const { key, lang } = usePage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // La barra fija de móvil se oculta mientras el menú está abierto.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", menuOpen);
  }, [menuOpen]);

  const services: { key: PageKey; label: string }[] = [
    { key: "svc-ads", label: t("nav.svc_ads") },
    { key: "svc-social", label: t("nav.svc_social") },
    { key: "svc-corporate", label: t("nav.svc_corporate") },
  ];
  const navLinks = [
    { label: t("nav.cases"), href: pageHref("cases", lang) },
    { label: t("nav.about"), href: pageHref("about", lang) },
    { label: t("nav.contact"), href: pageHref("home", lang, "contacto") },
  ];

  // Selector de idioma: enlaza a la misma página en el otro idioma. En las
  // páginas sin versión por idioma (legales) cambia el idioma en el sitio.
  const langItem = (l: { code: Locale; label: string }, size: "sm" | "lg") => {
    const active = lang === l.code;
    const cls = `${size === "sm" ? "text-xs" : "text-sm"} font-semibold transition-all duration-200 pb-0.5 border-b-2 ${
      active ? "text-off-white border-brand-blue" : "text-steel-blue/60 hover:text-steel-blue border-transparent"
    }`;
    return key ? (
      <a href={pageHref(key, l.code)} hrefLang={l.code} lang={l.code} className={cls} aria-current={active ? "true" : undefined} aria-label={`Switch to ${l.label}`}>
        {l.label}
      </a>
    ) : (
      <button type="button" onClick={() => setLanguage(l.code)} className={cls} aria-pressed={active} aria-label={`Switch to ${l.label}`}>
        {l.label}
      </button>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-18 transition-all duration-300 ${
        scrolled ? "bg-navy/95 backdrop-blur-md border-b border-charcoal" : "bg-navy/80 backdrop-blur-sm"
      }`}
      style={{ height: "72px" }}
    >
      <div className="max-w-content mx-auto section-padding h-full flex items-center justify-between gap-8">
        <a href={pageHref("home", lang)} className="text-off-white font-bold text-lg tracking-tight shrink-0" style={{ letterSpacing: "-0.01em" }}>
          POL MORERA
        </a>

        {/* Escritorio */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-steel-blue hover:text-off-white group-focus-within:text-off-white transition-colors duration-200 text-sm font-medium"
              aria-haspopup="true"
            >
              {t("nav.services_menu")}
              <ChevronDown size={14} aria-hidden className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>
            {/* Desplegable: se abre con el ratón o con el teclado (focus-within) */}
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 top-full pt-3">
              <ul className="min-w-[230px] rounded-xl border border-charcoal bg-navy/95 backdrop-blur-md p-2 shadow-xl shadow-black/30">
                {services.map((s) => (
                  <li key={s.key}>
                    <a href={pageHref(s.key, lang)} className="block rounded-lg px-3 py-2 text-sm text-steel-blue hover:text-off-white hover:bg-charcoal/60 transition-colors">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-steel-blue hover:text-off-white transition-colors duration-200 text-sm font-medium">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-1" role="group" aria-label="Language selector">
            {LANGS.map((l, i) => (
              <span key={l.code} className="flex items-center">
                {i > 0 && <span className="text-steel-blue/40 mx-1 text-xs select-none">·</span>}
                {langItem(l, "sm")}
              </span>
            ))}
          </div>
          <a
            href={pageHref("home", lang, "contacto-propuesta")}
            className="bg-brand-blue text-off-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.02] shrink-0"
          >
            {t("nav.cta")}
          </a>
        </div>

        <button className="lg:hidden text-off-white" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Móvil */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-navy z-40 flex flex-col p-8 gap-5 overflow-y-auto">
          <span className="text-steel-blue text-xs font-bold tracking-[0.18em] uppercase">{t("nav.services_menu")}</span>
          {services.map((s) => (
            <a key={s.key} href={pageHref(s.key, lang)} onClick={() => setMenuOpen(false)} className="text-off-white text-xl font-semibold hover:text-brand-blue transition-colors -mt-2">
              {s.label}
            </a>
          ))}
          <span className="h-px bg-charcoal my-1" />
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-off-white text-2xl font-semibold hover:text-brand-blue transition-colors">
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3 mt-2">
            {LANGS.map((l, i) => (
              <span key={l.code} className="flex items-center">
                {i > 0 && <span className="text-steel-blue/40 mx-1">·</span>}
                {langItem(l, "lg")}
              </span>
            ))}
          </div>
          <a
            href={pageHref("home", lang, "contacto-propuesta")}
            onClick={() => setMenuOpen(false)}
            className="mt-2 bg-brand-blue text-off-white font-semibold text-base px-6 py-3.5 rounded-md text-center hover:bg-brand-blue/90 transition-colors"
          >
            {t("nav.cta")}
          </a>
        </div>
      )}
    </header>
  );
}
