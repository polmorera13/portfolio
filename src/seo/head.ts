import es from "../locales/es.json";
import en from "../locales/en.json";
import ca from "../locales/ca.json";
import type { Locale } from "../types";
import { LOCALES, NOINDEX_PAGES, SITE_URL, pageUrl, type PageKey } from "../routes";
import { META, OG_LOCALE, PERSON, BUSINESS_DESCRIPTION, SERVICE_TYPES } from "./meta";
import { CASE_DETAILS } from "../data/caseDetails";
import { privacyPolicy, legalNotice } from "../data/legal";

// <head> de cada página prerenderizada: título, descripción, robots, canonical,
// hreflang recíprocos, Open Graph y JSON-LD. Lo usa scripts/prerender.mjs.

const L = { es, en, ca } as const;
const IMAGE = `${SITE_URL}/pol-morera.jpg`; // vista previa al compartir (JPG: lo leen todas las redes)
const PERSON_ID = `${SITE_URL}/#person`;

export type HeadRoute =
  | { kind: "page"; key: PageKey; lang: Locale }
  | { kind: "legal"; doc: "privacy" | "legal"; path: string }
  | { kind: "404"; lang: Locale };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const jsonLd = (obj: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

function crumbLabel(key: PageKey, lang: Locale): string {
  const t = L[lang];
  switch (key) {
    case "svc-ads": return t.nav.svc_ads;
    case "svc-social": return t.nav.svc_social;
    case "svc-corporate": return t.nav.svc_corporate;
    case "cases": return t.nav.cases;
    case "case-masterd": return "MasterD";
    case "case-dogfy": return "Dogfy Diet";
    case "about": return t.aboutpage.h1;
    default: return t.crumbs.home;
  }
}

function breadcrumbList(key: PageKey, lang: Locale) {
  const chain: PageKey[] = ["home"];
  if (key === "case-masterd" || key === "case-dogfy") chain.push("cases");
  if (key !== "home") chain.push(key);
  return {
    "@type": "BreadcrumbList",
    itemListElement: chain.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: k === "home" ? L[lang].crumbs.home : crumbLabel(k, lang),
      item: pageUrl(k, lang),
    })),
  };
}

function personNode(lang: Locale) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON.name,
    alternateName: PERSON.alternateName,
    url: pageUrl("home", lang),
    image: IMAGE,
    jobTitle: PERSON.jobTitle[lang],
    description: PERSON.description[lang],
    email: "hello@polmorera.es",
    address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressRegion: "Cataluña", addressCountry: "ES" },
    knowsLanguage: ["es", "ca", "en"],
    sameAs: PERSON.sameAs,
  };
}

function structuredData(key: PageKey, lang: Locale, title: string, description: string): string {
  const url = pageUrl(key, lang);
  if (key === "home") {
    return jsonLd({
      "@context": "https://schema.org",
      "@graph": [
        personNode(lang),
        {
          "@type": "ProfessionalService",
          "@id": `${SITE_URL}/#business`,
          name: "Pol Morera",
          url,
          image: IMAGE,
          email: "hello@polmorera.es",
          description: BUSINESS_DESCRIPTION[lang],
          areaServed: { "@type": "Country", name: "España" },
          address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressRegion: "Cataluña", addressCountry: "ES" },
          founder: { "@id": PERSON_ID },
          serviceType: Object.values(SERVICE_TYPES).map((s) => s[lang]),
        },
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url,
          name: "Pol Morera",
          inLanguage: lang,
          publisher: { "@id": PERSON_ID },
        },
      ],
    });
  }
  if (key === "svc-ads" || key === "svc-social" || key === "svc-corporate") {
    const svcKey = key === "svc-ads" ? "ads" : key === "svc-social" ? "organic" : "corporate";
    return jsonLd({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: L[lang].svcpage[svcKey].h1,
          serviceType: SERVICE_TYPES[key][lang],
          description,
          url,
          provider: { "@id": PERSON_ID },
          areaServed: { "@type": "Country", name: "España" },
        },
        breadcrumbList(key, lang),
      ],
    });
  }
  if (key === "about") {
    return jsonLd({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "ProfilePage", url, name: title, inLanguage: lang, mainEntity: { "@id": PERSON_ID } },
        personNode(lang),
        breadcrumbList(key, lang),
      ],
    });
  }
  // Índice y páginas de caso. Sin VideoObject hasta tener vídeo y fecha reales.
  return jsonLd({ "@context": "https://schema.org", ...breadcrumbList(key, lang) });
}

function titleAndDescription(key: PageKey, lang: Locale) {
  if (key === "case-masterd" || key === "case-dogfy") {
    const d = CASE_DETAILS.find((c) => c.page === key)!;
    return { title: d.metaTitle[lang], description: d.metaDescription[lang] };
  }
  const m = META[key];
  return { title: m.title[lang], description: m.description[lang] };
}

export function buildHead(route: HeadRoute): { html: string; lang: Locale } {
  if (route.kind === "legal") {
    const doc = route.doc === "privacy" ? privacyPolicy.es : legalNotice.es;
    const title = `${doc.title} | Pol Morera`;
    return {
      lang: "es",
      html: [
        `<title>${esc(title)}</title>`,
        `<meta name="description" content="${esc(doc.title + " de polmorera.es.")}" />`,
        `<meta name="robots" content="noindex, follow" />`,
        `<link rel="canonical" href="${SITE_URL}${route.path}" />`,
      ].join("\n    "),
    };
  }
  if (route.kind === "404") {
    return {
      lang: route.lang,
      html: [`<title>${esc(L[route.lang].notfound.h1)} | Pol Morera</title>`, `<meta name="robots" content="noindex" />`].join("\n    "),
    };
  }

  const { key, lang } = route;
  const { title, description } = titleAndDescription(key, lang);
  const url = pageUrl(key, lang);
  const noindex = NOINDEX_PAGES.includes(key);
  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
  ];
  if (!noindex) {
    lines.push(`<link rel="canonical" href="${url}" />`);
    for (const l of LOCALES) lines.push(`<link rel="alternate" hreflang="${l}" href="${pageUrl(key, l)}" />`);
    lines.push(`<link rel="alternate" hreflang="x-default" href="${pageUrl(key, "es")}" />`);
  }
  lines.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Pol Morera" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${IMAGE}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
    ...LOCALES.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}" />`),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${IMAGE}" />`,
  );
  if (!noindex) lines.push(structuredData(key, lang, title, description));
  return { lang, html: lines.join("\n    ") };
}
