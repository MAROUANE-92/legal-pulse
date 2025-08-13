import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OvertimeResult {
  id: string;
  title: string;
  description: string;
  event_date: string;
  metadata: any;
  importance: 'high' | 'medium' | 'low';
}

interface OvertimeSummary {
  totalHours: number;
  overtimeHours: number;
  compensationAmount: number;
  weeklyDetails: Array<{
    week: string;
    overtime_hours: number;
    compensation: number;
  }>;
}

export function useOvertimeResults() {
  const [results, setResults] = useState<OvertimeResult[]>([]);
  const [summary, setSummary] = useState<OvertimeSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching overtime results...');

      // Récupérer les événements de calcul d'heures sup
      const { data: events, error: eventsError } = await supabase
        .from('timeline_events')
        .select('*')
        .in('event_type', ['overtime_calculated', 'weekly_overtime'])
        .order('created_at', { ascending: false });

      console.log('Events fetched:', events);
      console.log('Events error:', eventsError);

      if (eventsError) throw eventsError;

      const overtimeResults: OvertimeResult[] = events?.map(event => ({
        id: event.id,
        title: event.title || 'Calcul heures supplémentaires',
        description: event.description || '',
        event_date: event.event_date,
        metadata: event.metadata || event.details || {},
        importance: (event.importance || 'medium') as 'high' | 'medium' | 'low'
      })) || [];

      console.log('Processed results:', overtimeResults);

      setResults(overtimeResults);

      // Calculer le résumé en prenant le dernier événement de type overtime_calculated
      const overtimeCalculated = overtimeResults.find(r => 
        events?.find(e => e.id === r.id)?.event_type === 'overtime_calculated'
      );

      console.log('Found overtime calculated:', overtimeCalculated);

      if (overtimeCalculated) {
        // Utiliser les données de 'metadata' (priorité) ou 'details' en fallback
        const details = overtimeCalculated.metadata || {};
        console.log('Details for summary:', details);
        
        const summary = {
          totalHours: details?.total_hours || 0,
          overtimeHours: details?.overtime_hours || 0,
          compensationAmount: details?.compensation_amount || details?.compensation || 0,
          weeklyDetails: details?.weekly_details || []
        };
        
        console.log('Setting summary:', summary);
        setSummary(summary);
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching overtime results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Force un rechargement immédiat
    setResults([]);
    setSummary(null);
    fetchResults();

    // Écouter les nouveaux événements en temps réel
    const channel = supabase
      .channel('overtime-results')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'timeline_events',
          filter: 'event_type=in.(overtime_calculated,weekly_overtime)'
        },
        () => {
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    results,
    summary,
    loading,
    error,
    refetch: fetchResults
  };
}