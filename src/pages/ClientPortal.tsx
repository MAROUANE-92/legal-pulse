
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutClient } from '@/components/LayoutClient';
import { ChecklistTab } from '@/components/client/ChecklistTab';
import { UploadTab } from '@/components/client/UploadTab';
import { ProgressTab } from '@/components/client/ProgressTab';

// Mock data - would come from API
const mockDossier = {
  name: 'Dupont vs. SociétéXYZ',
  progressPct: 65,
};

const ClientPortal = () => {
  const { token } = useParams<{ token: string }>();

  return (
    <LayoutClient 
      progressPct={mockDossier.progressPct} 
      dossierName={mockDossier.name}
    >
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenue sur votre espace dossier
          </h1>
          <p className="text-gray-600">
            Suivez l'avancement de votre dossier et transmettez vos pièces
          </p>
        </div>

        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="mt-6">
            <ChecklistTab token={token || ''} />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <UploadTab token={token || ''} />
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <ProgressTab token={token || ''} />
          </TabsContent>
        </Tabs>
      </div>
    </LayoutClient>
  );
};

export default ClientPortal;
