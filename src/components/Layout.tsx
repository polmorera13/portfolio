import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "../sections/Footer";
import ScrollProgressBar from "./ScrollProgressBar";
import MobileCTABar from "./MobileCTABar";

/** Cabecera, pie y barra fija de móvil comunes a todas las páginas públicas. */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-navy">
      <ScrollProgressBar />
      <Header />
      <main>{children}</main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}
