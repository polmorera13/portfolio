// ─────────────────────────────────────────────────────────────────────────────
// Casillas del collage de la portada (hero). Las comparte la web y el panel.
//
//   1 · Centro (horizontal)
//   2 · Arriba izquierda   3 · Arriba centro   4 · Arriba derecha
//   5 · Abajo izquierda    6 · Abajo centro    7 · Abajo derecha
//
// Qué vídeo va en cada casilla se guarda en el VPS (api.polmorera.es/api/hero)
// y se edita desde polmorera.es/login. DEFAULT_HERO es solo el respaldo.
// ─────────────────────────────────────────────────────────────────────────────

export type HeroSlotDef = {
  n: number;
  label: string;
  x: string;
  y: string;
  rotate: number;
  width: string;
  z: number;
  dur: string;
  delay: string;
  aspectRatio: "16:9" | "9:16";
};

export const HERO_SLOTS: HeroSlotDef[] = [
  { n: 1, label: "Centro (horizontal)", x: "16%", y: "30%", rotate: -2, width: "66%", z: 10, dur: "5.6s", delay: "0s",   aspectRatio: "16:9" },
  { n: 2, label: "Arriba izquierda",    x: "5%",  y: "4%",  rotate: -7, width: "30%", z: 3,  dur: "5.0s", delay: "0.7s", aspectRatio: "9:16" },
  { n: 3, label: "Arriba centro",       x: "36%", y: "0%",  rotate:  3, width: "28%", z: 2,  dur: "5.3s", delay: "1.1s", aspectRatio: "9:16" },
  { n: 4, label: "Arriba derecha",      x: "67%", y: "2%",  rotate:  6, width: "30%", z: 4,  dur: "4.6s", delay: "1.2s", aspectRatio: "9:16" },
  { n: 5, label: "Abajo izquierda",     x: "7%",  y: "50%", rotate:  8, width: "31%", z: 5,  dur: "5.2s", delay: "0.4s", aspectRatio: "9:16" },
  { n: 6, label: "Abajo centro",        x: "37%", y: "58%", rotate: -3, width: "30%", z: 7,  dur: "5.4s", delay: "1.5s", aspectRatio: "9:16" },
  { n: 7, label: "Abajo derecha",       x: "65%", y: "48%", rotate: -6, width: "32%", z: 6,  dur: "4.8s", delay: "0.9s", aspectRatio: "9:16" },
];

export type HeroConfig = Record<string, string | null>;

export const DEFAULT_HERO: HeroConfig = {
  "1": "reactiva-vsl-terminado-v3-compressed.mp4",
  "2": "axa-1.mp4",
  "3": "bezoya-04-26-compressed.mp4",
  "4": "pol-morera-x-creator-studio-2.mp4",
  "5": "snapinsta-to-aqoqrbocpovfexjo7z-8alzmomebarhwmrsqd6ve31uzzmy.mp4",
  "6": "ad-3-hook-3-cta-1.mp4",
  "7": "dogfy-diet-oct-25-1-1-1.mp4",
};
