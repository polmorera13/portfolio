import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";

export default function Problem() {
  const { t } = useTranslation();

  return (
    <section className="section-gap">
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col lg:flex-row gap-10 lg:gap-14 lg:items-start"
        >
          {/* Left column: editorial image — 4:5 ratio */}
          <motion.div
            variants={fadeUp}
            className="w-full lg:w-[38%] shrink-0"
          >
            <div
              className="w-full rounded-xl overflow-hidden"
              style={{ aspectRatio: "4/5" }}
            >
              <img
                src="/ChatGPT_Image_7_may_2026,_19_04_37 copy.png"
                alt=""
                className="w-full h-full object-cover object-center"
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
          </motion.div>

          {/* Right column: all text content */}
          <div className="flex flex-col gap-8 lg:flex-1 min-w-0">
            <motion.span variants={fadeUp} className="eyebrow">
              {t("problem.eyebrow")}
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
            >
              {t("problem.title")}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-steel-blue"
              style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.5 }}
            >
              {t("problem.body")}
            </motion.p>

            <motion.blockquote
              variants={fadeUp}
              className="border-l-[3px] border-brand-blue bg-charcoal rounded-r-xl pl-6 pr-8 py-5"
              style={{ fontSize: "clamp(16px, 1.8vw, 20px)", lineHeight: 1.6 }}
            >
              <p className="text-off-white font-medium italic">
                "{t("problem.highlight")}"
              </p>
            </motion.blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
