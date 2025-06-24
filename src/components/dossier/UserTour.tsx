
import React, { useState } from 'react';
import { useTour } from '@reactour/tour';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';

export const UserTour = () => {
  const { setIsOpen, setCurrentStep } = useTour();

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={startTour}
      className="fixed bottom-6 right-6 z-50 bg-white shadow-lg hover:shadow-xl"
    >
      <HelpCircle className="w-4 h-4 mr-2" />
      Tour guidé
    </Button>
  );
};
