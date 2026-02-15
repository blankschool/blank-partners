
-- Create production_assignments table
CREATE TABLE public.production_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id text NOT NULL,
  team_member_id uuid NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  day_of_week integer,
  production_status text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(content_id, week_start)
);

-- Enable RLS
ALTER TABLE public.production_assignments ENABLE ROW LEVEL SECURITY;

-- RLS: admin/agency can do everything
CREATE POLICY "Admin/agency can manage production assignments"
  ON public.production_assignments
  FOR ALL
  USING (is_admin_or_agency())
  WITH CHECK (is_admin_or_agency());

-- Add SELECT policy for team_members (currently missing)
CREATE POLICY "Admin/agency can view team members"
  ON public.team_members
  FOR SELECT
  USING (is_admin_or_agency());

-- Trigger for updated_at
CREATE TRIGGER update_production_assignments_updated_at
  BEFORE UPDATE ON public.production_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
