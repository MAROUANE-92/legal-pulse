import React, { useState, useEffect } from 'react';
import { DossiersAPI } from '@/shared/api/dossiers';
import { Dossier } from '@/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';

function DossierList() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [filteredDossiers, setFilteredDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchDossiers = async () => {
      setLoading(true);
      const { data } = await DossiersAPI.getDossiers();
      if (data) {
        setDossiers(data);
        setFilteredDossiers(data);
      }
      setLoading(false);
    };

    fetchDossiers();
  }, []);

  useEffect(() => {
    let filtered = dossiers;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(dossier =>
        dossier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.employeur.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(dossier => dossier.stage === statusFilter);
    }

    setFilteredDossiers(filtered);
  }, [dossiers, searchTerm, statusFilter]);

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tous les Dossiers</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Dossier
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, client, employeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Découverte">Découverte</SelectItem>
                <SelectItem value="Rédaction">Rédaction</SelectItem>
                <SelectItem value="Dépôt">Dépôt</SelectItem>
                <SelectItem value="Audience">Audience</SelectItem>
                <SelectItem value="Clos">Clos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des dossiers */}
      <div className="space-y-4">
        {filteredDossiers.map((dossier) => (
          <Card key={dossier.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{dossier.name}</h3>
                    <Badge className={getStageColor(dossier.stage)}>
                      {dossier.stage}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Client:</span> {dossier.client}
                    </div>
                    <div>
                      <span className="font-medium">Employeur:</span> {dossier.employeur}
                    </div>
                    <div>
                      <span className="font-medium">Montant:</span> €{dossier.montantReclame?.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Échéance:</span> {dossier.nextDeadline}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <div className="text-sm font-medium">{dossier.progressPct}%</div>
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${dossier.progressPct}%` }}
                      />
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/dossier/${dossier.id}`}>
                      Voir le dossier
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDossiers.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Aucun dossier ne correspond aux critères de recherche'
                  : 'Aucun dossier pour le moment'
                }
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DossierList;