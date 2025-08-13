
import { useMemo } from 'react';
// Mock data supprimé

interface WeeklyData {
  isoWeek: number;
  weekStart: string;
  delta: number;
  proofs: number;
  hasProofs: boolean;
}

export function useOvertimeTrim() {
  return useMemo(() => {
    // Données vides - mock supprimé
    return {
      rows: [],
      totalDelta: 0,
      avgWeeklyDelta: 0,
      estimatedCompensation: 0,
      weekly: []
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
