import { useTranslation } from "../lib/i18n";
import { ArrowRight } from "lucide-react";
import { useCases } from "../hooks/useCases";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { caseDetailFor } from "../data/caseDetails";
import { tr, CaseHeader } from "../sections/Cases";
import Breadcrumbs from "../components/Breadcrumbs";
import CtaBlock from "../components/CtaBlock";

/** Índice de casos: /casos/, /en/case-studies/, /ca/casos/. */
export default function CasesIndexPage() {
  const { t, i18n } = useTranslation();
  const { lang } = usePage();
  const cases = useCases().filter((c) => caseDetailFor(c));

  return (
    <>
      <section className="max-w-content mx-auto section-padding pt-28 lg:pt-36 pb-10">
        <Breadcrumbs items={[{ label: t("nav.cases") }]} />
        <h1 className="text-off-white font-bold mt-8" style={{ fontSize: "clamp(34px, 5vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
          {t("casespage.h1")}
        </h1>
        <p className="text-steel-blue text-lg mt-5 max-w-3xl">{t("casespage.intro")}</p>
      </section>

      <section className="max-w-content mx-auto section-padding pb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c) => {
          const d = caseDetailFor(c)!;
          const lead = c.kpis.find((k) => k.highlight) ?? c.kpis[0];
          return (
            <a key={c.id} href={pageHref(d.page, lang)}
              className="group rounded-[22px] border border-off-white/10 bg-charcoal/50 p-6 lg:p-8 flex flex-col gap-5 hover:border-brand-blue/50 transition-colors">
              <CaseHeader c={c} />
              <h2 className="text-off-white font-bold text-2xl leading-tight">{tr(c.title, i18n.language)}</h2>
              {/* Del propio caso: sector y qué hicimos */}
              <p className="text-steel-blue" style={{ fontSize: "15.5px", lineHeight: 1.55 }}>
                <span className="text-off-white/90 font-semibold">{d.sector[lang]}.</span> {d.did[lang]}
              </p>
              {lead && (
                <span className="flex items-baseline gap-3">
                  <span className="text-brand-blue font-bold text-4xl tabular-nums">{lead.value}</span>
                  <span className="text-off-white/90 font-semibold">{tr(lead.label, i18n.language)}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-2 text-brand-blue font-semibold mt-auto">
                {t("casespage.see")} <ArrowRight size={16} aria-hidden className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>
          );
        })}
      </section>

      <CtaBlock />
    </>
  );
}
