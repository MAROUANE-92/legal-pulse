
import { useState } from 'react';
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

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBarreau, setSelectedBarreau] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Mock dossiers data - only Marouane vs Mordor
  const mockDossiers: Dossier[] = [
    {
      id: '1',
      name: 'Marouane vs Mordor',
      stage: 'Découverte',
      nextDeadline: '2024-02-15',
      progressPct: 35,
      typeLitige: 'Heures supplémentaires'
    }
  ];

  const kpiData = [
    {
      title: "Dossiers actifs",
      value: "1",
      icon: FileText,
      color: 'primary' as const,
      tooltip: "Nombre de dossiers en cours de traitement"
    },
    {
      title: "Pièces à valider",
      value: "8",
      icon: Users,
      color: 'blue' as const,
      tooltip: "Documents en attente de validation"
    },
    {
      title: "Échéances",
      value: "15j",
      icon: Calendar,
      color: 'green' as const,
      tooltip: "Prochaine échéance importante"
    },
    {
      title: "Montant réclamé",
      value: "€847K",
      icon: DollarSign,
      color: 'primary' as const,
      tooltip: "Total des montants en réclamation"
    }
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de vos dossiers</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Portail Client Button - highlighted */}
          <a 
            href="https://preview--legal-pulse-equilibre.lovable.app/client/test-token/welcome"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-primary hover:bg-primary/90 shadow-lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              Portail Client
            </Button>
          </a>
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
            dossiers={mockDossiers}
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
