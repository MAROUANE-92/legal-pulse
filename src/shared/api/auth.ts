import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "../types";

export class AuthAPI {
  static async sendMagicLink(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      // Générer un token unique pour le client
      const token = `client_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      // URL de redirection après clic sur le magic link
      const redirectTo = `${window.location.origin}/client/${token}/welcome`;
      
      // Envoyer le magic link via Supabase
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            token,
            client_email: email
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { 
        data: { message: `Magic link envoyé à ${email}` }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error: (error as Error).message 
      };
    }
  }

  static async validateToken(token: string): Promise<ApiResponse<{ valid: boolean; email?: string }>> {
    try {
      // Pour l'instant, on valide tous les tokens qui commencent par 'token_' ou 'client_'
      const isValid = token.startsWith('token_') || token.startsWith('client_') || token.length > 10;
      
      if (isValid) {
        return { 
          data: { valid: true, email: 'client@example.com' }, 
          error: null 
        };
      } else {
        return { 
          data: { valid: false }, 
          error: 'Token invalide ou expiré' 
        };
      }
    } catch (error) {
      return { 
        data: { valid: false }, 
        error: (error as Error).message 
      };
    }
  }

  // Mock login pour les avocats (à remplacer par vrai auth plus tard)
  static async loginLawyer(email: string, password: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      // Mock credentials
      if (email === 'MeG' && password === 'MeG_2025') {
        localStorage.setItem('lawyer_authenticated', 'true');
        return { data: { success: true }, error: null };
      } else {
        return { data: { success: false }, error: 'Identifiants invalides' };
      }
    } catch (error) {
      return { data: { success: false }, error: (error as Error).message };
    }
  }

  static isLawyerAuthenticated(): boolean {
    return localStorage.getItem('lawyer_authenticated') === 'true';
  }

  static logoutLawyer(): void {
    localStorage.removeItem('lawyer_authenticated');
  }
}