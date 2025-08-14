import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DossierProgress {
  completedSteps: number;
  totalSteps: number;
  calculatedAmount: number;
  hasClientData: boolean;
}

export function useDossierProgress(dossierId: string) {
  return useQuery({
    queryKey: ['dossier-progress', dossierId],
    queryFn: async (): Promise<DossierProgress> => {
      if (!dossierId) {
        return { completedSteps: 0, totalSteps: 11, calculatedAmount: 0, hasClientData: false };
      }

      // Récupérer les réponses pour ce dossier
      const { data: answers, error } = await supabase
        .from('answers')
        .select('*')
        .ilike('submission_id', `%${dossierId}%`);

      if (error) throw error;

      if (!answers || answers.length === 0) {
        return { completedSteps: 0, totalSteps: 11, calculatedAmount: 0, hasClientData: false };
      }

      // Analyser les étapes complétées basées sur les question_slug
      const stepSections = new Set();
      const answersData: Record<string, any> = {};

      answers.forEach(answer => {
        const parts = answer.question_slug.split('.');
        if (parts.length >= 2) {
          const [section, field] = parts;
          stepSections.add(section);
          if (!answersData[section]) answersData[section] = {};
          answersData[section][field] = answer.answer;
        }
      });

      // Définir les étapes attendues
      const expectedSteps = [
        'identity', 'contract', 'remuneration', 'working_time', 
        'motifs', 'questions', 'upload', 'chronologie', 
        'signature', 'confirm'
      ];

      const completedSteps = expectedSteps.filter(step => stepSections.has(step)).length;

      // Calculer le montant réclamé basé sur les motifs sélectionnés
      const selectedMotifs = answersData.motifs?.motifs_selected || [];
      const baseSalary = parseFloat(answersData.remuneration?.base_salary) || 3500;
      const calculatedAmount = calculateTotalClaim(selectedMotifs, baseSalary);

      return {
        completedSteps,
        totalSteps: expectedSteps.length,
        calculatedAmount,
        hasClientData: true
      };
    },
    enabled: !!dossierId,
  });
}

function calculateTotalClaim(motifs: string[], baseSalary: number): number {
  let total = 0;
  
  motifs.forEach((motif: string) => {
    switch (motif) {
      case 'heures_supplementaires':
        total += Math.round(baseSalary * 0.3);
        break;
      case 'licenciement_abusif':
        total += Math.round(baseSalary * 4);
        break;
      case 'conges_payes':
        total += Math.round(baseSalary * 0.15);
        break;
      case 'indemnite_preavis':
        total += Math.round(baseSalary * 2);
        break;
      case 'prime_precarite':
        total += Math.round(baseSalary * 0.1);
        break;
      case 'rappel_salaire':
        total += Math.round(baseSalary * 0.25);
        break;
      default:
        total += Math.round(baseSalary * 0.2);
        break;
    }
  });
  
  return total;
}