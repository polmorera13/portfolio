import { useEffect } from "react";
import { useTranslation } from "../lib/i18n";
import Header from "../components/Header";
import Footer from "../sections/Footer";
import { useLanguage } from "../hooks/useLanguage";
import { privacyPolicy, legalNotice, type LegalDoc } from "../data/legal";
import type { Locale } from "../types";
import { withBase } from "../lib/paths";

const DOCS: Record<"privacy" | "legal", Record<Locale, LegalDoc>> = {
  privacy: privacyPolicy,
  legal: legalNotice,
};

// Página de texto legal (/politica-privacidad, /aviso-legal) con la cabecera y
// el pie de la web.
export default function Legal({ doc }: { doc: keyof typeof DOCS }) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const content = DOCS[doc][currentLang] ?? DOCS[doc].es;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [doc]);

  useEffect(() => {
    const prev = document.title;
    document.title = `${content.title} — Pol Morera`;
    return () => { document.title = prev; };
  }, [content.title]);

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Header />
      <main className="flex-1 pt-[72px]">
        <article className="max-w-3xl mx-auto section-padding py-16 lg:py-24 flex flex-col gap-10">
          <a href={withBase("/")} className="text-steel-blue hover:text-off-white text-sm transition-colors w-fit">
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
      </main>
      <Footer />
    </div>
  );
}
