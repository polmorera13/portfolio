import { useTranslation } from "react-i18next";
import { useCases } from "../hooks/useCases";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { caseDetailBySlug, type CaseSlug } from "../data/caseDetails";
import { tr, CaseHeader, CaseMedia, CaseResults } from "../sections/Cases";
import Breadcrumbs from "../components/Breadcrumbs";
import CtaBlock from "../components/CtaBlock";
import type { Locale } from "../types";

/** Página de un caso: vídeo arriba, cliente, qué necesitaba, qué hicimos y resultados (los del panel, sin cambios). */
export default function CasePage({ slug }: { slug: CaseSlug }) {
  const { t, i18n } = useTranslation();
  const { lang } = usePage();
  const d = caseDetailBySlug(slug);
  const c = useCases().find((x) => x.brandName.toLowerCase() === d.brandName.toLowerCase());
  const l = lang as Locale;

  return (
    <>
      <section className="max-w-content mx-auto section-padding pt-28 lg:pt-36 pb-8">
        <Breadcrumbs items={[{ label: t("nav.cases"), href: pageHref("cases", l) }, { label: d.brandName }]} />
        <h1 className="text-off-white font-bold mt-8 max-w-4xl" style={{ fontSize: "clamp(30px, 4.4vw, 56px)", lineHeight: 1.08, letterSpacing: "-0.01em" }}>
          {c ? tr(c.title, i18n.language) : d.metaTitle[l].split(" · ")[0]}
        </h1>
      </section>

      {c && (
        <>
          {/* El vídeo de la campaña, arriba y grande */}
          <section className="max-w-content mx-auto section-padding pb-10">
            <CaseMedia c={c} large />
          </section>

          <section className="max-w-content mx-auto section-padding pb-10 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14">
            <div className="flex flex-col gap-6">
              <CaseHeader c={c} />
              <dl className="flex flex-col gap-5">
                <div>
                  <dt className="text-xs font-bold tracking-[0.14em] uppercase text-steel-blue">{t("casepage.client")}</dt>
                  <dd className="text-off-white text-lg mt-1">{d.brandName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-[0.14em] uppercase text-steel-blue">{t("casepage.sector")}</dt>
                  <dd className="text-off-white text-lg mt-1">{d.sector[l]}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-[0.14em] uppercase text-steel-blue">{t("casepage.need")}</dt>
                  <dd className="text-off-white mt-1" style={{ fontSize: "17px", lineHeight: 1.55 }}>{d.need[l]}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-[0.14em] uppercase text-steel-blue">{t("casepage.did")}</dt>
                  <dd className="text-off-white mt-1" style={{ fontSize: "17px", lineHeight: 1.55 }}>{d.did[l]}</dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-off-white font-bold text-2xl lg:text-3xl">{t("casepage.results")}</h2>
              <CaseResults c={c} />
            </div>
          </section>
        </>
      )}

      <CtaBlock title={t("casepage.want")} />
    </>
  );
}
