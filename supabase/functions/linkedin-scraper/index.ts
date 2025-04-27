
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN')
const SUPABASE_URL = "https://syyqdvmzvzhiclwkuzsj.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5eXFkdm16dnpoaWNsd2t1enNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NjQ2MTMsImV4cCI6MjA2MTA0MDYxM30.LWI2VVmknzLyRo5xhvVBfx6rl7UW1AAxWsgdGtUG6gs"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { category = '' } = await req.json()

    // Call LinkedIn Job Scraper API
    const response = await fetch(
      'https://api.apify.com/v2/acts/forward_dinosaur~linkedin-job-scraper/run-sync?token=' + APIFY_TOKEN,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: `${category} internship`,
          location: 'India',
          maxItems: 20,
        }),
      }
    )

    const data = await response.json()
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Process and store internships
    const processedJobs = data.map((job: any) => ({
      title: job.title,
      company: job.company,
      company_logo: job.companyLogo || null,
      category: category,
      description: job.description,
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      location: { city: job.location, state: '', country: 'India' },
      stipend: 0, // LinkedIn usually doesn't provide stipend info
      duration_months: 3, // Default duration
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      is_remote: job.title.toLowerCase().includes('remote'),
      skills: job.skills || [],
      external_id: job.jobId,
      external_url: job.url,
    }))

    // Insert internships into database
    const { data: insertedJobs, error } = await supabase
      .from('internships')
      .upsert(
        processedJobs,
        { 
          onConflict: 'external_id',
          ignoreDuplicates: true 
        }
      )

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, count: processedJobs.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
