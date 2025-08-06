import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';

interface WorkingTimeFormData {
  work_regime: string;
  actual_schedule: string;
  badge_system: string;
  partial_remote: string;
  overtime_regular: string;
  absences_count: string;
}

export function WorkingTimeStep() {
  const { formData, savePartial, goTo } = useStepper();
  
  const form = useForm<WorkingTimeFormData>({
    defaultValues: formData.working_time || {
      work_regime: '',
      actual_schedule: '',
      badge_system: '',
      partial_remote: '',
      overtime_regular: '',
      absences_count: ''
    }
  });

  const onSubmit = (data: WorkingTimeFormData) => {
    savePartial('working_time', data);
    goTo('motifs');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temps de travail</CardTitle>
          <CardDescription>
            Informations sur votre organisation du travail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="work_regime"
                rules={{ required: "Régime horaire requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Régime horaire contractuel *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le régime" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="35h">35h</SelectItem>
                        <SelectItem value="39h">39h</SelectItem>
                        <SelectItem value="Forfait-jours">Forfait-jours</SelectItem>
                        <SelectItem value="Forfait-heures">Forfait-heures</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actual_schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horaires réels moyens</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 08:30-18:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="badge_system"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badgeage / pointeuse ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Oui/Non" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Oui</SelectItem>
                        <SelectItem value="No">Non</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partial_remote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Télétravail partiel ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Oui/Non" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Oui</SelectItem>
                        <SelectItem value="No">Non</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overtime_regular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heures supplémentaires régulières ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Oui/Non" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Oui</SelectItem>
                        <SelectItem value="No">Non</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="absences_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Absences ou arrêts maladie ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Oui/Non" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Oui</SelectItem>
                        <SelectItem value="No">Non</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <StepNavigation 
                onNext={form.handleSubmit(onSubmit)}
                onBack={() => goTo('remuneration')}
                nextLabel="Continuer vers motifs"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}