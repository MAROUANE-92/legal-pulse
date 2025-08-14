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
      
      // Récupérer le token du dossier
      const { data: dossier } = await supabase
        .from('dossiers')
        .select('token')
        .eq('id', dossierId)
        .single();
      
      if (!dossier?.token) {
        return null;
      }
      
      // Récupérer les réponses via la table answers en utilisant le token du dossier
      const { data: answers, error } = await supabase
        .from('answers')
        .select('*')
        .eq('submission_id', dossier.token);
      
      if (error) {
        console.error('Error fetching questionnaire answers:', error);
        throw error;
      }
      
      // S'il n'y a pas de réponses, le questionnaire n'est pas complété
      if (!answers || answers.length === 0) {
        return null;
      }
      
      console.log('Questionnaire answers data:', answers);
      return {
        id: dossier.token,
        dossier_id: dossierId,
        answers: answers || [],
        status: 'completed',
        submitted_at: answers?.[0]?.created_at || new Date().toISOString()
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