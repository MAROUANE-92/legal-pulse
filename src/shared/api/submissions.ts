import { supabase } from "@/integrations/supabase/client";
import { Submission, Answer, ApiResponse } from "../types";

export class SubmissionsAPI {
  static async getSubmissionByToken(token: string): Promise<ApiResponse<Submission>> {
    try {
      // Récupérer les réponses pour ce token
      const { data: answers, error } = await supabase
        .from('answers')
        .select('*')
        .eq('submission_id', token)
        .order('created_at', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      // Si pas de réponses, créer une nouvelle submission
      if (!answers || answers.length === 0) {
        const newSubmission: Submission = {
          id: token,
          token,
          currentStep: 0,
          totalSteps: 11,
          completed: false,
          answers: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return { data: newSubmission, error: null };
      }

      // Transformer les réponses en submission
      const answersMap: Record<string, any> = {};
      answers.forEach(answer => {
        answersMap[answer.question_slug] = answer.answer;
      });

      // Calculer le step actuel basé sur les réponses
      const currentStep = this.calculateCurrentStep(answersMap);
      
      const submission: Submission = {
        id: token,
        token,
        currentStep,
        totalSteps: 11,
        completed: currentStep >= 11,
        answers: answersMap,
        createdAt: answers[0].created_at,
        updatedAt: answers[answers.length - 1].created_at
      };

      return { data: submission, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  static async saveAnswer(token: string, questionSlug: string, value: any): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('answers')
        .upsert({
          submission_id: token,
          question_slug: questionSlug,
          answer: value
        }, {
          onConflict: 'submission_id,question_slug'
        });

      if (error) {
        return { data: false, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: false, error: (error as Error).message };
    }
  }

  static async saveMultipleAnswers(token: string, answers: Record<string, any>): Promise<ApiResponse<boolean>> {
    try {
      const answersArray = Object.entries(answers).map(([questionSlug, value]) => ({
        submission_id: token,
        question_slug: questionSlug,
        answer: value
      }));

      const { error } = await supabase
        .from('answers')
        .upsert(answersArray, {
          onConflict: 'submission_id,question_slug'
        });

      if (error) {
        return { data: false, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: false, error: (error as Error).message };
    }
  }

  private static calculateCurrentStep(answers: Record<string, any>): number {
    const stepQuestions = [
      ['identity'], // Step 0
      ['contract'], // Step 1  
      ['remuneration'], // Step 2
      ['working_time'], // Step 3
      ['motifs'], // Step 4
      ['questions'], // Step 5
      ['upload'], // Step 6
      ['chronologie'], // Step 7
      ['signature'], // Step 8
      ['confirm'] // Step 9
    ];

    for (let i = 0; i < stepQuestions.length; i++) {
      const hasAnswers = stepQuestions[i].some(prefix => 
        Object.keys(answers).some(key => key.startsWith(prefix))
      );
      if (!hasAnswers) {
        return i;
      }
    }

    return stepQuestions.length; // Toutes les étapes complétées
  }
}