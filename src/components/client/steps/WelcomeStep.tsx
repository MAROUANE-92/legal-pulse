

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
            🤝 Bienvenue !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Vous êtes sur le point de confier votre dossier à votre avocat.
              Cette démarche peut sembler longue ou technique ; notre rôle est justement de vous guider étape par étape – comptez 10 à 15 minutes (vous pourrez mettre en pause et revenir quand vous le souhaitez).
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

          {/* New empathic content */}
          <Card className="bg-slate-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3 text-slate-800">
              🗺️ Le parcours devant le Conseil de prud'hommes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 font-semibold">Étape</th>
                    <th className="text-left py-2 font-semibold">Ce qui va se passer</th>
                    <th className="text-left py-2 font-semibold">Votre implication</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-medium">1. Saisine</td>
                    <td className="py-2">Nous déposons officiellement votre dossier.</td>
                    <td className="py-2">Fournir vos pièces & infos.</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-medium">2. Conciliation</td>
                    <td className="py-2">Tentative d'accord rapide avec l'employeur.</td>
                    <td className="py-2">Pas toujours nécessaire de comparaître.</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-medium">3. Audience de jugement</td>
                    <td className="py-2">Plaidoiries, examen des preuves.</td>
                    <td className="py-2">Présence souvent requise.</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">4. Décision</td>
                    <td className="py-2">Le Conseil rend un jugement exécutoire.</td>
                    <td className="py-2">Suivi de l'exécution ou appel.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h4 className="font-semibold mt-6 mb-2 text-slate-800">📂 Pourquoi vos pièces sont capitales ?</h4>
            <p className="text-sm mb-3">
              Le juge décide sur la base d'éléments écrits.
            </p>
            <p className="text-sm">
              Contrat, bulletins de paie, badgeages, e-mails, messages WhatsApp… Plus vos preuves sont complètes, plus vos chances de succès augmentent – et plus vite nous pourrons rédiger vos conclusions.
            </p>
            
            <h4 className="font-semibold mt-6 mb-2 text-slate-800">🔜 Concrètement, que va-t-on faire ensemble ?</h4>
            <ul className="text-sm space-y-1">
              <li>• Répondre à quelques questions (identité, contrat, contexte).</li>
              <li>• Sélectionner les motifs de votre demande (heures sup, licenciement…).</li>
              <li>• Téléverser chaque document demandé (formats PDF, JPG, CSV…).</li>
              <li>• Signer électroniquement notre convention d'honoraires.</li>
              <li>• Suivre l'avancement grâce à la barre de progression violette en haut de l'écran.</li>
            </ul>
            
            <p className="text-sm mt-3 text-blue-700 bg-blue-50 p-3 rounded-lg">
              Vous pouvez enregistrer et quitter à tout moment ; un lien de reprise vous sera envoyé par e-mail.
            </p>
            
            <h4 className="font-semibold mt-6 mb-2 text-slate-800">🔒 Sécurité & confidentialité</h4>
            <p className="text-xs text-gray-600">
              Vos données sont chiffrées et ne seront consultées que par votre avocat.
              Elles seront conservées le temps strictement nécessaire à la procédure, puis archivées ou supprimées conformément au RGPD.
            </p>
          </Card>

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

