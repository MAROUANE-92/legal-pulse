import { supabase } from "@/integrations/supabase/client";
import { Dossier, ApiResponse, DashboardMetrics } from "../types";

export class DossiersAPI {
  static async getDossiers(): Promise<ApiResponse<Dossier[]>> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: [], error: null };
      }

      // Récupérer les vrais dossiers depuis la table dossiers
      const { data: dossiers, error } = await supabase
        .from('dossiers')
        .select('*')
        .eq('lawyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      // Transformer en format Dossier
      const transformedDossiers: Dossier[] = (dossiers || []).map((dossier) => ({
        id: dossier.id,
        name: `Dossier ${dossier.client_name || dossier.client_email}`,
        client: dossier.client_name || dossier.client_email,
        employeur: 'À compléter',
        stage: dossier.status === 'pending' ? 'Découverte' : 'Rédaction',
        nextDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progressPct: dossier.status === 'pending' ? 10 : 50,
        typeLitige: 'Contentieux prud\'homal',
        ccn: 'À compléter',
        montantReclame: 0,
        prochaineAudience: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));

      return { data: transformedDossiers, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  static async getDossierById(id: string): Promise<ApiResponse<Dossier>> {
    try {
      const { data: dossiers } = await this.getDossiers();
      const dossier = dossiers?.find(d => d.id === id);
      
      if (!dossier) {
        return { data: null, error: 'Dossier non trouvé' };
      }

      return { data: dossier, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  static async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    try {
      const { data: dossiers } = await this.getDossiers();
      
      const metrics: DashboardMetrics = {
        totalDossiers: dossiers?.length || 0,
        dossiersEnCours: dossiers?.filter(d => d.stage !== 'Clos').length || 0,
        tempsMoyenPreparation: "3.2h",
        tempsPourcentageReduction: 40
      };

      return { data: metrics, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  static async createDossier(clientEmail: string, clientName?: string, description?: string): Promise<ApiResponse<{ token: string; dossierId: string }>> {
    try {
      // Vérifier l'authentification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Générer un token unique pour le client
      const token = `client_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      // Créer le dossier en base
      const { data: dossier, error: dossierError } = await supabase
        .from('dossiers')
        .insert({
          lawyer_id: user.id,
          client_email: clientEmail,
          client_name: clientName,
          description,
          token,
          status: 'pending'
        })
        .select()
        .single();
      
      if (dossierError || !dossier) {
        throw new Error(dossierError?.message || 'Erreur lors de la création du dossier');
      }
      
      return { data: { token, dossierId: dossier.id }, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }
}