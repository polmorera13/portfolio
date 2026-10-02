import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import VideoPlayer from "./VideoPlayer";

export interface SliderItem {
  id: string;
  src: string;
  poster: string | null;
  aspectRatio: "9:16" | "16:9";
  title: string | null;
  client: string | null;
}

const SPEED = 32; // px por segundo, como la tira de marcas
const RESUME_AFTER_INTERACTION = 4000; // ms tras tocar/arrastrar/deslizar
const RESUME_AFTER_VIDEO = 1500; // ms tras pausar un vídeo
const GAP = 16;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Una sola fila de vídeos que avanza sola de derecha a izquierda en bucle.
 * Se pausa con el ratón encima, con el foco de teclado dentro, al tocar o
 * arrastrar, mientras se reproduce un vídeo, con la pestaña oculta y con el
 * botón de pausa. Con "reducir movimiento" empieza parada.
 *
 * El bucle se hace repitiendo la lista; las copias quedan ocultas a lectores de
 * pantalla y fuera del orden de tabulación.
 */
export default function PortfolioSlider({ items, wide }: { items: SliderItem[]; wide: boolean }) {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  const [copies, setCopies] = useState(3);
  const [userPaused, setUserPaused] = useState(prefersReducedMotion);

  // Estado que lee el bucle de animación sin re-renderizar
  const posRef = useRef(0);
  const setWidthRef = useRef(0);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const playingRef = useRef(false);
  const interactUntilRef = useRef(0);
  const userPausedRef = useRef(userPaused);
  const animRef = useRef<{ from: number; to: number; start: number } | null>(null);
  const dragRef = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  userPausedRef.current = userPaused;

  // Ancho de una vuelta completa y número de copias necesarias para llenar la fila
  useLayoutEffect(() => {
    const track = trackRef.current;
    const first = firstSetRef.current;
    if (!track || !first) return;
    const measure = () => {
      const sw = first.offsetWidth;
      if (!sw) return;
      const firstMeasure = setWidthRef.current === 0;
      setWidthRef.current = sw;
      setCopies(3 + Math.ceil(track.clientWidth / sw));
      if (firstMeasure) {
        posRef.current = sw; // empezamos en la segunda copia para poder ir hacia atrás
        track.scrollLeft = sw;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(first);
    ro.observe(track);
    return () => ro.disconnect();
  }, [items]);

  // Mantiene la posición dentro de la zona central (saltos invisibles: el contenido es idéntico)
  const normalize = useCallback(() => {
    const sw = setWidthRef.current;
    if (!sw) return;
    while (posRef.current >= sw * 2) posRef.current -= sw;
    while (posRef.current < sw * 0.5) posRef.current += sw;
  }, []);

  const isPaused = useCallback(
    () =>
      userPausedRef.current ||
      hoverRef.current ||
      focusRef.current ||
      playingRef.current ||
      dragRef.current !== null ||
      performance.now() < interactUntilRef.current ||
      document.visibilityState !== "visible",
    [],
  );

  // Bucle de animación
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const track = trackRef.current;
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      if (track && setWidthRef.current) {
        const anim = animRef.current;
        if (anim) {
          // Animación de Anterior / Siguiente
          const p = Math.min(1, (now - anim.start) / 450);
          const eased = 1 - Math.pow(1 - p, 3);
          posRef.current = anim.from + (anim.to - anim.from) * eased;
          track.scrollLeft = posRef.current;
          if (p >= 1) {
            animRef.current = null;
            normalize();
            track.scrollLeft = posRef.current;
          }
        } else if (!isPaused()) {
          posRef.current += SPEED * dt;
          normalize();
          track.scrollLeft = posRef.current;
        } else {
          // Parado: seguimos la posición real (el usuario puede estar deslizando)
          posRef.current = track.scrollLeft;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPaused, normalize]);

  // Vídeos: parar la fila mientras alguno suena; reanudar con un pequeño margen
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const anyPlaying = Array.from(track.querySelectorAll("video")).some((v) => !v.paused && !v.ended);
      if (playingRef.current && !anyPlaying) {
        interactUntilRef.current = Math.max(interactUntilRef.current, performance.now() + RESUME_AFTER_VIDEO);
      }
      playingRef.current = anyPlaying;
    };
    // Los eventos de vídeo no suben por el árbol: se escuchan en fase de captura
    track.addEventListener("play", update, true);
    track.addEventListener("pause", update, true);
    track.addEventListener("ended", update, true);
    return () => {
      track.removeEventListener("play", update, true);
      track.removeEventListener("pause", update, true);
      track.removeEventListener("ended", update, true);
    };
  }, []);

  // Las copias del bucle: fuera del orden de tabulación
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.querySelectorAll<HTMLElement>("[data-copy='true'] [tabindex], [data-copy='true'] button, [data-copy='true'] a")
      .forEach((el) => el.setAttribute("tabindex", "-1"));
  }, [copies, items]);

  const touched = () => {
    interactUntilRef.current = performance.now() + RESUME_AFTER_INTERACTION;
  };

  // Arrastrar con el ratón en escritorio (en táctil se usa el desplazamiento nativo)
  const onPointerDown = (e: React.PointerEvent) => {
    animRef.current = null;
    touched();
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    dragRef.current = { x: e.clientX, scroll: trackRef.current?.scrollLeft ?? 0, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 5) drag.moved = true;
    if (drag.moved) track.scrollLeft = drag.scroll - dx;
  };
  const endDrag = () => {
    if (dragRef.current?.moved) suppressClickRef.current = true;
    dragRef.current = null;
    touched();
  };
  // Tras arrastrar, el clic que suelta el ratón no debe reproducir el vídeo
  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    const first = firstSetRef.current?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    touched();
    normalize();
    const from = track.scrollLeft;
    animRef.current = { from, to: from + dir * (first.offsetWidth + GAP), start: performance.now() };
  };

  const cardWidth = wide ? "clamp(300px, 34vw, 520px)" : "clamp(200px, 17vw, 260px)";
  const cardWidthMobile = wide ? "84vw" : "64vw";

  const renderSet = (copy: number) => (
    <div
      key={copy}
      ref={copy === 0 ? firstSetRef : undefined}
      data-copy={copy === 0 ? undefined : "true"}
      aria-hidden={copy === 0 ? undefined : true}
      className="flex shrink-0"
      style={{ gap: GAP, paddingRight: GAP }}
    >
      {items.map((item) => (
        <div key={`${copy}-${item.id}`} className="portfolio-slide shrink-0">
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
  );

  const btnCls =
    "w-10 h-10 rounded-full border border-charcoal flex items-center justify-center text-steel-blue hover:text-off-white hover:border-steel-blue/60 transition-colors";

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={t("portfolio.title")}
        className="portfolio-track flex overflow-x-auto py-4 select-none"
        style={{ scrollbarWidth: "none", cursor: "grab" }}
        onMouseEnter={() => { hoverRef.current = true; }}
        onMouseLeave={() => { hoverRef.current = false; endDrag(); }}
        onFocus={() => { focusRef.current = true; }}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) focusRef.current = false; }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onClickCapture={onClickCapture}
        onTouchStart={touched}
        onTouchMove={touched}
        onWheel={touched}
      >
        {Array.from({ length: copies }, (_, i) => renderSet(i))}
      </div>

      {/* Controles accesibles */}
      <div className="max-w-content w-full mx-auto section-padding flex items-center gap-2">
        <button type="button" onClick={() => step(-1)} className={btnCls} aria-label={t("carousel.prev")}>
          <CaretLeft size={18} weight="bold" />
        </button>
        <button type="button" onClick={() => step(1)} className={btnCls} aria-label={t("carousel.next")}>
          <CaretRight size={18} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          className={btnCls}
          aria-label={userPaused ? t("carousel.resume") : t("carousel.pause")}
          aria-pressed={userPaused}
        >
          {userPaused ? <Play size={16} weight="fill" /> : <Pause size={16} weight="fill" />}
        </button>
      </div>

      <style>{`
        .portfolio-track::-webkit-scrollbar { display: none; }
        .portfolio-slide { width: ${cardWidth}; }
        @media (max-width: 767px) { .portfolio-slide { width: ${cardWidthMobile}; } }
      `}</style>
    </div>
  );
}
