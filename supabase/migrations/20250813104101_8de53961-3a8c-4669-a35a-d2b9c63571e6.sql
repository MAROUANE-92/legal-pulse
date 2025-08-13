-- Activer RLS sur les tables publiques
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS pour la table answers
CREATE POLICY "Allow public access to answers"
ON public.answers
FOR ALL
USING (true);

-- Créer des politiques RLS pour la table timeline_events  
CREATE POLICY "Allow public access to timeline_events"
ON public.timeline_events
FOR ALL
USING (true);

-- Créer le bucket public-uploads s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-uploads', 'public-uploads', true)
ON CONFLICT (id) DO NOTHING;