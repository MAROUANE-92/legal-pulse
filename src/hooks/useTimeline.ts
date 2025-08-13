import { useState, useEffect } from 'react';

// Types pour le hook
interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  daysFromNow: number;
  type: string;
  date: string;
}

export function useTimeline(dossierId: string) {
  const [data, setData] = useState<TimelineEvent[]>([]);
  
  useEffect(() => {
    const fetchTimeline = async () => {
      return [];
    };
    
    fetchTimeline().then(setData);
  }, [dossierId]);

  return { data, isLoading: false };
}