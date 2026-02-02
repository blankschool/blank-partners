-- Consolidar campos do Instagram em um único campo
ALTER TABLE public.client_scopes 
  ADD COLUMN instagram integer DEFAULT 0;

UPDATE public.client_scopes 
SET instagram = COALESCE(instagram_posts, 0) + COALESCE(instagram_reels, 0) + COALESCE(instagram_stories, 0);

ALTER TABLE public.client_scopes 
  DROP COLUMN instagram_posts,
  DROP COLUMN instagram_reels,
  DROP COLUMN instagram_stories;

-- Consolidar campos do YouTube em um único campo
ALTER TABLE public.client_scopes 
  ADD COLUMN youtube integer DEFAULT 0;

UPDATE public.client_scopes 
SET youtube = COALESCE(youtube_videos, 0) + COALESCE(youtube_shorts, 0);

ALTER TABLE public.client_scopes 
  DROP COLUMN youtube_videos,
  DROP COLUMN youtube_shorts;