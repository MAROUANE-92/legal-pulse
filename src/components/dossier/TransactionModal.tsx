
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossierId: string;
  totalClaim: number;
}

const mockMotifs = [
  { id: '1', motif: 'Heures supplémentaires', montant: 25000, checked: true },
  { id: '2', motif: 'Congés payés', montant: 8000, checked: true },
  { id: '3', motif: 'Prime de précarité', montant: 12000, checked: true }
];

export const TransactionModal = ({ isOpen, onClose, dossierId, totalClaim }: TransactionModalProps) => {
  const [montant, setMontant] = useState([totalClaim * 0.7]);
  const [motifs, setMotifs] = useState(mockMotifs);

  const roi = totalClaim > 0 ? Math.round((montant[0] / totalClaim) * 100) : 0;

  const handleMotifChange = (motifId: string, checked: boolean) => {
    setMotifs(prev => prev.map(m => m.id === motifId ? { ...m, checked } : m));
  };

  const handleConfirm = async () => {
    try {
      // POST /simulations
      const simulation = {
        dossierId,
        montant: montant[0],
        motifs: motifs.filter(m => m.checked).map(m => m.id),
        roi
      };
      
      console.log('Simulation created:', simulation);
      
      toast({
        title: "Simulation enregistrée",
        description: `Transaction de ${montant[0].toLocaleString('fr-FR')} € (ROI: ${roi}%)`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la simulation",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Simuler transaction</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Montant transaction: {montant[0].toLocaleString('fr-FR')} €
            </label>
            <Slider
              value={montant}
              onValueChange={setMontant}
              max={totalClaim}
              min={0}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 €</span>
              <span>{totalClaim.toLocaleString('fr-FR')} €</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Motifs inclus</label>
            <div className="space-y-2">
              {motifs.map((motif) => (
                <div key={motif.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={motif.id}
                    checked={motif.checked}
                    onCheckedChange={(checked) => handleMotifChange(motif.id, !!checked)}
                  />
                  <label htmlFor={motif.id} className="text-sm flex-1">
                    {motif.motif} ({motif.montant.toLocaleString('fr-FR')} €)
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-center">
              <span className="text-lg font-bold text-primary">ROI: {roi}%</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Confirmer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
