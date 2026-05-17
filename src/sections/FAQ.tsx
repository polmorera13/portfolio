import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce, ease } from "../lib/motion";
import { faqItems } from "../data/faq";
import type { Locale } from "../types";

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Locale;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

          <motion.div variants={fadeUp} className="max-w-3xl w-full flex flex-col gap-3" style={{ marginLeft: 0 }}>
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="border border-charcoal rounded-xl overflow-hidden hover:border-brand-blue/30 transition-colors duration-200"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={openIndex === i}
                >
                  <span className="text-off-white font-semibold text-base">{item.question[lang]}</span>
                  <ChevronDown
                    size={18}
                    className={`text-brand-blue shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                    >
                      <div className="px-6 pb-5 text-steel-blue text-sm leading-relaxed border-t border-charcoal/50 pt-4">
                        {item.answer[lang]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
