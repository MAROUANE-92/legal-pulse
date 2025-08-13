

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

const SynthesisOverview = () => {
  const { dossier } = useDossier();
  const { data: pieces = [] } = usePieces(dossier?.id || '');
  const { data: timeline = [] } = useTimeline(dossier?.id || '');
  const hasOvertimeMotif = true; // Mock - would check dossier motifs
  const { data: overtimeData } = useOvertime(dossier?.id || '', hasOvertimeMotif);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMotifKey, setSelectedMotifKey] = useState<string | null>(null);

  // Relance modal state
  const [isRelanceModalOpen, setIsRelanceModalOpen] = useState(false);
  const [missingPiecesToRemind, setMissingPiecesToRemind] = useState<string[]>([]);

  if (!dossier) return null;

  // Evidence statistics
  const evidenceStats = getEvidenceStats(dossier.id);

  // Calculs pour la synthèse probatoire
  const validatedPieces = pieces.filter(p => p.validated).length;
  const totalPieces = pieces.length;
  const validationPercentage = totalPieces > 0 ? Math.round((validatedPieces / totalPieces) * 100) : 0;
  const missingPieces = pieces.filter(p => !p.validated && p.required);

  // Mock motifs data with scoring
  const motifs = [
    {
      motif: 'Heures supplémentaires',
      baseLegale: 'Art. L3121-28 C.trav',
      montant: 8500,
      pieces: 75,
      statut: 'progress' as const,
      motifKey: 'heures_supp'
    },
    {
      motif: 'Licenciement sans cause réelle',
      baseLegale: 'Art. L1235-1 C.trav',
      montant: 15000,
      pieces: 100,
      statut: 'good' as const,
      motifKey: 'licenciement'
    },
    {
      motif: 'Indemnité préavis',
      baseLegale: 'Art. L1234-1 C.trav',
      montant: 3200,
      pieces: 100,
      statut: 'good' as const,
      motifKey: 'indemnite_preavis'
    }
  ];

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'good': return 'bg-green-500';
      case 'progress': return 'bg-orange-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatRelativeDate = (daysFromNow: number) => {
    if (daysFromNow < 0) return `J${daysFromNow}`;
    if (daysFromNow === 0) return "Aujourd'hui";
    return `J+${daysFromNow}`;
  };

  const handlePiecesClick = (motifKey: string) => {
    setSelectedMotifKey(motifKey);
    setIsDrawerOpen(true);
  };

  const openRemindModal = (missing: string[]) => {
    setMissingPiecesToRemind(missing);
    setIsRelanceModalOpen(true);
  };

  const selectedMotifDetail = null; // Mock data supprimé

  return (
    <>
      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* LEFT COLUMN - Cards */}
        <div className="space-y-4">
          {/* Bloc 1: Parties & Procédure */}
          <InfoCard title="Parties & Procédure" icon={Users}>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">{dossier.client || 'Jean Dupont'}</p>
                <p className="text-muted-foreground">vs</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{dossier.employeur || 'SociétéXYZ'}</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>SIREN: 123456789</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-muted-foreground">Juridiction</p>
                <p className="font-medium">CPH Paris</p>
                <p className="text-xs text-muted-foreground">RG: 24/12345</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary" className={cn("text-white", getStatusColor(dossier.stage === 'Rédaction' ? 'progress' : 'good'))}>
                  {dossier.stage}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </InfoCard>

          {/* Bloc 2: Cadre contractuel */}
          <InfoCard title="Cadre contractuel" icon={FileText}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contrat:</span>
                <span className="font-medium">CDI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut:</span>
                <span className="font-medium">Cadre</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Forfait horaire:</span>
                <span className="font-medium">Non</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Durée Horaire:</span>
                <span className="font-medium">35h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CCN:</span>
                <span className="font-medium">Métallurgie</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Période:</span>
                <span className="font-medium">2019-2024</span>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* RIGHT COLUMN - Tables & Timelines */}
        <div className="space-y-6">
          {/* Bloc 3: Motifs & Demandes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Motifs & Demandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Motif</TableHead>
                    <TableHead>Base légale</TableHead>
                    <TableHead className="text-right">Montant €</TableHead>
                    <TableHead className="text-center">Pièces</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {motifs.map((motif, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{motif.motif}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{motif.baseLegale}</TableCell>
                      <TableCell className="text-right">{motif.montant.toLocaleString()} €</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-primary/10"
                          onClick={() => handlePiecesClick(motif.motifKey)}
                        >
                          {motif.pieces}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={cn("w-3 h-3 rounded-full mx-auto", getStatusColor(motif.statut))} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Bloc 4: Synthèse probatoire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Synthèse probatoire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{validatedPieces} / {totalPieces} validées</span>
                    <span className="text-sm text-muted-foreground">{validationPercentage}%</span>
                  </div>
                  <Progress value={validationPercentage} className="h-2" />
                </div>
              </div>
              
              {missingPieces.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-600">Pièces manquantes :</p>
                  <ul className="space-y-1">
                    {missingPieces.map(piece => (
                      <li key={piece.id} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        {piece.nom}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Mail className="h-3 w-3 mr-2" />
                    Relancer client
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bloc 5: Timeline Essentielle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Timeline Essentielle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timeline.map((event, index) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        event.daysFromNow < 0 ? "bg-gray-400" : "bg-primary"
                      )} />
                      {index < timeline.length - 1 && <div className="w-px h-8 bg-gray-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{event.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {formatRelativeDate(event.daysFromNow)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bloc 6: Analyse Heures supp (si présent) */}
          {hasOvertimeMotif && overtimeData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Analyse Heures supplémentaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Semaine ISO</TableHead>
                      <TableHead className="text-right">Δ heures</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overtimeData.weeks.map((week: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>Semaine {index + 1}</TableCell>
                        <TableCell className="text-right">0 h</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold border-t-2">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">0 h</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Indemnités estimées</TableCell>
                      <TableCell className="text-right font-bold text-primary">0 €</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Bloc 8: Rappels & Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Rappels & Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="font-medium text-sm">Audience conciliation</p>
                      <p className="text-xs text-muted-foreground">Dans 88 jours</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Ajouter agenda</Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium text-sm">Convention d'honoraires</p>
                      <p className="text-xs text-muted-foreground">Non signée</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Générer PDF</Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium text-sm">Badge logs CSV</p>
                      <p className="text-xs text-muted-foreground">Pièce manquante</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Voir pièce</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <MotifDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        motifDetail={selectedMotifDetail}
      />

      <RelanceModal
        isOpen={isRelanceModalOpen}
        onClose={() => setIsRelanceModalOpen(false)}
        missingPieces={missingPiecesToRemind}
        clientName={dossier.client || 'Client'}
      />
    </>
  );
};

export default SynthesisOverview;

