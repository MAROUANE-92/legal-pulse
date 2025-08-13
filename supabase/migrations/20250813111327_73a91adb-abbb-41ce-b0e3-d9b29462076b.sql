-- Supprimer TOUTES les données d'heures supplémentaires existantes
DELETE FROM timeline_events 
WHERE event_type IN ('overtime_calculated', 'weekly_overtime');