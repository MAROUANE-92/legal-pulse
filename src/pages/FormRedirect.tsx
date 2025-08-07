import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function FormRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const formSlug = session.user.user_metadata?.formSlug;
        
        if (formSlug) {
          // Chercher l'invitation correspondante
          const { data: invite } = await supabase
            .from('invites')
            .select('*')
            .eq('email', session.user.email)
            .single();
            
          if (invite) {
            // Chercher ou créer la soumission
            let { data: submission } = await supabase
              .from('Soumissions_formulaires_form_clients')
              .select('*')
              .eq('form_id', session.user.id)
              .single();
              
            if (!submission) {
              const { data: newSubmission } = await supabase
                .from('Soumissions_formulaires_form_clients')
                .insert({
                  form_id: session.user.id,
                  status: 'in_progress'
                })
                .select()
                .single();
              submission = newSubmission;
            }
            
            if (submission) {
              navigate(`/form/${submission.id}`);
              return;
            }
          }
        }
      }
      
      // Si aucune redirection n'a fonctionné, retourner à l'accueil
      navigate('/');
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  );
}