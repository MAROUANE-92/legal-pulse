import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function FormRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      console.log('FormRedirect: Starting redirect process');
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session?.user?.email, 'Metadata:', session?.user?.user_metadata);
      
      if (session?.user) {
        const formSlug = session.user.user_metadata?.formSlug;
        const userEmail = session.user.email;
        
        console.log('Processing redirect for:', { formSlug, userEmail });
        
        if (formSlug && userEmail) {
          // 1. Vérifier ou créer une invitation
          let { data: invite } = await supabase
            .from('invites')
            .select('*')
            .eq('email', userEmail)
            .maybeSingle();
            
          if (!invite) {
            console.log('Creating new invite for:', userEmail);
            const { data: newInvite } = await supabase
              .from('invites')
              .insert({
                email: userEmail,
                status: 'active',
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
              })
              .select()
              .single();
            invite = newInvite;
          }
          
          console.log('Invite found/created:', invite);
            
          // 2. Vérifier ou créer une soumission
          let { data: submission } = await supabase
            .from('Soumissions_formulaires_form_clients')
            .select('*')
            .eq('form_id', session.user.id)
            .maybeSingle();
            
          if (!submission) {
            console.log('Creating new submission for user:', session.user.id);
            const { data: newSubmission, error } = await supabase
              .from('Soumissions_formulaires_form_clients')
              .insert({
                form_id: session.user.id,
                status: 'in_progress'
              })
              .select()
              .single();
              
            if (error) {
              console.error('Error creating submission:', error);
            } else {
              submission = newSubmission;
              console.log('Submission created:', submission);
            }
          }
          
          if (submission) {
            console.log('Redirecting to form:', submission.id);
            navigate(`/form/${submission.id}`);
            return;
          } else {
            console.error('Failed to create/find submission');
          }
        } else {
          console.log('Missing formSlug or userEmail');
        }
      } else {
        console.log('No session found');
      }
      
      // Si aucune redirection n'a fonctionné
      console.log('Redirect failed, going back to access page');
      navigate('/access?form=test');
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