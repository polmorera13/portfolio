import { useState } from "react";
import { useTranslation } from "react-i18next";
import { logos } from "../data/logos";

export default function LogoMarquee() {
  const { t } = useTranslation();
  // Each rendered item gets a unique slot index (0..2*n-1).
  // hoveredSlot tracks which slot is currently hovered.
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  // Duplicate the list once — the CSS animation translates -50%,
  // which equals exactly one full set, so the loop is seamless.
  const items = [...logos, ...logos];

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
              className="shrink-0 flex items-center justify-center"
              style={{ height: "54px" }}
              onMouseEnter={() => setHoveredSlot(slotIndex)}
              onMouseLeave={() => setHoveredSlot(null)}
            >
              <img
                src={logo.file}
                alt={logo.name}
                draggable={false}
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
    </section>
  );
}
