
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Mail } from 'lucide-react';
import { useClientStepper } from '../ClientStepperProvider';

export const ConfirmStep = () => {
  const { formData } = useClientStepper();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">
            Dossier transmis avec succès !
          </CardTitle>
          <CardDescription>
            Votre dossier a été créé et transmis à votre avocat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confirmation Details */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">
              Votre dossier en quelques chiffres :
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700">Nom :</span>
                <span className="font-medium ml-2">{formData.identity?.fullName}</span>
              </div>
              <div>
                <span className="text-green-700">Email :</span>
                <span className="font-medium ml-2">{formData.identity?.email}</span>
              </div>
              <div>
                <span className="text-green-700">Motifs :</span>
                <span className="font-medium ml-2">{formData.motifs?.motifs_selected?.length || 0}</span>
              </div>
              <div>
                <span className="text-green-700">Pièces :</span>
                <span className="font-medium ml-2">{formData.upload?.files?.length || 0} fichier(s)</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="font-semibold">Prochaines étapes :</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <p className="text-sm">
                  <strong>Analyse du dossier</strong> - Votre avocat va étudier votre situation (1-2 jours ouvrés)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <p className="text-sm">
                  <strong>Premier contact</strong> - Vous recevrez un email avec l'évaluation préliminaire
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <p className="text-sm">
                  <strong>Suivi personnalisé</strong> - Un espace client sera créé pour suivre l'avancement
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Télécharger le récépissé
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Recevoir par email
            </Button>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Une question ? Contactez-nous à{' '}
              <a href="mailto:contact@justicepulse.fr" className="text-blue-600 hover:underline">
                contact@justicepulse.fr
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
