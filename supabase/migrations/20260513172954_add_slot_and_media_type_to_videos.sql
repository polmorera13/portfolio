/*
  # Add slot and media_type columns to videos table

  ## Summary
  Extends the videos table to support the hero image cluster feature.

  ## Changes
  - `slot` (INTEGER, nullable): Position 1–7 for hero image slots
  - `media_type` (TEXT, NOT NULL, DEFAULT 'video'): Distinguishes video vs image entries
    - Allowed values: 'video', 'image'

  ## New Index
  - `videos_hero_slot_idx`: Partial index on category='hero' for fast slot lookups

  ## Notes
  - All existing rows default to media_type='video' — no data loss
  - slot is only meaningful for hero images; non-hero rows leave it NULL
*/

ALTER TABLE videos
  ADD COLUMN IF NOT EXISTS slot INTEGER,
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'video'
    CHECK (media_type IN ('video', 'image'));

CREATE INDEX IF NOT EXISTS videos_hero_slot_idx
  ON videos(category, slot)
  WHERE category = 'hero' AND is_active = TRUE;
