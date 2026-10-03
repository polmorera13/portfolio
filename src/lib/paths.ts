// Base de la web: "/" en producción y "/test/" en la copia de pruebas
// (se fija al construir con `vite build --base=/test/`).
export const BASE = import.meta.env.BASE_URL;

/** Ruta absoluta dentro de la web, respetando la base: withBase("/#contacto"). */
export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  return BASE.replace(/\/$/, "") + path;
}

/** Basename para React Router ("/" o "/test"). */
export const ROUTER_BASENAME = BASE.replace(/\/$/, "") || "/";
