
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TimelineMini } from '@/components/dossier/TimelineMini';
import { AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';

interface ProgressTabProps {
  token: string;
}

export const ProgressTab = ({ token }: ProgressTabProps) => {
  const progressPct = 65;
  const validatedPieces = 8;
  const totalPieces = 12;

  return (
    <div className="space-y-6">
      {/* Progress KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{progressPct}%</p>
                <p className="text-sm text-gray-600">Dossier complété</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{validatedPieces}</p>
                <p className="text-sm text-gray-600">Pièces validées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-100">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{totalPieces - validatedPieces}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progression globale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Avancement du dossier</span>
                <span className="text-sm text-gray-600">{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-3" />
            </div>
            <p className="text-sm text-gray-600">
              Votre dossier progresse bien. Continuez à transmettre les pièces manquantes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <div className="space-y-3">
        <Alert className="border-l-4 border-l-amber-500 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-sm">
            Convention d'honoraires non signée - merci de nous retourner le document signé
          </AlertDescription>
        </Alert>
        
        <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            Audience de conciliation prévue dans 12 jours
          </AlertDescription>
        </Alert>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <TimelineMini />
        </CardContent>
      </Card>
    </div>
  );
};
