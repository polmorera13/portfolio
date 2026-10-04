import type { TFunction } from "i18next";
import type { Photo } from "../components/RotatingPhotos";

/** Fotos de "Quién está detrás" (portada y página Sobre mí), en el orden en que rotan. */
export const aboutPhotos = (t: TFunction): Photo[] => [
  { src: "/pol-morera.webp", alt: t("about.img_alt") },
  { src: "/pol-morera-camara.webp", alt: t("about.img_alt_camera"), position: "50% 30%" },
  { src: "/pol-morera-evento-1.webp", alt: t("about.img_alt_event"), position: "32% 45%" },
  { src: "/pol-morera-evento-2.webp", alt: t("about.img_alt_event"), position: "50% 40%" },
];
