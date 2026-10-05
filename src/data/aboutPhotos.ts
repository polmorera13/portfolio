import type { TFunction } from "../lib/i18n";
import type { Photo } from "../components/RotatingPhotos";

/** Fotos de "Quién está detrás" (portada y página Sobre mí), en el orden en que rotan. */
export const aboutPhotos = (t: TFunction): Photo[] => [
  { src: "/pol-morera.webp", width: 1044, height: 1328, alt: t("about.img_alt") },
  { src: "/pol-morera-camara.webp", width: 1000, height: 1251, alt: t("about.img_alt_camera"), position: "50% 30%" },
  { src: "/pol-morera-evento-1.webp", width: 1000, height: 1370, alt: t("about.img_alt_event"), position: "32% 45%" },
  { src: "/pol-morera-evento-2.webp", width: 1000, height: 1235, alt: t("about.img_alt_event"), position: "50% 40%" },
];
