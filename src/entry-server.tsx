import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { applyLanguage } from './lib/i18n';
import { ROUTER_BASENAME } from './lib/paths';
import { setInitialData, type InitialData } from './lib/initialData';
import App from './App';
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

export { pageVideos, mediaAbs } from './seo/videos';
export { buildHead } from './seo/head';
export { PATHS, LOCALES, NOINDEX_PAGES, LEGAL_PATHS, SITE_URL } from './routes';
