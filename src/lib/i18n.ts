import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "../locales/es.json";
import en from "../locales/en.json";
import ca from "../locales/ca.json";
import type { Locale } from "../types";

const STORAGE_KEY = "polmorera.lang";

const savedLang = (localStorage.getItem(STORAGE_KEY) as Locale) || "es";

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    ca: { translation: ca },
  },
  lng: savedLang,
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

export function setLanguage(lang: Locale) {
  i18n.changeLanguage(lang);
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

document.documentElement.lang = savedLang;

export default i18n;
