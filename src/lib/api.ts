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

export async function sendContact(payload: { name: string; email: string; message: string }): Promise<void> {
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
