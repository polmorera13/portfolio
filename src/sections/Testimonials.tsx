import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { withBase } from "../lib/paths";

const STAR_COLOR = "oklch(58% 0.14 240)";
const SPEED = 36; // px por segundo
const RESUME_AFTER_TOUCH = 4000; // ms tras deslizar con el dedo o la rueda
const GAP = 24;

// Optional real logos. Drop transparent PNGs (ideally white/light variants
// so they read on the dark card) into /public/testimonials/ with these names
// and they replace the monogram automatically. Missing files fall back to the
// monogram without errors.
const BRAND_LOGOS: Record<string, string> = {
  "AppleTree": "/testimonials/appletree.png",
  "Bitnovo": "/testimonials/bitnovo.png",
  "Thing or Two": "/testimonials/thingortwo.png",
  "Efizent": "/testimonials/efizent.png",
  "IB School": "/testimonials/ibschool.svg",
  "BIG School": "/testimonials/bigschool.png",
};

function initials(s: string): string {
  const stop = /^(or|y|and|de|the|o|i)$/i;
  const words = s.trim().split(/\s+/).filter((w) => !stop.test(w));
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return s.slice(0, 2).toUpperCase();
}

function BrandMark({ brand, author }: { brand: string; author: string }) {
  const [logoFailed, setLogoFailed] = useState(false);
  // Use the brand (role) for the logo lookup; some entries use a generic role
  // like "Cliente", in which case we fall back to the author for the monogram.
  const rawLogo = BRAND_LOGOS[brand] ?? BRAND_LOGOS[author];
  const logoSrc = rawLogo ? withBase(rawLogo) : undefined;
  const monogramSource = /^(cliente|client)$/i.test(brand.trim()) ? author : brand;

  if (logoSrc && !logoFailed) {
    return (
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "oklch(98% 0.003 240)",
          border: "1px solid oklch(58% 0.14 240 / 0.18)",
          overflow: "hidden",
        }}
      >
        <img
          src={logoSrc}
          alt={brand}
          onError={() => setLogoFailed(true)}
          style={{ maxWidth: "76%", maxHeight: "76%", objectFit: "contain", display: "block" }}
        />
      </div>
    );
  }

  // Monogram fallback
  return (
    <div
      aria-hidden="true"
      style={{
        width: 48,
        height: 48,
        borderRadius: 10,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(58% 0.14 240 / 0.14)",
        border: "1px solid oklch(58% 0.14 240 / 0.28)",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        fontSize: "0.9375rem",
        letterSpacing: "0.02em",
        color: "oklch(70% 0.12 240)",
      }}
    >
      {initials(monogramSource)}
    </div>
  );
}

function StarRow() {
  return (
    <div className="flex gap-[3px] mb-4" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={14} weight="fill" color={STAR_COLOR} />
      ))}
    </div>
  );
}

type Item = { quote: string; author: string; role: string };

function Card({ item, copy = false }: { item: Item; copy?: boolean }) {
  return (
    <article
      tabIndex={copy ? -1 : 0}
      className="flex flex-col bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        width: "clamp(320px, 30vw, 400px)",
        flexShrink: 0,
        padding: "2rem",
        border: "1px solid oklch(58% 0.14 240 / 0.15)",
        borderRadius: "12px",
      }}
    >
      <StarRow />
      <p
        className="text-off-white flex-1"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          fontSize: "1rem",
          lineHeight: 1.5,
          maxWidth: "50ch",
        }}
      >
        {item.quote}
      </p>

      {/* Footer: brand mark on the left, name + brand shifted to its right */}
      <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <BrandMark brand={item.role} author={item.author} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            className="text-off-white"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "0.9375rem",
              lineHeight: 1.2,
            }}
          >
            {item.author}
          </p>
          <p
            className="text-steel-blue"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "0.875rem",
              lineHeight: 1.3,
            }}
          >
            {item.role}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Tira de reseñas que avanza sola en bucle y que también se puede deslizar con
 * el dedo (o la rueda / el trackpad): es una fila con desplazamiento nativo y
 * el avance automático mueve ese desplazamiento. Al tocarla se para un momento
 * y luego sigue desde donde la dejaste. Con "reducir movimiento" no avanza sola.
 */
function useLoopScroll(enabled: boolean) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const setWidthRef = useRef(0);
  const hoverRef = useRef(false);
  const touchUntilRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const first = firstSetRef.current;
    if (!enabled || !track || !first) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const prev = setWidthRef.current;
      setWidthRef.current = first.offsetWidth;
      // La primera vez empezamos en la segunda copia para poder ir hacia atrás
      if (!prev && setWidthRef.current) {
        posRef.current = setWidthRef.current;
        track.scrollLeft = posRef.current;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(first);

    // Saltos invisibles para que el bucle no se acabe (las copias son idénticas)
    const normalize = () => {
      const sw = setWidthRef.current;
      if (!sw) return false;
      let moved = false;
      while (posRef.current >= sw * 2) { posRef.current -= sw; moved = true; }
      while (posRef.current < sw * 0.5) { posRef.current += sw; moved = true; }
      return moved;
    };

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const paused =
        reduced || hoverRef.current || performance.now() < touchUntilRef.current || document.visibilityState !== "visible";
      if (setWidthRef.current) {
        if (!paused) {
          posRef.current += SPEED * dt;
          normalize();
          track.scrollLeft = posRef.current;
        } else {
          // Parada: seguimos la posición real (el usuario puede estar deslizando)
          posRef.current = track.scrollLeft;
          if (performance.now() >= touchUntilRef.current && normalize()) track.scrollLeft = posRef.current;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [enabled]);

  const touched = () => {
    touchUntilRef.current = performance.now() + RESUME_AFTER_TOUCH;
  };
  const handlers = {
    onTouchStart: touched,
    onTouchMove: touched,
    onWheel: touched,
    onMouseEnter: () => { hoverRef.current = true; },
    onMouseLeave: () => { hoverRef.current = false; },
  };
  return { trackRef, firstSetRef, handlers };
}

export default function Testimonials() {
  // Las copias de la tira (para el bucle) se añaden al montar, no en el HTML
  const [loopCopies, setLoopCopies] = useState(false);
  useEffect(() => setLoopCopies(true), []);
  const { t, i18n } = useTranslation();
  const items = t("testimonials.items", { returnObjects: true }) as Item[];
  const { trackRef, firstSetRef, handlers } = useLoopScroll(loopCopies);

  const ariaLabel =
    i18n.language === "ca"
      ? "Testimonis"
      : i18n.language === "en"
      ? "Testimonials"
      : "Testimonios";

  const renderSet = (copy: number) => (
    <div
      key={copy}
      ref={copy === 0 ? firstSetRef : undefined}
      className="flex shrink-0"
      style={{ gap: GAP, paddingRight: GAP }}
      aria-hidden={copy === 0 ? undefined : true}
    >
      {/* Las copias del bucle: ocultas a lectores y fuera del tabulador, pero
          no "inert" (si no, el dedo no podría arrastrar la tira sobre ellas) */}
      {items.map((item, i) => <Card key={`${copy}-${i}`} item={item} copy={copy !== 0} />)}
    </div>
  );

  return (
    <section className="section-gap bg-charcoal/20">
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-4">
            <motion.span variants={fadeUp} className="eyebrow">
              {t("testimonials.eyebrow")}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              {t("testimonials.title")}
            </motion.h2>
          </div>
        </motion.div>
      </div>

      {/* Tira de reseñas: avanza sola y se puede deslizar */}
      <div
        ref={trackRef}
        className="testimonials-wrapper relative mt-12 overflow-x-auto"
        role="region"
        aria-label={ariaLabel}
        aria-live="off"
        {...handlers}
      >
        <div className="testimonials-track py-2">
          {Array.isArray(items) && renderSet(0)}
          {loopCopies && Array.isArray(items) && [1, 2].map(renderSet)}
        </div>
      </div>
    </section>
  );
}
