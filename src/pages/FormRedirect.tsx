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
          // Créer directement une soumission avec l'ID utilisateur
          console.log('Creating submission for user:', session.user.id);
          
          const { data: submission, error: submissionError } = await supabase
            .from('Soumissions_formulaires_form_clients')
            .insert({
              form_id: session.user.id,
              status: 'in_progress'
            })
            .select()
            .single();
            
          if (submissionError) {
            console.error('Error creating submission:', submissionError);
            navigate('/access?form=test&error=submission_failed');
            return;
          }
          
          if (submission?.id) {
            console.log('Submission created successfully:', submission.id);
            navigate(`/form/${submission.id}`);
            return;
          } else {
            console.error('No submission ID returned');
            navigate('/access?form=test&error=no_submission_id');
            return;
          }
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