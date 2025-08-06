import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepperContextData } from '@/types/questionnaire';
import { useQuestionnaireSchema } from '@/hooks/useQuestionnaireSchema';

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
    'contract', 
    'remuneration',
    'working_time',
    'motifs',
    'questions',
    'upload',
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
  };

  return (
    <StepperContext.Provider value={contextValue}>
      {children}
    </StepperContext.Provider>
  );
}