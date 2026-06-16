import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './sections/Hero';
import LogoMarquee from './sections/LogoMarquee';
import Results from './sections/Results';
import Problem from './sections/Problem';
import Services from './sections/Services';
import Process from './sections/Process';
import Portfolio from './sections/Portfolio';
import CTASection from './sections/CTASection';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ScrollProgressBar from './components/ScrollProgressBar';

const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));

function PublicSite() {
  return (
    <div className="min-h-screen bg-navy">
      <ScrollProgressBar />
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <Results />
        <Portfolio />
        <Problem />
        <Services />
        <Process />
        <Testimonials />
        <CTASection />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-navy" />}>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
