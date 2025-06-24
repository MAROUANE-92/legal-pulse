
import { useQuery } from "@tanstack/react-query";
import { mockTimeline } from "@/lib/mockTimeline";

export function useTimeline(dossierId: string) {
  return useQuery({
    queryKey: ["timeline", dossierId],
    queryFn: async () => {
      console.log('Fetching timeline for dossier:', dossierId);
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockTimeline;
    },
    enabled: !!dossierId
  });
}
