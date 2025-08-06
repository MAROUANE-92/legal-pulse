import React from 'react';
import { useStepper } from './StepperProvider';
import { Check } from 'lucide-react';

const stepLabels = {
  welcome: "Accueil",
  identity: "Identité", 
  contract: "Contrat",
  remuneration: "Rémunération",
  working_time: "Temps de travail",
  motifs: "Motifs",
  questions: "Questions",
  upload: "Documents",
  signature: "Signature",
  confirm: "Confirmation"
};

export function StepProgress() {
  const { currentStep, goTo } = useStepper();
  
  const stepOrder = [
    'welcome', 'identity', 'contract', 'remuneration', 
    'working_time', 'motifs', 'questions', 'upload', 
    'signature', 'confirm'
  ];
  
  const currentIndex = stepOrder.indexOf(currentStep);
  
  const getStepStatus = (index: number) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Étape {currentIndex + 1} sur {stepOrder.length}
          </div>
          <div className="text-sm font-medium text-foreground">
            {stepLabels[currentStep as keyof typeof stepLabels]}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {stepOrder.map((step, index) => {
              const status = getStepStatus(index);
              const canNavigate = index <= currentIndex;
              
              return (
                <div key={step} className="flex flex-col items-center relative">
                  {/* Step circle */}
                  <button
                    onClick={() => canNavigate && goTo(step)}
                    disabled={!canNavigate}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                      transition-all duration-200 relative z-10
                      ${status === 'completed' 
                        ? 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl' 
                        : status === 'current'
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg'
                        : 'bg-muted text-muted-foreground'
                      }
                      ${canNavigate ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}
                    `}
                  >
                    {status === 'completed' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </button>
                  
                  {/* Step label (only for current step on mobile) */}
                  <div className={`
                    mt-2 text-xs text-center font-medium transition-opacity
                    ${status === 'current' ? 'text-primary' : 'text-muted-foreground'}
                    ${status === 'current' ? 'block' : 'hidden sm:block'}
                  `}>
                    <div className="max-w-20 truncate">
                      {stepLabels[step as keyof typeof stepLabels]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted -z-0">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(currentIndex / (stepOrder.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}