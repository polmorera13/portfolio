import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useVideos } from "../hooks/useVideos";
import { getPublicUrl } from "../lib/supabase";

type Stat = { value: string; label: string };

const BLUE = "oklch(58% 0.14 240)";
const STEEL = "oklch(70% 0.07 230)";
const OFFWHITE = "oklch(96% 0.005 240)";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

type SlotConfig = {
  x: string;
  y: string;
  rotate: number;
  width: string;
  z: number;
  dur: string;
  delay: string;
  // mobileRow: which row (0 = top strip, 1 = bottom strip) or null = desktop only
  // mobileCol: position within row
  mobileRow: number | null;
  mobileCol: number;
};

// Desktop: absolute positioned collage
// Mobile: 2-row compact strip — top row has 3 images, bottom row has 4 images
const SLOTS: SlotConfig[] = [
  { x: "2%",  y: "3%",  rotate: -4, width: "200px", z: 1, dur: "5.2s", delay: "0s",   mobileRow: 0, mobileCol: 0 },
  { x: "38%", y: "0%",  rotate:  3, width: "175px", z: 2, dur: "4.6s", delay: "0.7s", mobileRow: 0, mobileCol: 1 },
  { x: "64%", y: "5%",  rotate: -3, width: "175px", z: 7, dur: "4.4s", delay: "1.6s", mobileRow: 0, mobileCol: 2 },
  { x: "60%", y: "36%", rotate: -2, width: "195px", z: 3, dur: "5.6s", delay: "1.3s", mobileRow: 1, mobileCol: 0 },
  { x: "6%",  y: "44%", rotate:  5, width: "185px", z: 4, dur: "4.8s", delay: "0.4s", mobileRow: 1, mobileCol: 1 },
  { x: "28%", y: "32%", rotate: -2, width: "190px", z: 6, dur: "5.0s", delay: "0.5s", mobileRow: 1, mobileCol: 2 },
  { x: "44%", y: "58%", rotate: -3, width: "215px", z: 5, dur: "5.4s", delay: "1.0s", mobileRow: 1, mobileCol: 3 },
];

function HeroCluster({ images }: { images: Array<{ slot: number; src: string; alt: string }> }) {
  const [active, setActive] = useState<number | null>(null);

  const bySlot: Record<number, { src: string; alt: string }> = {};
  images.forEach((img) => { bySlot[img.slot] = { src: img.src, alt: img.alt }; });

  return (
    <div
      className="hero-cluster"
      onMouseLeave={() => setActive(null)}
      style={{ position: "relative", width: "100%", minHeight: "700px" }}
    >
      {SLOTS.map((s, i) => {
        const slotNum = i + 1;
        const entry = bySlot[slotNum];
        if (!entry) return null;
        const isActive = active === i;
        const isDimmed = active !== null && !isActive;
        const distance = active !== null ? Math.abs(i - active) : 0;
        const dimDelay = isDimmed ? Math.min(distance * 35, 140) : 0;

        const slotCls = [
          "hero-image-slot",
          `hero-slot-mr${s.mobileRow ?? "x"}`,
          `hero-slot-mc${s.mobileCol}`,
          isActive ? "is-active" : "",
          isDimmed ? "is-dimmed" : "",
        ].filter(Boolean).join(" ");

        return (
          <div
            key={i}
            className={slotCls}
            onMouseEnter={() => setActive(i)}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: s.width,
              zIndex: isActive ? 100 : s.z,
              ["--r" as string]: `${s.rotate}deg`,
              ["--dur" as string]: s.dur,
              ["--delay" as string]: s.delay,
              transitionDelay: `${dimDelay}ms`,
            }}
          >
            <img
              src={entry.src}
              alt={entry.alt}
              draggable={false}
              loading="eager"
            />
          </div>
        );
      })}

      <style>{`
        @keyframes hero-float {
          0%, 100% { translate: 0 0; }
          50%      { translate: 0 -6px; }
        }
        .hero-image-slot {
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transform: rotate(var(--r, 0deg));
          animation: hero-float var(--dur, 5s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
          box-shadow:
            0 14px 36px oklch(12% 0.025 240 / 0.5),
            0 0 0 1px oklch(58% 0.14 240 / 0.08);
          transition:
            transform 520ms cubic-bezier(0.19, 1, 0.22, 1),
            filter    520ms cubic-bezier(0.19, 1, 0.22, 1),
            opacity   520ms cubic-bezier(0.19, 1, 0.22, 1),
            box-shadow 480ms cubic-bezier(0.19, 1, 0.22, 1);
          will-change: transform, filter;
        }
        .hero-image-slot:not(.is-active):not(.is-dimmed) {
          transition-duration: 320ms;
          transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
        }
        .hero-image-slot img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 14px;
        }
        .hero-image-slot.is-active {
          transform: rotate(var(--r, 0deg)) scale(1.08);
          box-shadow:
            0 24px 60px oklch(12% 0.025 240 / 0.7),
            0 0 0 1px oklch(58% 0.14 240 / 0.15);
        }
        .hero-image-slot.is-dimmed {
          filter: blur(7px) saturate(0.85);
          opacity: 0.45;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-image-slot { animation: none !important; }
        }

        /* ── Mobile collage: two compact rows ── */
        @media (max-width: 767px) {
          .hero-cluster {
            min-height: 0 !important;
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 6px !important;
            padding: 0 !important;
          }

          /* All slots become static, fixed-height cards */
          .hero-image-slot {
            position: static !important;
            width: auto !important;
            animation: none !important;
            filter: none !important;
            opacity: 1 !important;
            transform: rotate(var(--r, 0deg)) !important;
            border-radius: 10px !important;
            flex-shrink: 0;
          }
          .hero-image-slot img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 10px !important;
          }
          .hero-image-slot.is-active {
            transform: rotate(var(--r, 0deg)) scale(1.03) !important;
          }

          /* Row containers via a CSS trick — group by mobileRow using pseudo-sibling layout */
          /* Top row: slots with mobileRow=0 — 3 images, equal width */
          .hero-cluster-row-top,
          .hero-cluster-row-bottom {
            display: flex;
            gap: 6px;
            width: 100%;
          }

          .hero-slot-mr0 {
            height: 110px;
            flex: 1 1 0;
          }
          .hero-slot-mr1 {
            height: 100px;
            flex: 1 1 0;
          }
          .hero-slot-mrx {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// Mobile wrapper that reorganises slots into two row divs
function HeroClusterMobile({ images }: { images: Array<{ slot: number; src: string; alt: string }> }) {
  const bySlot: Record<number, { src: string; alt: string }> = {};
  images.forEach((img) => { bySlot[img.slot] = { src: img.src, alt: img.alt }; });

  const row0 = SLOTS.map((s, i) => ({ s, i, slotNum: i + 1 })).filter(({ s }) => s.mobileRow === 0);
  const row1 = SLOTS.map((s, i) => ({ s, i, slotNum: i + 1 })).filter(({ s }) => s.mobileRow === 1);

  const renderSlot = ({ s, i, slotNum }: { s: SlotConfig; i: number; slotNum: number }) => {
    const entry = bySlot[slotNum];
    if (!entry) return null;
    return (
      <div
        key={i}
        style={{
          flex: "1 1 0",
          borderRadius: "10px",
          overflow: "hidden",
          transform: `rotate(${s.rotate}deg)`,
          boxShadow: "0 8px 24px oklch(12% 0.025 240 / 0.45), 0 0 0 1px oklch(58% 0.14 240 / 0.08)",
        }}
      >
        <img
          src={entry.src}
          alt={entry.alt}
          draggable={false}
          loading="eager"
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      {/* Row of 4 first (visually on top) */}
      <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
        {row1.map(renderSlot)}
      </div>
      {/* Row of 3 below — each image slightly narrower so they read as smaller */}
      <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", paddingLeft: "6%", paddingRight: "6%" }}>
        {row0.map(renderSlot)}
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useTranslation();
  const stats = t("hero.stats", { returnObjects: true }) as Stat[];
  const { videos } = useVideos("hero");

  const heroImages = videos
    .filter((v) => v.media_type === "image" && v.slot != null)
    .sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0))
    .map((v) => ({
      slot: v.slot!,
      src: getPublicUrl(v.storage_path),
      alt: v.title ?? `Hero image slot ${v.slot}`,
    }));

  return (
    <section
      className="relative flex items-start md:items-center pt-[72px]"
      style={{ minHeight: "100dvh" }}
      aria-label="Hero"
    >
      <div className="max-w-content mx-auto section-padding w-full py-8 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 md:gap-12 lg:gap-16 items-center">

          {/* Text block — always first on mobile */}
          <div className="flex flex-col order-1 md:order-1">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18, delay: 0 }}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 300,
                fontSize: "0.8125rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: STEEL,
                marginBottom: "1rem",
              }}
            >
              {t("hero.eyebrow")}
            </motion.span>

            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2.25rem, 8vw, 7rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.0,
                color: OFFWHITE,
                marginBottom: "1rem",
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, ease, delay: 0.08 }}
                style={{ display: "block" }}
              >
                {t("hero.h1_line1")}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, ease, delay: 0.16 }}
                style={{ display: "block", color: BLUE }}
              >
                {t("hero.h1_line2")}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, ease, delay: 0.28 }}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: "1.0625rem",
                lineHeight: 1.6,
                color: STEEL,
                maxWidth: "65ch",
                marginBottom: "1.5rem",
              }}
            >
              {t("hero.tagline")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a
                href="#portfolio"
                className="text-center"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "0.875rem 2rem",
                  borderRadius: "8px",
                  background: BLUE,
                  color: OFFWHITE,
                  textDecoration: "none",
                  transition: "transform 160ms ease-out",
                  display: "inline-block",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                {t("hero.cta_primary")}
              </a>
              <a
                href="#contacto"
                className="text-center"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "0.875rem 2rem",
                  borderRadius: "8px",
                  background: "transparent",
                  color: BLUE,
                  textDecoration: "none",
                  transition: "transform 160ms ease-out",
                  display: "inline-block",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                {t("hero.cta_secondary")}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.36, ease, delay: 0.56 }}
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "baseline",
                marginTop: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              {Array.isArray(stats) && stats.map((stat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
                  {i > 0 && (
                    <span style={{ color: STEEL, opacity: 0.4, marginRight: "0.375rem", fontSize: "0.875rem" }}>·</span>
                  )}
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: OFFWHITE,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: "0.9375rem",
                      color: STEEL,
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Collage — below text on mobile, right column on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
            className="order-2 md:order-2"
          >
            {/* Desktop: floating absolute collage */}
            <div className="hidden md:block">
              <HeroCluster images={heroImages} />
            </div>
            {/* Mobile: compact two-row strip */}
            <div className="block md:hidden">
              <HeroClusterMobile images={heroImages} />
            </div>
          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-10 bg-steel-blue animate-pulse" />
      </div>
    </section>
  );
}
