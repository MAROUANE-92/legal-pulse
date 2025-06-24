
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useClientStepper } from '../ClientStepperProvider';
import { StepNavigation } from '../StepNavigation';
import { IdentityFormData } from '@/types/questionnaire';

const identitySchema = z.object({
  fullName: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  employerName: z.string().min(2, "Le nom de l'employeur est requis"),
  employerSiren: z.string().regex(/^\d{3}\s\d{3}\s\d{3}$/, "Format SIREN invalide (XXX XXX XXX)"),
  contractType: z.enum(['CDI', 'CDD', 'Intérim', 'Stage', 'Autre'], {
    required_error: "Le type de contrat est requis"
  }),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  salaryBrut: z.number().min(0, "Le salaire doit être positif"),
  ccn: z.string().optional()
});

export const IdentityStep = () => {
  const { formData, savePartial, goTo } = useClientStepper();
  
  const form = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    defaultValues: formData.identity || {
      fullName: '',
      email: '',
      phone: '',
      employerName: '',
      employerSiren: '',
      contractType: 'CDI',
      startDate: '',
      endDate: '',
      salaryBrut: 0,
      ccn: ''
    }
  });

  const contractType = form.watch('contractType');
  
  // Sauvegarde automatique des données du formulaire
  useEffect(() => {
    const subscription = form.watch((value) => {
      savePartial('identity', value as IdentityFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, savePartial]);
  
  const onSubmit = (data: IdentityFormData) => {
    savePartial('identity', data);
    goTo('motifs');
  };

  const formatSiren = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const match = numbers.match(/^(\d{0,3})(\d{0,3})(\d{0,3})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Vos informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Jean Dupont" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="jean.dupont@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="06 12 34 56 78" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employeur *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SociétéXYZ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employerSiren"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SIREN employeur *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="123 456 789"
                          onChange={(e) => {
                            const formatted = formatSiren(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de contrat *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CDI">CDI</SelectItem>
                          <SelectItem value="CDD">CDD</SelectItem>
                          <SelectItem value="Intérim">Intérim</SelectItem>
                          <SelectItem value="Stage">Stage</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
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
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de fin</FormLabel>
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
                  name="salaryBrut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salaire brut mensuel *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field}
                            type="number"
                            step="50"
                            placeholder="3500"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ccn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Convention collective</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Métallurgie" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <StepNavigation 
                nextLabel="Continuer"
                onNext={() => form.handleSubmit(onSubmit)()}
                nextDisabled={!form.formState.isValid}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
