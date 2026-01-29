-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- RLS policy: Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy: Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy: Anyone can view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());