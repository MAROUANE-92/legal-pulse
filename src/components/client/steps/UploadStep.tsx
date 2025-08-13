import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStepper } from '../StepperProvider';
import { useQuestionnaireSchema } from '@/hooks/useQuestionnaireSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, Check, AlertTriangle, FileText, Clock } from 'lucide-react';
import { TestUpload } from "../../TestUpload";

interface FileExpected {
  sectionId: string;
  sectionLabel: string;
  filename: string;
  uploaded: boolean;
  allowedExt: string[];
  fileUrl?: string;
}

export function UploadStep() {
  const { goTo, formData } = useStepper();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  
  // Get current answers from all steps
  const allAnswers = {
    ...formData.identity,
    ...formData.contract,
    ...formData.remuneration,
    ...formData.working_time,
    ...formData.motifs,
    ...formData.questions
  };

  const { sections } = useQuestionnaireSchema(allAnswers);
  const submissionId = 'demo_submission'; // À remplacer par l'ID réel

  // Algorithme exact selon spécifications
  const expected: FileExpected[] = React.useMemo(() => {
    let expectedFiles: FileExpected[] = [];

    sections.forEach(sec => {
      const visible = sec.always_shown || 
        (sec.show_if && evaluateShowIf(sec.show_if, allAnswers));

      if (visible && Array.isArray(sec.files_expected)) {
        sec.files_expected.forEach(filename => {
          expectedFiles.push({
            sectionId: sec.id,
            sectionLabel: sec.label,
            filename: filename,
            uploaded: Boolean(uploadedFiles[filename]),
            allowedExt: sec.id === "overtime_block"
              ? [".csv", ".zip", ".json", ".txt", ".html", ".pdf"]
              : [".pdf", ".zip"]
          });
        });
      }
    });

    return expectedFiles;
  }, [sections, allAnswers, uploadedFiles]);

  // Helper function to evaluate show_if conditions
  function evaluateShowIf(condition: string, answers: Record<string, any>): boolean {
    if (condition.includes("motifs_selected includes")) {
      const motif = condition.match(/'([^']+)'/)?.[1];
      return motif && answers.motifs_selected?.includes(motif);
    }
    return true;
  }

  // Progress calculation
  const progress = expected.length > 0 
    ? expected.filter(e => e.uploaded).length / expected.length 
    : 1;

  // Charger les fichiers déjà uploadés
  useEffect(() => {
    const loadUploadedFiles = async () => {
      try {
        const { data: answers } = await supabase
          .from('answers')
          .select('question_slug, uploaded_file_url')
          .eq('submission_id', submissionId)
          .not('uploaded_file_url', 'is', null);
        
        if (answers) {
          const uploaded: Record<string, string> = {};
          answers.forEach(answer => {
            if (answer.uploaded_file_url) {
              uploaded[answer.question_slug] = answer.uploaded_file_url;
            }
          });
          setUploadedFiles(uploaded);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des fichiers:', error);
      }
    };
    
    loadUploadedFiles();
  }, [submissionId]);

  const handleFileUpload = async (file: File, filename: string) => {
    setUploading(prev => ({ ...prev, [filename]: true }));
    
    try {
      // 1. path = raw-files/{submissionId}/{filename}
      const path = `${submissionId}/${filename}`;
      
      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public-uploads')
        .upload(path, file);
      
      if (uploadError) throw uploadError;
      
      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('public-uploads')
        .getPublicUrl(path);
      
      // 2. upsert answers { submission_id, question_slug: filename, uploaded_file_url: url }
      const { error: saveError } = await supabase
        .from('answers')
        .upsert({
          submission_id: submissionId,
          question_slug: filename,
          uploaded_file_url: publicUrl
        });
      
      if (saveError) throw saveError;
      
      setUploadedFiles(prev => ({ ...prev, [filename]: publicUrl }));
      toast({
        title: "Fichier uploadé",
        description: `${file.name} a été téléchargé avec succès`
      });
      
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de l'upload de ${file.name}`,
        variant: "destructive"
      });
    } finally {
      setUploading(prev => ({ ...prev, [filename]: false }));
    }
  };

  const onNext = () => {
    if (progress >= 0.8) {
      goTo('signature');
    }
  };

  const onSkip = () => {
    // Warning modal pourrait être ajouté ici
    toast({
      title: "Documents incomplets",
      description: "Certains documents manquent. Vous pourrez les ajouter plus tard.",
      variant: "destructive"
    });
    goTo('signature');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Test de debug */}
      <TestUpload />
      
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progression des documents</span>
              <span className="text-sm text-muted-foreground">
                {expected.filter(f => f.uploaded).length} / {expected.length} fichiers
              </span>
            </div>
            <Progress value={progress * 100} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">
              {Math.round(progress * 100)}% complété
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des fichiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents et pièces justificatives
          </CardTitle>
          <CardDescription>
            Téléchargez les documents nécessaires selon vos motifs sélectionnés
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expected.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun document spécifique requis pour vos motifs sélectionnés</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fichier</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Extensions</TableHead>
                  <TableHead>Upload</TableHead>
                  <TableHead>État</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expected.map((fileExp) => (
                  <TableRow key={fileExp.filename}>
                    <TableCell className="font-medium">
                      {fileExp.filename}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fileExp.sectionLabel}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fileExp.allowedExt.join(', ')}
                    </TableCell>
                    <TableCell>
                      {fileExp.uploaded ? (
                        <Button variant="outline" size="sm" disabled>
                          <Check className="h-4 w-4 mr-2" />
                          Uploadé
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept={fileExp.allowedExt.join(',')}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, fileExp.filename);
                              }
                            }}
                            className="hidden"
                            id={`file-${fileExp.filename}`}
                            disabled={uploading[fileExp.filename]}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              document.getElementById(`file-${fileExp.filename}`)?.click();
                            }}
                            disabled={uploading[fileExp.filename]}
                            className="gap-2"
                          >
                            {uploading[fileExp.filename] ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            {uploading[fileExp.filename] ? 'Upload...' : 'Sélectionner'}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {fileExp.uploaded ? (
                        <Badge variant="default" className="gap-1">
                          <Check className="h-3 w-3" />
                          ✅
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          ⏳
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => goTo('questions')}
              className="gap-2"
            >
              Précédent
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onSkip}
                className="gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Ignorer pour l'instant
              </Button>
              
              <Button 
                onClick={onNext}
                disabled={progress < 0.8}
                className="gap-2"
              >
                {progress >= 0.8 ? (
                  <>
                    <Check className="h-4 w-4" />
                    Continuer vers signature
                  </>
                ) : (
                  `Continuer (${Math.round(progress * 100)}% complété)`
                )}
              </Button>
            </div>
          </div>
          
          {progress < 0.8 && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Il vous manque encore quelques documents importants. 
                Vous pouvez continuer maintenant ou les ajouter plus tard.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}