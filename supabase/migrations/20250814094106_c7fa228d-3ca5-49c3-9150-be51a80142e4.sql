-- Ajouter une politique INSERT pour permettre aux avocats de créer des invitations
CREATE POLICY "Allow authenticated users to insert invites" 
ON public.invites 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Optionnel : Ajouter une politique UPDATE pour permettre de modifier le statut
CREATE POLICY "Allow authenticated users to update invites" 
ON public.invites 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);