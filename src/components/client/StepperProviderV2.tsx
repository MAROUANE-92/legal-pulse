import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { QuestionnaireFormData, StepperContextData } from '@/types/questionnaire-v2';
import { 
  QUESTIONNAIRE_STEPS, 
  getStepIndex, 
  getTotalSteps, 
  getNextStep, 
  getPreviousStep 
} from '@/lib/questionnaire-schema-v2';

const StepperContext = createContext<StepperContextData | undefined>(undefined);

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within a StepperProviderV2');
  }
  return context;
};

interface StepperProviderV2Props {
  children: React.ReactNode;
  token: string;
}

export const StepperProviderV2: React.FC<StepperProviderV2Props> = ({
  children,
  token
}) => {
  const navigate = useNavigate();
  const { step } = useParams<{ step: string }>();
  const currentStep = step || 'step0-identity';

  const [formData, setFormData] = useState<QuestionnaireFormData>({});

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedData = localStorage.getItem(`questionnaire_${token}`);
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, [token]);

  const goTo = (stepId: string) => {
    navigate(`/questionnaire/${token}/${stepId}`);
  };

  const goNext = () => {
    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      goTo(nextStep);
    }
  };

  const goPrevious = () => {
    const previousStep = getPreviousStep(currentStep);
    if (previousStep) {
      goTo(previousStep);
    }
  };

  const savePartial = (stepId: string, data: Partial<QuestionnaireFormData>) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    
    // Sauvegarder dans localStorage
    localStorage.setItem(`questionnaire_${token}`, JSON.stringify(updatedData));
  };

  const isStepValid = (stepId: string): boolean => {
    // Validation basique selon l'étape
    switch (stepId) {
      case 'step0-identity':
        return !!(formData.fullName && formData.birthDate && formData.address && formData.phone && formData.email && formData.familyStatus);
      case 'step1-urgency':
        return !!(formData.endDate && formData.currentSituation);
      case 'step2-facts':
        return !!(formData.detailedSummary && formData.detailedSummary.length >= 200 && formData.mainProblem && formData.procedureObjective && formData.startDate);
      case 'step3-company':
        return !!(formData.companyName && formData.siret && formData.workforce && formData.legalForm && formData.collectiveAgreement && formData.companyAddress);
      case 'step5-contract':
        return !!(formData.contractType && formData.contractStartDate && formData.position && formData.grossSalary);
      default:
        return true; // Les autres étapes sont considérées comme valides par défaut
    }
  };

  const submitQuestionnaire = async (): Promise<boolean> => {
    try {
      console.log('Soumission du questionnaire avec token:', token);
      
      // Récupérer ou créer le dossier ID
      let dossierId = localStorage.getItem(`dossier_id_${token}`);
      if (!dossierId || dossierId === ':token') {
        dossierId = `demo-${Date.now()}`;
        localStorage.setItem(`dossier_id_${token}`, dossierId);
      }

      // Créer un submission_id unique
      const submissionId = `questionnaire-v2-${Date.now()}-${Math.random().toString(36).substring(2)}`;

      // Transformer formData en format answers pour la base de données
      const answers = Object.entries(formData).map(([key, value]) => ({
        question_slug: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value,
        step: getStepFromQuestionId(key)
      }));

      // Appeler l'edge function
      const { data, error } = await supabase.functions.invoke('process-client-submission', {
        body: {
          dossier_id: dossierId,
          submission_id: submissionId,
          answers: answers,
          client_name: formData.fullName || 'Client',
          status: 'completed'
        }
      });

      if (error) {
        console.error('Erreur lors de la soumission:', error);
        return false;
      }

      console.log('Questionnaire soumis avec succès:', data);
      
      // Nettoyer localStorage
      localStorage.removeItem(`questionnaire_${token}`);
      localStorage.removeItem(`dossier_id_${token}`);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      return false;
    }
  };

  const getStepFromQuestionId = (questionId: string): string => {
    // Mapper les questions aux étapes
    const stepMapping: Record<string, string> = {
      fullName: 'step0-identity',
      birthDate: 'step0-identity',
      address: 'step0-identity',
      phone: 'step0-identity',
      email: 'step0-identity',
      familyStatus: 'step0-identity',
      children: 'step0-identity',
      endDate: 'step1-urgency',
      currentSituation: 'step1-urgency',
      criticalSituation: 'step1-urgency',
      previousActions: 'step1-urgency',
      detailedSummary: 'step2-facts',
      mainProblem: 'step2-facts',
      procedureObjective: 'step2-facts',
      startDate: 'step2-facts',
      companyName: 'step3-company',
      siret: 'step3-company',
      workforce: 'step3-company',
      legalForm: 'step3-company',
      collectiveAgreement: 'step3-company',
      sector: 'step3-company',
      companyAddress: 'step3-company',
      csePresent: 'step3-company',
      unionPresence: 'step3-company',
      analysisData: 'step4-analysis',
      contractType: 'step5-contract',
      contractStartDate: 'step5-contract',
      position: 'step5-contract',
      classification: 'step5-contract',
      grossSalary: 'step5-contract',
      benefits: 'step5-contract',
      contractEndDate: 'step5-contract',
      documentsReceived: 'step5-contract'
    };
    
    return stepMapping[questionId] || 'unknown';
  };

  const contextValue: StepperContextData = {
    currentStep,
    formData,
    goTo,
    goNext,
    goPrevious,
    savePartial,
    isStepValid,
    submitQuestionnaire,
    totalSteps: getTotalSteps(),
    currentStepIndex: getStepIndex(currentStep)
  };

  return (
    <StepperContext.Provider value={contextValue}>
      {children}
    </StepperContext.Provider>
  );
};