
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dossier, SortField, SortDirection } from '@/types/dashboard';

interface DossiersTableAdvancedProps {
  dossiers: Dossier[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onDossierClick?: (dossier: Dossier) => void;
}

const getStageColor = (stage: Dossier['stage']) => {
  switch (stage) {
    case 'Découverte': return 'bg-blue-100 text-blue-700';
    case 'Rédaction': return 'bg-yellow-100 text-yellow-700';
    case 'Dépôt': return 'bg-orange-100 text-orange-700';
    case 'Audience': return 'bg-purple-100 text-purple-700';
    case 'Clos': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const DossiersTableAdvanced = ({
  dossiers,
  currentPage,
  totalPages,
  onPageChange,
  sortField,
  sortDirection,
  onSort,
  onDossierClick
}: DossiersTableAdvancedProps) => {
  const navigate = useNavigate();

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const handleOpenDossier = (dossier: Dossier) => {
    if (onDossierClick) {
      onDossierClick(dossier);
    } else {
      navigate(`/dossier/${dossier.id}`);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center gap-2">
                Nom du dossier
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead>Étape</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSort('nextDeadline')}
            >
              <div className="flex items-center gap-2">
                Prochaine échéance
                <SortIcon field="nextDeadline" />
              </div>
            </TableHead>
            <TableHead>Progression</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dossiers.map((dossier) => (
            <TableRow key={dossier.id} className="hover:bg-lavender-mist/25">
              <TableCell className="font-medium">{dossier.name}</TableCell>
              <TableCell>
                <Badge className={getStageColor(dossier.stage)}>
                  {dossier.stage}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(dossier.nextDeadline).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Progress value={dossier.progressPct} className="h-2" />
                  <span className="text-xs text-muted-foreground">{dossier.progressPct}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDossier(dossier)}
                  className="bg-primary-light hover:bg-primary/20 border-primary/20"
                >
                  Ouvrir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <span className="flex items-center px-3 text-sm">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};
