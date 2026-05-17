import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
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

// Visible card counts per category (desktop)
const VISIBLE_DESKTOP: Record<FilterCategory, number> = {
  ads: 5,
  organic: 5,
  corporate: 3,
  street: 3,
};

const BLUE = "oklch(58% 0.14 240)";
const OFFWHITE = "oklch(96% 0.005 240)";
const STEEL = "oklch(70% 0.07 230)";
const NAVY = "oklch(10% 0.025 240)";

function SkeletonCard({ ar }: { ar: "9:16" | "16:9" }) {
  return (
    <div
      style={{
        aspectRatio: ar === "9:16" ? "9/16" : "16/9",
        borderRadius: "12px",
        border: "1px solid oklch(58% 0.14 240 / 0.1)",
        background: "oklch(16% 0.02 240)",
        flexShrink: 0,
        width: "100%",
        animation: "skeletonPulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

// ── Carousel ─────────────────────────────────────────────────────────────────
interface CarouselProps {
  items: Array<{ id: string; src: string; poster: string | null; aspectRatio: "9:16" | "16:9"; title: string | null; client: string | null }>;
  category: FilterCategory;
}

function Carousel({ items, category }: CarouselProps) {
  const { t } = useTranslation();
  const [offsetIndex, setOffsetIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  // pendingDelta: +1 (right) or -1 (left), triggers the CSS transition
  const [pendingDelta, setPendingDelta] = useState<0 | 1 | -1>(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive visible count via ResizeObserver
  const [visibleCount, setVisibleCount] = useState(VISIBLE_DESKTOP[category]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    function update() {
      const w = el!.offsetWidth;
      const base = VISIBLE_DESKTOP[category];
      let count = base;
      if (category === "ads" || category === "organic") {
        if (w < 640) count = 2;
        else if (w < 900) count = 3;
        else if (w < 1200) count = 4;
        else count = 5;
      } else {
        if (w < 640) count = 1;
        else if (w < 1000) count = 2;
        else count = 3;
      }
      setVisibleCount(count);
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [category]);

  // Reset offset when category changes
  useEffect(() => {
    setOffsetIndex(0);
    setPendingDelta(0);
    setTransitioning(false);
  }, [category]);

  const n = items.length;
  const hideArrows = n <= visibleCount;

  // Build the display array: items rotated by offsetIndex
  const rotated = [...items.slice(offsetIndex), ...items.slice(0, offsetIndex)];

  // We render visibleCount + 1 extra on each side so we can slide in/out cleanly.
  // For a seamless circular feel we show exactly visibleCount items, with one
  // off-screen clone on each side for the slide animation.
  const displayed = rotated.slice(0, visibleCount + 1);

  const cardGap = category === "corporate" || category === "street" ? 24 : 16;

  function slide(delta: 1 | -1) {
    if (transitioning || hideArrows) return;
    setTransitioning(true);
    setPendingDelta(delta);
  }

  function handleTransitionEnd() {
    if (pendingDelta === 0) return;
    // Commit the rotation: update offsetIndex and reset transform instantly
    setOffsetIndex((prev) => (prev + pendingDelta + n) % n);
    setPendingDelta(0);
    setTransitioning(false);
  }

  // Keyboard
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") { e.preventDefault(); slide(1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); slide(-1); }
  }

  // cardWidth as a percentage of the carousel width
  // gap pixels eat into the available space. We express this as:
  //   cardWidth = (100% - (visibleCount - 1) * gap) / visibleCount
  // In CSS: calc((100% - N*gap) / visibleCount) where N = visibleCount - 1
  const cardWidthCalc = `calc((100% - ${(visibleCount - 1) * cardGap}px) / ${visibleCount})`;

  // translateX when sliding:
  // one card = cardWidth + gap = (100% / visibleCount) exactly when using CSS widths
  // We compute pixel offset via a CSS calc:
  //   one slot = (100% + gap) / visibleCount   ... but this is complex
  // Simpler: we use a wrapper that's (visibleCount+1) slots wide, clip to visibleCount.
  // Transform = delta * -(cardWidthCalc + gap)
  const slideDistance = `calc((100% + ${cardGap}px) / ${visibleCount})`;
  const translateX = pendingDelta === 0
    ? "0px"
    : pendingDelta === 1
      ? `calc(-1 * ${slideDistance})`
      : slideDistance;

  return (
    /* Outer wrapper: relative so absolute arrows can escape the clip layer,
       horizontal padding reserves space for the arrows on each side */
    <div
      ref={carouselRef}
      style={{ position: "relative", padding: "0 56px" }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Overflow clip — only the track clips, not the arrow space */}
      <div style={{ overflow: "hidden", padding: "8px 0" }}>
        {/* Sliding track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: `${cardGap}px`,
            transform: `translate3d(${translateX}, 0, 0)`,
            transition: transitioning
              ? "transform 320ms cubic-bezier(0.23, 1, 0.32, 1)"
              : "none",
            willChange: "transform",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {displayed.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              style={{ flexShrink: 0, width: cardWidthCalc }}
            >
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
        </div>
      </div>

      {/* Left arrow — outside the grid on the left */}
      {!hideArrows && (
        <ArrowBtn
          dir="left"
          onClick={() => slide(-1)}
          disabled={transitioning}
          ariaLabel={t("carousel.prev")}
          style={{ position: "absolute", top: "50%", left: "0", transform: "translateY(-50%)" }}
        />
      )}

      {/* Right arrow — outside the grid on the right */}
      {!hideArrows && (
        <ArrowBtn
          dir="right"
          onClick={() => slide(1)}
          disabled={transitioning}
          ariaLabel={t("carousel.next")}
          style={{ position: "absolute", top: "50%", right: "0", transform: "translateY(-50%)" }}
        />
      )}
    </div>
  );
}

function ArrowBtn({
  dir,
  onClick,
  disabled,
  ariaLabel,
  style: extraStyle,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        width: "clamp(36px, 5vw, 44px)",
        height: "clamp(36px, 5vw, 44px)",
        borderRadius: "50%",
        backgroundColor: "oklch(96% 0.005 240 / 0.08)",
        border: "1px solid oklch(96% 0.005 240 / 0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: OFFWHITE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        transition: "background-color 200ms ease-out, border-color 200ms ease-out, transform 160ms ease-out",
        flexShrink: 0,
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const el = e.currentTarget as HTMLElement;
          el.style.backgroundColor = "oklch(58% 0.14 240 / 0.18)";
          el.style.borderColor = "oklch(58% 0.14 240 / 0.45)";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = "oklch(96% 0.005 240 / 0.08)";
        el.style.borderColor = "oklch(96% 0.005 240 / 0.15)";
        el.style.transform = "scale(1)";
      }}
      onMouseDown={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.transform = "scale(0.94)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
    >
      {dir === "left"
        ? <CaretLeft size={18} weight="bold" color={OFFWHITE} />
        : <CaretRight size={18} weight="bold" color={OFFWHITE} />
      }
    </button>
  );
}

// ── Portfolio Section ─────────────────────────────────────────────────────────
export default function Portfolio() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ads");

  const { videos, loading } = useVideos(["ads", "organic", "corporate", "street"]);

  const filtered = videos.filter((v) => v.category === activeFilter);
  const ar = ASPECT_RATIO[activeFilter];

  const carouselItems = filtered.map((v) => ({
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

          {/* Carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              style={{ position: "relative" }}
            >
              {loading ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${VISIBLE_DESKTOP[activeFilter]}, 1fr)`,
                    gap: activeFilter === "corporate" || activeFilter === "street" ? "24px" : "16px",
                  }}
                >
                  {Array.from({ length: VISIBLE_DESKTOP[activeFilter] }).map((_, i) => (
                    <SkeletonCard key={i} ar={ar} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-steel-blue text-sm py-8 text-center">
                  {t("work.empty")}
                </p>
              ) : (
                <Carousel items={carouselItems} category={activeFilter} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </section>
  );
}
