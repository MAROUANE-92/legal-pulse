
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Send } from 'lucide-react';

interface RelanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingPieces: string[];
  clientName?: string;
}

export const RelanceModal = ({ isOpen, onClose, missingPieces, clientName = "Client" }: RelanceModalProps) => {
  const [selectedPieces, setSelectedPieces] = useState<string[]>(missingPieces);
  const [message, setMessage] = useState(`Bonjour ${clientName},

Nous avons besoin des pièces suivantes pour compléter votre dossier :

${missingPieces.map(piece => `• ${piece}`).join('\n')}

Merci de nous les transmettre dans les meilleurs délais.

Cordialement,`);

  const handlePieceToggle = (piece: string) => {
    setSelectedPieces(prev => 
      prev.includes(piece) 
        ? prev.filter(p => p !== piece)
        : [...prev, piece]
    );
  };

  const handleSend = () => {
    console.log('Sending reminder for pieces:', selectedPieces);
    console.log('Message:', message);
    // Here you would implement the actual email sending logic
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Relancer le client
          </SheetTitle>
          <SheetDescription>
            Sélectionnez les pièces à demander et personnalisez le message
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Pieces checklist */}
          <div>
            <h4 className="font-medium mb-3">Pièces manquantes</h4>
            <div className="space-y-2">
              {missingPieces.map((piece) => (
                <div key={piece} className="flex items-center space-x-2">
                  <Checkbox
                    id={piece}
                    checked={selectedPieces.includes(piece)}
                    onCheckedChange={() => handlePieceToggle(piece)}
                  />
                  <label
                    htmlFor={piece}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {piece}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <h4 className="font-medium mb-3">Message</h4>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Rédigez votre message..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSend} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Envoyer la relance
            </Button>
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
