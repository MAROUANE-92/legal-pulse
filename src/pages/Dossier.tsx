
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SyntheseTab } from '@/components/dossier/SyntheseTab';
import { ChronologieTab } from '@/components/dossier/ChronologieTab';
import { EchangesTab } from '@/components/dossier/EchangesTab';
import { PiecesTab } from '@/components/dossier/PiecesTab';
import { ConclusionsTab } from '@/components/dossier/ConclusionsTab';
import { ConclusionsAdversesTab } from '@/components/dossier/ConclusionsAdversesTab';
import { toast } from '@/hooks/use-toast';

// Mock data - in real app would come from API
const mockDossier = {
  id: '1',
  name: 'Dupont vs. SociétéXYZ',
  stage: 'Rédaction' as const,
  nextDeadline: '2024-07-15',
  progressPct: 65,
  client: 'Jean Dupont',
  employeur: 'SociétéXYZ',
  ccn: 'Convention Collective Métallurgie',
  montantReclame: 45000,
  prochaineAudience: '2024-08-20'
};

const Dossier = () => {
  const { id } = useParams<{ id: string }>();

  const handleDeposerRPVA = () => {
    toast({
      title: "Dépôt RPVA",
      description: "Dépôt simulé OK",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dossiers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{mockDossier.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-main">{mockDossier.name}</h1>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            {mockDossier.stage}
          </Badge>
          <Button onClick={handleDeposerRPVA} className="bg-primary hover:bg-primary-dark">
            Déposer RPVA
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="synthese" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="synthese">Synthèse</TabsTrigger>
          <TabsTrigger value="chronologie">Chronologie</TabsTrigger>
          <TabsTrigger value="echanges">Échanges</TabsTrigger>
          <TabsTrigger value="pieces">Pièces</TabsTrigger>
          <TabsTrigger value="conclusions">Conclusions</TabsTrigger>
          <TabsTrigger value="conclusions-adverses">Conclusions adverses</TabsTrigger>
        </TabsList>

        <TabsContent value="synthese" className="mt-6">
          <SyntheseTab dossier={mockDossier} />
        </TabsContent>

        <TabsContent value="chronologie" className="mt-6">
          <ChronologieTab dossierId={id || ''} />
        </TabsContent>

        <TabsContent value="echanges" className="mt-6">
          <EchangesTab dossierId={id || ''} />
        </TabsContent>

        <TabsContent value="pieces" className="mt-6">
          <PiecesTab dossierId={id || ''} />
        </TabsContent>

        <TabsContent value="conclusions" className="mt-6">
          <ConclusionsTab dossierId={id || ''} />
        </TabsContent>

        <TabsContent value="conclusions-adverses" className="mt-6">
          <ConclusionsAdversesTab dossierId={id || ''} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dossier;
