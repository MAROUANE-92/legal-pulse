import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useClientDocuments(dossierId: string) {
  return useQuery({
    queryKey: ["client-documents", dossierId],
    queryFn: async () => {
      console.log('Fetching client documents for dossier:', dossierId);
      
      const { data: submission, error } = await supabase
        .from('questionnaire_submissions')
        .select('answers')
        .eq('dossier_id', dossierId)
        .single();

      if (error) {
        console.error('Error fetching questionnaire submission:', error);
        return { files: {}, bordereau: [] };
      }

      if (!submission?.answers) {
        return { files: {}, bordereau: [] };
      }

      // Extraire les fichiers de l'étape documents
      const answersArray = Array.isArray(submission.answers) ? submission.answers : [];
      
      const documentsAnswer = answersArray
        .find((a: any) => a.question_slug === 'documents.files');
      const clientFiles = documentsAnswer && typeof documentsAnswer === 'object' && 'answer' in documentsAnswer 
        ? documentsAnswer.answer || {} 
        : {};

      const bordereauAnswer = answersArray
        .find((a: any) => a.question_slug === 'documents.bordereau');
      const clientBordereau = bordereauAnswer && typeof bordereauAnswer === 'object' && 'answer' in bordereauAnswer 
        ? bordereauAnswer.answer || [] 
        : [];

      return {
        files: clientFiles,
        bordereau: clientBordereau
      };
    },
    enabled: !!dossierId
  });
}