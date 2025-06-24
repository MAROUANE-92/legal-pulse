
import { useParams } from 'react-router-dom';
import { LayoutClient } from '@/components/LayoutClient';
import { ClientStepperProvider, useStepperProgress } from '@/components/client/ClientStepperProvider';
import { WelcomeStep } from '@/components/client/steps/WelcomeStep';
import { IdentityStep } from '@/components/client/steps/IdentityStep';
import { useClientStepper } from '@/components/client/ClientStepperProvider';

const WizardContent = () => {
  const { currentStep } = useClientStepper();
  const { progressPercentage } = useStepperProgress();

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep />;
      case 'identity':
        return <IdentityStep />;
      case 'motifs':
        return <div>Motifs step - Coming soon</div>;
      case 'questions':
        return <div>Questions step - Coming soon</div>;
      case 'upload':
        return <div>Upload step - Coming soon</div>;
      case 'signature':
        return <div>Signature step - Coming soon</div>;
      case 'confirm':
        return <div>Confirmation step - Coming soon</div>;
      default:
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

  return (
    <ClientStepperProvider token={token || ''} initialStep={step || 'welcome'}>
      <WizardContent />
    </ClientStepperProvider>
  );
};

export default ClientWizard;
