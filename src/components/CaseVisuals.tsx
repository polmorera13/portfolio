import { ArrowRight, Building2, MapPin, Megaphone, Mic, MonitorPlay, Repeat2, Zap, type LucideIcon } from "lucide-react";
import type { Locale } from "../types";

// Visuales de las tarjetas de casos de la portada (lado claro de la tarjeta):
// la gráfica con ejes de Dogfy Diet y los esquemas de Reactiva Online y Apple Tree.

type Tri = Record<Locale, string>;
const tx = (v: Tri, l: Locale) => v[l] ?? v.es;

const NAVY = "#0D1B2A";
const MUTED = "#4A6580";
const GRID = "#DCE3EC";
const BLUE = "#2D6FB8";
const STEEL = "#8AAFCC";

// ── Gráfica de columnas con ejes (tasa de conversión) ─────────────────────────
export interface AxisBar { label: string; value: number; display: string }

export function AxisChart({ title, bars, note, lang }: { title?: string; bars: AxisBar[]; note?: string; lang: Locale }) {
  const max = Math.ceil(Math.max(...bars.map((b) => b.value)) / 5) * 5 + 5; // 15 → 20
  const ticks = Array.from({ length: max / 5 + 1 }, (_, i) => i * 5);
  const ratio = bars.length === 2 && bars[1].value > 0 ? bars[0].value / bars[1].value : 0;
  const ratioText: Tri = { es: "Casi el doble que la media", en: "Almost twice the average", ca: "Gairebé el doble que la mitjana" };
  const H = 112;
  return (
    <figure className="rounded-xl border border-off-white/10 bg-navy/40 p-4 flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        {title && <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-steel-blue">{title}</span>}
        {ratio >= 1.8 && ratio < 2 && (
          <span className="text-xs font-bold rounded-full px-2.5 py-1" style={{ background: "#EAF2FB", color: "#2A6AAF" }}>{tx(ratioText, lang)}</span>
        )}
      </div>
      <div className="flex gap-2" role="img" aria-label={bars.map((b) => `${b.label}: ${b.display}`).join(" · ")}>
        {/* Eje Y */}
        <div className="relative w-9 shrink-0" style={{ height: H }} aria-hidden="true">
          {ticks.map((v) => (
            <span key={v} className="absolute right-1 text-[11px] tabular-nums" style={{ bottom: `${(v / max) * 100}%`, transform: "translateY(50%)", color: MUTED }}>
              {v} %
            </span>
          ))}
        </div>
        {/* Zona de la gráfica */}
        <div className="relative flex-1" style={{ height: H }} aria-hidden="true">
          {ticks.map((v) => (
            <div key={v} className="absolute inset-x-0" style={{ bottom: `${(v / max) * 100}%`, borderTop: `1px ${v === 0 ? "solid" : "dashed"} ${v === 0 ? MUTED : GRID}` }} />
          ))}
          <div className="absolute inset-y-0 left-0" style={{ borderLeft: `1px solid ${MUTED}` }} />
          <div className="absolute inset-0 flex items-end justify-around px-[8%]">
            {bars.map((b, i) => (
              <div key={i} className="relative flex flex-col items-center justify-end h-full" style={{ width: "30%" }}>
                <span className="font-bold tabular-nums mb-1" style={{ color: i === 0 ? BLUE : MUTED, fontSize: i === 0 ? 18 : 14 }}>{b.display}</span>
                <div className="w-full rounded-t-md" style={{ height: `${(b.value / max) * 100}%`, background: i === 0 ? BLUE : STEEL }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Eje X: nombres */}
      <div className="flex gap-2" aria-hidden="true">
        <div className="w-9 shrink-0" />
        <div className="flex-1 flex justify-around px-[8%]">
          {bars.map((b, i) => (
            <span key={i} className="text-center text-[11px] font-semibold leading-tight" style={{ width: "34%", color: NAVY }}>{b.label}</span>
          ))}
        </div>
      </div>
      {note && <figcaption className="text-steel-blue/80 text-xs leading-relaxed">{note}</figcaption>}
    </figure>
  );
}

// ── Esquemas de las tarjetas ─────────────────────────────────────────────────
interface Step { icon: LucideIcon; label: Tri; sub?: Tri }

const REACTIVA: { title: Tri; steps: Step[] } = {
  title: { es: "Contenido para cada etapa del embudo", en: "Content for every stage of the funnel", ca: "Contingut per a cada etapa de l'embut" },
  steps: [
    { icon: Megaphone, label: { es: "Anuncios en frío", en: "Cold ads", ca: "Anuncis en fred" }, sub: { es: "Atraer", en: "Attract", ca: "Atreure" } },
    { icon: MonitorPlay, label: { es: "Landing + VSL", en: "Landing page + VSL", ca: "Landing + VSL" }, sub: { es: "Convencer", en: "Convince", ca: "Convèncer" } },
    { icon: Repeat2, label: { es: "Remarketing", en: "Retargeting", ca: "Remarketing" }, sub: { es: "Cerrar", en: "Close", ca: "Tancar" } },
  ],
};

const AGENCY: { title: Tri; steps: Step[]; from: Tri; to: Tri } = {
  title: { es: "Vídeos de todo tipo para sus marcas", en: "Every kind of video for their brands", ca: "Vídeos de tota mena per a les seves marques" },
  steps: [
    { icon: Building2, label: { es: "Corporativos", en: "Corporate", ca: "Corporatius" } },
    { icon: Zap, label: { es: "Dinámicos", en: "Dynamic", ca: "Dinàmics" } },
    { icon: Mic, label: { es: "A cámara", en: "To camera", ca: "A càmera" } },
    { icon: MapPin, label: { es: "En la calle", en: "Street interviews", ca: "Al carrer" } },
  ],
  from: { es: "Mes 1", en: "Month 1", ca: "Mes 1" },
  to: { es: "Mes 31 · y seguimos", en: "Month 31 · still going", ca: "Mes 31 · i continuem" },
};

function StepTile({ s, l }: { s: Step; l: Locale }) {
  const Icon = s.icon;
  return (
    <div className="flex flex-col items-center text-center gap-2 min-w-0 flex-1">
      <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: BLUE, boxShadow: "0 8px 20px rgba(45,111,184,.25)" }}>
        <Icon size={22} color="#fff" strokeWidth={2} aria-hidden />
      </span>
      <span className="font-bold leading-tight text-[13px] sm:text-sm" style={{ color: NAVY }}>{tx(s.label, l)}</span>
      {s.sub && <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "#2A6AAF" }}>{tx(s.sub, l)}</span>}
    </div>
  );
}

/** Esquema del caso (si tiene): embudo de Reactiva Online o tipos de vídeo de Apple Tree. */
export function CaseVisual({ slug, lang }: { slug: string; lang: Locale }) {
  if (slug === "reactiva") {
    return (
      <figure className="rounded-xl border border-off-white/10 bg-white p-4 flex flex-col gap-3" aria-label={tx(REACTIVA.title, lang)}>
        <figcaption className="text-[11px] font-bold tracking-[0.14em] uppercase text-steel-blue">{tx(REACTIVA.title, lang)}</figcaption>
        <div className="flex items-start gap-1 sm:gap-2">
          {REACTIVA.steps.map((s, i) => (
            <div key={i} className="contents">
              {i > 0 && <ArrowRight size={22} strokeWidth={2.5} className="shrink-0 mt-3 sm:mt-3.5" color={BLUE} aria-hidden />}
              <StepTile s={s} l={lang} />
            </div>
          ))}
        </div>
        {/* Embudo: ancho al principio (mucha gente) y estrecho al final (clientes) */}
        <svg viewBox="0 0 300 28" preserveAspectRatio="none" className="w-full h-5" aria-hidden="true">
          <polygon points="0,0 100,3 100,25 0,28" fill={BLUE} />
          <polygon points="102,3 200,8 200,20 102,25" fill="#4A90D9" />
          <polygon points="202,8 300,11 300,17 202,20" fill={STEEL} />
        </svg>
      </figure>
    );
  }
  if (slug === "agencia") {
    return (
      <figure className="rounded-xl border border-off-white/10 bg-white p-4 flex flex-col gap-3" aria-label={tx(AGENCY.title, lang)}>
        <figcaption className="text-[11px] font-bold tracking-[0.14em] uppercase text-steel-blue">{tx(AGENCY.title, lang)}</figcaption>
        <div className="flex items-start gap-2">
          {AGENCY.steps.map((s, i) => <StepTile key={i} s={s} l={lang} />)}
        </div>
        {/* Línea de tiempo de la relación */}
        <div className="flex flex-col gap-1.5" aria-hidden="true">
          <div className="relative h-2.5 rounded-full" style={{ background: `linear-gradient(90deg, ${STEEL}, ${BLUE})` }}>
            <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] border-white" style={{ background: BLUE, boxShadow: `0 0 0 3px rgba(45,111,184,.25)` }} />
          </div>
          <div className="flex justify-between text-[11px] font-bold" style={{ color: MUTED }}>
            <span>{tx(AGENCY.from, lang)}</span>
            <span style={{ color: "#2A6AAF" }}>{tx(AGENCY.to, lang)}</span>
          </div>
        </div>
      </figure>
    );
  }
  return null;
}
