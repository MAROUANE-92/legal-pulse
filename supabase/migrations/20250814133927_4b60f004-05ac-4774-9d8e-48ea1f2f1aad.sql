-- Activer RLS sur timeline_events_backup pour corriger l'erreur de sécurité
ALTER TABLE public.timeline_events_backup ENABLE ROW LEVEL SECURITY;

-- Ajouter des politiques sécurisées pour timeline_events_backup
CREATE POLICY "Users can view their own backup timeline events" 
ON public.timeline_events_backup 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.submissions 
    WHERE submissions.id = timeline_events_backup.submission_id 
    AND submissions.user_id = auth.uid()
  )
);