import { createContext, useContext } from "react";
import type { Locale } from "../types";
import type { PageKey } from "../routes";

// Página e idioma actuales. El selector de idioma lo usa para enlazar a la
// versión equivalente; los enlaces internos, para quedarse en el mismo idioma.
export interface PageInfo {
  key: PageKey | null; // null: páginas sin versión por idioma (legales, 404)
  lang: Locale;
}

export const PageContext = createContext<PageInfo>({ key: null, lang: "es" });

export function usePage(): PageInfo {
  return useContext(PageContext);
}
