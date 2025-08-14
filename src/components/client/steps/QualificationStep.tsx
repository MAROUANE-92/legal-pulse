import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStepper } from '../NewStepperProvider';

export function QualificationStep() {
  const { formData, savePartial, goTo } = useStepper();
  const mainProblem = formData.story?.main_problem;
  
  const form = useForm({
    defaultValues: formData.qualification || {}
  });

  const onSubmit = (data: any) => {
    savePartial('qualification', data);
    goTo('contract');
  };

  // Rendu conditionnel selon le problème principal
  const renderQuestions = () => {
    switch(mainProblem) {
      case 'unpaid':
        return <UnpaidQuestions form={form} />;
      case 'harassment':
        return <HarassmentQuestions form={form} />;
      case 'dismissal':
        return <DismissalQuestions form={form} />;
      default:
        return <GeneralQuestions form={form} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse approfondie</CardTitle>
        <CardDescription>
          Précisons votre situation pour qualifier juridiquement les faits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderQuestions()}
          <Button type="submit" className="w-full">
            Continuer vers votre contrat
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Composant pour heures non payées
function UnpaidQuestions({ form }: any) {
  return (
    <>
      <div>
        <Label>Comment prouver vos horaires ?</Label>
        <div className="space-y-2 mt-2">
          {['Badges/Pointeuse', 'Emails horodatés', 'Agenda Outlook', 'Témoins', 'Planning écrit', 'Aucune preuve'].map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input type="checkbox" {...form.register('proof_methods')} value={option} />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Décrivez une semaine type</Label>
        <div className="space-y-2 mt-2">
          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map(day => (
            <div key={day} className="grid grid-cols-3 gap-2 items-center">
              <Label className="text-sm">{day}</Label>
              <Input 
                type="time" 
                {...form.register(`weekly_hours.${day.toLowerCase()}_start`)}
                placeholder="Arrivée"
              />
              <Input 
                type="time" 
                {...form.register(`weekly_hours.${day.toLowerCase()}_end`)}
                placeholder="Départ"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Travail le weekend ?</Label>
        <RadioGroup {...form.register('weekend_work')} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="never" />
            <Label htmlFor="never">Jamais</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sometimes" id="sometimes" />
            <Label htmlFor="sometimes">Parfois (1-2 fois/mois)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="often" id="often" />
            <Label htmlFor="often">Souvent (chaque semaine)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="always" id="always" />
            <Label htmlFor="always">Tout le temps</Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
}

// Composant pour harcèlement
function HarassmentQuestions({ form }: any) {
  return (
    <>
      <div>
        <Label>Type de harcèlement</Label>
        <RadioGroup {...form.register('harassment_type', { required: true })} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moral" id="moral" />
            <Label htmlFor="moral">Harcèlement moral</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sexual" id="sexual" />
            <Label htmlFor="sexual">Harcèlement sexuel</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="discrimination" id="discrimination" />
            <Label htmlFor="discrimination">Discrimination</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Fréquence des faits</Label>
        <RadioGroup {...form.register('frequency')} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily">Quotidien</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly">Hebdomadaire</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly">Mensuel</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Qui est l'auteur ?</Label>
        <RadioGroup {...form.register('perpetrator')} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manager" id="manager" />
            <Label htmlFor="manager">Manager direct</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="colleague" id="colleague" />
            <Label htmlFor="colleague">Collègue</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multiple" id="multiple" />
            <Label htmlFor="multiple">Plusieurs personnes</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Avez-vous des témoins ?</Label>
        <RadioGroup {...form.register('witnesses')} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes_ready" id="yes_ready" />
            <Label htmlFor="yes_ready">Oui, prêts à témoigner</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes_hesitant" id="yes_hesitant" />
            <Label htmlFor="yes_hesitant">Oui, mais hésitants</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">Non</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Impact sur votre santé</Label>
        <div className="space-y-2 mt-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...form.register('health_impact.sick_leave')} />
            <span className="text-sm">Arrêt maladie</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...form.register('health_impact.medical_treatment')} />
            <span className="text-sm">Traitement médical</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...form.register('health_impact.psychological')} />
            <span className="text-sm">Suivi psychologique</span>
          </label>
        </div>
      </div>
    </>
  );
}

// Composant pour licenciement
function DismissalQuestions({ form }: any) {
  return (
    <>
      <div>
        <Label>Date du licenciement</Label>
        <Input type="date" {...form.register('dismissal_date', { required: true })} className="mt-2" />
      </div>

      <div>
        <Label>Motif invoqué par l'employeur</Label>
        <Textarea 
          {...form.register('dismissal_reason')}
          placeholder="Que dit la lettre de licenciement ?"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Type de licenciement</Label>
        <RadioGroup {...form.register('dismissal_type')} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="grave_fault" id="grave_fault" />
            <Label htmlFor="grave_fault">Faute grave</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="simple_fault" id="simple_fault" />
            <Label htmlFor="simple_fault">Faute simple</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="economic" id="economic" />
            <Label htmlFor="economic">Économique</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="incapacity" id="incapacity" />
            <Label htmlFor="incapacity">Inaptitude</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Procédure suivie</Label>
        <div className="space-y-2 mt-2">
          <div>
            <Label className="text-sm">Date convocation entretien</Label>
            <Input type="date" {...form.register('procedure.convocation_date')} className="mt-1" />
          </div>
          <div>
            <Label className="text-sm">Date entretien</Label>
            <Input type="date" {...form.register('procedure.interview_date')} className="mt-1" />
          </div>
          <div>
            <Label className="text-sm">Date notification licenciement</Label>
            <Input type="date" {...form.register('procedure.notification_date')} className="mt-1" />
          </div>
        </div>
      </div>

      <div>
        <Label>Pourquoi contestez-vous ?</Label>
        <div className="space-y-2 mt-2">
          {['Motif inventé', 'Procédure non respectée', 'Discrimination', 'Représailles', 'Pas de cause réelle'].map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input type="checkbox" {...form.register('contestation_grounds')} value={option} />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

// Composant pour questions générales
function GeneralQuestions({ form }: any) {
  return (
    <div>
      <Label>Décrivez plus en détail votre situation</Label>
      <Textarea 
        {...form.register('details')}
        placeholder="Précisez les circonstances, les personnes impliquées..."
        className="mt-2"
      />
    </div>
  );
}