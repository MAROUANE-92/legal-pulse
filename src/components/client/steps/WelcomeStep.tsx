
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useClientStepper } from '../ClientStepperProvider';

export const WelcomeStep = () => {
  const { goTo } = useClientStepper();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Bienvenue dans votre espace dossier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Nous allons vous accompagner étape par étape pour constituer votre dossier. 
              Cette démarche prend environ 10-15 minutes.
            </p>
            
            {/* Optional video embed placeholder */}
            <div className="bg-gray-100 rounded-lg p-8 mb-6">
              <div className="flex items-center justify-center">
                <div className="bg-primary/10 rounded-full p-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Vidéo explicative (optionnelle)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Ce que nous allons faire ensemble :
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Recueillir vos informations personnelles</li>
                <li>• Identifier les motifs de votre demande</li>
                <li>• Répondre à quelques questions spécifiques</li>
                <li>• Transmettre vos pièces justificatives</li>
                <li>• Finaliser votre dossier</li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button
              size="lg"
              onClick={() => goTo('identity')}
              className="px-8"
            >
              Commencer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
