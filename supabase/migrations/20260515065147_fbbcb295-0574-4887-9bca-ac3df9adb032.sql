DO $$ BEGIN
  CREATE TYPE public.acne_severity AS ENUM ('mild', 'moderate', 'severe');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  answers JSONB NOT NULL,
  mild_score INT NOT NULL DEFAULT 0,
  moderate_score INT NOT NULL DEFAULT 0,
  severe_score INT NOT NULL DEFAULT 0,
  severity public.acne_severity NOT NULL,
  routine TEXT NOT NULL,
  tag TEXT NOT NULL,
  purchased BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert quiz submissions" ON public.quiz_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can view submissions" ON public.quiz_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions" ON public.quiz_submissions
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_quiz_submissions_severity ON public.quiz_submissions(severity);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_email ON public.quiz_submissions(email);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_created ON public.quiz_submissions(created_at DESC);