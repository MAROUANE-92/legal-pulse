-- Nettoyer les anciennes données de test d'heures supplémentaires
DELETE FROM timeline_events 
WHERE event_type IN ('overtime_calculated', 'weekly_overtime')
AND created_at < NOW() - INTERVAL '1 hour';