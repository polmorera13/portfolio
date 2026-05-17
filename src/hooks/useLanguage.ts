import { useTranslation } from "react-i18next";
import { setLanguage } from "../lib/i18n";
import type { Locale } from "../types";

export function useLanguage() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as Locale;

  return { currentLang, setLanguage };
}
