import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useClientStepper } from '../ClientStepperProvider';
import { StepNavigation } from '../StepNavigation';

const workingTimeSchema = z.object({
  work_regime: z.enum(['35h', '39h', 'Forfait-jours', 'Forfait-heures']),
  actual_schedule: z.string().optional(),
  badge_system: z.enum(['Yes', 'No']).optional(),
  partial_remote: z.enum(['Yes', 'No']).optional(),
  overtime_regular: z.enum(['Yes', 'No']).optional(),
  absences_count: z.enum(['Yes', 'No']).optional(),
});

type WorkingTimeFormData = z.infer<typeof workingTimeSchema>;

export const WorkingTimeStep = () => {
  const { formData, savePartial, goTo } = useClientStepper();
  
  const form = useForm<WorkingTimeFormData>({
    resolver: zodResolver(workingTimeSchema),
    defaultValues: {
      work_regime: formData.working_time?.work_regime || '35h',
      actual_schedule: formData.working_time?.actual_schedule || '',
      badge_system: formData.working_time?.badge_system || 'No',
      partial_remote: formData.working_time?.partial_remote || 'No',
      overtime_regular: formData.working_time?.overtime_regular || 'No',
      absences_count: formData.working_time?.absences_count || 'No',
    }
  });

  const onSubmit = (data: WorkingTimeFormData) => {
    savePartial('working_time', data);
    goTo('motifs');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Temps de travail</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="work_regime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Régime horaire contractuel *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un régime" />
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
                  <FormLabel>Horaires réels moyens (ex. 08:30-18:00)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ex. 08:30-18:00"
                      {...field}
                    />
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
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="badge_system_yes" />
                        <Label htmlFor="badge_system_yes">Oui</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="badge_system_no" />
                        <Label htmlFor="badge_system_no">Non</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Fichiers attendus: exports_badge.csv
                  </p>
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
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="partial_remote_yes" />
                        <Label htmlFor="partial_remote_yes">Oui</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="partial_remote_no" />
                        <Label htmlFor="partial_remote_no">Non</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
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
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="overtime_regular_yes" />
                        <Label htmlFor="overtime_regular_yes">Oui</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="overtime_regular_no" />
                        <Label htmlFor="overtime_regular_no">Non</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
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
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="absences_count_yes" />
                        <Label htmlFor="absences_count_yes">Oui</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="absences_count_no" />
                        <Label htmlFor="absences_count_no">Non</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
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