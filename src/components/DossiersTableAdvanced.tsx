
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dossier, SortField, SortDirection } from '@/types/dashboard';

interface DossiersTableAdvancedProps {
  dossiers: Dossier[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const stageColors = {
  'Découverte': 'bg-blue-100 text-blue-800',
  'Rédaction': 'bg-pink-100 text-pink-800',
  'Dépôt': 'bg-purple-100 text-purple-800',
  'Audience': 'bg-indigo-100 text-indigo-800',
  'Clos': 'bg-gray-100 text-gray-800'
};

export const DossiersTableAdvanced = ({ 
  dossiers, 
  currentPage, 
  totalPages, 
  onPageChange,
  sortField,
  sortDirection,
  onSort
}: DossiersTableAdvancedProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const getDeadlineStatus = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 7) return 'urgent';
    return 'normal';
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <SortHeader field="name">Nom du dossier</SortHeader>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Stade
                </th>
                <SortHeader field="nextDeadline">Prochaine échéance</SortHeader>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Avancement pièces
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((dossier) => {
                const deadlineStatus = getDeadlineStatus(dossier.nextDeadline);
                return (
                  <tr 
                    key={dossier.id} 
                    className="border-b border-gray-100 hover:bg-lavender-mist/25 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-main">{dossier.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        className={cn(
                          'rounded-full px-3 py-1',
                          stageColors[dossier.stage]
                        )}
                        variant="secondary"
                      >
                        {dossier.stage}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {formatDate(dossier.nextDeadline)}
                        </span>
                        {deadlineStatus === 'urgent' && (
                          <Badge className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                            < 7j
                          </Badge>
                        )}
                        {deadlineStatus === 'overdue' && (
                          <Badge className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                            Dépassée
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <Progress 
                            value={dossier.progressPct} 
                            className="h-3"
                          />
                          {dossier.progressPct > 50 && (
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                              {dossier.progressPct}%
                            </span>
                          )}
                        </div>
                        {dossier.progressPct <= 50 && (
                          <span className="text-sm text-muted-foreground min-w-[3rem]">
                            {dossier.progressPct}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hover:bg-primary/10"
                      >
                        Ouvrir
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {dossiers.map((dossier) => {
          const deadlineStatus = getDeadlineStatus(dossier.nextDeadline);
          return (
            <div 
              key={dossier.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:bg-lavender-mist/25 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-main">{dossier.name}</h3>
                <Button variant="ghost" size="sm" className="p-1">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stade:</span>
                  <Badge 
                    className={cn(
                      'rounded-full px-2 py-1 text-xs',
                      stageColors[dossier.stage]
                    )}
                    variant="secondary"
                  >
                    {dossier.stage}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Échéance:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {formatDate(dossier.nextDeadline)}
                    </span>
                    {deadlineStatus === 'urgent' && (
                      <Badge className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded-full">
                        < 7j
                      </Badge>
                    )}
                    {deadlineStatus === 'overdue' && (
                      <Badge className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">
                        Dépassée
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pièces:</span>
                    <span className="text-sm font-medium">{dossier.progressPct}%</span>
                  </div>
                  <Progress value={dossier.progressPct} className="h-2" />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="w-full mt-4 bg-primary-light hover:bg-primary/20 border-primary/20"
              >
                Ouvrir
              </Button>
            </div>
          );
        })}
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
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
