import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';

interface MotifsFormData {
  motifs_selected: string[];
}

export function MotifsStep() {
  const { formData, savePartial, goTo } = useStepper();
  
  const form = useForm<MotifsFormData>({
    defaultValues: formData.motifs || {
      motifs_selected: []
    }
  });

  const motifOptions = [
    { code: "overtime", label: "Heures supplémentaires non payées" },
    { code: "dismissal", label: "Licenciement abusif / irrégulier" },
    { code: "harassment", label: "Harcèlement moral / sexuel" },
    { code: "unpaid_leave", label: "Congés non payés / soldes erronés" },
    { code: "discrimination", label: "Discrimination" },
    { code: "accident", label: "Accident du travail / MP" },
    { code: "other", label: "Autre" }
  ];

  const onSubmit = (data: MotifsFormData) => {
    savePartial('motifs', data);
    goTo('questions');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Motif(s) de réclamation</CardTitle>
          <CardDescription>
            Sélectionnez les motifs pour lesquels vous souhaitez porter réclamation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="motifs_selected"
                rules={{ 
                  validate: (value) => value.length > 0 || "Sélectionnez au moins un motif" 
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sélectionnez vos motifs *</FormLabel>
                    <div className="space-y-3 mt-2">
                      {motifOptions.map((option) => (
                        <FormItem
                          key={option.code}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.code) || false}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), option.code]
                                  : field.value?.filter((value) => value !== option.code) || [];
                                field.onChange(updatedValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal leading-6">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <StepNavigation 
                onNext={form.handleSubmit(onSubmit)}
                onBack={() => goTo('working_time')}
                nextLabel="Continuer vers questions spécifiques"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}