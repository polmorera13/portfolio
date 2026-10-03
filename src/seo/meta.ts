import type { Locale, Translated } from "../types";
import type { PageKey } from "../routes";

// Título y descripción de cada página, por idioma (los metadatos pueden llevar
// las palabras de búsqueda: "UGC", "Meta Ads"…; el texto visible, no).
export const META: Record<Exclude<PageKey, "case-masterd" | "case-dogfy">, { title: Translated; description: Translated }> = {
  home: {
    title: {
      es: "Pol Morera · UGC creator y productor de vídeo en Barcelona",
      en: "Pol Morera · UGC creator & video producer in Barcelona",
      ca: "Pol Morera · Creador UGC i productor de vídeo a Barcelona",
    },
    description: {
      es: "Vídeos UGC para los anuncios, las redes y la web de tu negocio. Más de 1.000 vídeos para más de 300 marcas. Desde Barcelona para toda España.",
      en: "UGC videos for your business's ads, social media and website. Over 1,000 videos for 300+ brands. Based in Barcelona, working across Spain.",
      ca: "Vídeos UGC per als anuncis, les xarxes i la web del teu negoci. Més de 1.000 vídeos per a més de 300 marques. Des de Barcelona per a tot Espanya.",
    },
  },
  "svc-ads": {
    title: {
      es: "Vídeos UGC para anuncios en Meta y TikTok Ads | Pol Morera",
      en: "UGC video ads for Meta and TikTok Ads | Pol Morera",
      ca: "Vídeos UGC per a anuncis a Meta i TikTok Ads | Pol Morera",
    },
    description: {
      es: "Vídeos UGC para tus anuncios de Instagram, Facebook y TikTok: guion, grabación y edición, con varias versiones para ver cuál funciona. Entrega en 5–7 días laborables.",
      en: "UGC videos for your Instagram, Facebook and TikTok ads: script, filming and editing, with several versions to see which one works. Delivery in 5–7 working days.",
      ca: "Vídeos UGC per als teus anuncis d'Instagram, Facebook i TikTok: guió, gravació i edició, amb diverses versions per veure quina funciona. Lliurament en 5–7 dies laborables.",
    },
  },
  "svc-social": {
    title: {
      es: "Vídeos para las redes sociales de tu negocio | Pol Morera",
      en: "Videos for your business's social media | Pol Morera",
      ca: "Vídeos per a les xarxes socials del teu negoci | Pol Morera",
    },
    description: {
      es: "Vídeos para el Instagram, TikTok y YouTube de tu negocio: plan de temas, grabación y edición con tu marca. Packs mensuales para publicar con constancia.",
      en: "Videos for your business's Instagram, TikTok and YouTube: topic plan, filming and editing with your branding. Monthly packs to post consistently.",
      ca: "Vídeos per a l'Instagram, el TikTok i el YouTube del teu negoci: pla de temes, gravació i edició amb la teva marca. Packs mensuals per publicar amb constància.",
    },
  },
  "svc-corporate": {
    title: {
      es: "Vídeo corporativo en Barcelona | Pol Morera",
      en: "Corporate video production in Barcelona | Pol Morera",
      ca: "Vídeo corporatiu a Barcelona | Pol Morera",
    },
    description: {
      es: "Vídeo corporativo para explicar lo que hace tu empresa en un minuto: guion incluido, calidad 4K, rótulos animados y versiones para web, equipo comercial y eventos.",
      en: "Corporate video that explains what your company does in a minute: script included, 4K quality, animated captions and versions for your website, sales team and events.",
      ca: "Vídeo corporatiu per explicar què fa la teva empresa en un minut: guió inclòs, qualitat 4K, rètols animats i versions per a web, equip comercial i esdeveniments.",
    },
  },
  cases: {
    title: {
      es: "Casos reales de vídeos UGC | Pol Morera",
      en: "Real UGC video case studies | Pol Morera",
      ca: "Casos reals de vídeos UGC | Pol Morera",
    },
    description: {
      es: "Campañas reales con vídeos UGC de Pol Morera: el vídeo y los resultados que compartió cada cliente, como las 390 conversiones de MasterD en TikTok Ads.",
      en: "Real campaigns with UGC videos by Pol Morera: the video and the results each client shared, such as MasterD's 390 conversions on TikTok Ads.",
      ca: "Campanyes reals amb vídeos UGC de Pol Morera: el vídeo i els resultats que va compartir cada client, com les 390 conversions de MasterD a TikTok Ads.",
    },
  },
  about: {
    title: {
      es: "Sobre Pol Morera, UGC creator y productor de vídeo | Pol Morera",
      en: "About Pol Morera, UGC creator and video producer | Pol Morera",
      ca: "Sobre Pol Morera, creador UGC i productor de vídeo | Pol Morera",
    },
    description: {
      es: "Pol Morera (Pol Morera de Frutos), UGC creator y productor de vídeo en Barcelona. Más de 1.000 vídeos para más de 300 marcas, en castellano, catalán e inglés.",
      en: "Pol Morera (Pol Morera de Frutos), UGC creator and video producer in Barcelona. Over 1,000 videos for 300+ brands, in Spanish, Catalan and English.",
      ca: "Pol Morera (Pol Morera de Frutos), creador UGC i productor de vídeo a Barcelona. Més de 1.000 vídeos per a més de 300 marques, en castellà, català i anglès.",
    },
  },
  thanks: {
    title: { es: "Gracias | Pol Morera", en: "Thank you | Pol Morera", ca: "Gràcies | Pol Morera" },
    description: {
      es: "He recibido tu solicitud. Te respondo en menos de 24 h en días laborables.",
      en: "I've received your request. I'll reply within 24 h on working days.",
      ca: "He rebut la teva sol·licitud. Et responc en menys de 24 h en dies laborables.",
    },
  },
};

export const OG_LOCALE: Record<Locale, string> = { es: "es_ES", en: "en_GB", ca: "ca_ES" };

// Datos de la entidad (JSON-LD)
export const PERSON = {
  name: "Pol Morera",
  alternateName: "Pol Morera de Frutos",
  jobTitle: { es: "UGC creator y productor de vídeo", en: "UGC creator and video producer", ca: "Creador UGC i productor de vídeo" } as Translated,
  description: {
    es: "Creador UGC y productor de vídeo en Barcelona. Hace vídeos para anuncios, redes sociales y vídeo corporativo. Más de 1.000 vídeos para más de 300 marcas.",
    en: "UGC creator and video producer in Barcelona. Makes videos for ads, social media and corporate video. Over 1,000 videos for 300+ brands.",
    ca: "Creador UGC i productor de vídeo a Barcelona. Fa vídeos per a anuncis, xarxes socials i vídeo corporatiu. Més de 1.000 vídeos per a més de 300 marques.",
  } as Translated,
  sameAs: [
    "https://www.instagram.com/polmoreraugc/",
    "https://www.linkedin.com/in/pol-morera-de-frutos-9b8b35124/",
  ],
};

export const BUSINESS_DESCRIPTION: Translated = {
  es: "Vídeos UGC para anuncios en Meta Ads y TikTok Ads, vídeos para redes sociales y vídeo corporativo. Más de 1.000 vídeos para más de 300 marcas.",
  en: "UGC videos for Meta Ads and TikTok Ads, social media videos and corporate video. Over 1,000 videos for 300+ brands.",
  ca: "Vídeos UGC per a anuncis a Meta Ads i TikTok Ads, vídeos per a xarxes socials i vídeo corporatiu. Més de 1.000 vídeos per a més de 300 marques.",
};

export const SERVICE_TYPES: Record<"svc-ads" | "svc-social" | "svc-corporate", Translated> = {
  "svc-ads": { es: "Vídeos UGC para anuncios", en: "UGC video ads", ca: "Vídeos UGC per a anuncis" },
  "svc-social": { es: "Vídeos para redes sociales", en: "Social media videos", ca: "Vídeos per a xarxes socials" },
  "svc-corporate": { es: "Vídeo corporativo", en: "Corporate video", ca: "Vídeo corporatiu" },
};
