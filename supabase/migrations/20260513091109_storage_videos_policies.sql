/*
  # Storage policies for videos bucket

  ## Summary
  Creates RLS policies on storage.objects for the "videos" bucket.
  - Public can read/download any file in the bucket
  - Only authenticated users can upload, update, and delete files
*/

CREATE POLICY "Public can view videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can update videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'videos')
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can delete videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'videos');
