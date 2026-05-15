DROP POLICY IF EXISTS "Anyone can insert quiz submissions" ON public.quiz_submissions;
CREATE POLICY "Anyone can insert quiz submissions" ON public.quiz_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND answers IS NOT NULL
    AND jsonb_typeof(answers) = 'object'
  );