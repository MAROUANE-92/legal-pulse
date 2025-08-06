import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';
import { useQuestionnaireSchema } from '@/hooks/useQuestionnaireSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Check, AlertTriangle, FileText } from 'lucide-react';

interface FileExpected {
  sectionId: string;
  sectionLabel: string;
  fileName: string;
  questionSlug: string;
  allowedExtensions: string[];
  isUploaded: boolean;
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
  const visibleSections = sections;

  // Générer la liste des fichiers attendus
  const filesExpected: FileExpected[] = React.useMemo(() => {
    const files: FileExpected[] = [];
    
    visibleSections.forEach(section => {
      const filesForSection = section.questions
        .filter(q => q.files_expected)
        .flatMap(q => {
          const filesExp = Array.isArray(q.files_expected) 
            ? q.files_expected 
            : [q.files_expected];
          
          return filesExp.map(fileName => {
            // Déterminer les extensions autorisées selon le bloc
            let allowedExtensions = ['.pdf', '.zip'];
            if (section.id === 'overtime_block') {
              allowedExtensions = ['.csv', '.zip', '.json', '.txt', '.html', '.pdf'];
            }
            
            const questionSlug = `${section.id}_${q.id}_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
            
            return {
              sectionId: section.id,
              sectionLabel: section.label,
              fileName: fileName,
              questionSlug,
              allowedExtensions,
              isUploaded: !!uploadedFiles[questionSlug],
              fileUrl: uploadedFiles[questionSlug]
            };
          });
        });
      
      files.push(...filesForSection);
    });
    
    return files;
  }, [visibleSections, uploadedFiles]);

  // Calculer le pourcentage de complétude
  const completionPercentage = React.useMemo(() => {
    if (filesExpected.length === 0) return 100;
    const uploadedCount = filesExpected.filter(f => f.isUploaded).length;
    return Math.round((uploadedCount / filesExpected.length) * 100);
  }, [filesExpected]);

  // Charger les fichiers déjà uploadés
  useEffect(() => {
    const loadUploadedFiles = async () => {
      try {
        const { data: answers } = await supabase
          .from('answers')
          .select('question_slug, uploaded_file_url')
          .eq('submission_id', 'demo_submission') // À remplacer par l'ID réel
          .not('uploaded_file_url', 'is', null);
        
        if (answers) {
          const uploaded = {};
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
  }, []);

  const handleFileUpload = async (file: File, questionSlug: string) => {
    setUploading(prev => ({ ...prev, [questionSlug]: true }));
    
    try {
      const submissionId = 'demo_submission'; // À remplacer par l'ID réel
      const fileName = `${questionSlug}_${file.name}`;
      const filePath = `${submissionId}/${fileName}`;
      
      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('raw-files')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('raw-files')
        .getPublicUrl(filePath);
      
      // Sauvegarder dans la table answers
      const { error: saveError } = await supabase
        .from('answers')
        .upsert({
          submission_id: submissionId,
          question_slug: questionSlug,
          uploaded_file_url: publicUrl
        });
      
      if (saveError) throw saveError;
      
      setUploadedFiles(prev => ({ ...prev, [questionSlug]: publicUrl }));
      toast.success(`${file.name} uploadé avec succès`);
      
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error(`Erreur lors de l'upload de ${file.name}`);
    } finally {
      setUploading(prev => ({ ...prev, [questionSlug]: false }));
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.includes('.csv')) return '📊';
    if (fileName.includes('.json')) return '📋';
    if (fileName.includes('.zip')) return '📦';
    if (fileName.includes('.pdf')) return '📄';
    return '📁';
  };

  const getFileDescription = (fileName: string, sectionId: string) => {
    if (sectionId === 'overtime_block') {
      if (fileName.includes('badge')) return 'Badgeage – export CSV ou PDF';
      if (fileName.includes('slack')) return 'Slack – history.json (export natif)';
      if (fileName.includes('teams')) return 'Teams – export HTML ou JSON';
      if (fileName.includes('emails')) return 'Emails tardifs – export ZIP';
    }
    return fileName;
  };

  const onNext = () => {
    if (completionPercentage >= 80) {
      goTo('signature');
    }
  };

  const onSkip = () => {
    toast.warning('Certains documents manquent. Vous pourrez les ajouter plus tard.');
    goTo('signature');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progression des documents</span>
              <span className="text-sm text-muted-foreground">
                {filesExpected.filter(f => f.isUploaded).length} / {filesExpected.length} fichiers
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">
              {completionPercentage}% complété
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist des fichiers */}
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
          {filesExpected.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun document spécifique requis pour vos motifs sélectionnés</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Grouper par section */}
              {Object.entries(
                filesExpected.reduce((acc, file) => {
                  if (!acc[file.sectionId]) acc[file.sectionId] = [];
                  acc[file.sectionId].push(file);
                  return acc;
                }, {} as Record<string, FileExpected[]>)
              ).map(([sectionId, sectionFiles]) => (
                <div key={sectionId} className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    {sectionFiles[0].sectionLabel}
                  </h3>
                  
                  <div className="grid gap-3">
                    {sectionFiles.map((fileExp) => (
                      <div 
                        key={fileExp.questionSlug}
                        className="flex items-center justify-between p-4 border rounded-lg bg-card/50"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">
                            {getFileIcon(fileExp.fileName)}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium">
                              {getFileDescription(fileExp.fileName, fileExp.sectionId)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Formats: {fileExp.allowedExtensions.join(', ')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {fileExp.isUploaded ? (
                            <Badge variant="default" className="gap-1">
                              <Check className="h-3 w-3" />
                              Uploadé
                            </Badge>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                accept={fileExp.allowedExtensions.join(',')}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(file, fileExp.questionSlug);
                                  }
                                }}
                                className="hidden"
                                id={`file-${fileExp.questionSlug}`}
                                disabled={uploading[fileExp.questionSlug]}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  document.getElementById(`file-${fileExp.questionSlug}`)?.click();
                                }}
                                disabled={uploading[fileExp.questionSlug]}
                                className="gap-2"
                              >
                                {uploading[fileExp.questionSlug] ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                                {uploading[fileExp.questionSlug] ? 'Upload...' : 'Sélectionner'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
                disabled={completionPercentage < 80}
                className="gap-2"
              >
                {completionPercentage >= 80 ? (
                  <>
                    <Check className="h-4 w-4" />
                    Continuer vers signature
                  </>
                ) : (
                  `Continuer (${completionPercentage}% complété)`
                )}
              </Button>
            </div>
          </div>
          
          {completionPercentage < 80 && (
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