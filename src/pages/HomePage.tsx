import Hero from "../sections/Hero";
import LogoMarquee from "../sections/LogoMarquee";
import Results from "../sections/Results";
import Cases from "../sections/Cases";
import Problem from "../sections/Problem";
import About from "../sections/About";
import Services from "../sections/Services";
import Process from "../sections/Process";
import Portfolio from "../sections/Portfolio";
import CTASection from "../sections/CTASection";
import Testimonials from "../sections/Testimonials";
import FAQ from "../sections/FAQ";
import Contact from "../sections/Contact";
import MiniCTA from "../components/MiniCTA";

/** Portada (/, /en/, /ca/). */
export default function HomePage() {
  return (
    <>
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
    </>
  );
}
