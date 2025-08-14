import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { NewStepperProvider } from '@/components/client/NewStepperProvider';

// Import des nouvelles étapes optimisées
import { WelcomeStep } from '@/components/client/steps/WelcomeStep';
import { Step0Identity } from '@/components/client/steps/Step0Identity';
import { UrgencyStep } from '@/components/client/steps/UrgencyStep';
import { StoryStep } from '@/components/client/steps/StoryStep';
import { QualificationStep } from '@/components/client/steps/QualificationStep';
import { ProofInventoryStep } from '@/components/client/steps/ProofInventoryStep';
import { DocumentsStep } from '@/components/client/steps/DocumentsStep';
import { TimelineStep } from '@/components/client/steps/TimelineStep';
import { SummaryStep } from '@/components/client/steps/SummaryStep';
import { CompanyStep } from '@/components/client/steps/CompanyStep';
import { ContractStep } from '@/components/client/steps/ContractStep';
import { DamagesStep } from '@/components/client/steps/DamagesStep';

// Mapping des nouvelles étapes optimisées (12 étapes avec welcome et identity)
const stepComponents = {
  'welcome': WelcomeStep,        // Nouvelle étape d'accueil + auth
  'identity': Step0Identity,     // Étape 0 - Coordonnées personnelles
  'urgency': UrgencyStep,        // Étape 1 - Évaluation de l'urgence
  'story': StoryStep,            // Étape 2 - Récit des faits
  'company': CompanyStep,        // Étape 3 - Informations sur l'entreprise
  'qualification': QualificationStep, // Étape 4 - Analyse approfondie
  'contract': ContractStep,      // Étape 5 - Situation contractuelle
  'proof_inventory': ProofInventoryStep, // Étape 6 - Inventaire des pièces
  'documents': DocumentsStep,    // Étape 7 - Téléversement des documents
  'timeline': TimelineStep,      // Étape 8 - Chronologie des faits
  'damages': DamagesStep,        // Étape 9 - Évaluation des préjudices
  'summary': SummaryStep,        // Étape 10 - Synthèse
};

export default function ClientWizard() {
  const { token, step } = useParams();
  const currentStep = step || 'welcome';
  
  console.log(`ClientWizard - token: ${token}, step param: ${step}, currentStep: ${currentStep}`);

  // Validation du token
  if (!token) {
    return <Navigate to="/access" replace />;
  }

  // Validation de l'étape
  const StepComponent = stepComponents[currentStep as keyof typeof stepComponents];
  
  console.log(`Current step: ${currentStep}, Component found: ${!!StepComponent}`);
  
  if (!StepComponent) {
    console.log(`Step ${currentStep} not found, redirecting to welcome`);
    return <Navigate to={`/client/${token}/welcome`} replace />;
  }

  return (
    <NewStepperProvider token={token}>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <span>Étape {Object.keys(stepComponents).indexOf(currentStep) + 1}</span>
              <span>/</span>
              <span>{Object.keys(stepComponents).length}</span>
            </div>
            <div className="mt-2 bg-muted rounded-full h-2 max-w-md mx-auto">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((Object.keys(stepComponents).indexOf(currentStep) + 1) / Object.keys(stepComponents).length) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Rendu de l'étape courante */}
          <StepComponent />
        </div>
      </div>
    </NewStepperProvider>
  );
}