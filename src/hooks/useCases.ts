import { useEffect, useState } from "react";
import { fetchCases, type CaseStudy } from "../lib/api";
import { getInitialData } from "../lib/initialData";

/** Casos publicados: primero los prerenderizados y después los de la API, al día. */
export function useCases(): CaseStudy[] {
  const [cases, setCases] = useState<CaseStudy[]>(getInitialData()?.cases ?? []);
  useEffect(() => {
    let cancelled = false;
    fetchCases().then((c) => { if (!cancelled) setCases(c); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return cases;
}
