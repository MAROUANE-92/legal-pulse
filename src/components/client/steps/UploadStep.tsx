
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, CheckCircle, PlayCircle } from 'lucide-react';
import { StepNavigation } from '../StepNavigation';
import { useClientStepper } from '../ClientStepperProvider';
import { useChecklist } from '@/hooks/useChecklist';
import { ProgressChips } from '@/components/ProgressChips';
import { useIngest } from '@/lib/IngestStore';
import { UploadZone } from '@/components/UploadZone';
import { Badge } from '@/components/ui/badge';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  validated?: boolean;
}

export const UploadStep = () => {
  const { formData, savePartial } = useClientStepper();
  const { checklist, setSatisfied, isLoading } = useChecklist('mock-dossier-id');
  const { pieces, upload } = useIngest();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Fichiers de démonstration
  const createDemoFile = (name: string, type: string, size: number) => {
    const content = `Demo content for ${name}`;
    const blob = new Blob([content], { type });
    const file = new File([blob], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  const demoFiles = [
    { name: 'Contrat_de_travail.pdf', type: 'application/pdf', size: 245760 },
    { name: 'Fiches_paie_2024.pdf', type: 'application/pdf', size: 1024000 },
    { name: 'Badge_logs.csv', type: 'text/csv', size: 15360 },
    { name: 'Emails_RH.pst', type: 'application/vnd.ms-outlook', size: 5242880 },
    { name: 'Scan_courrier_licenciement.jpg', type: 'image/jpeg', size: 2048000 }
  ];

  const uploadDemoFiles = () => {
    demoFiles.forEach(({ name, type, size }) => {
      const demoFile = createDemoFile(name, type, size);
      upload(demoFile);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach(upload);
    
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      validated: false
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    savePartial('upload', { files: [...uploadedFiles, ...newFiles] });
  };

  const validateFile = async (fileId: string) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, validated: true } : file
    ));
    
    // Mock: satisfy a random checklist item
    const unsatisfiedItem = checklist.find(item => !item.satisfied);
    if (unsatisfiedItem) {
      await setSatisfied.mutateAsync(unsatisfiedItem.id);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    savePartial('upload', { files: updatedFiles });
  };

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
        return <Upload className="w-4 h-4 text-blue-500" />;
      case "processing":
        return <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />;
      case "classified":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "uploaded":
        return <Badge variant="secondary">Uploadé</Badge>;
      case "processing":
        return <Badge variant="outline" className="text-amber-600 border-amber-600">IA en cours...</Badge>;
      case "classified":
        return <Badge variant="default" className="bg-green-100 text-green-800">Classifié</Badge>;
      default:
        return null;
    }
  };

  // Convert checklist to ProgressChips format
  const chipsData = checklist.map(item => ({
    label: item.label,
    validated: item.satisfied ? 1 : 0,
    required: 1
  }));

  const allRequired = checklist.filter(item => item.required);
  const allSatisfied = allRequired.every(item => item.satisfied);

  return (
    <div className="grid md:grid-cols-[3fr_2fr] gap-6">
      {/* Left Column - Upload */}
      <div className="space-y-6">
        {/* Démo Section */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <PlayCircle className="w-5 h-5" />
              Démonstration
            </CardTitle>
            <CardDescription>
              Testez l'ingestion automatique avec des fichiers de démonstration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={uploadDemoFiles} variant="outline" className="w-full">
              <PlayCircle className="w-4 h-4 mr-2" />
              Charger des fichiers de démonstration
            </Button>
            <p className="text-xs text-gray-600 mt-2">
              Inclut : contrat de travail, fiches de paie, badge logs, emails et courriers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Téléchargement de pièces</CardTitle>
            <CardDescription>
              Ajoutez vos documents justificatifs (contrat, fiches de paie, courriers, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Zone */}
            <UploadZone />

            {/* Ingested Files from Store */}
            {pieces.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Documents traités via IA ({pieces.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pieces.map((piece) => (
                    <div key={piece.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm">{piece.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(piece.size)}</p>
                          {piece.aiType && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {piece.aiType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(piece.status)}
                        {getStatusBadge(piece.status)}
                        {piece.confidence && piece.status === "classified" && (
                          <span className="text-xs text-gray-500 font-mono">
                            {Math.round(piece.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Fichiers manuels ({uploadedFiles.length})</h3>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      {file.validated && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!file.validated && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => validateFile(file.id)}
                        >
                          Valider
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Progress */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>État des pièces</CardTitle>
            <CardDescription>
              Progression de votre checklist documentaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoading && chipsData.length > 0 ? (
              <ProgressChips items={chipsData} />
            ) : (
              <p className="text-gray-500 text-sm">Génération de la checklist...</p>
            )}
          </CardContent>
        </Card>

        {/* Documents Stats */}
        {pieces.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Statistiques IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total documents :</span>
                  <span className="font-medium">{pieces.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Classifiés :</span>
                  <span className="font-medium text-green-600">
                    {pieces.filter(p => p.status === "classified").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>En traitement :</span>
                  <span className="font-medium text-amber-600">
                    {pieces.filter(p => p.status === "processing").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation - Full Width */}
      <div className="md:col-span-2">
        <StepNavigation 
          nextLabel="Continuer vers la signature"
          nextDisabled={!allSatisfied && pieces.filter(p => p.status === "classified").length === 0}
        />
        {!allSatisfied && pieces.filter(p => p.status === "classified").length === 0 && (
          <p className="text-sm text-amber-600 mt-2 text-center">
            Veuillez uploader et traiter des documents avant de continuer
          </p>
        )}
      </div>
    </div>
  );
};
