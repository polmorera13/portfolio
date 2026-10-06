import { Suspense, lazy, type ReactNode } from 'react';
import { Routes, Route } from './lib/router';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Layout from './components/Layout';
import LandingLayout from './components/LandingLayout';
import { PageContext } from './lib/page';
import { preloadable } from './lib/preloadable';
import { BASE } from './lib/paths';
import { LOCALES, PATHS, pageFromPath, type PageKey } from './routes';
import type { Locale } from './types';

// Cada página va en su propio archivo de JavaScript: el navegador solo descarga la que abre.
const HomePage = preloadable(() => import('./pages/HomePage'));
const ServicePage = preloadable(() => import('./pages/ServicePage'));
const UgcMalePage = preloadable(() => import('./pages/UgcMalePage'));
const GuidePage = preloadable(() => import('./pages/GuidePage'));
const CasesIndexPage = preloadable(() => import('./pages/CasesIndexPage'));
const CasePage = preloadable(() => import('./pages/CasePage'));
const AboutPage = preloadable(() => import('./pages/AboutPage'));
const ThanksPage = preloadable(() => import('./pages/ThanksPage'));
const NotFoundPage = preloadable(() => import('./pages/NotFoundPage'));
const Legal = preloadable(() => import('./pages/Legal'));
const LandingPage = preloadable(() => import('./pages/LandingPage'));

const PAGE_LOADER: Record<PageKey, () => Promise<void>> = {
  home: HomePage.load,
  'svc-ads': ServicePage.load,
  'svc-social': ServicePage.load,
  'svc-corporate': ServicePage.load,
  'ugc-male': UgcMalePage.load,
  'guide-ugc': GuidePage.load,
  cases: CasesIndexPage.load,
  'case-masterd': CasePage.load,
  'case-dogfy': CasePage.load,
  'case-reactiva': CasePage.load,
  'case-agency': CasePage.load,
  about: AboutPage.load,
  thanks: ThanksPage.load,
  privacy: Legal.load,
  legal: Legal.load,
  landing: LandingPage.load,
};

/** Carga el código de la página de una URL (antes de hidratar, en main.tsx). */
export function preloadForPath(pathname: string): Promise<void> {
  const page = pageFromPath(pathname);
  if (page) return PAGE_LOADER[page.key]();
  const p = pathname.replace(new RegExp('^' + BASE.replace(/\/$/, '')), '') || '/';
  if (p.startsWith('/login') || p.startsWith('/admin')) return Promise.resolve();
  return NotFoundPage.load();
}

/** Todas las páginas (para prerenderizar). */
export function preloadAll(): Promise<unknown> {
  return Promise.all([HomePage, ServicePage, UgcMalePage, GuidePage, CasesIndexPage, CasePage, AboutPage, ThanksPage, NotFoundPage, Legal, LandingPage].map((p) => p.load()));
}

const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));

// Contenido de cada página del mapa de URLs (routes.ts)
function pageElement(key: PageKey): ReactNode {
  switch (key) {
    case 'home': return <HomePage />;
    case 'svc-ads': return <ServicePage service="ads" />;
    case 'svc-social': return <ServicePage service="organic" />;
    case 'svc-corporate': return <ServicePage service="corporate" />;
    case 'ugc-male': return <UgcMalePage />;
    case 'guide-ugc': return <GuidePage />;
    case 'cases': return <CasesIndexPage />;
    case 'case-masterd': return <CasePage slug="masterd" />;
    case 'case-dogfy': return <CasePage slug="dogfy" />;
    case 'case-reactiva': return <CasePage slug="reactiva" />;
    case 'case-agency': return <CasePage slug="agencia" />;
    case 'about': return <AboutPage />;
    case 'thanks': return <ThanksPage />;
    case 'privacy': return <Legal doc="privacy" />;
    case 'legal': return <Legal doc="legal" />;
    case 'landing': return <LandingPage />;
  }
}

function withPage(key: PageKey | null, lang: Locale, node: ReactNode) {
  return (
    <PageContext.Provider value={{ key, lang }}>
      {key === 'landing' ? <LandingLayout>{node}</LandingLayout> : <Layout>{node}</Layout>}
    </PageContext.Provider>
  );
}

/** Rutas de la web (las usan el navegador y el prerenderizado). */
export default function App({ fallbackLang = 'es' }: { fallbackLang?: Locale }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy" />}>
      <Routes>
        {(Object.keys(PATHS) as PageKey[]).flatMap((key) =>
          LOCALES.map((lang) => (
            <Route key={`${key}-${lang}`} path={PATHS[key][lang]} element={withPage(key, lang, pageElement(key))} />
          )),
        )}
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={withPage(null, fallbackLang, <NotFoundPage />)} />
      </Routes>
    </Suspense>
  );
}
