
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, FileCheck, Euro } from 'lucide-react';
import { KPICardWithTooltip } from './KPICardWithTooltip';
import { DossiersTableAdvanced } from './DossiersTableAdvanced';
import { EmptyState } from './EmptyState';
import { BarreauSelect } from './BarreauSelect';
import { SearchBar } from './SearchBar';
import { DashboardSummary, Dossier, SortField, SortDirection } from '@/types/dashboard';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [filteredDossiers, setFilteredDossiers] = useState<Dossier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBarreau, setSelectedBarreau] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [loading, setLoading] = useState(true);

  const pageSize = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock dashboard summary
        const mockSummary: DashboardSummary = {
          countActive: 12,
          countPendingPieces: 8,
          countUpcoming: 3,
          totalClaim: 145000
        };

        // Mock dossiers data
        const mockDossiers: Dossier[] = [
          {
            id: '1',
            name: 'Dupont vs Société ABC',
            stage: 'Découverte',
            nextDeadline: '2024-06-30',
            progressPct: 35
          },
          {
            id: '2',
            name: 'Martin - Licenciement abusif',
            stage: 'Rédaction',
            nextDeadline: '2024-06-28',
            progressPct: 70
          },
          {
            id: '3',
            name: 'Durand - Harcèlement moral',
            stage: 'Audience',
            nextDeadline: '2024-06-26',
            progressPct: 90
          },
          {
            id: '4',
            name: 'Société XYZ - Rupture conventionnelle',
            stage: 'Dépôt',
            nextDeadline: '2024-07-05',
            progressPct: 55
          },
          {
            id: '5',
            name: 'Leblanc - Discrimination',
            stage: 'Clos',
            nextDeadline: '2024-05-15',
            progressPct: 100
          }
        ];

        setDashboardData(mockSummary);
        setDossiers(mockDossiers);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort dossiers
  useEffect(() => {
    let filtered = dossiers.filter(dossier =>
      dossier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortField === 'nextDeadline') {
        aValue = new Date(a.nextDeadline).getTime();
        bValue = new Date(b.nextDeadline).getTime();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredDossiers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [dossiers, searchTerm, sortField, sortDirection]);

  const paginatedDossiers = filteredDossiers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredDossiers.length / pageSize);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleNewDossier = async () => {
    try {
      // Simulate POST /api/dossiers
      console.log('Creating new dossier...');
      // TODO: Navigate to new dossier form or open modal
    } catch (error) {
      console.error('Error creating new dossier:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-main mb-2">Mes dossiers</h1>
            <p className="text-muted-foreground">Vue globale de vos contentieux</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <BarreauSelect 
              value={selectedBarreau} 
              onValueChange={setSelectedBarreau}
            />
            <Button 
              className="bg-primary hover:bg-primary-dark transition-colors"
              size="lg"
              onClick={handleNewDossier}
            >
              Nouveau dossier
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <KPICardWithTooltip
              icon={Folder}
              title="Dossiers actifs"
              value={dashboardData.countActive}
              tooltip="Tous les dossiers à l'état Découverte → Audience"
              color="primary"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <KPICardWithTooltip
              icon={FileCheck}
              title="Pièces à valider"
              value={dashboardData.countPendingPieces}
              tooltip="Pièces IA <70 % de confiance ou non confirmées"
              color="blue"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <KPICardWithTooltip
              icon={FileCheck}
              title="Échéances < 7 j"
              value={dashboardData.countUpcoming}
              tooltip="Bureau, répliques, audiences dans 7 jours"
              color="white"
              urgent
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <KPICardWithTooltip
              icon={Euro}
              title="Montant réclamé total"
              value={new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(dashboardData.totalClaim)}
              tooltip="Somme de toutes les demandes actives"
              color="green"
              isAmount
            />
          </motion.div>
        </div>

        {/* Dossiers Table or Empty State */}
        {dashboardData.countActive === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card className="rounded-2xl shadow-sm border-divider-gray-300">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl text-main">
                    Dossiers ({filteredDossiers.length})
                  </CardTitle>
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <DossiersTableAdvanced
                  dossiers={paginatedDossiers}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
