import type { Locale } from "./types";
import { BASE } from "./lib/paths";

// ─────────────────────────────────────────────────────────────────────────────
// Mapa de URLs: una URL por página y por idioma (ES en la raíz, EN en /en/,
// CAT en /ca/). Lo usan el router, el selector de idioma, los enlaces internos,
// el prerenderizado (HTML estático por página) y el sitemap.
// ─────────────────────────────────────────────────────────────────────────────
export const LOCALES: Locale[] = ["es", "en", "ca"];
export const SITE_URL = "https://polmorera.es";

export type PageKey =
  | "home"
  | "svc-ads"
  | "svc-social"
  | "svc-corporate"
  | "ugc-male"
  | "cases"
  | "case-masterd"
  | "case-dogfy"
  | "case-reactiva"
  | "case-agency"
  | "about"
  | "thanks"
  | "privacy"
  | "legal";

export const PATHS: Record<PageKey, Record<Locale, string>> = {
  home: { es: "/", en: "/en/", ca: "/ca/" },
  "svc-ads": { es: "/videos-ugc-para-anuncios/", en: "/en/ugc-video-ads/", ca: "/ca/videos-ugc-per-a-anuncis/" },
  "svc-social": { es: "/videos-para-redes-sociales/", en: "/en/social-media-videos/", ca: "/ca/videos-per-a-xarxes-socials/" },
  "svc-corporate": { es: "/video-corporativo/", en: "/en/corporate-video/", ca: "/ca/video-corporatiu/" },
  "ugc-male": { es: "/creador-ugc-hombre/", en: "/en/male-ugc-creator-spain/", ca: "/ca/creador-ugc-home/" },
  cases: { es: "/casos/", en: "/en/case-studies/", ca: "/ca/casos/" },
  "case-masterd": { es: "/casos/masterd-tiktok-ads/", en: "/en/case-studies/masterd-tiktok-ads/", ca: "/ca/casos/masterd-tiktok-ads/" },
  "case-dogfy": { es: "/casos/dogfy-diet/", en: "/en/case-studies/dogfy-diet/", ca: "/ca/casos/dogfy-diet/" },
  "case-reactiva": { es: "/casos/reactiva-online/", en: "/en/case-studies/reactiva-online/", ca: "/ca/casos/reactiva-online/" },
  "case-agency": { es: "/casos/apple-tree/", en: "/en/case-studies/apple-tree/", ca: "/ca/casos/apple-tree/" },
  about: { es: "/sobre-mi/", en: "/en/about/", ca: "/ca/sobre-mi/" },
  thanks: { es: "/gracias/", en: "/en/thank-you/", ca: "/ca/gracies/" },
  privacy: { es: "/politica-privacidad/", en: "/en/privacy-policy/", ca: "/ca/politica-privacitat/" },
  legal: { es: "/aviso-legal/", en: "/en/legal-notice/", ca: "/ca/avis-legal/" },
};

/** Páginas que no van al sitemap y llevan noindex. */
export const NOINDEX_PAGES: PageKey[] = ["thanks", "privacy", "legal"];

/** Rutas sin versión por idioma (noindex): textos legales. */
/** Páginas de caso (dependen de "Casos" en las migas de pan). */
export const CASE_PAGES: PageKey[] = ["case-masterd", "case-dogfy", "case-reactiva", "case-agency"];


/** Enlace interno a una página en un idioma, respetando la base (/ o /test/). */
export function pageHref(key: PageKey, lang: Locale, hash = ""): string {
  const p = PATHS[key][lang];
  return BASE.replace(/\/$/, "") + p + (hash ? `#${hash}` : "");
}

/** URL pública absoluta (para canonical, hreflang, sitemap y JSON-LD). */
export function pageUrl(key: PageKey, lang: Locale): string {
  return SITE_URL + PATHS[key][lang];
}

/** Idioma según la ruta (sin la base). */
export function langFromPath(pathname: string): Locale {
  const p = pathname.replace(new RegExp("^" + BASE.replace(/\/$/, "")), "") || "/";
  if (p === "/en" || p.startsWith("/en/")) return "en";
  if (p === "/ca" || p.startsWith("/ca/")) return "ca";
  return "es";
}

/** Página (y su idioma) a partir de la ruta; null si no es una de las del mapa. */
export function pageFromPath(pathname: string): { key: PageKey; lang: Locale } | null {
  let p = pathname.replace(new RegExp("^" + BASE.replace(/\/$/, "")), "") || "/";
  if (!p.endsWith("/")) p += "/";
  for (const key of Object.keys(PATHS) as PageKey[]) {
    for (const lang of LOCALES) {
      if (PATHS[key][lang] === p) return { key, lang };
    }
  }
  return null;
}
