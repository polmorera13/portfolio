import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, ArrowUp, ArrowDown, UploadCloud, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  adminListVideos, adminUploadVideo, adminUpdateVideo, adminReorder, adminDeleteVideo,
} from "../lib/api";
import { getPublicUrl } from "../lib/supabase";
import type { Video } from "../types/video";

const BLUE = "oklch(58% 0.14 240)";
const OFFWHITE = "oklch(96% 0.005 240)";
const STEEL = "oklch(70% 0.07 230)";
const CARD = "oklch(16% 0.02 240)";
const BORDER = "oklch(58% 0.14 240 / 0.18)";

const CATS: { key: Video["category"]; label: string }[] = [
  { key: "ads", label: "Ads" },
  { key: "organic", label: "Orgánico" },
  { key: "corporate", label: "Corporativo" },
  { key: "street", label: "Street content" },
];

export default function Admin() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const list = await adminListVideos();
      setVideos(list);
    } catch (e) {
      if ((e as Error).message === "unauthorized") {
        signOut();
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, signOut]);

  useEffect(() => { load(); }, [load]);

  function handleLogout() {
    signOut();
    navigate("/", { replace: true });
  }

  // ── Upload ─────────────────────────────────────────────────────────────────
  const [file, setFile] = useState<File | null>(null);
  const [upCat, setUpCat] = useState<Video["category"]>("ads");
  const [upBrand, setUpBrand] = useState("");
  const [progress, setProgress] = useState<number | null>(null);

  async function handleUpload() {
    if (!file || !upBrand.trim()) return;
    setProgress(0);
    try {
      await adminUploadVideo(file, upCat, upBrand.trim(), (p) => setProgress(p));
      setFile(null); setUpBrand(""); setProgress(null);
      await load();
    } catch {
      alert("Error al subir el vídeo. Inténtalo de nuevo.");
      setProgress(null);
    }
  }

  // ── Item actions ─────────────────────────────────────────────────────────────
  async function updateItem(id: string, patch: Partial<{ category: string; brand: string; is_active: boolean }>) {
    setBusy(true);
    try { await adminUpdateVideo(id, patch); await load(); } finally { setBusy(false); }
  }

  async function removeItem(id: string) {
    if (!confirm("¿Eliminar este vídeo? No se puede deshacer.")) return;
    setBusy(true);
    try { await adminDeleteVideo(id); await load(); } finally { setBusy(false); }
  }

  async function move(cat: Video["category"], id: string, dir: -1 | 1) {
    const inCat = videos.filter((v) => v.category === cat).sort((a, b) => a.display_order - b.display_order);
    const idx = inCat.findIndex((v) => v.id === id);
    const swap = idx + dir;
    if (swap < 0 || swap >= inCat.length) return;
    const reordered = [...inCat];
    [reordered[idx], reordered[swap]] = [reordered[swap], reordered[idx]];
    setBusy(true);
    try { await adminReorder(reordered.map((v) => v.id)); await load(); } finally { setBusy(false); }
  }

  const inputStyle: React.CSSProperties = {
    padding: "0.6rem 0.75rem", borderRadius: 8, border: `1px solid ${BORDER}`,
    background: CARD, color: OFFWHITE, fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", outline: "none",
  };

  return (
    <div className="min-h-screen bg-navy" style={{ fontFamily: "Poppins, sans-serif" }}>
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 1.5rem", borderBottom: `1px solid ${BORDER}`,
        background: "oklch(11% 0.02 240 / 0.95)", position: "sticky", top: 0, zIndex: 50,
      }}>
        <h1 style={{ fontWeight: 600, fontSize: "1.25rem", color: OFFWHITE }}>Gestor de vídeos</h1>
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 0.875rem",
          borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent",
          color: STEEL, fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
        }}>
          <LogOut size={15} /> Cerrar sesión
        </button>
      </header>

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "2rem 1.25rem" }}>
        {/* Upload panel */}
        <section style={{
          border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1.25rem", marginBottom: "2rem",
          background: "oklch(13% 0.02 240)",
        }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", color: OFFWHITE, marginBottom: "1rem" }}>Subir vídeo</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input type="file" accept="video/mp4,video/quicktime,video/webm"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={{ ...inputStyle, cursor: "pointer" }} />
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <select value={upCat} onChange={(e) => setUpCat(e.target.value as Video["category"])} style={{ ...inputStyle, flex: "1 1 180px" }}>
                {CATS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              <input type="text" placeholder="Marca (ej. Bitnovo)" value={upBrand}
                onChange={(e) => setUpBrand(e.target.value)} style={{ ...inputStyle, flex: "2 1 220px" }} />
            </div>
            <button onClick={handleUpload} disabled={!file || !upBrand.trim() || progress !== null}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                padding: "0.75rem", borderRadius: 8, border: "none",
                background: (!file || !upBrand.trim() || progress !== null) ? "oklch(58% 0.14 240 / 0.4)" : BLUE,
                color: OFFWHITE, fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "0.9rem",
                cursor: (!file || !upBrand.trim() || progress !== null) ? "not-allowed" : "pointer",
              }}>
              <UploadCloud size={16} />
              {progress !== null ? `Subiendo… ${progress}%` : "Subir vídeo"}
            </button>
            {progress !== null && (
              <div style={{ height: 4, background: CARD, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: BLUE, transition: "width 150ms" }} />
              </div>
            )}
          </div>
        </section>

        {/* Video list grouped by category */}
        {loading ? (
          <p style={{ color: STEEL, textAlign: "center", padding: "2rem" }}>Cargando…</p>
        ) : (
          CATS.map((c) => {
            const items = videos.filter((v) => v.category === c.key).sort((a, b) => a.display_order - b.display_order);
            return (
              <section key={c.key} style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontWeight: 600, fontSize: "0.95rem", color: OFFWHITE, marginBottom: "0.75rem" }}>
                  {c.label} · {items.length}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {items.length === 0 && <p style={{ color: STEEL, fontSize: "0.85rem" }}>Sin vídeos.</p>}
                  {items.map((v, i) => (
                    <div key={v.id} style={{
                      display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem",
                      border: `1px solid ${BORDER}`, borderRadius: 10, background: CARD,
                      opacity: v.is_active === false ? 0.45 : 1,
                    }}>
                      {/* Thumb */}
                      <div style={{
                        width: v.aspect_ratio === "16:9" ? 72 : 40, height: 56, borderRadius: 6,
                        overflow: "hidden", flexShrink: 0, background: "oklch(20% 0.02 240)",
                      }}>
                        {v.thumbnail_path && (
                          <img src={getPublicUrl(v.thumbnail_path)} alt="" loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                      {/* Brand (editable) */}
                      <input defaultValue={v.title ?? ""} onBlur={(e) => {
                        if (e.target.value !== (v.title ?? "")) updateItem(v.id, { brand: e.target.value });
                      }} style={{ ...inputStyle, flex: 1, minWidth: 0, padding: "0.4rem 0.6rem" }} />
                      {/* Category */}
                      <select value={v.category} onChange={(e) => updateItem(v.id, { category: e.target.value })}
                        style={{ ...inputStyle, padding: "0.4rem 0.5rem", flex: "0 0 auto" }}>
                        {CATS.map((cc) => <option key={cc.key} value={cc.key}>{cc.label}</option>)}
                      </select>
                      {/* Reorder */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <IconBtn disabled={i === 0 || busy} onClick={() => move(c.key, v.id, -1)}><ArrowUp size={14} /></IconBtn>
                        <IconBtn disabled={i === items.length - 1 || busy} onClick={() => move(c.key, v.id, 1)}><ArrowDown size={14} /></IconBtn>
                      </div>
                      {/* Active toggle */}
                      <IconBtn onClick={() => updateItem(v.id, { is_active: v.is_active === false })} title={v.is_active === false ? "Activar" : "Desactivar"}>
                        <Check size={15} color={v.is_active === false ? STEEL : BLUE} />
                      </IconBtn>
                      {/* Delete */}
                      <IconBtn onClick={() => removeItem(v.id)} title="Eliminar"><Trash2 size={15} color="oklch(65% 0.18 25)" /></IconBtn>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>
    </div>
  );
}

function IconBtn({ children, onClick, disabled, title }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; title?: string }) {
  return (
    <button onClick={onClick} disabled={disabled} title={title} style={{
      width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: 6, border: `1px solid ${BORDER}`, background: "transparent",
      color: OFFWHITE, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1, flexShrink: 0,
    }}>
      {children}
    </button>
  );
}
