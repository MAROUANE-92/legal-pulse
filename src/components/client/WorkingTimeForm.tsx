import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Clock, Save, Check } from 'lucide-react';

interface WorkingTimeFormProps {
  submissionId: string;
}

interface WorkingHoursData {
  start: number;
  end: number;
}

export function WorkingTimeForm({ submissionId }: WorkingTimeFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [initialData, setInitialData] = useState<WorkingHoursData>({ start: 7, end: 19 });

  const form = useForm<WorkingHoursData>({
    defaultValues: initialData
  });

  const watchedValues = form.watch();

  // Load existing data on mount
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const { data, error } = await supabase
          .from('answers')
          .select('answer')
          .eq('submission_id', submissionId)
          .eq('question_slug', 'working_hours')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data?.answer) {
          const hours = data.answer as unknown as WorkingHoursData;
          setInitialData(hours);
          form.reset(hours);
        }
      } catch (error: any) {
        console.error('Error loading working hours:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données existantes",
          variant: "destructive"
        });
      }
    };

    loadExistingData();
  }, [submissionId, form]);

  const saveData = async (data: WorkingHoursData) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('answers')
        .upsert({
          submission_id: submissionId,
          question_slug: 'working_hours',
          answer: data as any
        });

      if (error) throw error;

      setLastSaved(new Date());
      toast({
        title: "Données sauvegardées",
        description: `Heures normales : ${data.start}h → ${data.end}h`,
      });
    } catch (error: any) {
      console.error('Error saving working hours:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = async (field: 'start' | 'end') => {
    const currentValues = form.getValues();
    
    // Validate range
    if (currentValues.start >= currentValues.end) {
      toast({
        title: "Heures incorrectes",
        description: "L'heure de début doit être antérieure à l'heure de fin",
        variant: "destructive"
      });
      return;
    }

    // Save if data has changed
    if (currentValues.start !== initialData.start || currentValues.end !== initialData.end) {
      await saveData(currentValues);
      setInitialData(currentValues);
    }
  };

  const formatTime = (hour: number) => {
    return hour.toString().padStart(2, '0') + 'h';
  };

  const getTotalHours = () => {
    const diff = watchedValues.end - watchedValues.start;
    return diff > 0 ? diff : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Heures de travail normales
        </CardTitle>
        <CardDescription>
          Définissez vos heures de début et fin de journée type
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure de début</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        max={23}
                        step={1}
                        placeholder="7"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        onBlur={() => handleBlur('start')}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        h
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure de fin</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        max={23}
                        step={1}
                        placeholder="19"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        onBlur={() => handleBlur('end')}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        h
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>

        {/* Summary display */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-1">
            <div className="font-medium">
              Heures normales : {formatTime(watchedValues.start)} → {formatTime(watchedValues.end)}
            </div>
            <div className="text-sm text-muted-foreground">
              Durée journalière : {getTotalHours()}h
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isSaving && (
              <Badge variant="secondary">
                <Save className="h-3 w-3 mr-1 animate-pulse" />
                Sauvegarde...
              </Badge>
            )}
            {lastSaved && !isSaving && (
              <Badge variant="outline" className="text-green-600">
                <Check className="h-3 w-3 mr-1" />
                Sauvegardé à {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>

        {/* Help text */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Les heures sont saisies au format 24h (0-23)</p>
          <p>• Les données sont automatiquement sauvegardées</p>
          <p>• Ces heures serviront de référence pour le calcul des heures supplémentaires</p>
        </div>
      </CardContent>
    </Card>
  );
}