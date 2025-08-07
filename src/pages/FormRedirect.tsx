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
          // Créer ou récupérer un formulaire par défaut
          console.log('Creating submission for user:', session.user.id);
          
          // 1. D'abord, s'assurer qu'un formulaire existe
          let { data: form } = await supabase
            .from('forms')
            .select('*')
            .limit(1)
            .maybeSingle();
            
          if (!form) {
            // Créer un formulaire par défaut
            const { data: newForm } = await supabase
              .from('forms')
              .insert({
                name: 'Formulaire Client',
                definition: {}
              })
              .select()
              .single();
            form = newForm;
          }
          
          console.log('Using form:', form);
          
          // 2. Créer la soumission avec l'ID du formulaire
          const { data: submission, error: submissionError } = await supabase
            .from('Soumissions_formulaires_form_clients')
            .insert({
              form_id: form.id, // Utiliser l'ID du formulaire (pas l'ID utilisateur)
              status: 'in_progress'
            })
            .select()
            .single();
            
          if (submissionError) {
            console.error('Error creating submission:', submissionError);
            console.error('Full error details:', JSON.stringify(submissionError, null, 2));
            console.error('User ID:', session.user.id);
            console.error('User email:', session.user.email);
            navigate(`/access?form=test&error=submission_failed&details=${encodeURIComponent(submissionError.message)}`);
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