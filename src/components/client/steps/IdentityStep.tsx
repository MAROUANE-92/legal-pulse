import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useClientStepper } from '../ClientStepperProvider';
import { StepNavigation } from '../StepNavigation';
import { IdentityFormData } from '@/types/questionnaire';
import { HelpTooltip } from '@/components/HelpTooltip';

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
  salaryBrut: z.number().min(600, "Salaire minimum 600€").max(25000, "Salaire maximum 25 000€"),
  ccn: z.string().optional(),
  workingRegime: z.enum(["35h", "39h", "forfait_jours", "forfait_heures"], {
    required_error: "Le régime de temps de travail est requis"
  }),
  forfaitDays: z.number().min(120).max(235).optional(),
  contractualHours: z.string().optional(),
  actualHours: z.string().min(1, "Les horaires réels sont requis")
}).refine((data) => {
  if (data.contractType === 'CDI') return true;
  return !!data.endDate;
}, {
  message: "Date de fin requise pour les contrats à durée déterminée",
  path: ["endDate"]
}).refine((data) => {
  if (data.workingRegime === "forfait_jours") {
    return !!data.forfaitDays;
  }
  return !!data.contractualHours;
}, {
  message: "Nombre de jours forfait requis pour le forfait-jours, horaires contractuels requis pour les autres régimes",
  path: ["forfaitDays"]
});

export const IdentityStep = () => {
  const { formData, savePartial, goTo } = useClientStepper();
  const [ccnSuggestions, setCcnSuggestions] = useState<Array<{idcc: string, name: string}>>([]);
  const [ccnQuery, setCcnQuery] = useState('');
  
  const form = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    mode: 'onChange',
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
      ccn: '',
      workingRegime: '35h',
      forfaitDays: undefined,
      contractualHours: '',
      actualHours: ''
    }
  });

  const contractType = form.watch('contractType');
  const workingRegime = form.watch('workingRegime');
  
  // Auto-save form data
  useEffect(() => {
    const subscription = form.watch((value) => {
      savePartial('identity', value as IdentityFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, savePartial]);

  // Mock CCN autocomplete
  const searchCCN = async (query: string) => {
    if (query.length < 2) {
      setCcnSuggestions([]);
      return;
    }
    
    // Mock data - in real app would call API
    const mockCCNs = [
      { idcc: '1486', name: 'Métallurgie' },
      { idcc: '1516', name: 'Convention collective nationale des organismes de formation' },
      { idcc: '1596', name: 'Bureaux d\'études techniques' },
      { idcc: '1702', name: 'Commerce de détail et de gros' }
    ];
    
    const filtered = mockCCNs.filter(ccn => 
      ccn.name.toLowerCase().includes(query.toLowerCase()) || 
      ccn.idcc.includes(query)
    );
    setCcnSuggestions(filtered);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCCN(ccnQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [ccnQuery]);
  
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
                      <FormLabel className="flex items-center">
                        Nom complet *
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Email *
                        <HelpTooltip text="Adresse email pour les communications officielles" />
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
                      <FormLabel className="flex items-center">
                        Employeur *
                        <HelpTooltip text="Dénomination sociale exacte de votre employeur" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SAS ACME" />
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
                      <FormLabel className="flex items-center">
                        SIREN employeur *
                        <HelpTooltip text="Numéro SIREN à 9 chiffres de votre employeur" />
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="732 829 320"
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
                        <FormLabel>Date de fin *</FormLabel>
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
                      <FormLabel className="flex items-center">
                        Salaire brut mensuel *
                        <HelpTooltip text="Salaire brut mensuel hors primes et avantages" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field}
                            type="number"
                            step="50"
                            min="600"
                            max="25000"
                            placeholder="3200"
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
                      <FormLabel className="flex items-center">
                        Convention collective
                        <HelpTooltip text="Convention collective applicable (IDCC ou nom)" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field} 
                            placeholder="IDCC ou nom de la convention"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setCcnQuery(e.target.value);
                            }}
                          />
                          {ccnSuggestions.length > 0 && ccnQuery && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                              {ccnSuggestions.map((ccn) => (
                                <div
                                  key={ccn.idcc}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                  onClick={() => {
                                    field.onChange(`IDCC ${ccn.idcc} - ${ccn.name}`);
                                    setCcnSuggestions([]);
                                    setCcnQuery('');
                                  }}
                                >
                                  <div className="font-medium">IDCC {ccn.idcc}</div>
                                  <div className="text-gray-600">{ccn.name}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Working regime section */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">Régime de temps de travail</h3>
                
                <FormField
                  control={form.control}
                  name="workingRegime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Régime de temps de travail *
                        <HelpTooltip text="Figure dans la clause 2 de votre contrat." />
                      </FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="35h" id="35h" />
                            <Label htmlFor="35h">35 heures/semaine</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="39h" id="39h" />
                            <Label htmlFor="39h">39 heures/semaine</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="forfait_jours" id="forfait_jours" />
                            <Label htmlFor="forfait_jours">Forfait jours</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="forfait_heures" id="forfait_heures" />
                            <Label htmlFor="forfait_heures">Forfait heures</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {workingRegime === 'forfait_jours' && (
                  <FormField
                    control={form.control}
                    name="forfaitDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de jours forfait/an *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="number"
                            min="120"
                            max="235"
                            placeholder="218"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {workingRegime !== 'forfait_jours' && (
                  <FormField
                    control={form.control}
                    name="contractualHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horaires contractuels *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="09:00-17:00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="actualHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Horaires réels *
                        <HelpTooltip text="Moyenne constatée réellement." />
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="08:30-19:00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Alert className="mt-6 border-justice-primary/20 bg-justice-mist/50">
                <AlertDescription className="flex items-start gap-2">
                  <span className="text-lg">⚖️</span>
                  <div>
                    Vos réponses sont couvertes par le <strong>secret professionnel</strong> (art. 66-5 Loi 1971) 
                    et conservées selon le RGPD.
                  </div>
                </AlertDescription>
              </Alert>

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
