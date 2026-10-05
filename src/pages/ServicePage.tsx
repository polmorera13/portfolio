import { useTranslation } from "../lib/i18n";
import { Check } from "lucide-react";
import { services } from "../data/services";
import { faqItems } from "../data/faq";
import { useVideos } from "../hooks/useVideos";
import { getPublicUrl } from "../lib/supabase";
import { getInitialData } from "../lib/initialData";
import { pageVideos } from "../seo/videos";
import { usePage } from "../lib/page";
import { pageHref, type PageKey } from "../routes";
import { videoLabel } from "../data/sectors";
import Breadcrumbs from "../components/Breadcrumbs";
import CtaBlock from "../components/CtaBlock";
import FaqList from "../components/FaqList";
import Method3x3 from "../components/Method3x3";
import VideoPlayer from "../components/VideoPlayer";
import { ProcessSteps, RelatedCases, UgcMaleLink } from "../components/ServiceBlocks";
import ServiceVideo, { ServiceVideoStack } from "../components/ServiceVideo";
import type { Locale } from "../types";

type ServiceKey = "ads" | "organic" | "corporate";

const PAGE_OF: Record<ServiceKey, PageKey> = { ads: "svc-ads", organic: "svc-social", corporate: "svc-corporate" };

// Preguntas de cada página (mismo texto que en la portada), por su pregunta en español
const FAQ_FOR: Record<ServiceKey, string[]> = {
  ads: ["¿Cuánto cuesta?", "¿El vídeo es mío? ¿Puedo usarlo todo el tiempo que quiera?", "¿Cuánto tarda un proyecto?", "¿En qué formatos entregas?"],
  organic: ["¿Vienes a grabar a mi negocio o te envío el producto?", "¿Sales tú en cámara o trabajas con actores?", "¿Qué tengo que darte yo?", "¿Cuánto cuesta?"],
  corporate: ["¿Cuánto tarda un proyecto?", "¿En qué formatos entregas?", "¿En qué idiomas puedes producir?", "¿Cuánto cuesta?"],
};

// Pestañas del portfolio que sirven de ejemplo
const EXAMPLE_CATS: Record<ServiceKey, ("ads" | "organic" | "corporate" | "street")[]> = {
  ads: ["ads"],
  organic: ["organic", "street"],
  corporate: ["corporate"],
};

// Casos relacionados
const RELATED: Record<ServiceKey, string[]> = {
  ads: ["masterd", "dogfy", "reactiva"],
  organic: ["agencia", "reactiva"],
  corporate: ["reactiva", "agencia"],
};

/** Página de un servicio: /videos-ugc-para-anuncios/, /videos-para-redes-sociales/, /video-corporativo/ (y EN/CAT). */
export default function ServicePage({ service }: { service: ServiceKey }) {
  const { t, i18n } = useTranslation();
  const { lang } = usePage();
  const s = services.find((x) => x.configKey === service)!;
  const cfg = getInitialData()?.services?.[service];
  const mainVideos = (cfg ?? []).filter((v): v is string => !!v);
  const videosMain = mainVideos.length ? mainVideos : s.videos;

  const { videos } = useVideos(EXAMPLE_CATS[service]);
  const examples = videos.slice(0, 6);
  const faqs = FAQ_FOR[service].map((q) => faqItems.find((f) => f.question.es === q)).filter(Boolean) as typeof faqItems;
  const l = lang as Locale;
  // Nombre del vídeo principal (el mismo que va en su VideoObject)
  const mainVideo = pageVideos(PAGE_OF[service], l, getInitialData())[0];

  return (
    <>
      <section className="max-w-content mx-auto section-padding pt-28 lg:pt-36 pb-10 lg:pb-16">
        <Breadcrumbs items={[{ label: t(`nav.svc_${service === "organic" ? "social" : service}`) }]} />
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start mt-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-off-white font-bold" style={{ fontSize: "clamp(32px, 4.6vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              {t(`svcpage.${service}.h1`)}
            </h1>
            <p className="text-steel-blue text-lg leading-relaxed">
              {t(`svcpage.${service}.intro`)}
              {service !== "corporate" && <> {t("svcpage.on_camera")}</>}
            </p>
            <p className="text-off-white" style={{ fontSize: "17px", lineHeight: 1.55 }}>{s.ideal[l]}</p>
            <ul className="flex flex-col gap-3">
              {s.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-off-white" style={{ fontSize: "16px" }}>
                  <Check size={18} className="text-brand-blue mt-0.5 shrink-0" strokeWidth={3} aria-hidden />
                  {b[l]}
                </li>
              ))}
            </ul>
            {service === "ads" && <Method3x3 as="h2" />}
            {service !== "corporate" && <UgcMaleLink textKey="links.ugc_male_svc" />}
            <span className="self-start rounded-full border border-brand-blue/50 px-3.5 py-1.5 text-sm font-semibold text-off-white">{s.tag[l]}</span>
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
            {service === "corporate" ? (
              <ServiceVideoStack files={videosMain} style={{ width: "min(100%, 520px)" }} indexable ariaName={mainVideo?.name} />
            ) : (
              <ServiceVideo file={videosMain[0]} aspect="9 / 16" style={{ width: "min(100%, calc(80vh * 9 / 16))" }} indexable ariaName={mainVideo?.name} />
            )}
          </div>
        </div>
      </section>

      <ProcessSteps />

      {/* Ejemplos */}
      {examples.length > 0 && (
        <section className="max-w-content mx-auto section-padding py-10 lg:py-14">
          <h2 className="text-off-white font-bold text-2xl lg:text-3xl mb-6">{t("svcpage.examples")}</h2>
          <div className={`grid gap-4 ${service === "corporate" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"}`}>
            {examples.map((v) => (
              <VideoPlayer
                key={v.id}
                src={getPublicUrl(v.storage_path)}
                poster={v.thumbnail_path ? getPublicUrl(v.thumbnail_path) : null}
                aspectRatio={service === "corporate" ? "16:9" : "9:16"}
                title={v.title}
                client={videoLabel(v.category, v.title, i18n.language, t)}
              />
            ))}
          </div>
        </section>
      )}

      <RelatedCases slugs={RELATED[service]} />

      {/* Preguntas */}
      <section className="max-w-content mx-auto section-padding py-10 lg:py-14">
        <h2 className="text-off-white font-bold text-2xl lg:text-3xl mb-6">{t("svcpage.faq")}</h2>
        <FaqList items={faqs} />
      </section>

      <CtaBlock />
    </>
  );
}


export { PAGE_OF };
