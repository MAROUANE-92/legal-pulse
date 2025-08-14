import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useStepper } from '../NewStepperProvider';

export function ProofInventoryStep() {
  const { formData, savePartial, goTo } = useStepper();
  const [availableProofs, setAvailableProofs] = useState<Record<string, boolean>>(
    formData.proof_inventory || {}
  );

  const proofCategories = {
    contract: {
      title: "Documents contractuels",
      items: [
        'Contrat de travail',
        'Avenants',
        'Fiches de paie (12 derniers mois)',
        'Certificat de travail',
        'Attestation Pôle Emploi',
        'Solde de tout compte'
      ]
    },
    dispute: {
      title: "Documents du litige",
      items: [
        'Courriers avertissement',
        'Convocations',
        'Lettre de licenciement',
        'Échanges avec RH',
        'Compte-rendus CSE'
      ]
    },
    evidence: {
      title: "Preuves et témoignages",
      items: [
        'Emails professionnels',
        'SMS/WhatsApp',
        'Enregistrements audio',
        'Photos',
        'Attestations collègues',
        'Certificats médicaux',
        'Main courante/plainte'
      ]
    },
    context: {
      title: "Documents contextuels",
      items: [
        'Convention collective',
        'Règlement intérieur',
        'Organigramme',
        'Fiches de poste'
      ]
    }
  };

  const handleSubmit = () => {
    savePartial('proof_inventory', availableProofs);
    goTo('documents');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventaire de vos preuves</CardTitle>
        <CardDescription>
          Cochez tous les documents que vous POUVEZ obtenir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(proofCategories).map(([key, category]) => (
            <div key={key} className="space-y-3">
              <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.items.map(item => (
                  <label key={item} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={availableProofs[`${key}.${item}`] || false}
                      onCheckedChange={(checked) => 
                        setAvailableProofs(prev => ({
                          ...prev,
                          [`${key}.${item}`]: checked as boolean
                        }))
                      }
                    />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">
                Documents cochés : {Object.values(availableProofs).filter(Boolean).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Plus vous avez de preuves, plus votre dossier sera solide
              </p>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Continuer vers l'upload des documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}