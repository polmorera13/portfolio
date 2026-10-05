import { useTranslation } from "../lib/i18n";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";

/** 404: el servidor devuelve este HTML con estado 404. */
export default function NotFoundPage() {
  const { t } = useTranslation();
  const { lang } = usePage();
  return (
    <section className="max-w-3xl mx-auto section-padding pt-32 lg:pt-44 pb-24 lg:pb-36 flex flex-col items-center gap-6 text-center">
      <span className="text-brand-blue font-bold tabular-nums" style={{ fontSize: "clamp(64px, 10vw, 120px)", lineHeight: 1 }}>404</span>
      <h1 className="text-off-white font-bold" style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1 }}>{t("notfound.h1")}</h1>
      <p className="text-steel-blue text-lg">{t("notfound.text")}</p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
        <a href={pageHref("home", lang)} className="bg-brand-blue-deep text-off-white font-semibold px-7 py-3.5 rounded-lg text-center hover:bg-brand-blue-deep/90 transition-colors">
          {t("notfound.home")}
        </a>
        <a href={pageHref("home", lang, "contacto")} className="border border-brand-blue/40 text-brand-blue font-semibold px-7 py-3.5 rounded-lg text-center hover:border-brand-blue hover:text-off-white transition-colors">
          {t("notfound.contact")}
        </a>
      </div>
    </section>
  );
}
