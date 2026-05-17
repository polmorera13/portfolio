import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce, ease } from "../lib/motion";
import { services } from "../data/services";
import type { Locale } from "../types";

export default function Services() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Locale;

  return (
    <section id="servicios" className="pb-24 lg:pb-40 pt-12 lg:pt-20">
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col gap-4">
            <motion.span variants={fadeUp} className="eyebrow">
              {t("services.eyebrow")}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              {t("services.title")}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeUp}
                className="bg-charcoal border border-brand-blue/20 rounded-xl p-8 flex flex-col gap-6 cursor-default"
                whileHover={{
                  y: -4,
                  borderColor: "rgba(74,144,217,0.6)",
                  transition: { duration: 0.2, ease },
                }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-brand-blue font-bold text-4xl leading-none opacity-30">
                    {service.number}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <h3
                    className="text-off-white font-semibold"
                    style={{ fontSize: "clamp(18px, 2vw, 24px)" }}
                  >
                    {service.title[lang]}
                  </h3>
                  <p className="text-steel-blue text-sm leading-relaxed">
                    {service.description[lang]}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {service.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-steel-blue">
                      <Check size={14} className="text-brand-blue mt-0.5 shrink-0" />
                      {bullet[lang]}
                    </li>
                  ))}
                </ul>

                <a
                  href="#portfolio"
                  className="flex items-center gap-2 text-brand-blue text-sm font-semibold hover:gap-3 transition-all duration-200 mt-auto group"
                >
                  {service.cta[lang]}
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
