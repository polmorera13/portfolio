import { getInitialData, type InitialData } from "./initialData";

// ─────────────────────────────────────────────────────────────────────────────
// Miniaturas a la medida: de cada miniatura y póster de media.polmorera.es hay
// versiones de 320 y 480 px de ancho en WebP (nombre-320.webp, nombre-480.webp) y, en las
// horizontales grandes (más de 960 px), también de 960 (nombre-960.webp).
// media.polmorera.es/variants.json dice cuáles tienen versiones y su ancho
// original; el prerenderizado lo mete en los datos de la página. Las que no
// están en la lista (subidas después) se sirven tal cual.
// ─────────────────────────────────────────────────────────────────────────────
const MEDIA = "https://media.polmorera.es";

function variantsOf(url: string | null | undefined, data: InitialData | null) {
  if (!url || !url.startsWith(MEDIA + "/")) return null;
  const base = url.slice(MEDIA.length + 1).replace(/\.(jpg|webp)$/, "");
  const width = data?.variants?.[base];
  if (!width) return null;
  const v = (w: number) => `${MEDIA}/${base}-${w}.webp`;
  return { width, w320: v(320), w480: v(480), w960: width > 960 ? v(960) : null };
}

/** srcset para un <img> (320, 480 y, si es más grande, el original). */
export function thumbSrcSet(url: string | null | undefined, data: InitialData | null = getInitialData()): string | undefined {
  const v = variantsOf(url, data);
  if (!v) return undefined;
  const parts = [`${v.w320} ${Math.min(320, v.width)}w`, `${v.w480} ${Math.min(480, v.width)}w`];
  if (v.w960) parts.push(`${v.w960} 960w`);
  else if (v.width > 480) parts.push(`${url} ${v.width}w`);
  return parts.join(", ");
}

/** Póster de un <video> (no admite srcset): 480 px en los verticales y 960 px en los horizontales grandes. */
export function posterUrl(url: string | null | undefined, vertical = true, data: InitialData | null = getInitialData()): string | undefined {
  if (!url) return undefined;
  const v = variantsOf(url, data);
  if (!vertical) return v?.w960 ?? url;
  return v?.w480 ?? url;
}
