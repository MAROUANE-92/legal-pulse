
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Users, Calendar, DollarSign, FileText } from 'lucide-react';
import { DossiersTableAdvanced } from './DossiersTableAdvanced';
import { SearchBar } from './SearchBar';
import { BarreauSelect } from './BarreauSelect';
import { KPICardWithTooltip } from './KPICardWithTooltip';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBarreau, setSelectedBarreau] = useState('all');

  const kpiData = [
    {
      title: "Dossiers actifs",
      value: "42",
      icon: FileText,
      trend: "+12%",
      trendUp: true,
      tooltip: "Nombre de dossiers en cours de traitement"
    },
    {
      title: "Pièces à valider",
      value: "8",
      icon: Users,
      trend: "-3",
      trendUp: false,
      tooltip: "Documents en attente de validation"
    },
    {
      title: "Échéances",
      value: "15j",
      icon: Calendar,
      trend: "Moyenne",
      trendUp: true,
      tooltip: "Prochaine échéance importante"
    },
    {
      title: "Montant réclamé",
      value: "€847K",
      icon: DollarSign,
      trend: "+18%",
      trendUp: true,
      tooltip: "Total des montants en réclamation"
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
          {/* Test Portail Client Button */}
          <Link 
            to="/client/test-token/welcome" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Test Portail Client
            </Button>
          </Link>
          
          {/* Nouveau Dossier Button */}
          <Link 
            to="/client/new-dossier/welcome" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau dossier
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
            placeholder="Rechercher un dossier, client, adversaire..."
          />
        </div>
        <BarreauSelect 
          value={selectedBarreau}
          onChange={setSelectedBarreau}
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
            searchQuery={searchQuery}
            selectedBarreau={selectedBarreau}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
