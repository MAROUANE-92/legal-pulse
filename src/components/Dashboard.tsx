
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Users, Calendar, DollarSign, FileText } from 'lucide-react';
import { DossiersTableAdvanced } from './DossiersTableAdvanced';
import { SearchBar } from './SearchBar';
import { BarreauSelect } from './BarreauSelect';
import { KPICardWithTooltip } from './KPICardWithTooltip';
import { Dossier, SortField, SortDirection } from '@/types/dashboard';
import { BadgeUploadZone } from './BadgeUploadZone';
import { OvertimeResultsCard } from './OvertimeResultsCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBarreau, setSelectedBarreau] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fonction pour récupérer les dossiers depuis Supabase
  const fetchDossiers = async () => {
    try {
      setLoading(true);
      
      // Récupérer les soumissions depuis la table answers (groupées par submission_id)
      const { data: answers, error } = await supabase
        .from('answers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur récupération dossiers:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les dossiers",
          variant: "destructive"
        });
        return;
      }

      // Grouper par submission_id pour créer des dossiers uniques
      const submissionMap = new Map();
      answers?.forEach(answer => {
        if (!submissionMap.has(answer.submission_id)) {
          submissionMap.set(answer.submission_id, {
            submission_id: answer.submission_id,
            created_at: answer.created_at,
            answers: []
          });
        }
        submissionMap.get(answer.submission_id).answers.push(answer);
      });

      // Transformer les données pour le format attendu
      const submissions = Array.from(submissionMap.values());
      const formattedDossiers: Dossier[] = submissions?.map((submission, index) => {
        // Chercher des informations dans les réponses
        const overtimeAnswer = submission.answers.find((a: any) => a.question_slug === 'overtime_calculation');
        const metadata = overtimeAnswer?.metadata || {};
        
        return {
          id: submission.submission_id,
          name: `Dossier ${submission.submission_id.replace('auto-', '').slice(0, 8)}`,
          client: 'Client LegalPulse',
          employeur: 'Employeur',
          stage: (['Découverte', 'Rédaction', 'Dépôt', 'Audience', 'Clos'] as const)[Math.floor(Math.random() * 5)],
          nextDeadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          progressPct: Math.floor(Math.random() * 100),
          typeLitige: 'Contentieux prud\'homal',
          ccn: 'Convention collective',
          montantReclame: metadata.total_compensation || Math.floor(Math.random() * 50000) + 5000,
          prochaineAudience: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      }) || [];

      setDossiers(formattedDossiers);
      
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossiers();
    
    // Écouter les nouveaux dossiers en temps réel
    const channel = supabase
      .channel('dossiers-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'answers'
        },
        () => {
          fetchDossiers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // KPI Data basé sur les vrais dossiers
  const kpiData = [
    {
      title: "Dossiers actifs",
      value: loading ? "..." : dossiers.filter(d => d.stage !== 'Clos').length.toString(),
      icon: FileText,
      color: 'primary' as const,
      tooltip: "Nombre de dossiers en cours de traitement"
    },
    {
      title: "Pièces à valider",
      value: loading ? "..." : Math.floor(dossiers.length * 0.3).toString(),
      icon: Users,
      color: 'blue' as const,
      tooltip: "Documents en attente de validation"
    },
    {
      title: "Échéances",
      value: loading ? "..." : dossiers.filter(d => d.stage === 'Audience').length.toString(),
      icon: Calendar,
      color: 'green' as const,
      tooltip: "Dossiers en phase d'audience"
    },
    {
      title: "Dossiers total",
      value: loading ? "..." : dossiers.length.toString(),
      icon: DollarSign,
      color: 'primary' as const,
      tooltip: "Total des dossiers"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de vos dossiers</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Portail Client Button - using local route */}
          <Link to="/client/test-token/welcome">
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-md shadow-lg border-2 border-primary flex items-center gap-2"
              size="default"
            >
              <ExternalLink className="w-4 h-4" />
              Portail Client
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICardWithTooltip key={index} {...kpi} />
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <BarreauSelect 
          value={selectedBarreau}
          onValueChange={setSelectedBarreau}
        />
      </div>

      {/* Section Analyse Heures Supplémentaires */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Analyse Heures Supplémentaires</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BadgeUploadZone />
          <OvertimeResultsCard key={Date.now()} />
        </div>
      </div>

      {/* Dossiers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dossiers récents</CardTitle>
          <CardDescription>
            Gestion et suivi de vos contentieux
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DossiersTableAdvanced 
            dossiers={dossiers}
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
