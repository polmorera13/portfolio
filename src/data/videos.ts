import type { Video } from "../types/video";

// ─────────────────────────────────────────────────────────────────────────────
// Catálogo de vídeos — servidos desde media.polmorera.es (VPS propio).
//
// Clasificación inicial hecha por deducción del nombre de archivo. La
// orientación (16:9 / 9:16) está detectada de forma REAL con ffprobe, así que
// es exacta. Las CATEGORÍAS son un primer intento — Pol las revisa y corrige.
//
// Para cambiar la categoría de un vídeo, edita su campo `category`:
//   "ads" | "organic" | "corporate" | "street"
// Para quitarlo de la web, pon `is_active: false`.
// El vídeo destacado del hero es el corporativo cuyo client contiene "Reactiva".
// ─────────────────────────────────────────────────────────────────────────────

function v(
  slug: string,
  category: Video["category"],
  aspect_ratio: Video["aspect_ratio"],
  client: string,
  title: string,
  order: number,
): Video {
  return {
    id: slug,
    category,
    title,
    client,
    storage_path: slug,
    thumbnail_path: null,
    aspect_ratio,
    display_order: order,
    is_active: true,
    created_at: "2026-05-13T00:00:00Z",
    slot: null,
    media_type: "video",
  };
}

export const videos: Video[] = [
  // ── CORPORATIVO (16:9) ──────────────────────────────────────────────────────
  v("reactiva-vsl-terminado-v3-compressed.mp4", "corporate", "16:9", "Reactiva Online", "VSL", 0),
  v("reactivaweb-v4-compressed-1.mp4",          "corporate", "16:9", "Reactiva Online", "Web", 1),
  v("rcx-software-pol-morera-1.mp4",            "corporate", "16:9", "RCX Software", "Corporativo", 2),
  v("estoolweb-v6.mp4",                         "corporate", "16:9", "Estool", "Web", 3),
  v("flashled-pol-3-corpo-horizontal.mp4",      "corporate", "16:9", "FlashLED", "Corporativo", 4),
  v("yoigo0126-1-169.mp4",                      "corporate", "16:9", "Yoigo", "Corporativo", 5),
  v("linkedin-video.mp4",                       "corporate", "16:9", "LinkedIn", "Vídeo", 6),

  // ── ADS (9:16) ──────────────────────────────────────────────────────────────
  v("axa-1.mp4",                                     "ads", "9:16", "AXA", "Ad", 0),
  v("bezoya-04-26-compressed.mp4",                   "ads", "9:16", "Bezoya", "Ad", 1),
  v("bezoya-11-05-26-compressed.mp4",                "ads", "9:16", "Bezoya", "Ad", 2),
  v("bitnovo291125-2-compressed.mp4",                "ads", "9:16", "Bitnovo", "Ad", 3),
  v("dogfy-diet-oct-25-1-1-1.mp4",                   "ads", "9:16", "Dogfy Diet", "Ad", 4),
  v("ecoembes-12-05-26.mp4",                         "ads", "9:16", "Ecoembes", "Ad", 5),
  v("ecoembes-15-05-25.mp4",                         "ads", "9:16", "Ecoembes", "Ad", 6),
  v("ecoembes-260326-1-1-1.mp4",                     "ads", "9:16", "Ecoembes", "Ad", 7),
  v("ecoembes220725-2.mp4",                          "ads", "9:16", "Ecoembes", "Ad", 8),
  v("ecoembes291225.mp4",                            "ads", "9:16", "Ecoembes", "Ad", 9),
  v("redpandacompress-ecoembes-080825.mp4",          "ads", "9:16", "Ecoembes", "Ad", 10),
  v("estool-ad3pol-oct25.mp4",                       "ads", "9:16", "Estool", "Ad", 11),
  v("estool-nov-v1.mp4",                             "ads", "9:16", "Estool", "Ad", 12),
  v("redpandacompress-estool-ad3pol-oct25.mp4",      "ads", "9:16", "Estool", "Ad", 13),
  v("minibatt-2.mp4",                                "ads", "9:16", "MiniBatt", "Ad", 14),
  v("murwal-3-03-26-compressed.mp4",                 "ads", "9:16", "Murwal", "Ad", 15),
  v("redpandacompress-murwal-3-03-26-compressed.mp4","ads", "9:16", "Murwal", "Ad", 16),
  v("petroprix2-240725-1-1-1.mp4",                   "ads", "9:16", "PetroPrix", "Ad", 17),
  v("yadea-23-04-26-compressed.mp4",                 "ads", "9:16", "Yadea", "Ad", 18),
  v("yoigo280426-vert-compressed.mp4",               "ads", "9:16", "Yoigo", "Ad", 19),
  v("gestionar-la-facturacion-de-tu-gestoria-nunca-habia-sido-tan.mp4", "ads", "9:16", "Estool", "Ad", 20),

  // ── ORGÁNICO (9:16) ─────────────────────────────────────────────────────────
  v("pol-morera-x-creator-studio-1.mp4", "organic", "9:16", "Pol Morera", "Orgánico", 0),
  v("pol-morera-x-creator-studio-2.mp4", "organic", "9:16", "Pol Morera", "Orgánico", 1),

  // ── STREET CONTENT (9:16) ───────────────────────────────────────────────────
  v("snapinsta-to-aqoqrbocpovfexjo7z-8alzmomebarhwmrsqd6ve31uzzmy.mp4", "street", "9:16", "Street", "Street content", 0),
];
