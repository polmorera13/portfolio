import type { Video } from "../types/video";

// ─────────────────────────────────────────────────────────────────────────────
// Catálogo de vídeos — servidos desde media.polmorera.es (VPS propio).
//
// Orientación (16:9 / 9:16) detectada de forma REAL con ffprobe.
// Miniatura (primer frame) en media.polmorera.es/thumbs/<nombre>.jpg
//
// Para cambiar la CATEGORÍA, edita el 2º argumento:
//   "ads" | "organic" | "corporate" | "street"
// Para cambiar el TEXTO, edita el `brand` (4º argumento).
// Para quitar un vídeo de la web, pon `false` como último argumento.
// El destacado del hero se controla en Hero.tsx (HERO_* slugs).
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<Video["category"], string> = {
  ads: "Paid media",
  organic: "Orgánico",
  corporate: "Corporativo",
  street: "Street content",
  hero: "Hero",
};

function v(
  slug: string,
  category: Video["category"],
  aspect_ratio: Video["aspect_ratio"],
  brand: string,
  order: number,
  active = true,
): Video {
  const base = slug.replace(/\.mp4$/, "");
  return {
    id: slug,
    category,
    title: brand,
    client: CATEGORY_LABEL[category],
    storage_path: slug,
    thumbnail_path: `thumbs/${base}.jpg`,
    aspect_ratio,
    display_order: order,
    is_active: active,
    created_at: "2026-05-13T00:00:00Z",
    slot: null,
    media_type: "video",
  };
}

export const videos: Video[] = [
  // ── CORPORATIVO (16:9) ──────────────────────────────────────────────────────
  v("reactiva-vsl-terminado-v3-compressed.mp4", "corporate", "16:9", "Reactiva Online", 0),
  v("reactivaweb-v4-compressed-1.mp4",          "corporate", "16:9", "Reactiva Online", 1),
  v("rcx-software-pol-morera-1.mp4",            "corporate", "16:9", "RCX Software", 2),
  v("estoolweb-v6.mp4",                         "corporate", "16:9", "Estool", 3),
  v("flashled-pol-3-corpo-horizontal.mp4",      "corporate", "16:9", "FlashLED", 4),
  v("yoigo0126-1-169.mp4",                      "corporate", "16:9", "Yoigo", 5),
  v("linkedin-video.mp4",                       "corporate", "16:9", "LinkedIn", 6),

  // ── ADS (9:16) ──────────────────────────────────────────────────────────────
  v("bitnovo291125-2-compressed.mp4",           "ads", "9:16", "Bitnovo", 0),
  v("dogfy-diet-oct-25-1-1-1.mp4",              "ads", "9:16", "Dogfy Diet", 1),
  v("estool-ad3pol-oct25.mp4",                  "ads", "9:16", "Estool", 2),
  v("minibatt-2.mp4",                           "ads", "9:16", "MiniBatt", 3),
  v("murwal-3-03-26-compressed.mp4",            "ads", "9:16", "Murwal", 4),
  v("petroprix2-240725-1-1-1.mp4",              "ads", "9:16", "PetroPrix", 5),
  v("yoigo280426-vert-compressed.mp4",          "ads", "9:16", "Yoigo", 6),
  v("gestionar-la-facturacion-de-tu-gestoria-nunca-habia-sido-tan.mp4", "ads", "9:16", "Estool", 7),
  v("pol-morera-x-creator-studio-1.mp4",        "ads", "9:16", "Pol Morera", 8),
  v("pol-morera-x-creator-studio-2.mp4",        "ads", "9:16", "Pol Morera", 9),
  // Duplicado de Estool (recompresión) — desactivado
  v("redpandacompress-estool-ad3pol-oct25.mp4", "ads", "9:16", "Estool", 99, false),

  // ── ORGÁNICO (9:16) ─────────────────────────────────────────────────────────
  v("axa-1.mp4",                            "organic", "9:16", "AXA", 0),
  v("bezoya-04-26-compressed.mp4",          "organic", "9:16", "Bezoya", 1),
  v("bezoya-11-05-26-compressed.mp4",       "organic", "9:16", "Bezoya", 2),
  v("ecoembes-15-05-25.mp4",                "organic", "9:16", "Ecoembes", 3),
  v("ecoembes220725-2.mp4",                 "organic", "9:16", "Ecoembes", 4),
  v("redpandacompress-ecoembes-080825.mp4", "organic", "9:16", "Ecoembes", 5),
  v("estool-nov-v1.mp4",                    "organic", "9:16", "Estool", 6),
  v("yadea-23-04-26-compressed.mp4",        "organic", "9:16", "Yadea", 7),
  v("snapinsta-to-aqoqrbocpovfexjo7z-8alzmomebarhwmrsqd6ve31uzzmy.mp4", "organic", "9:16", "Pol Morera", 8),

  // ── STREET CONTENT (9:16) ───────────────────────────────────────────────────
  v("ecoembes-12-05-26.mp4",     "street", "9:16", "Ecoembes", 0),
  v("ecoembes-260326-1-1-1.mp4", "street", "9:16", "Ecoembes", 1),
  v("ecoembes291225.mp4",        "street", "9:16", "Ecoembes", 2),

  // ── DESACTIVADO — duplicado de Murwal ───────────────────────────────────────
  v("redpandacompress-murwal-3-03-26-compressed.mp4", "ads", "9:16", "Murwal", 99, false),
];
