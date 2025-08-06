import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useClientStepper } from '../ClientStepperProvider';
import { StepNavigation } from '../StepNavigation';
import { HelpTooltip } from '@/components/HelpTooltip';
import { useQuestionnaireSchema } from '@/hooks/useQuestionnaireSchema';

// Schema for identity section only according to YAML
const identitySchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis"),
  birth_date: z.string().min(1, "La date de naissance est requise"),
  postal_address: z.string().min(5, "L'adresse complète est requise"),
  address_proof: z.any().optional(), // File upload
  phone_personal: z.string().min(10, "Le téléphone personnel est requis"),
  phone_professional: z.string().optional(),
  email_personal: z.string().email("Email invalide"),
  email_work: z.string().email("Email invalide").optional().or(z.literal("")),
  marital_status: z.enum(['Célibataire', 'Marié(e)', 'Pacsé(e)', 'Divorcé(e)'], {
    required_error: "La situation familiale est requise"
  })
});

type IdentityFormData = z.infer<typeof identitySchema>;

export const IdentityStep = () => {
  const { formData, savePartial, goTo } = useClientStepper();
  const { getSectionByStep } = useQuestionnaireSchema();
  
  // Get identity section from schema
  const identitySection = getSectionByStep('identity');
  
  const form = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    mode: 'onChange',
    defaultValues: {
      full_name: formData.identity?.full_name || '',
      birth_date: formData.identity?.birth_date || '',
      postal_address: formData.identity?.postal_address || '',
      phone_personal: formData.identity?.phone_personal || '',
      phone_professional: formData.identity?.phone_professional || '',
      email_personal: formData.identity?.email_personal || '',
      email_work: formData.identity?.email_work || '',
      marital_status: formData.identity?.marital_status || 'Célibataire'
    }
  });

  // Auto-save form data
  useEffect(() => {
    const subscription = form.watch((value) => {
      savePartial('identity', value as IdentityFormData);
    });
    return () => subscription.unsubscribe();
  }, [savePartial]);

  const onSubmit = (data: IdentityFormData) => {
    console.log('Identity form submitted:', data);
    savePartial('identity', data);
    // Navigate to next step
    goTo('contract');
  };

  // Debug: log form state
  console.log('IdentityStep - form state:', {
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    values: form.getValues()
  });

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>{identitySection?.label || 'Identité et coordonnées'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Nom & prénom *
                        <HelpTooltip text="Votre nom complet figurant sur la carte d'identité" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Jean Dupont" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Date de naissance *
                        <HelpTooltip text="Date de naissance pour vérification d'identité" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postal_address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center">
                        Adresse complète *
                        <HelpTooltip text="Adresse de résidence actuelle" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123 rue de la République, 75001 Paris" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_personal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Téléphone perso *
                        <HelpTooltip text="Votre numéro de téléphone personnel" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="06 12 34 56 78" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_professional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Téléphone pro (si usage)
                        <HelpTooltip text="Numéro professionnel si vous en avez un" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="01 23 45 67 89" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email_personal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Email personnel *
                        <HelpTooltip text="Votre adresse email personnelle" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="jean.dupont@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email_work"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Email travail (si différent)
                        <HelpTooltip text="Votre email professionnel si différent du personnel" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="jean.dupont@entreprise.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marital_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Situation familiale *
                        <HelpTooltip text="Votre situation matrimoniale actuelle" />
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Célibataire">Célibataire</SelectItem>
                          <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                          <SelectItem value="Pacsé(e)">Pacsé(e)</SelectItem>
                          <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <StepNavigation 
                nextLabel="Continuer vers les données contrat"
                nextDisabled={false}
                onNext={form.handleSubmit((data) => {
                  console.log('StepNavigation onNext called with valid form');
                  onSubmit(data);
                })}
              />
              
              {/* Debug info */}
              <div className="mt-4 p-2 bg-gray-100 text-xs">
                <p>Form valid: {form.formState.isValid ? 'Yes' : 'No'}</p>
                <p>Errors: {JSON.stringify(form.formState.errors)}</p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};