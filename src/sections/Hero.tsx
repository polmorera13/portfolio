import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useVideos } from "../hooks/useVideos";
import { getPublicUrl } from "../lib/supabase";
import { fetchHero } from "../lib/api";
import { HERO_SLOTS, DEFAULT_HERO, type HeroSlotDef, type HeroConfig } from "../data/heroSlots";
import VideoPlayer from "../components/VideoPlayer";
import { videoLabel } from "../data/sectors";

const BLUE = "oklch(58% 0.14 240)";
const STEEL = "oklch(70% 0.07 230)";
const OFFWHITE = "oklch(96% 0.005 240)";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

// ── Fondo de vídeo ──────────────────────────────────────────────────────────
// Vídeo de fondo ("00 - FONDO WEB") servido desde media.polmorera.es. Mudo y en
// bucle infinito, ocupa todo el hero; encima va una capa negra para dar contraste.
const BG_VIDEO = getPublicUrl("hero-bg.mp4");
const BG_POSTER = getPublicUrl("hero-bg.jpg");

function HeroBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <video
        src={BG_VIDEO}
        poster={BG_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Capa negra para que el texto y las casillas resalten */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.65)" }} />
      {/* Fundido arriba (menú) y abajo (paso suave a la siguiente sección) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(13,27,42,0.8) 0%, rgba(13,27,42,0) 16%, rgba(13,27,42,0) 80%, #0D1B2A 100%)",
        }}
      />
    </div>
  );
}

// ── Cluster slots ───────────────────────────────────────────────────────────
// Las 7 casillas (posición/tamaño) viven en data/heroSlots.ts. Qué vídeo va en
// cada una se lee en vivo de la API, editable desde el panel /login.
type ResolvedSlot = HeroSlotDef & {
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
        // ~18% más grande que su columna, creciendo por igual a ambos lados.
        // Las casillas van en %, así que todo escala de forma uniforme.
        position: "relative",
        width: "118%",
        marginLeft: "-9%",
        minHeight: "730px",
        // Las casillas de abajo sobresalen un poco del contenedor: este margen
        // hace que la sección crezca y no pisen la franja de logos en portátiles.
        marginBottom: "48px",
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
  const { t, i18n } = useTranslation();

  const { videos } = useVideos(["corporate", "ads", "organic", "street"]);

  // Asignación casilla → vídeo, en vivo desde la API (editable en /login).
  const [hero, setHero] = useState<HeroConfig>(DEFAULT_HERO);
  useEffect(() => {
    let cancelled = false;
    fetchHero()
      .then((cfg) => { if (!cancelled && cfg && Object.keys(cfg).length) setHero(cfg); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const bySlug = (slug: string | null | undefined) =>
    slug ? videos.find((v) => v.storage_path === slug) : undefined;

  const resolvedSlots: ResolvedSlot[] = HERO_SLOTS.flatMap((s) => {
    const pick = bySlug(hero[String(s.n)]);
    if (!pick) return [];
    return [{
      ...s,
      src: getPublicUrl(pick.storage_path),
      poster: pick.thumbnail_path ? getPublicUrl(pick.thumbnail_path) : null,
      title: pick.title,
      client: videoLabel(pick.category, pick.title, i18n.language, t),
    }];
  });

  return (
    <section
      className="relative flex items-start md:items-center pt-[72px]"
      style={{ minHeight: "100dvh", overflowX: "clip" }}
      aria-label="Hero"
    >
      <HeroBackground />

      <div className="relative max-w-content mx-auto section-padding w-full py-8 md:py-0" style={{ zIndex: 1 }}>
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
            >
              {/* Exactamente dos botones: propuesta y trabajos.
                  id usado por la barra fija de móvil: aparece cuando salen de pantalla. */}
              <div id="hero-ctas" className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#contacto-propuesta"
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
                  href="#portfolio"
                  className="text-center"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    padding: "0.875rem 2rem",
                    borderRadius: "8px",
                    background: "transparent",
                    border: "1px solid oklch(58% 0.14 240 / 0.5)",
                    color: OFFWHITE,
                    textDecoration: "none",
                    transition: "transform 160ms ease-out",
                    display: "inline-block",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}
                >
                  {t("hero.cta_work")}
                </a>
              </div>
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 opacity-30" style={{ zIndex: 1 }}>
        <div className="w-px h-10 bg-steel-blue animate-pulse" />
      </div>
    </section>
  );
}
