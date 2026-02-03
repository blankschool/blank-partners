-- Renomear coluna youtube para youtube_shorts na tabela existente
ALTER TABLE client_scopes 
  RENAME COLUMN youtube TO youtube_shorts;

-- Adicionar nova coluna youtube_videos
ALTER TABLE client_scopes 
  ADD COLUMN youtube_videos integer DEFAULT 0;

-- Criar tabela para armazenar valores realizados por mês
CREATE TABLE client_scope_actuals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  month date NOT NULL,
  instagram integer DEFAULT 0,
  tiktok_posts integer DEFAULT 0,
  linkedin_posts integer DEFAULT 0,
  youtube_shorts integer DEFAULT 0,
  youtube_videos integer DEFAULT 0,
  recordings integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, month)
);

-- Habilitar RLS
ALTER TABLE client_scope_actuals ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Authenticated users can view scope actuals"
  ON client_scope_actuals FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can insert scope actuals"
  ON client_scope_actuals FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update scope actuals"
  ON client_scope_actuals FOR UPDATE TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete scope actuals"
  ON client_scope_actuals FOR DELETE TO authenticated
  USING (is_admin());

-- Trigger para atualizar updated_at
CREATE TRIGGER update_client_scope_actuals_updated_at
  BEFORE UPDATE ON client_scope_actuals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();