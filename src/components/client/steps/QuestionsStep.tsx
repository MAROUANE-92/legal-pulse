import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { StepNavigation } from '../StepNavigation';
import { useClientStepper } from '../ClientStepperProvider';
import { QuestionsFormData } from '@/types/questionnaire';

export const QuestionsStep = () => {
  const { formData, savePartial } = useClientStepper();
  const selectedMotifs = formData.motifs?.selectedMotifs || [];
  
  const form = useForm<QuestionsFormData>({
    defaultValues: formData.questions || {}
  });

  // Sauvegarde automatique des données du formulaire
  useEffect(() => {
    const subscription = form.watch((value) => {
      savePartial('questions', value as QuestionsFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, savePartial]);

  const onSubmit = (data: QuestionsFormData) => {
    savePartial('questions', data);
  };

  const renderQuestionsByMotif = () => {
    return selectedMotifs.map((motif) => {
      switch (motif) {
        case 'heures_supp':
          return (
            <Card key={motif} className="p-4">
              <h3 className="font-semibold mb-4">Questions sur les heures supplémentaires</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="heures_supp.weeklyOvertime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre d'heures supplémentaires par semaine (moyenne)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nightWork"
                    checked={form.watch('heures_supp.nightWork') || false}
                    onCheckedChange={(checked) => 
                      form.setValue('heures_supp.nightWork', checked as boolean)
                    }
                  />
                  <Label htmlFor="nightWork">Travail de nuit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="badgeExists"
                    checked={form.watch('heures_supp.badgeExists') || false}
                    onCheckedChange={(checked) => 
                      form.setValue('heures_supp.badgeExists', checked as boolean)
                    }
                  />
                  <Label htmlFor="badgeExists">Système de badgeage existant</Label>
                </div>
              </div>
            </Card>
          );

        case 'licenciement':
          return (
            <Card key={motif} className="p-4">
              <h3 className="font-semibold mb-4">Questions sur le licenciement</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="licenciement.notifDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de notification du licenciement</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenciement.motifLettre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motif indiqué dans la lettre de licenciement</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Décrivez le motif..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          );

        case 'harcelement':
          return (
            <Card key={motif} className="p-4">
              <h3 className="font-semibold mb-4">Questions sur le harcèlement</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="harcelement.facts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Décrivez les faits de harcèlement</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Décrivez les incidents..." className="min-h-[120px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="witnesses"
                    checked={form.watch('harcelement.witnesses') || false}
                    onCheckedChange={(checked) => 
                      form.setValue('harcelement.witnesses', checked as boolean)
                    }
                  />
                  <Label htmlFor="witnesses">Il y a des témoins</Label>
                </div>
              </div>
            </Card>
          );

        case 'accident':
          return (
            <Card key={motif} className="p-4">
              <h3 className="font-semibold mb-4">Questions sur l'accident du travail</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="accident.accidentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de l'accident</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="declarationSent"
                    checked={form.watch('accident.declarationSent') || false}
                    onCheckedChange={(checked) => 
                      form.setValue('accident.declarationSent', checked as boolean)
                    }
                  />
                  <Label htmlFor="declarationSent">Déclaration d'accident envoyée</Label>
                </div>
              </div>
            </Card>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Questions spécifiques</CardTitle>
          <CardDescription>
            Répondez aux questions relatives à votre situation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderQuestionsByMotif()}
              
              <StepNavigation 
                nextLabel="Continuer vers l'upload"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
