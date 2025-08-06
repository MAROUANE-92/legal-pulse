import { useMemo } from 'react';
import { QUESTIONNAIRE_SCHEMA, getVisibleSections, getVisibleQuestions, Section, Question } from '@/lib/questionnaire-schema';

export function useQuestionnaireSchema(answers: Record<string, any> = {}) {
  const visibleSections = useMemo(() => {
    return getVisibleSections(answers);
  }, [answers]);

  const getQuestionsForSection = (sectionId: string): Question[] => {
    const section = visibleSections.find(s => s.id === sectionId);
    if (!section) return [];
    
    return getVisibleQuestions(section, answers);
  };

  const getAllVisibleQuestions = (): Question[] => {
    return visibleSections.flatMap(section => 
      getVisibleQuestions(section, answers)
    );
  };

  const getSectionByStep = (step: string): Section | null => {
    // Map old step names to new section IDs
    const stepMapping: Record<string, string> = {
      'identity': 'identity',
      'motifs': 'claim_motifs',
      'questions': 'overtime_block', // This will be dynamic based on selected motifs
    };

    const sectionId = stepMapping[step] || step;
    return visibleSections.find(s => s.id === sectionId) || null;
  };

  const getConditionalSections = (): Section[] => {
    return visibleSections.filter(section => 
      section.id.includes('_block') && !section.always_shown
    );
  };

  return {
    sections: visibleSections,
    getQuestionsForSection,
    getAllVisibleQuestions,
    getSectionByStep,
    getConditionalSections,
    schema: QUESTIONNAIRE_SCHEMA
  };
}