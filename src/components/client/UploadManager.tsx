import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Check, AlertTriangle, Clock } from 'lucide-react';

export interface FileSpec {
  slug: string;
  label: string;
  allowed_ext: string[];
  max_size: number; // en octets
  required: boolean;
}

interface UploadManagerProps {
  submissionId: string;
  filesExpected: FileSpec[];
}

interface FileStatus {
  slug: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
}

export function UploadManager({ submissionId, filesExpected }: UploadManagerProps) {
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Initialize file statuses
  useEffect(() => {
    const initialStatuses: Record<string, FileStatus> = {};
    filesExpected.forEach(spec => {
      initialStatuses[spec.slug] = { slug: spec.slug, status: 'pending' };
    });
    setFileStatuses(initialStatuses);
  }, [filesExpected]);

  // Real-time subscription to timeline events
  useEffect(() => {
    const channel = supabase
      .channel('timeline-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'timeline_events',
          filter: `submission_id=eq.${submissionId}`
        },
        (payload: any) => {
          const event = payload.new;
          
          // Check if this is a file upload completion event
          if (event.title?.includes('Fichier reçu')) {
            filesExpected.forEach(spec => {
              if (event.title.includes(spec.slug)) {
                setFileStatuses(prev => ({
                  ...prev,
                  [spec.slug]: { ...prev[spec.slug], status: 'success' }
                }));
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [submissionId, filesExpected]);

  const handleFileSelect = async (slug: string, spec: FileSpec) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = spec.allowed_ext.map(ext => ext.startsWith('.') ? ext : `.${ext}`).join(',');
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate extension
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      const allowedExts = spec.allowed_ext.map(ext => ext.startsWith('.') ? ext : `.${ext}`);
      if (!allowedExts.includes(fileExt)) {
        toast({
          title: "Extension non autorisée",
          description: `Extensions acceptées: ${allowedExts.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      // Validate file size
      if (file.size > spec.max_size) {
        toast({
          title: "Fichier trop volumineux",
          description: `Taille maximum: ${(spec.max_size / 1024 / 1024).toFixed(1)} Mo`,
          variant: "destructive"
        });
        return;
      }

      // Update status to uploading
      setFileStatuses(prev => ({
        ...prev,
        [slug]: { ...prev[slug], status: 'uploading' }
      }));

      try {
        const filePath = `${submissionId}/${slug}/${file.name}`;
        
        const { data, error } = await supabase.storage
          .from('raw-files')
          .upload(filePath, file, {
            metadata: {
              submissionId,
              slug
            }
          });

        if (error) throw error;

        // Create timeline event for file upload
        await supabase.from('timeline_events').insert({
          submission_id: submissionId,
          event_type: 'upload',
          title: `Fichier reçu : ${slug}`,
          event_date: new Date().toISOString(),
          details: {
            filename: file.name,
            slug: slug,
            size: file.size,
            path: filePath
          }
        });

        toast({
          title: "Fichier uploadé avec succès",
          description: `${file.name} a été envoyé`
        });

      } catch (error: any) {
        console.error('Upload error:', error);
        setFileStatuses(prev => ({
          ...prev,
          [slug]: { ...prev[slug], status: 'error' }
        }));
        
        toast({
          title: "Erreur d'upload",
          description: error.message || "Une erreur est survenue lors de l'upload",
          variant: "destructive"
        });
      }
    };

    input.click();
  };

  const getStatusIcon = (status: FileStatus['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: FileStatus['status'], required: boolean) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant={required ? "destructive" : "secondary"}>
            ⏳ En attente
          </Badge>
        );
      case 'uploading':
        return <Badge variant="secondary">📤 Upload...</Badge>;
      case 'success':
        return <Badge variant="outline" className="text-green-600">✅ Reçu</Badge>;
      case 'error':
        return <Badge variant="destructive">❌ Erreur</Badge>;
      default:
        return <Badge variant="secondary">⏳ En attente</Badge>;
    }
  };

  const completedFiles = Object.values(fileStatuses).filter(s => s.status === 'success').length;
  const totalFiles = filesExpected.length;
  const progressPercent = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload des pièces</CardTitle>
        <CardDescription>
          Envoyez les documents demandés ({completedFiles}/{totalFiles} complétés)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression globale</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filesExpected.map((spec) => {
              const status = fileStatuses[spec.slug]?.status || 'pending';
              return (
                <TableRow key={spec.slug}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{spec.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {spec.allowed_ext.join(', ')} • max {(spec.max_size / 1024 / 1024).toFixed(1)} Mo
                        {spec.required && <span className="text-red-500"> *</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileSelect(spec.slug, spec)}
                      disabled={status === 'uploading'}
                      className="w-full sm:w-auto"
                    >
                      {getStatusIcon(status)}
                      <span className="ml-2">
                        {status === 'uploading' ? 'Upload...' : 'Sélectionner'}
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(status, spec.required)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}