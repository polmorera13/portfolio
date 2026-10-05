import { motion } from "../lib/motion-lite";
import { useTranslation } from "../lib/i18n";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="py-32 bg-charcoal relative overflow-hidden">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #8AAFCC 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-content mx-auto section-padding relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col items-center gap-10 text-center"
        >
          <div className="flex flex-col items-center gap-5">
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold max-w-2xl"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.01em" }}
            >
              {t("cta.headline")}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-steel-blue text-lg max-w-2xl">
              {t("cta.text")}
            </motion.p>
          </div>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-4">
            {/* Baja al formulario con la propuesta gratis ya marcada */}
            <a
              href="#contacto-propuesta"
              className="bg-brand-blue text-off-white font-semibold text-lg px-10 py-4 rounded-md hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.02] pulse-glow"
            >
              {t("cta.button")}
            </a>
            {/* Baja al formulario con "Un presupuesto" marcado */}
            <a
              href="#contacto"
              className="text-brand-blue font-semibold text-sm hover:text-off-white transition-colors"
            >
              {t("cta.secondary")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
