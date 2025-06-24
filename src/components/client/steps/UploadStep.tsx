
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { StepNavigation } from '../StepNavigation';
import { useClientStepper } from '../ClientStepperProvider';
import { useChecklist } from '@/hooks/useChecklist';
import { ProgressChips } from '@/components/ProgressChips';

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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

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
        <Card>
          <CardHeader>
            <CardTitle>Téléchargement de pièces</CardTitle>
            <CardDescription>
              Ajoutez vos documents justificatifs (contrat, fiches de paie, courriers, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                Glissez-déposez vos fichiers ici
              </p>
              <p className="text-gray-600 mb-4">
                ou cliquez pour sélectionner
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choisir des fichiers
                </label>
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Formats acceptés: PDF, DOC, DOCX, JPG, PNG (max 10 MB)
              </p>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Fichiers téléchargés ({uploadedFiles.length})</h3>
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
      </div>

      {/* Navigation - Full Width */}
      <div className="md:col-span-2">
        <StepNavigation 
          nextLabel="Continuer vers la signature"
          nextDisabled={!allSatisfied}
        />
        {!allSatisfied && (
          <p className="text-sm text-amber-600 mt-2 text-center">
            Veuillez compléter tous les documents requis avant de continuer
          </p>
        )}
      </div>
    </div>
  );
};
