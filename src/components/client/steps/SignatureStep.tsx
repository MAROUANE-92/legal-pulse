
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StepNavigation } from '../StepNavigation';
import { useClientStepper } from '../ClientStepperProvider';

export const SignatureStep = () => {
  const { formData, savePartial, goTo } = useClientStepper();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedData, setAcceptedData] = useState(false);
  const [signature, setSignature] = useState('');

  const handleSubmit = () => {
    savePartial('signature', {
      acceptedTerms,
      acceptedData,
      signature,
      signatureDate: new Date().toISOString()
    });
    goTo('confirm');
  };

  const isValid = acceptedTerms && acceptedData && signature.trim() !== '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Signature et validation</CardTitle>
          <CardDescription>
            Finalisez votre dossier en signant et acceptant les conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Conditions générales
              </h3>
              <p className="text-sm text-blue-800">
                En cochant cette case, j'accepte les conditions générales d'utilisation 
                et je confirme que les informations fournies sont exactes et complètes.
                Je comprends que toute information inexacte pourrait nuire à mon dossier.
              </p>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                J'accepte les conditions générales d'utilisation et je certifie 
                l'exactitude des informations fournies
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="data"
                checked={acceptedData}
                onCheckedChange={(checked) => setAcceptedData(checked as boolean)}
              />
              <Label htmlFor="data" className="text-sm leading-relaxed">
                J'accepte le traitement de mes données personnelles dans le cadre 
                de ma demande juridique, conformément au RGPD
              </Label>
            </div>
          </div>

          {/* Electronic Signature */}
          <div className="space-y-3">
            <Label htmlFor="signature">Signature électronique</Label>
            <Input
              id="signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Tapez votre nom complet comme signature"
              className="font-serif text-lg"
            />
            <p className="text-xs text-gray-500">
              Votre signature électronique a la même valeur juridique qu'une signature manuscrite
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Récapitulatif de votre dossier</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Informations personnelles: ✓ Complétées</p>
              <p>• Motifs sélectionnés: {formData.motifs?.motifs_selected?.length || 0}</p>
              <p>• Questions spécifiques: ✓ Répondues</p>
              <p>• Pièces téléchargées: {formData.upload?.files?.length || 0} fichier(s)</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <StepNavigation 
              nextLabel="Finaliser mon dossier"
              onNext={handleSubmit}
              nextDisabled={!isValid}
              showPrevious={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
