import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from './lib/router';
import { applyLanguage, loadLocale, rememberLanguage, storedLanguage } from './lib/i18n';
import { ROUTER_BASENAME } from './lib/paths';
import { pageFromPath, LOCALES } from './routes';
import type { Locale } from './types';
import App, { preloadForPath } from './App.tsx';
import './index.css';

// El idioma lo marca la URL. Nunca se redirige.
// En las páginas sin versión por idioma (legales, 404) que llegan prerenderizadas
// se usa el idioma con el que se generó el HTML: si se cambiara al hidratar, React
// encontraría textos distintos y daría error. Los botones de idioma de la cabecera
// siguen cambiándolo en el sitio. Sin HTML previo (panel), la preferencia guardada.
const root = document.getElementById('root')!;
const hydrating = !!root.firstElementChild;
const page = pageFromPath(window.location.pathname);
const htmlLang = document.documentElement.lang as Locale;
const lang: Locale =
  page?.lang ?? (hydrating && LOCALES.includes(htmlLang) ? htmlLang : null) ?? storedLanguage() ?? 'es';
if (page) rememberLanguage(page.lang);

const tree = (
  <StrictMode>
    <BrowserRouter basename={ROUTER_BASENAME}>
      <App fallbackLang={lang} />
    </BrowserRouter>
  </StrictMode>
);

// Antes de pintar: los textos del idioma y el código de esta página (en paralelo).
// Páginas prerenderizadas: React "hidrata" el HTML que ya viene del servidor.
Promise.all([loadLocale(lang), preloadForPath(window.location.pathname)]).then(() => {
  applyLanguage(lang);
  if (hydrating) hydrateRoot(root, tree);
  else createRoot(root).render(tree);
});
