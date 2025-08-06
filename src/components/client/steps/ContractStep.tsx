import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useClientStepper } from '../ClientStepperProvider';
import { StepNavigation } from '../StepNavigation';
import { HelpTooltip } from '@/components/HelpTooltip';

// Schema for contract section according to YAML
const contractSchema = z.object({
  contract_type: z.enum(['CDI', 'CDD', 'Stage', 'Apprentissage', 'Intérim'], {
    required_error: "Le type de contrat est requis"
  }),
  contract_start: z.string().min(1, "La date de début est requise"),
  contract_end: z.string().optional(),
  position_title: z.string().min(2, "Le poste occupé est requis"),
  idcc_code: z.string().min(1, "L'IDCC est requis"),
  trial_period: z.enum(['Yes', 'No'], { required_error: "Réponse requise" }),
  trial_renewal: z.enum(['Yes', 'No']).optional(),
  cadre_status: z.enum(['Cadre', 'Non-cadre'], { required_error: "Le statut est requis" }),
  forfait_clause: z.enum(['Aucune', 'Forfait-jours', 'Forfait-heures']),
  mobility_clause: z.enum(['Yes', 'No']).optional(),
  non_compete_clause: z.enum(['Yes', 'No']).optional()
}).refine((data) => {
  if (data.contract_type !== 'CDI') {
    return !!data.contract_end;
  }
  return true;
}, {
  message: "Date de fin requise pour les contrats à durée déterminée",
  path: ["contract_end"]
});

type ContractFormData = z.infer<typeof contractSchema>;

export const ContractStep = () => {
  const { formData, savePartial } = useClientStepper();
  
  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    mode: 'onChange',
    defaultValues: {
      contract_type: formData.contract?.contract_type || 'CDI',
      contract_start: formData.contract?.contract_start || '',
      contract_end: formData.contract?.contract_end || '',
      position_title: formData.contract?.position_title || '',
      idcc_code: formData.contract?.idcc_code || '',
      trial_period: formData.contract?.trial_period || 'No',
      cadre_status: formData.contract?.cadre_status || 'Non-cadre',
      forfait_clause: formData.contract?.forfait_clause || 'Aucune'
    }
  });

  const contractType = form.watch('contract_type');
  const trialPeriod = form.watch('trial_period');

  // Auto-save form data
  useEffect(() => {
    const subscription = form.watch((value) => {
      savePartial('contract', value as ContractFormData);
    });
    return () => subscription.unsubscribe();
  }, [savePartial]);

  const onSubmit = (data: ContractFormData) => {
    savePartial('contract', data);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Données contrat</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contract_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Type de contrat *
                        <HelpTooltip text="Type de contrat de travail selon le Code du travail" />
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CDI">CDI</SelectItem>
                          <SelectItem value="CDD">CDD</SelectItem>
                          <SelectItem value="Stage">Stage</SelectItem>
                          <SelectItem value="Apprentissage">Apprentissage</SelectItem>
                          <SelectItem value="Intérim">Intérim</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contract_start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {contractType !== 'CDI' && (
                  <FormField
                    control={form.control}
                    name="contract_end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de fin / préavis *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="position_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poste occupé *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Développeur, Comptable, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idcc_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        IDCC / Convention collective *
                        <HelpTooltip text="Code IDCC ou nom de la convention collective" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1486, Métallurgie, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trial_period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Période d'essai ? *</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="trial_yes" />
                            <Label htmlFor="trial_yes">Oui</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="trial_no" />
                            <Label htmlFor="trial_no">Non</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {trialPeriod === 'Yes' && (
                  <FormField
                    control={form.control}
                    name="trial_renewal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Renouvelée ?</FormLabel>
                        <FormControl>
                          <RadioGroup value={field.value} onValueChange={field.onChange}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Yes" id="renewal_yes" />
                              <Label htmlFor="renewal_yes">Oui</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="No" id="renewal_no" />
                              <Label htmlFor="renewal_no">Non</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="cadre_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut *</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Cadre" id="cadre" />
                            <Label htmlFor="cadre">Cadre</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Non-cadre" id="non_cadre" />
                            <Label htmlFor="non_cadre">Non-cadre</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="forfait_clause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clause forfait</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Aucune">Aucune</SelectItem>
                          <SelectItem value="Forfait-jours">Forfait-jours</SelectItem>
                          <SelectItem value="Forfait-heures">Forfait-heures</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <StepNavigation 
                nextLabel="Continuer vers la rémunération"
                nextDisabled={!form.formState.isValid}
                onNext={form.handleSubmit(onSubmit)}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};