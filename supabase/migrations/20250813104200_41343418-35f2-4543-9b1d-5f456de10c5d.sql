-- Supprimer les politiques existantes qui sont trop restrictives
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;

-- Créer des politiques permissives pour le bucket public-uploads
CREATE POLICY "Allow anonymous uploads to public-uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'public-uploads');

CREATE POLICY "Allow anonymous read from public-uploads" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'public-uploads');

CREATE POLICY "Allow anonymous delete from public-uploads" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'public-uploads');