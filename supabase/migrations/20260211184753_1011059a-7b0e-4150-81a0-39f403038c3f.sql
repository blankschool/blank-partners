
ALTER TABLE client_reports ADD COLUMN report_link text;
ALTER TABLE client_reports ADD COLUMN reference_date date;

-- Para registros existentes, preencher com created_at
UPDATE client_reports SET reference_date = created_at::date WHERE reference_date IS NULL;

ALTER TABLE client_reports ALTER COLUMN reference_date SET NOT NULL;

-- Evitar duplicatas
ALTER TABLE client_reports ADD CONSTRAINT client_reports_unique_period 
  UNIQUE (client_id, report_period, reference_date);
