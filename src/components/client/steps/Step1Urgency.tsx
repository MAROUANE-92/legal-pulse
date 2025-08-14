import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useStepper } from '../StepperProviderV2';

interface Step1FormData {
  endDate: string;
  currentSituation: string;
  criticalSituation: string[];
  previousActions: string[];
}

export function Step1Urgency() {
  const { formData, savePartial, goNext, goPrevious } = useStepper();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Step1FormData>({
    defaultValues: {
      endDate: formData.endDate || '',
      currentSituation: formData.currentSituation || '',
      criticalSituation: formData.criticalSituation || [],
      previousActions: formData.previousActions || []
    }
  });

  const watchedCriticalSituation = watch('criticalSituation') || [];
  const watchedPreviousActions = watch('previousActions') || [];

  const onSubmit = (data: Step1FormData) => {
    savePartial('step1-urgency', data);
    goNext();
  };

  const handleCriticalSituationChange = (value: string, checked: boolean) => {
    const current = watchedCriticalSituation;
    if (checked) {
      setValue('criticalSituation', [...current, value]);
    } else {
      setValue('criticalSituation', current.filter(item => item !== value));
    }
  };

  const handlePreviousActionsChange = (value: string, checked: boolean) => {
    const current = watchedPreviousActions;
    if (checked) {
      setValue('previousActions', [...current, value]);
    } else {
      setValue('previousActions', current.filter(item => item !== value));
    }
  };

  const criticalSituationOptions = [
    { value: 'harassment', label: 'Harcèlement en cours' },
    { value: 'dismissal_threat', label: 'Menace de licenciement imminent' },
    { value: 'burnout', label: 'Burn-out ou détresse psychologique' },
    { value: 'none', label: 'Aucune situation critique' }
  ];

  const previousActionsOptions = [
    { value: 'manager_discussion', label: 'Discussion avec manager' },
    { value: 'hr_letter', label: 'Courrier au service RH' },
    { value: 'union_contact', label: 'Contact avec syndicat / CSE' },
    { value: 'labor_inspection', label: 'Inspection du travail' },
    { value: 'occupational_doctor', label: 'Médecin du travail' },
    { value: 'none', label: 'Aucune démarche' }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Évaluation de l'urgence</CardTitle>
        <CardDescription>
          Permet de vérifier la recevabilité et le risque d'action immédiate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="endDate">Date de fin des faits *</Label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate', { required: 'Ce champ est obligatoire' })}
            />
            {errors.endDate && (
              <p className="text-sm text-destructive">{errors.endDate.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Situation actuelle *</Label>
            <RadioGroup
              value={watch('currentSituation')}
              onValueChange={(value) => setValue('currentSituation', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="still_employed" id="still_employed" />
                <Label htmlFor="still_employed">Toujours salarié(e)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contract_ended" id="contract_ended" />
                <Label htmlFor="contract_ended">Contrat terminé (licenciement, rupture conventionnelle, CDD terminé)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resignation" id="resignation" />
                <Label htmlFor="resignation">Démission</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sick_leave" id="sick_leave" />
                <Label htmlFor="sick_leave">Arrêt maladie</Label>
              </div>
            </RadioGroup>
            {errors.currentSituation && (
              <p className="text-sm text-destructive">Veuillez sélectionner une situation</p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Situation critique (plusieurs choix possibles)</Label>
            <div className="space-y-3">
              {criticalSituationOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={watchedCriticalSituation.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleCriticalSituationChange(option.value, !!checked)
                    }
                  />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Démarches déjà entreprises (plusieurs choix possibles)</Label>
            <div className="space-y-3">
              {previousActionsOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={watchedPreviousActions.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handlePreviousActionsChange(option.value, !!checked)
                    }
                  />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={goPrevious} className="flex-1">
              Précédent
            </Button>
            <Button type="submit" className="flex-1">
              Continuer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}