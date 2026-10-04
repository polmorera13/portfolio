import { Suspense, lazy, type ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import CasesIndexPage from './pages/CasesIndexPage';
import CasePage from './pages/CasePage';
import AboutPage from './pages/AboutPage';
import ThanksPage from './pages/ThanksPage';
import NotFoundPage from './pages/NotFoundPage';
import Legal from './pages/Legal';
import { PageContext } from './lib/page';
import { LOCALES, PATHS, LEGAL_PATHS, type PageKey } from './routes';
import type { Locale } from './types';

const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));

// Contenido de cada página del mapa de URLs (routes.ts)
function pageElement(key: PageKey): ReactNode {
  switch (key) {
    case 'home': return <HomePage />;
    case 'svc-ads': return <ServicePage service="ads" />;
    case 'svc-social': return <ServicePage service="organic" />;
    case 'svc-corporate': return <ServicePage service="corporate" />;
    case 'cases': return <CasesIndexPage />;
    case 'case-masterd': return <CasePage slug="masterd" />;
    case 'case-dogfy': return <CasePage slug="dogfy" />;
    case 'case-reactiva': return <CasePage slug="reactiva" />;
    case 'case-agency': return <CasePage slug="agencia" />;
    case 'about': return <AboutPage />;
    case 'thanks': return <ThanksPage />;
  }
}

function withPage(key: PageKey | null, lang: Locale, node: ReactNode) {
  return (
    <PageContext.Provider value={{ key, lang }}>
      <Layout>{node}</Layout>
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
        <Route path={LEGAL_PATHS.privacy} element={<PageContext.Provider value={{ key: null, lang: fallbackLang }}><Legal doc="privacy" /></PageContext.Provider>} />
        <Route path={LEGAL_PATHS.legal} element={<PageContext.Provider value={{ key: null, lang: fallbackLang }}><Legal doc="legal" /></PageContext.Provider>} />
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
