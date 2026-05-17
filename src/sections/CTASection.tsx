import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
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
          <motion.h2
            variants={fadeUp}
            className="text-off-white font-bold max-w-2xl"
            style={{ fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.01em" }}
          >
            {t("cta.headline")}
          </motion.h2>

          <motion.a
            variants={fadeUp}
            href="#contacto"
            className="bg-brand-blue text-off-white font-semibold text-lg px-10 py-4 rounded-md hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.02] pulse-glow"
          >
            {t("cta.button")}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
