import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStepper } from '../NewStepperProvider';

export function StoryStep() {
  const { formData, savePartial, goTo } = useStepper();
  const form = useForm({
    defaultValues: formData.story || {}
  });

  const onSubmit = (data: any) => {
    console.log('StoryStep onSubmit called with data:', data);
    savePartial('story', data);
    goTo('company');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Story form submitted, calling handleSubmit...');
    form.handleSubmit(onSubmit)(e);
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
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
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
            <div className="mt-2 space-y-2">
              {[
                { value: 'unpaid', label: 'On ne me paie pas tout (heures, primes, congés...)' },
                { value: 'harassment', label: 'On me maltraite (harcèlement, discrimination...)' },
                { value: 'dismissal', label: 'On m\'a viré abusivement' },
                { value: 'conditions', label: 'Conditions de travail dangereuses/illégales' },
                { value: 'other', label: 'Autre situation' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    {...form.register('main_problem', { required: true })} 
                    value={option.value} 
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Attentes */}
          <div>
            <Label>Qu'attendez-vous de cette procédure ?</Label>
            <div className="mt-2 space-y-2">
              {[
                { value: 'money', label: 'Récupérer mon argent' },
                { value: 'compensation', label: 'Être indemnisé pour le préjudice' },
                { value: 'job_back', label: 'Retrouver mon poste' },
                { value: 'justice', label: 'Faire condamner l\'entreprise' },
                { value: 'negotiation', label: 'Négocier un départ amiable' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    {...form.register('expected_outcome')} 
                    value={option.value} 
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
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