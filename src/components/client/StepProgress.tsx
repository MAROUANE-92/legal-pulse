import React from 'react';
import { useStepper } from './StepperProvider';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight } from 'lucide-react';

const stepLabels = {
  welcome: "Accueil",
  identity: "Identité", 
  contract: "Contrat",
  remuneration: "Rémunération",
  working_time: "Temps de travail",
  motifs: "Motifs",
  questions: "Questions spécifiques",
  upload: "Documents",
  signature: "Signature",
  confirm: "Confirmation"
};

export function StepProgress() {
  const { currentStep, goTo, isStepValid } = useStepper();
  
  const stepOrder = [
    'welcome', 'identity', 'contract', 'remuneration', 
    'working_time', 'motifs', 'questions', 'upload', 
    'signature', 'confirm'
  ];
  
  const currentIndex = stepOrder.indexOf(currentStep);
  
  const getStepStatus = (step: string, index: number) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  const canNavigateToStep = (step: string, index: number) => {
    // Peut naviguer vers les étapes précédentes ou l'étape courante
    return index <= currentIndex;
  };

  return (
    <div className="w-full bg-card border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between space-x-2 overflow-x-auto">
          {stepOrder.map((step, index) => {
            const status = getStepStatus(step, index);
            const canNavigate = canNavigateToStep(step, index);
            
            return (
              <React.Fragment key={step}>
                <div className="flex items-center space-x-2 min-w-0">
                  <button
                    onClick={() => canNavigate && goTo(step)}
                    disabled={!canNavigate}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors min-w-0 flex-shrink-0
                      ${status === 'completed' 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                        : status === 'current'
                        ? 'bg-primary/10 text-primary border-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                      ${!canNavigate ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs
                      ${status === 'completed' 
                        ? 'bg-primary-foreground text-primary' 
                        : status === 'current'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {status === 'completed' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="truncate">{stepLabels[step as keyof typeof stepLabels]}</span>
                  </button>
                </div>
                
                {index < stepOrder.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}