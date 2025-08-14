import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStepper } from '../NewStepperProvider';
import { differenceInDays } from 'date-fns';

export function UrgencyStep() {
  const { formData, savePartial, goTo } = useStepper();
  const form = useForm({
    defaultValues: formData.urgency || {}
  });

  const onSubmit = (data: any) => {
    // Calcul urgence
    if (data.facts_end_date) {
      const endDate = new Date(data.facts_end_date);
      const today = new Date();
      const daysElapsed = differenceInDays(today, endDate);
      
      // Alerte prescription si > 2 ans (730 jours)
      if (daysElapsed > 730) {
        data.prescription_alert = true;
      }
    }
    
    savePartial('urgency', data);
    goTo('story');
  };

  const factsEndDate = form.watch('facts_end_date');
  const showPrescriptionAlert = factsEndDate && differenceInDays(new Date(), new Date(factsEndDate)) > 730;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Évaluation de l'urgence
        </CardTitle>
        <CardDescription>
          Déterminons rapidement si votre dossier nécessite une action immédiate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Date de fin des faits */}
          <div>
            <Label>Quand les faits se sont-ils terminés ?</Label>
            <Input
              type="date"
              {...form.register('facts_end_date', { required: true })}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Date du dernier incident ou de votre départ
            </p>
          </div>

          {/* Statut actuel */}
          <div>
            <Label>Êtes-vous toujours en poste ?</Label>
            <RadioGroup {...form.register('employment_status')} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employed" id="employed" />
                <Label htmlFor="employed">Oui, toujours salarié</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="terminated" id="terminated" />
                <Label htmlFor="terminated">Non, licencié/fin de contrat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resigned" id="resigned" />
                <Label htmlFor="resigned">Non, démission</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sick_leave" id="sick_leave" />
                <Label htmlFor="sick_leave">En arrêt maladie</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Situation critique */}
          <div>
            <Label>Vivez-vous une situation critique ?</Label>
            <RadioGroup {...form.register('critical_situation')} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="harassment_ongoing" id="harassment_ongoing" />
                <Label htmlFor="harassment_ongoing">Harcèlement en cours</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dismissal_threat" id="dismissal_threat" />
                <Label htmlFor="dismissal_threat">Menace de licenciement imminent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="burnout" id="burnout" />
                <Label htmlFor="burnout">Burn-out / Détresse psychologique</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">Aucune situation critique</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Alerte prescription */}
          {showPrescriptionAlert && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Attention prescription !</strong> Plus de 2 ans se sont écoulés. 
                Certaines réclamations pourraient être prescrites. Action urgente recommandée.
              </AlertDescription>
            </Alert>
          )}

          {/* Tentatives de résolution */}
          <div>
            <Label>Avez-vous déjà tenté de résoudre le problème ?</Label>
            <div className="space-y-2 mt-2">
              {['Discussion avec manager', 'Courrier RH', 'Syndicat/CSE', 'Inspection du travail', 'Médecin du travail', 'Aucune action'].map(option => (
                <label key={option} className="flex items-center space-x-2">
                  <input type="checkbox" {...form.register('resolution_attempts')} value={option} />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Continuer vers votre récit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}