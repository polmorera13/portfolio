import { useCallback, useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, Pencil, Eye, EyeOff, UploadCloud } from "lucide-react";
import {
  adminListCases, adminCreateCase, adminSaveCase, adminDeleteCase, adminReorderCases, adminUploadCaseFile,
  type CaseStudy, type Tri,
} from "../../lib/api";
import { getPublicUrl } from "../../lib/supabase";

// Gestor de "Casos de éxito / KPIs" dentro del panel /admin.
// Cada caso se edita en local y se guarda entero con "Guardar cambios".

const OFFWHITE = "oklch(96% 0.005 240)";
const STEEL = "oklch(70% 0.07 230)";
const CARD = "oklch(16% 0.02 240)";
const BORDER = "oklch(58% 0.14 240 / 0.18)";
const BLUE = "oklch(58% 0.14 240)";

const emptyTri = (): Tri => ({ es: "", en: "", ca: "" });
const mediaUrl = (p: string) => (!p ? "" : p.startsWith("/") ? p : getPublicUrl(p));

const input: React.CSSProperties = {
  padding: "0.45rem 0.6rem", borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD,
  color: OFFWHITE, fontFamily: "Poppins, sans-serif", fontSize: "0.8125rem", outline: "none", width: "100%", minWidth: 0,
};
const smallBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "0.4rem 0.7rem", borderRadius: 8,
  border: `1px solid ${BORDER}`, background: "transparent", color: STEEL, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
};
const label: React.CSSProperties = { fontSize: "0.75rem", fontWeight: 600, color: STEEL, marginBottom: 4, display: "block" };
const box: React.CSSProperties = { border: `1px solid ${BORDER}`, borderRadius: 10, padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.75rem" };

/** Texto en ES (obligatorio) + EN + CAT (opcionales: si faltan, se muestra el ES). */
function TriField({ title, value, onChange, multiline = false }: { title: string; value: Tri; onChange: (v: Tri) => void; multiline?: boolean }) {
  const Field = multiline ? "textarea" : "input";
  return (
    <div>
      <span style={label}>{title}</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 6 }}>
        {(["es", "en", "ca"] as const).map((l) => (
          <Field
            key={l}
            value={value?.[l] ?? ""}
            placeholder={l === "es" ? "ES" : l === "en" ? "EN (opcional)" : "CAT (opcional)"}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...emptyTri(), ...value, [l]: e.target.value })}
            style={{ ...input, ...(multiline ? { minHeight: 64, resize: "vertical" } : {}) }}
          />
        ))}
      </div>
    </div>
  );
}

function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** Botón "subir archivo" con barra de progreso. */
function UploadButton({ text, accept, onDone }: { text: string; accept: string; onDone: (r: Awaited<ReturnType<typeof adminUploadCaseFile>>) => void }) {
  const [pct, setPct] = useState<number | null>(null);
  return (
    <label style={{ ...smallBtn, position: "relative" }}>
      <UploadCloud size={14} />
      {pct === null ? text : `Subiendo… ${pct}%`}
      <input
        type="file"
        accept={accept}
        style={{ display: "none" }}
        disabled={pct !== null}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setPct(0);
          try {
            onDone(await adminUploadCaseFile(file, setPct));
          } catch {
            alert("No se pudo subir el archivo. Inténtalo de nuevo.");
          } finally {
            setPct(null);
          }
        }}
      />
    </label>
  );
}

// ── Editor de un caso ────────────────────────────────────────────────────────
function CaseEditor({ initial, onSaved, onCancel }: { initial: CaseStudy; onSaved: () => void; onCancel: () => void }) {
  const [c, setC] = useState<CaseStudy>(initial);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof CaseStudy>(k: K, v: CaseStudy[K]) => setC((prev) => ({ ...prev, [k]: v }));

  async function save() {
    if (!c.brandName.trim() || !c.title.es.trim()) {
      alert("Pon al menos la marca y el título en español.");
      return;
    }
    setSaving(true);
    try {
      await adminSaveCase(c);
      onSaved();
    } catch {
      alert("No se pudo guardar el caso. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
      {/* General */}
      <div style={box}>
        <strong style={{ color: OFFWHITE, fontSize: "0.85rem" }}>Información general</strong>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
          <div><span style={label}>Marca *</span><input style={input} value={c.brandName} onChange={(e) => set("brandName", e.target.value)} /></div>
          <div><span style={label}>Plataforma (ej. TikTok Ads)</span><input style={input} value={c.platform} onChange={(e) => set("platform", e.target.value)} /></div>
        </div>
        <div>
          <span style={label}>Logo de la marca</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {c.brandLogo && (
              <span style={{ background: "#fff", borderRadius: 6, padding: "4px 8px" }}>
                <img src={mediaUrl(c.brandLogo)} alt="" style={{ height: 22, width: "auto", display: "block" }} />
              </span>
            )}
            <UploadButton text={c.brandLogo ? "Sustituir logo" : "Subir logo"} accept="image/png,image/jpeg,image/webp" onDone={(r) => set("brandLogo", r.file)} />
            {c.brandLogo && <button type="button" style={smallBtn} onClick={() => set("brandLogo", "")}>Quitar</button>}
          </div>
        </div>
        <TriField title="Categoría (ej. TIKTOK ADS · LEAD GENERATION)" value={c.campaignType} onChange={(v) => set("campaignType", v)} />
        <TriField title="Sector" value={c.industry} onChange={(v) => set("industry", v)} />
        <TriField title="Título del caso *" value={c.title} onChange={(v) => set("title", v)} />
        <TriField title="Contexto" value={c.description} onChange={(v) => set("description", v)} multiline />
        <TriField title="Cita del cliente" value={c.quote} onChange={(v) => set("quote", v)} multiline />
        <div><span style={label}>Autor de la cita</span><input style={input} value={c.quoteAuthor} onChange={(e) => set("quoteAuthor", e.target.value)} /></div>
        <TriField title="Aprendizaje creativo (opcional)" value={c.insight} onChange={(v) => set("insight", v)} multiline />
        <TriField title="Aviso en letra pequeña (opcional)" value={c.disclaimer} onChange={(v) => set("disclaimer", v)} multiline />
      </div>

      {/* KPIs */}
      <div style={box}>
        <strong style={{ color: OFFWHITE, fontSize: "0.85rem" }}>KPIs <span style={{ color: STEEL, fontWeight: 400 }}>· marca hasta 4 como destacados (si no marcas ninguno, salen los 4 primeros)</span></strong>
        {c.kpis.map((k, i) => (
          <div key={i} style={{ ...box, background: "oklch(14% 0.02 240)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: "0 1 160px" }}><span style={label}>Cifra (ej. 390, 4,09 €, 10–20 %)</span>
                <input style={input} value={k.value} onChange={(e) => set("kpis", c.kpis.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, color: STEEL, fontSize: "0.8rem" }}>
                <input type="checkbox" checked={k.highlight} onChange={(e) => set("kpis", c.kpis.map((x, j) => (j === i ? { ...x, highlight: e.target.checked } : x)))} />
                Destacado
              </label>
              <span style={{ flex: 1 }} />
              <button type="button" style={smallBtn} onClick={() => set("kpis", move(c.kpis, i, -1))}><ArrowUp size={14} /></button>
              <button type="button" style={smallBtn} onClick={() => set("kpis", move(c.kpis, i, 1))}><ArrowDown size={14} /></button>
              <button type="button" style={smallBtn} onClick={() => set("kpis", c.kpis.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
            </div>
            <TriField title="Etiqueta (ej. Conversiones)" value={k.label} onChange={(v) => set("kpis", c.kpis.map((x, j) => (j === i ? { ...x, label: v } : x)))} />
            <TriField title="Contexto del KPI (opcional)" value={k.context} onChange={(v) => set("kpis", c.kpis.map((x, j) => (j === i ? { ...x, context: v } : x)))} />
          </div>
        ))}
        <div><button type="button" style={smallBtn} onClick={() => set("kpis", [...c.kpis, { value: "", label: emptyTri(), context: emptyTri(), highlight: c.kpis.filter((k) => k.highlight).length < 4 }])}><Plus size={14} /> Añadir KPI</button></div>
      </div>

      {/* Gráfica */}
      <div style={box}>
        <strong style={{ color: OFFWHITE, fontSize: "0.85rem" }}>Gráfica de barras <span style={{ color: STEEL, fontWeight: 400 }}>· opcional</span></strong>
        <TriField title="Título de la gráfica" value={c.chart.title} onChange={(v) => set("chart", { ...c.chart, title: v })} />
        {c.chart.bars.map((b, i) => (
          <div key={i} style={{ ...box, background: "oklch(14% 0.02 240)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: "0 1 120px" }}><span style={label}>Valor (número)</span>
                <input type="number" style={input} value={b.value} onChange={(e) => set("chart", { ...c.chart, bars: c.chart.bars.map((x, j) => (j === i ? { ...x, value: Number(e.target.value) } : x)) })} />
              </div>
              <div style={{ flex: "1 1 200px" }}><span style={label}>Texto que se ve (ej. 390 · 4,09 €)</span>
                <input style={input} value={b.display} onChange={(e) => set("chart", { ...c.chart, bars: c.chart.bars.map((x, j) => (j === i ? { ...x, display: e.target.value } : x)) })} />
              </div>
              <button type="button" style={smallBtn} onClick={() => set("chart", { ...c.chart, bars: move(c.chart.bars, i, -1) })}><ArrowUp size={14} /></button>
              <button type="button" style={smallBtn} onClick={() => set("chart", { ...c.chart, bars: move(c.chart.bars, i, 1) })}><ArrowDown size={14} /></button>
              <button type="button" style={smallBtn} onClick={() => set("chart", { ...c.chart, bars: c.chart.bars.filter((_, j) => j !== i) })}><Trash2 size={14} /></button>
            </div>
            <TriField title="Etiqueta de la barra" value={b.label} onChange={(v) => set("chart", { ...c.chart, bars: c.chart.bars.map((x, j) => (j === i ? { ...x, label: v } : x)) })} />
          </div>
        ))}
        <div><button type="button" style={smallBtn} onClick={() => set("chart", { ...c.chart, bars: [...c.chart.bars, { label: emptyTri(), value: 0, display: "" }] })}><Plus size={14} /> Añadir barra</button></div>
      </div>

      {/* Vídeos */}
      <div style={box}>
        <strong style={{ color: OFFWHITE, fontSize: "0.85rem" }}>Vídeos del caso <span style={{ color: STEEL, fontWeight: 400 }}>· con 2 o más, la web muestra un selector</span></strong>
        {c.videos.map((v, i) => (
          <div key={i} style={{ ...box, background: "oklch(14% 0.02 240)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: v.aspect === "16:9" ? 72 : 36, height: v.aspect === "16:9" ? 40 : 64, borderRadius: 6, overflow: "hidden", background: CARD, flexShrink: 0 }}>
                {v.poster && <img src={mediaUrl(v.poster)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ flex: "1 1 160px" }}><span style={label}>Nombre interno</span>
                <input style={input} value={v.name} onChange={(e) => set("videos", c.videos.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
              </div>
              <UploadButton text="Sustituir" accept="video/mp4,video/webm,video/quicktime"
                onDone={(r) => set("videos", c.videos.map((x, j) => (j === i ? { ...x, file: r.file, poster: r.poster ?? "", aspect: r.aspect ?? x.aspect } : x)))} />
              <button type="button" style={smallBtn} onClick={() => set("videos", move(c.videos, i, -1))}><ArrowUp size={14} /></button>
              <button type="button" style={smallBtn} onClick={() => set("videos", move(c.videos, i, 1))}><ArrowDown size={14} /></button>
              <button type="button" style={smallBtn} onClick={() => set("videos", c.videos.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
            </div>
            <TriField title="Etiqueta visible (ej. Mayo · Hook 1)" value={v.label} onChange={(val) => set("videos", c.videos.map((x, j) => (j === i ? { ...x, label: val } : x)))} />
          </div>
        ))}
        <div>
          <UploadButton text="+ Añadir vídeo" accept="video/mp4,video/webm,video/quicktime"
            onDone={(r) => set("videos", [...c.videos, { file: r.file, poster: r.poster ?? "", name: "", label: emptyTri(), aspect: r.aspect ?? "9:16" }])} />
        </div>
      </div>

      {/* Evidencias */}
      <div style={box}>
        <strong style={{ color: OFFWHITE, fontSize: "0.85rem" }}>Evidencias / Analytics <span style={{ color: STEEL, fontWeight: 400 }}>· sube las capturas ya anonimizadas (sin presupuestos, IDs ni datos personales)</span></strong>
        {c.evidence.map((ev, i) => (
          <div key={i} style={{ ...box, background: "oklch(14% 0.02 240)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <img src={mediaUrl(ev.image)} alt="" style={{ width: 96, height: 60, objectFit: "cover", borderRadius: 6, background: CARD }} />
              <label style={{ display: "flex", alignItems: "center", gap: 6, color: STEEL, fontSize: "0.8rem" }}>
                <input type="checkbox" checked={ev.visible} onChange={(e) => set("evidence", c.evidence.map((x, j) => (j === i ? { ...x, visible: e.target.checked } : x)))} />
                Mostrar
              </label>
              <span style={{ flex: 1 }} />
              <button type="button" style={smallBtn} onClick={() => set("evidence", move(c.evidence, i, -1))}><ArrowUp size={14} /></button>
              <button type="button" style={smallBtn} onClick={() => set("evidence", move(c.evidence, i, 1))}><ArrowDown size={14} /></button>
              <button type="button" style={smallBtn} onClick={() => set("evidence", c.evidence.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
            </div>
            <TriField title="Texto alternativo" value={ev.alt} onChange={(v) => set("evidence", c.evidence.map((x, j) => (j === i ? { ...x, alt: v } : x)))} />
            <TriField title="Descripción" value={ev.description} onChange={(v) => set("evidence", c.evidence.map((x, j) => (j === i ? { ...x, description: v } : x)))} />
          </div>
        ))}
        <div>
          <UploadButton text="+ Añadir captura" accept="image/png,image/jpeg,image/webp"
            onDone={(r) => set("evidence", [...c.evidence, { image: r.file, alt: emptyTri(), description: emptyTri(), visible: true }])} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, position: "sticky", bottom: 0, padding: "0.75rem 0", background: "oklch(13% 0.02 240)" }}>
        <button type="button" onClick={save} disabled={saving}
          style={{ ...smallBtn, background: BLUE, color: OFFWHITE, border: "none", padding: "0.6rem 1.2rem" }}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        <button type="button" onClick={onCancel} style={smallBtn}>Cerrar sin guardar</button>
      </div>
    </div>
  );
}

// ── Lista de casos ───────────────────────────────────────────────────────────
export default function CasesAdmin() {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setCases(await adminListCases()); } catch { /* sesión caducada: lo gestiona el panel */ }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    try { await fn(); await load(); } catch { alert("No se pudo guardar. Inténtalo de nuevo."); } finally { setBusy(false); }
  }

  return (
    <section style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1.25rem", marginBottom: "2rem", background: "oklch(13% 0.02 240)" }}>
      <h2 style={{ fontWeight: 600, fontSize: "1rem", color: OFFWHITE, marginBottom: "0.25rem" }}>Casos de éxito / KPIs</h2>
      <p style={{ color: STEEL, fontSize: "0.8125rem", marginBottom: "1rem" }}>
        Cada caso es una tarjeta del carrusel "Performance & Analytics". Solo se ven en la web los publicados, en este orden.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {cases.map((c, i) => (
          <div key={c.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "0.75rem", background: CARD }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: STEEL, width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
              <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                <div style={{ color: OFFWHITE, fontWeight: 600, fontSize: "0.875rem" }}>{c.brandName || "(sin marca)"}</div>
                <div style={{ color: STEEL, fontSize: "0.78rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title.es}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, color: c.published ? "#7CE0A3" : STEEL, border: `1px solid ${c.published ? "#7CE0A355" : BORDER}` }}>
                {c.published ? "Publicado" : "Oculto"}
              </span>
              <button type="button" disabled={busy} style={smallBtn} title={c.published ? "Ocultar" : "Publicar"}
                onClick={() => run(() => adminSaveCase({ ...c, published: !c.published }))}>
                {c.published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button type="button" disabled={busy || i === 0} style={smallBtn}
                onClick={() => run(() => adminReorderCases(move(cases, i, -1).map((x) => x.id)))}><ArrowUp size={14} /></button>
              <button type="button" disabled={busy || i === cases.length - 1} style={smallBtn}
                onClick={() => run(() => adminReorderCases(move(cases, i, 1).map((x) => x.id)))}><ArrowDown size={14} /></button>
              <button type="button" style={smallBtn} onClick={() => setEditing(editing === c.id ? null : c.id)}><Pencil size={14} /> Editar</button>
              <button type="button" disabled={busy} style={smallBtn}
                onClick={() => { if (confirm(`¿Eliminar el caso "${c.brandName}"? No se puede deshacer.`)) run(() => adminDeleteCase(c.id)); }}>
                <Trash2 size={14} />
              </button>
            </div>
            {editing === c.id && (
              <CaseEditor key={c.id} initial={c} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
            )}
          </div>
        ))}
      </div>

      <button type="button" disabled={busy} style={{ ...smallBtn, marginTop: "0.9rem" }}
        onClick={() => run(async () => { const created = await adminCreateCase({ brandName: "Nuevo caso" }); setEditing(created.id); })}>
        <Plus size={14} /> Nuevo caso
      </button>
    </section>
  );
}
