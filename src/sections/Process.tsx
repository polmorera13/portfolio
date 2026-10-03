import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";

type Step = { day: string; n: string; title: string; description: string; you: string };

// "Cómo trabajo": 4 pasos con su plazo.
// - Escritorio (≥1024): línea de tiempo horizontal con los días y 4 tarjetas.
// - Tableta (768–1023): tarjetas en 2 × 2 con el día dentro.
// - Móvil (<768): línea vertical; el paso 4 en un recuadro destacado.
// Al final, la llamada "El primer paso es gratis…" (antes era una sección aparte).

function StepCard({ step, last, showDay }: { step: Step; last: boolean; showDay: boolean }) {
  return (
    <div
      className={`h-full rounded-xl bg-charcoal p-6 flex flex-col gap-3 ${
        last ? "border-2 border-brand-blue" : "border border-brand-blue/15"
      }`}
    >
      {showDay && (
        <span className="text-brand-blue text-xs font-bold tracking-[0.15em]">{step.day}</span>
      )}
      <h3 className="text-off-white font-bold" style={{ fontSize: "clamp(20px, 1.6vw, 22px)", lineHeight: 1.25 }}>
        <span className="text-brand-blue mr-2">{step.n}</span>
        {step.title}
      </h3>
      <p className="text-off-white/90" style={{ fontSize: "16px", lineHeight: 1.55 }}>
        {step.description}
      </p>
      <div className="mt-auto pt-3 border-t border-off-white/10">
        <p className="text-brand-blue font-bold" style={{ fontSize: "16px" }}>
          {step.you}
        </p>
      </div>
    </div>
  );
}

export default function Process() {
  const { t } = useTranslation();
  const steps = t("process.steps", { returnObjects: true }) as Step[];
  const list = Array.isArray(steps) ? steps : [];

  return (
    <section
      id="proceso"
      // Sin margen inferior: el espacio bajo la frase final lo pone "Sobre mí" (py-24 / lg:py-40)
      // y la frase lleva el mismo por arriba, así queda centrada entre las dos secciones.
      className="pt-20 lg:pt-40"
    >
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-10 lg:gap-12"
        >
          {/* Cabecera + pastilla de plazo */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="flex flex-col gap-3 lg:gap-4">
              <motion.span variants={fadeUp} className="eyebrow">
                {t("process.eyebrow")}
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-off-white font-bold"
                style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em" }}
              >
                {t("process.title")}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-steel-blue text-lg">
                {t("process.subtitle")}
              </motion.p>
            </div>
            <motion.span
              variants={fadeUp}
              className="self-start lg:self-auto rounded-full border border-brand-blue/60 px-5 py-2.5 text-off-white font-bold"
              style={{ fontSize: "clamp(16px, 1.4vw, 20px)" }}
            >
              {t("process.badge")}
            </motion.span>
          </div>

          {/* ── Escritorio: línea de tiempo + 4 tarjetas ───────────────────── */}
          <motion.div variants={fadeUp} className="hidden lg:flex flex-col gap-6">
            <div className="relative grid grid-cols-4 gap-6">
              {/* Línea entre el primer y el último punto */}
              <div
                aria-hidden="true"
                className="absolute h-px bg-off-white/25"
                style={{ left: "12.5%", right: "12.5%", bottom: 7 }}
              />
              {list.map((s, i) => (
                <div key={i} className="relative flex flex-col items-center gap-3">
                  <span className="text-brand-blue text-sm font-bold tracking-[0.15em]">{s.day}</span>
                  <span
                    aria-hidden="true"
                    className={`w-4 h-4 rounded-full ${i === list.length - 1 ? "bg-brand-blue ring-4 ring-brand-blue/30" : "bg-off-white/80"}`}
                  />
                </div>
              ))}
            </div>
            <ol className="grid grid-cols-4 gap-6 items-stretch">
              {list.map((s, i) => (
                <li key={i}>
                  <StepCard step={s} last={i === list.length - 1} showDay={false} />
                </li>
              ))}
            </ol>
          </motion.div>

          {/* ── Tableta: 2 × 2 con el día dentro ──────────────────────────── */}
          <motion.ol variants={fadeUp} className="hidden md:grid lg:hidden grid-cols-2 gap-6 items-stretch">
            {list.map((s, i) => (
              <li key={i}>
                <StepCard step={s} last={i === list.length - 1} showDay />
              </li>
            ))}
          </motion.ol>

          {/* ── Móvil: línea vertical ─────────────────────────────────────── */}
          <motion.ol variants={fadeUp} className="md:hidden relative flex flex-col gap-6 pl-8">
            <div aria-hidden="true" className="absolute left-[7px] top-2 bottom-8 w-px bg-off-white/25" />
            {list.map((s, i) => {
              const last = i === list.length - 1;
              return (
                <li key={i} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-8 top-1 w-4 h-4 rounded-full ${last ? "bg-brand-blue ring-4 ring-brand-blue/30" : "bg-off-white/80"}`}
                  />
                  <div className={last ? "rounded-xl border-2 border-brand-blue bg-charcoal p-4 -mt-1" : ""}>
                    <span className="block text-brand-blue text-xs font-bold tracking-[0.15em] mb-1">
                      {s.day}
                      {last && <span className="text-off-white"> · {s.title}</span>}
                    </span>
                    {!last && <h3 className="text-off-white font-bold text-xl leading-tight mb-1">{s.title}</h3>}
                    <p className="text-off-white/90" style={{ fontSize: "16px", lineHeight: 1.5 }}>
                      {s.description}
                    </p>
                    <p className="text-brand-blue font-bold mt-1" style={{ fontSize: "16px" }}>
                      {s.you}
                    </p>
                  </div>
                </li>
              );
            })}
          </motion.ol>

          {/* Final: el primer paso gratis */}
          <motion.div variants={fadeUp} data-process-final className="flex flex-col items-center gap-6 text-center pt-14 lg:pt-28">
            <p className="text-off-white font-bold max-w-3xl" style={{ fontSize: "clamp(26px, 3.2vw, 44px)", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
              {t("process.final")}
            </p>
            <a
              href="#contacto-propuesta"
              className="w-full sm:w-auto bg-brand-blue text-off-white font-semibold text-lg px-10 py-4 rounded-lg text-center hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.02]"
            >
              {t("minicta.after_process_button")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
