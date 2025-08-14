-- Créer une vraie table dossiers pour stocker les dossiers créés par les avocats
CREATE TABLE public.dossiers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lawyer_id uuid REFERENCES auth.users(id) NOT NULL,
  client_email text NOT NULL,
  client_name text,
  description text,
  token text NOT NULL UNIQUE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour la table dossiers
CREATE POLICY "Lawyers can view their own dossiers" 
ON public.dossiers 
FOR SELECT 
USING (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can create dossiers" 
ON public.dossiers 
FOR INSERT 
WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can update their own dossiers" 
ON public.dossiers 
FOR UPDATE 
USING (auth.uid() = lawyer_id);

-- Trigger pour updated_at
CREATE TRIGGER update_dossiers_updated_at
BEFORE UPDATE ON public.dossiers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Modifier la table invites pour avoir un lien avec les dossiers
ALTER TABLE public.invites ADD COLUMN dossier_id uuid REFERENCES public.dossiers(id);

-- Ajouter une politique pour que les avocats puissent créer des invitations pour leurs dossiers
DROP POLICY IF EXISTS "Allow authenticated users to insert invites" ON public.invites;
CREATE POLICY "Lawyers can create invites for their dossiers" 
ON public.invites 
FOR INSERT 
WITH CHECK (
  dossier_id IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.dossiers 
    WHERE id = dossier_id AND lawyer_id = auth.uid()
  )
);