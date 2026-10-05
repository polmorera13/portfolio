import { useEffect } from "react";
import { useTranslation } from "../lib/i18n";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { privacyPolicy, legalNotice, type LegalDoc } from "../data/legal";
import type { Locale } from "../types";


const DOCS: Record<"privacy" | "legal", Record<Locale, LegalDoc>> = {
  privacy: privacyPolicy,
  legal: legalNotice,
};

// Página de texto legal (política de privacidad y aviso legal), una por idioma.
// La cabecera y el pie los pone el Layout común.
export default function Legal({ doc }: { doc: keyof typeof DOCS }) {
  const { t } = useTranslation();
  const { lang } = usePage();
  const content = DOCS[doc][lang] ?? DOCS[doc].es;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [doc]);

  useEffect(() => {
    const prev = document.title;
    document.title = `${content.title} — Pol Morera`;
    return () => { document.title = prev; };
  }, [content.title]);

  return (
    <div className="pt-[72px]">
        <article className="max-w-3xl mx-auto section-padding py-16 lg:py-24 flex flex-col gap-10">
          <a href={pageHref("home", lang)} className="text-steel-blue hover:text-off-white text-sm transition-colors w-fit">
            {t("legal.back")}
          </a>

          <header className="flex flex-col gap-3">
            <h1
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
            >
              {content.title}
            </h1>
            {content.updated && <p className="text-steel-blue/70 text-sm">{content.updated}</p>}
          </header>

          {content.sections.map((section, i) => (
            <section key={i} className="flex flex-col gap-3">
              {section.heading && (
                <h2 className="text-off-white font-semibold text-xl">{section.heading}</h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-steel-blue leading-relaxed">{p}</p>
              ))}
            </section>
          ))}
        </article>
    </div>
  );
}
