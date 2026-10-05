import { useEffect, useState } from "react";
import { useTranslation } from "../lib/i18n";
import { CheckCircle } from "lucide-react";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { whatsappUrl, WhatsAppIcon } from "../lib/whatsapp";

/** Página de gracias tras enviar el formulario (noindex). ?tipo=propuesta añade la frase de la propuesta. */
export default function ThanksPage() {
  const { t } = useTranslation();
  const { lang } = usePage();
  const [proposal, setProposal] = useState(false);
  useEffect(() => {
    setProposal(new URLSearchParams(window.location.search).get("tipo") === "propuesta");
  }, []);

  return (
    <section className="max-w-3xl mx-auto section-padding pt-32 lg:pt-44 pb-24 lg:pb-36 flex flex-col items-center gap-6 text-center">
      <CheckCircle size={56} className="text-brand-blue" aria-hidden />
      <h1 className="text-off-white font-bold" style={{ fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1.05 }}>{t("thanks.h1")}</h1>
      <p className="text-off-white text-lg">{t("thanks.always")}</p>
      {proposal && <p className="text-steel-blue text-lg">{t("thanks.proposal")}</p>}
      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto">
        <a href={whatsappUrl(t("contact.whatsapp_msg"))} target="_blank" rel="noopener"
          className="inline-flex items-center justify-center gap-2 bg-brand-blue text-off-white font-semibold px-7 py-3.5 rounded-lg hover:bg-brand-blue/90 transition-colors">
          <WhatsAppIcon size={18} /> WhatsApp
        </a>
        <a href={pageHref("home", lang)}
          className="inline-flex items-center justify-center border border-brand-blue/40 text-brand-blue font-semibold px-7 py-3.5 rounded-lg hover:border-brand-blue hover:text-off-white transition-colors">
          {t("thanks.home")}
        </a>
      </div>
    </section>
  );
}
