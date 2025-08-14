import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useLawyerDocuments(dossierId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["lawyer-documents", dossierId],
    queryFn: async () => {
      console.log('Fetching lawyer documents for dossier:', dossierId);
      
      // Pour l'instant, on retourne des données mockées car la table documents n'existe pas encore
      const mockDocuments = [
        {
          id: '1',
          dossier_id: dossierId,
          file_name: 'Conclusions_demandeur.pdf',
          file_path: `${dossierId}/conclusions/Conclusions_demandeur.pdf`,
          file_size: 2048576,
          file_type: 'application/pdf',
          category: 'conclusions',
          description: 'Conclusions du demandeur',
          uploaded_at: new Date().toISOString(),
          uploaded_by: 'lawyer-1'
        }
      ];

      return mockDocuments;
    },
    enabled: !!dossierId
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, category, description }: { file: File; category: string; description?: string }) => {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${dossierId}/${category}/${fileName}`;

      // Upload vers storage
      const { error: uploadError } = await supabase.storage
        .from('dossier-documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Pour l'instant, on simule l'insertion
      const data = {
        id: Date.now().toString(),
        dossier_id: dossierId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        category,
        description,
        uploaded_at: new Date().toISOString(),
        uploaded_by: 'current-user'
      };

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawyer-documents", dossierId] });
      toast({
        title: "Document téléchargé",
        description: "Le document a été ajouté avec succès."
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document.",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (document: any) => {
      // Supprimer du storage
      const { error: storageError } = await supabase.storage
        .from('dossier-documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Pour l'instant, on simule la suppression
      console.log('Document deleted:', document.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawyer-documents", dossierId] });
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès."
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document.",
        variant: "destructive"
      });
    }
  });

  const downloadDocument = async (document: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('dossier-documents')
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document.",
        variant: "destructive"
      });
    }
  };

  return {
    documents: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    uploadDocument: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    deleteDocument: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    downloadDocument
  };
}