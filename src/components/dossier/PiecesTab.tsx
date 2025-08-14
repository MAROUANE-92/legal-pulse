import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileText, Briefcase, FolderOpen } from 'lucide-react';
import { useClientDocuments } from '@/hooks/useClientDocuments';
import { useLawyerDocuments } from '@/hooks/useLawyerDocuments';
import { DocumentUploadZone } from './DocumentUploadZone';
import { DocumentList } from './DocumentList';
import { ClientDocumentList } from './ClientDocumentList';

interface PiecesTabProps {
  dossierId: string;
}

export const PiecesTab = ({ dossierId }: PiecesTabProps) => {
  const { data: clientDocs, isLoading: clientLoading } = useClientDocuments(dossierId);
  const { 
    documents: lawyerDocs, 
    isLoading: lawyerLoading,
    downloadDocument,
    deleteDocument 
  } = useLawyerDocuments(dossierId);

  // Convertir les documents client en format uniforme
  const clientDocuments = React.useMemo(() => {
    if (!clientDocs?.files) return [];
    
    return Object.entries(clientDocs.files).map(([key, file]: [string, any]) => ({
      id: key,
      file_name: file.name || key,
      file_size: file.size || 0,
      file_type: file.type || 'application/octet-stream',
      category: 'client',
      uploaded_at: file.lastModified ? new Date(file.lastModified).toISOString() : new Date().toISOString()
    }));
  }, [clientDocs]);

  const allDocuments = [...clientDocuments, ...lawyerDocs];
  
  // Calculer la progression
  const totalDocs = allDocuments.length;
  const progressPercent = totalDocs > 0 ? 100 : 0; // Tous les docs uploadés sont considérés comme "traités"

  if (clientLoading || lawyerLoading) {
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-8 text-center">
            <p>Chargement des documents...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Documents du dossier</span>
            <span className="text-sm text-muted-foreground">
              {totalDocs} document(s) total
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Tabs pour organiser les documents */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="client" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents client
          </TabsTrigger>
          <TabsTrigger value="lawyer" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Documents avocat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {/* Section Documents Client */}
          <ClientDocumentList
            documents={clientDocuments}
            title="Documents fournis par le client"
            icon={<FileText className="h-5 w-5" />}
          />

          {/* Section Documents Avocat */}
          <DocumentList
            documents={lawyerDocs}
            title="Documents de procédure"
            icon={<Briefcase className="h-5 w-5" />}
            onDownload={downloadDocument}
            onDelete={deleteDocument}
          />
        </TabsContent>

        <TabsContent value="client" className="mt-6">
          <ClientDocumentList
            documents={clientDocuments}
            title="Documents du client"
            icon={<FileText className="h-5 w-5" />}
          />
          
          {clientDocs?.bordereau && Array.isArray(clientDocs.bordereau) && clientDocs.bordereau.length > 0 && (
            <Card className="rounded-2xl shadow-sm mt-4">
              <CardHeader>
                <CardTitle>Bordereau des pièces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(clientDocs.bordereau as any[]).map((item: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium">{item.title || item.nom}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="lawyer" className="space-y-6 mt-6">
          <DocumentUploadZone dossierId={dossierId} />
          
          <DocumentList
            documents={lawyerDocs}
            title="Documents téléchargés"
            icon={<Briefcase className="h-5 w-5" />}
            onDownload={downloadDocument}
            onDelete={deleteDocument}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
