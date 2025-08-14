import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';
import { toast } from 'sonner';

export function SignatureStep() {
  const { goTo, submitQuestionnaire } = useStepper();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onNext = async () => {
    setIsSubmitting(true);
    try {
      const success = await submitQuestionnaire();
      if (success) {
        toast.success('Questionnaire soumis avec succès !');
        goTo('confirm');
      } else {
        toast.error('Erreur lors de la soumission du questionnaire');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Erreur lors de la soumission du questionnaire');
    } finally {
      setIsSubmitting(false);
    }
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
            nextLabel={isSubmitting ? "Soumission..." : "Terminer"}
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}