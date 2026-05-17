export type Locale = "es" | "en" | "ca";
export type Translated = Record<Locale, string>;

export type Service = {
  id: "ugc" | "organico" | "corporativo";
  number: string;
  title: Translated;
  description: Translated;
  bullets: Translated[];
  cta: Translated;
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

