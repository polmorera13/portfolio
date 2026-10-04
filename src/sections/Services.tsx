import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight, Plus, Minus } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { services } from "../data/services";
import ServiceVideo, { ServiceVideoStack } from "../components/ServiceVideo";
import { fetchServices, type ServicesConfig } from "../lib/api";
import { getInitialData } from "../lib/initialData";
import { usePage } from "../lib/page";
import { pageHref, type PageKey } from "../routes";
import Method3x3 from "../components/Method3x3";
import type { Locale, Service } from "../types";

const PAGE_OF: Record<Service["configKey"], PageKey> = { ads: "svc-ads", organic: "svc-social", corporate: "svc-corporate" };

// "Qué produzco". Una sola estructura para todos los tamaños (cada texto una vez
// en el HTML); el orden lo cambia el CSS (grid-template-areas):
// - Escritorio (≥1024): lista desplegable a la izquierda (uno abierto cada vez) y
//   el vídeo del servicio abierto a la derecha, fijo mientras se baja.
// - Móvil y tableta: pestañas, vídeo y el texto del servicio activo.
// Los servicios cerrados siguen en el HTML (ocultos), con todo su texto.
export default function Services() {
  const { t, i18n } = useTranslation();
  const { lang: pageLang } = usePage();
  const lang = (i18n.language as Locale) in services[0].title ? (i18n.language as Locale) : "es";
  const [active, setActive] = useState(0);
  const current = services[active];

  // Vídeos de cada servicio: los del panel (/api/services) o, si no hay, los por defecto
  const [config, setConfig] = useState<ServicesConfig>(getInitialData()?.services ?? {});
  useEffect(() => {
    let cancelled = false;
    fetchServices().then((c) => { if (!cancelled && c) setConfig(c); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);
  const videosFor = (s: Service) => {
    const chosen = (config[s.configKey] ?? []).filter((v): v is string => !!v);
    return chosen.length ? chosen : s.videos;
  };

  return (
    <section id="servicios" className="pb-24 lg:pb-40 pt-8 lg:pt-20">
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-6 lg:gap-12"
        >
          <div className="flex flex-col gap-3 lg:gap-4">
            <motion.span variants={fadeUp} className="eyebrow">
              {t("services.eyebrow")}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              {t("services.title")}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-steel-blue text-lg">
              {t("services.subtitle")}
            </motion.p>
          </div>

          <motion.div variants={fadeUp} className="svc-grid">
            {/* Pestañas (solo móvil y tableta) */}
            <div className="flex gap-2 lg:hidden" style={{ gridArea: "tabs" }} role="tablist" aria-label={t("services.title")}>
              {services.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  id={`servicio-tab-${s.id}`}
                  aria-selected={i === active}
                  aria-controls={`servicio-panel-${s.id}`}
                  onClick={() => setActive(i)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                    i === active ? "bg-brand-blue text-off-white" : "border border-steel-blue/40 text-steel-blue hover:text-off-white"
                  }`}
                >
                  {s.tab[lang]}
                </button>
              ))}
            </div>

            {/* Vídeo del servicio abierto: un solo reproductor, que cambia de forma con el tamaño */}
            <div style={{ gridArea: "video" }} className="lg:sticky lg:top-24 flex lg:justify-center">
              {current.configKey === "corporate" ? (
                <ServiceVideoStack files={videosFor(current)} className="w-full max-w-[480px] lg:max-w-none lg:w-[min(100%,calc((80vh_-_24px)/3*16/9))]" />
              ) : (
                <ServiceVideo
                  file={videosFor(current)[0]}
                  className="w-full md:max-w-md aspect-[4/5] lg:aspect-[9/16] lg:max-w-none lg:w-[min(100%,calc(80vh*9/16))]"
                />
              )}
            </div>

            {/* Lista: en escritorio, desplegable; en móvil se ve solo el servicio activo */}
            <div style={{ gridArea: "list" }} className="flex flex-col">
              {services.map((s, i) => {
                const open = i === active;
                const panelId = `servicio-panel-${s.id}`;
                return (
                  <div
                    key={s.id}
                    className={open ? "lg:bg-charcoal lg:rounded-xl lg:p-8 lg:my-2 flex flex-col gap-4 lg:gap-5" : "hidden lg:block border-b border-charcoal"}
                  >
                    <h3 className="m-0">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setActive(i)}
                        className={`w-full flex items-start justify-between gap-6 text-left rounded-md group focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue ${open ? "" : "py-6 px-2"}`}
                      >
                        <span className="flex flex-col gap-1">
                          <span
                            className={`text-off-white font-bold ${open ? "" : "group-hover:text-brand-blue transition-colors"}`}
                            style={{ fontSize: "clamp(24px, 2.4vw, 32px)", lineHeight: 1.15 }}
                          >
                            {s.title[lang]}
                          </span>
                          {!open && <span className="text-steel-blue text-base font-normal">{s.closedLine[lang]}</span>}
                        </span>
                        <span className="hidden lg:inline text-brand-blue shrink-0 mt-1" aria-hidden>
                          {open ? <Minus size={24} /> : <Plus size={24} />}
                        </span>
                      </button>
                    </h3>
                    <div id={panelId} role="tabpanel" aria-labelledby={`servicio-tab-${s.id}`} hidden={!open}>
                      <ServiceBody service={s} lang={lang} moreHref={pageHref(PAGE_OF[s.configKey], pageLang)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .svc-grid{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr);grid-template-areas:"tabs" "video" "list"}
        @media (min-width:1024px){.svc-grid{gap:2.5rem;grid-template-columns:7fr 5fr;grid-template-areas:"list video";align-items:start}}
      ` }} />
    </section>
  );
}

/** Contenido de un servicio abierto: "Ideal si…", puntos, etiqueta y botones. */
function ServiceBody({ service, lang, moreHref }: { service: Service; lang: Locale; moreHref: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5">
      <p className="text-off-white" style={{ fontSize: "17px", lineHeight: 1.55 }}>
        {service.ideal[lang]}
      </p>
      <ul className="flex flex-col gap-3">
        {service.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 text-off-white" style={{ fontSize: "16px", lineHeight: 1.5 }}>
            <Check size={18} className="text-brand-blue mt-0.5 shrink-0" strokeWidth={3} aria-hidden />
            {b[lang]}
          </li>
        ))}
      </ul>
      {service.configKey === "ads" && <Method3x3 />}
      <span className="self-start rounded-full border border-brand-blue/50 px-3.5 py-1.5 text-sm font-semibold text-off-white">
        {service.tag[lang]}
      </span>
      <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:gap-6 mt-1">
        <a
          href="#contacto-propuesta"
          className="bg-brand-blue text-off-white font-semibold text-base px-7 py-3.5 rounded-lg text-center hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.01]"
        >
          {t("minicta.primary")}
        </a>
        <a
          href={service.portfolioHash}
          className="inline-flex items-center justify-center lg:justify-start gap-2 text-brand-blue font-semibold hover:gap-3 transition-all duration-200"
        >
          {t("services.examples")}
          <ArrowRight size={16} aria-hidden />
        </a>
      </div>
      <a href={moreHref} className="self-center lg:self-start text-steel-blue font-semibold text-sm hover:text-off-white transition-colors">
        {t("links.more_service")}
      </a>
    </div>
  );
}
