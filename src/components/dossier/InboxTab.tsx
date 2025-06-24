
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { Piece } from '@/types/dossier';
import { Star, Search, Filter, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface InboxTabProps {
  dossierId: string;
}

// Mock data
const mockPieces: Piece[] = [
  { id: '1', nom: 'Contrat de travail', typeIA: 'contrat', pages: 3, status: 'Validated', keyEvidence: true, dossierId: '1', confidence: 0.95 },
  { id: '2', nom: 'Bulletins de paie', typeIA: 'bulletin', pages: 24, status: 'Validated', keyEvidence: true, dossierId: '1', confidence: 0.92 },
  { id: '3', nom: 'Planning équipes', typeIA: 'planning', pages: 8, status: 'Pending', keyEvidence: false, dossierId: '1', confidence: 0.78 },
  { id: '4', nom: 'Emails manager', typeIA: 'email', pages: 12, status: 'Pending', keyEvidence: true, dossierId: '1', confidence: 0.89 },
  { id: '5', nom: 'Attestation RH', typeIA: 'attestation', pages: 2, status: 'Pending', keyEvidence: false, dossierId: '1', confidence: 0.65 },
];

export const InboxTab = ({ dossierId }: InboxTabProps) => {
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  const validatedCount = mockPieces.filter(p => p.status === 'Validated').length;
  const totalCount = mockPieces.length;
  const progressPct = Math.round((validatedCount / totalCount) * 100);

  const filteredPieces = mockPieces.filter(piece => {
    const matchesSearch = piece.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'validated' && piece.status === 'Validated') ||
      (statusFilter === 'pending' && piece.status === 'Pending');
    const matchesType = typeFilter === 'all' || piece.typeIA === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSelectPiece = (pieceId: string, checked: boolean) => {
    if (checked) {
      setSelectedPieces([...selectedPieces, pieceId]);
    } else {
      setSelectedPieces(selectedPieces.filter(id => id !== pieceId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPieces(filteredPieces.map(p => p.id));
    } else {
      setSelectedPieces([]);
    }
  };

  const handleValidateBatch = () => {
    console.log('PATCH /pieces/validate', { ids: selectedPieces });
    toast({
      title: "Pièces validées",
      description: `${selectedPieces.length} pièce(s) validée(s)`,
    });
    setSelectedPieces([]);
  };

  const toggleKeyEvidence = (pieceId: string) => {
    console.log(`PATCH /pieces/${pieceId}`, { keyEvidence: true });
    toast({
      title: "Pièce clé",
      description: "Pièce marquée comme élément clé",
    });
  };

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null;
    const pct = Math.round(confidence * 100);
    const variant = pct >= 80 ? 'default' : pct >= 60 ? 'secondary' : 'destructive';
    return <Badge variant={variant} className="text-xs">{pct}%</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inbox - Validation des pièces</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {validatedCount}/{totalCount} pièces validées
              </div>
              <div className="w-32">
                <Progress value={progressPct} className="h-2" />
              </div>
              <Button 
                onClick={handleValidateBatch}
                disabled={selectedPieces.length === 0}
              >
                <Check className="w-4 h-4 mr-2" />
                Valider lot ({selectedPieces.length})
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Main Table */}
        <div className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher une pièce..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="validated">Validées</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="contrat">Contrat</SelectItem>
                    <SelectItem value="bulletin">Bulletin</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="attestation">Attestation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pieces Table */}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedPieces.length === filteredPieces.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type IA</TableHead>
                    <TableHead>Pages</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPieces.map((piece) => (
                    <TableRow 
                      key={piece.id}
                      className={`cursor-pointer hover:bg-gray-50 ${selectedPiece?.id === piece.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedPiece(piece)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedPieces.includes(piece.id)}
                          onCheckedChange={(checked) => handleSelectPiece(piece.id, !!checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{piece.nom}</span>
                          {piece.keyEvidence && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{piece.typeIA}</span>
                          {getConfidenceBadge(piece.confidence)}
                        </div>
                      </TableCell>
                      <TableCell>{piece.pages}</TableCell>
                      <TableCell>
                        <Badge variant={piece.status === 'Validated' ? 'default' : 'secondary'}>
                          {piece.status === 'Validated' ? 'Validé' : 'En attente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleKeyEvidence(piece.id);
                            }}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Métadonnées</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPiece ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedPiece.nom}</h4>
                  <p className="text-sm text-gray-600">
                    Type: {selectedPiece.typeIA} • {selectedPiece.pages} pages
                  </p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Métadonnées extraites</h5>
                  <div className="bg-gray-50 rounded p-3">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
{JSON.stringify({
  confidence: selectedPiece.confidence,
  extractedDates: ["2023-01-15", "2023-12-31"],
  amounts: [3500, 500],
  keywords: ["salaire", "heures supplémentaires"],
  sender: selectedPiece.typeIA === 'email' ? "manager@company.com" : null
}, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    className="w-full" 
                    disabled={selectedPiece.status === 'Validated'}
                  >
                    {selectedPiece.status === 'Validated' ? 'Déjà validé' : 'Valider cette pièce'}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Sélectionnez une pièce pour voir ses métadonnées
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
