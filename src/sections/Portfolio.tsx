import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp, staggerContainer, viewportOnce, ease } from "../lib/motion";
import { useVideos } from "../hooks/useVideos";
import { getPublicUrl } from "../lib/supabase";
import type { VideoCategory } from "../types/video";
import PortfolioSlider from "../components/PortfolioSlider";
import { videoLabel } from "../data/sectors";

type FilterCategory = Exclude<VideoCategory, "hero">;

const FILTER_KEYS: FilterCategory[] = ["ads", "organic", "corporate", "street"];
const FILTER_I18N: Record<FilterCategory, string> = {
  ads: "work.filter_ads",
  organic: "work.filter_organic",
  corporate: "work.filter_corporate",
  street: "work.filter_street",
};

const ASPECT_RATIO: Record<FilterCategory, "9:16" | "16:9"> = {
  ads: "9:16",
  organic: "9:16",
  street: "9:16",
  corporate: "16:9",
};

function SkeletonRow({ wide }: { wide: boolean }) {
  return (
    <div className="flex gap-4 overflow-hidden py-4 section-padding">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="shrink-0"
          style={{
            width: wide ? "clamp(300px, 34vw, 520px)" : "clamp(200px, 17vw, 260px)",
            aspectRatio: wide ? "16/9" : "9/16",
            borderRadius: "12px",
            border: "1px solid oklch(58% 0.14 240 / 0.1)",
            background: "oklch(16% 0.02 240)",
            animation: "skeletonPulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );
}

// ── Portfolio Section ─────────────────────────────────────────────────────────
// Título y pestañas alineados con el resto de la web; debajo, una sola fila de
// vídeos a todo el ancho que avanza sola (ver PortfolioSlider).
export default function Portfolio() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ads");

  const { videos, loading } = useVideos(["ads", "organic", "corporate", "street"]);

  const filtered = videos.filter((v) => v.category === activeFilter);
  const wide = ASPECT_RATIO[activeFilter] === "16:9";

  const items = filtered.map((v) => ({
    id: v.id,
    src: getPublicUrl(v.storage_path),
    poster: v.thumbnail_path ? getPublicUrl(v.thumbnail_path) : null,
    aspectRatio: ASPECT_RATIO[v.category as FilterCategory] ?? "9:16",
    title: v.title,
    client: videoLabel(v.category, v.title, i18n.language, t),
  }));

  return (
    <section id="portfolio" className="section-gap">
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-10"
        >
          {/* Header */}
          <div className="flex flex-col gap-4">
            <motion.span variants={fadeUp} className="eyebrow">
              {t("portfolio.eyebrow")}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              {t("portfolio.title")}
            </motion.h2>
          </div>

          {/* Filter chips */}
          <motion.div
            variants={fadeUp}
            className="flex gap-2 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
            role="tablist"
          >
            {FILTER_KEYS.map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeFilter === key}
                onClick={() => setActiveFilter(key)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === key
                    ? "bg-brand-blue text-off-white"
                    : "border border-charcoal text-steel-blue hover:border-steel-blue/60 hover:text-off-white"
                }`}
              >
                {t(FILTER_I18N[key])}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Fila de vídeos a todo el ancho. Al cambiar de pestaña se desmonta la
          anterior, así que su vídeo deja de sonar. */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            {loading ? (
              <SkeletonRow wide={wide} />
            ) : items.length === 0 ? (
              <p className="text-steel-blue text-sm py-8 text-center">{t("work.empty")}</p>
            ) : (
              <PortfolioSlider items={items} wide={wide} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </section>
  );
}
