import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepperContextData } from '@/types/questionnaire';
import { supabase } from '@/integrations/supabase/client';

const StepperContext = createContext<StepperContextData | null>(null);

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within a StepperProvider');
  }
  return context;
};

interface NewStepperProviderProps {
  children: React.ReactNode;
  token: string;
}

const NEW_STEPS = [
  'urgency',
  'story', 
  'company',
  'qualification',
  'contract',
  'proof_inventory',
  'documents',
  'timeline',
  'damages',
  'summary'
];

// Navigation conditionnelle selon les réponses
const getNextStep = (current: string, answers: any): string => {
  const currentIndex = NEW_STEPS.indexOf(current);
  
  // Navigation conditionnelle basée sur les réponses
  switch (current) {
    case 'urgency':
      // Si situation critique, aller directement vers story
      return 'story';
      
    case 'story':
      return 'company';
      
    case 'company':
      return 'qualification';
      
    case 'qualification':
      return 'contract';
      
    case 'contract':
      return 'proof_inventory';
      
    case 'proof_inventory':
      return 'documents';
      
    case 'documents':
      return 'timeline';
      
    case 'timeline':
      return 'damages';
      
    case 'damages':
      return 'summary';
      
    default:
      // Navigation linéaire par défaut
      if (currentIndex < NEW_STEPS.length - 1) {
        return NEW_STEPS[currentIndex + 1];
      }
      return current;
  }
};

export function NewStepperProvider({ children, token }: NewStepperProviderProps) {
  const navigate = useNavigate();
  const { '*': path } = useParams();
  const currentStep = path?.split('/').pop() || 'urgency';
  
  const [formData, setFormData] = useState<StepperContextData['formData']>({});

  const goTo = (step: string) => {
    navigate(`/client/${token}/${step}`);
  };

  const savePartial = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
    
    // Auto-save to localStorage for persistence
    const saved = JSON.parse(localStorage.getItem(`questionnaire_${token}`) || '{}');
    saved[step] = { ...saved[step], ...data };
    localStorage.setItem(`questionnaire_${token}`, JSON.stringify(saved));
  };

  const isStepValid = (step: string): boolean => {
    const data = formData[step as keyof typeof formData];
    if (!data) return false;

    // Validation spécifique pour chaque étape
    switch (step) {
      case 'urgency':
        return !!(data.facts_end_date && data.employment_status);
      case 'story':
        return !!(data.narrative && data.main_problem && data.problem_start_date);
      case 'company':
        return !!(data.name && data.size);
      case 'contract':
        return !!(data.type && data.start_date && data.position && data.salary);
      case 'timeline':
        return Array.isArray(data) && data.length >= 5;
      default:
        return true;
    }
  };

  const submitQuestionnaire = async (): Promise<boolean> => {
    try {
      // Récupérer dossier_id depuis le token ou localStorage
      const dossierId = localStorage.getItem(`dossier_id_${token}`);
      if (!dossierId) {
        console.error('No dossier ID found for token:', token);
        return false;
      }

      // Transformer formData en format answers
      const answers: any[] = [];
      Object.entries(formData).forEach(([step, data]) => {
        if (data && typeof data === 'object') {
          Object.entries(data).forEach(([key, value]) => {
            answers.push({
              question_slug: `${step}.${key}`,
              answer: value,
              metadata: { step, original_key: key }
            });
          });
        }
      });

      // Créer un submission_id unique
      const submissionId = `auto-${Date.now()}-${Math.random().toString(36).substring(2)}`;

      // Appeler l'edge function
      const { data, error } = await supabase.functions.invoke('process-client-submission', {
        body: {
          dossier_id: dossierId,
          submission_id: submissionId,
          answers: answers,
          client_name: formData.identity?.full_name || formData.story?.narrative?.substring(0, 50),
          status: 'completed'
        }
      });

      if (error) {
        console.error('Error submitting questionnaire:', error);
        return false;
      }

      console.log('Questionnaire submitted successfully:', data);
      
      // Nettoyer le localStorage
      localStorage.removeItem(`questionnaire_${token}`);
      localStorage.removeItem(`dossier_id_${token}`);
      
      return true;
    } catch (error) {
      console.error('Error in submitQuestionnaire:', error);
      return false;
    }
  };

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(`questionnaire_${token}`);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved questionnaire data:', error);
      }
    }
  }, [token]);

  const contextValue: StepperContextData = {
    currentStep,
    formData,
    goTo,
    savePartial,
    isStepValid,
    submitQuestionnaire,
  };

  return (
    <StepperContext.Provider value={contextValue}>
      {children}
    </StepperContext.Provider>
  );
}