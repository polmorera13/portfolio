import type { FAQItem } from "../types";
import type { InitialData } from "../lib/initialData";

// ─────────────────────────────────────────────────────────────────────────────
// Página "Creador UGC hombre": vídeos en los que sale Pol y preguntas propias.
// ─────────────────────────────────────────────────────────────────────────────

/** Vídeo principal: la creatividad 1 de MasterD (sale Pol). */
export const UGC_MALE_MAIN = {
  file: "cases/masterd-2403-1-web.mp4",
  poster: "cases/masterd-2403-1-web.webp",
  brand: "MasterD",
};

/** Ejemplos del portfolio en los que sale Pol (en todos menos en el de Wala). */
export const UGC_MALE_EXAMPLES = [
  "rastreator-5-09-26-compressed-web.mp4",
  "verisure-0726-crea9-compressed-web.mp4",
  "yadea-23-04-26-compressed-web.mp4",
  "dogfy-diet-oct-25-1-1-1-web.mp4",
  "petroprix2-240725-1-1-1-web.mp4",
  "bezoya-04-26-compressed-web.mp4",
];

export interface UgcMaleExample {
  file: string;
  poster: string | null;
  brand: string;
}

/** Ejemplos que están en el catálogo (con su marca y miniatura), en el orden de arriba. */
export function ugcMaleExamples(data: InitialData | null): UgcMaleExample[] {
  const videos = data?.videos ?? [];
  return UGC_MALE_EXAMPLES.flatMap((file) => {
    const v = videos.find((x) => x.storage_path === file);
    return v && v.title ? [{ file, poster: v.thumbnail_path || null, brand: v.title }] : [];
  });
}

/** Preguntas de la página (la del precio sale de las generales, por su texto en español). */
export const UGC_MALE_FAQ: FAQItem[] = [
  {
    question: {
      es: "¿Qué es un creador UGC hombre (male UGC creator)?",
      en: "What is a male UGC creator?",
      ca: "Què és un creador UGC home (male UGC creator)?",
    },
    answer: {
      es: "Es un creador de contenido que graba vídeos UGC (una persona real hablando de un producto como lo haría un cliente) y que es hombre. En inglés se dice \"male UGC creator\". Es lo que hago yo.",
      en: "It's a content creator who films UGC videos (a real person talking about a product the way a customer would) and who is a man. In Spanish it's called \"creador UGC hombre\". It's what I do.",
      ca: "És un creador de contingut que grava vídeos UGC (una persona real parlant d'un producte com ho faria un client) i que és home. En anglès es diu \"male UGC creator\". És el que faig jo.",
    },
  },
  {
    question: {
      es: "¿Grabas en toda España?",
      en: "Do you film all over Spain?",
      ca: "Graves a tot Espanya?",
    },
    answer: {
      es: "Sí. Trabajo desde Barcelona para toda España. Si tienes un local, una tienda o una oficina, voy a grabar allí, y el desplazamiento va incluido en el presupuesto. Si vendes un producto, me lo envías y lo grabo yo.",
      en: "Yes. I work from Barcelona for the whole of Spain. If you have premises, a shop or an office, I come and film there, and travel is included in the quote. If you sell a product, you send it to me and I film it.",
      ca: "Sí. Treballo des de Barcelona per a tot Espanya. Si tens un local, una botiga o una oficina, vinc a gravar-hi, i el desplaçament va inclòs al pressupost. Si vens un producte, me l'envies i el gravo jo.",
    },
  },
  {
    question: {
      es: "¿Puedo pedir otro perfil, de otra edad o una mujer?",
      en: "Can I ask for a different profile, another age or a woman?",
      ca: "Puc demanar un altre perfil, d'una altra edat o una dona?",
    },
    answer: {
      es: "Sí. Trabajo con una red de actores y actrices de distintas edades y perfiles. Lo definimos según el tono de la campaña y a quién le vendes.",
      en: "Yes. I work with a network of actors and actresses of different ages and profiles. We define it based on the tone of the campaign and who you're selling to.",
      ca: "Sí. Treballo amb una xarxa d'actors i actrius de diferents edats i perfils. Ho definim segons el to de la campanya i a qui li vens.",
    },
  },
];
