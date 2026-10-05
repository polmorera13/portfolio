import { useTranslation } from "../lib/i18n";
import { useCases } from "../hooks/useCases";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { caseDetailBySlug, caseDetailFor, type CaseSlug, type CaseStory } from "../data/caseDetails";
import { tr, CaseHeader, CaseMedia, CaseResults, CaseEvidence } from "../sections/Cases";
import Breadcrumbs from "../components/Breadcrumbs";
import CtaBlock from "../components/CtaBlock";
import type { Locale } from "../types";

const dtCls = "text-xs font-bold tracking-[0.14em] uppercase text-steel-blue";
const h2Cls = "text-off-white font-bold text-2xl lg:text-3xl";
const bodyStyle = { fontSize: "17px", lineHeight: 1.6 } as const;

/** Página de un caso, por bloques de fondo distinto para que se lea mejor:
 *  1. oscuro: título, vídeos y capturas;
 *  2. blanco: cliente, resultados, el reto y qué hicimos;
 *  3. azul: cómo trabajamos;  4. oscuro: las cifras. */
export default function CasePage({ slug }: { slug: CaseSlug }) {
  const { t, i18n } = useTranslation();
  const { lang } = usePage();
  const d = caseDetailBySlug(slug);
  const c = useCases().find((x) => caseDetailFor(x)?.slug === slug);
  const l = lang as Locale;
  const name = d.displayName ? d.displayName[l] : d.brandName;
  const story = d.story;
  const hasVideo = !!c?.videos.some((v) => v.file);

  return (
    <>
      <section className="max-w-content mx-auto section-padding pt-28 lg:pt-36 pb-8">
        <Breadcrumbs items={[{ label: t("nav.cases"), href: pageHref("cases", l) }, { label: name }]} />
        <h1 className="text-off-white font-bold mt-8 max-w-4xl" style={{ fontSize: "clamp(30px, 4.4vw, 56px)", lineHeight: 1.08, letterSpacing: "-0.01em" }}>
          {c ? tr(c.title, i18n.language) : d.metaTitle[l].split(" · ")[0]}
        </h1>
      </section>

      {c && (!story || hasVideo || c.evidence.some((e) => e.visible && e.image)) && (
        <section className="max-w-content mx-auto section-padding pb-12 lg:pb-16 flex flex-col gap-8">
          {(!story || hasVideo) && <CaseMedia c={c} large />}
          <div className="w-full max-w-4xl mx-auto">
            <CaseEvidence c={c} />
          </div>
        </section>
      )}

      {/* Bloque blanco */}
      <div className="on-light">
        <div className="max-w-content mx-auto section-padding py-14 lg:py-20 flex flex-col gap-14 lg:gap-20">
          {c && (
            <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14">
              <div className="flex flex-col gap-6">
                <CaseHeader c={c} />
                <dl className="flex flex-col gap-5">
                  {/* En los casos anónimos el nombre ya va en la cabecera */}
                  {!d.displayName && (
                    <div>
                      <dt className={dtCls}>{t("casepage.client")}</dt>
                      <dd className="text-off-white text-lg mt-1">{name}</dd>
                    </div>
                  )}
                  <div>
                    <dt className={dtCls}>{t("casepage.sector")}</dt>
                    <dd className="text-off-white text-lg mt-1">{d.sector[l]}</dd>
                  </div>
                  {!story && (
                    <>
                      <div>
                        <dt className={dtCls}>{t("casepage.need")}</dt>
                        <dd className="text-off-white mt-1" style={bodyStyle}>{d.need[l]}</dd>
                      </div>
                      <div>
                        <dt className={dtCls}>{t("casepage.did")}</dt>
                        <dd className="text-off-white mt-1" style={bodyStyle}>{d.did[l]}</dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className={h2Cls}>{t("casepage.results")}</h2>
                <CaseResults c={c} />
              </div>
            </section>
          )}
          {story && <ChallengeAndStages story={story} l={l} />}
        </div>
      </div>

      {story && <HowAndFigures story={story} l={l} />}

      <CtaBlock title={t("casepage.want")} />
    </>
  );
}

/** El reto y qué hicimos (dentro del bloque blanco). */
function ChallengeAndStages({ story, l }: { story: CaseStory; l: Locale }) {
  const { t } = useTranslation();
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 lg:gap-14">
        <h2 className={h2Cls}>{t("casepage.challenge")}</h2>
        <div className="flex flex-col gap-4 max-w-3xl">
          {story.challenge.map((p, i) => (
            <p key={i} className="text-off-white/90" style={bodyStyle}>{p[l]}</p>
          ))}
          {story.challengeBullets && (
            <ul className="flex flex-col gap-2.5">
              {story.challengeBullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-off-white/90" style={bodyStyle}>
                  <span aria-hidden className="mt-[11px] w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                  <span>{b[l]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 lg:gap-14">
          <h2 className={h2Cls}>{t("casepage.did")}</h2>
          {story.didIntro && <p className="text-off-white/90 max-w-3xl" style={bodyStyle}>{story.didIntro[l]}</p>}
        </div>
        {story.stages.length === 0 ? null : story.stages.every((s) => !s.text) ? (
          // Etapas sin texto: etiquetas con su color
          <ul className="flex flex-wrap gap-3">
            {story.stages.map((s, i) => (
              <li key={i} className="flex items-center gap-2.5 rounded-full border border-off-white/15 bg-charcoal/50 px-4 py-2 text-off-white font-semibold">
                <span aria-hidden className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                {s.title[l]}
              </li>
            ))}
          </ul>
        ) : (
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {story.stages.map((s, i) => (
              <li
                key={i}
                className="rounded-2xl border border-off-white/10 bg-charcoal/50 p-5 lg:p-6 flex flex-col gap-3"
                style={{ borderTop: `3px solid ${s.color}` }}
              >
                <h3 className="flex items-start gap-2.5 text-off-white font-bold text-lg leading-snug">
                  <span aria-hidden className="mt-[7px] w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <span>{s.title[l]}</span>
                </h3>
                {s.text && <p className="text-off-white/85" style={{ fontSize: "15.5px", lineHeight: 1.6 }}>{s.text[l]}</p>}
                {s.bullets && (
                  <ul className="flex flex-col gap-2">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2.5 text-off-white/85" style={{ fontSize: "15px", lineHeight: 1.55 }}>
                        <span aria-hidden className="mt-[9px] w-1 h-1 rounded-full bg-steel-blue shrink-0" />
                        <span>{b[l]}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.after && <p className="text-steel-blue" style={{ fontSize: "15px", lineHeight: 1.55 }}>{s.after[l]}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}

/** Cómo trabajamos (franja azul) y las cifras (oscuro). */
function HowAndFigures({ story, l }: { story: CaseStory; l: Locale }) {
  const { t } = useTranslation();
  return (
    <>
      <section className="bg-brand-blue">
        <div className="max-w-content mx-auto section-padding py-14 lg:py-20 flex flex-col gap-6">
          <h2 className="text-white font-bold text-2xl lg:text-3xl">{t("casepage.how")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {story.how.map((h, i) => (
              <div key={i} className="rounded-2xl bg-white/10 border border-white/25 p-5 lg:p-6 flex flex-col gap-2">
                <h3 className="text-white font-bold text-lg leading-snug">{h.title[l]}</h3>
                <p className="text-white/90" style={{ fontSize: "15.5px", lineHeight: 1.6 }}>{h.text[l]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-content mx-auto section-padding py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 lg:gap-14">
        <h2 className={h2Cls}>{t("casepage.figures")}</h2>
        <dl className="rounded-2xl border border-off-white/10 divide-y divide-off-white/10 overflow-hidden">
          {story.figures.map((f, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr] gap-1 sm:gap-6 px-5 py-4 bg-charcoal/40">
              <dt className="text-steel-blue font-semibold" style={{ fontSize: "15px" }}>{f.label[l]}</dt>
              <dd className="text-off-white font-bold" style={{ fontSize: "16px", lineHeight: 1.45 }}>{f.value[l]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
