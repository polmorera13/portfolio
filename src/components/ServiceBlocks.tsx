import { ArrowRight } from "lucide-react";
import { useTranslation } from "../lib/i18n";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { CASE_DETAILS } from "../data/caseDetails";
import type { Locale } from "../types";

// Bloques comunes de las páginas de servicio (y de "Creador UGC hombre").

/** "Cómo trabajo", versión corta: los 4 pasos. */
export function ProcessSteps() {
  const { t } = useTranslation();
  const steps = t("process.steps", { returnObjects: true }) as { day: string; n: string; title: string }[];
  return (
    <section className="max-w-content mx-auto section-padding py-10 lg:py-14">
      <h2 className="text-off-white font-bold text-2xl lg:text-3xl mb-6">{t("svcpage.process")}</h2>
      <ol className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.isArray(steps) && steps.map((st, i) => (
          <li key={i} className={`rounded-xl bg-charcoal p-5 ${i === steps.length - 1 ? "border-2 border-brand-blue" : "border border-brand-blue/15"}`}>
            <span className="block text-brand-blue text-xs font-bold tracking-[0.15em] mb-1">{st.day}</span>
            <span className="text-off-white font-bold text-lg"><span className="text-brand-blue mr-1.5">{st.n}</span>{st.title}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Casos relacionados (por slug), con enlace a cada caso. */
export function RelatedCases({ slugs }: { slugs: string[] }) {
  const { t } = useTranslation();
  const { lang } = usePage();
  const l = lang as Locale;
  const related = CASE_DETAILS.filter((c) => slugs.includes(c.slug));
  if (!related.length) return null;
  return (
    <section className="max-w-content mx-auto section-padding py-10 lg:py-14">
      <h2 className="text-off-white font-bold text-2xl lg:text-3xl mb-6">{related.length > 1 ? t("svcpage.related_many") : t("svcpage.related")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {related.map((c) => (
          <a key={c.slug} href={pageHref(c.page, l)} className="group rounded-xl border border-off-white/10 bg-charcoal/50 p-6 flex flex-col gap-2 hover:border-brand-blue/50 transition-colors">
            <span className="text-steel-blue text-sm font-semibold">{c.displayName ? c.displayName[l] : `${c.brandName} · ${c.sector[l]}`}</span>
            <span className="text-off-white font-bold text-lg leading-snug">{c.metaTitle[l].split(" · ")[0]}</span>
            <span className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm mt-1">
              {t("casespage.see")} <ArrowRight size={14} aria-hidden className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

/** Enlace a la página "Creador UGC hombre" (portada, Sobre mí y servicios). */
export function UgcMaleLink({ textKey, className = "" }: { textKey: "links.ugc_male_about" | "links.ugc_male_svc"; className?: string }) {
  const { t } = useTranslation();
  const { lang } = usePage();
  return (
    <a href={pageHref("ugc-male", lang as Locale)} className={`self-start text-brand-blue font-semibold hover:text-off-white transition-colors ${className}`}>
      {t(textKey)}
    </a>
  );
}
