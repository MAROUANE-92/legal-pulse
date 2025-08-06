import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';

interface IdentityFormData {
  full_name: string;
  birth_date: string;
  postal_address: string;
  phone_personal: string;
  phone_professional?: string;
  email_personal: string;
  email_work?: string;
  marital_status: string;
}

export function IdentityStep() {
  const { formData, savePartial, goTo } = useStepper();
  
  const form = useForm<IdentityFormData>({
    defaultValues: formData.identity || {
      full_name: '',
      birth_date: '',
      postal_address: '',
      phone_personal: '',
      phone_professional: '',
      email_personal: '',
      email_work: '',
      marital_status: ''
    }
  });

  const onSubmit = (data: IdentityFormData) => {
    savePartial('identity', data);
    goTo('contract');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identité et coordonnées</CardTitle>
          <CardDescription>
            Renseignez vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                rules={{ required: "Nom et prénom requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom & prénom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birth_date"
                rules={{ required: "Date de naissance requise" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_address"
                rules={{ required: "Adresse requise" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse complète *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 rue de la Paix, 75001 Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone_personal"
                  rules={{ required: "Téléphone personnel requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone personnel *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="06 12 34 56 78" {...field} />
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
                      <FormLabel>Téléphone professionnel</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="01 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email_personal"
                  rules={{ 
                    required: "Email personnel requis",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email invalide"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email personnel *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jean@exemple.com" {...field} />
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
                      <FormLabel>Email professionnel</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jean@entreprise.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="marital_status"
                rules={{ required: "Situation familiale requise" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situation familiale *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre situation" />
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

              <StepNavigation 
                onNext={form.handleSubmit(onSubmit)}
                nextLabel="Continuer vers le contrat"
                showBack={false}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}