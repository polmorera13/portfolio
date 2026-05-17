import { useTranslation } from "react-i18next";
import { Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  const navLinks = [
    { labelKey: "nav.services", href: "#servicios" },
    { labelKey: "nav.portfolio", href: "#portfolio" },
    { labelKey: "nav.process", href: "#proceso" },
    { labelKey: "nav.contact", href: "#contacto" },
  ];

  return (
    <footer className="border-t border-charcoal bg-navy">
      <div className="max-w-content mx-auto section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Left: brand */}
          <div className="flex flex-col gap-3">
            <span className="text-off-white font-bold text-lg" style={{ letterSpacing: "-0.01em" }}>
              POL MORERA
            </span>
            <p className="text-steel-blue text-sm leading-relaxed">{t("footer.tagline")}</p>
          </div>

          {/* Center: nav */}
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-steel-blue text-sm hover:text-off-white transition-colors duration-200"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </div>

          {/* Right: social */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <a
                href="https://instagram.com/polmorera"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-charcoal flex items-center justify-center text-steel-blue hover:text-brand-blue hover:border-brand-blue/50 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://linkedin.com/in/polmorera"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-charcoal flex items-center justify-center text-steel-blue hover:text-brand-blue hover:border-brand-blue/50 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://youtube.com/@polmorera"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-charcoal flex items-center justify-center text-steel-blue hover:text-brand-blue hover:border-brand-blue/50 transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-charcoal pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-steel-blue/60 text-xs">{t("footer.copyright")}</p>
          <a href="#" className="text-steel-blue/60 hover:text-steel-blue text-xs transition-colors">
            {t("footer.privacy")}
          </a>
        </div>
      </div>
    </footer>
  );
}
