-- Le problème est que les politiques RLS attendent form_id = auth.uid() 
-- mais on a une contrainte foreign key qui pointe vers forms
-- Il faut supprimer cette contrainte et ajuster la logique

-- Supprimer la contrainte foreign key problématique
ALTER TABLE public."Soumissions_formulaires_form_clients" 
DROP CONSTRAINT IF EXISTS "Soumissions_formulaires_form_clients_form_id_fkey";

-- La logique sera: form_id = ID de l'utilisateur (pas ID du formulaire)
-- Cela s'aligne avec les politiques RLS existantes