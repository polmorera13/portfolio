import { useTranslation } from "../lib/i18n";
import { Check, Play } from "lucide-react";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { getInitialData } from "../lib/initialData";
import { getPublicUrl } from "../lib/supabase";
import { withBase } from "../lib/paths";
import { whatsappUrl, WhatsAppIcon } from "../lib/whatsapp";
import { services } from "../data/services";
import { faqItems } from "../data/faq";
import { LANDING_VSL, LANDING_EXAMPLES, LANDING_FAQ, LANDING_TESTIMONIALS, LANDING_FORM_ID } from "../data/landing";
import { catalogPoster } from "../seo/videos";
import VideoPlayer from "../components/VideoPlayer";
import FaqList from "../components/FaqList";
import LandingForm from "../components/LandingForm";
import LogoMarquee from "../sections/LogoMarquee";
import type { Locale } from "../types";

// Colores de los tres tipos de vídeo (los de la web)
const CONCEPT_COLORS = [
  { bg: "#2D6FB8", fg: "#FFFFFF" },
  { bg: "#8AAFCC", fg: "#0D1B2A" },
  { bg: "#F4F6F9", fg: "#0D1B2A" },
];

const FORM = `#${LANDING_FORM_ID}`;

/**
 * Landing de los anuncios: título, VSL y todo orientado al formulario de la
 * propuesta gratis. Un solo enlace fuera: "Ver todos mis trabajos" (portada).
 */
export default function LandingPage() {
  const { t } = useTranslation();
  const { lang } = usePage();
  const l = lang as Locale;
  const data = getInitialData();
  const proof = t("landing.proof", { returnObjects: true }) as string[];
  const results = t("landing.results", { returnObjects: true }) as { v: string; l: string }[];
  const steps = t("landing.steps", { returnObjects: true }) as { t: string; d: string }[];
  const quotes = t("testimonials.items", { returnObjects: true }) as { quote: string; author: string; role: string }[];
  const faqs = LANDING_FAQ.map((q) => faqItems.find((f) => f.question.es === q)).filter(Boolean) as typeof faqItems;
  const works = pageHref("home", l, "portfolio");

  return (
    <>
      {/* ── Título, VSL y botón ── */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 top-24 w-[900px] max-w-[120vw] h-[520px] rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="relative max-w-4xl mx-auto section-padding pt-28 lg:pt-32 pb-12 lg:pb-16 flex flex-col items-center text-center gap-5">
          <span className="text-steel-blue uppercase font-semibold" style={{ fontSize: "12px", letterSpacing: "0.22em" }}>{t("landing.eyebrow")}</span>
          <h1 className="text-off-white font-bold" style={{ fontSize: "clamp(32px, 5.4vw, 62px)", lineHeight: 1.05, letterSpacing: "-0.015em" }}>
            {t("landing.h1")}
          </h1>
          <p className="text-steel-blue max-w-2xl" style={{ fontSize: "clamp(17px, 1.7vw, 20px)", lineHeight: 1.55 }}>{t("landing.sub")}</p>

          {/* VSL */}
          <div className={`w-full mt-3 ${LANDING_VSL.aspect === "9:16" ? "max-w-[380px]" : "max-w-[880px]"}`}>
            {LANDING_VSL.file ? (
              <VideoPlayer
                src={getPublicUrl(LANDING_VSL.file)}
                poster={LANDING_VSL.poster ? getPublicUrl(LANDING_VSL.poster) : null}
                aspectRatio={LANDING_VSL.aspect}
                hideLabels
                priority
                ariaName={t("landing.vsl_aria")}
              />
            ) : (
              // Hueco del VSL (hasta que esté el vídeo)
              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-dashed border-brand-blue/60" style={{ aspectRatio: "16 / 9" }}>
                <img src={withBase("/pol-morera-camara.webp")} alt="" width={1000} height={1251} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "50% 30%" }} />
                <div className="absolute inset-0 bg-navy/75" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                  <span className="w-16 h-16 rounded-full bg-brand-blue-deep flex items-center justify-center shadow-xl">
                    <Play size={26} className="text-off-white ml-1" fill="currentColor" aria-hidden />
                  </span>
                  <span className="text-off-white font-semibold text-sm sm:text-base">{t("landing.vsl_placeholder")}</span>
                </div>
              </div>
            )}
          </div>

          <div id="landing-ctas" className="flex flex-col items-center gap-3 mt-3 w-full">
            <a href={FORM} className="w-full sm:w-auto bg-brand-blue-deep text-off-white font-semibold text-lg px-10 py-4 rounded-lg hover:bg-brand-blue-deep/90 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-black/30">
              {t("landing.cta")}
            </a>
            <p className="text-steel-blue text-sm">{t("landing.cta_note")}</p>
            <a href={works} className="text-brand-blue font-semibold hover:text-off-white transition-colors">{t("landing.works")}</a>
          </div>

          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-off-white/90 font-semibold text-sm">
            {proof.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LogoMarquee />

      {/* ── Los 3 tipos de vídeo ── */}
      <section className="max-w-content mx-auto section-padding py-16 lg:py-24 flex flex-col gap-10">
        <div className="flex flex-col gap-3 max-w-3xl">
          <span className="eyebrow">{t("landing.concepts_eyebrow")}</span>
          <h2 className="text-off-white font-bold" style={{ fontSize: "clamp(28px, 3.6vw, 46px)", lineHeight: 1.1 }}>{t("landing.concepts_title")}</h2>
        </div>
        <ol className="flex flex-col gap-6">
          {services.map((s, i) => {
            const c = CONCEPT_COLORS[i];
            const file = LANDING_EXAMPLES[s.configKey];
            const horizontal = s.configKey === "corporate";
            const brand = data?.videos?.find((v) => v.storage_path === file)?.title ?? null;
            return (
              <li key={s.id} className="rounded-3xl bg-charcoal/50 border border-off-white/10 overflow-hidden">
                <div className="h-1.5" style={{ background: c.bg }} />
                <div className={`grid grid-cols-1 ${horizontal ? "lg:grid-cols-[1fr_1.15fr]" : "md:grid-cols-[1.4fr_1fr]"} gap-8 p-6 sm:p-8 lg:p-10 items-center`}>
                  <div className={`flex flex-col gap-4 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: c.bg, color: c.fg }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-steel-blue font-semibold uppercase text-xs tracking-[0.18em]">{s.tab[l]}</span>
                    </div>
                    <h3 className="text-off-white font-bold" style={{ fontSize: "clamp(24px, 2.6vw, 34px)", lineHeight: 1.15 }}>{s.title[l]}</h3>
                    <p className="text-off-white/90 text-lg">{s.ideal[l]}</p>
                    <ul className="flex flex-col gap-2.5">
                      {s.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-3 text-off-white/90">
                          <Check size={18} className="text-brand-blue mt-0.5 shrink-0" strokeWidth={3} aria-hidden />
                          {b[l]}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-4 mt-1">
                      <span className="rounded-full border border-brand-blue/50 px-3.5 py-1.5 text-sm font-semibold text-off-white">{s.tag[l]}</span>
                      <a href={FORM} className="text-brand-blue font-semibold hover:text-off-white transition-colors">{t("landing.concept_want")}</a>
                    </div>
                  </div>
                  {file && (
                    <div className={`${horizontal ? "w-full" : "w-[62%] max-w-[260px] mx-auto"} ${i % 2 === 1 ? "md:order-1" : ""}`}>
                      <div className="rounded-2xl p-1.5 shadow-2xl shadow-black/40" style={{ background: c.bg }}>
                        <VideoPlayer
                          src={getPublicUrl(file)}
                          poster={getPublicUrl(catalogPoster(file))}
                          aspectRatio={horizontal ? "16:9" : "9:16"}
                          title={brand}
                          client={null}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── Resultados ── */}
      <section className="bg-brand-blue-deep">
        <div className="max-w-content mx-auto section-padding py-12 lg:py-16 flex flex-col gap-8">
          <h2 className="text-white font-bold text-2xl lg:text-3xl">{t("landing.results_title")}</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {results.map((r, i) => (
              <div key={i} className="flex flex-col-reverse gap-1">
                <dt className="text-white/90 font-semibold" style={{ fontSize: "16px", lineHeight: 1.35 }}>{r.l}</dt>
                <dd className="text-white font-bold tabular-nums leading-none" style={{ fontSize: "clamp(40px, 5vw, 60px)" }}>{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="max-w-content mx-auto section-padding py-16 lg:py-20 flex flex-col gap-8">
        <h2 className="text-off-white font-bold" style={{ fontSize: "clamp(26px, 3vw, 40px)" }}>{t("landing.steps_title")}</h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <li key={i} className={`rounded-2xl bg-charcoal p-6 flex flex-col gap-2 ${i === 1 ? "border-2 border-brand-blue" : "border border-brand-blue/15"}`}>
              <span className="text-brand-blue font-bold text-sm tracking-[0.15em]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-off-white font-bold text-xl leading-snug">{s.t}</h3>
              <p className="text-off-white/85" style={{ fontSize: "15.5px", lineHeight: 1.6 }}>{s.d}</p>
            </li>
          ))}
        </ol>
        <a href={FORM} className="self-start bg-brand-blue-deep text-off-white font-semibold text-lg px-8 py-4 rounded-lg hover:bg-brand-blue-deep/90 transition-colors">{t("landing.cta")}</a>
      </section>

      {/* ── Testimonios ── */}
      <section className="max-w-content mx-auto section-padding pb-16 lg:pb-20 flex flex-col gap-8">
        <h2 className="text-off-white font-bold" style={{ fontSize: "clamp(26px, 3vw, 40px)" }}>{t("landing.testimonials_title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LANDING_TESTIMONIALS.map((n) => quotes[n]).filter(Boolean).map((q, i) => (
            <figure key={i} className="rounded-2xl bg-off-white p-6 flex flex-col gap-4 justify-between">
              <blockquote className="text-navy" style={{ fontSize: "16px", lineHeight: 1.6 }}>“{q.quote}”</blockquote>
              <figcaption className="text-navy font-bold text-sm">
                {q.author} <span className="text-[#3A4F63] font-semibold">· {q.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Formulario ── */}
      <section id={LANDING_FORM_ID} className="scroll-mt-6 relative overflow-hidden isolate py-16 lg:py-24">
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: "radial-gradient(100% 80% at 20% 0%, rgba(45,111,184,0.35) 0%, rgba(13,27,42,0) 70%)" }} />
        <div className="max-w-content mx-auto section-padding grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          <div className="flex flex-col gap-5 lg:sticky lg:top-10">
            <h2 className="text-off-white font-bold" style={{ fontSize: "clamp(30px, 4vw, 52px)", lineHeight: 1.05 }}>{t("landing.form_title")}</h2>
            <p className="text-steel-blue text-xl">{t("landing.form_text")}</p>
            <ul className="flex flex-col gap-3">
              {(t("landing.form_points", { returnObjects: true }) as string[]).map((p, i) => (
                <li key={i} className="flex items-center gap-3 text-off-white font-semibold">
                  <span className="w-7 h-7 rounded-full bg-brand-blue-deep flex items-center justify-center shrink-0">
                    <Check size={15} className="text-white" strokeWidth={3} aria-hidden />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <a href={whatsappUrl(t("contact.whatsapp_msg"))} target="_blank" rel="noopener" className="self-start inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-off-white transition-colors mt-2">
              <WhatsAppIcon size={18} />
              {t("landing.or_whatsapp")}
            </a>
          </div>
          <div className="bg-charcoal rounded-2xl p-6 sm:p-8 lg:p-10 border border-brand-blue/20 shadow-2xl shadow-black/30">
            <LandingForm />
          </div>
        </div>
      </section>

      {/* ── Preguntas ── */}
      <section className="max-w-content mx-auto section-padding py-12 lg:py-16">
        <h2 className="text-off-white font-bold text-2xl lg:text-3xl mb-6">{t("landing.faq_title")}</h2>
        <FaqList items={faqs} />
      </section>

      {/* ── Cierre ── */}
      <section className="max-w-content mx-auto section-padding pb-16 lg:pb-24">
        <div className="rounded-2xl border border-brand-blue/30 px-6 py-12 sm:px-12 flex flex-col items-center gap-5 text-center" style={{ background: "radial-gradient(120% 140% at 50% 0%, oklch(58% 0.14 240 / 0.3) 0%, oklch(20% 0.03 240 / 0.6) 100%)" }}>
          <h2 className="text-off-white font-bold max-w-3xl" style={{ fontSize: "clamp(26px, 3.2vw, 42px)", lineHeight: 1.15 }}>{t("landing.final_title")}</h2>
          <p className="text-off-white/90 text-lg">{t("landing.final_text")}</p>
          <a href={FORM} className="w-full sm:w-auto bg-brand-blue-deep text-off-white font-semibold text-lg px-10 py-4 rounded-lg hover:bg-brand-blue-deep/90 transition-colors">{t("landing.cta")}</a>
          <a href={works} className="text-brand-blue font-semibold hover:text-off-white transition-colors">{t("landing.works")}</a>
        </div>
      </section>
    </>
  );
}
