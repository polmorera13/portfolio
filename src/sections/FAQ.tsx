import { motion } from "../lib/motion-lite";
import { useTranslation } from "../lib/i18n";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { faqItems } from "../data/faq";
import FaqList from "../components/FaqList";

// Preguntas frecuentes de la portada: las 12, con la respuesta en el HTML.
// En móvil se ven las 6 primeras y "Ver más preguntas" muestra el resto.
export default function FAQ() {
  const { t } = useTranslation();

  return (
    <section className="section-gap bg-charcoal/20">
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col gap-4 max-w-2xl">
            <motion.span variants={fadeUp} className="eyebrow">
              {t("faq.eyebrow")}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              {t("faq.title")}
            </motion.h2>
          </div>

          <motion.div variants={fadeUp}>
            <FaqList items={faqItems} mobileVisible={6} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
