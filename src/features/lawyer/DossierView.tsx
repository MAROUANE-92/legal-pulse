import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DossiersAPI } from '@/shared/api/dossiers';
import { Dossier } from '@/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertTriangle, Euro, Clock, Users, FileText } from 'lucide-react';
import { QuestionnaireSection } from '@/components/dossier/QuestionnaireSection';

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
          {/* Section Questionnaire Client */}
          <QuestionnaireSection dossierId={dossier.id} />
          
          {/* Synthèse en préparation */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤖 Synthèse Intelligente
              </CardTitle>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium">Synthèse en cours de préparation</h3>
                <p className="text-sm">Les données de synthèse seront bientôt disponibles.</p>
              </div>
            </CardContent>
          </Card>
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