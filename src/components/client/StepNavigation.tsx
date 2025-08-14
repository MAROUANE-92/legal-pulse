import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStepper } from './NewStepperProvider';

interface StepNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  nextDisabled?: boolean;
  isLoading?: boolean;
}

export function StepNavigation({
  onNext,
  onBack,
  nextLabel = "Suivant",
  backLabel = "Précédent", 
  showBack = true,
  showNext = true,
  nextDisabled = false,
  isLoading = false
}: StepNavigationProps) {
  const { goTo } = useStepper();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Default navigation logic
      goTo('welcome'); // Simplified for now
    }
  };

  return (
    <div className="flex justify-between pt-6 border-t">
      {showBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {backLabel}
        </Button>
      ) : (
        <div />
      )}

      {showNext && (
        <Button 
          type={onNext ? "submit" : "button"}
          onClick={onNext}
          disabled={nextDisabled || isLoading}
          className="flex items-center gap-2"
        >
          {nextLabel}
          {!isLoading && <ChevronRight className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}