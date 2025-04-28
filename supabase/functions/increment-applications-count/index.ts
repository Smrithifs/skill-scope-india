
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  try {
    // Create supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const { internship_id } = await req.json();
    
    if (!internship_id) {
      return new Response(
        JSON.stringify({ error: 'Internship ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update applications count
    const { error } = await supabase
      .from('internships')
      .update({ applications_count: supabase.rpc('increment', { row_id: internship_id }) })
      .eq('id', internship_id);
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ success: true, message: 'Applications count updated' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
