import { useState, useEffect, useMemo } from "react";
import { videos as staticCatalog } from "../data/videos";
import { fetchVideos } from "../lib/api";
import type { Video, VideoCategory } from "../types/video";

// Catálogo en vivo desde la API (VPS). Cae al catálogo estático empaquetado si
// la API no responde, así la web nunca se queda sin vídeos.
let cache: Video[] | null = null;
let inflight: Promise<Video[]> | null = null;

function loadCatalog(): Promise<Video[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetchVideos()
      .then((list) => {
        cache = list;
        return list;
      })
      .catch(() => staticCatalog)
      .finally(() => { inflight = null; });
  }
  return inflight;
}

export function useVideos(category?: VideoCategory | VideoCategory[]) {
  const [all, setAll] = useState<Video[]>(cache ?? staticCatalog);
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    let cancelled = false;
    loadCatalog().then((list) => {
      if (!cancelled) {
        setAll(list);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const videos = useMemo(() => {
    let list = all.filter((v) => v.is_active !== false);
    if (category) {
      const cats = Array.isArray(category) ? category : [category];
      list = list.filter((v) => cats.includes(v.category));
    }
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }, [all, JSON.stringify(category)]);

  return { videos, loading, error: null as string | null };
}

export type { Video };
