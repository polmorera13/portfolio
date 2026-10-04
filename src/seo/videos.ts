import es from "../locales/es.json";
import en from "../locales/en.json";
import ca from "../locales/ca.json";
import type { Locale } from "../types";
import type { PageKey } from "../routes";
import type { InitialData } from "../lib/initialData";
import { CASE_DETAILS, caseDetailFor } from "../data/caseDetails";
import { services as SERVICES } from "../data/services";

// ─────────────────────────────────────────────────────────────────────────────
// Vídeos de cada página (casos y servicios), para que Google pueda indexarlos:
// el nombre accesible del reproductor y el VideoObject del JSON-LD salen de aquí,
// así siempre coinciden con lo que se ve.
// ─────────────────────────────────────────────────────────────────────────────
const L = { es, en, ca } as const;
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
  const base = `${L[lang].player.video_of} ${brand}`;
  return label ? `${base}: ${lowerFirst(label)}` : base;
}

/** Miniatura de un vídeo del catálogo (thumbs/<archivo>.jpg). */
export const catalogPoster = (file: string) => `thumbs/${file.replace(/\.mp4$/, ".jpg")}`;

/** Archivo principal del servicio (el vídeo grande de la página). */
export function serviceMainFile(svc: "ads" | "organic" | "corporate", data: InitialData | null): string | null {
  const cfg = (data?.services?.[svc] ?? []).filter((v): v is string => !!v);
  return cfg[0] ?? SERVICES.find((s) => s.configKey === svc)?.videos[0] ?? null;
}

/** Marca de un vídeo del catálogo (o null si no está). */
export function catalogBrand(file: string, data: InitialData | null): string | null {
  return data?.videos?.find((v) => v.storage_path === file)?.title ?? null;
}

export interface PageVideo {
  /** Ruta en media.polmorera.es */
  file: string;
  poster: string | null;
  name: string;
  description: string;
}

const SVC_OF: Partial<Record<PageKey, "ads" | "organic" | "corporate">> = {
  "svc-ads": "ads",
  "svc-social": "organic",
  "svc-corporate": "corporate",
};

/** Vídeos indexables de una página: todos los del caso, o el principal del servicio. */
export function pageVideos(key: PageKey, lang: Locale, data: InitialData | null): PageVideo[] {
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
        name: videoName(brand, tr(v.label as Tri, lang) || v.name || null, lang),
        description,
      }));
  }
  const svc = SVC_OF[key];
  if (svc) {
    const file = serviceMainFile(svc, data);
    if (!file) return [];
    const brand = catalogBrand(file, data);
    const page = L[lang].svcpage[svc];
    return [{
      file,
      poster: catalogPoster(file),
      name: brand ? videoName(brand, null, lang) : page.h1,
      description: `${page.h1}. ${firstSentence(page.intro)}`,
    }];
  }
  return [];
}

export const mediaAbs = (p: string) => (p.startsWith("http") ? p : `${MEDIA}/${p.replace(/^\//, "")}`);
