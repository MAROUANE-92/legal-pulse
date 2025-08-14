-- Migration pour corriger la faille de sécurité sur la table timeline_events
-- Problème: La table 'timeline_events' est accessible publiquement, exposant les données sensibles de travail

-- 1. Supprimer la politique dangereuse qui permet l'accès public
DROP POLICY IF EXISTS "Allow public access to timeline_events" ON public.timeline_events;

-- 2. Créer des politiques sécurisées basées sur la propriété des submissions
-- Les utilisateurs peuvent seulement voir leurs propres événements de timeline
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

-- Les utilisateurs peuvent seulement insérer des événements pour leurs propres submissions
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

-- Les utilisateurs peuvent seulement modifier leurs propres événements
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

-- Les utilisateurs peuvent supprimer leurs propres événements
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

-- Les avocats peuvent voir les événements des dossiers qui leur sont assignés
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

-- Commentaire: Cette migration sécurise l'accès aux données de travail sensibles
-- en s'assurant que seuls les propriétaires et leurs avocats assignés peuvent y accéder