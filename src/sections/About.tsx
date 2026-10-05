import { motion } from "../lib/motion-lite";
import { useTranslation } from "../lib/i18n";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import RotatingPhotos from "../components/RotatingPhotos";
import { aboutPhotos } from "../data/aboutPhotos";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { UgcMaleLink } from "../components/ServiceBlocks";

// "Quién está detrás": texto a la izquierda y foto a la derecha en escritorio
// (al revés que "El problema", que va justo antes); en móvil, foto arriba.
export default function About() {
  const { t } = useTranslation();
  const { lang } = usePage();

  return (
    <section id="sobre-mi" className="section-gap">
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-14 lg:items-center"
        >
          <motion.div variants={fadeUp} className="w-full lg:w-[38%] shrink-0">
            <RotatingPhotos photos={aboutPhotos(t)} className="w-full rounded-xl" style={{ aspectRatio: "4/5" }} />
          </motion.div>

          <div className="flex flex-col gap-8 lg:flex-1 min-w-0">
            <motion.span variants={fadeUp} className="eyebrow">
              {t("about.eyebrow")}
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
            >
              {t("about.title")}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-steel-blue"
              style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.5 }}
            >
              {t("about.p1")}
            </motion.p>

            <motion.div variants={fadeUp} className="-mt-4">
              <UgcMaleLink textKey="links.ugc_male_about" className="text-lg" />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-steel-blue"
              style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.5 }}
            >
              {t("about.p2")}
            </motion.p>

            <motion.div variants={fadeUp}>
              {/* Mismo estilo que el botón secundario "Hablemos" del hero */}
              <a
                href="#contacto"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "0.875rem 0",
                  borderRadius: "8px",
                  background: "transparent",
                  color: "oklch(58% 0.14 240)",
                  textDecoration: "none",
                  transition: "transform 160ms ease-out",
                  display: "inline-block",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                {t("about.cta")}
              </a>
              <a href={pageHref("about", lang)} className="ml-6 text-steel-blue font-semibold text-sm hover:text-off-white transition-colors">
                {t("links.more_about")}
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
