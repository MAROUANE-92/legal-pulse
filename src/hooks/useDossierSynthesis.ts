import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDossierSynthesis(dossierId: string) {
  return useQuery({
    queryKey: ['dossier-synthesis', dossierId],
    queryFn: async () => {
      if (!dossierId) return null;

      // Récupérer les données de base du dossier
      const { data: dossier, error: dossierError } = await supabase
        .from('dossiers')
        .select('*')
        .eq('id', dossierId)
        .maybeSingle();

      if (dossierError) throw dossierError;
      if (!dossier) return null;

      // Récupérer les réponses du client pour ce dossier
      const { data: answers, error: answersError } = await supabase
        .from('answers')
        .select('*')
        .ilike('submission_id', `%${dossierId}%`);

      if (answersError) throw answersError;

      // Transformer les réponses en objet structuré
      const clientData = (answers || []).reduce((acc, answer) => {
        const parts = answer.question_slug.split('.');
        if (parts.length >= 2) {
          const [section, field] = parts;
          if (!acc[section]) acc[section] = {};
          acc[section][field] = answer.answer;
        }
        return acc;
      }, {} as Record<string, any>);

      // Extraire les motifs sélectionnés
      const selectedMotifs = clientData.motifs?.motifs_selected || [];

      // Construire la synthèse
      return {
        dossier,
        clientData,
        identity: {
          fullName: clientData.identity?.full_name || dossier.client_name,
          email: clientData.identity?.email_personal || dossier.client_email,
          birthDate: clientData.identity?.birth_date,
          address: clientData.identity?.address,
        },
        contract: {
          type: clientData.contract?.contract_type || 'CDI',
          startDate: clientData.contract?.contract_start,
          endDate: clientData.contract?.contract_end,
          positionTitle: clientData.contract?.position_title,
          employerName: clientData.contract?.employer_name,
          employerSiren: clientData.contract?.employer_siren,
        },
        remuneration: {
          baseSalary: clientData.remuneration?.base_salary,
          salaryType: clientData.remuneration?.salary_type,
          variableComp: clientData.remuneration?.variable_comp,
          benefits: clientData.remuneration?.benefits,
        },
        workingTime: {
          workingHours: clientData.working_time?.working_hours,
          weeklyHours: clientData.working_time?.weekly_hours,
          scheduleType: clientData.working_time?.schedule_type,
          breaks: clientData.working_time?.breaks,
        },
        motifs: selectedMotifs,
        // Calculer les montants basés sur les motifs sélectionnés
        totalClaim: calculateTotalClaim(selectedMotifs, clientData),
        status: dossier.status,
      };
    },
    enabled: !!dossierId,
  });
}

function calculateTotalClaim(motifs: string[], clientData: any): number {
  // Logique de calcul basée sur les motifs sélectionnés
  // Pour l'instant retourne 0, à développer selon la logique métier
  return 0;
}