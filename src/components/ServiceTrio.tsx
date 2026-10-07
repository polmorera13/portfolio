import VideoPlayer from "./VideoPlayer";
import { getPublicUrl } from "../lib/supabase";
import { catalogPoster } from "../seo/videos";

// Tres vídeos de ejemplo arriba de las páginas de servicio: cada uno en un marco
// de un color de la web (azul, blanco y azul acero), un poco girados y con el
// del centro más alto, para que llame la atención. Se reproducen al pulsar.
const FRAMES = [
  { bg: "#2D6FB8", fg: "#FFFFFF", rotate: -3, y: 22 },
  { bg: "#F4F6F9", fg: "#0D1B2A", rotate: 0, y: 0 },
  { bg: "#8AAFCC", fg: "#0D1B2A", rotate: 3, y: 22 },
];

export interface TrioVideo {
  file: string;
  brand: string | null;
  /** Nombre accesible (el mismo que su VideoObject). */
  name?: string;
}

export default function ServiceTrio({ videos }: { videos: TrioVideo[] }) {
  return (
    <div className="relative w-full max-w-[560px] lg:max-w-none mx-auto px-1 pb-6 lg:pt-4">
      {/* Halo azul detrás de los tres */}
      <div aria-hidden="true" className="absolute inset-x-6 top-10 bottom-10 rounded-full bg-brand-blue/25 blur-3xl" />
      {/* Móvil: tres columnas. Escritorio: más grandes, un poco solapados y el del centro delante */}
      <ul className="relative grid grid-cols-3 gap-2.5 sm:gap-4 items-start lg:flex lg:justify-center lg:gap-0">
        {videos.slice(0, 3).map((v, i) => {
          const f = FRAMES[i];
          return (
            <li
              key={v.file}
              className={`trio-card rounded-2xl p-1.5 sm:p-2 shadow-2xl shadow-black/40 transition-transform duration-300 ease-out lg:w-[44%] lg:shrink-0 lg:-mx-[3%] ${i === 1 ? "trio-center relative z-10" : ""}`}
              style={{ background: f.bg, ["--trio-r" as string]: `${f.rotate}deg`, ["--trio-y" as string]: `${f.y}px` }}
            >
              <VideoPlayer
                src={getPublicUrl(v.file)}
                poster={getPublicUrl(catalogPoster(v.file))}
                aspectRatio="9:16"
                hideLabels
                indexable
                ariaName={v.name}
              />
              {v.brand && (
                <span className="block text-center font-bold uppercase truncate pt-1.5 sm:pt-2 pb-0.5 text-[10px] sm:text-xs tracking-[0.12em]" style={{ color: f.fg }}>
                  {v.brand}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
