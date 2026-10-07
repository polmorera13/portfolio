import es from "../locales/es.json";
import en from "../locales/en.json";
import ca from "../locales/ca.json";
import type { Locale } from "../types";
import { PATHS, SITE_URL, type PageKey } from "../routes";
import type { InitialData } from "../lib/initialData";
import { CASE_DETAILS, caseDetailFor } from "../data/caseDetails";
import { serviceMainFile, catalogPoster } from "./videos";

// ─────────────────────────────────────────────────────────────────────────────
// Imagen para compartir de cada página (1200×630, /og/<ruta>.jpg). El texto sale
// de aquí (lo usan las metaetiquetas y el generador del build); la foto o la
// miniatura del vídeo principal la elige ogImageSource con los datos de la API.
// ─────────────────────────────────────────────────────────────────────────────
const L = { es, en, ca } as const;
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Nombre del archivo: "/" → home, "/casos/masterd-tiktok-ads/" → casos/masterd-tiktok-ads */
export const ogSlug = (key: PageKey, lang: Locale) => PATHS[key][lang].replace(/^\/|\/$/g, "") || "home";
export const ogImageUrl = (key: PageKey, lang: Locale) => `${SITE_URL}/og/${ogSlug(key, lang)}.jpg`;

const CASE_FIGURE: Record<string, Record<Locale, string>> = {
  masterd: { es: "390 conversiones", en: "390 conversions", ca: "390 conversions" },
  dogfy: { es: "15 % de conversión", en: "15% conversion rate", ca: "15 % de conversió" },
  reactiva: { es: "+190 entregables en 15 meses", en: "190+ deliverables in 15 months", ca: "+190 lliurables en 15 mesos" },
  agencia: { es: "31 meses · +220 vídeos", en: "31 months · 220+ videos", ca: "31 mesos · +220 vídeos" },
};

const SVC: Partial<Record<PageKey, "ads" | "organic" | "corporate">> = { "svc-ads": "ads", "svc-social": "organic", "svc-corporate": "corporate" };

export interface OgText {
  eyebrow: string;
  title: string;
  figure?: string;
  alt: string;
}

/** Textos de la imagen (no dependen de los datos de la API). */
export function ogText(key: PageKey, lang: Locale): OgText {
  const t = L[lang];
  const eyebrow = t.hero.eyebrow;
  let title: string;
  let figure: string | undefined;
  const detail = CASE_DETAILS.find((d) => d.page === key);
  if (detail) {
    const brand = detail.displayName ? detail.displayName[lang] : detail.brandName;
    title = lang === "en" ? `${brand} case study` : lang === "ca" ? `Cas ${brand}` : `Caso ${brand}`;
    figure = CASE_FIGURE[detail.slug]?.[lang];
  } else if (SVC[key]) {
    title = t.svcpage[SVC[key]!].h1;
  } else if (key === "landing") {
    title = t.landing.h1;
  } else if (key === "guide-ugc") {
    title = t.guide.h1;
  } else if (key === "ugc-male") {
    title = t.ugcpage.crumb;
  } else if (key === "cases") {
    title = t.casespage.h1;
  } else if (key === "about") {
    title = lang === "en" ? "About Pol Morera" : "Sobre Pol Morera";
  } else {
    title = `${t.hero.h1_line1} ${t.hero.h1_line2}`;
  }
  const alt = [figure, title].filter(Boolean).join(" · ") + " · polmorera.es";
  return { eyebrow, title, figure, alt };
}

/** De dónde sale la foto: archivo de /public (foto de Pol) o miniatura en media.polmorera.es. */
export type OgImageSource = { kind: "public"; path: string } | { kind: "media"; path: string };

// La imagen para compartir usa la JPG original (los pósters de los casos van en WebP en la web)
const jpgOf = (p: string) => p.replace(/.webp$/, ".jpg");

export function ogImageSource(key: PageKey, data: InitialData | null): OgImageSource {
  const pol: OgImageSource = { kind: "public", path: "pol-morera.jpg" };
  const detail = CASE_DETAILS.find((d) => d.page === key);
  if (detail) {
    const c = (data?.cases ?? []).find((x) => caseDetailFor(x)?.slug === detail.slug);
    const v = c?.videos.find((x) => x.file && x.poster);
    return v ? { kind: "media", path: jpgOf(v.poster) } : pol;
  }
  const svc = SVC[key];
  if (svc) {
    const file = serviceMainFile(svc, data);
    return file ? { kind: "media", path: catalogPoster(file) } : pol;
  }
  if (key === "cases") {
    const v = (data?.cases ?? []).flatMap((c) => c.videos).find((x) => x.file && x.poster);
    return v ? { kind: "media", path: jpgOf(v.poster) } : pol;
  }
  return pol;
}
