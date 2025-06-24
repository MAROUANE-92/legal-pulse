
import { useMemo } from 'react';
import { overtimeTrim } from '@/lib/mockOvertimeTrim';

interface WeeklyData {
  isoWeek: number;
  weekStart: string;
  delta: number;
  proofs: number;
  hasProofs: boolean;
}

export function useOvertimeTrim() {
  return useMemo(() => {
    const rows = overtimeTrim.rows;
    const totalDelta = rows.reduce((sum, row) => sum + row.delta, 0);
    
    // Group by ISO week
    const weeklyMap = new Map<number, { delta: number; proofs: number; dates: string[] }>();
    
    rows.forEach(row => {
      const date = new Date(row.date);
      const isoWeek = getISOWeek(date);
      
      if (!weeklyMap.has(isoWeek)) {
        weeklyMap.set(isoWeek, { delta: 0, proofs: 0, dates: [] });
      }
      
      const week = weeklyMap.get(isoWeek)!;
      week.delta += row.delta;
      week.proofs += row.sources.length;
      week.dates.push(row.date);
    });
    
    // Convert to array and sort
    const weekly: WeeklyData[] = Array.from(weeklyMap.entries())
      .map(([isoWeek, data]) => ({
        isoWeek,
        weekStart: getWeekStart(isoWeek, 2025),
        delta: Math.round(data.delta * 100) / 100,
        proofs: data.proofs,
        hasProofs: data.proofs >= 3 // Minimum 3 preuves par semaine
      }))
      .sort((a, b) => a.isoWeek - b.isoWeek);
    
    const avgWeeklyDelta = totalDelta / weekly.length;
    const estimatedCompensation = totalDelta * 25; // 25€/heure
    
    return {
      rows,
      totalDelta: Math.round(totalDelta * 100) / 100,
      avgWeeklyDelta: Math.round(avgWeeklyDelta * 100) / 100,
      estimatedCompensation: Math.round(estimatedCompensation),
      weekly
    };
  }, []);
}

// Helper functions
function getISOWeek(date: Date): number {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function getWeekStart(isoWeek: number, year: number): string {
  const jan4 = new Date(year, 0, 4);
  const weekStart = new Date(jan4.getTime() + (isoWeek - 1) * 7 * 86400000);
  weekStart.setDate(weekStart.getDate() - ((jan4.getDay() + 6) % 7));
  return weekStart.toISOString().split('T')[0];
}
