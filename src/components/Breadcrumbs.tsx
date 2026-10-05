import { useTranslation } from "../lib/i18n";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";

/** Migas de pan visibles: Inicio › … › página actual. */
export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const { t } = useTranslation();
  const { lang } = usePage();
  const all = [{ label: t("crumbs.home"), href: pageHref("home", lang) }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-steel-blue">
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-steel-blue/50">›</span>}
            {it.href && i < all.length - 1 ? (
              <a href={it.href} className="hover:text-off-white transition-colors">{it.label}</a>
            ) : (
              <span aria-current="page" className="text-off-white/90">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
