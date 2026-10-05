import { useTranslation } from "../lib/i18n";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { whatsappUrl, WhatsAppIcon } from "../lib/whatsapp";

/**
 * Llamada a la acción de las páginas internas: "Pide tu propuesta gratis"
 * (principal), WhatsApp y el enlace "o pide presupuesto".
 */
export default function CtaBlock({ title, text }: { title?: string; text?: string }) {
  const { t } = useTranslation();
  const { lang } = usePage();
  return (
    <section className="max-w-content mx-auto section-padding py-16 lg:py-24">
      <div
        className="rounded-2xl border border-brand-blue/30 px-6 py-12 sm:px-12 flex flex-col items-center gap-6 text-center"
        style={{ background: "radial-gradient(120% 140% at 50% 0%, oklch(58% 0.14 240 / 0.3) 0%, oklch(20% 0.03 240 / 0.6) 100%)" }}
      >
        <h2 className="text-off-white font-bold max-w-3xl" style={{ fontSize: "clamp(26px, 3.2vw, 42px)", lineHeight: 1.15 }}>
          {title ?? t("svcpage.cta_title")}
        </h2>
        <p className="text-off-white/90 text-lg max-w-2xl">{text ?? t("svcpage.cta_text")}</p>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <a
            href={pageHref("home", lang, "contacto-propuesta")}
            className="w-full sm:w-auto bg-brand-blue text-off-white font-semibold text-lg px-8 py-4 rounded-lg text-center hover:bg-brand-blue/90 transition-colors"
          >
            {t("minicta.primary")}
          </a>
          <a
            href={whatsappUrl(t("contact.whatsapp_msg"))}
            target="_blank"
            rel="noopener"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-brand-blue/40 text-brand-blue font-semibold text-lg px-8 py-4 rounded-lg hover:border-brand-blue hover:text-off-white transition-colors"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>
        </div>
        <a href={pageHref("home", lang, "contacto")} className="text-steel-blue text-sm font-semibold hover:text-off-white transition-colors">
          {t("svcpage.or_quote")}
        </a>
      </div>
    </section>
  );
}
