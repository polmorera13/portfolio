import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../lib/i18n";
import { Play, SpeakerSimpleHigh, SpeakerSimpleSlash } from "@phosphor-icons/react";
import { getPublicUrl } from "../lib/supabase";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Vídeo del servicio abierto en "Qué produzco".
 * - Mudo, en bucle; solo se reproduce mientras está en pantalla.
 * - "Activar sonido" quita el silencio y lo reinicia. Al cambiar de vídeo vuelve a empezar mudo.
 * - Con "reducir movimiento" no arranca solo: muestra la miniatura y un botón de play.
 * - Fundido corto al cambiar de servicio. Recorte centrado (object-fit: cover).
 */
export default function ServiceVideo({
  file,
  aspect,
  className = "",
  style,
  indexable = false,
  ariaName,
  poster: posterPath,
}: {
  file: string;
  /** Miniatura (ruta en media.polmorera.es); por defecto, la del catálogo (thumbs/). */
  poster?: string;
  /** Proporción fija ("9 / 16"); si no se pasa, la marca el className (aspect-[…]). */
  aspect?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Páginas de servicio: src y poster en el HTML, visible desde el principio (para Google). */
  indexable?: boolean;
  /** Nombre accesible del vídeo. */
  ariaName?: string;
}) {
  const { t } = useTranslation();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);
  const [visible, setVisible] = useState(indexable); // para el fundido (visible de entrada si es indexable)
  // Se lee en el navegador (no al prerenderizar) para que el HTML coincida
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(prefersReducedMotion()), []);
  // El archivo no se pide hasta que el vídeo entra en pantalla por primera vez
  const [armed, setArmed] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);

  const src = getPublicUrl(file);
  const poster = getPublicUrl(posterPath ?? `thumbs/${file.replace(/\.mp4$/, ".jpg")}`);

  // ¿Está en pantalla?
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting);
      if (e.isIntersecting) setArmed(true);
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cambio de vídeo: vuelve a empezar mudo, con fundido
  useEffect(() => {
    setMuted(true);
    setManualPlay(false);
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [file]);

  // Reproducir / pausar según visibilidad
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    const shouldPlay = inView && (!reduced || manualPlay);
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduced, manualPlay, muted, file]);

  const enableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    setManualPlay(true);
    v.play().catch(() => {});
  };

  const showPlayButton = reduced && !manualPlay;

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden rounded-xl bg-charcoal ${className}`}
      style={{ ...(aspect ? { aspectRatio: aspect } : {}), ...style }}
    >
      <video
        key={file}
        ref={videoRef}
        src={armed || indexable ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload={armed ? "metadata" : "none"}
        aria-label={ariaName}
        width={indexable ? (aspect === "16 / 9" ? 1280 : 405) : undefined}
        height={indexable ? 720 : undefined}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 250ms ease-out" }}
      />

      {showPlayButton ? (
        <button
          type="button"
          onClick={() => setManualPlay(true)}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-navy/70 border border-off-white/30 text-off-white flex items-center justify-center hover:bg-navy/90 transition-colors"
          aria-label={t("player.play")}
        >
          <Play size={26} weight="fill" />
        </button>
      ) : (
        <button
          type="button"
          onClick={muted ? enableSound : () => { setMuted(true); }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/80 border border-off-white/25 text-off-white text-sm font-semibold backdrop-blur-sm hover:bg-navy transition-colors"
        >
          {muted ? <SpeakerSimpleHigh size={16} weight="fill" /> : <SpeakerSimpleSlash size={16} weight="fill" />}
          {muted ? t("services.sound_on") : t("player.mute")}
        </button>
      )}
    </div>
  );
}

/**
 * Varios vídeos horizontales completos (16:9), uno encima de otro, para
 * "Vídeo para tu empresa". Solo se reproduce uno (el activo); los demás
 * enseñan su miniatura sin descargar el vídeo. Al pulsar uno, pasa a ser el activo.
 */
export function ServiceVideoStack({ files, style, className = "", indexable = false, ariaName }: { files: string[]; style?: React.CSSProperties; className?: string; indexable?: boolean; ariaName?: string }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  // Si cambia la lista (otro servicio u otra configuración), empezar por el primero
  useEffect(() => setActive(0), [files.join("|")]);

  return (
    <div data-video-stack className={`flex flex-col gap-3 ${className}`} style={style}>
      {files.map((file, i) =>
        i === active ? (
          <ServiceVideo key={file} file={file} aspect="16 / 9" className="w-full" indexable={indexable && i === 0} ariaName={i === 0 ? ariaName : undefined} />
        ) : (
          <button
            key={file}
            type="button"
            onClick={() => setActive(i)}
            className="group relative w-full overflow-hidden rounded-xl bg-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue"
            style={{ aspectRatio: "16 / 9" }}
            aria-label={t("player.play")}
          >
            <img
              src={getPublicUrl(`thumbs/${file.replace(/\.mp4$/, ".jpg")}`)}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <span className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-navy/70 border border-off-white/30 text-off-white flex items-center justify-center group-hover:bg-navy/90 transition-colors">
              <Play size={20} weight="fill" />
            </span>
          </button>
        ),
      )}
    </div>
  );
}
