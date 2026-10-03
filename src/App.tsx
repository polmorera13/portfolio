import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './sections/Hero';
import LogoMarquee from './sections/LogoMarquee';
import Results from './sections/Results';
import Cases from './sections/Cases';
import Problem from './sections/Problem';
import About from './sections/About';
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
import MiniCTA from './components/MiniCTA';
import MobileCTABar from './components/MobileCTABar';

const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const Legal = lazy(() => import('./pages/Legal'));

function PublicSite() {
  return (
    <div className="min-h-screen bg-navy">
      <ScrollProgressBar />
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <Portfolio />
        <MiniCTA textKey="minicta.after_work" compactTop />
        <Results />
        <Cases />
        <Problem />
        <Services />
        <Testimonials />
        <MiniCTA
          textKey="minicta.after_testimonials"
          variant="white"
          buttonKey="minicta.testimonials_button"
          noteKey="minicta.testimonials_note"
        />
        <Process />
        <About />
        <CTASection />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-navy" />}>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/politica-privacidad" element={<Legal doc="privacy" />} />
          <Route path="/aviso-legal" element={<Legal doc="legal" />} />
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
