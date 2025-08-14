import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import { useStepper } from '../NewStepperProvider';

export function SummaryStep() {
  const { formData, submitQuestionnaire } = useStepper();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const success = await submitQuestionnaire();
      if (success) {
        // Ne pas rediriger, rester sur la page de résumé
        console.log('Questionnaire soumis avec succès');
        // Peut-être afficher un message de succès ou permettre un téléchargement
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculs basiques côté client (les vrais calculs seront côté serveur)
  const estimatedDamages = {
    financial: 
      (formData.damages?.financial?.overtime || 0) +
      (formData.damages?.financial?.unpaid_bonus || 0) +
      (formData.damages?.financial?.expenses || 0),
    moral: 15000, // Estimation fixe pour l'instant
    total: 0
  };
  estimatedDamages.total = estimatedDamages.financial + estimatedDamages.moral;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synthèse de votre dossier</CardTitle>
        <CardDescription>
          Vérifiez les informations avant validation finale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          
          {/* Client */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">👤 Vous</h3>
            <div className="text-sm space-y-1">
              <p>Nom : {formData.identity?.full_name}</p>
              <p>Poste : {formData.contract?.position}</p>
              <p>Statut : {formData.urgency?.employment_status}</p>
            </div>
          </div>

          {/* Entreprise */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">🏢 Entreprise</h3>
            <div className="text-sm space-y-1">
              <p>Nom : {formData.company?.name}</p>
              <p>Effectif : {formData.company?.size}</p>
              <p>Convention : {formData.company?.collective_agreement}</p>
            </div>
          </div>

          {/* Griefs */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">⚖️ Griefs identifiés</h3>
            <div className="text-sm space-y-1">
              <p>Principal : {formData.story?.main_problem}</p>
              <p>Début : {formData.story?.problem_start_date}</p>
              <p>Attente : {formData.story?.expected_outcome}</p>
            </div>
          </div>

          {/* Préjudices */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">💰 Estimation préjudices</h3>
            <div className="text-sm space-y-1">
              <p>Financier : {estimatedDamages.financial}€</p>
              <p>Moral : {estimatedDamages.moral}€</p>
              <p className="font-bold">Total : {estimatedDamages.total}€</p>
            </div>
            <Alert className="mt-2">
              <AlertDescription className="text-xs">
                Estimation préliminaire. Le calcul final sera effectué par votre avocat.
              </AlertDescription>
            </Alert>
          </div>

          {/* Force du dossier */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">📊 Force du dossier</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Preuves</span>
                  <span>85%</span>
                </div>
                <Progress value={85} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Cohérence</span>
                  <span>90%</span>
                </div>
                <Progress value={90} />
              </div>
            </div>
          </div>

          {/* Actions requises */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Actions urgentes :</strong>
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>Obtenir certificat de travail</li>
                <li>Faire attester 2 collègues</li>
                <li>Rassembler fiches de paie manquantes</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Valider et envoyer le dossier'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}