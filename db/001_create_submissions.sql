-- Create submissions table for Supabase

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  breads jsonb,
  drinks jsonb,
  ts timestamptz DEFAULT now(),
  source text
);

-- Optional index on timestamp
CREATE INDEX IF NOT EXISTS submissions_ts_idx ON public.submissions (ts DESC);

-- Enable Row-Level Security to protect table from direct client writes
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to SELECT (optional). No INSERT policy is created, so
-- INSERTs from the browser (anon key) will be blocked. Server-side inserts using
-- the Supabase service role key bypass RLS and will continue to work.
CREATE POLICY select_authenticated ON public.submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- NOTE: If you later want to permit client-side inserts with anon key, add a
-- policy like:
-- CREATE POLICY insert_authenticated ON public.submissions
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (true);
