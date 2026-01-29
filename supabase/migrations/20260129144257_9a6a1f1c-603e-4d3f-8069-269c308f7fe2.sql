-- Add new values to team_type enum
ALTER TYPE team_type ADD VALUE IF NOT EXISTS 'Social Media';
ALTER TYPE team_type ADD VALUE IF NOT EXISTS 'Criação';
ALTER TYPE team_type ADD VALUE IF NOT EXISTS 'Diretoria';
ALTER TYPE team_type ADD VALUE IF NOT EXISTS 'Comercial';

-- Create seniority_level enum
CREATE TYPE seniority_level AS ENUM ('Júnior', 'Pleno', 'Sênior');

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  birth_date DATE,
  start_date DATE,
  area team_type,
  position TEXT,
  seniority seniority_level,
  leader_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  squad TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create team_member_clients junction table
CREATE TABLE public.team_member_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_member_id, client_id)
);

-- Enable RLS on all tables
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member_clients ENABLE ROW LEVEL SECURITY;

-- team_members policies
CREATE POLICY "Authenticated users can view team members"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert team members"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update team members"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete team members"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (is_admin());

-- clients policies
CREATE POLICY "Authenticated users can view clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert clients"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update clients"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete clients"
  ON public.clients FOR DELETE
  TO authenticated
  USING (is_admin());

-- team_member_clients policies
CREATE POLICY "Authenticated users can view team member clients"
  ON public.team_member_clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert team member clients"
  ON public.team_member_clients FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update team member clients"
  ON public.team_member_clients FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete team member clients"
  ON public.team_member_clients FOR DELETE
  TO authenticated
  USING (is_admin());

-- Trigger for updated_at on team_members
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();