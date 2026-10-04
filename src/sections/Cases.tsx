import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import type { CaseStudy, Tri } from "../lib/api";
import { getPublicUrl } from "../lib/supabase";
import { withBase } from "../lib/paths";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { caseDetailFor, caseName } from "../data/caseDetails";
import { videoName } from "../seo/videos";
import type { Locale } from "../types";
import { useCases } from "../hooks/useCases";
import VideoPlayer from "../components/VideoPlayer";

// "Casos de éxito / KPIs": carrusel de casos (uno visible cada vez), gestionado
// desde el panel (/api/cases). Si no hay casos publicados, la sección no se muestra.
// Cada texto aparece una sola vez en el HTML: el orden de móvil y escritorio se
// consigue con CSS (grid-template-areas), no duplicando bloques.

export const tr = (v: Tri | undefined, lang: string) =>
  (v && ((v as Record<string, string>)[lang] || v.es)) || "";

const mediaUrl = (p: string) => (p.startsWith("/") ? withBase(p) : getPublicUrl(p));

export default function Cases() {
  const { t } = useTranslation();
  const cases = useCases();
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Caso visible según el desplazamiento (deslizar, trackpad o flechas)
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };
  const go = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(cases.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  if (cases.length === 0) return null;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="casos" className="section-gap">
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-8 lg:gap-10"
        >
          <div className="flex flex-col gap-3 lg:gap-4 max-w-3xl">
            <motion.span variants={fadeUp} className="eyebrow">{t("cases.eyebrow")}</motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em", lineHeight: 1.08 }}
            >
              {t("cases.title")}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-steel-blue text-lg">{t("cases.subtitle")}</motion.p>
          </div>

          {/* Carrusel: una tarjeta cada vez; se desliza con el dedo o el trackpad */}
          <motion.div variants={fadeUp} className="flex flex-col gap-5">
            <div
              ref={trackRef}
              onScroll={onScroll}
              className="flex overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
              role="region"
              aria-roledescription="carousel"
              aria-label={t("cases.title")}
            >
              {cases.map((c, i) => (
                <div
                  key={c.id}
                  className="w-full shrink-0 snap-center"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${t("cases.case")} ${pad(i + 1)} / ${pad(cases.length)}`}
                >
                  <CaseCard c={c} />
                </div>
              ))}
            </div>

            {cases.length > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button type="button" onClick={() => go(index - 1)} disabled={index === 0}
                  className="w-10 h-10 rounded-full border border-charcoal flex items-center justify-center text-steel-blue hover:text-off-white hover:border-steel-blue/60 disabled:opacity-30 transition-colors"
                  aria-label={t("carousel.prev")}>
                  <CaretLeft size={18} weight="bold" />
                </button>
                <span className="text-sm font-semibold text-off-white tabular-nums">
                  {t("cases.case")} {pad(index + 1)} <span className="text-steel-blue">/ {pad(cases.length)}</span>
                </span>
                <div className="flex gap-2" aria-hidden="true">
                  {cases.map((_, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-brand-blue" : "bg-steel-blue/40"}`} />
                  ))}
                </div>
                <button type="button" onClick={() => go(index + 1)} disabled={index === cases.length - 1}
                  className="w-10 h-10 rounded-full border border-charcoal flex items-center justify-center text-steel-blue hover:text-off-white hover:border-steel-blue/60 disabled:opacity-30 transition-colors"
                  aria-label={t("carousel.next")}>
                  <CaretRight size={18} weight="bold" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        #casos .snap-x::-webkit-scrollbar{display:none}
        .case-grid{display:grid;gap:1.5rem;grid-template-columns:minmax(0,1fr);grid-template-areas:"head" "media" "body"}
        @media (min-width:1024px){.case-grid{column-gap:2.5rem;row-gap:1.5rem;grid-template-columns:45fr 55fr;grid-template-rows:auto 1fr;grid-template-areas:"media head" "media body";align-items:start}}
      ` }} />
    </section>
  );
}

// ── Tarjeta de un caso (portada) ─────────────────────────────────────────────
function CaseCard({ c }: { c: CaseStudy }) {
  const { t, i18n } = useTranslation();
  const { lang } = usePage();
  const detail = caseDetailFor(c);

  return (
    <article className="rounded-[22px] border border-off-white/10 bg-charcoal/50 p-5 sm:p-7 lg:p-9">
      <div className="case-grid">
        <div style={{ gridArea: "head" }} className="flex flex-col gap-3">
          <CaseHeader c={c} />
          <h3 className="text-off-white font-bold" style={{ fontSize: "clamp(22px, 2.2vw, 30px)", lineHeight: 1.2 }}>
            {tr(c.title, i18n.language)}
          </h3>
        </div>
        <div style={{ gridArea: "media" }} className="flex flex-col gap-4">
          <CaseMedia c={c} only={detail?.cardVideos} />
          <CaseEvidence c={c} />
        </div>
        <div style={{ gridArea: "body" }} className="flex flex-col gap-6 min-w-0">
          <CaseResults c={c} card />
          {detail && (
            <a href={pageHref(detail.page, lang)} className="self-start text-brand-blue font-semibold hover:text-off-white transition-colors">
              {t("links.full_case")}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Logo (o nombre) de la marca y categoría del caso. */
export function CaseHeader({ c }: { c: CaseStudy }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {c.brandLogo ? (
          <span className="shrink-0 rounded-lg bg-white px-2.5 py-1.5">
            <img src={mediaUrl(c.brandLogo)} alt={caseName(c, lang)} width={110} height={20} className="h-5 w-auto max-w-[110px] object-contain" />
          </span>
        ) : (
          <span className="text-off-white font-bold text-lg">{caseName(c, lang)}</span>
        )}
      </div>
      {tr(c.campaignType, lang) && (
        <span className="rounded-full border border-off-white/15 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-steel-blue uppercase">
          {tr(c.campaignType, lang)}
        </span>
      )}
    </div>
  );
}

/** KPIs, contexto, cita, gráfica, aprendizaje y aviso de un caso (las capturas van con los vídeos: CaseEvidence). */
export function CaseResults({ c, showQuote = true, card = false }: { c: CaseStudy; showQuote?: boolean; card?: boolean }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  // En la tarjeta de la portada: texto breve y, si la hay, su gráfica propia
  const detail = card ? caseDetailFor(c) : undefined;
  const summary = detail?.cardSummary ? tr(detail.cardSummary, lang) : tr(c.description, lang);
  const chart = detail?.cardChart
    ? { title: detail.cardChart.title, bars: detail.cardChart.bars, note: detail.cardChart.note }
    : { title: c.chart?.title, bars: c.chart?.bars ?? [], note: undefined };

  const kpis = (c.kpis.some((k) => k.highlight) ? c.kpis.filter((k) => k.highlight) : c.kpis).slice(0, 4);
  // Con 1 o 2 cifras hay sitio: se muestran más grandes para que llenen la tarjeta
  const big = kpis.length <= 2;
  const bars = chart.bars;
  const maxBar = Math.max(1, ...bars.map((b) => b.value));

  return (
    <div className="flex flex-col gap-6">
      {kpis.length > 0 && (
        <div className={`grid grid-cols-2 ${kpis.length >= 3 ? "lg:grid-cols-3" : ""} gap-x-6 gap-y-5`}>
          {kpis.map((k, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-brand-blue font-bold tabular-nums leading-none" style={{ fontSize: big ? "clamp(40px, 4.4vw, 64px)" : "clamp(26px, 2.6vw, 38px)" }}>
                {k.value}
              </span>
              <span className="text-off-white font-semibold" style={{ fontSize: big ? "17px" : "15px", lineHeight: 1.35 }}>{tr(k.label, lang)}</span>
              {tr(k.context, lang) && <span className="text-steel-blue text-sm leading-snug">{tr(k.context, lang)}</span>}
            </div>
          ))}
        </div>
      )}

      {summary && (
        <p className="text-off-white/90" style={{ fontSize: "16px", lineHeight: 1.6 }}>{summary}</p>
      )}

      {showQuote && tr(c.quote, lang) && (
        <blockquote className="border-l-2 border-brand-blue pl-4">
          <p className="text-off-white italic" style={{ fontSize: "17px", lineHeight: 1.5 }}>“{tr(c.quote, lang)}”</p>
          {c.quoteAuthor && <footer className="text-steel-blue text-sm mt-1">— {c.quoteAuthor}</footer>}
        </blockquote>
      )}

      {bars.length > 0 && (
        <div className="rounded-xl border border-off-white/10 bg-navy/40 p-4 sm:p-5 flex flex-col gap-3">
          {tr(chart.title, lang) && (
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-steel-blue">{tr(chart.title, lang)}</span>
          )}
          {bars.map((b, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-off-white text-sm">{tr(b.label, lang)}</span>
                <span className="text-off-white font-bold text-sm tabular-nums shrink-0">{b.display || b.value}</span>
              </div>
              <div className="h-2.5 rounded-full bg-off-white/10 overflow-hidden" aria-hidden="true">
                <div
                  className={`h-full rounded-full ${i === 0 ? "bg-brand-blue" : "bg-steel-blue/60"}`}
                  style={{ width: `${Math.max(2, (b.value / maxBar) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {chart.note && <p className="text-steel-blue/80 text-xs leading-relaxed">{tr(chart.note, lang)}</p>}
        </div>
      )}

      {tr(c.insight, lang) && (
        <div className="rounded-xl bg-brand-blue/10 border border-brand-blue/25 p-4 sm:p-5">
          <span className="block text-[11px] font-bold tracking-[0.14em] uppercase text-brand-blue mb-1.5">{t("cases.insight")}</span>
          <p className="text-off-white" style={{ fontSize: "15px", lineHeight: 1.55 }}>{tr(c.insight, lang)}</p>
        </div>
      )}

      {tr(c.disclaimer, lang) && (
        <p className="text-steel-blue/80 text-xs leading-relaxed">{tr(c.disclaimer, lang)}</p>
      )}

    </div>
  );
}

// ── Capturas del caso ────────────────────────────────────────────────────────
/** Capturas de la plataforma, a lo ancho y ampliables (debajo de los vídeos). */
export function CaseEvidence({ c }: { c: CaseStudy }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState<number | null>(null);
  const evidence = c.evidence.filter((e) => e.visible && e.image);
  if (evidence.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-steel-blue">{t("cases.evidence")}</span>
      {evidence.map((e, i) => (
        <figure key={i} className="flex flex-col gap-1.5">
          <button type="button" onClick={() => setOpen(i)} aria-label={tr(e.alt, lang)}
            className="block w-full rounded-lg overflow-hidden border border-off-white/15 bg-white hover:border-brand-blue transition-colors cursor-zoom-in">
            <img src={mediaUrl(e.image)} alt={tr(e.alt, lang)} loading="lazy" className="w-full h-auto block" />
          </button>
          {tr(e.description, lang) && <figcaption className="text-steel-blue/80 text-xs">{tr(e.description, lang)}</figcaption>}
        </figure>
      ))}

      {open !== null && evidence[open] && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[70] bg-black/85 flex items-center justify-center p-4" role="dialog" aria-modal="true"
          onClick={() => setOpen(null)}>
          <button type="button" className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"
            aria-label={t("cases.close")} onClick={() => setOpen(null)}>
            <X size={22} weight="bold" />
          </button>
          <figure className="max-w-6xl w-full" onClick={(ev) => ev.stopPropagation()}>
            <img src={mediaUrl(evidence[open].image)} alt={tr(evidence[open].alt, lang)} className="w-full h-auto max-h-[80vh] object-contain rounded-lg bg-white" />
            {tr(evidence[open].description, lang) && (
              <figcaption className="text-white/80 text-sm mt-3 text-center">{tr(evidence[open].description, lang)}</figcaption>
            )}
          </figure>
        </div>,
        document.body,
      )}
    </div>
  );
}

// ── Vídeo(s) del caso ────────────────────────────────────────────────────────
// 0 vídeos: marco con la marca y la cifra principal. 1: reproductor. 2+: reproductor
// principal y selector debajo. Solo se monta el vídeo activo.
export function CaseMedia({ c, large = false, only }: { c: CaseStudy; large?: boolean; only?: string[] }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const all = c.videos.filter((v) => v.file);
  // En la tarjeta se puede elegir qué vídeos salen (y en qué orden)
  const videos = only ? only.map((f) => all.find((v) => v.file === f)).filter((v): v is (typeof all)[number] => !!v) : all;
  const [active, setActive] = useState(0);
  const current = videos[Math.min(active, videos.length - 1)];
  const maxH = large ? 640 : 560;
  const frameStyle = { maxHeight: maxH, aspectRatio: current?.aspect === "16:9" ? "16 / 9" : "9 / 16" } as React.CSSProperties;
  // Cifra principal (para el marco cuando aún no hay vídeo). Es decorativa: se
  // pinta con CSS (content: attr()) para no repetir el texto de los KPIs en el HTML.
  const lead = (c.kpis.find((k) => k.highlight) ?? c.kpis[0]) || null;

  // Varios vídeos: todos a la vista, sin pestañas. Horizontales y verticales van en grupos
  // separados (cada uno con su cuadrícula); primero el grupo del primer vídeo.
  //  - Verticales: en la tarjeta, 2 por fila; en la página del caso, en una fila (hasta 4).
  //  - Horizontales: en la tarjeta, uno debajo de otro y más pequeños (2 por fila si son muchos);
  //    en la página, hasta 3 por fila.
  if (videos.length > 1) {
    const GAP = 12;
    const horiz = videos.filter((v) => v.aspect === "16:9");
    const vert = videos.filter((v) => v.aspect !== "16:9");
    const mixed = horiz.length > 0 && vert.length > 0;
    type Group = { items: typeof videos; cls: string; maxWidth?: number; tileWidth?: number; widthPct?: number };
    const groups: Group[] = [];

    if (horiz.length) {
      if (large) groups.push({ items: horiz, cls: horiz.length >= 3 ? "grid grid-cols-1 md:grid-cols-3" : "grid grid-cols-1 md:grid-cols-2" });
      else if (horiz.length >= 4 || (mixed && horiz.length >= 2)) groups.push({ items: horiz, cls: "grid grid-cols-2" });
      else {
        const share = mixed ? maxH * 0.5 : maxH;
        const tileH = (share - GAP * (horiz.length - 1)) / horiz.length;
        groups.push({ items: horiz, cls: "grid grid-cols-1", maxWidth: Math.round(tileH * (16 / 9)) });
      }
    }
    if (vert.length) {
      if (large) {
        const cols = Math.min(vert.length, 4);
        const cls = cols >= 4 ? "grid grid-cols-2 md:grid-cols-4" : cols === 3 ? "grid grid-cols-2 md:grid-cols-3" : cols === 2 ? "grid grid-cols-2" : "grid grid-cols-1";
        groups.push({ items: vert, cls, maxWidth: cols * 300 + (cols - 1) * GAP });
      } else if (mixed && vert.length >= 2) {
        // 3 columnas del mismo ancho; con 2, mismo tamaño de casilla (2/3 del ancho)
        groups.push({ items: vert, cls: vert.length === 2 ? "grid grid-cols-2" : "grid grid-cols-3", maxWidth: undefined, widthPct: vert.length === 2 ? 66.67 : undefined });
      } else if (mixed) {
        groups.push({ items: vert, cls: "flex flex-wrap justify-center", tileWidth: 150 });
      } else {
        const rows = Math.ceil(vert.length / 2);
        const tileH = (maxH - GAP * (rows - 1)) / rows;
        groups.push({ items: vert, cls: "grid grid-cols-2", maxWidth: Math.round(tileH * (9 / 16)) * 2 + GAP });
      }
    }
    // Manda el primer vídeo de la lista: si es vertical, los verticales van primero
    if (horiz.length && vert.length && videos[0].aspect !== "16:9") groups.reverse();

    return (
      <div className="flex flex-col w-full" style={{ gap: GAP }}>
        {groups.map((g, gi) => (
          <div key={gi} className={`${g.cls} w-full mx-auto`} style={{ gap: GAP, maxWidth: g.maxWidth ?? (g.widthPct ? `${g.widthPct}%` : undefined) }}>
            {g.items.map((v) => (
              <div key={v.file} style={{ aspectRatio: v.aspect === "16:9" ? "16 / 9" : "9 / 16", ...(g.tileWidth ? { width: g.tileWidth } : {}) }}>
                <VideoPlayer
                  indexable={large}
                  ariaName={videoName(caseName(c, lang), tr(v.label, lang) || v.name || null, lang as Locale)}
                  src={getPublicUrl(v.file)}
                  poster={v.poster ? getPublicUrl(v.poster) : null}
                  aspectRatio={v.aspect}
                  title={tr(v.label, lang) || null}
                  client={null}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {current ? (
        <div className="w-full flex justify-center">
          <div style={{ ...frameStyle, width: current.aspect === "16:9" ? "100%" : `min(100%, ${Math.round((maxH * 9) / 16)}px)` }}>
            <VideoPlayer
              key={current.file}
              indexable={large}
              ariaName={videoName(caseName(c, lang), tr(current.label, lang) || current.name || null, lang as Locale)}
              src={getPublicUrl(current.file)}
              poster={current.poster ? getPublicUrl(current.poster) : null}
              aspectRatio={current.aspect}
              title={tr(current.label, lang) || null}
              client={null}
            />
          </div>
        </div>
      ) : (
        <div
          className="w-full lg:max-w-[315px] rounded-xl border border-off-white/10 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:gap-6 p-5 lg:p-6 text-left lg:text-center lg:aspect-[9/16] lg:max-h-[560px]"
          style={{
            background: "radial-gradient(120% 90% at 50% 20%, oklch(58% 0.14 240 / 0.28) 0%, oklch(20% 0.03 240 / 0.9) 70%)",
          }}
          aria-hidden="true"
        >
          {c.brandLogo ? (
            <span className="shrink-0 rounded-xl bg-white px-3 py-2 lg:px-4 lg:py-3">
              <img src={mediaUrl(c.brandLogo)} alt="" width={160} height={32} className="h-6 lg:h-8 w-auto max-w-[120px] lg:max-w-[160px] object-contain" />
            </span>
          ) : (
            <span className="case-attr text-off-white font-bold text-xl lg:text-2xl" data-text={caseName(c, lang)} />
          )}
          {lead && (
            <span className="flex flex-col items-end lg:items-center min-w-0">
              <span
                className="case-attr text-brand-blue font-bold tabular-nums leading-none"
                data-text={lead.value}
                style={{ fontSize: "clamp(34px, 5vw, 64px)" }}
              />
              <span className="case-attr text-off-white/90 text-sm font-semibold mt-1" data-text={tr(lead.label, lang)} />
            </span>
          )}
          {c.platform && (
            <span
              className="case-attr hidden lg:inline-block rounded-full border border-off-white/20 px-3 py-1 text-xs font-bold tracking-[0.14em] uppercase text-off-white/80"
              data-text={c.platform}
            />
          )}
          <style dangerouslySetInnerHTML={{ __html: `.case-attr::before{content:attr(data-text)}` }} />
        </div>
      )}

      {videos.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2" role="tablist">
          {videos.map((v, i) => (
            <button
              key={v.file}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                i === active ? "bg-brand-blue text-off-white" : "border border-steel-blue/40 text-steel-blue hover:text-off-white"
              }`}
            >
              {tr(v.label, lang) || v.name || `${i + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
