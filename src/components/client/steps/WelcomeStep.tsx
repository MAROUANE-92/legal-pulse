
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

          {/* New procedure explanation card */}
          <Card className="bg-slate-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-2 text-slate-800">
              Comment se déroule une procédure prud'homale&nbsp;?
            </h3>
            <ol className="pl-5 list-decimal space-y-1 text-sm">
              <li><b>Saisine</b> – votre dossier est déposé auprès du Conseil.</li>
              <li><b>Conciliation</b> – tentative d'accord rapide avec l'employeur.</li>
              <li><b>Audience de jugement</b> – plaidoiries et examen des preuves.</li>
              <li><b>Décision</b> – le Conseil rend un jugement exécutoire.</li>
            </ol>
            
            <h4 className="font-semibold mt-4 text-slate-800">Pourquoi vos pièces sont cruciales ?</h4>
            <p className="text-sm mt-1">
              Le juge statue uniquement sur des <strong>preuves écrites</strong> :
              contrat, bulletins de paie, badgeages, e-mails, échanges WhatsApp…
              Plus elles sont complètes, plus vos chances de succès augmentent.
            </p>
            
            <h4 className="font-semibold mt-4 text-slate-800">Vos prochaines actions</h4>
            <ul className="text-sm list-disc pl-5 space-y-0.5">
              <li>Répondre aux questions du formulaire</li>
              <li>Téléverser chaque document demandé</li>
              <li>Suivre l'avancement via la barre violette en haut de l'écran</li>
            </ul>
            
            <p className="text-xs text-gray-500 mt-4">
              Vos données sont chiffrées et restent strictement confidentielles.
            </p>
          </Card>

          <Separator />

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
