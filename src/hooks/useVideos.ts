import { useMemo } from "react";
import { videos as catalog } from "../data/videos";
import type { Video, VideoCategory } from "../types/video";

// Videos now come from a static catalog (src/data/videos.ts) served off our own
// VPS media server. No network call, no external backend, no bandwidth limits.
export function useVideos(category?: VideoCategory | VideoCategory[]) {
  const videos = useMemo(() => {
    let list = catalog.filter((v) => v.is_active);

    if (category) {
      const cats = Array.isArray(category) ? category : [category];
      list = list.filter((v) => cats.includes(v.category));
    }

    // Same ordering as before: display_order asc, then stable
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }, [JSON.stringify(category)]);

  return { videos, loading: false, error: null as string | null };
}

// Admin helper kept for API compatibility; returns the full catalog.
export function useAllVideos() {
  const videos = useMemo(() => [...catalog], []);
  return {
    videos,
    loading: false,
    error: null as string | null,
    refetch: async () => {},
  };
}

export type { Video };
