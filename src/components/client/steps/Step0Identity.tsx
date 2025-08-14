import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStepper } from '../StepperProviderV2';

interface Step0FormData {
  fullName: string;
  birthDate: string;
  address: string;
  phone: string;
  email: string;
  familyStatus: string;
  children?: number;
}

export function Step0Identity() {
  const { formData, savePartial, goNext } = useStepper();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Step0FormData>({
    defaultValues: {
      fullName: formData.fullName || '',
      birthDate: formData.birthDate || '',
      address: formData.address || '',
      phone: formData.phone || '',
      email: formData.email || '',
      familyStatus: formData.familyStatus || '',
      children: formData.children || 0
    }
  });

  const onSubmit = (data: Step0FormData) => {
    savePartial('step0-identity', data);
    goNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Coordonnées personnelles</CardTitle>
        <CardDescription>
          Identification du demandeur, obligatoire pour constituer le dossier.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom et prénom *</Label>
            <Input
              id="fullName"
              {...register('fullName', { required: 'Ce champ est obligatoire' })}
              placeholder="Votre nom complet"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance *</Label>
            <Input
              id="birthDate"
              type="date"
              {...register('birthDate', { required: 'Ce champ est obligatoire' })}
            />
            {errors.birthDate && (
              <p className="text-sm text-destructive">{errors.birthDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète *</Label>
            <Textarea
              id="address"
              {...register('address', { required: 'Ce champ est obligatoire' })}
              placeholder="Numéro, rue, code postal, ville"
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone', { required: 'Ce champ est obligatoire' })}
                placeholder="06 12 34 56 78"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Ce champ est obligatoire',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide'
                  }
                })}
                placeholder="votre.email@exemple.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyStatus">Situation familiale *</Label>
            <Select
              value={watch('familyStatus')}
              onValueChange={(value) => setValue('familyStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre situation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Célibataire</SelectItem>
                <SelectItem value="married">Marié(e)/Pacsé(e)</SelectItem>
                <SelectItem value="separated">Séparé(e)</SelectItem>
              </SelectContent>
            </Select>
            {errors.familyStatus && (
              <p className="text-sm text-destructive">{errors.familyStatus.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="children">Nombre d'enfants à charge</Label>
            <Input
              id="children"
              type="number"
              min="0"
              {...register('children', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <Button type="submit" className="w-full">
            Continuer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}