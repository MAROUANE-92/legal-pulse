
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepperContextData } from '@/types/questionnaire';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';

const ClientStepperContext = createContext<StepperContextData | null>(null);

const STEPS = ['welcome', 'identity', 'contract', 'remuneration', 'working_time', 'motifs', 'questions', 'upload', 'signature', 'confirm'];

interface ClientStepperProviderProps {
  children: ReactNode;
  token: string;
  initialStep?: string;
}

export const ClientStepperProvider = ({ 
  children, 
  token, 
  initialStep = 'welcome' 
}: ClientStepperProviderProps) => {
  const navigate = useNavigate();
  const { step } = useParams<{ step?: string }>();
  
  // Déterminer le step actuel à partir de l'URL
  const determineCurrentStep = () => {
    const urlStep = step || initialStep;
    return STEPS.includes(urlStep) ? urlStep : 'welcome';
  };
  
  const [currentStep, setCurrentStep] = useState(determineCurrentStep());
  const [formData, setFormData] = useState<StepperContextData['formData']>({});
  const { saveAnswers } = useQuestionnaire(token);

  // Synchroniser l'état avec le paramètre URL quand il change
  useEffect(() => {
    const newStep = determineCurrentStep();
    if (newStep !== currentStep) {
      setCurrentStep(newStep);
    }
  }, [step]);

  const goTo = useCallback((targetStep: string) => {
    if (STEPS.includes(targetStep)) {
      setCurrentStep(targetStep);
      navigate(`/client/${token}/${targetStep}`, { replace: true });
    }
  }, [token, navigate]);

  const savePartial = useCallback((step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step as keyof typeof prev], ...data }
    }));
    
    // Save to Supabase with debounce to avoid infinite loops
    setTimeout(() => {
      saveAnswers.mutate({ step, answers: data });
    }, 300);
    console.log('Saving partial data for step:', step, data);
  }, []); // Remove saveAnswers from dependencies

  const isStepValid = useCallback((step: string) => {
    switch (step) {
      case 'identity':
        const identity = formData.identity;
        return !!(identity?.full_name && identity?.birth_date && identity?.postal_address && identity?.phone_personal);
      case 'motifs':
        const motifs = formData.motifs;
        return !!(motifs?.motifs_selected && motifs.motifs_selected.length > 0);
      case 'questions':
        return true; // Questions validation handled per motif
      default:
        return true;
    }
  }, [formData]);

  const getCurrentStepIndex = () => STEPS.indexOf(currentStep);
  const getProgressPercentage = () => ((getCurrentStepIndex() + 1) / STEPS.length) * 100;

  const contextValue: StepperContextData = {
    currentStep,
    formData,
    goTo,
    savePartial,
    isStepValid
  };

  return (
    <ClientStepperContext.Provider value={contextValue}>
      {children}
    </ClientStepperContext.Provider>
  );
};

export const useClientStepper = () => {
  const context = useContext(ClientStepperContext);
  if (!context) {
    throw new Error('useClientStepper must be used within ClientStepperProvider');
  }
  return context;
};

export const useStepperProgress = () => {
  const { currentStep } = useClientStepper();
  const getCurrentStepIndex = () => STEPS.indexOf(currentStep);
  const getProgressPercentage = () => ((getCurrentStepIndex() + 1) / STEPS.length) * 100;
  
  return {
    currentStepIndex: getCurrentStepIndex(),
    totalSteps: STEPS.length,
    progressPercentage: getProgressPercentage()
  };
};
