import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, ArrowUp, ArrowDown, UploadCloud, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  adminListVideos, adminUploadVideo, adminUpdateVideo, adminReorder, adminDeleteVideo,
  fetchHero, adminSetHero, fetchServices, adminSetServices, clearToken,
  type ServicesConfig,
} from "../lib/api";
import { services as SERVICES } from "../data/services";
import CasesAdmin from "./admin/CasesAdmin";
import { getPublicUrl } from "../lib/supabase";
import { HERO_SLOTS, type HeroConfig } from "../data/heroSlots";
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
  const [hero, setHero] = useState<HeroConfig>({});
  const [svc, setSvc] = useState<ServicesConfig>({});

  // Depends only on navigate (stable) so it doesn't re-run on every render.
  const load = useCallback(async () => {
    try {
      const [list, heroCfg, svcCfg] = await Promise.all([
        adminListVideos(),
        fetchHero().catch(() => ({})),
        fetchServices().catch(() => ({})),
      ]);
      setVideos(list);
      setHero(heroCfg);
      setSvc(svcCfg);
    } catch (e) {
      if ((e as Error).message === "unauthorized") {
        clearToken();
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  async function setHeroSlot(n: number, slug: string) {
    setBusy(true);
    try {
      const cfg = await adminSetHero({ [String(n)]: slug || null });
      setHero(cfg);
    } catch {
      alert("No se pudo guardar la casilla. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  // Vídeos de "Qué produzco": lo que se ve ahora en la web (panel o, si no hay, los por defecto)
  const svcVideos = (key: "ads" | "organic" | "corporate") => {
    const def = SERVICES.find((x) => x.configKey === key)!.videos;
    const chosen = svc[key];
    return def.map((d, i) => (chosen && chosen.length ? chosen[i] ?? null : d));
  };

  async function setServiceSlot(key: "ads" | "organic" | "corporate", index: number, slug: string) {
    setBusy(true);
    try {
      const list = svcVideos(key);
      list[index] = slug || null;
      const cfg = await adminSetServices({ [key]: list });
      setSvc(cfg);
    } catch {
      alert("No se pudo guardar el vídeo del servicio. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

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
        {/* Portada (hero): qué vídeo va en cada casilla */}
        <section style={{
          border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1.25rem", marginBottom: "2rem",
          background: "oklch(13% 0.02 240)",
        }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", color: OFFWHITE, marginBottom: "0.25rem" }}>Portada</h2>
          <p style={{ color: STEEL, fontSize: "0.8125rem", marginBottom: "1.25rem" }}>
            Elige el vídeo de cada casilla. La 1 es la horizontal del centro; el resto son verticales. Los cambios se ven en la web al momento.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-start" }}>
            {/* Mapa de casillas */}
            <div style={{ flex: "1 1 280px", maxWidth: 380, position: "relative", aspectRatio: "9 / 10" }}>
              {HERO_SLOTS.map((s) => {
                const v = videos.find((x) => x.storage_path === hero[String(s.n)]);
                return (
                  <div key={s.n} style={{
                    position: "absolute", left: s.x, top: s.y, width: s.width, zIndex: s.z,
                    transform: `rotate(${s.rotate}deg)`,
                  }}>
                    <div style={{
                      aspectRatio: s.aspectRatio === "16:9" ? "16 / 9" : "9 / 16",
                      borderRadius: 8, overflow: "hidden", background: CARD,
                      border: `1px solid ${v ? BORDER : "oklch(65% 0.18 25 / 0.5)"}`,
                      boxShadow: "0 6px 16px oklch(8% 0.02 240 / 0.6)",
                    }}>
                      {v?.thumbnail_path && (
                        <img src={getPublicUrl(v.thumbnail_path)} alt="" loading="lazy"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      )}
                    </div>
                    <span style={{
                      position: "absolute", top: 4, left: 4, minWidth: 20, height: 20, padding: "0 5px",
                      borderRadius: 6, background: "oklch(10% 0.02 240 / 0.85)", color: OFFWHITE,
                      fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{s.n}</span>
                  </div>
                );
              })}
            </div>

            {/* Selectores */}
            <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {HERO_SLOTS.map((s) => {
                const options = videos
                  .filter((v) => v.is_active !== false && v.aspect_ratio === s.aspectRatio)
                  .sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
                return (
                  <label key={s.n} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{
                      width: 24, height: 24, flexShrink: 0, borderRadius: 6, background: "oklch(58% 0.14 240 / 0.18)",
                      color: OFFWHITE, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{s.n}</span>
                    <span style={{ width: 128, flexShrink: 0, fontSize: "0.8125rem", color: STEEL }}>{s.label}</span>
                    <select value={hero[String(s.n)] ?? ""} disabled={busy}
                      onChange={(e) => setHeroSlot(s.n, e.target.value)}
                      style={{ ...inputStyle, flex: 1, minWidth: 0, padding: "0.4rem 0.5rem" }}>
                      <option value="">— vacía —</option>
                      {options.map((v) => (
                        <option key={v.id} value={v.storage_path}>
                          {v.title} · {CATS.find((c) => c.key === v.category)?.label} · {v.storage_path.replace(/\.mp4$/, "").slice(0, 22)}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* Qué produzco: vídeo de cada servicio */}
        <section style={{
          border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1.25rem", marginBottom: "2rem",
          background: "oklch(13% 0.02 240)",
        }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", color: OFFWHITE, marginBottom: "0.25rem" }}>Qué produzco</h2>
          <p style={{ color: STEEL, fontSize: "0.8125rem", marginBottom: "1.25rem" }}>
            El vídeo que se ve en cada servicio. Anuncios y Redes llevan uno vertical; Empresa, tres horizontales (se ven uno encima de otro). Los cambios se ven en la web al momento.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {SERVICES.map((service) => {
              const key = service.configKey;
              const ratio = key === "corporate" ? "16:9" : "9:16";
              const options = videos
                .filter((v) => v.is_active !== false && v.aspect_ratio === ratio)
                .sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
              return (
                <div key={key}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: OFFWHITE, marginBottom: "0.5rem" }}>
                    {service.title.es}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {svcVideos(key).map((slug, i) => {
                      const v = videos.find((x) => x.storage_path === slug);
                      return (
                        <label key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <div style={{
                            width: ratio === "16:9" ? 72 : 32, height: ratio === "16:9" ? 40 : 56, flexShrink: 0,
                            borderRadius: 6, overflow: "hidden", background: CARD, border: `1px solid ${BORDER}`,
                          }}>
                            {v?.thumbnail_path && (
                              <img src={getPublicUrl(v.thumbnail_path)} alt="" loading="lazy"
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            )}
                          </div>
                          {key === "corporate" && (
                            <span style={{ width: 24, flexShrink: 0, fontSize: 12, fontWeight: 700, color: STEEL }}>{i + 1}</span>
                          )}
                          <select value={slug ?? ""} disabled={busy}
                            onChange={(e) => setServiceSlot(key, i, e.target.value)}
                            style={{ ...inputStyle, flex: 1, minWidth: 0, padding: "0.4rem 0.5rem" }}>
                            <option value="">— vacío —</option>
                            {options.map((o) => (
                              <option key={o.id} value={o.storage_path}>
                                {o.title} · {CATS.find((c) => c.key === o.category)?.label} · {o.storage_path.replace(/.mp4$/, "").slice(0, 22)}
                              </option>
                            ))}
                          </select>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Casos de éxito / KPIs */}
        <CasesAdmin />

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
