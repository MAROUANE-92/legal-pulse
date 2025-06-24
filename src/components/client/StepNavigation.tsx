
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useClientStepper } from './ClientStepperProvider';

const STEPS = ['welcome', 'identity', 'motifs', 'questions', 'upload', 'signature', 'confirm'];

interface StepNavigationProps {
  onNext?: () => void;
  onPrevious?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  showPrevious?: boolean;
}

export const StepNavigation = ({
  onNext,
  onPrevious,
  nextDisabled = false,
  nextLabel = "Suivant",
  previousLabel = "Précédent",
  showPrevious = true
}: StepNavigationProps) => {
  const { currentStep, goTo, isStepValid } = useClientStepper();
  
  const currentIndex = STEPS.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === STEPS.length - 1;

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (!isLastStep) {
      const nextStep = STEPS[currentIndex + 1];
      goTo(nextStep);
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (!isFirstStep) {
      const previousStep = STEPS[currentIndex - 1];
      goTo(previousStep);
    }
  };

  const canProceed = isStepValid(currentStep) && !nextDisabled;

  return (
    <div className="flex justify-between items-center pt-6 border-t">
      {showPrevious && !isFirstStep ? (
        <Button
          variant="outline"
          onClick={handlePrevious}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {previousLabel}
        </Button>
      ) : (
        <div />
      )}

      {!isLastStep && (
        <Button
          onClick={handleNext}
          disabled={!canProceed}
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
