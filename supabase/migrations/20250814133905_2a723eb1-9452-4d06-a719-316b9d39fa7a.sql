-- Migration pour corriger la faille de sécurité sur la table timeline_events
-- Supprimer la politique dangereuse existante et toutes les autres pour éviter les conflits
DROP POLICY IF EXISTS "Allow public access to timeline_events" ON public.timeline_events;
DROP POLICY IF EXISTS "Users can view their own timeline events" ON public.timeline_events;
DROP POLICY IF EXISTS "Users can insert their own timeline events" ON public.timeline_events;
DROP POLICY IF EXISTS "Users can update their own timeline events" ON public.timeline_events;
DROP POLICY IF EXISTS "Users can delete their own timeline events" ON public.timeline_events;
DROP POLICY IF EXISTS "Lawyers can view timeline events for their assigned dossiers" ON public.timeline_events;

-- Créer des politiques sécurisées basées sur la propriété des submissions
CREATE POLICY "Users can view their own timeline events" 
ON public.timeline_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.submissions 
    WHERE submissions.id::text = timeline_events.submission_id 
    AND submissions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own timeline events" 
ON public.timeline_events 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.submissions 
    WHERE submissions.id::text = timeline_events.submission_id 
    AND submissions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own timeline events" 
ON public.timeline_events 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.submissions 
    WHERE submissions.id::text = timeline_events.submission_id 
    AND submissions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own timeline events" 
ON public.timeline_events 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.submissions 
    WHERE submissions.id::text = timeline_events.submission_id 
    AND submissions.user_id = auth.uid()
  )
);

CREATE POLICY "Lawyers can view timeline events for their assigned dossiers" 
ON public.timeline_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.submissions s
    JOIN public.dossiers d ON d.token = s.id::text
    WHERE s.id::text = timeline_events.submission_id 
    AND d.lawyer_id = auth.uid()
  )
);