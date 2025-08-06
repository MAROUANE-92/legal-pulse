import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';

interface ContractFormData {
  contract_type: string;
  contract_start: string;
  contract_end?: string;
  position_title: string;
  idcc_code: string;
  trial_period: string;
  trial_renewal?: string;
  cadre_status: string;
  forfait_clause: string;
  mobility_clause: string;
  non_compete_clause: string;
}

export function ContractStep() {
  const { formData, savePartial, goTo } = useStepper();
  
  const form = useForm<ContractFormData>({
    defaultValues: formData.contract || {
      contract_type: '',
      contract_start: '',
      contract_end: '',
      position_title: '',
      idcc_code: '',
      trial_period: '',
      trial_renewal: '',
      cadre_status: '',
      forfait_clause: '',
      mobility_clause: '',
      non_compete_clause: ''
    }
  });

  const contractType = form.watch('contract_type');
  const trialPeriod = form.watch('trial_period');

  const onSubmit = (data: ContractFormData) => {
    savePartial('contract', data);
    goTo('remuneration');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Données contrat</CardTitle>
          <CardDescription>
            Informations sur votre contrat de travail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="contract_type"
                rules={{ required: "Type de contrat requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de contrat *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type" />
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

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contract_start"
                  rules={{ required: "Date de début requise" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {contractType && contractType !== 'CDI' && (
                  <FormField
                    control={form.control}
                    name="contract_end"
                    rules={{ required: "Date de fin requise pour ce type de contrat" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de fin / préavis *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="position_title"
                rules={{ required: "Poste requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poste occupé *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Développeur, Commercial, Assistant..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idcc_code"
                rules={{ required: "IDCC requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IDCC / Convention collective *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: IDCC 1486 - Bureaux d'études" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trial_period"
                  rules={{ required: "Information requise" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Période d'essai ? *</FormLabel>
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

                {trialPeriod === 'Yes' && (
                  <FormField
                    control={form.control}
                    name="trial_renewal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Renouvelée ?</FormLabel>
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
                )}
              </div>

              <FormField
                control={form.control}
                name="cadre_status"
                rules={{ required: "Statut requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cadre">Cadre</SelectItem>
                        <SelectItem value="Non-cadre">Non-cadre</SelectItem>
                      </SelectContent>
                    </Select>
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
                          <SelectValue placeholder="Sélectionnez le type" />
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

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mobility_clause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clause mobilité ?</FormLabel>
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
                  name="non_compete_clause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clause non-concurrence ?</FormLabel>
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

              <StepNavigation 
                onNext={form.handleSubmit(onSubmit)}
                onBack={() => goTo('identity')}
                nextLabel="Continuer vers rémunération"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}