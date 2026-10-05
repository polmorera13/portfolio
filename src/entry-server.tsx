import { renderToString } from 'react-dom/server';
import { StaticRouter } from './lib/router';
import { applyLanguage, addLocale } from './lib/i18n';
import es from './locales/es.json';
import en from './locales/en.json';
import ca from './locales/ca.json';
import { ROUTER_BASENAME } from './lib/paths';
import { setInitialData, type InitialData } from './lib/initialData';
import App, { preloadAll } from './App';

addLocale('es', es);
addLocale('en', en);
addLocale('ca', ca);
import type { Locale } from './types';

// Prerenderizado: genera el HTML de una URL con sus datos, en su idioma.
// Lo usa scripts/prerender.mjs al construir la web.
export function render(url: string, lang: Locale, data: InitialData): string {
  setInitialData(data);
  applyLanguage(lang);
  return renderToString(
    <StaticRouter location={url} basename={ROUTER_BASENAME}>
      <App fallbackLang={lang} />
    </StaticRouter>,
  );
}

export { preloadAll };
export { pageVideos, mediaAbs } from './seo/videos';
export { ogText, ogImageSource, ogSlug } from './seo/og';
export { buildHead } from './seo/head';
export { PATHS, LOCALES, NOINDEX_PAGES, LEGAL_PATHS, SITE_URL } from './routes';
