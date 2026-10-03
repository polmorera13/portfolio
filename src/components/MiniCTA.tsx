import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { whatsappUrl, WhatsAppIcon } from "../lib/whatsapp";

interface MiniCTAProps {
  textKey: string;
  /** "featured": tarjeta con fondo azul, titular grande y un solo botón. */
  variant?: "default" | "featured";
  /** Texto del botón principal (por defecto "Pide tu propuesta gratis"). */
  buttonKey?: string;
  /** Sin margen superior grande: va pegada a la sección anterior. */
  compactTop?: boolean;
}

// Llamada corta entre secciones. La normal: una frase y dos botones (propuesta
// gratis y WhatsApp), más baja que la franja "¿No sabes por dónde empezar?".
export default function MiniCTA({ textKey, variant = "default", buttonKey = "minicta.primary", compactTop = false }: MiniCTAProps) {
  const { t } = useTranslation();

  if (variant === "featured") {
    return (
      <section className="py-16 lg:py-24">
        <div className="max-w-content mx-auto section-padding">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="relative overflow-hidden rounded-2xl border border-brand-blue/30 px-6 py-12 sm:px-12 lg:py-16 flex flex-col items-center gap-8 text-center"
            style={{
              background:
                "radial-gradient(120% 140% at 50% 0%, oklch(58% 0.14 240 / 0.35) 0%, oklch(58% 0.14 240 / 0.12) 45%, oklch(20% 0.03 240 / 0.6) 100%)",
            }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold max-w-3xl"
              style={{ fontSize: "clamp(26px, 3.6vw, 48px)", lineHeight: 1.12, letterSpacing: "-0.01em" }}
            >
              {t(textKey)}
            </motion.h2>
            <motion.a
              variants={fadeUp}
              href="#contacto-propuesta"
              className="bg-brand-blue text-off-white font-semibold text-lg px-10 py-4 rounded-md hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.02]"
            >
              {t(buttonKey)}
            </motion.a>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={compactTop ? "pt-6 pb-12 lg:pb-16" : "py-12 lg:py-16"}>
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
            {t(buttonKey)}
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
