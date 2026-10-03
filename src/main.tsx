import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { applyLanguage, rememberLanguage, storedLanguage } from './lib/i18n';
import { ROUTER_BASENAME } from './lib/paths';
import { pageFromPath } from './routes';
import App from './App.tsx';
import './index.css';

// El idioma lo marca la URL. En las páginas sin versión por idioma (legales,
// panel, 404) se usa la preferencia guardada o el español. Nunca se redirige.
const page = pageFromPath(window.location.pathname);
const lang = page?.lang ?? storedLanguage() ?? 'es';
applyLanguage(lang);
if (page) rememberLanguage(page.lang);

const tree = (
  <StrictMode>
    <BrowserRouter basename={ROUTER_BASENAME}>
      <App fallbackLang={lang} />
    </BrowserRouter>
  </StrictMode>
);

const root = document.getElementById('root')!;
// Páginas prerenderizadas: React "hidrata" el HTML que ya viene del servidor.
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
