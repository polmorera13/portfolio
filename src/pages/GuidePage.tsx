import { useTranslation } from "../lib/i18n";
import { Check } from "lucide-react";
import { usePage } from "../lib/page";
import { pageHref, type PageKey } from "../routes";
import { withBase } from "../lib/paths";
import Breadcrumbs from "../components/Breadcrumbs";
import CtaBlock from "../components/CtaBlock";
import { GUIDE_UPDATED } from "../data/guide";
import type { Locale } from "../types";

interface Section { h: string; p: string[]; list?: string[]; ol?: string[]; link?: PageKey; linkText?: string }

const fmtDate = (iso: string, lang: Locale) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString(lang === "en" ? "en-GB" : lang === "ca" ? "ca-ES" : "es-ES", { day: "numeric", month: "long", year: "numeric" });

/** Guía "Qué es el UGC": /que-es-el-ugc/, /en/what-is-ugc/, /ca/que-es-l-ugc/. */
export default function GuidePage() {
  const { t } = useTranslation();
  const { lang } = usePage();
  const l = lang as Locale;
  const sections = t("guide.sections", { returnObjects: true }) as Section[];

  return (
    <>
      <article className="max-w-3xl mx-auto section-padding pt-28 lg:pt-36 pb-6">
        <Breadcrumbs items={[{ label: t("guide.crumb") }]} />
        <header className="flex flex-col gap-5 mt-8">
          <h1 className="text-off-white font-bold" style={{ fontSize: "clamp(32px, 4.6vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>{t("guide.h1")}</h1>
          <p className="text-steel-blue" style={{ fontSize: "clamp(18px, 1.8vw, 21px)", lineHeight: 1.6 }}>{t("guide.lead")}</p>
          {/* Autor y fecha */}
          <div className="flex items-center gap-3 border-y border-off-white/10 py-4">
            <img src={withBase("/pol-morera.webp")} alt="" width={1044} height={1328} className="w-11 h-11 rounded-full object-cover" style={{ objectPosition: "50% 20%" }} />
            <p className="text-sm text-steel-blue leading-snug">
              {t("guide.by")} <a href={pageHref("about", l)} className="text-off-white font-semibold hover:text-brand-blue">Pol Morera</a>
              <span className="block">
                {t("guide.updated")} <time dateTime={GUIDE_UPDATED}>{fmtDate(GUIDE_UPDATED, l)}</time>
              </span>
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-10 mt-10">
          {sections.map((s, i) => (
            <section key={i} className="flex flex-col gap-4">
              <h2 className="text-off-white font-bold" style={{ fontSize: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.2 }}>{s.h}</h2>
              {s.p.map((p, j) => (
                <p key={j} className="text-off-white/90" style={{ fontSize: "18px", lineHeight: 1.7 }}>{p}</p>
              ))}
              {s.list && (
                <ul className="flex flex-col gap-3">
                  {s.list.map((li, j) => (
                    <li key={j} className="flex items-start gap-3 text-off-white/90" style={{ fontSize: "17px", lineHeight: 1.6 }}>
                      <Check size={18} className="text-brand-blue mt-1 shrink-0" strokeWidth={3} aria-hidden />
                      {li}
                    </li>
                  ))}
                </ul>
              )}
              {s.ol && (
                <ol className="flex flex-col gap-3">
                  {s.ol.map((li, j) => (
                    <li key={j} className="flex items-start gap-3 text-off-white/90" style={{ fontSize: "17px", lineHeight: 1.6 }}>
                      <span className="w-7 h-7 rounded-full bg-brand-blue-deep text-white text-sm font-bold flex items-center justify-center shrink-0">{j + 1}</span>
                      {li}
                    </li>
                  ))}
                </ol>
              )}
              {s.link && (
                <a href={pageHref(s.link, l)} className="self-start text-brand-blue font-semibold hover:text-off-white transition-colors">{s.linkText}</a>
              )}
            </section>
          ))}
        </div>

        {/* Más sobre los servicios */}
        <nav aria-label={t("footer_cols.services")} className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["svc-ads", "svc-social", "svc-corporate"] as const).map((k) => (
            <a key={k} href={pageHref(k, l)} className="rounded-xl border border-off-white/10 bg-charcoal/50 px-5 py-4 text-off-white font-semibold hover:border-brand-blue/50 transition-colors">
              {t(`nav.${k === "svc-ads" ? "svc_ads" : k === "svc-social" ? "svc_social" : "svc_corporate"}`)} →
            </a>
          ))}
        </nav>
      </article>
      <CtaBlock />
    </>
  );
}
