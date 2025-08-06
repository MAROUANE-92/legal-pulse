import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useClientStepper } from '../ClientStepperProvider';
import { StepNavigation } from '../StepNavigation';

const remunerationSchema = z.object({
  base_salary: z.number().min(0, "Le salaire doit être positif"),
  variable_comp: z.enum(['Yes', 'No']),
  benefits_kind: z.array(z.string()).optional(),
  expense_refund: z.enum(['Yes', 'No']).optional(),
});

type RemunerationFormData = z.infer<typeof remunerationSchema>;

export const RemunerationStep = () => {
  const { formData, savePartial, goTo } = useClientStepper();
  
  const form = useForm<RemunerationFormData>({
    resolver: zodResolver(remunerationSchema),
    defaultValues: {
      base_salary: formData.remuneration?.base_salary || 0,
      variable_comp: formData.remuneration?.variable_comp || 'No',
      benefits_kind: formData.remuneration?.benefits_kind || [],
      expense_refund: formData.remuneration?.expense_refund || 'No',
    }
  });

  const watchVariableComp = form.watch('variable_comp');

  const onSubmit = (data: RemunerationFormData) => {
    savePartial('remuneration', data);
    goTo('working_time');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Rémunération & avantages</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="base_salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire brut mensuel (€) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variable_comp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primes fixes / variables ? *</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="variable_comp_yes" />
                        <Label htmlFor="variable_comp_yes">Oui</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="variable_comp_no" />
                        <Label htmlFor="variable_comp_no">Non</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Fichiers attendus: plan_commissions.pdf, bulletins_prime.zip
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchVariableComp === 'Yes' && (
              <FormField
                control={form.control}
                name="benefits_kind"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avantages en nature</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {['Voiture', 'Logement', 'Téléphone', 'Autre'].map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`benefits_${option}`}
                              checked={field.value?.includes(option) || false}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                const newValue = checked
                                  ? [...currentValue, option]
                                  : currentValue.filter((v: string) => v !== option);
                                field.onChange(newValue);
                              }}
                            />
                            <Label htmlFor={`benefits_${option}`}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
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
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="expense_refund_yes" />
                        <Label htmlFor="expense_refund_yes">Oui</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="expense_refund_no" />
                        <Label htmlFor="expense_refund_no">Non</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Fichiers attendus: notes_frais.pdf
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <StepNavigation />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};