import React, { useState, useEffect } from 'react';
import { DossiersAPI } from '@/shared/api/dossiers';
import { Dossier, DashboardMetrics } from '@/shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, Plus, Mail, Upload, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [urgentDossiers, setUrgentDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Récupérer les métriques
      const { data: metricsData } = await DossiersAPI.getDashboardMetrics();
      if (metricsData) setMetrics(metricsData);

      // Récupérer les dossiers urgents
      const { data: dossiersData } = await DossiersAPI.getDossiers();
      if (dossiersData) {
        const urgent = dossiersData
          .filter(d => d.stage !== 'Clos')
          .slice(0, 3); // Les 3 premiers
        setUrgentDossiers(urgent);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenue Maître Dubois
          </h1>
          <p className="text-muted-foreground">Cabinet: SCP Dubois & Associés</p>
        </div>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dossiers Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalDossiers || 0}</div>
            <p className="text-xs text-muted-foreground">2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.dossiersEnCours || 0}</div>
            <p className="text-xs text-muted-foreground">ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.tempsMoyenPreparation || '0h'}</div>
            <p className="text-xs text-green-600">(-{metrics?.tempsPourcentageReduction || 0}%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚀 Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex flex-col gap-2">
              <Plus className="h-5 w-5" />
              Nouveau Dossier
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Mail className="h-5 w-5" />
              Inviter Client
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Upload className="h-5 w-5" />
              Import Bulk
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <CalendarDays className="h-5 w-5" />
              Audiences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dossiers Urgents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📁 Dossiers Urgents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {urgentDossiers.map((dossier) => (
            <div key={dossier.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={dossier.stage === 'Audience' ? 'destructive' : 'secondary'}>
                    {dossier.stage === 'Audience' ? '🔴' : '🟡'}
                  </Badge>
                  <h3 className="font-semibold">{dossier.name}</h3>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/dossier/${dossier.id}`}>Voir</Link>
                  </Button>
                  <Button size="sm">
                    {dossier.stage === 'Audience' ? 'RPVA' : 'Relancer'}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {dossier.stage === 'Audience' 
                  ? `Audience: ${dossier.prochaineAudience} | Manque: conclusions`
                  : `Client: 8/11 étapes | €${dossier.montantReclame?.toLocaleString()} calculés`
                }
              </div>
            </div>
          ))}
          
          {urgentDossiers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun dossier urgent 👍
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;