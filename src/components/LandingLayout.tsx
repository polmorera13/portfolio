import type { ReactNode } from "react";
import { useTranslation } from "../lib/i18n";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { LANDING_FORM_ID } from "../data/landing";
import MobileCTABar from "./MobileCTABar";

/**
 * Plantilla de la landing de anuncios: sin menú (todo lleva al formulario).
 * Arriba, el nombre (lleva a la portada) y el botón de la propuesta; abajo, solo
 * el copyright y los textos legales.
 */
export default function LandingLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { lang } = usePage();
  return (
    <div className="min-h-screen bg-navy">
      <header className="absolute top-0 inset-x-0 z-40">
        <div className="max-w-content mx-auto section-padding h-[72px] flex items-center justify-between gap-6">
          <a href={pageHref("home", lang)} className="text-off-white font-bold text-lg tracking-tight">POL MORERA</a>
          <a
            href={`#${LANDING_FORM_ID}`}
            className="bg-brand-blue-deep text-off-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-brand-blue-deep/90 transition-colors"
          >
            {t("landing.header_cta")}
          </a>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-charcoal">
        <div className="max-w-content mx-auto section-padding py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-steel-blue/80 text-xs">{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <a href={pageHref("privacy", lang)} className="text-steel-blue/80 hover:text-steel-blue text-xs transition-colors">{t("footer.privacy")}</a>
            <a href={pageHref("legal", lang)} className="text-steel-blue/80 hover:text-steel-blue text-xs transition-colors">{t("footer.legal")}</a>
          </div>
        </div>
      </footer>
      <MobileCTABar href={`#${LANDING_FORM_ID}`} label={t("landing.cta")} heroId="landing-ctas" contactId={LANDING_FORM_ID} />
    </div>
  );
}
