import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useStepper } from '../NewStepperProvider';
import { StepNavigation } from '../StepNavigation';

interface DamagesFormData {
  unpaid_overtime_hours: string;
  lost_vacation_days: string;
  unpaid_bonuses: string;
  sick_leave_days: string;
  psychological_support: string;
  burnout_diagnosed: string;
  anxiety_level: number;
  family_impact_level: number;
  confidence_loss_level: number;
}

export function DamagesStep() {
  const { formData, savePartial, goTo } = useStepper();
  
  const form = useForm<DamagesFormData>({
    defaultValues: formData.damages || {
      unpaid_overtime_hours: '',
      lost_vacation_days: '',
      unpaid_bonuses: '',
      sick_leave_days: '',
      psychological_support: '',
      burnout_diagnosed: '',
      anxiety_level: 5,
      family_impact_level: 5,
      confidence_loss_level: 5
    }
  });

  const onSubmit = (data: DamagesFormData) => {
    savePartial('damages', data);
    goTo('summary');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Évaluation des préjudices</CardTitle>
          <CardDescription>
            Estimez les dommages subis pour renforcer votre dossier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Section Financier */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Préjudices financiers</h3>
                
                <FormField
                  control={form.control}
                  name="unpaid_overtime_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heures supplémentaires non payées (estimation)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Nombre d'heures total" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lost_vacation_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Congés perdus (jours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Nombre de jours" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unpaid_bonuses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primes non versées (montant en €)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Montant estimé" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section Santé */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Impact sur la santé</h3>

                <FormField
                  control={form.control}
                  name="sick_leave_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrêts maladie liés au travail (jours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Nombre de jours" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="psychological_support"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suivi psychologique ?</FormLabel>
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
                  name="burnout_diagnosed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Burn-out diagnostiqué ?</FormLabel>
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
              </div>

              {/* Section Impact moral */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Impact moral et personnel</h3>

                <FormField
                  control={form.control}
                  name="anxiety_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau d'anxiété (1-10)</FormLabel>
                      <FormControl>
                        <div className="px-3">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>Faible</span>
                            <span>Élevé</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="family_impact_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact sur la vie de famille (1-10)</FormLabel>
                      <FormControl>
                        <div className="px-3">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>Faible</span>
                            <span>Élevé</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confidence_loss_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perte de confiance en soi (1-10)</FormLabel>
                      <FormControl>
                        <div className="px-3">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>Faible</span>
                            <span>Élevé</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <StepNavigation 
                onNext={form.handleSubmit(onSubmit)}
                onBack={() => goTo('timeline')}
                nextLabel="Voir le résumé"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}