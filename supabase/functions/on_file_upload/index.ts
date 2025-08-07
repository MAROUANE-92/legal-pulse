import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLOUD_RUN_URL = Deno.env.get("CLOUD_RUN_URL");
const MAX_FILE_SIZE = 1_048_576; // 1 Mo (démo)

serve(async (req) => {
  console.log('=== on_file_upload Edge Function triggered ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('Storage event payload:', JSON.stringify(payload, null, 2));
    
    const { name, size, metadata, publicUrl } = payload;
    
    if (!name || !size) {
      console.log('Missing required fields: name or size');
      return new Response('Missing required fields', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    console.log(`Processing file: ${name}, size: ${size} bytes`);

    /* --- 1. Filtrer extensions autorisées --- */
    const allowedExtensions = /\.(csv|zip|msg)$/i;
    if (!name.match(allowedExtensions)) {
      console.log(`Skipping file with unsupported extension: ${name}`);
      return new Response('skip - unsupported extension', {
        status: 200,
        headers: corsHeaders
      });
    }

    /* --- 2. Bloquer > 1 Mo --- */
    if (size > MAX_FILE_SIZE) {
      console.log(`File too big: ${size} bytes > ${MAX_FILE_SIZE} bytes`);
      return new Response('File too big', { 
        status: 413,
        headers: corsHeaders 
      });
    }

    /* --- 3. Relayer vers Cloud Run --- */
    if (!CLOUD_RUN_URL) {
      console.error('CLOUD_RUN_URL environment variable not set');
      return new Response('Cloud Run URL not configured', {
        status: 500,
        headers: corsHeaders
      });
    }

    const cloudRunPayload = {
      submissionId: metadata?.submissionId,
      slug: metadata?.slug,
      fileUrl: publicUrl ? `${publicUrl}?token=${payload.signedUrlToken || ''}` : '',
      size: size,
      filename: name
    };

    console.log('Relaying to Cloud Run:', CLOUD_RUN_URL);
    console.log('Cloud Run payload:', JSON.stringify(cloudRunPayload, null, 2));

    const cloudRunResponse = await fetch(CLOUD_RUN_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "Supabase-Edge-Function"
      },
      body: JSON.stringify(cloudRunPayload)
    });

    if (!cloudRunResponse.ok) {
      console.error(`Cloud Run error: ${cloudRunResponse.status} ${cloudRunResponse.statusText}`);
      const errorText = await cloudRunResponse.text();
      console.error('Cloud Run error details:', errorText);
      
      return new Response(`Cloud Run processing failed: ${cloudRunResponse.status}`, {
        status: 500,
        headers: corsHeaders
      });
    }

    const cloudRunResult = await cloudRunResponse.text();
    console.log('Cloud Run response:', cloudRunResult);

    return new Response('File queued for processing', {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('Error in on_file_upload function:', error);
    return new Response(`Internal error: ${error.message}`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
});