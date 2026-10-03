import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "../locales/es.json";
import en from "../locales/en.json";
import ca from "../locales/ca.json";
import type { Locale } from "../types";

// El idioma lo marca la URL (/, /en/, /ca/). localStorage solo recuerda la
// preferencia para las páginas sin versión por idioma (textos legales) y nunca
// redirige. Funciona también al prerenderizar (sin window ni localStorage).
const STORAGE_KEY = "polmorera.lang";
const isBrowser = typeof window !== "undefined";

export function storedLanguage(): Locale | null {
  if (!isBrowser) return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "es" || v === "en" || v === "ca" ? v : null;
  } catch {
    return null;
  }
}

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    ca: { translation: ca },
  },
  lng: "es",
  fallbackLng: "es",
  interpolation: { escapeValue: false },
  initAsync: false,
});

/** Fija el idioma (sin recordarlo). */
export function applyLanguage(lang: Locale) {
  if (i18n.language !== lang) i18n.changeLanguage(lang);
  if (isBrowser) document.documentElement.lang = lang;
}

/** Cambia el idioma y lo recuerda (solo en páginas sin URL por idioma). */
export function setLanguage(lang: Locale) {
  applyLanguage(lang);
  if (isBrowser) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* sin almacenamiento */ }
  }
}

/** Recuerda la preferencia sin cambiar nada (al visitar /en/ o /ca/). */
export function rememberLanguage(lang: Locale) {
  if (isBrowser) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* sin almacenamiento */ }
  }
}

export default i18n;
