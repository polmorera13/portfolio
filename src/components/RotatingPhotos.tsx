import { useEffect, useRef, useState } from "react";
import { withBase } from "../lib/paths";

export interface Photo {
  src: string;
  alt: string;
  /** Encuadre dentro del marco (object-position), p. ej. "50% 30%". */
  position?: string;
}

/**
 * Fotos que se van turnando en el mismo marco (fundido cada `interval` ms, en bucle).
 * Empieza a girar cuando el marco está a la vista y se para fuera de ella; con
 * "reducir movimiento" se queda en la primera. En el HTML va la primera foto
 * visible y el resto ocultas, que el navegador carga sin prisa (lazy).
 */
export default function RotatingPhotos({ photos, interval = 2000, className = "", style }: {
  photos: Photo[];
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const start = () => { if (timer === undefined) timer = window.setInterval(() => setIndex((i) => (i + 1) % photos.length), interval); };
    const stop = () => { if (timer !== undefined) { window.clearInterval(timer); timer = undefined; } };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.2 });
    io.observe(el);
    return () => { io.disconnect(); stop(); };
  }, [photos.length, interval]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={style}>
      {photos.map((p, i) => (
        <img
          key={p.src}
          src={withBase(p.src)}
          alt={i === index ? p.alt : ""}
          aria-hidden={i === index ? undefined : true}
          loading={i === 0 ? "lazy" : "lazy"}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: p.position ?? "50% 50%",
            opacity: i === index ? 1 : 0,
            transition: "opacity 700ms ease",
          }}
        />
      ))}
    </div>
  );
}
