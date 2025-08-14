import React from 'react';
import { useForm } from 'react-hook-form';
import { format, differenceInMonths, differenceInYears } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';

interface ContractFormData {
  contract_type: string;
  contract_start: Date | undefined;
  contract_end?: Date | undefined;
  position_title: string;
  idcc_code: string;
  trial_period: string;
  trial_renewal?: string;
  cadre_status: string;
  forfait_clause: string;
  mobility_clause: string;
  non_compete_clause: string;
  // Nouvelle section - Situation actuelle
  employment_status: string;
  termination_date?: Date | undefined;
  termination_reason?: string;
  termination_contested?: string;
  notice_end_date?: Date | undefined;
  notice_exempted?: string;
  sick_leave_start?: Date | undefined;
  sick_leave_work_related?: string;
}

export function ContractStep() {
  const { formData, savePartial, goTo } = useStepper();
  
  const form = useForm<ContractFormData>({
    defaultValues: formData.contract || {
      contract_type: '',
      contract_start: undefined,
      contract_end: undefined,
      position_title: '',
      idcc_code: '',
      trial_period: '',
      trial_renewal: '',
      cadre_status: '',
      forfait_clause: '',
      mobility_clause: '',
      non_compete_clause: '',
      employment_status: '',
      termination_date: undefined,
      termination_reason: '',
      termination_contested: '',
      notice_end_date: undefined,
      notice_exempted: '',
      sick_leave_start: undefined,
      sick_leave_work_related: ''
    }
  });

  const contractType = form.watch('contract_type');
  const trialPeriod = form.watch('trial_period');
  const contractStart = form.watch('contract_start');
  const contractEnd = form.watch('contract_end');
  const employmentStatus = form.watch('employment_status');

  // Calcul d'ancienneté
  const calculateSeniority = () => {
    if (!contractStart) return null;
    
    const endDate = contractEnd || new Date();
    const years = differenceInYears(endDate, contractStart);
    const months = differenceInMonths(endDate, contractStart) % 12;
    
    if (years === 0 && months === 0) return "Moins d'1 mois";
    if (years === 0) return `${months} mois`;
    if (months === 0) return `${years} an${years > 1 ? 's' : ''}`;
    return `${years} an${years > 1 ? 's' : ''} et ${months} mois`;
  };

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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de contrat</FormLabel>
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
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de début</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1970-01-01")
                            }
                            locale={fr}
                            initialFocus
                            captionLayout="dropdown-buttons"
                            fromYear={1970}
                            toYear={new Date().getFullYear()}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Affichage de l'ancienneté */}
                {contractStart && (
                  <div className="md:col-span-1 flex items-center">
                    <Badge variant="secondary" className="text-sm">
                      Ancienneté : {calculateSeniority()}
                    </Badge>
                  </div>
                )}

                {contractType && contractType !== 'CDI' && (
                  <FormField
                    control={form.control}
                    name="contract_end"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de fin / préavis</FormLabel>
                      <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Sélectionner une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date("1970-01-01")
                            }
                            locale={fr}
                            initialFocus
                            captionLayout="dropdown-buttons"
                            fromYear={1970}
                            toYear={new Date().getFullYear() + 10}
                            className="p-3 pointer-events-auto"
                          />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="position_title"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Poste occupé</FormLabel>
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
                render={({ field }) => (
                <FormItem>
                  <FormLabel>IDCC / Convention collective</FormLabel>
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
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Période d'essai ?</FormLabel>
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
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
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

              {/* Section Situation actuelle */}
              <div className="space-y-4 mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold">Situation actuelle</h3>
                
                <FormField
                  control={form.control}
                  name="employment_status"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Êtes-vous toujours en poste ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre situation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="En poste">En poste</SelectItem>
                          <SelectItem value="Rupture terminée">Rupture terminée</SelectItem>
                          <SelectItem value="En préavis">En préavis</SelectItem>
                          <SelectItem value="Arrêt maladie">Arrêt maladie</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Champs conditionnels si pas en poste */}
                {employmentStatus && employmentStatus !== "En poste" && (
                  <>
                    <FormField
                      control={form.control}
                      name="termination_date"
                      render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de fin/rupture</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: fr })
                                  ) : (
                                    <span>Sélectionner une date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1970-01-01")
                                }
                                locale={fr}
                                initialFocus
                                captionLayout="dropdown-buttons"
                                fromYear={1970}
                                toYear={new Date().getFullYear()}
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="termination_reason"
                      render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motif de rupture</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le motif" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Licenciement économique">Licenciement économique</SelectItem>
                              <SelectItem value="Licenciement pour faute">Licenciement pour faute</SelectItem>
                              <SelectItem value="Licenciement pour inaptitude">Licenciement pour inaptitude</SelectItem>
                              <SelectItem value="Rupture conventionnelle">Rupture conventionnelle</SelectItem>
                              <SelectItem value="Démission">Démission</SelectItem>
                              <SelectItem value="Fin de CDD">Fin de CDD</SelectItem>
                              <SelectItem value="Rupture période d'essai">Rupture période d'essai</SelectItem>
                              <SelectItem value="Prise d'acte">Prise d'acte</SelectItem>
                              <SelectItem value="Résiliation judiciaire">Résiliation judiciaire</SelectItem>
                              <SelectItem value="Abandon de poste">Abandon de poste</SelectItem>
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="termination_contested"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contestez-vous cette rupture ?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Oui/Non" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Oui">Oui</SelectItem>
                              <SelectItem value="Non">Non</SelectItem>
                              <SelectItem value="Je ne sais pas">Je ne sais pas</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Champs spécifiques pour "En préavis" */}
                {employmentStatus === "En préavis" && (
                  <>
                    <FormField
                      control={form.control}
                      name="notice_end_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date de fin de préavis</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: fr })
                                  ) : (
                                    <span>Sélectionner une date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date()
                                }
                                locale={fr}
                                initialFocus
                                captionLayout="dropdown-buttons"
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear() + 2}
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notice_exempted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dispensé de préavis ?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Oui/Non" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Oui">Oui</SelectItem>
                              <SelectItem value="Non">Non</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Champs spécifiques pour "Arrêt maladie" */}
                {employmentStatus === "Arrêt maladie" && (
                  <>
                    <FormField
                      control={form.control}
                      name="sick_leave_start"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Depuis quand ?</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: fr })
                                  ) : (
                                    <span>Sélectionner une date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1970-01-01")
                                }
                                locale={fr}
                                initialFocus
                                captionLayout="dropdown-buttons"
                                fromYear={1970}
                                toYear={new Date().getFullYear()}
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sick_leave_work_related"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lié au travail ?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Oui/Non/Peut-être" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Oui">Oui</SelectItem>
                              <SelectItem value="Non">Non</SelectItem>
                              <SelectItem value="Peut-être">Peut-être</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <StepNavigation 
                onNext={form.handleSubmit(onSubmit)}
                onBack={() => goTo('company')}
                nextLabel="Continuer vers rémunération"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}