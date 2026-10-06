import type { Locale, Translated } from "../types";
import type { PageKey } from "../routes";

// Título y descripción de cada página, por idioma (los metadatos pueden llevar
// las palabras de búsqueda: "UGC", "Meta Ads"…; el texto visible, no).
export const META: Record<Exclude<PageKey, "case-masterd" | "case-dogfy" | "case-reactiva" | "case-agency">, { title: Translated; description: Translated }> = {
  home: {
    title: {
      es: "UGC hombre España | Vídeos que venden — Pol Morera",
      en: "Male UGC creator Spain | Videos that sell — Pol Morera",
      ca: "Creador UGC home Espanya | Vídeos que venen — Pol Morera",
    },
    description: {
      es: "Creador UGC hombre en España: vídeos UGC para los anuncios, las redes y la web de tu negocio. Más de 1.000 vídeos para más de 300 marcas, desde Barcelona.",
      en: "Male UGC creator in Spain: UGC videos for your business's ads, social media and website. 1,000+ videos for 300+ brands, based in Barcelona.",
      ca: "Creador UGC home a Espanya: vídeos UGC per als anuncis, les xarxes i la web del teu negoci. Més de 1.000 vídeos per a més de 300 marques, des de Barcelona.",
    },
  },
  "svc-ads": {
    title: {
      es: "Vídeos UGC para anuncios en Meta y TikTok Ads | Pol Morera",
      en: "UGC video ads for Meta and TikTok Ads | Pol Morera",
      ca: "Vídeos UGC per a anuncis a Meta i TikTok Ads | Pol Morera",
    },
    description: {
      es: "Vídeos UGC para tus anuncios de Instagram, Facebook y TikTok: guion, grabación y edición, con varias versiones para probar. Entrega en 5–7 días laborables.",
      en: "UGC videos for your Instagram, Facebook and TikTok ads: script, filming and editing, with several versions to test. Delivered in 5–7 working days.",
      ca: "Vídeos UGC per als anuncis d'Instagram, Facebook i TikTok: guió, gravació i edició, amb diverses versions per provar. Lliurament en 5–7 dies laborables.",
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
      ca: "Vídeos per a l'Instagram, el TikTok i el YouTube del teu negoci: pla de temes, gravació i edició amb la teva marca. Packs mensuals.",
    },
  },
  "svc-corporate": {
    title: {
      es: "Vídeo corporativo en Barcelona | Pol Morera",
      en: "Corporate video production in Barcelona | Pol Morera",
      ca: "Vídeo corporatiu a Barcelona | Pol Morera",
    },
    description: {
      es: "Vídeo corporativo para explicar lo que hace tu empresa en un minuto: guion incluido, 4K, rótulos animados y versiones para web, ventas y eventos.",
      en: "Corporate video that explains what your company does in a minute: script included, 4K, animated captions and versions for web, sales and events.",
      ca: "Vídeo corporatiu per explicar què fa la teva empresa en un minut: guió inclòs, 4K, rètols animats i versions per a web, vendes i esdeveniments.",
    },
  },
  "ugc-male": {
    title: {
      es: "UGC hombre: creador UGC masculino para tu marca · Pol Morera",
      en: "Male UGC creator in Spain for your brand · Pol Morera",
      ca: "Creador UGC home per a la teva marca · Pol Morera",
    },
    description: {
      es: "Vídeos UGC con un creador hombre para tus anuncios y tus redes: guion, grabación y edición en toda España. Y si necesitas otro perfil, mi red de actores.",
      en: "UGC videos with a male creator for your ads and social media: script, filming and editing across Spain. Need another profile? I have a network of actors.",
      ca: "Vídeos UGC amb un creador home per als teus anuncis i xarxes: guió, gravació i edició a tot Espanya. I si cal un altre perfil, la meva xarxa d'actors.",
    },
  },
  "guide-ugc": {
    title: {
      es: "Qué es el UGC: guía para empresas | Pol Morera",
      en: "What is UGC? A guide for businesses | Pol Morera",
      ca: "Què és l'UGC: guia per a empreses | Pol Morera",
    },
    description: {
      es: "Qué es un vídeo UGC, para qué sirve, en qué se diferencia de un influencer y cómo se hace. Guía de Pol Morera, creador UGC en España.",
      en: "What a UGC video is, what it's for, how it differs from influencer content and how it's made. A guide by Pol Morera, UGC creator in Spain.",
      ca: "Què és un vídeo UGC, per a què serveix, en què es diferencia d'un influencer i com es fa. Guia de Pol Morera, creador UGC a Espanya.",
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
      es: "Sobre Pol Morera, creador UGC hombre en España",
      en: "About Pol Morera, male UGC creator in Spain",
      ca: "Sobre Pol Morera, creador UGC home a Espanya",
    },
    description: {
      es: "Pol Morera (Pol Morera de Frutos), creador UGC hombre en España y productor de vídeo en Barcelona. Más de 1.000 vídeos para más de 300 marcas.",
      en: "Pol Morera (Pol Morera de Frutos), male UGC creator in Spain and video producer in Barcelona. 1,000+ videos for 300+ brands.",
      ca: "Pol Morera (Pol Morera de Frutos), creador UGC home a Espanya i productor de vídeo a Barcelona. Més de 1.000 vídeos per a més de 300 marques.",
    },
  },
  privacy: {
    title: { es: "Política de privacidad | Pol Morera", en: "Privacy policy | Pol Morera", ca: "Política de privacitat | Pol Morera" },
    description: {
      es: "Cómo trata polmorera.es los datos que envías por el formulario de contacto.",
      en: "How polmorera.es handles the data you send through the contact form.",
      ca: "Com tracta polmorera.es les dades que envies pel formulari de contacte.",
    },
  },
  legal: {
    title: { es: "Aviso legal | Pol Morera", en: "Legal notice | Pol Morera", ca: "Avís legal | Pol Morera" },
    description: {
      es: "Aviso legal de polmorera.es.",
      en: "Legal notice of polmorera.es.",
      ca: "Avís legal de polmorera.es.",
    },
  },
  landing: {
    title: {
      es: "Propuesta gratis: los 3 vídeos que necesita tu negocio | Pol Morera",
      en: "Free proposal: the 3 videos your business needs | Pol Morera",
      ca: "Proposta gratis: els 3 vídeos que necessita el teu negoci | Pol Morera",
    },
    description: {
      es: "Vídeos para tus anuncios, tus redes y tu web. Pide tu propuesta gratis: te digo qué 3 vídeos necesita tu negocio en 2 días laborables.",
      en: "Videos for your ads, your social media and your website. Get your free proposal: I'll tell you which 3 videos your business needs within 2 working days.",
      ca: "Vídeos per als teus anuncis, les teves xarxes i la teva web. Demana la proposta gratis: et dic quins 3 vídeos necessita el teu negoci en 2 dies laborables.",
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
  jobTitle: { es: "Creador UGC hombre y productor de vídeo", en: "Male UGC creator and video producer", ca: "Creador UGC home i productor de vídeo" } as Translated,
  description: {
    es: "Creador UGC y productor de vídeo en Barcelona. Hace vídeos para anuncios, redes sociales y vídeo corporativo. Más de 1.000 vídeos para más de 300 marcas.",
    en: "UGC creator and video producer in Barcelona. Makes videos for ads, social media and corporate video. Over 1,000 videos for 300+ brands.",
    ca: "Creador UGC i productor de vídeo a Barcelona. Fa vídeos per a anuncis, xarxes socials i vídeo corporatiu. Més de 1.000 vídeos per a més de 300 marques.",
  } as Translated,
  sameAs: [
    "https://www.instagram.com/polmoreraugc/",
    "https://www.linkedin.com/in/pol-morera-de-frutos-9b8b35124/",
    "https://www.youtube.com/@polmorera",
  ],
};

export const BUSINESS_DESCRIPTION: Translated = {
  es: "Creador UGC hombre en España: vídeos UGC para anuncios en Meta Ads y TikTok Ads, vídeos para redes sociales y vídeo corporativo. Más de 1.000 vídeos para más de 300 marcas.",
  en: "Male UGC creator in Spain: UGC videos for Meta Ads and TikTok Ads, social media videos and corporate video. Over 1,000 videos for 300+ brands.",
  ca: "Creador UGC home a Espanya: vídeos UGC per a anuncis a Meta Ads i TikTok Ads, vídeos per a xarxes socials i vídeo corporatiu. Més de 1.000 vídeos per a més de 300 marques.",
};

/** Servicio de la página "Creador UGC hombre" (JSON-LD). */
export const UGC_MALE_SERVICE = {
  name: { es: "Creador UGC hombre", en: "Male UGC creator", ca: "Creador UGC home" } as Translated,
  serviceType: { es: "UGC hombre", en: "Male UGC", ca: "UGC home" } as Translated,
};

export const SERVICE_TYPES: Record<"svc-ads" | "svc-social" | "svc-corporate", Translated> = {
  "svc-ads": { es: "Vídeos UGC para anuncios", en: "UGC video ads", ca: "Vídeos UGC per a anuncis" },
  "svc-social": { es: "Vídeos para redes sociales", en: "Social media videos", ca: "Vídeos per a xarxes socials" },
  "svc-corporate": { es: "Vídeo corporativo", en: "Corporate video", ca: "Vídeo corporatiu" },
};
