import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DossiersAPI } from '@/shared/api/dossiers';
import { Dossier } from '@/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertTriangle, Euro, Clock, Users, FileText } from 'lucide-react';

function DossierView() {
  const { id } = useParams<{ id: string }>();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDossier = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data } = await DossiersAPI.getDossierById(id);
      if (data) setDossier(data);
      setLoading(false);
    };

    fetchDossier();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="text-muted-foreground">Dossier non trouvé</div>
            <Button asChild className="mt-4">
              <Link to="/">Retour au dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Découverte': return 'bg-blue-100 text-blue-800';
      case 'Rédaction': return 'bg-yellow-100 text-yellow-800';
      case 'Dépôt': return 'bg-orange-100 text-orange-800';
      case 'Audience': return 'bg-red-100 text-red-800';
      case 'Clos': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{dossier.name}</h1>
            <Badge className={getStageColor(dossier.stage)}>
              {dossier.stage}
            </Badge>
          </div>
          <p className="text-muted-foreground">CPH Paris</p>
        </div>
      </div>

      {/* Alerte si audience proche */}
      {dossier.stage === 'Audience' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                Audience dans 3 jours - Actions requises
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="synthese" className="space-y-6">
        <TabsList>
          <TabsTrigger value="synthese">Synthèse</TabsTrigger>
          <TabsTrigger value="pieces">Pièces</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="calculs">Calculs</TabsTrigger>
          <TabsTrigger value="conclusions">Conclusions</TabsTrigger>
          <TabsTrigger value="taches">Tâches</TabsTrigger>
        </TabsList>

        <TabsContent value="synthese" className="space-y-6">
          {/* Synthèse Intelligente */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤖 Synthèse Intelligente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progression */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progression</span>
                  <span className="text-sm text-muted-foreground">{dossier.progressPct}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${dossier.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Analyse IA */}
              <div className="space-y-3">
                <h4 className="font-medium">🤖 Analyse IA:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>147 heures sup détectées (emails)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Harcèlement caractérisé (8 témoignages)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">⚠️</span>
                    <span>Manque: certificat médical burn-out</span>
                  </div>
                </div>
              </div>

              {/* Calculs */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Préjudices Calculés
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Heures sup (147h)</span>
                    <span className="font-medium">4,287€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Congés payés</span>
                    <span className="font-medium">1,456€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Barème Macron</span>
                    <span className="font-medium">8,500€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Harcèlement moral</span>
                    <span className="font-medium">15,000€</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>TOTAL</span>
                    <span>29,243€</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button>
                  🤖 Générer Conclusions
                </Button>
                <Button variant="outline">
                  📄 Export RPVA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Client</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{dossier.client}</div>
                <p className="text-xs text-muted-foreground">{dossier.employeur}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Montant</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">€{dossier.montantReclame?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Réclamé</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Échéance</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{dossier.nextDeadline}</div>
                <p className="text-xs text-muted-foreground">Prochaine action</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pieces">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pièces du Dossier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Fonctionnalité en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Timeline IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Fonctionnalité en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculs">
          <Card>
            <CardHeader>
              <CardTitle>Calculs Légaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Fonctionnalité en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conclusions">
          <Card>
            <CardHeader>
              <CardTitle>Conclusions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Fonctionnalité en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taches">
          <Card>
            <CardHeader>
              <CardTitle>Tâches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Fonctionnalité en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DossierView;