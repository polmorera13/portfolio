import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { whatsappUrl, WhatsAppIcon } from "../lib/whatsapp";

// Llamada corta entre secciones: una frase y dos botones (propuesta gratis y
// WhatsApp). Más baja y discreta que la franja "¿No sabes por dónde empezar?".
export default function MiniCTA({ textKey }: { textKey: string }) {
  const { t } = useTranslation();

  return (
    <section className="py-12 lg:py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="max-w-content mx-auto section-padding flex flex-col items-center gap-5 text-center"
      >
        <motion.p
          variants={fadeUp}
          className="text-off-white font-semibold max-w-2xl"
          style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.35 }}
        >
          {t(textKey)}
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="#contacto-propuesta"
            className="bg-brand-blue text-off-white font-semibold text-sm px-6 py-3 rounded-md hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.02]"
          >
            {t("minicta.primary")}
          </a>
          <a
            href={whatsappUrl(t("contact.whatsapp_msg"))}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 border border-brand-blue/40 text-brand-blue font-semibold text-sm px-6 py-3 rounded-md hover:border-brand-blue hover:text-off-white transition-all duration-200"
          >
            <WhatsAppIcon size={16} />
            {t("minicta.whatsapp")}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
