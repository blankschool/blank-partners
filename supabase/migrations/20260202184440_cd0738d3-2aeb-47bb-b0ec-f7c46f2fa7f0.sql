-- Create client_scopes table
CREATE TABLE public.client_scopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  instagram_posts integer DEFAULT 0,
  instagram_reels integer DEFAULT 0,
  instagram_stories integer DEFAULT 0,
  tiktok_posts integer DEFAULT 0,
  linkedin_posts integer DEFAULT 0,
  youtube_videos integer DEFAULT 0,
  youtube_shorts integer DEFAULT 0,
  recordings integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(client_id)
);

-- Enable RLS
ALTER TABLE public.client_scopes ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Authenticated users can view client scopes"
  ON public.client_scopes FOR SELECT USING (true);

CREATE POLICY "Admins can insert client scopes"
  ON public.client_scopes FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update client scopes"
  ON public.client_scopes FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete client scopes"
  ON public.client_scopes FOR DELETE USING (public.is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_client_scopes_updated_at
  BEFORE UPDATE ON public.client_scopes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();