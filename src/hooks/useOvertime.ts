
import { useQuery } from "@tanstack/react-query";
import { computeOvertime } from "@/lib/overtimeEngine";

export function useOvertime(dossierId: string, hasOvertimeMotif: boolean) {
  return useQuery({
    queryKey: ["overtime", dossierId],
    queryFn: async () => {
      if (!hasOvertimeMotif) return null;
      console.log('Computing overtime for dossier:', dossierId);
      return computeOvertime();
    },
    enabled: !!dossierId && hasOvertimeMotif
  });
}
