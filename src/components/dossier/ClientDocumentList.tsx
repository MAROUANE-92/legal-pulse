import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientDocument {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  category: string;
  uploaded_at: string;
}

interface ClientDocumentListProps {
  documents: ClientDocument[];
  title: string;
  icon?: React.ReactNode;
}

const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
  if (fileType.includes('word') || fileType.includes('document')) return <FileText className="h-4 w-4 text-blue-500" />;
  if (fileType.includes('image')) return <FileText className="h-4 w-4 text-green-500" />;
  return <FileText className="h-4 w-4 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const ClientDocumentList = ({ documents, title, icon }: ClientDocumentListProps) => {
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
                  <span>Document client</span>
                </div>
              </div>
              <Badge variant="outline">
                Client
              </Badge>
            </div>
            
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                title="Télécharger"
                disabled
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};