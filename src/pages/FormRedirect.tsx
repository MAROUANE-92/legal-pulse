import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function FormRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      console.log('FormRedirect: Starting redirect process');
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          navigate('/access?form=test&error=session_error');
          return;
        }
        
        console.log('Session:', session?.user?.email, 'Metadata:', session?.user?.user_metadata);
        
        if (session?.user) {
          console.log('Finding dossier for user email:', session.user.email);
          
          // Trouver le dossier correspondant à l'email du client
          const { data: dossier, error: dossierError } = await supabase
            .from('dossiers')
            .select('*')
            .eq('client_email', session.user.email)
            .eq('status', 'pending')
            .single();
            
          if (dossierError || !dossier) {
            console.error('Dossier not found:', dossierError);
            navigate(`/access?form=test&error=dossier_not_found&details=${session.user.email}`);
            return;
          }
          
          console.log('Found dossier:', dossier.id);
          
          // Créer un token unique pour ce client
          const clientToken = `client-${dossier.id}-${Date.now()}`;
          
          // Stocker le dossier_id associé au token
          localStorage.setItem(`dossier_id_${clientToken}`, dossier.id);
          
          // Rediriger vers le wizard client avec le token
          navigate(`/client/${clientToken}/welcome`);
          return;
        } else {
          console.log('No session found');
          navigate('/access?form=test&error=no_session');
          return;
        }
      } catch (error) {
        console.error('Unexpected error in redirect:', error);
        navigate('/access?form=test&error=unexpected_error');
      }
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