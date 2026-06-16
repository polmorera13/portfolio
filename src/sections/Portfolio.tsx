import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp, staggerContainer, viewportOnce, ease } from "../lib/motion";
import { useVideos } from "../hooks/useVideos";
import { getPublicUrl } from "../lib/supabase";
import type { VideoCategory } from "../types/video";
import VideoPlayer from "../components/VideoPlayer";

type FilterCategory = VideoCategory;

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

// Cards per row, per breakpoint, per category.
// Vertical categories use 5 columns so they read like a wall. Corporate uses
// 3 columns because the 16:9 ratio makes each card much wider, and we want
// them to read big rather than tiny.
const COLS_DESKTOP: Record<FilterCategory, number> = {
  ads: 5,
  organic: 5,
  street: 5,
  corporate: 3,
};

function SkeletonCard({ ar }: { ar: "9:16" | "16:9" }) {
  return (
    <div
      style={{
        aspectRatio: ar === "9:16" ? "9/16" : "16/9",
        borderRadius: "12px",
        border: "1px solid oklch(58% 0.14 240 / 0.1)",
        background: "oklch(16% 0.02 240)",
        width: "100%",
        animation: "skeletonPulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

// ── Grid ─────────────────────────────────────────────────────────────────────
interface GridProps {
  items: Array<{
    id: string;
    src: string;
    poster: string | null;
    aspectRatio: "9:16" | "16:9";
    title: string | null;
    client: string | null;
  }>;
  category: FilterCategory;
}

function PortfolioGrid({ items, category }: GridProps) {
  const cols = COLS_DESKTOP[category];
  const gap = category === "corporate" ? "20px" : "16px";

  return (
    <div
      className="portfolio-grid"
      data-cat={category}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap,
      }}
    >
      {items.map((item) => (
        <div key={item.id} style={{ width: "100%" }}>
          <VideoPlayer
            src={item.src}
            poster={item.poster}
            aspectRatio={item.aspectRatio}
            title={item.title}
            client={item.client}
            loop
          />
        </div>
      ))}

      <style>{`
        /* Vertical categories: 5 cols desktop → 4 → 3 → 2 → 1 */
        .portfolio-grid[data-cat="ads"],
        .portfolio-grid[data-cat="organic"],
        .portfolio-grid[data-cat="street"] {
          /* default 5 cols set inline */
        }
        @media (max-width: 1200px) {
          .portfolio-grid[data-cat="ads"],
          .portfolio-grid[data-cat="organic"],
          .portfolio-grid[data-cat="street"] {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 900px) {
          .portfolio-grid[data-cat="ads"],
          .portfolio-grid[data-cat="organic"],
          .portfolio-grid[data-cat="street"] {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .portfolio-grid[data-cat="ads"],
          .portfolio-grid[data-cat="organic"],
          .portfolio-grid[data-cat="street"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
        }

        /* Corporate: 3 cols desktop → 2 → 1 */
        @media (max-width: 1000px) {
          .portfolio-grid[data-cat="corporate"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .portfolio-grid[data-cat="corporate"] {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Portfolio Section ─────────────────────────────────────────────────────────
export default function Portfolio() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ads");

  const { videos, loading } = useVideos(["ads", "organic", "corporate", "street"]);

  const filtered = videos.filter((v) => v.category === activeFilter);
  const ar = ASPECT_RATIO[activeFilter];

  const gridItems = filtered.map((v) => ({
    id: v.id,
    src: getPublicUrl(v.storage_path),
    poster: v.thumbnail_path ? getPublicUrl(v.thumbnail_path) : null,
    aspectRatio: ASPECT_RATIO[v.category as FilterCategory] ?? "9:16",
    title: v.title,
    client: v.client,
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
          >
            {FILTER_KEYS.map((key) => (
              <button
                key={key}
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

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
            >
              {loading ? (
                <div
                  className="portfolio-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${COLS_DESKTOP[activeFilter]}, minmax(0, 1fr))`,
                    gap: activeFilter === "corporate" ? "20px" : "16px",
                  }}
                >
                  {Array.from({ length: COLS_DESKTOP[activeFilter] }).map((_, i) => (
                    <SkeletonCard key={i} ar={ar} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-steel-blue text-sm py-8 text-center">
                  {t("work.empty")}
                </p>
              ) : (
                <PortfolioGrid items={gridItems} category={activeFilter} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </section>
  );
}
