
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepperContextData } from '@/types/questionnaire';

const ClientStepperContext = createContext<StepperContextData | null>(null);

const STEPS = ['welcome', 'identity', 'motifs', 'questions', 'upload', 'signature', 'confirm'];

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
  
  // Utiliser directement le paramètre URL ou la valeur par défaut
  const [currentStep, setCurrentStep] = useState(step || initialStep);
  const [formData, setFormData] = useState<StepperContextData['formData']>({});

  // Synchroniser l'état avec le paramètre URL quand il change
  useEffect(() => {
    const urlStep = step || 'welcome';
    if (STEPS.includes(urlStep) && urlStep !== currentStep) {
      setCurrentStep(urlStep);
    }
  }, [step, currentStep]);

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
    
    // TODO: Debounced API call to save draft
    console.log('Saving partial data for step:', step, data);
  }, []);

  const isStepValid = useCallback((step: string) => {
    switch (step) {
      case 'identity':
        const identity = formData.identity;
        return !!(identity?.fullName && identity?.email && identity?.employerName && identity?.employerSiren);
      case 'motifs':
        const motifs = formData.motifs;
        return !!(motifs?.selectedMotifs && motifs.selectedMotifs.length > 0);
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
