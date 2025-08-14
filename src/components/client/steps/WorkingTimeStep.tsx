import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';

interface WorkingTimeFormData {
  // Section 1 - Horaires quotidiens
  monday_start: string;
  monday_end: string;
  monday_break: string;
  monday_home_work: string;
  
  tuesday_start: string;
  tuesday_end: string;
  tuesday_break: string;
  tuesday_home_work: string;
  
  wednesday_start: string;
  wednesday_end: string;
  wednesday_break: string;
  wednesday_home_work: string;
  
  thursday_start: string;
  thursday_end: string;
  thursday_break: string;
  thursday_home_work: string;
  
  friday_start: string;
  friday_end: string;
  friday_break: string;
  friday_home_work: string;

  // Section 2 - Weekend
  saturday_work: string;
  sunday_work: string;

  // Section 3 - Charge de travail
  simultaneous_projects: string;
  colleague_replacement: string;
  out_of_scope_tasks: string;

  // Section 4 - Preuves disponibles
  evidence_available: string[];
}

export function WorkingTimeStep() {
  const { formData, savePartial, goTo } = useStepper();
  
  const form = useForm<WorkingTimeFormData>({
    defaultValues: formData.working_time || {
      monday_start: '',
      monday_end: '',
      monday_break: '',
      monday_home_work: '',
      tuesday_start: '',
      tuesday_end: '',
      tuesday_break: '',
      tuesday_home_work: '',
      wednesday_start: '',
      wednesday_end: '',
      wednesday_break: '',
      wednesday_home_work: '',
      thursday_start: '',
      thursday_end: '',
      thursday_break: '',
      thursday_home_work: '',
      friday_start: '',
      friday_end: '',
      friday_break: '',
      friday_home_work: '',
      saturday_work: '',
      sunday_work: '',
      simultaneous_projects: '',
      colleague_replacement: '',
      out_of_scope_tasks: '',
      evidence_available: []
    }
  });

  const onSubmit = (data: WorkingTimeFormData) => {
    savePartial('working_time', data);
    goTo('motifs');
  };

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' }
  ];

  const evidenceOptions = [
    'Badges/pointeuse',
    'Emails tardifs',
    'Témoignages',
    'Agenda Outlook'
  ];

  const frequencyOptions = [
    { value: 'never', label: 'Jamais' },
    { value: 'sometimes', label: 'Parfois' },
    { value: 'often', label: 'Souvent' },
    { value: 'always', label: 'Toujours' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organisation détaillée du temps de travail</CardTitle>
          <CardDescription>
            Renseignez vos horaires réels pour constituer votre dossier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Section 1 - Horaires par jour */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Horaires hebdomadaires (Lundi à Vendredi)</h3>
                
                {days.map(({ key, label }) => (
                  <Card key={key} className="p-4">
                    <h4 className="font-medium mb-3">{label}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name={`${key}_start` as keyof WorkingTimeFormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Arrivée</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`${key}_end` as keyof WorkingTimeFormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Départ</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`${key}_break` as keyof WorkingTimeFormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pause (min)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="60" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`${key}_home_work` as keyof WorkingTimeFormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Travail soir (h)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.5" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Section 2 - Weekend */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Travail le weekend</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="saturday_work"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travail le samedi</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Fréquence" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {frequencyOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sunday_work"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travail le dimanche</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Fréquence" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {frequencyOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 3 - Charge de travail */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Charge de travail</h3>
                
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="simultaneous_projects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de projets simultanés</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ex: 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colleague_replacement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remplacements de collègues (fréquence)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Fréquence" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {frequencyOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="out_of_scope_tasks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Missions hors fiche de poste (fréquence)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Fréquence" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {frequencyOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 4 - Preuves disponibles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preuves disponibles</h3>
                
                <FormField
                  control={form.control}
                  name="evidence_available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quelles preuves pouvez-vous fournir ?</FormLabel>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {evidenceOptions.map((evidence) => (
                          <FormItem
                            key={evidence}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(evidence) || false}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), evidence]
                                    : field.value?.filter((value) => value !== evidence) || [];
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {evidence}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <StepNavigation 
                onNext={form.handleSubmit(onSubmit)}
                onBack={() => goTo('remuneration')}
                nextLabel="Continuer vers les motifs"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}