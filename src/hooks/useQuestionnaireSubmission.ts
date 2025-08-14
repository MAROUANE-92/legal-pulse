import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QuestionnaireAnswer {
  answer: any;
  metadata: {
    step: string;
    original_key: string;
  };
  question_slug: string;
}

interface QuestionnaireSubmission {
  id: string;
  dossier_id: string;
  answers: any[];
  status: string;
  submitted_at: string;
}

export function useQuestionnaireSubmission(dossierId: string) {
  const query = useQuery({
    queryKey: ["questionnaire-submission", dossierId],
    queryFn: async () => {
      console.log('Fetching questionnaire submission for dossier:', dossierId);
      
      // Récupérer les données directement depuis questionnaire_submissions
      const { data: submission, error } = await supabase
        .from('questionnaire_submissions')
        .select('*')
        .eq('dossier_id', dossierId)
        .single();
      
      if (error) {
        console.error('Error fetching questionnaire submission:', error);
        return null;
      }
      
      // S'il n'y a pas de soumission, le questionnaire n'est pas complété
      if (!submission) {
        return null;
      }
      
      console.log('Questionnaire submission data:', submission);
      return {
        id: submission.submission_id,
        dossier_id: dossierId,
        answers: submission.answers || [],
        status: submission.status || 'completed',
        submitted_at: submission.submitted_at || new Date().toISOString()
      } as QuestionnaireSubmission;
    },
    enabled: !!dossierId
  });

  // Fonction utilitaire pour organiser les réponses par catégorie
  const organizeAnswersByCategory = (answers: any[]) => {
    const organized: Record<string, Record<string, any>> = {};
    
    answers?.forEach(answer => {
      // Extraire la catégorie et la clé du question_slug
      const parts = answer.question_slug?.split('.');
      if (parts && parts.length >= 2) {
        const step = parts[0];
        const original_key = parts.slice(1).join('.');
        
        if (!organized[step]) {
          organized[step] = {};
        }
        
        organized[step][original_key] = answer.answer;
      }
    });
    
    return organized;
  };

  return {
    submission: query.data,
    isLoading: query.isLoading,
    error: query.error,
    organizeAnswersByCategory: query.data ? organizeAnswersByCategory(query.data.answers) : {}
  };
}