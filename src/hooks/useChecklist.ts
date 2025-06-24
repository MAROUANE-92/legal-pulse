
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ChecklistItem {
  id: string;
  dossierId: string;
  label: string;
  required: boolean;
  satisfied: boolean;
  generatedBy?: string;
  createdAt: string;
}

export function useChecklist(dossierId: string) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["checklist", dossierId],
    queryFn: async () => {
      // Stub API call - in real app would fetch from Supabase
      console.log('Fetching checklist for dossier:', dossierId);
      
      // Mock data based on common motifs
      const mockChecklist: ChecklistItem[] = [
        {
          id: '1',
          dossierId,
          label: 'Contrat de travail',
          required: true,
          satisfied: false,
          generatedBy: 'general',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          dossierId,
          label: 'Bulletins de paie',
          required: true,
          satisfied: false,
          generatedBy: 'heures_supp',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          dossierId,
          label: 'Badge logs CSV',
          required: true,
          satisfied: false,
          generatedBy: 'heures_supp',
          createdAt: new Date().toISOString()
        }
      ];
      
      return mockChecklist;
    },
    enabled: !!dossierId
  });

  const setSatisfied = useMutation({
    mutationFn: async (itemId: string) => {
      console.log('Setting checklist item as satisfied:', itemId);
      // Stub API call
      return fetch(`/api/checklist/${itemId}/satisfy`, { 
        method: "PATCH" 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist", dossierId] });
    }
  });

  const generateFromMotifs = useMutation({
    mutationFn: async ({ motifs }: { motifs: string[] }) => {
      console.log('Generating checklist from motifs:', motifs);
      
      // Mock generation logic
      const motifToItems: Record<string, string[]> = {
        "heures_supp": [
          "Badge logs CSV",
          "Emails >20h (PST)", 
          "Planning PDF"
        ],
        "licenciement": [
          "Lettre de licenciement",
          "Accusé réception LRAR"
        ],
        "harcelement": [
          "Captures WhatsApp/Teams",
          "Plainte interne RH"
        ],
        "conges_impayes": [
          "Demandes de congés",
          "Refus employeur"
        ],
        "discrimination": [
          "Témoignages",
          "Preuves discrimination"
        ],
        "accident": [
          "Déclaration accident",
          "Certificat médical"
        ]
      };

      const newItems = motifs.flatMap(motif => 
        (motifToItems[motif] || []).map(label => ({
          id: Math.random().toString(36).substr(2, 9),
          dossierId,
          label,
          required: true,
          satisfied: false,
          generatedBy: motif,
          createdAt: new Date().toISOString()
        }))
      );

      // Add general required items
      newItems.unshift({
        id: Math.random().toString(36).substr(2, 9),
        dossierId,
        label: 'Contrat de travail',
        required: true,
        satisfied: false,
        generatedBy: 'general',
        createdAt: new Date().toISOString()
      });

      return newItems;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist", dossierId] });
    }
  });

  return { 
    checklist: query.data ?? [], 
    setSatisfied, 
    generateFromMotifs,
    isLoading: query.isLoading 
  };
}
