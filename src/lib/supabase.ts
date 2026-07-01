import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(url, key);

// Videos are served from our own VPS at media.polmorera.es
const MEDIA_BASE = "https://media.polmorera.es";

export function getPublicUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;   // already absolute
  if (path.startsWith("/")) return path;       // local /public asset
  return `${MEDIA_BASE}/${path}`;              // media server slug
}
