
import { useQuery } from "@tanstack/react-query";

export interface PieceWithValidation {
  id: string;
  nom: string;
  motif?: string;
  validated: boolean;
  required: boolean;
}

export function usePieces(dossierId: string) {
  return useQuery({
    queryKey: ["pieces", dossierId],
    queryFn: async () => {
      console.log('Fetching pieces for dossier:', dossierId);
      
      const mockPieces: PieceWithValidation[] = [
        { id: '1', nom: 'Contrat de travail', validated: true, required: true },
        { id: '2', nom: 'Bulletins de paie', validated: true, required: true },
        { id: '3', nom: 'Badge logs CSV', motif: 'heures_supp', validated: false, required: true },
        { id: '4', nom: 'Planning PDF', motif: 'heures_supp', validated: true, required: false },
        { id: '5', nom: 'Lettre licenciement', motif: 'licenciement', validated: true, required: true },
        { id: '6', nom: 'Attestations témoins', motif: 'harcelement', validated: false, required: true },
      ];
      
      return mockPieces;
    },
    enabled: !!dossierId
  });
}
