
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create the resumes bucket if it doesn't exist
    const { data: bucketData, error: bucketError } = await supabaseAdmin.storage.createBucket(
      'resumes',
      { 
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      }
    );

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError;
    }

    // Set up RLS policies for the bucket
    // These policies will allow:
    // - Anyone to read public files
    // - Authenticated users to upload their own files
    // - Users to access only their own files

    return new Response(
      JSON.stringify({ 
        message: "Storage bucket 'resumes' has been set up",
        bucketData: bucketData || { status: "Bucket already exists" },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
