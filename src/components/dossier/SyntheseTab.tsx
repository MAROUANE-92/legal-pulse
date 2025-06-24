import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KPICardWithTooltip } from '@/components/KPICardWithTooltip';
import { TimelineMini } from './TimelineMini';
import { RisquesChancesWidget } from './RisquesChancesWidget';
import { FicheDossier } from './FicheDossier';
import { FileText, Calendar } from 'lucide-react';
import { Dossier, Motif, Piece, UserRole } from '@/types/dossier';

interface SyntheseTabProps {
  dossier: Dossier;
}

// Mock data
const mockMotifs: Motif[] = [
  { id: '1', motif: 'Heures supplémentaires', montant: 25000, statut: 'Validé' },
  { id: '2', motif: 'Congés payés', montant: 8000, statut: 'En cours' },
  { id: '3', motif: 'Prime de précarité', montant: 12000, statut: 'Validé' }
];

const mockPieces: Piece[] = [
  { id: '1', nom: 'Contrat de travail', typeIA: 'contrat', pages: 3, status: 'Validated', keyEvidence: true },
  { id: '2', nom: 'Bulletins de paie', typeIA: 'bulletin', pages: 24, status: 'Validated', keyEvidence: true },
  { id: '3', nom: 'Planning équipes', typeIA: 'planning', pages: 8, status: 'Validated', keyEvidence: false }
];

const mockParties = [
  { label: 'Client', value: 'Jean Dupont', editable: true },
  { label: 'Employeur', value: 'SociétéXYZ', editable: true },
  { label: 'CCN', value: 'Convention Collective Métallurgie', editable: true }
];

// Mock user role - in real app would come from auth context
const currentUserRole: UserRole = 'lawyer';

export const SyntheseTab = ({ dossier }: SyntheseTabProps) => {
  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Fiche dossier complète */}
      <FicheDossier 
        dossier={dossier}
        motifs={mockMotifs}
        pieces={mockPieces}
        userRole={currentUserRole}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parties Card - Keep existing for compatibility */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Parties (Legacy)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockParties.map((partie) => (
                  <div key={partie.label} className="flex justify-between items-center p-3 rounded-lg hover:bg-lavender-mist/25 transition-colors">
                    <span className="font-medium text-muted-foreground">{partie.label}</span>
                    <span className="text-main">{partie.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Motifs Table - Keep existing for compatibility */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Motifs (Legacy)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Motif</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMotifs.map((motif) => (
                    <TableRow key={motif.id} className="hover:bg-lavender-mist/25">
                      <TableCell className="font-medium">{motif.motif}</TableCell>
                      <TableCell>{motif.montant.toLocaleString('fr-FR')} €</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          motif.statut === 'Validé' ? 'bg-green-100 text-green-700' :
                          motif.statut === 'En cours' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {motif.statut}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Risques & Chances Widget */}
          <RisquesChancesWidget dossierId={dossier.id} />
          
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Derniers événements</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineMini />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
