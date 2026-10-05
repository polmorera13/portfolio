import { useTranslation } from "../lib/i18n";
import { Check } from "lucide-react";
import { faqItems } from "../data/faq";
import { UGC_MALE_FAQ, UGC_MALE_MAIN, ugcMaleExamples } from "../data/ugcMale";
import { getPublicUrl } from "../lib/supabase";
import { getInitialData } from "../lib/initialData";
import { pageVideos } from "../seo/videos";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import Breadcrumbs from "../components/Breadcrumbs";
import CtaBlock from "../components/CtaBlock";
import FaqList from "../components/FaqList";
import VideoPlayer from "../components/VideoPlayer";
import ServiceVideo from "../components/ServiceVideo";
import { ProcessSteps, RelatedCases } from "../components/ServiceBlocks";
import type { Locale } from "../types";

/** Creador UGC hombre: /creador-ugc-hombre/, /en/male-ugc-creator-spain/, /ca/creador-ugc-home/. */
export default function UgcMalePage() {
  const { t } = useTranslation();
  const { lang } = usePage();
  const l = lang as Locale;
  const data = getInitialData();
  const examples = ugcMaleExamples(data);
  // Nombres de los vídeos (los mismos que en sus VideoObject)
  const names = pageVideos("ugc-male", l, data).map((v) => v.name);
  const faqs = [...UGC_MALE_FAQ, ...faqItems.filter((f) => f.question.es === "¿Cuánto cuesta?")];
  const when = t("ugcpage.when", { returnObjects: true }) as string[];
  const sectors = t("ugcpage.sectors", { returnObjects: true }) as string[];

  return (
    <>
      <section className="max-w-content mx-auto section-padding pt-28 lg:pt-36 pb-10 lg:pb-16">
        <Breadcrumbs items={[{ label: t("ugcpage.crumb") }]} />
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start mt-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-off-white font-bold" style={{ fontSize: "clamp(32px, 4.6vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              {t("ugcpage.h1")}
            </h1>
            <p className="text-steel-blue text-lg leading-relaxed">{t("ugcpage.intro")}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <a href={pageHref("home", l, "contacto-propuesta")} className="bg-brand-blue-deep text-off-white font-semibold px-7 py-3.5 rounded-lg text-center hover:bg-brand-blue-deep/90 transition-colors">
                {t("minicta.primary")}
              </a>
              <a href={pageHref("home", l, "contacto")} className="text-brand-blue font-semibold px-2 py-3.5 text-center hover:text-off-white transition-colors">
                {t("svcpage.or_quote")}
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <ServiceVideo
              file={UGC_MALE_MAIN.file}
              poster={UGC_MALE_MAIN.poster}
              aspect="9 / 16"
              style={{ width: "min(100%, calc(80vh * 9 / 16))" }}
              indexable
              ariaName={names[0]}
            />
          </div>
        </div>
      </section>

      {/* ¿Cuándo te conviene? */}
      <section className="max-w-content mx-auto section-padding py-10 lg:py-14 flex flex-col gap-6">
        <h2 className="text-off-white font-bold text-2xl lg:text-3xl">{t("ugcpage.when_title")}</h2>
        <ul className="flex flex-col gap-3 max-w-3xl">
          {when.map((w, i) => (
            <li key={i} className="flex items-start gap-3 text-off-white" style={{ fontSize: "17px", lineHeight: 1.55 }}>
              <Check size={18} className="text-brand-blue mt-1 shrink-0" strokeWidth={3} aria-hidden />
              {w}
            </li>
          ))}
          <li className="flex items-start gap-3 text-off-white" style={{ fontSize: "17px", lineHeight: 1.55 }}>
            <Check size={18} className="text-brand-blue mt-1 shrink-0" strokeWidth={3} aria-hidden />
            <div>
              {t("ugcpage.sectors_label")}
              <ul className="mt-2 flex flex-col gap-1 text-steel-blue">
                {sectors.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </li>
        </ul>
      </section>

      {/* Tú decides quién sale */}
      <section className="max-w-content mx-auto section-padding py-10 lg:py-14 flex flex-col gap-4">
        <h2 className="text-off-white font-bold text-2xl lg:text-3xl">{t("ugcpage.who_title")}</h2>
        <p className="text-steel-blue max-w-3xl" style={{ fontSize: "18px", lineHeight: 1.6 }}>{t("ugcpage.who_text")}</p>
      </section>

      {/* Ejemplos (vídeos del portfolio en los que salgo yo) */}
      {examples.length > 1 && (
        <section className="max-w-content mx-auto section-padding py-10 lg:py-14">
          <h2 className="text-off-white font-bold text-2xl lg:text-3xl mb-6">{t("svcpage.examples")}</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {examples.map((v, i) => (
              <VideoPlayer
                key={v.file}
                src={getPublicUrl(v.file)}
                poster={v.poster ? getPublicUrl(v.poster) : null}
                aspectRatio="9:16"
                title={v.brand}
                client={null}
                indexable
                ariaName={names[i + 1]}
              />
            ))}
          </div>
        </section>
      )}

      <ProcessSteps />
      <RelatedCases slugs={["masterd"]} />

      {/* Preguntas */}
      <section className="max-w-content mx-auto section-padding py-10 lg:py-14">
        <h2 className="text-off-white font-bold text-2xl lg:text-3xl mb-6">{t("svcpage.faq")}</h2>
        <FaqList items={faqs} />
      </section>

      <CtaBlock />
    </>
  );
}
