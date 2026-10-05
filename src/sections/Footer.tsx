import { useTranslation } from "../lib/i18n";
import { Instagram, Linkedin } from "lucide-react";
import { whatsappUrl, WhatsAppIcon } from "../lib/whatsapp";
import { withBase } from "../lib/paths";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";

export default function Footer() {
  const { t } = useTranslation();
  const { lang } = usePage();

  const columns = [
    {
      title: t("footer_cols.services"),
      links: [
        { label: t("nav.svc_ads"), href: pageHref("svc-ads", lang) },
        { label: t("nav.svc_social"), href: pageHref("svc-social", lang) },
        { label: t("nav.svc_corporate"), href: pageHref("svc-corporate", lang) },
      ],
    },
    {
      title: t("footer_cols.cases"),
      links: [
        { label: t("footer_cols.all_cases"), href: pageHref("cases", lang) },
        { label: "MasterD", href: pageHref("case-masterd", lang) },
        { label: "Dogfy Diet", href: pageHref("case-dogfy", lang) },
        { label: "Reactiva Online", href: pageHref("case-reactiva", lang) },
        { label: "Apple Tree", href: pageHref("case-agency", lang) },
      ],
    },
    {
      title: t("footer_cols.about"),
      links: [
        { label: t("footer_cols.about"), href: pageHref("about", lang) },
        { label: t("nav.contact"), href: pageHref("home", lang, "contacto") },
      ],
    },
  ];

  const iconCls =
    "w-9 h-9 rounded-full border border-charcoal flex items-center justify-center text-steel-blue hover:text-brand-blue hover:border-brand-blue/50 transition-all duration-200";

  return (
    <footer className="border-t border-charcoal bg-navy">
      <div className="max-w-content mx-auto section-padding py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Marca, foto y redes */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <img
                src={withBase("/perfil-pol.webp")}
                alt="Pol Morera"
                width={88}
                height={88}
                loading="lazy"
                style={{ width: 88, height: 88, borderRadius: "16px", objectFit: "cover", flexShrink: 0, border: "1px solid oklch(58% 0.14 240 / 0.25)" }}
              />
              <div className="flex flex-col gap-2">
                <span className="text-off-white font-bold text-lg" style={{ letterSpacing: "-0.01em" }}>POL MORERA</span>
                <p className="text-steel-blue text-sm leading-relaxed">{t("footer.tagline")}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/polmoreraugc/" target="_blank" rel="noopener noreferrer me" className={iconCls} aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://www.linkedin.com/in/pol-morera-de-frutos-9b8b35124/" target="_blank" rel="noopener noreferrer me" className={iconCls} aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href={whatsappUrl(t("contact.whatsapp_msg"))} target="_blank" rel="noopener" className={iconCls} aria-label="WhatsApp">
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <span className="text-off-white text-sm font-semibold">{col.title}</span>
              {col.links.map((link) => (
                <a key={link.href} href={link.href} className="text-steel-blue text-sm hover:text-off-white transition-colors duration-200">
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-charcoal pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-steel-blue/60 text-xs">{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <a href={pageHref("privacy", lang)} className="text-steel-blue/60 hover:text-steel-blue text-xs transition-colors">
              {t("footer.privacy")}
            </a>
            <a href={pageHref("legal", lang)} className="text-steel-blue/60 hover:text-steel-blue text-xs transition-colors">
              {t("footer.legal")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
