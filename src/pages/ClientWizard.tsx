
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutClient } from '@/components/LayoutClient';
import { ClientStepperProvider, useStepperProgress } from '@/components/client/ClientStepperProvider';
import { WelcomeStep } from '@/components/client/steps/WelcomeStep';
import { IdentityStep } from '@/components/client/steps/IdentityStep';
import { MotifsStep } from '@/components/client/steps/MotifsStep';
import { QuestionsStep } from '@/components/client/steps/QuestionsStep';
import { UploadStep } from '@/components/client/steps/UploadStep';
import { SignatureStep } from '@/components/client/steps/SignatureStep';
import { ConfirmStep } from '@/components/client/steps/ConfirmStep';
import { useClientStepper } from '@/components/client/ClientStepperProvider';

const WizardContent = () => {
  const { currentStep } = useClientStepper();
  const { progressPercentage } = useStepperProgress();

  // Debug: log current step
  console.log('WizardContent - currentStep:', currentStep);

  const renderStep = () => {
    console.log('Rendering step:', currentStep);
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep />;
      case 'identity':
        return <IdentityStep />;
      case 'motifs':
        return <MotifsStep />;
      case 'questions':
        return <QuestionsStep />;
      case 'upload':
        return <UploadStep />;
      case 'signature':
        return <SignatureStep />;
      case 'confirm':
        return <ConfirmStep />;
      default:
        console.log('Unknown step, defaulting to welcome:', currentStep);
        return <WelcomeStep />;
    }
  };

  return (
    <LayoutClient 
      progressPct={progressPercentage} 
      dossierName="Constitution du dossier"
    >
      <div className="max-w-3xl mx-auto">
        {renderStep()}
      </div>
    </LayoutClient>
  );
};

const ClientWizard = () => {
  const { token, step } = useParams<{ token: string; step?: string }>();

  console.log('ClientWizard - URL params:', { token, step });

  return (
    <ClientStepperProvider token={token || ''} initialStep={step || 'welcome'}>
      <WizardContent />
    </ClientStepperProvider>
  );
};

export default ClientWizard;
