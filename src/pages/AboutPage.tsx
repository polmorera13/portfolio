import { useTranslation } from "../lib/i18n";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import Breadcrumbs from "../components/Breadcrumbs";
import CtaBlock from "../components/CtaBlock";
import RotatingPhotos from "../components/RotatingPhotos";
import { aboutPhotos } from "../data/aboutPhotos";
import LogoMarquee from "../sections/LogoMarquee";
import { UgcMaleLink } from "../components/ServiceBlocks";
import type { Locale } from "../types";

export const PROFILES = [
  { name: "Instagram", url: "https://www.instagram.com/polmoreraugc/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/pol-morera-de-frutos-9b8b35124/" },
  { name: "YouTube", url: "https://www.youtube.com/@polmorera" },
];

// Entrevista en Canal Empresario (abril de 2026)
const INTERVIEW = { youtube: "https://www.youtube.com/watch?v=WqSVgqWTa1s", spotify: "https://open.spotify.com/episode/0pG2R5QGSc3ck9GKvUvOS9" };

/** Sobre mí: /sobre-mi/, /en/about/, /ca/sobre-mi/. */
export default function AboutPage() {
  const { t } = useTranslation();
  const { lang } = usePage();
  const l = lang as Locale;
  const facts: [string, React.ReactNode][] = [
    [t("aboutpage.name"), t("aboutpage.name_v")],
    [t("aboutpage.what"), t("aboutpage.what_v")],
    [t("aboutpage.where"), t("aboutpage.where_v")],
    [t("aboutpage.track"), t("aboutpage.track_v")],
    [t("aboutpage.langs"), t("aboutpage.langs_v")],
    [t("aboutpage.edu"), t("aboutpage.edu_v")],
    [
      t("aboutpage.services"),
      <span className="flex flex-col gap-1">
        <a href={pageHref("svc-ads", l)} className="text-brand-blue hover:text-off-white">{t("nav.svc_ads")}</a>
        <a href={pageHref("svc-social", l)} className="text-brand-blue hover:text-off-white">{t("nav.svc_social")}</a>
        <a href={pageHref("svc-corporate", l)} className="text-brand-blue hover:text-off-white">{t("nav.svc_corporate")}</a>
      </span>,
    ],
    [
      t("aboutpage.profiles"),
      <span className="flex flex-col gap-1">
        {PROFILES.map((p) => (
          <a key={p.name} href={p.url} target="_blank" rel="noopener me" className="text-brand-blue hover:text-off-white">{p.name}</a>
        ))}
      </span>,
    ],
  ];

  return (
    <>
      <section className="max-w-content mx-auto section-padding pt-28 lg:pt-36 pb-10">
        <Breadcrumbs items={[{ label: t("aboutpage.h1") }]} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-14 mt-8 items-start">
          <div className="flex flex-col gap-6">
            <h1 className="text-off-white font-bold" style={{ fontSize: "clamp(34px, 5vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              {t("aboutpage.h1")}
            </h1>
            <h2 className="text-off-white font-bold" style={{ fontSize: "clamp(22px, 2.4vw, 32px)", lineHeight: 1.2 }}>{t("about.title")}</h2>
            <p className="text-steel-blue" style={{ fontSize: "clamp(17px, 1.6vw, 20px)", lineHeight: 1.6 }}>{t("about.p1")}</p>
            <p className="text-steel-blue" style={{ fontSize: "clamp(17px, 1.6vw, 20px)", lineHeight: 1.6 }}>{t("about.p2")}</p>
          </div>
          <RotatingPhotos photos={aboutPhotos(t)} className="w-full rounded-xl" style={{ aspectRatio: "4/5" }} />
        </div>
      </section>

      {/* Mi historia */}
      <section className="max-w-content mx-auto section-padding py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 lg:gap-14">
        <h2 className="text-off-white font-bold text-2xl lg:text-3xl">{t("aboutpage.story_title")}</h2>
        <div className="flex flex-col gap-4 max-w-3xl">
          {(t("aboutpage.story", { returnObjects: true }) as string[]).map((p, i) => (
            <p key={i} className="text-off-white/90" style={{ fontSize: "18px", lineHeight: 1.65 }}>{p}</p>
          ))}
          <UgcMaleLink textKey="links.ugc_male_about" className="text-lg mt-2" />
        </div>
      </section>

      {/* Trayectoria (de LinkedIn) */}
      <section className="max-w-content mx-auto section-padding py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-14">
        <h2 className="text-off-white font-bold text-2xl lg:text-3xl">{t("aboutpage.career_title")}</h2>
        <ol className="flex flex-col max-w-3xl">
          {(t("aboutpage.career", { returnObjects: true }) as { when: string; role: string; org: string; d: string }[]).map((c, i) => (
            <li key={i} className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-1 sm:gap-6 border-t border-off-white/10 py-5">
              <span className="text-brand-blue font-bold text-sm tabular-nums pt-0.5">{c.when}</span>
              <div className="flex flex-col gap-1">
                <h3 className="text-off-white font-bold text-lg leading-snug">{c.role} <span className="text-steel-blue font-semibold">· {c.org}</span></h3>
                <p className="text-off-white/85" style={{ fontSize: "16px", lineHeight: 1.6 }}>{c.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* En cifras */}
      <section className="bg-brand-blue-deep">
        <div className="max-w-content mx-auto section-padding py-12 lg:py-16">
          <h2 className="sr-only">{t("aboutpage.numbers_title")}</h2>
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
            {(t("aboutpage.numbers", { returnObjects: true }) as { v: string; l: string }[]).map((n, i) => (
              <div key={i} className="flex flex-col-reverse justify-end gap-1">
                <dt className="text-white/90 font-semibold" style={{ fontSize: "16px", lineHeight: 1.35 }}>{n.l}</dt>
                <dd className="text-white font-bold tabular-nums leading-none" style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>{n.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Cómo trabajo */}
      <section className="max-w-content mx-auto section-padding py-12 lg:py-16 flex flex-col gap-6">
        <h2 className="text-off-white font-bold text-2xl lg:text-3xl">{t("aboutpage.how_title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(t("aboutpage.how", { returnObjects: true }) as { t: string; d: string }[]).map((h, i) => (
            <div key={i} className="rounded-2xl border border-off-white/10 bg-charcoal/50 p-6 flex flex-col gap-2">
              <h3 className="text-off-white font-bold text-lg leading-snug">{h.t}</h3>
              <p className="text-off-white/85" style={{ fontSize: "15.5px", lineHeight: 1.6 }}>{h.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Charlas y talleres */}
      <section className="max-w-content mx-auto section-padding py-12 lg:py-16 flex flex-col gap-6">
        <h2 className="text-off-white font-bold text-2xl lg:text-3xl">{t("aboutpage.talks_title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(t("aboutpage.talks", { returnObjects: true }) as { t: string; d: string; yt?: string; sp?: string }[]).map((h, i) => (
            <div key={i} className="rounded-2xl border border-off-white/10 bg-charcoal/50 p-6 flex flex-col gap-2">
              <h3 className="text-off-white font-bold text-lg leading-snug">{h.t}</h3>
              <p className="text-off-white/85" style={{ fontSize: "15.5px", lineHeight: 1.6 }}>{h.d}</p>
              {h.yt && (
                <p className="flex flex-wrap gap-x-5 gap-y-1 mt-1">
                  <a href={INTERVIEW.youtube} target="_blank" rel="noopener" className="text-brand-blue font-semibold text-sm hover:text-off-white">{h.yt} →</a>
                  <a href={INTERVIEW.spotify} target="_blank" rel="noopener" className="text-brand-blue font-semibold text-sm hover:text-off-white">{h.sp} →</a>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Marcas */}
      <LogoMarquee />

      <section className="max-w-content mx-auto section-padding py-12 lg:py-16">
        <h2 className="text-off-white font-bold text-2xl lg:text-3xl mb-6">{t("aboutpage.facts")}</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl">
          {facts.map(([k, v], i) => (
            <div key={i} className="border-t border-off-white/10 pt-4">
              <dt className="text-xs font-bold tracking-[0.14em] uppercase text-steel-blue">{k}</dt>
              <dd className="text-off-white text-lg mt-1">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaBlock />
    </>
  );
}
