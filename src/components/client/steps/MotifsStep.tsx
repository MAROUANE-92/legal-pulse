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
import { HelpTooltip } from '@/components/HelpTooltip';

// Motifs selon le schéma YAML exact
const MOTIFS_OPTIONS = [
  { 
    code: 'overtime', 
    label: 'Heures supplémentaires non payées',
    tooltip: 'Travail au-delà de 35h/semaine sans majoration (Art. L3121-22 Code du travail)'
  },
  { 
    code: 'dismissal', 
    label: 'Licenciement abusif / irrégulier',
    tooltip: 'Licenciement sans cause réelle et sérieuse (Art. L1232-1)'
  },
  { 
    code: 'harassment', 
    label: 'Harcèlement moral / sexuel',
    tooltip: 'Agissements répétés ayant pour effet une dégradation des conditions de travail (Art. L1152-1)'
  },
  { 
    code: 'unpaid_leave', 
    label: 'Congés non payés / soldes erronés',
    tooltip: 'Non-paiement des congés payés acquis (Art. L3141-1 et suivants)'
  },
  { 
    code: 'discrimination', 
    label: 'Discrimination',
    tooltip: 'Traitement défavorable fondé sur un critère prohibé (Art. L1132-1)'
  },
  { 
    code: 'accident', 
    label: 'Accident du travail / MP',
    tooltip: 'Accident survenu par le fait ou à l\'occasion du travail (Art. L411-1 Code SS)'
  },
  { 
    code: 'other', 
    label: 'Autre',
    tooltip: 'Autre motif de réclamation en droit du travail'
  }
];

// Schema selon le YAML : motifs_selected
const motifsSchema = z.object({
  motifs_selected: z.array(z.string()).min(1, "Sélectionnez au moins un motif"),
  other_description: z.string().optional()
}).refine((data) => {
  if (data.motifs_selected.includes('other')) {
    return data.other_description && data.other_description.trim().length >= 20;
  }
  return true;
}, {
  message: "Veuillez préciser votre motif (20 caractères minimum)",
  path: ["other_description"]
});

type MotifsFormData = z.infer<typeof motifsSchema>;

export const MotifsStep = () => {
  const { formData, savePartial } = useClientStepper();
  const [selectedMotifs, setSelectedMotifs] = useState<string[]>(
    formData.motifs?.motifs_selected || []
  );
  const [otherDescription, setOtherDescription] = useState(
    formData.motifs?.other_description || ''
  );

  const form = useForm<MotifsFormData>({
    resolver: zodResolver(motifsSchema),
    mode: 'onChange',
    defaultValues: {
      motifs_selected: selectedMotifs,
      other_description: otherDescription
    }
  });

  useEffect(() => {
    const motifData = {
      motifs_selected: selectedMotifs,
      other_description: selectedMotifs.includes('other') ? otherDescription : undefined
    };
    savePartial('motifs', motifData);
    
    // Update form values for validation
    form.setValue('motifs_selected', selectedMotifs);
    form.setValue('other_description', otherDescription);
  }, [selectedMotifs, otherDescription]);

  const handleMotifChange = (motifCode: string, checked: boolean) => {
    if (checked) {
      setSelectedMotifs(prev => [...prev, motifCode]);
    } else {
      setSelectedMotifs(prev => prev.filter(code => code !== motifCode));
      if (motifCode === 'other') {
        setOtherDescription('');
      }
    }
  };

  const onSubmit = () => {
    // Navigation will be handled by StepNavigation
  };

  // Simplifier la validation : si au moins un motif est sélectionné ET si "other" est sélectionné, alors other_description doit être valide
  const isValid = selectedMotifs.length > 0 && 
    (!selectedMotifs.includes('other') || (otherDescription.trim().length >= 20));

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Motif(s) de réclamation</CardTitle>
        <CardDescription>
          Sélectionnez vos motifs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {MOTIFS_OPTIONS.map((motif) => (
              <div key={motif.code} className="flex items-center space-x-2">
                <Checkbox
                  id={motif.code}
                  checked={selectedMotifs.includes(motif.code)}
                  onCheckedChange={(checked) => 
                    handleMotifChange(motif.code, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={motif.code}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  {motif.label}
                  <HelpTooltip text={motif.tooltip} />
                </Label>
              </div>
            ))}
          </div>

          {selectedMotifs.includes('other') && (
            <div className="space-y-2">
              <Label htmlFor="other_description" className="flex items-center">
                Décrivez votre réclamation :
                <HelpTooltip text="Décrivez précisément votre situation (minimum 20 caractères)" />
              </Label>
              <Textarea
                id="other_description"
                placeholder="Décrivez votre situation en détail..."
                value={otherDescription}
                onChange={(e) => setOtherDescription(e.target.value)}
                className="min-h-[100px]"
              />
              {otherDescription.trim().length > 0 && otherDescription.trim().length < 20 && (
                <p className="text-sm text-red-600">
                  {20 - otherDescription.trim().length} caractères restants
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