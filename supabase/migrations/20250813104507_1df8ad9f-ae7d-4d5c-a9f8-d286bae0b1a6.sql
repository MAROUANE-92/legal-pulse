-- Supprimer le trigger problématique temporairement
DROP TRIGGER IF EXISTS handle_file_upload ON storage.objects;

-- Supprimer aussi l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS on_storage_upload ON storage.objects;

-- Supprimer les fonctions de trigger obsolètes
DROP FUNCTION IF EXISTS public.notify_file_upload();
DROP FUNCTION IF EXISTS public.handle_storage_upload();