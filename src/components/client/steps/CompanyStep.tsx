import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStepper } from '../NewStepperProvider';
import { StepNavigation } from '../StepNavigation';

interface CompanyFormData {
  company_name: string;
  siret: string;
  employee_count: string;
  collective_agreement: string;
  company_sector?: string;
  has_cse: string;
  has_union: string;
  company_address?: string;
  legal_form?: string;
}

export function CompanyStep() {
  const { formData, savePartial, goTo } = useStepper();
  
  const form = useForm<CompanyFormData>({
    defaultValues: formData.company || {
      company_name: '',
      siret: '',
      employee_count: '',
      collective_agreement: '',
      company_sector: '',
      has_cse: '',
      has_union: '',
      company_address: '',
      legal_form: ''
    }
  });

  const onSubmit = (data: CompanyFormData) => {
    savePartial('company', data);
    goTo('contract');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations sur l'entreprise</CardTitle>
          <CardDescription>
            Renseignez les informations de votre employeur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="company_name"
                rules={{ required: "Nom de l'entreprise requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'entreprise *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: ABC Solutions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siret"
                rules={{ 
                  required: "SIRET requis",
                  pattern: {
                    value: /^\d{14}$/,
                    message: "Le SIRET doit contenir 14 chiffres"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIRET *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12345678901234" 
                        maxLength={14}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employee_count"
                  rules={{ required: "Effectif requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effectif de l'entreprise *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez l'effectif" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="<11">Moins de 11 salariés</SelectItem>
                          <SelectItem value="11-50">11 à 50 salariés</SelectItem>
                          <SelectItem value="50-250">50 à 250 salariés</SelectItem>
                          <SelectItem value="250+">Plus de 250 salariés</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legal_form"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forme juridique</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez la forme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SARL">SARL</SelectItem>
                          <SelectItem value="SAS">SAS</SelectItem>
                          <SelectItem value="SA">SA</SelectItem>
                          <SelectItem value="EURL">EURL</SelectItem>
                          <SelectItem value="SNC">SNC</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="collective_agreement"
                rules={{ required: "Convention collective requise" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Convention collective *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: SYNTEC, Métallurgie, Commerce..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secteur d'activité</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Informatique, BTP, Commerce..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse de l'entreprise</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Adresse complète de l'entreprise" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="has_cse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>L'entreprise a-t-elle un CSE ?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Oui/Non" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Oui</SelectItem>
                          <SelectItem value="no">Non</SelectItem>
                          <SelectItem value="unknown">Je ne sais pas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="has_union"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Présence syndicale ?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Oui/Non" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Oui</SelectItem>
                          <SelectItem value="no">Non</SelectItem>
                          <SelectItem value="unknown">Je ne sais pas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <StepNavigation 
                onNext={form.handleSubmit(onSubmit)}
                onBack={() => goTo('identity')}
                nextLabel="Continuer vers le contrat"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}