import { createElement, forwardRef, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Sustituto ligero de framer-motion para lo que usa la web: "aparecer al hacer
// scroll" (variants fadeUp / fadeIn), un fundido al montar (initial + animate),
// el levantamiento al pasar el ratón (whileHover) y AnimatePresence.
// Todo con CSS y un único IntersectionObserver: unos 2 KB en lugar de ~45 KB.
//
// - El HTML prerenderizado sale siempre visible (Google, IAs y sin JavaScript).
// - Al arrancar, solo lo que queda por debajo de la pantalla se oculta y aparece
//   al llegar con el scroll; lo que ya se ve no parpadea.
// - Con "reducir movimiento", nada se oculta ni se anima.
// ─────────────────────────────────────────────────────────────────────────────
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type AnyObj = Record<string, unknown>;
interface MotionProps {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
  variants?: unknown;
  transition?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
  custom?: unknown;
}

let io: IntersectionObserver | null = null;
function observer() {
  if (io || typeof IntersectionObserver === "undefined") return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io!.unobserve(el);
        // Pequeño escalonado entre hermanos que aparecen a la vez
        const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((c) => (c as HTMLElement).dataset.reveal) : [];
        const i = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = `${Math.min(i * 80, 320)}ms`;
        el.dataset.reveal = "in";
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
  );
  return io;
}

const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Desplazamiento inicial de una variante u objeto "initial" con opacidad 0 (null si no oculta). */
function hiddenOffset(variants: unknown, initial: unknown): number | null {
  const hidden = (variants as AnyObj | undefined)?.hidden as AnyObj | undefined;
  if (hidden && hidden.opacity === 0) return Number(hidden.y ?? 0);
  if (initial && typeof initial === "object" && (initial as AnyObj).opacity === 0) return Number((initial as AnyObj).y ?? 0);
  return null;
}

function make(tag: string) {
  const C = forwardRef<HTMLElement, AnyObj & MotionProps & { children?: ReactNode }>(function MotionLite(props, ref) {
    const { initial, animate, exit, whileInView, viewport, variants, transition, whileHover, whileTap, custom, className, ...rest } = props;
    void exit; void whileInView; void viewport; void transition; void whileTap; void custom;
    const own = useRef<HTMLElement | null>(null);
    const offset = hiddenOffset(variants, initial);
    // initial + animate (sin variantes): fundido corto al montar, p. ej. al cambiar de pestaña
    const fadeOnMount = !variants && !!animate && offset !== null;

    useIsoLayoutEffect(() => {
      const el = own.current;
      if (!el || offset === null || fadeOnMount || prefersReduced()) return;
      // Solo se oculta lo que aún no se ve: lo que está en pantalla al cargar se queda como está
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      el.style.setProperty("--reveal-y", `${offset}px`);
      el.dataset.reveal = "pending";
      observer()?.observe(el);
      return () => observer()?.unobserve(el);
    }, []);

    const cls = [className, whileHover ? "m-hover-lift" : "", fadeOnMount ? "m-fade-in" : ""].filter(Boolean).join(" ") || undefined;
    return createElement(tag, {
      ...rest,
      className: cls,
      ref: (node: HTMLElement | null) => {
        own.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as { current: HTMLElement | null }).current = node;
      },
    });
  });
  C.displayName = `motion.${tag}`;
  return C;
}

const TAGS = ["div", "span", "p", "h1", "h2", "h3", "h4", "ol", "ul", "li", "a", "blockquote", "section", "article", "header", "footer", "button", "figure", "img"] as const;
type Tag = (typeof TAGS)[number];
type MotionComponent<T extends Tag> = ReturnType<typeof forwardRef<HTMLElement, JSX.IntrinsicElements[T] & MotionProps>>;

export const motion = Object.fromEntries(TAGS.map((t) => [t, make(t)])) as unknown as { [K in Tag]: MotionComponent<K> };

/** Sin animación de salida: solo pinta lo que hay dentro. */
export function AnimatePresence({ children }: { children?: ReactNode; mode?: string; initial?: boolean }) {
  return <>{children}</>;
}
