import i18n from "../lib/i18n";
import type { Locale } from "../types";
import type { PageKey } from "../routes";
import type { InitialData } from "../lib/initialData";
import { CASE_DETAILS, caseDetailFor } from "../data/caseDetails";
import { serviceFiles } from "../data/services";
import { UGC_MALE_MAIN, ugcMaleExamples } from "../data/ugcMale";

// ─────────────────────────────────────────────────────────────────────────────
// Vídeos de cada página (casos y servicios), para que Google pueda indexarlos:
// el nombre accesible del reproductor y el VideoObject del JSON-LD salen de aquí,
// así siempre coinciden con lo que se ve.
// ─────────────────────────────────────────────────────────────────────────────
const tl = (lang: Locale, key: string) => i18n.getFixedT(lang)(key);
const MEDIA = "https://media.polmorera.es";

type Tri = Partial<Record<Locale, string>> | undefined;
const tr = (v: Tri, lang: Locale) => (v && (v[lang] || v.es)) || "";
const lowerFirst = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const firstSentence = (s: string) => {
  const m = s.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : s).trim();
};

/** "Vídeo UGC para MasterD: creatividad 1" (o "Vídeo UGC para Verisure" sin etiqueta). */
export function videoName(brand: string, label: string | null | undefined, lang: Locale): string {
  const base = `${tl(lang, "player.video_of")} ${brand}`;
  return label ? `${base}: ${lowerFirst(label)}` : base;
}

/** Miniatura de un vídeo del catálogo (thumbs/<archivo>.jpg). */
export const catalogPoster = (file: string) => `thumbs/${file.replace(/\.mp4$/, ".jpg")}`;

/** Archivo principal del servicio (el primero de arriba de la página). */
export function serviceMainFile(svc: "ads" | "organic" | "corporate", data: InitialData | null): string | null {
  return serviceFiles(svc, data?.services?.[svc])[0] ?? null;
}

/** Marca de un vídeo del catálogo (o null si no está). */
export function catalogBrand(file: string, data: InitialData | null): string | null {
  return data?.videos?.find((v) => v.storage_path === file)?.title ?? null;
}

export interface PageVideo {
  /** Ruta en media.polmorera.es */
  file: string;
  poster: string | null;
  /** Vertical (9:16): su póster en la página es la versión de 480 px. */
  vertical: boolean;
  name: string;
  description: string;
}

const SVC_OF: Partial<Record<PageKey, "ads" | "organic" | "corporate">> = {
  "svc-ads": "ads",
  "svc-social": "organic",
  "svc-corporate": "corporate",
};

/** Vídeos indexables de una página: todos los del caso, el principal del servicio o los de "Creador UGC hombre". */
export function pageVideos(key: PageKey, lang: Locale, data: InitialData | null): PageVideo[] {
  if (key === "ugc-male") {
    const description = `${tl(lang, "ugcpage.h1")}. ${firstSentence(tl(lang, "ugcpage.intro"))}`;
    const main: PageVideo = {
      file: UGC_MALE_MAIN.file,
      poster: UGC_MALE_MAIN.poster,
      vertical: true,
      name: tl(lang, "ugcpage.main_aria").replace("{{brand}}", UGC_MALE_MAIN.brand),
      description,
    };
    return [main, ...ugcMaleExamples(data).map((v) => ({ file: v.file, poster: v.poster, vertical: true, name: videoName(v.brand, null, lang), description }))];
  }
  const detail = CASE_DETAILS.find((d) => d.page === key);
  if (detail) {
    const c = (data?.cases ?? []).find((x) => caseDetailFor(x)?.slug === detail.slug);
    if (!c) return [];
    const brand = detail.displayName ? detail.displayName[lang] : detail.brandName;
    const description = [tr(c.title as Tri, lang), firstSentence(tr(c.description as Tri, lang))].filter(Boolean).join(". ").replace(/\.\./g, ".");
    return c.videos
      .filter((v) => v.file)
      .map((v) => ({
        file: v.file,
        poster: v.poster || null,
        vertical: v.aspect !== "16:9",
        name: videoName(brand, tr(v.label as Tri, lang) || v.name || null, lang),
        description,
      }));
  }
  const svc = SVC_OF[key];
  if (svc) {
    const files = serviceFiles(svc, data?.services?.[svc]);
    const h1 = tl(lang, `svcpage.${svc}.h1`);
    const intro = tl(lang, `svcpage.${svc}.intro`);
    // Anuncios y redes: los tres de arriba; corporativo: el primero
    return (svc === "corporate" ? files.slice(0, 1) : files.slice(0, 3)).map((file) => {
      const brand = catalogBrand(file, data);
      return {
        file,
        poster: catalogPoster(file),
        vertical: svc !== "corporate",
        name: brand ? videoName(brand, null, lang) : h1,
        description: `${h1}. ${firstSentence(intro)}`,
      };
    });
  }
  return [];
}

export const mediaAbs = (p: string) => (p.startsWith("http") ? p : `${MEDIA}/${p.replace(/^\//, "")}`);
