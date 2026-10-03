import { useTranslation } from "react-i18next";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { withBase } from "../lib/paths";
import Breadcrumbs from "../components/Breadcrumbs";
import CtaBlock from "../components/CtaBlock";
import type { Locale } from "../types";

export const PROFILES = [
  { name: "Instagram", url: "https://www.instagram.com/polmoreraugc/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/pol-morera-de-frutos-9b8b35124/" },
];

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
          <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
            <img src={withBase("/pol-morera.webp")} alt={t("aboutpage.img_alt")} width={800} height={1000} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="max-w-content mx-auto section-padding py-10">
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
