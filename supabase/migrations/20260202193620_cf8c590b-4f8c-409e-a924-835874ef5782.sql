-- Criar enum type para status do cliente
CREATE TYPE client_status AS ENUM (
  'kickoff',
  'diagnostico',
  'apresentacao_planejamento',
  '30d',
  '60d',
  '90d',
  'ongoing',
  'cancelado'
);

-- Adicionar coluna status na tabela clients
ALTER TABLE clients 
ADD COLUMN status client_status DEFAULT 'kickoff';