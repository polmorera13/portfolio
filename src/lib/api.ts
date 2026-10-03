// Cliente de la API propia (VPS) — reemplaza a Supabase.
import type { Video } from "../types/video";

export const API_BASE = "https://api.polmorera.es";

const TOKEN_KEY = "pol-admin-token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// ── Público ───────────────────────────────────────────────────────────────────
export async function fetchVideos(): Promise<Video[]> {
  const res = await fetch(`${API_BASE}/api/videos`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch_videos_failed");
  return res.json();
}

// Asignación de vídeos a las casillas de la portada: { "1": slug, ..., "7": slug }
export async function fetchHero(): Promise<Record<string, string | null>> {
  const res = await fetch(`${API_BASE}/api/hero`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch_hero_failed");
  return res.json();
}

export async function adminSetHero(slots: Record<string, string | null>): Promise<Record<string, string | null>> {
  const res = await fetch(`${API_BASE}/api/admin/hero`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ slots }),
  });
  if (!res.ok) throw new Error("set_hero_failed");
  return res.json();
}

// Vídeos de "Qué produzco": { ads: [slug], organic: [slug], corporate: [slug, slug, slug] }
export type ServicesConfig = Partial<Record<"ads" | "organic" | "corporate", (string | null)[]>>;

export async function fetchServices(): Promise<ServicesConfig> {
  const res = await fetch(`${API_BASE}/api/services`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch_services_failed");
  return res.json();
}

export async function adminSetServices(services: ServicesConfig): Promise<ServicesConfig> {
  const res = await fetch(`${API_BASE}/api/admin/services`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ services }),
  });
  if (!res.ok) throw new Error("set_services_failed");
  return res.json();
}

export type ContactType = "quote" | "proposal";

export async function sendContact(payload: {
  name: string;
  email: string;
  message: string;
  type: ContactType;
  website: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("contact_failed");
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function login(password: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) return false;
  const { token } = await res.json();
  setToken(token);
  return true;
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function adminListVideos(): Promise<Video[]> {
  const res = await fetch(`${API_BASE}/api/admin/videos`, { headers: authHeaders(), cache: "no-store" });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("list_failed");
  return res.json();
}

export async function adminUploadVideo(file: File, category: string, brand: string, onProgress?: (pct: number) => void): Promise<Video> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", category);
    fd.append("brand", brand);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/api/admin/videos`);
    const t = getToken();
    if (t) xhr.setRequestHeader("Authorization", `Bearer ${t}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
      else reject(new Error("upload_failed"));
    };
    xhr.onerror = () => reject(new Error("upload_failed"));
    xhr.send(fd);
  });
}

export async function adminUpdateVideo(id: string, patch: Partial<{ category: string; brand: string; is_active: boolean; display_order: number }>): Promise<Video> {
  const res = await fetch(`${API_BASE}/api/admin/videos/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("update_failed");
  return res.json();
}

export async function adminReorder(ids: string[]): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/videos/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("reorder_failed");
}

export async function adminDeleteVideo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/videos/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("delete_failed");
}

// ── Casos de éxito / KPIs ───────────────────────────────────────────────────
export type Tri = { es: string; en: string; ca: string };

export interface CaseKpi {
  value: string;
  label: Tri;
  context: Tri;
  highlight: boolean;
}
export interface CaseVideo {
  file: string; // ruta en media.polmorera.es (cases/...)
  poster: string;
  name: string; // nombre interno
  label: Tri; // etiqueta visible (Mayo · Hook 1)
  aspect: "9:16" | "16:9";
}
export interface CaseEvidence {
  image: string;
  alt: Tri;
  description: Tri;
  visible: boolean;
}
export interface CaseStudy {
  id: string;
  published: boolean;
  brandName: string;
  brandLogo: string;
  platform: string;
  campaignType: Tri;
  industry: Tri;
  title: Tri;
  description: Tri;
  quote: Tri;
  quoteAuthor: string;
  insight: Tri;
  disclaimer: Tri;
  kpis: CaseKpi[];
  chart: { title: Tri; bars: { label: Tri; value: number; display: string }[] };
  videos: CaseVideo[];
  evidence: CaseEvidence[];
}

export async function fetchCases(): Promise<CaseStudy[]> {
  const res = await fetch(`${API_BASE}/api/cases`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch_cases_failed");
  return res.json();
}

export async function adminListCases(): Promise<CaseStudy[]> {
  const res = await fetch(`${API_BASE}/api/admin/cases`, { headers: authHeaders(), cache: "no-store" });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("list_cases_failed");
  return res.json();
}

export async function adminCreateCase(data: Partial<CaseStudy> = {}): Promise<CaseStudy> {
  const res = await fetch(`${API_BASE}/api/admin/cases`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("create_case_failed");
  return res.json();
}

export async function adminSaveCase(c: CaseStudy): Promise<CaseStudy> {
  const res = await fetch(`${API_BASE}/api/admin/cases/${encodeURIComponent(c.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(c),
  });
  if (!res.ok) throw new Error("save_case_failed");
  return res.json();
}

export async function adminDeleteCase(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/cases/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("delete_case_failed");
}

export async function adminReorderCases(ids: string[]): Promise<CaseStudy[]> {
  const res = await fetch(`${API_BASE}/api/admin/cases/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("reorder_cases_failed");
  return res.json();
}

/** Sube un vídeo o una imagen para un caso. Devuelve rutas relativas a media.polmorera.es. */
export function adminUploadCaseFile(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ file: string; poster: string | null; aspect: "9:16" | "16:9" | null; kind: "video" | "image" }> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/api/admin/cases/upload`);
    const t = getToken();
    if (t) xhr.setRequestHeader("Authorization", `Bearer ${t}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
      else reject(new Error("upload_failed"));
    };
    xhr.onerror = () => reject(new Error("upload_failed"));
    xhr.send(fd);
  });
}
