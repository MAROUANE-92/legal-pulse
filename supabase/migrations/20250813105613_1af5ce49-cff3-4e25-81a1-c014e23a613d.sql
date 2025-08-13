-- Supprimer toutes les données des tables
DELETE FROM public.timeline_events;
DELETE FROM public.answers;
DELETE FROM public.submissions;
DELETE FROM public.invites;
DELETE FROM public."Soumissions_formulaires_form_clients";

-- Supprimer tous les fichiers du storage (via requête)
DELETE FROM storage.objects WHERE bucket_id IN ('public-uploads', 'raw-files', 'badge.csv');