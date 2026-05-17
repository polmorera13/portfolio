/*
  # Create videos table

  ## Summary
  Creates the core videos table for managing portfolio and hero videos.
  All content on the public site is driven from this table.

  ## New Tables
  - `videos`
    - `id` (uuid, primary key)
    - `category` (text) — one of: hero, ads, organic, corporate, street
    - `title` (text, optional)
    - `client` (text, optional)
    - `storage_path` (text) — path inside the Supabase Storage "videos" bucket
    - `thumbnail_path` (text, optional) — path inside the "videos" bucket under thumbnails/
    - `aspect_ratio` (text) — one of: 16:9, 9:16
    - `display_order` (integer) — controls sort order within a category
    - `is_active` (boolean) — only active videos appear on the public site
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - SELECT policy: anyone can read rows where is_active = TRUE
  - INSERT/UPDATE/DELETE: only authenticated users

  ## Indexes
  - Compound index on (category, is_active, display_order) for fast filtered queries
*/

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

CREATE POLICY "Anyone can read active videos"
  ON videos FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS videos_category_active_idx
  ON videos(category, is_active, display_order);
