import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, TrendingUp, Euro, Calendar } from "lucide-react";
import { useOvertimeResults } from "@/hooks/useOvertimeResults";
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function OvertimeResultsCard() {
  const { summary, results, loading, error } = useOvertimeResults();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Analyse Heures Supplémentaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Analyse Heures Supplémentaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            Erreur lors du chargement des résultats : {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary && results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Analyse Heures Supplémentaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun calcul d'heures supplémentaires disponible</p>
            <p className="text-sm mt-2">Uploadez un fichier badge.csv pour commencer l'analyse</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé principal */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Résumé des Heures Supplémentaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Heures Totales</span>
                </div>
                <div className="text-2xl font-bold">{summary.totalHours}h</div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Heures Sup</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">{summary.overtimeHours}h</div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Compensation</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{summary.compensationAmount}€</div>
              </div>
            </div>

            {/* Détail par semaine */}
            {summary.weeklyDetails && summary.weeklyDetails.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Détail par semaine
                </h4>
                <div className="space-y-2">
                  {summary.weeklyDetails.map((week, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">{week.week}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-orange-600">{week.overtime_hours}h sup</span>
                        <span className="text-green-600">{week.compensation}€</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Historique des calculs */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Historique des Calculs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{result.title}</h4>
                    <Badge variant={getImportanceColor(result.importance)}>
                      {result.importance}
                    </Badge>
                  </div>
                  
                  {result.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {result.description}
                    </p>
                  )}
                  
                  {result.event_date && (
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(result.event_date), 'PPpp', { locale: fr })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}