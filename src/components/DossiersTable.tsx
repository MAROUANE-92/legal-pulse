
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Dossier {
  id: string;
  nom: string;
  stade: 'Découverte' | 'Rédaction' | 'Dépôt' | 'Audience' | 'Clos';
  prochaineEcheance: string;
  avancementPieces: number;
  isUrgent?: boolean;
}

interface DossiersTableProps {
  dossiers: Dossier[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const stadeColors = {
  'Découverte': 'bg-blue-100 text-blue-800',
  'Rédaction': 'bg-yellow-100 text-yellow-800',
  'Dépôt': 'bg-purple-100 text-purple-800',
  'Audience': 'bg-orange-100 text-orange-800',
  'Clos': 'bg-gray-100 text-gray-800'
};

export const DossiersTable = ({ dossiers, currentPage, totalPages, onPageChange }: DossiersTableProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const isDateUrgent = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Nom du dossier
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Stade
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Prochaine échéance
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Avancement pièces
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((dossier) => (
                <tr 
                  key={dossier.id} 
                  className="border-b border-gray-100 hover-lavender-mist transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-main">{dossier.nom}</div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge 
                      className={cn(
                        'rounded-full px-3 py-1',
                        stadeColors[dossier.stade]
                      )}
                      variant="secondary"
                    >
                      {dossier.stade}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {formatDate(dossier.prochaineEcheance)}
                      </span>
                      {isDateUrgent(dossier.prochaineEcheance) && (
                        <Badge className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={dossier.avancementPieces} 
                        className="flex-1 h-2"
                      />
                      <span className="text-sm text-muted-foreground min-w-[3rem]">
                        {dossier.avancementPieces}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-primary-light hover:bg-primary/20 border-primary/20"
                    >
                      Ouvrir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile List */}
      <div className="md:hidden space-y-3">
        {dossiers.map((dossier) => (
          <div 
            key={dossier.id}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-main">{dossier.nom}</h3>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Stade:</span>
                <Badge 
                  className={cn(
                    'rounded-full px-2 py-1 text-xs',
                    stadeColors[dossier.stade]
                  )}
                  variant="secondary"
                >
                  {dossier.stade}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Échéance:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {formatDate(dossier.prochaineEcheance)}
                  </span>
                  {isDateUrgent(dossier.prochaineEcheance) && (
                    <Badge className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded-full">
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pièces:</span>
                <div className="flex items-center gap-2 flex-1 max-w-24">
                  <Progress 
                    value={dossier.avancementPieces} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {dossier.avancementPieces}%
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="w-full mt-3 bg-primary-light hover:bg-primary/20 border-primary/20"
            >
              Ouvrir
            </Button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
