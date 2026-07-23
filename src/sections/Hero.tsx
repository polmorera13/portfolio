import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useVideos } from "../hooks/useVideos";
import { getPublicUrl } from "../lib/supabase";
import VideoPlayer from "../components/VideoPlayer";

type Stat = { value: string; label: string };

const BLUE = "oklch(58% 0.14 240)";
const STEEL = "oklch(70% 0.07 230)";
const OFFWHITE = "oklch(96% 0.005 240)";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

// ── Cluster slots ───────────────────────────────────────────────────────────
// 1 horizontal (corporate, centro) + 4 verticales (ads/organic/street, esquinas).
// Disposición tipo collage, ligeramente rotados, montados unos sobre otros.
type Slot = {
  x: string;
  y: string;
  rotate: number;
  width: string;
  z: number;
  dur: string;
  delay: string;
  aspectRatio: "16:9" | "9:16";
  pickFrom: "corporate" | "vertical";
};

const SLOTS: Slot[] = [
  // CORPORATE central — el "núcleo" del collage, los otros orbitan alrededor.
  // Layout MUY compacto: las verticales solapan claramente con el corporate
  // central para que el cluster lea como un grupo apretado, sin huecos.
  { x: "16%", y: "24%", rotate: -2, width: "66%", z: 10, dur: "5.6s", delay: "0s",   aspectRatio: "16:9", pickFrom: "corporate" },
  // Vertical top-left orbit
  { x: "5%",  y: "4%",  rotate: -7, width: "30%", z: 3,  dur: "5.0s", delay: "0.7s", aspectRatio: "9:16", pickFrom: "vertical" },
  // Vertical top-right orbit
  { x: "67%", y: "2%",  rotate:  6, width: "30%", z: 4,  dur: "4.6s", delay: "1.2s", aspectRatio: "9:16", pickFrom: "vertical" },
  // Vertical bottom-left orbit
  { x: "7%",  y: "50%", rotate:  8, width: "31%", z: 5,  dur: "5.2s", delay: "0.4s", aspectRatio: "9:16", pickFrom: "vertical" },
  // Vertical bottom-center (sexto vídeo) — rellena el centro inferior
  { x: "37%", y: "58%", rotate: -3, width: "30%", z: 7,  dur: "5.4s", delay: "1.5s", aspectRatio: "9:16", pickFrom: "vertical" },
  // Vertical bottom-right orbit
  { x: "65%", y: "48%", rotate: -6, width: "32%", z: 6,  dur: "4.8s", delay: "0.9s", aspectRatio: "9:16", pickFrom: "vertical" },
];

type ResolvedSlot = Slot & {
  src: string;
  poster: string | null;
  title: string | null;
  client: string | null;
};

function HeroCluster({ slots }: { slots: ResolvedSlot[] }) {
  return (
    <div
      className="hero-video-cluster"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "620px",
      }}
    >
      {slots.map((s, i) => (
        <div
          key={i}
          className="hero-video-slot"
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: s.width,
            zIndex: s.z,
            ["--r" as string]: `${s.rotate}deg`,
            ["--dur" as string]: s.dur,
            ["--delay" as string]: s.delay,
          }}
        >
          <div className="hero-video-inner">
            <VideoPlayer
              src={s.src}
              poster={s.poster}
              aspectRatio={s.aspectRatio}
              title={s.title}
              client={s.client}
              loop
            />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes hero-video-float {
          0%, 100% { translate: 0 0; }
          50%      { translate: 0 -6px; }
        }
        .hero-video-slot {
          transform: rotate(var(--r, 0deg));
          animation: hero-video-float var(--dur, 5s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
          transition: transform 380ms cubic-bezier(0.19, 1, 0.22, 1);
          will-change: transform;
        }
        .hero-video-slot:hover {
          z-index: 100 !important;
        }
        .hero-video-inner {
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 18px 44px oklch(12% 0.025 240 / 0.55),
            0 0 0 1px oklch(58% 0.14 240 / 0.12);
          transition: box-shadow 320ms cubic-bezier(0.19, 1, 0.22, 1);
        }
        .hero-video-slot:hover .hero-video-inner {
          box-shadow:
            0 28px 64px oklch(12% 0.025 240 / 0.75),
            0 0 0 1px oklch(58% 0.14 240 / 0.25);
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-video-slot { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function HeroClusterMobile({ slots }: { slots: ResolvedSlot[] }) {
  // En mobile: layout simplificado, vertical, todos visibles
  const horizontal = slots.filter((s) => s.aspectRatio === "16:9").slice(0, 1);
  const vertical = slots.filter((s) => s.aspectRatio === "9:16").slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
      {/* Horizontal grande arriba */}
      {horizontal.map((s, i) => (
        <div
          key={`h-${i}`}
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 12px 32px oklch(12% 0.025 240 / 0.5)",
          }}
        >
          <VideoPlayer
            src={s.src}
            poster={s.poster}
            aspectRatio="16:9"
            title={s.title}
            client={s.client}
            loop
          />
        </div>
      ))}
      {/* 3 verticales en fila */}
      <div style={{ display: "flex", gap: "8px", width: "100%" }}>
        {vertical.map((s, i) => (
          <div
            key={`v-${i}`}
            style={{
              flex: "1 1 0",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 8px 20px oklch(12% 0.025 240 / 0.45)",
            }}
          >
            <VideoPlayer
              src={s.src}
              poster={s.poster}
              aspectRatio="9:16"
              title={s.title}
              client={s.client}
              loop
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useTranslation();
  const stats = t("hero.stats", { returnObjects: true }) as Stat[];

  const { videos } = useVideos(["corporate", "ads", "organic", "street"]);

  // ── Selección explícita de los vídeos del hero ──────────────────────────────
  // Centro (grande, horizontal) + 5 verticales orbitando. Se define por nombre
  // de archivo para tener control total. Orden de SLOTS:
  //   [centro, arriba-izq, arriba-dcha, abajo-izq, abajo-centro, abajo-dcha]
  const HERO_CENTER = "reactiva-vsl-terminado-v3-compressed.mp4";
  const HERO_VERTICALS = [
    "axa-1.mp4",                                                     // arriba-izq
    "pol-morera-x-creator-studio-2.mp4",                            // arriba-dcha
    "snapinsta-to-aqoqrbocpovfexjo7z-8alzmomebarhwmrsqd6ve31uzzmy.mp4", // abajo-izq
    "bezoya-04-26-compressed.mp4",                                  // abajo-centro
    "dogfy-diet-oct-25-1-1-1.mp4",                                  // abajo-dcha
  ];

  const bySlug = (slug: string) => videos.find((v) => v.storage_path === slug);

  const heroOrder = [HERO_CENTER, ...HERO_VERTICALS];
  const resolvedSlots: ResolvedSlot[] = SLOTS.flatMap((s, i) => {
    const pick = bySlug(heroOrder[i]);
    if (!pick) return [];
    return [{
      ...s,
      src: getPublicUrl(pick.storage_path),
      poster: pick.thumbnail_path ? getPublicUrl(pick.thumbnail_path) : null,
      title: pick.title,
      client: pick.client,
    }];
  });

  return (
    <section
      className="relative flex items-start md:items-center pt-[72px]"
      style={{ minHeight: "100dvh" }}
      aria-label="Hero"
    >
      <div className="max-w-content mx-auto section-padding w-full py-8 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-8 md:gap-12 lg:gap-16 items-center">

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
              transition={{ duration: 0.36, ease, delay: 0.5 }}
              style={{
                marginTop: "1.75rem",
                marginBottom: "0.5rem",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 300,
                fontSize: "0.75rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: STEEL,
                opacity: 0.75,
              }}
            >
              {t("hero.trusted_by")}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.36, ease, delay: 0.56 }}
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "baseline",
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

          {/* Video collage — below text on mobile, right column on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
            className="order-2 md:order-2"
          >
            {/* Desktop: scattered video collage */}
            <div className="hidden md:block">
              <HeroCluster slots={resolvedSlots} />
            </div>
            {/* Mobile: compact stacked layout */}
            <div className="block md:hidden">
              <HeroClusterMobile slots={resolvedSlots} />
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
