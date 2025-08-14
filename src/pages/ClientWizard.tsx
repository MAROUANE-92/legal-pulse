import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { StepperProvider } from '@/components/client/StepperProvider';
import { StepProgress } from '@/components/client/StepProgress';
import { WelcomeStep } from '@/components/client/steps/WelcomeStep';
import { IdentityStep } from '@/components/client/steps/IdentityStep';
import { CompanyStep } from '@/components/client/steps/CompanyStep';
import { ContractStep } from '@/components/client/steps/ContractStep';
import { RemunerationStep } from '@/components/client/steps/RemunerationStep';
import { WorkingTimeStep } from '@/components/client/steps/WorkingTimeStep';
import { MotifsStep } from '@/components/client/steps/MotifsStep';
import { QuestionsStep } from '@/components/client/steps/QuestionsStep';
import { DamagesStep } from '@/components/client/steps/DamagesStep';
import { UploadStep } from '@/components/client/steps/UploadStep';
import { ChronologieStep } from '@/components/client/steps/ChronologieStep';
import { SummaryStep } from '@/components/client/steps/SummaryStep';
import { SignatureStep } from '@/components/client/steps/SignatureStep';
import { ConfirmStep } from '@/components/client/steps/ConfirmStep';

const stepComponents = {
  welcome: WelcomeStep,
  identity: IdentityStep,
  company: CompanyStep,
  contract: ContractStep,
  remuneration: RemunerationStep,
  working_time: WorkingTimeStep,
  motifs: MotifsStep,
  questions: QuestionsStep,
  damages: DamagesStep,
  upload: UploadStep,
  chronologie: ChronologieStep,
  summary: SummaryStep,
  signature: SignatureStep,
  confirm: ConfirmStep,
};

export default function ClientWizard() {
  const { token, step = 'welcome' } = useParams();
  
  
  if (!token) {
    return <Navigate to="/not-found" replace />;
  }

  const StepComponent = stepComponents[step as keyof typeof stepComponents];
  
  if (!StepComponent) {
    return <Navigate to={`/client/${token}/welcome`} replace />;
  }

  return (
    <StepperProvider token={token}>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <StepProgress />
        <div className="container mx-auto px-4 py-8">
          <StepComponent />
        </div>
      </div>
    </StepperProvider>
  );
}