import { supabase } from "@/integrations/supabase/client";
import { Dossier, ApiResponse, DashboardMetrics } from "../types";

export class DossiersAPI {
  static async getDossiers(): Promise<ApiResponse<Dossier[]>> {
    try {
      // Pour l'instant, on récupère depuis la table answers et on transforme
      const { data: answers, error } = await supabase
        .from('answers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      // Grouper par submission_id
      const submissionMap = new Map();
      answers?.forEach(answer => {
        if (!submissionMap.has(answer.submission_id)) {
          submissionMap.set(answer.submission_id, {
            submission_id: answer.submission_id,
            created_at: answer.created_at,
            answers: []
          });
        }
        submissionMap.get(answer.submission_id).answers.push(answer);
      });

      // Transformer en dossiers
      const dossiers: Dossier[] = Array.from(submissionMap.values()).map((submission, index) => ({
        id: submission.submission_id,
        name: `Dossier ${submission.submission_id.replace('auto-', '').slice(0, 8)}`,
        client: 'Client LegalPulse',
        employeur: 'Employeur',
        stage: (['Découverte', 'Rédaction', 'Dépôt', 'Audience', 'Clos'] as const)[Math.floor(Math.random() * 5)],
        nextDeadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progressPct: Math.floor(Math.random() * 100),
        typeLitige: 'Contentieux prud\'homal',
        ccn: 'Convention collective',
        montantReclame: Math.floor(Math.random() * 50000) + 5000,
        prochaineAudience: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));

      return { data: dossiers, error: null };
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

  static async createDossier(clientEmail: string): Promise<ApiResponse<{ token: string }>> {
    try {
      // Générer un token unique pour le client
      const token = `client_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      // TODO: Créer entrée dans DB avec le token
      // Pour l'instant on retourne juste le token
      
      return { data: { token }, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }
}