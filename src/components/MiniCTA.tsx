import { motion } from "../lib/motion-lite";
import { useTranslation } from "../lib/i18n";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { whatsappUrl, WhatsAppIcon } from "../lib/whatsapp";

interface MiniCTAProps {
  textKey: string;
  /** "white": barra blanca a todo el ancho, frase grande, un solo botón y letra pequeña. */
  variant?: "default" | "white";
  /** Letra pequeña bajo el botón (variante "white"). */
  noteKey?: string;
  /** Texto del botón principal (por defecto "Pide tu propuesta gratis"). */
  buttonKey?: string;
  /** Sin margen superior grande: va pegada a la sección anterior. */
  compactTop?: boolean;
}

// Llamada corta entre secciones. La normal: una frase y dos botones (propuesta
// gratis y WhatsApp), más baja que la franja "¿No sabes por dónde empezar?".
export default function MiniCTA({ textKey, variant = "default", buttonKey = "minicta.primary", noteKey, compactTop = false }: MiniCTAProps) {
  const { t } = useTranslation();

  if (variant === "white") {
    // Barra blanca a todo el ancho: frase grande, un botón y letra pequeña. Sin WhatsApp.
    return (
      <section data-cta="white" className="bg-white py-14 lg:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="max-w-content mx-auto section-padding flex flex-col items-center gap-6 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="font-bold max-w-3xl"
            style={{ color: "#0D1B2A", fontSize: "clamp(26px, 3.4vw, 44px)", lineHeight: 1.15, letterSpacing: "-0.01em" }}
          >
            {t(textKey)}
          </motion.h2>
          <motion.a
            variants={fadeUp}
            href="#contacto-propuesta"
            className="w-full sm:w-auto bg-brand-blue-deep text-off-white font-semibold text-lg px-10 py-4 rounded-lg text-center hover:bg-brand-blue-deep/90 transition-all duration-200 hover:scale-[1.02]"
          >
            {t(buttonKey)}
          </motion.a>
          {noteKey && (
            <motion.p variants={fadeUp} className="max-w-xl" style={{ color: "#3D5468", fontSize: "15px", lineHeight: 1.5 }}>
              {t(noteKey)}
            </motion.p>
          )}
        </motion.div>
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
            className="bg-brand-blue-deep text-off-white font-semibold text-sm px-6 py-3 rounded-md hover:bg-brand-blue-deep/90 transition-all duration-200 hover:scale-[1.02]"
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
