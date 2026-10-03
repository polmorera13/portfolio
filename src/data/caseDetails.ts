import type { Translated } from "../types";
import type { PageKey } from "../routes";

// Textos de las páginas de caso que no están en el panel. Los resultados
// (cifras, gráfica, cita, aviso) salen del caso del panel (/api/cases), tal cual.
export type CaseSlug = "masterd" | "dogfy";

export interface CaseDetail {
  slug: CaseSlug;
  page: PageKey;
  brandName: string; // para encontrar el caso del panel
  sector: Translated;
  need: Translated;
  did: Translated;
  metaTitle: Translated;
  metaDescription: Translated;
}

export const CASE_DETAILS: CaseDetail[] = [
  {
    slug: "masterd",
    page: "case-masterd",
    brandName: "MasterD",
    sector: {
      es: "Formación (acceso a Mossos d'Esquadra)",
      en: "Training (Mossos d'Esquadra police entrance exam)",
      ca: "Formació (accés a Mossos d'Esquadra)",
    },
    need: {
      es: "Captar alumnos para la preparación del acceso a Mossos d'Esquadra con anuncios en TikTok.",
      en: "To attract students for the Mossos d'Esquadra entrance exam preparation course with TikTok ads.",
      ca: "Captar alumnes per a la preparació de l'accés a Mossos d'Esquadra amb anuncis a TikTok.",
    },
    did: {
      es: "Una creatividad principal y una versión adaptada a las políticas de TikTok.",
      en: "One main creative and a version adapted to TikTok's policies.",
      ca: "Una creativitat principal i una versió adaptada a les polítiques de TikTok.",
    },
    metaTitle: {
      es: "Caso MasterD: 390 conversiones en TikTok Ads · Pol Morera",
      en: "MasterD case study: 390 conversions on TikTok Ads · Pol Morera",
      ca: "Cas MasterD: 390 conversions a TikTok Ads · Pol Morera",
    },
    metaDescription: {
      es: "Una creatividad UGC para la campaña de MasterD en TikTok Ads: 390 conversiones a 4,09 € por conversión, según los datos de TikTok Ads.",
      en: "A UGC creative for MasterD's TikTok Ads campaign: 390 conversions at €4.09 per conversion, according to TikTok Ads data.",
      ca: "Una creativitat UGC per a la campanya de MasterD a TikTok Ads: 390 conversions a 4,09 € per conversió, segons les dades de TikTok Ads.",
    },
  },
  {
    slug: "dogfy",
    page: "case-dogfy",
    brandName: "Dogfy Diet",
    sector: { es: "Comida para perros", en: "Dog food", ca: "Menjar per a gossos" },
    need: {
      es: "Creatividades para sus anuncios que rindieran como sus mejores contenidos.",
      en: "Ad creatives that performed as well as their best content.",
      ca: "Creativitats per als seus anuncis que rendissin com els seus millors continguts.",
    },
    did: {
      es: "Vídeos UGC para anuncios, con un inicio dinámico y el mensaje claro en los primeros segundos.",
      en: "UGC videos for ads, with a dynamic opening and a clear message in the first seconds.",
      ca: "Vídeos UGC per a anuncis, amb un inici dinàmic i el missatge clar en els primers segons.",
    },
    metaTitle: {
      es: "Caso Dogfy Diet: vídeos UGC para anuncios · Pol Morera",
      en: "Dogfy Diet case study: UGC videos for ads · Pol Morera",
      ca: "Cas Dogfy Diet: vídeos UGC per a anuncis · Pol Morera",
    },
    metaDescription: {
      es: "Vídeos UGC para los anuncios de Dogfy Diet: CTR medio del 0,50 %, en línea con sus mejores contenidos, y leads con un 10–20 % de conversión.",
      en: "UGC videos for Dogfy Diet's ads: 0.50% average CTR, in line with their best content, and leads converting at 10–20%.",
      ca: "Vídeos UGC per als anuncis de Dogfy Diet: CTR mitjà del 0,50 %, en línia amb els seus millors continguts, i leads amb un 10–20 % de conversió.",
    },
  },
];

export const caseDetailBySlug = (slug: CaseSlug) => CASE_DETAILS.find((c) => c.slug === slug)!;
export const caseDetailByBrand = (brand: string) => CASE_DETAILS.find((c) => c.brandName.toLowerCase() === brand.trim().toLowerCase());
