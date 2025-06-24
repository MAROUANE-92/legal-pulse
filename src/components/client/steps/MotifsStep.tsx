
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StepNavigation } from '../StepNavigation';
import { useClientStepper } from '../ClientStepperProvider';
import { MotifsFormData } from '@/types/questionnaire';

const MOTIFS_OPTIONS = [
  { id: 'heures_supp', label: 'Heures supplémentaires non payées' },
  { id: 'licenciement', label: 'Licenciement abusif' },
  { id: 'harcelement', label: 'Harcèlement moral ou sexuel' },
  { id: 'conges_impayes', label: 'Congés non payés' },
  { id: 'discrimination', label: 'Discrimination' },
  { id: 'accident', label: 'Accident du travail' },
  { id: 'autre', label: 'Autre' }
];

export const MotifsStep = () => {
  const { formData, savePartial } = useClientStepper();
  const [selectedMotifs, setSelectedMotifs] = useState<string[]>(formData.motifs?.selectedMotifs || []);
  const [detailAutre, setDetailAutre] = useState(formData.motifs?.detailAutre || '');

  const { handleSubmit } = useForm<MotifsFormData>();

  useEffect(() => {
    const motifData: MotifsFormData = {
      selectedMotifs,
      detailAutre: selectedMotifs.includes('autre') ? detailAutre : undefined
    };
    savePartial('motifs', motifData);
  }, [selectedMotifs, detailAutre, savePartial]);

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

  const isValid = selectedMotifs.length > 0 && (!selectedMotifs.includes('autre') || detailAutre.trim() !== '');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Motifs de votre réclamation</CardTitle>
        <CardDescription>
          Sélectionnez tous les motifs qui correspondent à votre situation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {motif.label}
                </Label>
              </div>
            ))}
          </div>

          {selectedMotifs.includes('autre') && (
            <div className="space-y-2">
              <Label htmlFor="detailAutre">Précisez votre motif :</Label>
              <Textarea
                id="detailAutre"
                placeholder="Décrivez votre situation..."
                value={detailAutre}
                onChange={(e) => setDetailAutre(e.target.value)}
                className="min-h-[100px]"
              />
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
