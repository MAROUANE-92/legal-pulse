
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ConclusionsTabProps {
  dossierId: string;
}

// Mock versions data
const mockVersions = [
  { id: '1', version: 'v1.0', date: '2024-06-15', status: 'Brouillon' },
  { id: '2', version: 'v1.1', date: '2024-06-18', status: 'En cours' },
  { id: '3', version: 'v2.0', date: '2024-06-20', status: 'Actuel' }
];

export const ConclusionsTab = ({ dossierId }: ConclusionsTabProps) => {
  const [content, setContent] = useState('Saisissez vos conclusions ici...\n\nUtilisez "/" pour accéder aux commandes rapides.');

  const handleSlashCommand = () => {
    // Simulate /brouillon command
    const draftContent = `
# CONCLUSIONS

L. 1234-1 du Code du travail dispose que...

## I. SUR LA DEMANDE PRINCIPALE

1. Attendu que le demandeur justifie de...
2. Attendu que l'employeur ne conteste pas...

## II. SUR LES DEMANDES ACCESSOIRES

L. 1234-5 prévoit également que...

## CONCLUSION

PAR CES MOTIFS, il vous plaît de bien vouloir...
    `;
    setContent(draftContent);
  };

  const handlePaginate = () => {
    console.log('Pagination et bordereau - fonctionnalité à implémenter');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Editor */}
      <div className="lg:col-span-3">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Éditeur de conclusions</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleSlashCommand} variant="outline" size="sm">
                  /brouillon
                </Button>
                <Button onClick={handlePaginate} variant="outline" size="sm">
                  Paginer & Bordereau
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 p-4 border rounded-lg resize-none font-mono text-sm"
              placeholder="Tapez '/' pour accéder aux commandes..."
            />
            <p className="text-xs text-muted-foreground mt-2">
              Commandes disponibles: /brouillon - Générer un brouillon automatique
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Version Panel */}
      <div>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Versions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockVersions.map((version) => (
                <div key={version.id} className="p-3 border rounded-lg hover:bg-lavender-mist/25 cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{version.version}</span>
                    <Badge variant={version.status === 'Actuel' ? 'default' : 'secondary'}>
                      {version.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(version.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              Voir diff
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
