import { useEffect, useState } from "react";
import { useTranslation } from "../lib/i18n";
import { logos } from "../data/logos";
import { withBase } from "../lib/paths";

export default function LogoMarquee() {
  const { t } = useTranslation();
  // Each rendered item gets a unique slot index (0..2*n-1).
  // hoveredSlot tracks which slot is currently hovered.
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  // La lista se duplica para el bucle (la animación mueve -50 %). La copia se
  // añade al montar, no en el HTML, para que cada logo aparezca una sola vez.
  const [loopCopy, setLoopCopy] = useState(false);
  useEffect(() => setLoopCopy(true), []);
  const items = loopCopy ? [...logos, ...logos] : logos;

  return (
    <section className="bg-white py-8">
      <div className="max-w-content mx-auto section-padding mb-6">
        <p
          className="text-sm font-semibold uppercase text-center"
          style={{ color: "#8AAFCC", letterSpacing: "0.25em" }}
        >
          {t("logos.title")}
        </p>
      </div>

      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          className="flex items-center gap-16 animate-marquee"
          style={{ width: "max-content" }}
        >
          {items.map((logo, slotIndex) => (
            <div
              key={slotIndex}
              {...(slotIndex >= logos.length ? { "aria-hidden": true, inert: "" } : {})}
              className="shrink-0 flex items-center justify-center"
              style={{ height: "54px" }}
              onMouseEnter={() => setHoveredSlot(slotIndex)}
              onMouseLeave={() => setHoveredSlot(null)}
            >
              <img
                src={withBase(logo.file)}
                alt={logo.name}
                draggable={false}
                width={logo.width}
                height={logo.height}
                // La franja queda por debajo del hero: ninguno se ve al entrar
                loading="lazy"
                decoding="async"
                className="logo-img"
                style={{
                  height: `calc(54px * ${logo.scale ?? 1})`,
                  maxWidth: "160px",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                  transform: hoveredSlot === slotIndex ? "scale(1.14)" : "scale(1)",
                  transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-content mx-auto section-padding mt-6">
        <p className="text-sm text-center" style={{ color: "#5C7A93" }}>
          {t("logos.subline")}
        </p>
      </div>
    </section>
  );
}
