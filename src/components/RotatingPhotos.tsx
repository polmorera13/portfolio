import { useEffect, useRef, useState } from "react";
import { withBase } from "../lib/paths";

export interface Photo {
  src: string;
  alt: string;
  /** Encuadre dentro del marco (object-position), p. ej. "50% 30%". */
  position?: string;
  width: number;
  height: number;
}

/**
 * Fotos que se van turnando en el mismo marco (fundido cada `interval` ms, en bucle).
 * Debajo, las demás en pequeño: al pulsar una, pasa a la grande y la rotación sigue
 * desde ahí. Gira solo con el marco a la vista; con "reducir movimiento" no gira
 * (las miniaturas siguen funcionando).
 */
// Versiones más pequeñas de cada foto (generadas junto al original): 640 px para el marco y 160 px para las miniaturas
const sized = (src: string, w: 640 | 160) => src.replace(/.webp$/, `-${w}.webp`);

export default function RotatingPhotos({ photos, interval = 2000, className = "", style, priority = false }: {
  photos: Photo[];
  /** La primera foto es lo primero que se ve de la página: se pide enseguida. */
  priority?: boolean;
  interval?: number;
  /** Clases y estilo del marco grande (tamaño, bordes, proporción). */
  className?: string;
  style?: React.CSSProperties;
}) {
  const [index, setIndex] = useState(0);
  const [restart, setRestart] = useState(0); // al elegir una a mano, el contador vuelve a empezar
  const ref = useRef<HTMLDivElement>(null);
  const n = photos.length;
  // Solo se descargan la foto que se ve y la siguiente (las demás, cuando les toca)
  const [ready, setReady] = useState<Set<number>>(() => new Set([0]));
  useEffect(() => {
    setReady((r) => (r.has(index) && r.has((index + 1) % n) ? r : new Set([...r, index, (index + 1) % n])));
  }, [index, n]);

  useEffect(() => {
    const el = ref.current;
    if (!el || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const start = () => { if (timer === undefined) timer = window.setInterval(() => setIndex((i) => (i + 1) % n), interval); };
    const stop = () => { if (timer !== undefined) { window.clearInterval(timer); timer = undefined; } };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.2 });
    io.observe(el);
    return () => { io.disconnect(); stop(); };
  }, [n, interval, restart]);

  const pick = (i: number) => { setIndex(i); setRestart((r) => r + 1); };
  // Las otras fotos, en el orden en que van a salir
  const others = Array.from({ length: n - 1 }, (_, k) => (index + 1 + k) % n);

  return (
    <div ref={ref} className="flex flex-col gap-3 w-full">
      <div className={`relative overflow-hidden ${className}`} style={style}>
        {photos.map((p, i) => (
          <img
            key={p.src}
            src={ready.has(i) ? withBase(sized(p.src, 640)) : undefined}
            srcSet={ready.has(i) ? `${withBase(sized(p.src, 640))} 640w, ${withBase(p.src)} ${p.width}w` : undefined}
            sizes="(min-width: 1024px) 480px, 100vw"
            alt={i === index ? p.alt : ""}
            width={p.width}
            height={p.height}
            aria-hidden={i === index ? undefined : true}
            loading={priority && i === 0 ? "eager" : "lazy"}
            {...(priority && i === 0 ? { fetchpriority: "high" } : {})}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: p.position ?? "50% 50%", opacity: i === index ? 1 : 0, transition: "opacity 700ms ease" }}
          />
        ))}
      </div>
      {n > 1 && (
        <div className="flex gap-2">
          {others.map((i) => (
            <button
              key={photos[i].src}
              type="button"
              onClick={() => pick(i)}
              aria-label={photos[i].alt}
              className="w-14 sm:w-16 rounded-lg overflow-hidden border border-off-white/15 opacity-70 hover:opacity-100 hover:border-brand-blue transition"
              style={{ aspectRatio: "4 / 5" }}
            >
              <img src={withBase(sized(photos[i].src, 160))} alt="" width={160} height={Math.round((160 * photos[i].height) / photos[i].width)} loading="lazy" decoding="async" className="w-full h-full object-cover"
                style={{ objectPosition: photos[i].position ?? "50% 50%" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
