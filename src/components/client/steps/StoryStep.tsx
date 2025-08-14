import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStepper } from '../StepperProvider';

export function StoryStep() {
  const { formData, savePartial, goTo } = useStepper();
  const form = useForm({
    defaultValues: formData.story || {}
  });

  const onSubmit = (data: any) => {
    savePartial('story', data);
    goTo('company');
  };

  const narrative = form.watch('narrative') || '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Racontez votre histoire</CardTitle>
        <CardDescription>
          Expliquez librement votre situation, comme vous le feriez à un ami
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Récit libre */}
          <div>
            <Label>Que se passe-t-il ?</Label>
            <Textarea
              {...form.register('narrative', { 
                required: 'Merci de décrire votre situation',
                minLength: { value: 200, message: 'Minimum 200 caractères pour bien comprendre' }
              })}
              placeholder="Racontez avec vos propres mots ce qui vous arrive..."
              className="min-h-[200px] mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {narrative.length}/200 caractères minimum
            </p>
            {form.formState.errors.narrative && (
              <p className="text-sm text-red-600 mt-1">
                {String(form.formState.errors.narrative.message)}
              </p>
            )}
          </div>

          {/* Problème principal */}
          <div>
            <Label>Quel est votre problème principal ?</Label>
            <RadioGroup {...form.register('main_problem', { required: true })} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unpaid" id="unpaid" />
                <Label htmlFor="unpaid">On ne me paie pas tout (heures, primes, congés...)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="harassment" id="harassment" />
                <Label htmlFor="harassment">On me maltraite (harcèlement, discrimination...)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dismissal" id="dismissal" />
                <Label htmlFor="dismissal">On m'a viré abusivement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="conditions" id="conditions" />
                <Label htmlFor="conditions">Conditions de travail dangereuses/illégales</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Autre situation</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Attentes */}
          <div>
            <Label>Qu'attendez-vous de cette procédure ?</Label>
            <RadioGroup {...form.register('expected_outcome')} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="money" id="money" />
                <Label htmlFor="money">Récupérer mon argent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compensation" id="compensation" />
                <Label htmlFor="compensation">Être indemnisé pour le préjudice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="job_back" id="job_back" />
                <Label htmlFor="job_back">Retrouver mon poste</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="justice" id="justice" />
                <Label htmlFor="justice">Faire condamner l'entreprise</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="negotiation" id="negotiation" />
                <Label htmlFor="negotiation">Négocier un départ amiable</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Début des problèmes */}
          <div>
            <Label>Quand les problèmes ont-ils commencé ?</Label>
            <Input
              type="date"
              {...form.register('problem_start_date', { required: true })}
              className="mt-2"
            />
          </div>

          <Button type="submit" className="w-full">
            Continuer vers les informations entreprise
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}