import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Trash, FileText, File, Image, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Document {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  category: string;
  description?: string;
  uploaded_at: string;
}

interface DocumentListProps {
  documents: Document[];
  title: string;
  icon?: React.ReactNode;
  onDownload?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
  showActions?: boolean;
}

const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
  if (fileType.includes('word') || fileType.includes('document')) return <File className="h-4 w-4 text-blue-500" />;
  if (fileType.includes('image')) return <Image className="h-4 w-4 text-green-500" />;
  return <Archive className="h-4 w-4 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'conclusions': 'Conclusions',
    'assignation': 'Assignation',
    'pv_audience': "PV d'audience",
    'jugement': 'Jugement',
    'correspondance': 'Correspondance adverse',
    'expertise': 'Rapport expertise',
    'piece_client': 'Pièce client supplémentaire',
    'autre': 'Autre'
  };
  return labels[category] || category;
};

export const DocumentList = ({ 
  documents, 
  title, 
  icon, 
  onDownload, 
  onDelete, 
  showActions = true 
}: DocumentListProps) => {
  if (documents.length === 0) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun document disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
          <Badge variant="secondary" className="ml-auto">
            {documents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {getFileIcon(doc.file_type)}
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{doc.file_name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatFileSize(doc.file_size)}</span>
                  <span>•</span>
                  <span>{format(new Date(doc.uploaded_at), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
                </div>
                {doc.description && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {doc.description}
                  </p>
                )}
              </div>
              <Badge variant="outline">
                {getCategoryLabel(doc.category)}
              </Badge>
            </div>
            
            {showActions && (
              <div className="flex gap-2 ml-4">
                {onDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(doc)}
                    title="Télécharger"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(doc)}
                    title="Supprimer"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};