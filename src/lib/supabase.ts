// Antes este archivo creaba el cliente de Supabase. Supabase ya no se usa:
// los vídeos se sirven desde nuestro VPS (media.polmorera.es) y el resto va por
// api.polmorera.es (ver lib/api.ts). Solo queda el helper de URLs de medios.
import { getInitialData } from "./initialData";

const MEDIA_BASE = "https://media.polmorera.es";

/**
 * Vídeos con versión ligera (720p, ~1,3 Mbps) en media.polmorera.es/v720/: se piden esos
 * en lugar del original. La lista (v720.json) la mete el prerenderizado en los datos de la
 * página; los vídeos subidos después, sin versión ligera, se sirven tal cual.
 */
export function lightVideo(path: string): string {
  return /.mp4$/.test(path) && getInitialData()?.light?.includes(path) ? `v720/${path}` : path;
}

export function getPublicUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;   // already absolute
  if (path.startsWith("/")) return path;       // local /public asset
  return `${MEDIA_BASE}/${lightVideo(path)}`;   // media server slug
}
