
import { useIngest } from "@/lib/IngestStore";
import { UploadZone } from "@/components/UploadZone";
import { FileText, Clock, CheckCircle, Upload as UploadIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InboxDemo() {
  const { pieces } = useIngest();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploaded":
        return <UploadIcon className="w-4 h-4 text-blue-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-amber-500 animate-spin" />;
      case "classified":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "uploaded":
        return <Badge variant="secondary">Upload</Badge>;
      case "processing":
        return <Badge variant="outline" className="text-amber-600 border-amber-600">IA en cours...</Badge>;
      case "classified":
        return <Badge variant="default" className="bg-green-100 text-green-800">Classifié</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inbox – Démo Ingest</h1>
        <Badge variant="outline" className="text-blue-600">
          {pieces.length} document{pieces.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zone de téléchargement</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadZone />
        </CardContent>
      </Card>

      {pieces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents traités</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Type IA</TableHead>
                  <TableHead>Confiance</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pieces.map((piece) => (
                  <TableRow key={piece.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{piece.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {formatFileSize(piece.size)}
                    </TableCell>
                    <TableCell>
                      {piece.aiType ? (
                        <Badge variant="outline">{piece.aiType}</Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {piece.confidence ? (
                        <span className="font-mono text-sm">
                          {Math.round(piece.confidence * 100)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(piece.status)}
                        {getStatusBadge(piece.status)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {pieces.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Aucun document téléchargé</p>
              <p className="text-sm">Glissez-déposez vos fichiers dans la zone ci-dessus</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
