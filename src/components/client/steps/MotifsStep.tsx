
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StepNavigation } from '../StepNavigation';
import { useClientStepper } from '../ClientStepperProvider';
import { MotifsFormData } from '@/types/questionnaire';
import { HelpTooltip } from '@/components/HelpTooltip';

const MOTIFS_OPTIONS = [
  { 
    id: 'heures_supp', 
    label: 'Heures supplémentaires non payées',
    tooltip: 'Travail au-delà de 35h/semaine sans majoration (Art. L3121-22 Code du travail)'
  },
  { 
    id: 'licenciement', 
    label: 'Licenciement abusif',
    tooltip: 'Licenciement sans cause réelle et sérieuse (Art. L1232-1)'
  },
  { 
    id: 'harcelement', 
    label: 'Harcèlement moral ou sexuel',
    tooltip: 'Agissements répétés ayant pour effet une dégradation des conditions de travail (Art. L1152-1)'
  },
  { 
    id: 'conges_impayes', 
    label: 'Congés non payés',
    tooltip: 'Non-paiement des congés payés acquis (Art. L3141-1 et suivants)'
  },
  { 
    id: 'discrimination', 
    label: 'Discrimination',
    tooltip: 'Traitement défavorable fondé sur un critère prohibé (Art. L1132-1)'
  },
  { 
    id: 'accident', 
    label: 'Accident du travail',
    tooltip: 'Accident survenu par le fait ou à l\'occasion du travail (Art. L411-1 Code SS)'
  },
  { 
    id: 'autre', 
    label: 'Autre',
    tooltip: 'Autre motif de réclamation en droit du travail'
  }
];

const motifsSchema = z.object({
  selectedMotifs: z.array(z.string()).min(1, "Sélectionnez au moins un motif"),
  detailAutre: z.string().optional()
}).refine((data) => {
  if (data.selectedMotifs.includes('autre')) {
    return data.detailAutre && data.detailAutre.trim().length >= 20;
  }
  return true;
}, {
  message: "Veuillez préciser votre motif (20 caractères minimum)",
  path: ["detailAutre"]
});

export const MotifsStep = () => {
  const { formData, savePartial } = useClientStepper();
  const [selectedMotifs, setSelectedMotifs] = useState<string[]>(formData.motifs?.selectedMotifs || []);
  const [detailAutre, setDetailAutre] = useState(formData.motifs?.detailAutre || '');

  const form = useForm<MotifsFormData>({
    resolver: zodResolver(motifsSchema),
    mode: 'onChange',
    defaultValues: {
      selectedMotifs,
      detailAutre
    }
  });

  useEffect(() => {
    const motifData: MotifsFormData = {
      selectedMotifs,
      detailAutre: selectedMotifs.includes('autre') ? detailAutre : undefined
    };
    savePartial('motifs', motifData);
    
    // Update form values for validation
    form.setValue('selectedMotifs', selectedMotifs);
    form.setValue('detailAutre', detailAutre);
  }, [selectedMotifs, detailAutre, savePartial, form]);

  const handleMotifChange = (motifId: string, checked: boolean) => {
    if (checked) {
      setSelectedMotifs(prev => [...prev, motifId]);
    } else {
      setSelectedMotifs(prev => prev.filter(id => id !== motifId));
      if (motifId === 'autre') {
        setDetailAutre('');
      }
    }
  };

  const onSubmit = () => {
    // Navigation will be handled by StepNavigation
  };

  const isValid = form.formState.isValid && selectedMotifs.length > 0 && 
    (!selectedMotifs.includes('autre') || (detailAutre.trim().length >= 20));

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Motifs de votre réclamation</CardTitle>
        <CardDescription>
          Sélectionnez tous les motifs qui correspondent à votre situation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {MOTIFS_OPTIONS.map((motif) => (
              <div key={motif.id} className="flex items-center space-x-2">
                <Checkbox
                  id={motif.id}
                  checked={selectedMotifs.includes(motif.id)}
                  onCheckedChange={(checked) => 
                    handleMotifChange(motif.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={motif.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  {motif.label}
                  <HelpTooltip text={motif.tooltip} />
                </Label>
              </div>
            ))}
          </div>

          {selectedMotifs.includes('autre') && (
            <div className="space-y-2">
              <Label htmlFor="detailAutre" className="flex items-center">
                Précisez votre motif :
                <HelpTooltip text="Décrivez précisément votre situation (minimum 20 caractères)" />
              </Label>
              <Textarea
                id="detailAutre"
                placeholder="Décrivez votre situation en détail..."
                value={detailAutre}
                onChange={(e) => setDetailAutre(e.target.value)}
                className="min-h-[100px]"
              />
              {detailAutre.trim().length > 0 && detailAutre.trim().length < 20 && (
                <p className="text-sm text-red-600">
                  {20 - detailAutre.trim().length} caractères restants
                </p>
              )}
            </div>
          )}

          <StepNavigation 
            nextDisabled={!isValid}
            nextLabel="Continuer vers les questions"
          />
        </form>
      </CardContent>
    </Card>
  );
};
