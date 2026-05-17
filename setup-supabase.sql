-- ============================================================
-- SUPABASE SETUP — Pol Morera Portfolio
-- Ejecuta este bloque entero en Supabase → SQL Editor → New query
-- ============================================================

-- ── 1. Crear tabla videos ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('hero', 'ads', 'organic', 'corporate', 'street')),
  title TEXT,
  client TEXT,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  aspect_ratio TEXT NOT NULL CHECK (aspect_ratio IN ('16:9', '9:16')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- ── 2. Columnas extra (slot + media_type) ─────────────────────
ALTER TABLE videos
  ADD COLUMN IF NOT EXISTS slot INTEGER,
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'video'
    CHECK (media_type IN ('video', 'image'));

-- ── 3. Índices ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS videos_category_active_idx
  ON videos(category, is_active, display_order);

CREATE INDEX IF NOT EXISTS videos_hero_slot_idx
  ON videos(category, slot)
  WHERE category = 'hero' AND is_active = TRUE;

-- ── 4. RLS — tabla videos ─────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can read active videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can insert videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON videos;

CREATE POLICY "Anyone can read active videos"
  ON videos FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ── 5. RLS — storage.objects (bucket "videos") ────────────────
DROP POLICY IF EXISTS "Public can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON storage.objects;

CREATE POLICY "Public can view videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'videos' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'videos' AND auth.uid() IS NOT NULL);

-- ============================================================
-- DONE.
-- Verificación:
SELECT
  (SELECT COUNT(*) FROM videos) AS rows_in_videos,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'videos') AS videos_policies,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') AS storage_policies;
-- ============================================================
