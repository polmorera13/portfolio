import type { Service } from "../types";

export const services: Service[] = [
  {
    id: "ugc",
    number: "01",
    title: { es: "UGC para anuncios", en: "UGC for ads", ca: "UGC per anuncis" },
    description: {
      es: "Contenido pensado para campañas: directo, claro y adaptable a test.",
      en: "Content built for campaigns: direct, clear and test-ready.",
      ca: "Contingut pensat per campanyes: directe, clar i adaptable a test.",
    },
    bullets: [
      { es: "Hooks de alto impacto", en: "High-impact hooks", ca: "Hooks d'alt impacte" },
      { es: "Variaciones para A/B", en: "A/B test variations", ca: "Variacions per A/B" },
      { es: "Formato vertical y cuadrado", en: "Vertical and square formats", ca: "Format vertical i quadrat" },
      { es: "Entrega en 7–10 días", en: "Delivered in 7–10 days", ca: "Lliurament en 7–10 dies" },
    ],
    cta: { es: "Ver ejemplos", en: "View examples", ca: "Veure exemples" },
  },
  {
    id: "organico",
    number: "02",
    title: { es: "Contenido orgánico", en: "Organic content", ca: "Contingut orgànic" },
    description: {
      es: "Para construir presencia, constancia y comunidad.",
      en: "To build presence, consistency and community.",
      ca: "Per construir presència, constància i comunitat.",
    },
    bullets: [
      { es: "Línea editorial coherente", en: "Consistent editorial line", ca: "Línia editorial coherent" },
      { es: "Packs mensuales", en: "Monthly packs", ca: "Packs mensuals" },
      { es: "Adaptado a TikTok, Reels, Shorts", en: "TikTok, Reels, Shorts ready", ca: "Adaptat a TikTok, Reels, Shorts" },
      { es: "Lower thirds y branding consistente", en: "Lower thirds and consistent branding", ca: "Lower thirds i branding consistent" },
    ],
    cta: { es: "Ver ejemplos", en: "View examples", ca: "Veure exemples" },
  },
  {
    id: "corporativo",
    number: "03",
    title: { es: "Vídeo corporativo", en: "Corporate video", ca: "Vídeo corporatiu" },
    description: {
      es: "Para explicar mejor lo que haces y mejorar percepción de marca.",
      en: "To better explain what you do and improve brand perception.",
      ca: "Per explicar millor el que fas i millorar la percepció de marca.",
    },
    bullets: [
      { es: "4K cinematic", en: "4K cinematic", ca: "4K cinematic" },
      { es: "Lower thirds animados", en: "Animated lower thirds", ca: "Lower thirds animats" },
      { es: "Versiones para web, sales y eventos", en: "Versions for web, sales and events", ca: "Versions per web, sales i esdeveniments" },
      { es: "Scripting incluido", en: "Scripting included", ca: "Scripting inclòs" },
    ],
    cta: { es: "Ver ejemplos", en: "View examples", ca: "Veure exemples" },
  },
];
