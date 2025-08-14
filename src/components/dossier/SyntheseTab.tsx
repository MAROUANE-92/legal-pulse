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
  const { data: synthesis, isLoading } = useDossierSynthesis(dossier.id);
  const [editingSalaire, setEditingSalaire] = useState(false);
  const [salaireValue, setSalaireValue] = useState(synthesis?.remuneration?.baseSalary || 3500);
  const [isPiecesCollapsed, setIsPiecesCollapsed] = useState(false);

  const canEdit = currentUserRole === 'lawyer' || currentUserRole === 'paralegal';
  const hideAmounts = currentUserRole === 'client';

  if (isLoading) {
    return <div className="p-6 text-center">Chargement de la synthèse...</div>;
  }

  if (!synthesis) {
    return <div className="p-6 text-center text-muted-foreground">Erreur de chargement des données</div>;
  }

  // Afficher un message si le client n'a pas encore rempli le formulaire
  if (!synthesis.hasClientData) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium">Aucune donnée client disponible</h3>
          <p className="text-sm">Le client n'a pas encore rempli le questionnaire pour ce dossier.</p>
          <p className="text-sm">Statut du dossier: <Badge variant="outline">{synthesis.status}</Badge></p>
        </div>
        <Button variant="outline" size="sm">
          Inviter le client à compléter le formulaire
        </Button>
      </div>
    );
  }

  const handleSalaireEdit = async () => {
    if (!canEdit) return;
    
    try {
      console.log(`PATCH /dossier/${dossier.id}/salaire`, { salaire: salaireValue });
      toast({
        title: "Salaire mis à jour",
        description: `Nouveau salaire: ${salaireValue.toLocaleString('fr-FR')} €`,
      });
      setEditingSalaire(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le salaire",
        variant: "destructive",
      });
    }
  };

  const handleMotifToggle = (motifId: string, currentStatus: string) => {
    if (!canEdit) return;
    
    const newStatus = currentStatus === 'Validé' ? 'En cours' : 'Validé';
    console.log(`PATCH /motifs/${motifId}`, { statut: newStatus });
    toast({
      title: "Statut modifié",
      description: `Motif marqué comme ${newStatus}`,
    });
  };

  const toggleKeyEvidence = (pieceId: string, currentValue: boolean) => {
    if (!canEdit) return;
    
    console.log(`PATCH /pieces/${pieceId}`, { keyEvidence: !currentValue });
    toast({
      title: "Pièce clé modifiée",
      description: currentValue ? "Pièce retirée des clés" : "Pièce marquée comme clé",
    });
  };

  // Transformation des motifs client en format tableau
  const clientMotifs = synthesis.motifs.map((motif: string, index: number) => ({
    id: `motif-${index}`,
    motif: getMotifLabel(motif),
    montant: calculateMotifAmount(motif, synthesis),
    statut: 'En cours' as const
  }));

  // Alertes dynamiques basées sur l'état du dossier
  const alerts = synthesis.hasClientData ? [
    { message: `Dossier en cours d'analyse`, type: "blue" as const },
  ] : [
    { message: "En attente des données client", type: "amber" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Sticky Header */}
      <div id="stickyHeader" className="sticky top-0 bg-white z-10 pb-4">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <KPICardWithTooltip
            icon={FileText}
            title="Pièces validées"
            value={`${dossier.progressPct}%`}
            tooltip="Pourcentage de pièces validées dans le dossier"
            color="primary"
          />
          <KPICardWithTooltip
            icon={FileText}
            title="Montant réclamé"
            value={`${dossier.montantReclame?.toLocaleString('fr-FR')} €`}
            tooltip="Montant total réclamé dans le dossier"
            color="green"
            isAmount
          />
          <KPICardWithTooltip
            icon={Calendar}
            title="Prochaine audience"
            value={new Date(dossier.prochaineAudience || '').toLocaleDateString('fr-FR')}
            tooltip="Date de la prochaine audience programmée"
            color="blue"
          />
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        
        {/* LEFT COLUMN - Main Content */}
        <div className="space-y-6">
          
          {/* Identité + Cadre Contractuel Card */}
          <Card className="rounded-2xl shadow-sm p-5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-main">Identité & Cadre contractuel</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <dl className="space-y-3">
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600 text-sm">Étape</dt>
                  <dd className="text-main font-medium">
                    <Badge variant="secondary">{dossier.stage}</Badge>
                    {canEdit && (
                      <Button variant="outline" size="sm" className="ml-2">
                        <Edit2 className="w-3 h-3 mr-1" />
                        Modifier
                      </Button>
                    )}
                  </dd>
                </div>
                
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600 text-sm">Date audience</dt>
                  <dd className="text-main font-medium">
                    {dossier.prochaineAudience ? 
                      new Date(dossier.prochaineAudience).toLocaleDateString('fr-FR') : 
                      'Non définie'
                    }
                  </dd>
                </div>
                
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600 text-sm">Barreau</dt>
                  <dd className="text-main font-medium">{dossier.barreau?.name || 'Paris'}</dd>
                </div>
                
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600 text-sm">Client</dt>
                  <dd className="text-main font-medium">
                    <div className="space-y-1">
                      <div>{synthesis.identity.fullName || 'Nom non renseigné'} / {synthesis.contract.positionTitle || 'Poste non renseigné'}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>Salaire:</span>
                        {editingSalaire && canEdit ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={salaireValue}
                              onChange={(e) => setSalaireValue(Number(e.target.value))}
                              className="w-20 h-6 text-xs"
                              onBlur={handleSalaireEdit}
                              onKeyDown={(e) => e.key === 'Enter' && handleSalaireEdit()}
                              autoFocus
                            />
                            <span>€</span>
                          </div>
                        ) : (
                          <span 
                            className={`${canEdit ? 'cursor-pointer hover:bg-lavender-mist/25 px-1 rounded' : ''}`}
                            onDoubleClick={() => canEdit && setEditingSalaire(true)}
                          >
                            {hideAmounts ? '***' : `${salaireValue.toLocaleString('fr-FR')} €`}
                          </span>
                        )}
                      </div>
                    </div>
                  </dd>
                </div>
                
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600 text-sm">Employeur</dt>
                  <dd className="text-main font-medium">
                    {synthesis.contract.employerName || 'Employeur non renseigné'} 
                    {synthesis.contract.employerSiren && ` (SIREN ${synthesis.contract.employerSiren})`}
                  </dd>
                </div>
                
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600 text-sm">Contrat</dt>
                  <dd className="text-main font-medium">
                    {synthesis.contract.type || 'CDI'} du {synthesis.contract.startDate || 'Date non renseignée'} au {synthesis.contract.endDate || 'En cours'}
                  </dd>
                </div>
                
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600 text-sm">Convention collective</dt>
                  <dd className="text-main font-medium">{synthesis.contract.ccn || 'À renseigner'}</dd>
                </div>
                
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600 text-sm">Clause horaires</dt>
                  <dd className="text-main font-medium">{synthesis.workingTime.weeklyHours || '35'}h/semaine</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Motifs & Montants Card */}
          <Card className="rounded-2xl shadow-sm p-5">
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold text-main">Motifs & Montants</CardTitle>
              {canEdit && (
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter motif
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {/* Desktop Table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Motif</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientMotifs.map((motif, index) => (
                      <TableRow 
                        key={motif.id} 
                        className={`${index % 2 === 1 ? 'bg-lavender-mist/10' : 'bg-white'} ${motif.statut !== 'Validé' ? 'bg-lavender-mist/25' : ''} hover:bg-lavender-mist/25`}
                      >
                        <TableCell className="font-medium">{motif.motif}</TableCell>
                        <TableCell>{hideAmounts ? '***' : `${motif.montant.toLocaleString('fr-FR')} €`}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={motif.statut === 'Validé' ? 'default' : 'secondary'}
                            className={`cursor-pointer ${canEdit ? 'hover:bg-primary/80' : ''}`}
                            onClick={() => canEdit && handleMotifToggle(motif.id, motif.statut)}
                          >
                            {motif.statut}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile List */}
              <div className="sm:hidden space-y-3">
                {clientMotifs.map((motif) => (
                  <div key={motif.id} className="flex flex-col space-y-2 p-3 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-main">{motif.motif}</span>
                      <Badge 
                        variant={motif.statut === 'Validé' ? 'default' : 'secondary'}
                        className={`cursor-pointer ${canEdit ? 'hover:bg-primary/80' : ''}`}
                        onClick={() => canEdit && handleMotifToggle(motif.id, motif.statut)}
                      >
                        {motif.statut}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Montant: {hideAmounts ? '***' : `${motif.montant.toLocaleString('fr-FR')} €`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Sidebar */}
        <div className="space-y-6">
          
          {/* Risques & Chances Widget */}
          <RisquesChancesWidget dossierId={dossier.id} />
          
          {/* Pièces Clés Card */}
          <Card className="rounded-2xl shadow-sm p-5">
            <Collapsible open={!isPiecesCollapsed} onOpenChange={setIsPiecesCollapsed}>
              <CardHeader className="flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold text-main">Pièces clés</CardTitle>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  )}
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className={`w-4 h-4 transition-transform ${isPiecesCollapsed ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Les pièces clés seront définies après analyse du dossier
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Rappels Card */}
          <Card className="rounded-2xl shadow-sm p-5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-main">Rappels</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <Alert 
                    key={index}
                    className={`border-l-4 ${
                      alert.type === 'red' 
                        ? 'border-l-red-500 bg-red-50'
                        : alert.type === 'amber'
                        ? 'border-l-amber-500 bg-amber-50'
                        : 'border-l-blue-500 bg-blue-50'
                    }`}
                  >
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.type === 'red' ? 'text-red-500' 
                        : alert.type === 'amber' ? 'text-amber-500'
                        : 'text-blue-500'
                    }`} />
                    <AlertDescription className="text-sm">
                      {alert.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Derniers Événements Card */}
          <Card className="rounded-2xl shadow-sm p-5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-main">Derniers événements</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <TimelineMini />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hours Supp Table */}
      <HoursSuppTable />
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
