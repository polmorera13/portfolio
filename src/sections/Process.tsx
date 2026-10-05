import { motion } from "../lib/motion-lite";
import { useTranslation } from "../lib/i18n";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";

type Step = { day: string; n: string; title: string; description: string; you: string };

// "Cómo trabajo": 4 pasos con su plazo. Una sola lista en el HTML (cada texto
// una vez) que el CSS pinta de tres formas:
// - Escritorio (≥1024): línea de tiempo horizontal con los días y 4 tarjetas.
// - Tableta (768–1023): tarjetas en 2 × 2 con el día dentro.
// - Móvil (<768): línea vertical; el paso 4 en un recuadro destacado.
// Al final, la llamada "El primer paso es gratis…".

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

          <motion.ol variants={fadeUp} className="proc-list">
            {list.map((s, i) => (
              <li key={i} className={`proc-step${i === list.length - 1 ? " last" : ""}`}>
                <span className="proc-day">{s.day}</span>
                <span className="proc-dot" aria-hidden="true" />
                <div className="proc-card">
                  <h3 className="proc-title">
                    <span className="proc-n">{s.n} </span>
                    {s.title}
                  </h3>
                  <p className="proc-desc">{s.description}</p>
                  <p className="proc-you">{s.you}</p>
                </div>
              </li>
            ))}
          </motion.ol>

          {/* Final: el primer paso gratis */}
          <motion.div variants={fadeUp} data-process-final className="flex flex-col items-center gap-6 text-center pt-14 lg:pt-28">
            <p className="text-off-white font-bold max-w-3xl" style={{ fontSize: "clamp(26px, 3.2vw, 44px)", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
              {t("process.final")}
            </p>
            <a
              href="#contacto-propuesta"
              className="w-full sm:w-auto bg-brand-blue-deep text-off-white font-semibold text-lg px-10 py-4 rounded-lg text-center hover:bg-brand-blue-deep/90 transition-all duration-200 hover:scale-[1.02]"
            >
              {t("minicta.after_process_button")}
            </a>
          </motion.div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Móvil: línea vertical ─────────────────────────────── */
        .proc-list{position:relative;display:flex;flex-direction:column;gap:1.5rem;padding-left:2rem}
        .proc-list::before{content:"";position:absolute;left:7px;top:.5rem;bottom:2rem;width:1px;background:rgba(244,246,249,.25)}
        .proc-step{position:relative}
        .proc-dot{position:absolute;left:-2rem;top:.25rem;width:1rem;height:1rem;border-radius:9999px;background:rgba(244,246,249,.8)}
        .proc-step.last .proc-dot{background:#4A90D9;box-shadow:0 0 0 4px rgba(74,144,217,.3)}
        .proc-day{display:block;color:#4A90D9;font-size:.75rem;font-weight:700;letter-spacing:.15em;margin-bottom:.25rem}
        .proc-title{color:#F4F6F9;font-weight:700;font-size:1.25rem;line-height:1.25;margin-bottom:.25rem}
        .proc-n{display:none;color:#4A90D9}
        .proc-desc{color:rgba(244,246,249,.9);font-size:16px;line-height:1.5}
        .proc-you{color:#4A90D9;font-weight:700;font-size:16px;margin-top:.25rem}
        .proc-step.last{border:2px solid #4A90D9;background:#2C3E50;border-radius:.75rem;padding:1rem}
        .proc-step.last .proc-dot{left:calc(-2rem - 2px)}

        /* ── Tableta: 2 × 2 con el día dentro ──────────────────── */
        @media (min-width:768px){
          .proc-list{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;padding-left:0}
          .proc-list::before,.proc-dot{display:none}
          .proc-step,.proc-step.last{display:flex;flex-direction:column;background:#2C3E50;border:1px solid rgba(74,144,217,.15);border-radius:.75rem;padding:1.5rem}
          .proc-step.last{border:2px solid #4A90D9}
          .proc-card{display:flex;flex-direction:column;gap:.75rem;flex:1}
          .proc-title{font-size:clamp(20px,1.6vw,22px);margin:0}
          .proc-n{display:inline}
          .proc-you{margin-top:auto;padding-top:.75rem;border-top:1px solid rgba(244,246,249,.1)}
          .proc-day{margin-bottom:.75rem}
        }

        /* ── Escritorio: línea de tiempo + 4 tarjetas ───────────── */
        @media (min-width:1024px){
          .proc-list{grid-template-columns:repeat(4,1fr)}
          .proc-list::before{display:block;left:12.5%;right:12.5%;top:39px;bottom:auto;height:1px;width:auto}
          .proc-step,.proc-step.last{background:none;border:0;padding:0;border-radius:0}
          .proc-day{height:1.25rem;line-height:1.25rem;margin-bottom:.75rem;text-align:center;font-size:.875rem}
          .proc-dot{display:block;position:static;align-self:center;margin-bottom:1.5rem}
          .proc-card{background:#2C3E50;border:1px solid rgba(74,144,217,.15);border-radius:.75rem;padding:1.5rem}
          .proc-step.last .proc-card{border:2px solid #4A90D9}
        }
      ` }} />
    </section>
  );
}
