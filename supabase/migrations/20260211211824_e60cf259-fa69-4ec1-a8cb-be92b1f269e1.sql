
ALTER TABLE public.client_meetings ADD COLUMN IF NOT EXISTS meeting_period text;

ALTER TABLE public.client_meetings ADD CONSTRAINT client_meetings_unique_period 
  UNIQUE (client_id, meeting_period, meeting_date);
