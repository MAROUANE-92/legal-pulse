
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Check, AlertTriangle, X, Mail, FileText, HelpCircle } from 'lucide-react';
import { MotifDetail, MotifPieceDetail } from '@/types/motif';
import { cn } from '@/lib/utils';

interface MotifDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  motifDetail: MotifDetail | null;
}

const getStatusIcon = (status: MotifPieceDetail['status']) => {
  switch (status) {
    case 'complete':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'partial':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'missing':
      return <X className="h-4 w-4 text-red-500" />;
  }
};

const getStatusText = (detail: MotifPieceDetail) => {
  if (detail.status === 'complete') return '✅';
  if (detail.status === 'partial') return `⚠️ (${detail.min - detail.ok} manquants)`;
  return '❌';
};

export const MotifDetailDrawer = ({ isOpen, onClose, motifDetail }: MotifDetailDrawerProps) => {
  if (!motifDetail) return null;

  const percentage = Math.round((motifDetail.valid / motifDetail.required) * 100);
  
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'good': return 'bg-green-500';
      case 'progress': return 'bg-orange-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'good': return 'Complet';
      case 'progress': return 'En cours';
      case 'danger': return 'Incomplet';
      default: return 'Inconnu';
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-full max-w-[480px] ml-auto">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DrawerTitle className="text-lg font-semibold">
                {motifDetail.motif}
              </DrawerTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {motifDetail.baseLegale}
              </p>
            </div>
            <DrawerClose className="p-2" />
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Progression : {motifDetail.valid} / {motifDetail.required} pièces
              </span>
              <Badge 
                variant="secondary" 
                className={cn("text-white", getStatusColor(motifDetail.statut))}
              >
                {getStatusLabel(motifDetail.statut)}
              </Badge>
            </div>
            <Progress value={percentage} className="h-3" />
            <p className="text-sm text-muted-foreground">{percentage}% complété</p>
          </div>

          {/* Pieces Table */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Pièces indispensables</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Requis</TableHead>
                  <TableHead className="text-center">Validées</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {motifDetail.details.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{detail.label}</TableCell>
                    <TableCell className="text-center">{detail.min}</TableCell>
                    <TableCell className="text-center">{detail.ok}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(detail.status)}
                        <span className="text-sm">{getStatusText(detail)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Scoring Explanation */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Comment le score est calculé ?</h4>
            </div>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>Formule :</strong> (pièces validées ÷ pièces requises) × 100</p>
              <p><strong>Note :</strong> Les groupes (ex. bulletins ×3) comptent pour 1 case quand le seuil minimum est atteint.</p>
              <p className="text-xs bg-blue-100 p-2 rounded">
                Exemple : Pour "Bulletins de paie (≥3)", il faut au minimum 3 bulletins pour que la case soit validée.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Voir pièces manquantes
            </Button>
            <Button className="w-full" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Relancer client
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
