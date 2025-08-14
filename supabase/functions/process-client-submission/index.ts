import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClientSubmissionRequest {
  dossier_id: string;
  submission_id: string;
  answers: Array<{
    question_slug: string;
    answer: any;
    uploaded_file_url?: string;
    metadata?: any;
  }>;
  client_name?: string;
  status?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { dossier_id, submission_id, answers, client_name, status = 'completed' }: ClientSubmissionRequest = await req.json();

    console.log('Token reçu:', dossier_id);
    console.log('Processing client submission:', { dossier_id, submission_id, answerCount: answers?.length });

    // 1. Vérifier que le dossier existe via le token
    const { data: dossier, error: dossierError } = await supabaseClient
      .from('dossiers')
      .select('*')
      .eq('token', dossier_id)
      .single();

    if (dossierError || !dossier) {
      console.error('Dossier not found:', dossierError);
      return new Response(
        JSON.stringify({ error: 'Dossier not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Créer ou mettre à jour la soumission formulaire
    const { error: submissionError } = await supabaseClient
      .from('Soumissions_formulaires_form_clients')
      .upsert({
        id: submission_id,
        form_id: dossier.lawyer_id, // L'avocat qui a créé le dossier
        status: status,
        score: null
      });

    if (submissionError) {
      console.error('Error creating submission:', submissionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create submission' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Insérer toutes les réponses
    if (answers && answers.length > 0) {
      const answersToInsert = answers.map(answer => ({
        submission_id: submission_id,
        question_slug: answer.question_slug,
        answer: answer.answer,
        uploaded_file_url: answer.uploaded_file_url,
        metadata: answer.metadata
      }));

      const { error: answersError } = await supabaseClient
        .from('answers')
        .upsert(answersToInsert, { 
          onConflict: 'submission_id,question_slug',
          ignoreDuplicates: false 
        });

      if (answersError) {
        console.error('Error inserting answers:', answersError);
        return new Response(
          JSON.stringify({ error: 'Failed to save answers' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 4. Mettre à jour le dossier avec le nom du client et changer le statut
    const updateData: any = {
      status: 'in_progress',
      updated_at: new Date().toISOString()
    };

    if (client_name) {
      updateData.client_name = client_name;
    }

    const { error: updateDossierError } = await supabaseClient
      .from('dossiers')
      .update(updateData)
      .eq('id', dossier_id);

    if (updateDossierError) {
      console.error('Error updating dossier:', updateDossierError);
      return new Response(
        JSON.stringify({ error: 'Failed to update dossier' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Optionnel : Mettre à jour le statut de l'invitation si elle existe
    const { error: inviteError } = await supabaseClient
      .from('invites')
      .update({ status: 'completed' })
      .eq('dossier_id', dossier_id)
      .eq('email', dossier.client_email);

    if (inviteError) {
      console.log('Warning: Could not update invite status:', inviteError);
    }

    console.log('Client submission processed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        dossier_id,
        submission_id,
        message: 'Submission processed successfully' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in process-client-submission function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);