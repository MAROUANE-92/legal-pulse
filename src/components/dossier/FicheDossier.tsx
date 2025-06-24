
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Star, Plus, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { Dossier, Motif, Piece, UserRole } from '@/types/dossier';
import { toast } from '@/hooks/use-toast';

interface FicheDossierProps {
  dossier: Dossier;
  motifs: Motif[];
  pieces: Piece[];
  userRole: UserRole;
}

export const FicheDossier = ({ dossier, motifs, pieces, userRole }: FicheDossierProps) => {
  const [editingSalaire, setEditingSalaire] = useState(false);
  const [salaireValue, setSalaireValue] = useState(dossier.salaire || 0);

  const canEdit = userRole === 'lawyer' || userRole === 'paralegal';
  const hideAmounts = userRole === 'client'; // Simplified for demo

  const handleSalaireEdit = async () => {
    if (!canEdit) return;
    
    try {
      // PATCH /dossier/:id/salaire
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

  const handleStageChange = (newStage: string) => {
    if (!canEdit) return;
    
    console.log(`PATCH /dossier/${dossier.id}/stage`, { stage: newStage });
    toast({
      title: "Étape modifiée",
      description: `Nouvelle étape: ${newStage}`,
    });
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

  // Mock data pour la démo
  const mockAlerts = [
    { message: "Audience conciliation dans 12 jours", type: "amber" },
    { message: "1 pièce manquante", type: "amber" },
    { message: "Convention honoraires non signée", type: "red" }
  ];

  const keyPieces = pieces.filter(p => p.keyEvidence).slice(0, 5);

  return (
    <Card className="rounded-2xl shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-main">Fiche dossier</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* BLOC IDENTITÉ */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-main">Identité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 w-1/4">Étape</span>
                <Badge variant="secondary">{dossier.stage}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 w-1/4">Date audience</span>
                <span className="text-main">
                  {dossier.prochaineAudience ? 
                    new Date(dossier.prochaineAudience).toLocaleDateString('fr-FR') : 
                    'Non définie'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 w-1/4">Barreau</span>
                <span className="text-main">{dossier.barreau?.name || 'Paris'}</span>
              </div>
              {canEdit && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleStageChange('Audience')}
                  className="w-full mt-3"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Modifier étape
                </Button>
              )}
            </CardContent>
          </Card>

          {/* BLOC PARTIES */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-main">Parties</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-gray-600 w-1/4 font-medium">Client</TableCell>
                    <TableCell className="text-main">
                      <div className="space-y-1">
                        <div>{dossier.clientName || 'Jean Dupont'} / {dossier.clientRole || 'Salarié'}</div>
                        <div className="flex items-center gap-2">
                          <span>Salaire</span>
                          {editingSalaire && canEdit ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={salaireValue}
                                onChange={(e) => setSalaireValue(Number(e.target.value))}
                                className="w-24 h-6 text-sm"
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
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-gray-600 w-1/4 font-medium">Employeur</TableCell>
                    <TableCell className="text-main">
                      {dossier.employerName || 'SociétéXYZ'} (SIREN {dossier.siren || '123456789'})
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-gray-600 w-1/4 font-medium">Avocat adverse</TableCell>
                    <TableCell className="text-main">
                      {dossier.opponentLawyer ? (
                        <span>{dossier.opponentLawyer} ({dossier.opponentBar})</span>
                      ) : (
                        canEdit && (
                          <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                            Ajouter avocat adverse
                          </Button>
                        )
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* BLOC CADRE CONTRACTUEL */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-main">Cadre contractuel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 w-1/4">Contrat</span>
                <span className="text-main text-right">
                  {dossier.typeContrat || 'CDI'} du {dossier.dateDebut || '01/01/2020'} au {dossier.dateFin || '31/12/2023'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 w-1/4">Convention coll.</span>
                <span className="text-main text-right">
                  Métallurgie (IDCC 0016)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 w-1/4">Clause horaires</span>
                <span className="text-main text-right">
                  {dossier.clauseHoraire || '35h/semaine'}
                </span>
              </div>
              {canEdit && (
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Changer CCN
                </Button>
              )}
            </CardContent>
          </Card>

        </div>

        {/* LIGNE 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* BLOC MOTIFS & MONTANTS */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-main">Motifs & Montants</CardTitle>
              {canEdit && (
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Motif
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Motif</TableHead>
                    <TableHead>Montant €</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {motifs.map((motif) => (
                    <TableRow 
                      key={motif.id} 
                      className={`${motif.statut !== 'Validé' ? 'bg-lavender-mist/25' : ''} hover:bg-lavender-mist/25`}
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
            </CardContent>
          </Card>

          {/* BLOC PIÈCES CLÉS */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-main">Pièces clés</CardTitle>
              {canEdit && (
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter pièce
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {keyPieces.length > 0 ? (
                  keyPieces.map((piece) => (
                    <div key={piece.id} className="flex items-center justify-between p-2 rounded hover:bg-lavender-mist/25">
                      <span className="text-sm text-main">{piece.nom}</span>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyEvidence(piece.id, piece.keyEvidence || false)}
                          className="p-1 h-auto"
                        >
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucune pièce clé définie</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* BLOC RAPPELS */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-main">Rappels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAlerts.map((alert, index) => (
                  <Alert 
                    key={index}
                    className={`border-l-4 ${
                      alert.type === 'red' 
                        ? 'border-l-red-500 bg-red-50' 
                        : 'border-l-amber-500 bg-amber-50'
                    }`}
                  >
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.type === 'red' ? 'text-red-500' : 'text-amber-500'
                    }`} />
                    <AlertDescription className="text-sm">
                      {alert.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </CardContent>
    </Card>
  );
};
