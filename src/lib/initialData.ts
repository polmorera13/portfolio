import type { Video } from "../types/video";
import type { CaseStudy, ServicesConfig } from "./api";

// Datos de la API que el prerenderizado mete en el HTML (window.__PM_DATA__),
// para que el HTML estático y la primera pintura en el navegador coincidan.
// Después, los componentes vuelven a pedir los datos a la API para estar al día.
export interface InitialData {
  videos: Video[];
  hero: Record<string, string | null>;
  services: ServicesConfig;
  cases: CaseStudy[];
  /** Miniaturas con versiones de 320/480 px: ruta sin extensión → ancho original (media.polmorera.es/variants.json). */
  variants?: Record<string, number>;
}

declare global {
  interface Window {
    __PM_DATA__?: InitialData;
  }
}

let data: InitialData | null = typeof window !== "undefined" ? window.__PM_DATA__ ?? null : null;

export function setInitialData(d: InitialData | null) {
  data = d;
}

export function getInitialData(): InitialData | null {
  return data;
}
