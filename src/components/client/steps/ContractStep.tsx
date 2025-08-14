import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStepper } from '../NewStepperProvider';

export function ContractStep() {
  const { formData, savePartial, goTo } = useStepper();
  const form = useForm({
    defaultValues: formData.contract || {}
  });

  const onSubmit = (data: any) => {
    savePartial('contract', data);
    goTo('proof_inventory');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre situation contractuelle</CardTitle>
        <CardDescription>
          Informations sur votre contrat et votre statut
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Type de contrat *</Label>
              <Select {...form.register('type', { required: true })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Interim">Intérim</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                  <SelectItem value="Alternance">Alternance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date de début *</Label>
              <Input type="date" {...form.register('start_date', { required: true })} className="mt-2" />
            </div>
          </div>

          <div>
            <Label>Poste occupé *</Label>
            <Input {...form.register('position', { required: true })} className="mt-2" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Classification</Label>
              <Input {...form.register('classification')} placeholder="Ex: Cadre, Niveau 3.2" className="mt-2" />
            </div>

            <div>
              <Label>Salaire mensuel brut (€) *</Label>
              <Input 
                type="number" 
                {...form.register('salary', { required: true, min: 0 })}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label>Avantages et primes</Label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...form.register('benefits.variable')} />
                <span className="text-sm">Part variable / Commissions</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...form.register('benefits.car')} />
                <span className="text-sm">Véhicule de fonction</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...form.register('benefits.meal')} />
                <span className="text-sm">Tickets restaurant</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...form.register('benefits.housing')} />
                <span className="text-sm">Logement</span>
              </label>
            </div>
          </div>

          {/* Si pas en poste (depuis UrgencyStep) */}
          {formData.urgency?.employment_status !== 'employed' && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium">Détails de la rupture</h3>
              
              <div>
                <Label>Date de fin/rupture</Label>
                <Input type="date" {...form.register('termination_date')} className="mt-2" />
              </div>

              <div>
                <Label>Avez-vous reçu vos documents de fin de contrat ?</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" {...form.register('final_docs.certificate')} />
                    <span className="text-sm">Certificat de travail</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" {...form.register('final_docs.payslip')} />
                    <span className="text-sm">Solde de tout compte</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" {...form.register('final_docs.unemployment')} />
                    <span className="text-sm">Attestation Pôle Emploi</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">
            Continuer vers l'inventaire des preuves
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}