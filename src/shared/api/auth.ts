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

  // Vrai login Supabase pour les avocats
  static async loginLawyer(email: string, password: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        return { data: { success: true }, error: null };
      } else {
        return { data: { success: false }, error: 'Échec de la connexion' };
      }
    } catch (error) {
      return { data: { success: false }, error: (error as Error).message };
    }
  }

  static async signUpLawyer(email: string, password: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Si l'inscription réussit, envoyer un email de confirmation personnalisé
      if (data.user && !data.user.email_confirmed_at) {
        try {
          await supabase.functions.invoke('send-email', {
            body: {
              email: email,
              type: 'signup',
              confirmationUrl: `${window.location.origin}/`
            }
          });
        } catch (emailError) {
          console.warn('Erreur envoi email personnalisé:', emailError);
          // Ne pas faire échouer l'inscription si l'email custom échoue
        }
      }
      
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: { success: false }, error: (error as Error).message };
    }
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static isLawyerAuthenticated(): boolean {
    // Cette méthode sera mise à jour par le contexte d'auth
    return localStorage.getItem('lawyer_authenticated') === 'true';
  }

  static async logoutLawyer(): Promise<void> {
    await supabase.auth.signOut();
    localStorage.removeItem('lawyer_authenticated');
  }
}