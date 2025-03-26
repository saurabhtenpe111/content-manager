
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Parse request body
    const { apiKey, contentTypeId } = await req.json()
    
    if (!apiKey) {
      throw new Error('API key is required')
    }
    
    // Split the API key to get the prefix
    const parts = apiKey.split('.')
    if (parts.length !== 2) {
      throw new Error('Invalid API key format')
    }
    
    const keyPrefix = parts[0]
    
    // Lookup the API key in the database by prefix
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_prefix', keyPrefix)
      .single()
    
    if (keyError || !keyData) {
      throw new Error('Invalid API key')
    }
    
    // In a real implementation, verify the key hash against the full key value
    // This is simplified for the demo
    
    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyData.id)
    
    // If contentTypeId is provided, check if the user has access to that content type
    if (contentTypeId) {
      const { data: contentTypeData, error: contentTypeError } = await supabase
        .from('content_types')
        .select('*')
        .eq('id', contentTypeId)
        .eq('user_id', keyData.user_id)
        .single()
      
      if (contentTypeError || !contentTypeData) {
        throw new Error('You do not have access to this content type')
      }
    }
    
    // Return success response with permissions
    return new Response(
      JSON.stringify({
        valid: true,
        permissions: keyData.permissions,
        user_id: keyData.user_id
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 401 
      }
    )
  }
})
