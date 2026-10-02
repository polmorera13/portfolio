import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { whatsappUrl, WhatsAppIcon } from "../lib/whatsapp";

const BAR_HEIGHT = 52; // alto de los botones
const BAR_GAP = 12; // separación del borde inferior

// Barra fija inferior, solo por debajo de 768 px (md:hidden).
// Aparece cuando los botones de la portada (#hero-ctas) salen de pantalla y se
// oculta cuando el contacto está a la vista. Con el menú abierto la oculta el
// CSS (html[data-menu-open], lo pone el Header).
export default function MobileCTABar() {
  const { t } = useTranslation();
  const [heroCtasVisible, setHeroCtasVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const heroCtas = document.getElementById("hero-ctas");
    const contact = document.getElementById("contacto");
    const observers: IntersectionObserver[] = [];

    if (heroCtas) {
      const o = new IntersectionObserver(([e]) => setHeroCtasVisible(e.isIntersecting));
      o.observe(heroCtas);
      observers.push(o);
    }
    if (contact) {
      const o = new IntersectionObserver(([e]) => setContactVisible(e.isIntersecting));
      o.observe(contact);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const visible = !heroCtasVisible && !contactVisible;

  return (
    <>
      {/* Espacio al final de la página para que la barra no tape el pie */}
      <div
        aria-hidden="true"
        className="md:hidden"
        style={{ height: visible ? `calc(${BAR_HEIGHT + BAR_GAP * 2}px + env(safe-area-inset-bottom))` : 0 }}
      />

      <div
        className="mobile-cta-bar md:hidden fixed z-40 flex gap-3"
        style={{
          left: 16,
          right: 16,
          bottom: `calc(${BAR_GAP}px + env(safe-area-inset-bottom))`,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 200ms ease-out, transform 200ms ease-out",
        }}
        aria-hidden={!visible}
      >
        <a
          href="#contacto-propuesta"
          tabIndex={visible ? 0 : -1}
          className="flex-[2] flex items-center justify-center bg-brand-blue text-off-white font-semibold text-base rounded-lg shadow-lg shadow-black/30"
          style={{ height: BAR_HEIGHT }}
        >
          {t("nav.cta")}
        </a>
        <a
          href={whatsappUrl(t("contact.whatsapp_msg"))}
          target="_blank"
          rel="noopener"
          tabIndex={visible ? 0 : -1}
          aria-label="WhatsApp"
          className="flex items-center justify-center bg-navy border border-brand-blue/40 text-brand-blue rounded-lg shadow-lg shadow-black/30"
          style={{ width: BAR_HEIGHT, height: BAR_HEIGHT }}
        >
          <WhatsAppIcon size={22} />
        </a>
      </div>
    </>
  );
}
