export type Locale = "es" | "en" | "ca";
export type Translated = Record<Locale, string>;

export type Service = {
  id: "ugc" | "organico" | "corporativo";
  /** Nombre corto para las pestañas de móvil */
  tab: Translated;
  title: Translated;
  /** Línea bajo el título cuando el servicio está cerrado */
  closedLine: Translated;
  /** Frase "Ideal si…" */
  ideal: Translated;
  bullets: Translated[];
  /** Pastilla (plazo, packs…) */
  tag: Translated;
  /** Clave en /api/services */
  configKey: "ads" | "organic" | "corporate";
  /** Vídeos por defecto (media.polmorera.es; miniatura en thumbs/<nombre>.jpg).
   *  1 vertical en anuncios y redes; 3 horizontales en empresa. */
  videos: string[];
  /** Ancla que abre su pestaña del portfolio */
  portfolioHash: string;
};

export type Project = {
  id: string;
  brand: string;
  category: "ads" | "organic" | "corporate" | "apps" | "food" | "services";
  type: Translated;
  objective: Translated;
  format: Translated;
  thumbnail: string;
  videoUrl?: string;
  youtubeShortId?: string;
};

export type Testimonial = {
  id: string;
  quote: Translated;
  author: string;
  role: Translated;
  brand: string;
  avatar?: string;
};

export type FAQItem = {
  question: Translated;
  answer: Translated;
};

