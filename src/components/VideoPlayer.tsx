import { useRef, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Play,
  Pause,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
} from "@phosphor-icons/react";

// ── Global registry: only one video plays at a time ─────────────────────────
type StopFn = () => void;
const registry = new Set<StopFn>();

function registerPlayer(stop: StopFn): () => void {
  registry.add(stop);
  return () => registry.delete(stop);
}

function stopOthers(exclude: StopFn) {
  registry.forEach((fn) => {
    if (fn !== exclude) fn();
  });
}

// ── Tab-visibility pause ─────────────────────────────────────────────────────
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") {
      registry.forEach((fn) => fn());
    }
  });
}

// ── Types ────────────────────────────────────────────────────────────────────
interface VideoPlayerProps {
  src: string;
  poster?: string | null;
  aspectRatio: "9:16" | "16:9";
  title?: string | null;
  client?: string | null;
  loop?: boolean;
  autoPlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const BRAND_BLUE = "oklch(58% 0.14 240)";
const OFFWHITE = "oklch(96% 0.005 240)";
const STEEL = "oklch(70% 0.07 230)";
const STRIP_BG = "linear-gradient(to top, oklch(12% 0.025 240 / 0.85) 0%, transparent 100%)";
// Wider gradient covering bottom half of card for idle label legibility
const LABEL_GRADIENT = "linear-gradient(to top, oklch(12% 0.025 240 / 0.7) 0%, transparent 50%)";

export default function VideoPlayer({
  src,
  poster,
  aspectRatio,
  title,
  client,
  loop = true,
  autoPlay = false,
  className = "",
  style,
}: VideoPlayerProps) {
  const { t } = useTranslation();

  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const manualControlRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [barHovered, setBarHovered] = useState(false);

  // ── Stop function registered globally ──────────────────────────────────────
  const stopFn = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    setIsPlaying(false);
    manualControlRef.current = false;
  }, []);

  useEffect(() => {
    const unregister = registerPlayer(stopFn);
    return unregister;
  }, [stopFn]);

  // ── RAF progress updater ───────────────────────────────────────────────────
  const scheduleRaf = useCallback(() => {
    const tick = () => {
      if (!videoRef.current) return;
      const { currentTime, duration } = videoRef.current;
      if (duration > 0) setProgress(currentTime / duration);
      if (!videoRef.current.paused) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ── Play / Pause helpers ────────────────────────────────────────────────────
  const play = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    stopOthers(stopFn);
    el.play().catch(() => {});
    setIsPlaying(true);
    scheduleRaf();
  }, [stopFn, scheduleRaf]);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setIsPlaying(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Hover behavior ──────────────────────────────────────────────────────────
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (!manualControlRef.current) {
      setIsMuted(true);
      if (videoRef.current) videoRef.current.muted = true;
      play();
    }
  }, [play]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (!manualControlRef.current) {
      pause();
    }
    manualControlRef.current = false;
    setIsMuted(true);
    if (videoRef.current) videoRef.current.muted = true;
  }, [pause]);

  // ── Control handlers ────────────────────────────────────────────────────────
  const handlePlayPause = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      manualControlRef.current = true;
      if (isPlaying) pause();
      else play();
    },
    [isPlaying, play, pause],
  );

  const handleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    manualControlRef.current = true;
    const el = videoRef.current;
    if (!el) return;
    const next = !el.muted;
    el.muted = next;
    if (!next) el.volume = 1.0;
    setIsMuted(next);
  }, []);

  // ── Seek on progress bar ────────────────────────────────────────────────────
  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    setProgress(ratio);
    manualControlRef.current = true;
  }, []);

  const handleBarMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      isDraggingRef.current = true;
      seek(e);

      const onMove = (ev: MouseEvent) => {
        if (!isDraggingRef.current || !videoRef.current?.duration) return;
        const bar = (e.target as HTMLElement).closest("[data-progressbar]") as HTMLElement | null;
        if (!bar) return;
        const rect = bar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
        videoRef.current.currentTime = ratio * videoRef.current.duration;
        setProgress(ratio);
      };
      const onUp = () => {
        isDraggingRef.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [seek],
  );

  // ── Keyboard handling ────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const el = videoRef.current;
      if (!el) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        manualControlRef.current = true;
        if (isPlaying) pause();
        else play();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        manualControlRef.current = true;
        el.muted = !el.muted;
        if (!el.muted) el.volume = 1.0;
        setIsMuted(el.muted);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        manualControlRef.current = true;
        el.currentTime = Math.max(0, el.currentTime - 5);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        manualControlRef.current = true;
        el.currentTime = Math.min(el.duration || 0, el.currentTime + 5);
      }
    },
    [isPlaying, play, pause],
  );

  const arLabel = title ?? client ?? (aspectRatio === "9:16" ? "Vertical video" : "Horizontal video");
  const hasLabel = !!(title || client);

  return (
    <div
      className={`vp-card ${className}`}
      style={{
        aspectRatio: aspectRatio === "9:16" ? "9/16" : "16/9",
        borderRadius: "12px",
        position: "relative",
        cursor: "pointer",
        outline: "none",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        transition: "transform 480ms cubic-bezier(0.19, 1, 0.22, 1)",
        zIndex: isHovered ? 10 : 1,
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-label={arLabel}
    >
      {/* Inner clip frame */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid oklch(58% 0.14 240 / 0.15)",
      }}>
      {/* Poster */}
      {poster && (
        <img
          src={poster}
          alt=""
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 300ms",
            opacity: isPlaying ? 0 : 1,
          }}
        />
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        preload="metadata"
        playsInline
        muted={isMuted}
        loop={loop}
        controls={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isPlaying ? 1 : 0,
          transition: "opacity 300ms",
        }}
      />

      {/* Idle gradient + labels — bottom-left, fades out on hover */}
      {hasLabel && (
        <>
          {/* Bottom-up gradient for label legibility */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: LABEL_GRADIENT,
              pointerEvents: "none",
              opacity: isHovered ? 0 : 1,
              transition: "opacity 200ms ease-out",
              zIndex: 1,
            }}
          />
          {/* Labels */}
          <div
            className="vp-labels"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "0 16px 16px",
              pointerEvents: "none",
              opacity: isHovered ? 0 : 1,
              transition: "opacity 200ms ease-out",
              zIndex: 2,
            }}
          >
            {title && (
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: OFFWHITE,
                  lineHeight: 1.2,
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </p>
            )}
            {client && (
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.8125rem",
                  color: STEEL,
                  lineHeight: 1.3,
                  margin: "4px 0 0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {client}
              </p>
            )}
          </div>
        </>
      )}

      {/* Controls strip — fades in on hover */}
      <div
        style={{
          position: "absolute",
          insetBlockEnd: 0,
          insetInline: 0,
          height: "48px",
          background: STRIP_BG,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 16px",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 200ms ease-out",
          pointerEvents: isHovered ? "auto" : "none",
          zIndex: 3,
        }}
      >
        {/* Play / Pause */}
        <button
          onClick={handlePlayPause}
          aria-label={isPlaying ? t("player.pause") : t("player.play")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: OFFWHITE,
            flexShrink: 0,
            borderRadius: "4px",
            outline: "none",
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.92)"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
          className="focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2"
        >
          {isPlaying ? (
            <Pause size={20} weight="fill" color={OFFWHITE} />
          ) : (
            <Play size={20} weight="fill" color={OFFWHITE} />
          )}
        </button>

        {/* Progress bar */}
        <div
          data-progressbar
          onMouseDown={handleBarMouseDown}
          onMouseEnter={() => setBarHovered(true)}
          onMouseLeave={() => setBarHovered(false)}
          style={{
            flex: 1,
            position: "relative",
            height: barHovered ? "4px" : "2px",
            transition: "height 160ms ease-out",
            background: "oklch(96% 0.005 240 / 0.2)",
            borderRadius: "9999px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress * 100}%`,
              background: BRAND_BLUE,
              borderRadius: "9999px",
              pointerEvents: "none",
            }}
          />
          {barHovered && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: `${progress * 100}%`,
                transform: "translate(-50%, -50%)",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: BRAND_BLUE,
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* Mute */}
        <button
          onClick={handleMute}
          aria-label={isMuted ? t("player.unmute") : t("player.mute")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: OFFWHITE,
            flexShrink: 0,
            borderRadius: "4px",
            outline: "none",
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.92)"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
          className="focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2"
        >
          {isMuted ? (
            <SpeakerSimpleSlash size={20} weight="fill" color={OFFWHITE} />
          ) : (
            <SpeakerSimpleHigh size={20} weight="fill" color={OFFWHITE} />
          )}
        </button>
      </div>

      </div>{/* end inner clip frame */}

      <style>{`
        .vp-card:focus-visible { outline: 1px solid ${BRAND_BLUE}; outline-offset: 2px; }
        button.focus-visible\\:outline:focus-visible { outline: 1px solid ${BRAND_BLUE}; outline-offset: 2px; }
        @media (max-width: 640px) {
          .vp-labels { padding: 0 12px 12px !important; }
          .vp-labels p:first-child { font-size: 0.875rem !important; }
          .vp-labels p:last-child { font-size: 0.75rem !important; }
        }
      `}</style>
    </div>
  );
}
