-- Activer l'extension pg_net pour les triggers storage
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Ajouter la colonne uploaded_file_url à la table answers si elle n'existe pas
ALTER TABLE public.answers 
ADD COLUMN IF NOT EXISTS uploaded_file_url TEXT;

-- Mettre à jour les triggers de storage pour utiliser la bonne Edge Function
DROP TRIGGER IF EXISTS handle_file_upload ON storage.objects;

CREATE OR REPLACE FUNCTION public.notify_file_upload()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  -- Construire le payload pour l'Edge Function
  payload := jsonb_build_object(
    'name', NEW.name,
    'size', (NEW.metadata->>'size')::bigint,
    'metadata', NEW.metadata,
    'publicUrl', 'https://iuirndoarleaufakdzsa.supabase.co/storage/v1/object/public/' || NEW.bucket_id || '/' || NEW.name,
    'signedUrlToken', ''
  );
  
  -- Log pour debug
  RAISE LOG 'Triggering Edge Function for file: %', NEW.name;
  
  -- Appeler l'Edge Function via pg_net
  PERFORM net.http_post(
    'https://iuirndoarleaufakdzsa.supabase.co/functions/v1/on-file-upload',
    jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1aXJuZG9hcmxlYXVmYWtkenNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzgxMzgsImV4cCI6MjA3MDA1NDEzOH0.PSd5FHpcMSGCsDYAkJjEqn7j39Q2JcZZ1SOPmj197Q0'
    ),
    payload::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger sur les uploads vers public-uploads
CREATE TRIGGER handle_file_upload
AFTER INSERT ON storage.objects
FOR EACH ROW
WHEN (NEW.bucket_id = 'public-uploads')
EXECUTE FUNCTION public.notify_file_upload();