import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import type { FAQItem, Locale } from "../types";

/**
 * Preguntas frecuentes con <details>/<summary>: pregunta y respuesta están
 * siempre en el HTML (lo leen Google y las IAs), y se despliegan sin JavaScript.
 * `mobileVisible`: en móvil se ven las N primeras y un botón muestra el resto.
 */
export default function FaqList({ items, mobileVisible }: { items: FAQItem[]; mobileVisible?: number }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as Locale) || "es";
  const [showAll, setShowAll] = useState(false);
  const limit = mobileVisible ?? items.length;

  return (
    <div className="max-w-3xl w-full flex flex-col gap-3">
      {items.map((item, i) => (
        <details
          key={i}
          className={`faq-item group border border-charcoal rounded-xl overflow-hidden hover:border-brand-blue/30 transition-colors duration-200${
            !showAll && i >= limit ? " hidden md:block" : ""
          }`}
        >
          <summary className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer list-none">
            <span className="text-off-white font-semibold text-base">{item.question[lang]}</span>
            <ChevronDown size={18} className="text-brand-blue shrink-0 transition-transform duration-300 group-open:rotate-180" aria-hidden />
          </summary>
          <div className="px-6 pb-5 text-steel-blue text-sm leading-relaxed border-t border-charcoal/50 pt-4">
            {item.answer[lang]}
          </div>
        </details>
      ))}

      {!showAll && items.length > limit && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="md:hidden self-start mt-2 px-4 py-1.5 rounded-full text-sm font-semibold border border-charcoal text-steel-blue hover:border-steel-blue/60 hover:text-off-white transition-all duration-200"
        >
          {t("faq.more")}
        </button>
      )}
      <style dangerouslySetInnerHTML={{ __html: `.faq-item summary::-webkit-details-marker{display:none}` }} />
    </div>
  );
}
