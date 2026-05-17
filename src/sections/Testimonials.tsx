import { useTranslation } from "react-i18next";
import { Star } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";

const STAR_COLOR = "oklch(58% 0.14 240)";

function StarRow() {
  return (
    <div className="flex gap-[3px] mb-4" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={14} weight="fill" color={STAR_COLOR} />
      ))}
    </div>
  );
}

type Item = { quote: string; author: string; role: string };

function Card({ item }: { item: Item }) {
  return (
    <article
      tabIndex={0}
      className="flex flex-col bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        width: "clamp(320px, 30vw, 400px)",
        flexShrink: 0,
        padding: "2rem",
        border: "1px solid oklch(58% 0.14 240 / 0.15)",
        borderRadius: "12px",
      }}
    >
      <StarRow />
      <p
        className="text-off-white flex-1"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          fontSize: "1rem",
          lineHeight: 1.5,
          maxWidth: "50ch",
        }}
      >
        {item.quote}
      </p>
      <div style={{ marginTop: "24px" }}>
        <p
          className="text-off-white"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: "0.9375rem",
          }}
        >
          {item.author}
        </p>
        <p
          className="text-steel-blue"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: "0.875rem",
          }}
        >
          {item.role}
        </p>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const items = t("testimonials.items", { returnObjects: true }) as Item[];

  const ariaLabel =
    i18n.language === "ca"
      ? "Testimonis"
      : i18n.language === "en"
      ? "Testimonials"
      : "Testimonios";

  return (
    <section className="section-gap bg-charcoal/20">
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-4">
            <motion.span variants={fadeUp} className="eyebrow">
              {t("testimonials.eyebrow")}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              {t("testimonials.title")}
            </motion.h2>
          </div>
        </motion.div>
      </div>

      {/* Auto-scrolling marquee strip */}
      <div
        className="testimonials-wrapper overflow-hidden relative mt-12"
        role="region"
        aria-label={ariaLabel}
        aria-live="off"
      >
        <div className="testimonials-track py-2">
          {Array.isArray(items) &&
            [...items, ...items].map((item, i) => <Card key={i} item={item} />)}
        </div>
      </div>

      <div className="max-w-content mx-auto section-padding mt-8">
        <p className="text-steel-blue text-sm text-center">
          {t("testimonials.fiverr")}
        </p>
      </div>
    </section>
  );
}
