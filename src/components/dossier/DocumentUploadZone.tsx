import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, X } from 'lucide-react';
import { useLawyerDocuments } from '@/hooks/useLawyerDocuments';

interface DocumentUploadZoneProps {
  dossierId: string;
}

const DOCUMENT_CATEGORIES = [
  { value: 'conclusions', label: 'Conclusions' },
  { value: 'assignation', label: 'Assignation' },
  { value: 'pv_audience', label: "PV d'audience" },
  { value: 'jugement', label: 'Jugement' },
  { value: 'correspondance', label: 'Correspondance adverse' },
  { value: 'expertise', label: 'Rapport expertise' },
  { value: 'piece_client', label: 'Pièce client supplémentaire' },
  { value: 'autre', label: 'Autre' }
];

export const DocumentUploadZone = ({ dossierId }: DocumentUploadZoneProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  const { uploadDocument, isUploading } = useLawyerDocuments(dossierId);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'text/plain': ['.txt']
    }
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!category || selectedFiles.length === 0) return;

    for (const file of selectedFiles) {
      await uploadDocument({ file, category, description });
    }

    // Reset form
    setSelectedFiles([]);
    setCategory('');
    setDescription('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Ajouter des documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-lg">Déposez les fichiers ici...</p>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">Glissez vos fichiers ou cliquez pour sélectionner</p>
              <p className="text-sm text-muted-foreground">
                Formats acceptés : PDF, Word, Images, Texte
              </p>
            </div>
          )}
        </div>

        {/* Fichiers sélectionnés */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Fichiers sélectionnés</h4>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Catégorie du document *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description (optionnel)</label>
            <Textarea 
              placeholder="Description du document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleUpload}
            disabled={!category || selectedFiles.length === 0 || isUploading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Téléchargement...' : `Télécharger ${selectedFiles.length} fichier(s)`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};