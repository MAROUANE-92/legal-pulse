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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les événements de calcul d'heures sup
      const { data: events, error: eventsError } = await supabase
        .from('timeline_events')
        .select('*')
        .in('event_type', ['overtime_calculated', 'weekly_overtime'])
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      const overtimeResults: OvertimeResult[] = events?.map(event => ({
        id: event.id,
        title: event.title || 'Calcul heures supplémentaires',
        description: (event.details as any)?.description || '',
        event_date: event.event_date,
        metadata: (event.details as any) || {},
        importance: ((event.details as any)?.importance || 'medium') as 'high' | 'medium' | 'low'
      })) || [];

      setResults(overtimeResults);

      // Calculer le résumé
      if (overtimeResults.length > 0) {
        const latestResult = overtimeResults[0];
        const metadata = latestResult.metadata;
        
        setSummary({
          totalHours: metadata?.total_hours || 0,
          overtimeHours: metadata?.overtime_hours || 0,
          compensationAmount: metadata?.compensation_amount || 0,
          weeklyDetails: metadata?.weekly_details || []
        });
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching overtime results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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