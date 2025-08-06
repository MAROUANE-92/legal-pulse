import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireAnswer } from "@/types/questionnaire";

export function useQuestionnaire(dossierId: string) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["questionnaire", dossierId],
    queryFn: async () => {
      console.log('Fetching questionnaire answers for dossier:', dossierId);
      
      const { data, error } = await supabase
        .from('Soumissions_formulaires_form_clients')
        .select('*')
        .eq('form_id', dossierId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching questionnaire:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!dossierId
  });

  const saveAnswers = useMutation({
    mutationFn: async ({ step, answers }: { step: string; answers: any }) => {
      console.log('Saving questionnaire answers:', { step, answers });
      
      const { data: existingAnswers } = await supabase
        .from('answers')
        .select('*')
        .eq('submission_id', dossierId);
      
      // Save each answer individually
      for (const [questionId, value] of Object.entries(answers)) {
        const { error } = await supabase
          .from('answers')
          .upsert({
            submission_id: dossierId,
            question_slug: `${step}_${questionId}`,
            value: value as any
          });
          
        if (error) throw error;
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaire", dossierId] });
    }
  });

  const createSubmission = useMutation({
    mutationFn: async (formData: any) => {
      console.log('Creating questionnaire submission:', formData);
      
      const { data, error } = await supabase
        .from('Soumissions_formulaires_form_clients')
        .insert({
          form_id: dossierId,
          status: 'in_progress'
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaire", dossierId] });
    }
  });

  return { 
    questionnaire: query.data, 
    saveAnswers, 
    createSubmission,
    isLoading: query.isLoading 
  };
}