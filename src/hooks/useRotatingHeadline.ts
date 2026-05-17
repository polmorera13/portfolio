import { useState, useEffect } from "react";

export function useRotatingHeadline(headlines: string[], intervalMs = 3000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || headlines.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % headlines.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [headlines.length, intervalMs]);

  return index;
}
