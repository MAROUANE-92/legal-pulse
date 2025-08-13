import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface UploadState {
  uploading: boolean;
  processing: boolean;
  success: boolean;
  error: string | null;
}

export function BadgeUploadZone() {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    processing: false,
    success: false,
    error: null
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetState = () => {
    setUploadState({
      uploading: false,
      processing: false,
      success: false,
      error: null
    });
  };

  const uploadFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadState(prev => ({ ...prev, error: 'Seuls les fichiers CSV sont autorisés' }));
      return;
    }

    if (file.size > 1024 * 1024) { // 1MB limit
      setUploadState(prev => ({ ...prev, error: 'Fichier trop volumineux (max 1MB)' }));
      return;
    }

    resetState();
    setUploadState(prev => ({ ...prev, uploading: true }));

    try {
      // Upload vers le bucket public-uploads
      const fileName = `badge_${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('public-uploads')
        .upload(fileName, file, {
          metadata: {
            submissionId: crypto.randomUUID(),
            slug: 'badge-upload'
          }
        });

      if (error) throw error;

      setUploadState(prev => ({ ...prev, uploading: false, processing: true }));
      
      toast({
        title: "Fichier uploadé",
        description: "Traitement des heures supplémentaires en cours...",
      });

      // Attendre le traitement automatique du backend (5-10 secondes)
      setTimeout(async () => {
        try {
          // Récupérer le dernier calcul d'heures supplémentaires
          const { data: events, error: fetchError } = await supabase
            .from('timeline_events')
            .select('*')
            .eq('event_type', 'overtime_calculated')
            .order('created_at', { ascending: false })
            .limit(1);

          if (fetchError) {
            console.error('Erreur récupération résultats:', fetchError);
            throw new Error('Erreur lors de la récupération des résultats');
          }

          if (events && events.length > 0) {
            const latestResult = events[0];
            const metadata = latestResult.details || latestResult.metadata || {};
            console.log('Résultats du calcul reçus:', latestResult);
            console.log('Métadonnées extraites:', metadata);
            
            setUploadState(prev => ({ ...prev, processing: false, success: true }));
            toast({
              title: "Calcul terminé !",
              description: `${(metadata as any)?.overtime_hours || 0}h supplémentaires détectées (${(metadata as any)?.compensation_amount || (metadata as any)?.compensation || 0}€)`,
            });
          } else {
            console.log('Aucun résultat trouvé, attente de 5 secondes...');
            // Pas encore de résultats, attendre encore un peu
            setTimeout(async () => {
              const { data: retryEvents } = await supabase
                .from('timeline_events')
                .select('*')
                .eq('event_type', 'overtime_calculated')
                .order('created_at', { ascending: false })
                .limit(1);

              console.log('Deuxième tentative de récupération:', retryEvents);

              if (retryEvents && retryEvents.length > 0) {
                const result = retryEvents[0];
                const retryMetadata = result.details || result.metadata || {};
                console.log('Métadonnées de la deuxième tentative:', retryMetadata);
                setUploadState(prev => ({ ...prev, processing: false, success: true }));
                toast({
                  title: "Calcul terminé !",
                  description: `${(retryMetadata as any)?.overtime_hours || 0}h supplémentaires détectées (${(retryMetadata as any)?.compensation_amount || (retryMetadata as any)?.compensation || 0}€)`,
                });
              } else {
                console.log('Aucun résultat après 12 secondes, système backend défaillant');
                setUploadState(prev => ({ ...prev, processing: false, success: true }));
                toast({
                  title: "Upload terminé",
                  description: "Fichier uploadé mais le système de calcul automatique ne répond pas.",
                  variant: "destructive"
                });
              }
            }, 5000);
          }
        } catch (error: any) {
          console.error('Erreur traitement:', error);
          setUploadState(prev => ({ 
            ...prev, 
            processing: false, 
            error: error.message 
          }));
          toast({
            title: "Erreur de traitement",
            description: error.message,
            variant: "destructive"
          });
        }
      }, 7000); // 7 secondes pour laisser le temps au backend de traiter

    } catch (error: any) {
      setUploadState(prev => ({ 
        ...prev, 
        uploading: false, 
        processing: false,
        error: error.message 
      }));
      toast({
        title: "Erreur d'upload",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!uploadState.uploading && !uploadState.processing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileSpreadsheet className="w-5 h-5" />
        Upload Badge CSV
      </h3>
      
      <div
        className={`border-dashed border-2 rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : uploadState.error
            ? 'border-destructive bg-destructive/5'
            : uploadState.success
            ? 'border-success bg-success/5'
            : 'border-muted-foreground/25 hover:border-primary hover:bg-muted/50'
        } ${(uploadState.uploading || uploadState.processing) ? 'pointer-events-none opacity-60' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {uploadState.uploading && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-lg font-medium">Upload en cours...</p>
          </div>
        )}

        {uploadState.processing && (
          <div className="flex flex-col items-center">
            <div className="animate-pulse rounded-full h-12 w-12 bg-primary/20 mb-4 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-primary" />
            </div>
            <p className="text-lg font-medium">Calcul automatique en cours...</p>
            <p className="text-sm text-muted-foreground mt-2">Analyse des heures travaillées (5-10 sec)</p>
          </div>
        )}

        {uploadState.success && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <p className="text-lg font-medium text-green-700">Calcul terminé !</p>
            <p className="text-sm text-muted-foreground mt-2">Consultez la section "Résultats Heures Supplémentaires" ci-dessous</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                resetState();
              }}
            >
              Uploader un autre fichier
            </Button>
          </div>
        )}

        {uploadState.error && (
          <div className="flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive">Erreur</p>
            <p className="text-sm text-muted-foreground mt-2">{uploadState.error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                resetState();
              }}
            >
              Réessayer
            </Button>
          </div>
        )}

        {!uploadState.uploading && !uploadState.processing && !uploadState.success && !uploadState.error && (
          <>
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              Glissez votre fichier badge.csv ici
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              ou cliquez pour sélectionner (max 1MB)
            </p>
            <div className="text-xs text-muted-foreground">
              Format supporté : CSV avec colonnes date/heure d'entrée et sortie
            </div>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileSelect}
      />
    </Card>
  );
}