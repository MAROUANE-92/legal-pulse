
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOTIF_QUESTIONS, GLOBAL_QUESTIONS } from "@/lib/questions.config";

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
      console.log('Fetching checklist for dossier:', dossierId);
      
      // Mock data - in real app would fetch from Supabase
      const mockChecklist: ChecklistItem[] = [
        {
          id: '1',
          dossierId,
          label: 'Contrat de travail',
          required: true,
          satisfied: false,
          generatedBy: 'general',
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
    mutationFn: async ({ motifs, answers, identityData }: { 
      motifs: string[]; 
      answers?: any; 
      identityData?: any;
    }) => {
      console.log('Generating checklist from motifs, answers, and identity:', { motifs, answers, identityData });
      
      // Enhanced generation logic with answers-based triggering
      const neededPieces = new Map<string, boolean>(); // label => required
      
      // Add general items
      neededPieces.set('Contrat de travail', true);
      neededPieces.set('Bulletins de paie', true);
      
      // Process motif-specific questions
      motifs.forEach(motifKey => {
        const block = MOTIF_QUESTIONS.find(b => b.motifKey === motifKey);
        if (!block) return;
        
        block.questions.forEach(q => {
          if (!q.triggerPieces) return;
          
          const value = answers?.[q.id];
          const visible = !q.dependsOn || answers?.[q.dependsOn.questionId] === q.dependsOn.value;
          
          if (!visible) return;
          
          // Trigger pieces if answer is meaningful
          const shouldTrigger = value && value !== "Non" && value !== 0 && 
            (Array.isArray(value) ? value.length > 0 : true);
          
          if (shouldTrigger) {
            q.triggerPieces.forEach(piece => {
              neededPieces.set(piece.label, piece.required !== false);
            });
          }
        });
      });

      // Process global questions (like E1_channels)
      GLOBAL_QUESTIONS.forEach(q => {
        const value = answers?.[q.id];
        if (!value || !Array.isArray(value)) return;
        
        if (q.piecesMap) {
          value.forEach(selectedOption => {
            const pieceLabel = q.piecesMap![selectedOption];
            if (pieceLabel) {
              neededPieces.set(pieceLabel, true);
            }
          });
        }
      });

      // Add Badge logs CSV if not forfait_jours regime
      if (identityData?.workingRegime && identityData.workingRegime !== 'forfait_jours') {
        neededPieces.set('Badge logs CSV', true);
      }

      const newItems: ChecklistItem[] = Array.from(neededPieces.entries()).map(([label, required]) => ({
        id: Math.random().toString(36).substr(2, 9),
        dossierId,
        label,
        required,
        satisfied: false,
        generatedBy: 'auto',
        createdAt: new Date().toISOString()
      }));

      console.log('Generated checklist items:', newItems);
      return newItems;
    },
    onSuccess: (newItems) => {
      // Update the query cache with new items
      queryClient.setQueryData(["checklist", dossierId], newItems);
    }
  });

  return { 
    checklist: query.data ?? [], 
    setSatisfied, 
    generateFromMotifs,
    isLoading: query.isLoading 
  };
}
