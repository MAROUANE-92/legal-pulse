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

// Données de démo pour éviter de remplir le formulaire à chaque fois
const DEMO_DATA = {
  urgency: {
    facts_end_date: '2025-08-06',
    employment_status: 'fired',
    critical_situation: ['harassment'],
    resolution_attempts: ['manager_discussion', 'hr_letter']
  },
  story: {
    narrative: 'J\'ai été victime de harcèlement moral de la part de mon manager. Il me donnait des objectifs impossibles à atteindre et me faisait des remarques déplacées devant mes collègues.',
    main_problem: 'harassment',
    problem_start_date: '2025-06-01',
    witnesses: true,
    evidence: true
  },
  company: {
    name: 'ACME Corp',
    size: '50-249',
    sector: 'Technology',
    siret: '12345678901234'
  },
  qualification: {
    position: 'Développeur Senior',
    hierarchy_level: 'employee',
    team_size: 5,
    responsibilities: 'Développement d\'applications web'
  },
  contract: {
    type: 'CDI',
    start_date: '2024-01-15',
    position: 'Développeur Senior',
    classification: 'Cadre',
    salary: '4500',
    benefits: {
      variable: true,
      car: false,
      meal: true,
      housing: false
    }
  },
  proof_inventory: {
    'contract.Contrat de travail': true,
    'contract.Fiches de paie (12 derniers mois)': true,
    'evidence.Emails professionnels': true,
    'evidence.Attestations collègues': true
  },
  documents: {
    files: {},
    bordereau: []
  },
  timeline: [
    {
      date: '2025-06-01',
      title: 'Début du harcèlement',
      description: 'Première remarque déplacée du manager'
    },
    {
      date: '2025-06-15',
      title: 'Objectifs impossibles',
      description: 'Attribution d\'objectifs irréalisables'
    },
    {
      date: '2025-07-01',
      title: 'Humiliation publique',
      description: 'Critique en réunion devant toute l\'équipe'
    },
    {
      date: '2025-07-15',
      title: 'Discussion avec RH',
      description: 'Premier signalement aux ressources humaines'
    },
    {
      date: '2025-08-06',
      title: 'Licenciement',
      description: 'Notification de licenciement'
    }
  ],
  damages: {
    unpaid_overtime_hours: '50',
    lost_vacation_days: '10',
    psychological_support: 'yes',
    anxiety_level: 8,
    family_impact_level: 7,
    confidence_loss_level: 9
  }
};

export function NewStepperProvider({ children, token }: NewStepperProviderProps) {
  const navigate = useNavigate();
  const { step } = useParams();
  const currentStep = step || 'urgency';
  
  console.log(`NewStepperProvider - currentStep: ${currentStep}`);
  
  const [formData, setFormData] = useState<StepperContextData['formData']>(DEMO_DATA);

  const goTo = (step: string) => {
    console.log(`Navigating from ${currentStep} to ${step}`);
    navigate(`/client/${token}/${step}`);
  };

  const savePartial = (step: string, data: any) => {
    console.log(`Saving data for step ${step}:`, data);
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
        const savedData = JSON.parse(saved);
        // Merge saved data with demo data (saved data takes priority)
        setFormData(prev => ({ ...prev, ...savedData }));
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