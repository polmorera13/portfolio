import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight, Plus, Minus } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { services } from "../data/services";
import ServiceVideo from "../components/ServiceVideo";
import type { Locale, Service } from "../types";

// "Qué produzco"
// - Escritorio (≥1024): lista desplegable a la izquierda (uno abierto cada vez) y
//   el vídeo del servicio abierto a la derecha, fijo mientras se baja.
// - Móvil y tableta: pestañas, vídeo 4:5 y el texto del servicio activo.
// El servicio abierto es el mismo estado en los dos diseños.
export default function Services() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as Locale) in services[0].title ? (i18n.language as Locale) : "es";
  const [active, setActive] = useState(0);
  const current = services[active];

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

          {/* ── Escritorio ─────────────────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="hidden lg:grid grid-cols-12 gap-10 items-start">
            <div className="col-span-7 flex flex-col">
              {services.map((s, i) => {
                const open = i === active;
                const panelId = `servicio-panel-${s.id}`;
                return (
                  <div key={s.id} className={open ? "" : "border-b border-charcoal"}>
                    {open ? (
                      <div className="bg-charcoal rounded-xl p-8 flex flex-col gap-5 my-2">
                        <button
                          type="button"
                          aria-expanded
                          aria-controls={panelId}
                          onClick={() => setActive(i)}
                          className="flex items-start justify-between gap-6 text-left rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue"
                        >
                          <h3 className="text-off-white font-bold" style={{ fontSize: "clamp(28px, 2.4vw, 32px)", lineHeight: 1.15 }}>
                            {s.title[lang]}
                          </h3>
                          <Minus size={24} className="text-brand-blue shrink-0 mt-1" aria-hidden />
                        </button>
                        <div id={panelId}>
                          <ServiceBody service={s} lang={lang} />
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        aria-expanded={false}
                        aria-controls={panelId}
                        onClick={() => setActive(i)}
                        className="w-full flex items-center justify-between gap-6 text-left py-6 px-2 group rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue"
                      >
                        <span className="flex flex-col gap-1">
                          <span className="text-off-white font-bold group-hover:text-brand-blue transition-colors" style={{ fontSize: "clamp(28px, 2.4vw, 32px)", lineHeight: 1.15 }}>
                            {s.title[lang]}
                          </span>
                          <span className="text-steel-blue text-base">{s.closedLine[lang]}</span>
                        </span>
                        <Plus size={24} className="text-brand-blue shrink-0" aria-hidden />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="col-span-5 sticky top-24 flex justify-center">
              {/* Altura máxima: 80 % de la pantalla */}
              <ServiceVideo
                file={current.video}
                aspect="9 / 16"
                style={{ width: "min(100%, calc(80vh * 9 / 16))" }}
              />
            </div>
          </motion.div>

          {/* ── Móvil y tableta ────────────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="lg:hidden flex flex-col gap-4">
            <div className="flex gap-2" role="tablist" aria-label={t("services.title")}>
              {services.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  id={`servicio-tab-${s.id}`}
                  aria-selected={i === active}
                  aria-controls="servicio-tabpanel"
                  onClick={() => setActive(i)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                    i === active
                      ? "bg-brand-blue text-off-white"
                      : "border border-steel-blue/40 text-steel-blue hover:text-off-white"
                  }`}
                >
                  {s.tab[lang]}
                </button>
              ))}
            </div>

            <div id="servicio-tabpanel" role="tabpanel" aria-labelledby={`servicio-tab-${current.id}`} className="flex flex-col gap-4">
              <ServiceVideo file={current.video} aspect="4 / 5" className="w-full md:max-w-md" />
              <h3 className="text-off-white font-bold text-2xl leading-tight">{current.title[lang]}</h3>
              <ServiceBody service={current} lang={lang} mobile />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/** Contenido de un servicio abierto: "Ideal si…", puntos, etiqueta y botones. */
function ServiceBody({ service, lang, mobile = false }: { service: Service; lang: Locale; mobile?: boolean }) {
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
      <span className="self-start rounded-full border border-brand-blue/50 px-3.5 py-1.5 text-sm font-semibold text-off-white">
        {service.tag[lang]}
      </span>
      <div className={`flex ${mobile ? "flex-col items-stretch gap-4" : "flex-row items-center gap-6"} mt-1`}>
        <a
          href="#contacto-propuesta"
          className="bg-brand-blue text-off-white font-semibold text-base px-7 py-3.5 rounded-lg text-center hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.01]"
        >
          {t("minicta.primary")}
        </a>
        <a
          href={service.portfolioHash}
          className={`inline-flex items-center gap-2 text-brand-blue font-semibold hover:gap-3 transition-all duration-200 ${mobile ? "justify-center" : ""}`}
        >
          {t("services.examples")}
          <ArrowRight size={16} aria-hidden />
        </a>
      </div>
    </div>
  );
}
