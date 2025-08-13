-- Supprimer la fonction avec CASCADE pour éliminer tous les triggers dépendants
DROP FUNCTION IF EXISTS public.notify_file_upload() CASCADE;
DROP FUNCTION IF EXISTS public.handle_storage_upload() CASCADE;