import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useStepper } from '../NewStepperProvider';

interface Step0FormData {
  fullName: string;
  birthDate?: Date;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  familyStatus: string;
  children?: number;
}

export function Step0Identity() {
  const { formData, savePartial, goTo } = useStepper();
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    formData.identity?.birthDate ? new Date(formData.identity.birthDate) : undefined
  );
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Step0FormData>({
    defaultValues: {
      fullName: formData.identity?.fullName || '',
      address: formData.identity?.address || '',
      postalCode: formData.identity?.postalCode || '',
      city: formData.identity?.city || '',
      phone: formData.identity?.phone || '',
      email: formData.identity?.email || '',
      familyStatus: formData.identity?.familyStatus || '',
      children: formData.identity?.children || 0
    }
  });

  const onSubmit = (data: Step0FormData) => {
    if (!birthDate) {
      return; // Validation will handle the error
    }
    
    const formDataWithDate = {
      ...data,
      birthDate: birthDate.toISOString()
    };
    
    savePartial('identity', formDataWithDate);
    goTo('urgency');
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? (
                    format(birthDate, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionnez votre date de naissance</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1940-01-01")
                  }
                  initialFocus
                  className="p-3 pointer-events-auto"
                  defaultMonth={new Date(1990, 0)}
                />
              </PopoverContent>
            </Popover>
            {!birthDate && (
              <p className="text-sm text-destructive">Ce champ est obligatoire</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                {...register('address', { required: 'Ce champ est obligatoire' })}
                placeholder="Numéro et nom de rue"
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal *</Label>
                <Input
                  id="postalCode"
                  {...register('postalCode', { 
                    required: 'Ce champ est obligatoire',
                    pattern: {
                      value: /^[0-9]{5}$/,
                      message: 'Code postal invalide (5 chiffres)'
                    }
                  })}
                  placeholder="75001"
                  maxLength={5}
                />
                {errors.postalCode && (
                  <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  {...register('city', { required: 'Ce champ est obligatoire' })}
                  placeholder="Paris"
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>
            </div>
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