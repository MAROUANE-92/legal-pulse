

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoCard } from '@/components/ui/info-card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDossier } from './DossierLayout';
import { usePieces } from '@/hooks/usePieces';
import { useTimeline } from '@/hooks/useTimeline';
import { useOvertime } from '@/hooks/useOvertime';
import { MotifDetailDrawer } from './MotifDetailDrawer';
import { RelanceModal } from '@/components/RelanceModal';
// Mock data supprimé
import { getEvidenceStats } from '@/lib/evidenceStats';
import { 
  Users, 
  FileText, 
  Scale, 
  Clock, 
  Calendar, 
  AlertTriangle,
  Edit,
  Mail,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useDossierSynthesis } from '@/hooks/useDossierSynthesis';

const SynthesisOverview = () => {
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

function getMotifBaseLegale(motif: string): string {
  const basesLegales: Record<string, string> = {
    'heures_supplementaires': 'Art. L3121-28 C.trav',
    'licenciement_abusif': 'Art. L1235-1 C.trav',
    'conges_payes': 'Art. L3141-1 C.trav',
    'indemnite_preavis': 'Art. L1234-1 C.trav',
    'prime_precarite': 'Art. L1243-8 C.trav',
    'rappel_salaire': 'Art. L3221-3 C.trav',
    'discrimination': 'Art. L1132-1 C.trav',
    'harcelement': 'Art. L1152-1 C.trav',
  };
  return basesLegales[motif] || 'Base légale à déterminer';
}

function calculateMotifAmount(motif: string, synthesis: any): number {
  const baseSalary = synthesis.remuneration?.baseSalary || 3500;
  
  switch (motif) {
    case 'heures_supplementaires':
      return Math.round(baseSalary * 0.3);
    case 'licenciement_abusif':
      return Math.round(baseSalary * 4);
    case 'conges_payes':
      return Math.round(baseSalary * 0.15);
    case 'indemnite_preavis':
      return Math.round(baseSalary * 2);
    default:
      return Math.round(baseSalary * 0.2);
  }
}

export default SynthesisOverview;

