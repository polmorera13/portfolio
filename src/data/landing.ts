// ─────────────────────────────────────────────────────────────────────────────
// Landing de los anuncios (/propuesta-gratis/, /en/free-proposal/, /ca/proposta-gratis/).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * VSL de la landing (vídeo en media.polmorera.es y su miniatura). Mientras
 * `file` sea null, en su sitio se ve un hueco marcado para colocarlo.
 */
export const LANDING_VSL: { file: string | null; poster: string | null; aspect: "16:9" | "9:16" } = {
  file: null,
  poster: null,
  aspect: "16:9",
};

/** Vídeo de ejemplo de cada tipo (con miniatura en thumbs/): anuncios, redes y corporativo. */
export const LANDING_EXAMPLES: Record<"ads" | "organic" | "corporate", string> = {
  ads: "rastreator-5-09-26-compressed-web.mp4",
  organic: "axa-1-web.mp4",
  corporate: "reactivaweb-v4-compressed-1-web.mp4",
};

/** Preguntas de la landing (las mismas de la portada, por su texto en español). */
export const LANDING_FAQ = [
  "¿Cuánto cuesta?",
  "¿Cuánto tarda un proyecto?",
  "¿El vídeo es mío? ¿Puedo usarlo todo el tiempo que quiera?",
  "¿Sales tú en cámara o trabajas con actores?",
];

/** Testimonios de la landing (posición en testimonials.items de los textos). */
export const LANDING_TESTIMONIALS = [0, 1, 4];

/** Ancla del formulario (todos los botones de la landing llevan aquí). */
export const LANDING_FORM_ID = "formulario";
