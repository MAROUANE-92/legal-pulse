
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConclusionsAdversesTabProps {
  dossierId: string;
}

export const ConclusionsAdversesTab = ({ dossierId }: ConclusionsAdversesTabProps) => {
  const handleGenerateReply = () => {
    console.log('Génération de réplique - fonctionnalité à implémenter');
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Conclusions adverses</CardTitle>
            <Button onClick={handleGenerateReply} className="bg-primary hover:bg-primary-dark">
              /réplique
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg h-96 bg-gray-50 flex items-center justify-center">
            <iframe
              src="/api/placeholder/pdf-viewer"
              className="w-full h-full rounded-lg"
              title="Conclusions adverses"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-muted-foreground">Visualiseur PDF - Document des conclusions adverses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              Télécharger PDF
            </Button>
            <Button variant="outline" className="w-full">
              Annoter document
            </Button>
            <Button variant="outline" className="w-full">
              Extraire citations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
