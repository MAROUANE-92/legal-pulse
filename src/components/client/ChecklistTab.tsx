
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChecklistItem } from '@/types/dossier';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Upload } from 'lucide-react';

interface ChecklistTabProps {
  token: string;
}

// Mock data - would come from API
const mockChecklistItems: ChecklistItem[] = [
  { id: '1', dossierId: '1', label: 'Contrat de travail', isRequired: true, isSatisfied: true, fileId: 'file1' },
  { id: '2', dossierId: '1', label: 'Bulletins de paie (12 derniers mois)', isRequired: true, isSatisfied: true, fileId: 'file2' },
  { id: '3', dossierId: '1', label: 'Planning de travail', isRequired: true, isSatisfied: false },
  { id: '4', dossierId: '1', label: 'Emails avec la hiérarchie', isRequired: false, isSatisfied: false },
  { id: '5', dossierId: '1', label: 'Attestation employeur', isRequired: true, isSatisfied: false },
];

export const ChecklistTab = ({ token }: ChecklistTabProps) => {
  const satisfiedCount = mockChecklistItems.filter(item => item.isSatisfied).length;
  const totalCount = mockChecklistItems.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pièces attendues
            <Badge variant="secondary">
              {satisfiedCount}/{totalCount} transmises
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Veuillez transmettre les pièces manquantes pour permettre à votre avocat d'avancer sur le dossier.
          </p>
        </CardContent>
      </Card>

      {/* Checklist Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pièce</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockChecklistItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.label}</span>
                      {item.isRequired && (
                        <Badge variant="outline" className="text-xs">
                          Requis
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.isSatisfied ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Transmise</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">Manquante</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {!item.isSatisfied && (
                      <Link to={`/client/${token}/upload`}>
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Téléverser
                        </Button>
                      </Link>
                    )}
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
