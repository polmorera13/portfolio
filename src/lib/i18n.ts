import { createElement, Fragment, isValidElement, cloneElement, useSyncExternalStore, type ReactElement, type ReactNode } from "react";
import type { Locale } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Traducciones, versión mínima (sustituye a i18next + react-i18next, ~15 KB menos
// de JavaScript). Lo que usa la web: t("a.b.c"), t(key, { returnObjects: true }),
// <Trans> con enlaces <link>…</link>, el idioma actual y cargar idiomas bajo demanda.
//
// El idioma lo marca la URL (/, /en/, /ca/). localStorage solo recuerda la
// preferencia para las páginas sin versión por idioma (textos legales) y nunca
// redirige. Funciona también al prerenderizar (sin window ni localStorage).
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "polmorera.lang";
const isBrowser = typeof window !== "undefined";
type Bundle = Record<string, unknown>;

const bundles: Partial<Record<Locale, Bundle>> = {};
let current: Locale = "es";
const listeners = new Set<() => void>();

function lookup(lang: Locale, key: string): unknown {
  let node: unknown = bundles[lang];
  for (const part of key.split(".")) {
    if (node && typeof node === "object" && part in (node as Bundle)) node = (node as Bundle)[part];
    else return undefined;
  }
  return node;
}

export type TFunction = (key: string, opts?: { returnObjects?: boolean }) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

function makeT(lang: () => Locale): TFunction {
  return (key, opts) => {
    let v = lookup(lang(), key);
    if (v === undefined && lang() !== "es") v = lookup("es", key);
    if (v === undefined) return key;
    if (typeof v === "string") return v;
    return opts?.returnObjects ? v : key;
  };
}

const t = makeT(() => current);

/** Objeto parecido al de i18next con lo que usa la web. */
const i18n = {
  get language(): Locale { return current; },
  t,
  getFixedT: (lang: Locale) => makeT(() => lang),
  hasResourceBundle: (lang: Locale) => !!bundles[lang],
  addResourceBundle: (lang: Locale, _ns: string, bundle: Bundle) => { bundles[lang] = bundle; },
  changeLanguage: (lang: Locale) => {
    if (current === lang) return;
    current = lang;
    listeners.forEach((l) => l());
  },
};
export default i18n;

const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

/** Igual que el de react-i18next: { t, i18n } y vuelve a pintar al cambiar de idioma. */
export function useTranslation() {
  useSyncExternalStore(subscribe, () => current, () => current);
  return { t, i18n };
}

/** Texto con etiquetas <nombre>…</nombre> sustituidas por componentes (p. ej. enlaces). */
export function Trans({ i18nKey, components = {} }: { i18nKey: string; components?: Record<string, ReactElement> }) {
  useSyncExternalStore(subscribe, () => current, () => current);
  const text = t(i18nKey) as string;
  const parts: ReactNode[] = [];
  const re = /<(\w+)>(.*?)<\/\1>/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const comp = components[m[1]];
    parts.push(comp && isValidElement(comp) ? cloneElement(comp, { key: i++ }, m[2]) : m[2]);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return createElement(Fragment, null, ...parts);
}

// ── Idiomas ──────────────────────────────────────────────────────────────────
export function storedLanguage(): Locale | null {
  if (!isBrowser) return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "es" || v === "en" || v === "ca" ? v : null;
  } catch {
    return null;
  }
}

// Los textos de cada idioma van en su propio archivo: el navegador solo descarga el
// de la página (loadLocale, antes de pintar). Al prerenderizar se añaden los tres.
const LOADERS: Record<Locale, () => Promise<{ default: Bundle }>> = {
  es: () => import("../locales/es.json"),
  en: () => import("../locales/en.json"),
  ca: () => import("../locales/ca.json"),
};

/** Descarga los textos de un idioma si aún no están. */
export async function loadLocale(lang: Locale) {
  if (bundles[lang]) return;
  bundles[lang] = (await LOADERS[lang]()).default;
}

/** Añade los textos de un idioma ya cargados (prerenderizado). */
export function addLocale(lang: Locale, bundle: Bundle) {
  if (!bundles[lang]) bundles[lang] = bundle;
}

/** Fija el idioma (sin recordarlo). */
export function applyLanguage(lang: Locale) {
  i18n.changeLanguage(lang);
  if (isBrowser) document.documentElement.lang = lang;
}

/** Cambia el idioma y lo recuerda (solo en páginas sin URL por idioma). */
export async function setLanguage(lang: Locale) {
  await loadLocale(lang);
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
