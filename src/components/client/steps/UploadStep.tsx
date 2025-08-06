import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';

export function UploadStep() {
  const { goTo } = useStepper();

  const onNext = () => {
    goTo('signature');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents et pièces justificatives</CardTitle>
          <CardDescription>
            Téléchargez les documents nécessaires à votre dossier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Interface d'upload des documents à implémenter</p>
            <p className="text-sm mt-2">Cette étape sera développée prochainement</p>
          </div>

          <StepNavigation 
            onNext={onNext}
            onBack={() => goTo('questions')}
            nextLabel="Continuer vers signature"
          />
        </CardContent>
      </Card>
    </div>
  );
}