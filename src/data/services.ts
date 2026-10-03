import type { Service } from "../types";

// Servicios de "Qué produzco". Cada uno tiene su vídeo (en media.polmorera.es,
// con la miniatura en thumbs/) y la pestaña del portfolio a la que lleva
// "Ver ejemplos".
export const services: Service[] = [
  {
    id: "ugc",
    tab: { es: "Anuncios", en: "Ads", ca: "Anuncis" },
    title: { es: "Vídeos para tus anuncios", en: "Videos for your ads", ca: "Vídeos per als teus anuncis" },
    closedLine: {
      es: "Para vender con Instagram, TikTok y Facebook",
      en: "To sell on Instagram, TikTok and Facebook",
      ca: "Per vendre a Instagram, TikTok i Facebook",
    },
    ideal: {
      es: "Ideal si quieres vender más con Instagram, TikTok o Facebook.",
      en: "Ideal if you want to sell more on Instagram, TikTok or Facebook.",
      ca: "Ideal si vols vendre més a Instagram, TikTok o Facebook.",
    },
    bullets: [
      { es: "Un inicio que engancha en los primeros segundos", en: "An opening that hooks viewers in the first seconds", ca: "Un inici que enganxa en els primers segons" },
      { es: "Varias versiones para ver cuál funciona mejor", en: "Several versions to see which works best", ca: "Diverses versions per veure quina funciona millor" },
      { es: "En vertical y cuadrado, listos para cada red", en: "Vertical and square, ready for every platform", ca: "En vertical i quadrat, a punt per a cada xarxa" },
    ],
    tag: { es: "Entrega en 5–7 días laborables", en: "Delivery in 5–7 working days", ca: "Lliurament en 5–7 dies laborables" },
    video: "verisure-0726-crea9-compressed.mp4",
    portfolioHash: "#portfolio-anuncios",
  },
  {
    id: "organico",
    tab: { es: "Redes", en: "Social", ca: "Xarxes" },
    title: { es: "Vídeos para tus redes", en: "Videos for your social media", ca: "Vídeos per a les teves xarxes" },
    closedLine: { es: "Para publicar con constancia", en: "To post consistently", ca: "Per publicar amb constància" },
    ideal: {
      es: "Ideal si quieres publicar con constancia y que la gente reconozca tu negocio.",
      en: "Ideal if you want to post consistently and have people recognise your business.",
      ca: "Ideal si vols publicar amb constància i que la gent reconegui el teu negoci.",
    },
    bullets: [
      { es: "Un plan de temas para que no te quedes en blanco", en: "A topic plan so you never run out of ideas", ca: "Un pla de temes perquè no et quedis en blanc" },
      { es: "Listos para Instagram, TikTok y YouTube", en: "Ready for Instagram, TikTok and YouTube", ca: "A punt per a Instagram, TikTok i YouTube" },
      { es: "Con tu logo, tus colores y textos en pantalla", en: "With your logo, your colours and on-screen text", ca: "Amb el teu logo, els teus colors i textos en pantalla" },
    ],
    tag: { es: "Packs mensuales", en: "Monthly packs", ca: "Packs mensuals" },
    video: "axa-1.mp4",
    portfolioHash: "#portfolio-redes",
  },
  {
    id: "corporativo",
    tab: { es: "Empresa", en: "Company", ca: "Empresa" },
    title: { es: "Vídeo para tu empresa", en: "Videos for your company", ca: "Vídeo per a la teva empresa" },
    closedLine: {
      es: "Para explicar lo que haces en un minuto",
      en: "To explain what you do in a minute",
      ca: "Per explicar què fas en un minut",
    },
    ideal: {
      es: "Ideal si necesitas explicar lo que haces en un minuto y dar buena imagen.",
      en: "Ideal if you need to explain what you do in a minute and make a great impression.",
      ca: "Ideal si necessites explicar què fas en un minut i donar bona imatge.",
    },
    bullets: [
      { es: "Imagen de calidad cine (4K)", en: "Cinema-quality image (4K)", ca: "Imatge de qualitat de cinema (4K)" },
      { es: "Rótulos animados con nombres y cargos", en: "Animated captions with names and roles", ca: "Rètols animats amb noms i càrrecs" },
      { es: "Versiones para tu web, tus comerciales y eventos", en: "Versions for your website, your sales team and events", ca: "Versions per a la teva web, els teus comercials i esdeveniments" },
    ],
    tag: { es: "Guion incluido", en: "Script included", ca: "Guió inclòs" },
    video: "reactivaweb-v4-compressed-1.mp4",
    portfolioHash: "#portfolio-empresa",
  },
];
