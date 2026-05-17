import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TrendingUp, Target, Globe, Layers } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce, ease } from "../lib/motion";

const icons = [Layers, Target, Globe, TrendingUp];

export default function Differentiation() {
  const { t } = useTranslation();
  const cards = t("differentiation.cards", { returnObjects: true }) as Array<{ title: string; desc: string }>;

  return (
    <section className="pb-24 lg:pb-40 pt-12 lg:pt-20">
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
              {t("differentiation.eyebrow")}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              {t("differentiation.title")}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map((card, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-charcoal border border-brand-blue/20 rounded-xl p-8 flex flex-col gap-4"
                  whileHover={{
                    y: -2,
                    transition: { duration: 0.2, ease },
                  }}
                >
                  <Icon size={28} className="text-brand-blue" />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-off-white font-semibold text-lg">{card.title}</h3>
                    <p className="text-steel-blue text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
