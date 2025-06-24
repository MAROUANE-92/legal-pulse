import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Piece } from '@/types/dossier';

interface PiecesTabProps {
  dossierId: string;
}

// Mock pieces data
const mockPieces: Piece[] = [
  {
    id: '1',
    nom: 'Contrat de travail',
    typeIA: 'Contrat CDI',
    typeFinal: 'Contrat CDI',
    pages: 3,
    status: 'Validated',
    dossierId: '1'
  },
  {
    id: '2',
    nom: 'Bulletins de paie',
    typeIA: 'Bulletins salaire',
    typeFinal: undefined,
    pages: 24,
    status: 'Pending',
    dossierId: '1'
  },
  {
    id: '3',
    nom: 'Attestation Pôle Emploi',
    typeIA: 'Document administratif',
    typeFinal: 'Attestation PE',
    pages: 2,
    status: 'Processing',
    dossierId: '1'
  }
];

const getStatusColor = (status: Piece['status']) => {
  switch (status) {
    case 'Validated': return 'bg-green-100 text-green-700';
    case 'Processing': return 'bg-blue-100 text-blue-700';
    case 'Error': return 'bg-red-100 text-red-700';
    default: return 'bg-yellow-100 text-yellow-700';
  }
};

const getStatusLabel = (status: Piece['status']) => {
  switch (status) {
    case 'Validated': return 'Validé';
    case 'Processing': return 'En cours';
    case 'Error': return 'Erreur';
    default: return 'En attente';
  }
};

export const PiecesTab = ({ dossierId }: PiecesTabProps) => {
  const [pieces, setPieces] = useState<Piece[]>(mockPieces);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      const newPiece: Piece = {
        id: Date.now().toString(),
        nom: file.name,
        typeIA: 'Document',
        pages: Math.floor(Math.random() * 10) + 1,
        status: 'Pending',
        dossierId: dossierId
      };
      setPieces(prev => [...prev, newPiece]);
    });
  };

  const handleBulkValidate = () => {
    setPieces(prev => prev.map(piece => 
      piece.status === 'Pending' ? { ...piece, status: 'Validated' } : piece
    ));
  };

  const validatedPieces = pieces.filter(p => p.status === 'Validated').length;
  const totalPieces = pieces.length;
  const progressPercent = totalPieces > 0 ? (validatedPieces / totalPieces) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progression globale</span>
            <span className="text-sm text-muted-foreground">
              {validatedPieces}/{totalPieces} pièces validées
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Drag & Drop Zone */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent 
          className={`p-8 border-2 border-dashed transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-lg font-medium mb-2">Glissez-déposez vos documents ici</p>
            <p className="text-muted-foreground">Ou cliquez pour sélectionner des fichiers</p>
          </div>
        </CardContent>
      </Card>

      {/* Pieces Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pièces du dossier</CardTitle>
            <Button onClick={handleBulkValidate} variant="outline">
              Valider lot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type IA</TableHead>
                <TableHead>Type final</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pieces.map((piece) => (
                <TableRow key={piece.id} className="hover:bg-lavender-mist/25">
                  <TableCell className="font-medium">{piece.nom}</TableCell>
                  <TableCell>{piece.typeIA}</TableCell>
                  <TableCell>
                    {piece.typeFinal || (
                      <select className="text-sm border rounded px-2 py-1">
                        <option value="">Sélectionner...</option>
                        <option value="Contrat CDI">Contrat CDI</option>
                        <option value="Bulletins salaire">Bulletins salaire</option>
                        <option value="Attestation PE">Attestation PE</option>
                      </select>
                    )}
                  </TableCell>
                  <TableCell>{piece.pages}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(piece.status)}>
                      {getStatusLabel(piece.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
