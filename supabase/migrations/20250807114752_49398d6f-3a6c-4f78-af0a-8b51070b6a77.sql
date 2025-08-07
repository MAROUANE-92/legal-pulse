-- Add missing RLS policies for existing tables without policies

-- RLS policies for answers table
CREATE POLICY "Users can view their own answers"
  ON public.answers FOR SELECT
  USING (submission_id IN (
    SELECT id FROM public."Soumissions_formulaires_form_clients" 
    WHERE form_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own answers"
  ON public.answers FOR INSERT
  WITH CHECK (submission_id IN (
    SELECT id FROM public."Soumissions_formulaires_form_clients" 
    WHERE form_id = auth.uid()
  ));

CREATE POLICY "Users can update their own answers"
  ON public.answers FOR UPDATE
  USING (submission_id IN (
    SELECT id FROM public."Soumissions_formulaires_form_clients" 
    WHERE form_id = auth.uid()
  ));

-- RLS policies for forms table
CREATE POLICY "Users can view forms"
  ON public.forms FOR SELECT
  USING (true);

-- RLS policies for Soumissions_formulaires_form_clients table
CREATE POLICY "Users can view their own submissions"
  ON public."Soumissions_formulaires_form_clients" FOR SELECT
  USING (form_id = auth.uid());

CREATE POLICY "Users can insert their own submissions"
  ON public."Soumissions_formulaires_form_clients" FOR INSERT
  WITH CHECK (form_id = auth.uid());

CREATE POLICY "Users can update their own submissions"
  ON public."Soumissions_formulaires_form_clients" FOR UPDATE
  USING (form_id = auth.uid());

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.export_timeline_csv(p_submission_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    csv_content TEXT;
BEGIN
    -- Check if user has access to this submission
    IF NOT EXISTS (
        SELECT 1 FROM public."Soumissions_formulaires_form_clients" 
        WHERE id = p_submission_id AND form_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Build CSV content
    SELECT string_agg(
        concat(
            '"', to_char(event_date, 'DD/MM/YYYY HH24:MI'), '",',
            '"', event_type, '",',
            '"', replace(title, '"', '""'), '"'
        ), 
        E'\n'
    ) INTO csv_content
    FROM public.timeline_events
    WHERE submission_id = p_submission_id
    ORDER BY event_date;

    -- Add header
    csv_content := 'Date,Type,Titre' || E'\n' || COALESCE(csv_content, '');

    RETURN csv_content;
END;
$$;