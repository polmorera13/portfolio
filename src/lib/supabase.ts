// Antes este archivo creaba el cliente de Supabase. Supabase ya no se usa:
// los vídeos se sirven desde nuestro VPS (media.polmorera.es) y el resto va por
// api.polmorera.es (ver lib/api.ts). Solo queda el helper de URLs de medios.
const MEDIA_BASE = "https://media.polmorera.es";

export function getPublicUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;   // already absolute
  if (path.startsWith("/")) return path;       // local /public asset
  return `${MEDIA_BASE}/${path}`;              // media server slug
}
