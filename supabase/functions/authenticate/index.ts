
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
    // Create a Supabase client with the Auth context of the function
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('Missing API key')
    }
    
    // Extract API key
    const apiKey = authHeader.replace('Bearer ', '')
    if (!apiKey) {
      throw new Error('Invalid API key format')
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
      .maybeSingle()
    
    if (keyError) {
      console.error('Database error:', keyError);
      throw new Error('Internal server error')
    }
    
    if (!keyData) {
      throw new Error('Invalid API key')
    }
    
    // Check if key has expired
    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      throw new Error('API key has expired')
    }
    
    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyData.id)
    
    // Get the user associated with this API key
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', keyData.user_id)
      .maybeSingle()
    
    if (userError) {
      console.log("User error:", userError);
      // Continue without user data
    }
    
    // Return authentication info
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: userData ? {
          id: userData.id,
          full_name: userData.full_name
        } : {
          id: keyData.user_id,
          full_name: "API User"
        },
        permissions: keyData.permissions
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
        authenticated: false, 
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
