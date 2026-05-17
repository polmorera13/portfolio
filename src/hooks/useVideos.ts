import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Video, VideoCategory } from "../types/video";

export function useVideos(category?: VideoCategory | VideoCategory[]) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("videos")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (category) {
        if (Array.isArray(category)) {
          query = query.in("category", category);
        } else {
          query = query.eq("category", category);
        }
      }

      const { data, error: err } = await query;

      if (!cancelled) {
        if (err) setError(err.message);
        else setVideos((data as Video[]) ?? []);
        setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [JSON.stringify(category)]);

  return { videos, loading, error };
}

export function useAllVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refetch() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("videos")
      .select("*")
      .order("category")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (err) setError(err.message);
    else setVideos((data as Video[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { refetch(); }, []);

  return { videos, loading, error, refetch };
}
