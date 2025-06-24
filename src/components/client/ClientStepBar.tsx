
import { useClientStepper } from './ClientStepperProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS_CONFIG = [
  { id: 'welcome', label: 'Accueil', shortLabel: 'Accueil' },
  { id: 'identity', label: 'Identité', shortLabel: 'Identité' },
  { id: 'motifs', label: 'Motifs', shortLabel: 'Motifs' },
  { id: 'questions', label: 'Questions', shortLabel: 'Questions' },
  { id: 'upload', label: 'Documents', shortLabel: 'Docs' },
  { id: 'signature', label: 'Signature', shortLabel: 'Signature' },
  { id: 'confirm', label: 'Confirmation', shortLabel: 'Confirm' }
];

export const ClientStepBar = () => {
  const { currentStep, goTo, isStepValid } = useClientStepper();
  
  const currentIndex = STEPS_CONFIG.findIndex(step => step.id === currentStep);

  const canAccessStep = (stepId: string, stepIndex: number) => {
    // On peut toujours accéder à welcome
    if (stepId === 'welcome') return true;
    
    // On peut accéder à une étape si on l'a déjà validée ou si c'est l'étape suivante
    return stepIndex <= currentIndex + 1;
  };

  const isStepCompleted = (stepId: string, stepIndex: number) => {
    return stepIndex < currentIndex || (stepIndex === currentIndex && isStepValid(stepId));
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between space-x-2 overflow-x-auto">
          {STEPS_CONFIG.map((step, index) => {
            const isCurrent = step.id === currentStep;
            const isCompleted = isStepCompleted(step.id, index);
            const canAccess = canAccessStep(step.id, index);
            
            return (
              <div key={step.id} className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => canAccess ? goTo(step.id) : null}
                  disabled={!canAccess}
                  className={cn(
                    "relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all",
                    isCurrent && "bg-blue-50 text-blue-700 border border-blue-200",
                    isCompleted && !isCurrent && "text-green-700 bg-green-50",
                    !canAccess && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      isCurrent ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    )}>
                      {index + 1}
                    </span>
                  )}
                  <span className="hidden sm:inline text-sm font-medium">
                    {step.label}
                  </span>
                  <span className="sm:hidden text-sm font-medium">
                    {step.shortLabel}
                  </span>
                </Button>
                
                {index < STEPS_CONFIG.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-200 mx-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
