import type { TFunction } from "../lib/i18n";
import type { Photo } from "../components/RotatingPhotos";

/** Fotos de "Quién está detrás" (portada), en el orden en que rotan. */
export const aboutPhotos = (t: TFunction): Photo[] => [...aboutHeroPhotos(t), ...aboutStoryPhotos(t)];

/** Sobre mí, arriba a la derecha: retrato y grabando a cámara. */
export const aboutHeroPhotos = (t: TFunction): Photo[] => [
  { src: "/pol-morera.webp", width: 1044, height: 1328, alt: t("about.img_alt") },
  { src: "/pol-morera-camara.webp", width: 1000, height: 1251, alt: t("about.img_alt_camera"), position: "50% 30%" },
];

/** Sobre mí, a la izquierda de "Mi historia": las dos del evento. */
export const aboutStoryPhotos = (t: TFunction): Photo[] => [
  { src: "/pol-morera-evento-1-v2.webp", width: 1000, height: 1370, alt: t("about.img_alt_event"), position: "32% 45%" },
  { src: "/pol-morera-evento-2-v2.webp", width: 1000, height: 1235, alt: t("about.img_alt_event"), position: "50% 40%" },
];
