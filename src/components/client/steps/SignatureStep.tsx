import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';

export function SignatureStep() {
  const { goTo } = useStepper();

  const onNext = () => {
    goTo('confirm');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Signature et mandats</CardTitle>
          <CardDescription>
            Signez les documents et mandats nécessaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Interface de signature électronique à implémenter</p>
            <p className="text-sm mt-2">Cette étape sera développée prochainement</p>
          </div>

          <StepNavigation 
            onNext={onNext}
            onBack={() => goTo('upload')}
            nextLabel="Terminer"
          />
        </CardContent>
      </Card>
    </div>
  );
}