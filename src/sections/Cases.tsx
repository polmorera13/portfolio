import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { fetchCases, type CaseStudy, type Tri } from "../lib/api";
import { getPublicUrl } from "../lib/supabase";
import VideoPlayer from "../components/VideoPlayer";
import { withBase } from "../lib/paths";

// "Casos de éxito / KPIs": carrusel de casos (uno visible cada vez), gestionado
// desde el panel (/api/cases). Si no hay casos publicados, la sección no se muestra.

const tr = (v: Tri | undefined, lang: string) =>
  (v && ((v as Record<string, string>)[lang] || v.es)) || "";

const mediaUrl = (p: string) => (p.startsWith("/") ? withBase(p) : getPublicUrl(p));

export default function Cases() {
  const { t } = useTranslation();
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCases().then((c) => { if (!cancelled) setCases(c); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

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
      <style>{`#casos .snap-x::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
}

// ── Tarjeta de un caso ──────────────────────────────────────────────────────
function CaseCard({ c }: { c: CaseStudy }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [lightbox, setLightbox] = useState<number | null>(null);

  const kpis = (c.kpis.some((k) => k.highlight) ? c.kpis.filter((k) => k.highlight) : c.kpis).slice(0, 4);
  const bars = c.chart?.bars ?? [];
  const maxBar = Math.max(1, ...bars.map((b) => b.value));
  const evidence = c.evidence.filter((e) => e.visible && e.image);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {c.brandLogo && (
          <span className="shrink-0 rounded-lg bg-white px-2.5 py-1.5">
            <img src={mediaUrl(c.brandLogo)} alt={c.brandName} className="h-5 w-auto max-w-[110px] object-contain" />
          </span>
        )}
        {!c.brandLogo && <span className="text-off-white font-bold text-lg">{c.brandName}</span>}
      </div>
      {tr(c.campaignType, lang) && (
        <span className="rounded-full border border-off-white/15 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-steel-blue uppercase">
          {tr(c.campaignType, lang)}
        </span>
      )}
    </div>
  );
  const title = (
    <h3 className="text-off-white font-bold" style={{ fontSize: "clamp(22px, 2.2vw, 30px)", lineHeight: 1.2 }}>
      {tr(c.title, lang)}
    </h3>
  );

  return (
    <article className="rounded-[22px] border border-off-white/10 bg-charcoal/50 p-5 sm:p-7 lg:p-9">
      {/* Móvil: marca y título encima del vídeo */}
      <div className="lg:hidden flex flex-col gap-3 mb-5">
        {header}
        {title}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-6 lg:gap-10 items-start">
        <CaseMedia c={c} />

        <div className="flex flex-col gap-6 min-w-0">
          <div className="hidden lg:flex flex-col gap-3">
            {header}
            {title}
          </div>

          {/* KPIs */}
          {kpis.length > 0 && (
            <div className={`grid grid-cols-2 ${kpis.length >= 3 ? "lg:grid-cols-3" : ""} gap-x-6 gap-y-5`}>
              {kpis.map((k, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-brand-blue font-bold tabular-nums leading-none" style={{ fontSize: "clamp(26px, 2.6vw, 38px)" }}>
                    {k.value}
                  </span>
                  <span className="text-off-white font-semibold" style={{ fontSize: "15px", lineHeight: 1.35 }}>{tr(k.label, lang)}</span>
                  {tr(k.context, lang) && <span className="text-steel-blue text-sm leading-snug">{tr(k.context, lang)}</span>}
                </div>
              ))}
            </div>
          )}

          {tr(c.description, lang) && (
            <p className="text-off-white/90" style={{ fontSize: "16px", lineHeight: 1.6 }}>{tr(c.description, lang)}</p>
          )}

          {tr(c.quote, lang) && (
            <blockquote className="border-l-2 border-brand-blue pl-4">
              <p className="text-off-white italic" style={{ fontSize: "17px", lineHeight: 1.5 }}>“{tr(c.quote, lang)}”</p>
              {c.quoteAuthor && <footer className="text-steel-blue text-sm mt-1">— {c.quoteAuthor}</footer>}
            </blockquote>
          )}

          {/* Gráfica de barras */}
          {bars.length > 0 && (
            <div className="rounded-xl border border-off-white/10 bg-navy/40 p-4 sm:p-5 flex flex-col gap-3">
              {tr(c.chart.title, lang) && (
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-steel-blue">{tr(c.chart.title, lang)}</span>
              )}
              {bars.map((b, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-off-white text-sm">{tr(b.label, lang)}</span>
                    <span className="text-off-white font-bold text-sm tabular-nums shrink-0">{b.display || b.value}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-off-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 0 ? "bg-brand-blue" : "bg-steel-blue/60"}`}
                      style={{ width: `${Math.max(2, (b.value / maxBar) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tr(c.insight, lang) && (
            <div className="rounded-xl bg-brand-blue/10 border border-brand-blue/25 p-4 sm:p-5">
              <span className="block text-[11px] font-bold tracking-[0.14em] uppercase text-brand-blue mb-1.5">{t("cases.insight")}</span>
              <p className="text-off-white" style={{ fontSize: "15px", lineHeight: 1.55 }}>{tr(c.insight, lang)}</p>
            </div>
          )}

          {/* Evidencias: miniaturas que se abren en grande */}
          {evidence.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-steel-blue">{t("cases.evidence")}</span>
              <div className="flex gap-3 flex-wrap">
                {evidence.map((e, i) => (
                  <button key={i} type="button" onClick={() => setLightbox(i)}
                    className="w-28 h-20 rounded-lg overflow-hidden border border-off-white/15 hover:border-brand-blue transition-colors">
                    <img src={mediaUrl(e.image)} alt={tr(e.alt, lang)} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {tr(c.disclaimer, lang) && (
            <p className="text-steel-blue/80 text-xs leading-relaxed">{tr(c.disclaimer, lang)}</p>
          )}
        </div>
      </div>

      {lightbox !== null && evidence[lightbox] && (
        <div className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4" role="dialog" aria-modal="true"
          onClick={() => setLightbox(null)}>
          <button type="button" className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"
            aria-label={t("cases.close")} onClick={() => setLightbox(null)}>
            <X size={22} weight="bold" />
          </button>
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={mediaUrl(evidence[lightbox].image)} alt={tr(evidence[lightbox].alt, lang)} className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            {tr(evidence[lightbox].description, lang) && (
              <figcaption className="text-white/80 text-sm mt-3 text-center">{tr(evidence[lightbox].description, lang)}</figcaption>
            )}
          </figure>
        </div>
      )}
    </article>
  );
}

// ── Vídeo(s) del caso ────────────────────────────────────────────────────────
// 0 vídeos: marco con la marca y la plataforma. 1: reproductor. 2+: reproductor
// principal y selector debajo. Solo se monta el vídeo activo.
function CaseMedia({ c }: { c: CaseStudy }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const videos = c.videos.filter((v) => v.file);
  const [active, setActive] = useState(0);
  const current = videos[Math.min(active, videos.length - 1)];
  const frameStyle = { maxHeight: 560, aspectRatio: current?.aspect === "16:9" ? "16 / 9" : "9 / 16" } as React.CSSProperties;
  // Cifra principal (para el marco cuando aún no hay vídeo)
  const lead = (c.kpis.find((k) => k.highlight) ?? c.kpis[0]) || null;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {current ? (
        <div className="w-full flex justify-center">
          <div style={{ ...frameStyle, width: current.aspect === "16:9" ? "100%" : "min(100%, 315px)" }}>
            <VideoPlayer
              key={current.file}
              src={getPublicUrl(current.file)}
              poster={current.poster ? getPublicUrl(current.poster) : null}
              aspectRatio={current.aspect}
              title={tr(current.label, lang) || null}
              client={null}
            />
          </div>
        </div>
      ) : (
        // Sin vídeo todavía: tarjeta visual con la marca, la cifra principal y la plataforma.
        // En móvil es una franja compacta; en escritorio ocupa el marco vertical.
        <div
          className="w-full lg:max-w-[315px] rounded-xl border border-off-white/10 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:gap-6 p-5 lg:p-6 text-left lg:text-center lg:aspect-[9/16] lg:max-h-[560px]"
          style={{
            background: "radial-gradient(120% 90% at 50% 20%, oklch(58% 0.14 240 / 0.28) 0%, oklch(20% 0.03 240 / 0.9) 70%)",
          }}
        >
          {c.brandLogo ? (
            <span className="shrink-0 rounded-xl bg-white px-3 py-2 lg:px-4 lg:py-3">
              <img src={mediaUrl(c.brandLogo)} alt={c.brandName} className="h-6 lg:h-8 w-auto max-w-[120px] lg:max-w-[160px] object-contain" />
            </span>
          ) : (
            <span className="text-off-white font-bold text-xl lg:text-2xl">{c.brandName}</span>
          )}
          {lead && (
            <span className="flex flex-col items-end lg:items-center min-w-0">
              <span className="text-brand-blue font-bold tabular-nums leading-none" style={{ fontSize: "clamp(34px, 5vw, 64px)" }}>
                {lead.value}
              </span>
              <span className="text-off-white/90 text-sm font-semibold mt-1">{tr(lead.label, lang)}</span>
            </span>
          )}
          {c.platform && (
            <span className="hidden lg:inline-block rounded-full border border-off-white/20 px-3 py-1 text-xs font-bold tracking-[0.14em] uppercase text-off-white/80">
              {c.platform}
            </span>
          )}
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
