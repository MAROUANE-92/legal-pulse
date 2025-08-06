import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';

interface RemunerationFormData {
  base_salary: string;
  variable_comp: string;
  benefits_kind: string[];
  expense_refund: string;
}

export function RemunerationStep() {
  const { formData, savePartial, goTo } = useStepper();
  
  const form = useForm<RemunerationFormData>({
    defaultValues: formData.remuneration || {
      base_salary: '',
      variable_comp: '',
      benefits_kind: [],
      expense_refund: ''
    }
  });

  const variableComp = form.watch('variable_comp');

  const onSubmit = (data: RemunerationFormData) => {
    savePartial('remuneration', data);
    goTo('working_time');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rémunération & avantages</CardTitle>
          <CardDescription>
            Informations sur votre rémunération et avantages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="base_salary"
                rules={{ 
                  required: "Salaire requis",
                  pattern: {
                    value: /^\d+$/,
                    message: "Montant invalide"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire brut mensuel (€) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="3000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="variable_comp"
                rules={{ required: "Information requise" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primes fixes / variables ? *</FormLabel>
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

              {variableComp === 'Yes' && (
                <FormField
                  control={form.control}
                  name="benefits_kind"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avantages en nature</FormLabel>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {['Voiture', 'Logement', 'Téléphone', 'Autre'].map((benefit) => (
                          <FormItem
                            key={benefit}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(benefit) || false}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), benefit]
                                    : field.value?.filter((value) => value !== benefit) || [];
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {benefit}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="expense_refund"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frais remboursés ?</FormLabel>
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
                onBack={() => goTo('contract')}
                nextLabel="Continuer vers temps de travail"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}