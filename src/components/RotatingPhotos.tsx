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
export default function RotatingPhotos({ photos, interval = 2000, className = "", style }: {
  photos: Photo[];
  interval?: number;
  /** Clases y estilo del marco grande (tamaño, bordes, proporción). */
  className?: string;
  style?: React.CSSProperties;
}) {
  const [index, setIndex] = useState(0);
  const [restart, setRestart] = useState(0); // al elegir una a mano, el contador vuelve a empezar
  const ref = useRef<HTMLDivElement>(null);
  const n = photos.length;

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
            src={withBase(p.src)}
            alt={i === index ? p.alt : ""}
            width={p.width}
            height={p.height}
            aria-hidden={i === index ? undefined : true}
            loading="lazy"
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
              <img src={withBase(photos[i].src)} alt="" width={photos[i].width} height={photos[i].height} loading="lazy" decoding="async" className="w-full h-full object-cover"
                style={{ objectPosition: photos[i].position ?? "50% 50%" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
