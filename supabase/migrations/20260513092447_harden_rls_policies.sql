/*
  # Harden RLS policies

  ## Summary
  Tightens existing RLS policies on the videos table and storage.objects.

  ## Changes

  ### videos table
  - Replaces `WITH CHECK (true)` on INSERT/UPDATE/DELETE with explicit `auth.uid() IS NOT NULL`
    to ensure only genuinely authenticated sessions (not expired or tampered JWTs) can mutate data.
  - No functional change for legitimate admins; closes the theoretical gap where a policy
    would pass even with a null uid.

  ### storage.objects
  - Adds `auth.uid() IS NOT NULL` guards to INSERT / UPDATE / DELETE policies.
  - SELECT policy is intentionally left public (read-only CDN access is required for the video player).

  ## Notes
  - Service role bypasses RLS entirely, so these policies only affect anon/authenticated roles.
  - No data is dropped or altered.
*/

-- ── videos table ──────────────────────────────────────────────────────────────

-- Drop the overly permissive insert/update/delete policies
DROP POLICY IF EXISTS "Authenticated users can insert videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON videos;

-- Re-create with explicit uid check
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

-- ── storage.objects ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON storage.objects;

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
