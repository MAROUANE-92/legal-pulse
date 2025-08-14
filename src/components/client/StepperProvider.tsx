import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepperContextData } from '@/types/questionnaire';
import { useQuestionnaireSchema } from '@/hooks/useQuestionnaireSchema';
import { supabase } from '@/integrations/supabase/client';

const StepperContext = createContext<StepperContextData | null>(null);

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within a StepperProvider');
  }
  return context;
};

interface StepperProviderProps {
  children: React.ReactNode;
  token: string;
}

export function StepperProvider({ children, token }: StepperProviderProps) {
  const navigate = useNavigate();
  const { '*': path } = useParams();
  const currentStep = path?.split('/').pop() || 'welcome';
  
  const [formData, setFormData] = useState<StepperContextData['formData']>({});
  
  // Use questionnaire schema to determine visible sections
  const { sections } = useQuestionnaireSchema(formData);

  // Define step order based on sections
  const stepOrder = [
    'welcome',
    'identity',
    'company',        // NOUVEAU
    'contract',
    'remuneration',
    'working_time',   // REFONDÉ
    'motifs',
    'questions',
    'damages',        // NOUVEAU
    'upload',
    'chronologie',
    'summary',        // NOUVEAU
    'signature',
    'confirm'
  ];

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

    // Basic validation - can be enhanced
    switch (step) {
      case 'identity':
        return !!(data.full_name && data.email_personal && data.birth_date);
      case 'contract':
        return !!(data.contract_type && data.contract_start && data.position_title);
      case 'motifs':
        return !!(data.motifs_selected && data.motifs_selected.length > 0);
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
          client_name: formData.identity?.full_name,
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