import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KPICardWithTooltip } from '@/components/KPICardWithTooltip';
import { TimelineMini } from './TimelineMini';
import { RisquesChancesWidget } from './RisquesChancesWidget';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FileText, Calendar, AlertTriangle, Star, Plus, Edit2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Dossier, UserRole } from '@/types/dossier';
import { toast } from '@/hooks/use-toast';
import { HoursSuppTable } from '@/components/HoursSuppTable';
import { useDossierSynthesis } from '@/hooks/useDossierSynthesis';

interface SyntheseTabProps {
  dossier: Dossier;
}

// Mock user role - in real app would come from auth context
const currentUserRole = 'lawyer' as UserRole;

export const SyntheseTab = ({ dossier }: SyntheseTabProps) => {
  return (
    <div className="p-6 text-center space-y-4">
      <div className="text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium">Synthèse en cours de préparation</h3>
        <p className="text-sm">Les données de synthèse seront bientôt disponibles.</p>
      </div>
    </div>
  );
};

// Helper functions
function getMotifLabel(motif: string): string {
  const motifLabels: Record<string, string> = {
    'heures_supplementaires': 'Heures supplémentaires',
    'licenciement_abusif': 'Licenciement sans cause réelle et sérieuse',
    'conges_payes': 'Congés payés non pris',
    'indemnite_preavis': 'Indemnité de préavis',
    'prime_precarite': 'Prime de précarité',
    'rappel_salaire': 'Rappel de salaire',
    'discrimination': 'Discrimination',
    'harcelement': 'Harcèlement moral',
  };
  return motifLabels[motif] || motif;
}

function calculateMotifAmount(motif: string, synthesis: any): number {
  // Calculs simplifiés pour l'exemple
  const baseSalary = synthesis.remuneration?.baseSalary || 3500;
  
  switch (motif) {
    case 'heures_supplementaires':
      return Math.round(baseSalary * 0.3); // 30% du salaire
    case 'licenciement_abusif':
      return Math.round(baseSalary * 4); // 4 mois de salaire
    case 'conges_payes':
      return Math.round(baseSalary * 0.15); // 15% du salaire
    case 'indemnite_preavis':
      return Math.round(baseSalary * 2); // 2 mois de salaire
    default:
      return Math.round(baseSalary * 0.2); // 20% du salaire par défaut
  }
}
