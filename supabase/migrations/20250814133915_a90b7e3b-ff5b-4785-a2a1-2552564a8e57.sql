-- Migration pour corriger la faille de sécurité sur la table answers
-- Problème: La table 'answers' est accessible publiquement

-- 1. Supprimer la politique dangereuse qui permet l'accès public
DROP POLICY IF EXISTS "Allow public access to answers" ON public.answers;

-- 2. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own answers" ON public.answers;
DROP POLICY IF EXISTS "Users can insert their own answers" ON public.answers;
DROP POLICY IF EXISTS "Users can update their own answers" ON public.answers;
DROP POLICY IF EXISTS "Lawyers can view answers for their assigned dossiers" ON public.answers;

-- 3. Créer les nouvelles politiques sécurisées
-- Les utilisateurs peuvent seulement voir leurs propres réponses
CREATE POLICY "Users can view their own answers" 
ON public.answers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.submissions 
    WHERE submissions.id::text = answers.submission_id 
    AND submissions.user_id = auth.uid()
  )
);

-- Les utilisateurs peuvent seulement insérer des réponses pour leurs propres submissions
CREATE POLICY "Users can insert their own answers" 
ON public.answers 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.submissions 
    WHERE submissions.id::text = answers.submission_id 
    AND submissions.user_id = auth.uid()
  )
);

-- Les utilisateurs peuvent seulement modifier leurs propres réponses
CREATE POLICY "Users can update their own answers" 
ON public.answers 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.submissions 
    WHERE submissions.id::text = answers.submission_id 
    AND submissions.user_id = auth.uid()
  )
);

-- Les avocats peuvent voir les réponses des dossiers qui leur sont assignés
CREATE POLICY "Lawyers can view answers for their assigned dossiers" 
ON public.answers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.submissions s
    JOIN public.dossiers d ON d.token = s.id::text
    WHERE s.id::text = answers.submission_id 
    AND d.lawyer_id = auth.uid()
  )
);