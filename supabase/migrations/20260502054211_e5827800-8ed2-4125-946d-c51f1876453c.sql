
-- Fix search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Restrict EXECUTE on SECURITY DEFINER functions to internal use only.
-- has_role is called only from RLS policies (which run as the table owner / postgres),
-- and handle_new_user is only called via trigger.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten quiz_responses INSERT: must be either anonymous (no user_id) or own user_id
DROP POLICY IF EXISTS "Anyone insert quiz" ON public.quiz_responses;
CREATE POLICY "Insert quiz response" ON public.quiz_responses
  FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Tighten newsletter INSERT: require non-empty email format
DROP POLICY IF EXISTS "Anyone subscribes" ON public.newsletter_subscribers;
CREATE POLICY "Anyone subscribes" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (email IS NOT NULL AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');
