import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export function ConfirmStep() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Questionnaire terminé
          </CardTitle>
          <CardDescription>
            Votre dossier a été transmis avec succès
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <p className="text-lg">
              Merci d'avoir complété le questionnaire !
            </p>
            <p className="text-muted-foreground">
              Nos experts vont maintenant analyser votre dossier et vous contacteront 
              sous 48h pour vous proposer un accompagnement personnalisé.
            </p>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Prochaines étapes :</h3>
            <ul className="text-sm text-left space-y-1">
              <li>• Analyse de votre dossier par nos experts</li>
              <li>• Évaluation des chances de succès</li>
              <li>• Proposition d'accompagnement</li>
              <li>• Contact sous 48h</li>
            </ul>
          </div>

          <Button size="lg" className="w-full">
            Retourner à l'accueil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}