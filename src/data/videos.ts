import type { Video } from "../types/video";

// ─────────────────────────────────────────────────────────────────────────────
// Catálogo de vídeos — servidos desde media.polmorera.es (VPS propio).
//
// Orientación (16:9 / 9:16) detectada de forma REAL con ffprobe.
// La miniatura de cada vídeo (primer frame) se genera en el VPS y se sirve
// desde media.polmorera.es/thumbs/<nombre>.jpg
//
// Para cambiar la CATEGORÍA de un vídeo, edita su campo (2º argumento):
//   "ads" | "organic" | "corporate" | "street"
// Para cambiar el TEXTO que aparece, edita el `brand` (4º argumento).
// Para quitarlo de la web, pon el vídeo con is_active false (ver más abajo).
// El destacado del hero es el corporativo cuyo brand contiene "Reactiva".
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
    title: brand,                         // etiqueta principal (marca)
    client: CATEGORY_LABEL[category],     // etiqueta secundaria (tipo)
    storage_path: slug,
    thumbnail_path: `thumbs/${base}.jpg`, // primer frame
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
  v("axa-1.mp4",                                     "ads", "9:16", "AXA", 0),
  v("bezoya-04-26-compressed.mp4",                   "ads", "9:16", "Bezoya", 1),
  v("bezoya-11-05-26-compressed.mp4",                "ads", "9:16", "Bezoya", 2),
  v("bitnovo291125-2-compressed.mp4",                "ads", "9:16", "Bitnovo", 3),
  v("dogfy-diet-oct-25-1-1-1.mp4",                   "ads", "9:16", "Dogfy Diet", 4),
  v("ecoembes-12-05-26.mp4",                         "ads", "9:16", "Ecoembes", 5),
  v("ecoembes-15-05-25.mp4",                         "ads", "9:16", "Ecoembes", 6),
  v("ecoembes-260326-1-1-1.mp4",                     "ads", "9:16", "Ecoembes", 7),
  v("ecoembes220725-2.mp4",                          "ads", "9:16", "Ecoembes", 8),
  v("ecoembes291225.mp4",                            "ads", "9:16", "Ecoembes", 9),
  v("redpandacompress-ecoembes-080825.mp4",          "ads", "9:16", "Ecoembes", 10),
  v("estool-ad3pol-oct25.mp4",                       "ads", "9:16", "Estool", 11),
  v("estool-nov-v1.mp4",                             "ads", "9:16", "Estool", 12),
  v("redpandacompress-estool-ad3pol-oct25.mp4",      "ads", "9:16", "Estool", 13),
  v("minibatt-2.mp4",                                "ads", "9:16", "MiniBatt", 14),
  v("murwal-3-03-26-compressed.mp4",                 "ads", "9:16", "Murwal", 15),
  v("redpandacompress-murwal-3-03-26-compressed.mp4","ads", "9:16", "Murwal", 16),
  v("petroprix2-240725-1-1-1.mp4",                   "ads", "9:16", "PetroPrix", 17),
  v("yadea-23-04-26-compressed.mp4",                 "ads", "9:16", "Yadea", 18),
  v("yoigo280426-vert-compressed.mp4",               "ads", "9:16", "Yoigo", 19),
  v("gestionar-la-facturacion-de-tu-gestoria-nunca-habia-sido-tan.mp4", "ads", "9:16", "Estool", 20),

  // ── ORGÁNICO (9:16) ─────────────────────────────────────────────────────────
  v("pol-morera-x-creator-studio-1.mp4", "organic", "9:16", "Pol Morera", 0),
  v("pol-morera-x-creator-studio-2.mp4", "organic", "9:16", "Pol Morera", 1),

  // ── STREET CONTENT (9:16) ───────────────────────────────────────────────────
  v("snapinsta-to-aqoqrbocpovfexjo7z-8alzmomebarhwmrsqd6ve31uzzmy.mp4", "street", "9:16", "Street", 0),
];
