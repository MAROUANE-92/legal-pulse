-- Créer les politiques RLS pour le bucket public-uploads
CREATE POLICY "Allow public uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'public-uploads');

CREATE POLICY "Allow public read" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'public-uploads');

CREATE POLICY "Allow public delete" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'public-uploads');

-- Activer RLS sur storage.objects si pas déjà fait
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;