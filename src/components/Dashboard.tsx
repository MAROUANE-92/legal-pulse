
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Folder, FileCheck, Euro } from 'lucide-react';
import { KPICard } from './KPICard';
import { DossiersTable } from './DossiersTable';
import { EmptyState } from './EmptyState';
import { mockData } from '../data/mockData';

interface DashboardData {
  countActive: number;
  countPendingPieces: number;
  countUpcomingDeadlines: number;
  totalClaim: number;
}

interface Dossier {
  id: string;
  nom: string;
  stade: 'Découverte' | 'Rédaction' | 'Dépôt' | 'Audience' | 'Clos';
  prochaineEcheance: string;
  avancementPieces: number;
  isUrgent?: boolean;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = 10;

  useEffect(() => {
    // Simulate API calls with mock data
    const loadData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setDashboardData(mockData.summary);
      setDossiers(mockData.dossiers);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredDossiers = dossiers.filter(dossier =>
    dossier.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDossiers = filteredDossiers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredDossiers.length / pageSize);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-main mb-2">Mes dossiers</h1>
            <p className="text-muted-foreground">Vue globale de vos contentieux</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark transition-colors"
            size="lg"
          >
            Nouveau dossier
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <KPICard
              icon={Folder}
              title="Dossiers actifs"
              value={dashboardData.countActive}
              color="primary"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <KPICard
              icon={FileCheck}
              title="Pièces à valider"
              value={dashboardData.countPendingPieces}
              color="blue"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <KPICard
              icon={FileCheck}
              title="Échéances < 7 j"
              value={dashboardData.countUpcomingDeadlines}
              color="amber"
              urgent
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <KPICard
              icon={Euro}
              title="Montant réclamé total"
              value={new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(dashboardData.totalClaim)}
              color="green"
              isAmount
            />
          </motion.div>
        </div>

        {/* Dossiers Table or Empty State */}
        {dossiers.length === 0 ? (
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
                  <div className="w-full sm:w-64">
                    <Input
                      placeholder="Rechercher un dossier..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DossiersTable
                  dossiers={paginatedDossiers}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
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
