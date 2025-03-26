
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
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Server configuration error');
    }
    
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
      .single()
    
    if (keyError || !keyData) {
      console.error('API key lookup error:', keyError);
      throw new Error('Invalid API key')
    }
    
    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyData.id)
    
    // Parse the URL to get route information
    const url = new URL(req.url)
    const path = url.pathname.split('/').filter(Boolean)
    
    // Remove "api" from the path if it's the first segment
    if (path[0] === 'api') {
      path.shift()
    }
    
    console.log('Request path:', path.join('/'));
    console.log('Request method:', req.method);
    
    // Handle different routes
    if (path[0] === 'content-types') {
      // GET /content-types - List all content types
      if (path.length === 1 && req.method === 'GET') {
        const { data, error } = await supabase
          .from('content_types')
          .select('*')
          .eq('user_id', keyData.user_id)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error fetching content types:', error);
          throw error;
        }
        
        return new Response(JSON.stringify(data), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        })
      }
      
      // GET /content-types/:id - Get a specific content type
      if (path.length === 2 && req.method === 'GET') {
        const contentTypeId = path[1]
        
        const { data, error } = await supabase
          .from('content_types')
          .select(`
            *,
            fields(*)
          `)
          .eq('id', contentTypeId)
          .eq('user_id', keyData.user_id)
          .single()
        
        if (error) {
          console.error('Error fetching content type:', error);
          throw error;
        }
        
        return new Response(JSON.stringify(data), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        })
      }
    }
    
    else if (path[0] === 'content') {
      // GET /content/:typeId - List content items for a content type
      if (path.length === 2 && req.method === 'GET') {
        const contentTypeId = path[1]
        
        // First, verify the user has access to this content type
        const { data: contentType, error: typeError } = await supabase
          .from('content_types')
          .select('*')
          .eq('id', contentTypeId)
          .eq('user_id', keyData.user_id)
          .single()
        
        if (typeError || !contentType) {
          console.error('Content type access error:', typeError);
          throw new Error('Content type not found or access denied')
        }
        
        const { data, error } = await supabase
          .from('content_items')
          .select('*')
          .eq('content_type_id', contentTypeId)
          .eq('user_id', keyData.user_id)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error fetching content items:', error);
          throw error;
        }
        
        return new Response(JSON.stringify(data), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        })
      }
      
      // GET /content/:typeId/:id - Get a specific content item
      if (path.length === 3 && req.method === 'GET') {
        const contentTypeId = path[1]
        const contentItemId = path[2]
        
        // First, verify the user has access to this content type
        const { data: contentType, error: typeError } = await supabase
          .from('content_types')
          .select('*')
          .eq('id', contentTypeId)
          .eq('user_id', keyData.user_id)
          .single()
        
        if (typeError || !contentType) {
          console.error('Content type access error:', typeError);
          throw new Error('Content type not found or access denied')
        }
        
        const { data, error } = await supabase
          .from('content_items')
          .select('*')
          .eq('id', contentItemId)
          .eq('content_type_id', contentTypeId)
          .eq('user_id', keyData.user_id)
          .single()
        
        if (error) {
          console.error('Error fetching content item:', error);
          throw error;
        }
        
        return new Response(JSON.stringify(data), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        })
      }
      
      // POST /content/:typeId - Create a content item
      if (path.length === 2 && req.method === 'POST') {
        // Check if the API key has write permission
        if (!keyData.permissions?.write) {
          console.error('Permission denied: API key does not have write permission');
          throw new Error('This API key does not have write permission')
        }
        
        const contentTypeId = path[1]
        
        // First, verify the user has access to this content type
        const { data: contentType, error: typeError } = await supabase
          .from('content_types')
          .select('*')
          .eq('id', contentTypeId)
          .eq('user_id', keyData.user_id)
          .single()
        
        if (typeError || !contentType) {
          console.error('Content type access error:', typeError);
          throw new Error('Content type not found or access denied')
        }
        
        // Parse request body
        const itemData = await req.json()
        
        const { data, error } = await supabase
          .from('content_items')
          .insert({
            content_type_id: contentTypeId,
            data: itemData,
            user_id: keyData.user_id,
            status: 'published'
          })
          .select()
          .single()
        
        if (error) {
          console.error('Error creating content item:', error);
          throw error;
        }
        
        return new Response(JSON.stringify(data), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201
        })
      }
      
      // PUT /content/:typeId/:id - Update a content item
      if (path.length === 3 && req.method === 'PUT') {
        // Check if the API key has write permission
        if (!keyData.permissions?.write) {
          console.error('Permission denied: API key does not have write permission');
          throw new Error('This API key does not have write permission')
        }
        
        const contentTypeId = path[1]
        const contentItemId = path[2]
        
        // Parse request body
        const itemData = await req.json()
        
        // First, verify the content item exists and belongs to this user
        const { data: existingItem, error: itemError } = await supabase
          .from('content_items')
          .select('*')
          .eq('id', contentItemId)
          .eq('content_type_id', contentTypeId)
          .eq('user_id', keyData.user_id)
          .single()
        
        if (itemError || !existingItem) {
          console.error('Content item access error:', itemError);
          throw new Error('Content item not found or access denied')
        }
        
        const { data, error } = await supabase
          .from('content_items')
          .update({
            data: itemData,
            updated_at: new Date().toISOString()
          })
          .eq('id', contentItemId)
          .select()
          .single()
        
        if (error) {
          console.error('Error updating content item:', error);
          throw error;
        }
        
        return new Response(JSON.stringify(data), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        })
      }
      
      // DELETE /content/:typeId/:id - Delete a content item
      if (path.length === 3 && req.method === 'DELETE') {
        // Check if the API key has write permission
        if (!keyData.permissions?.write) {
          console.error('Permission denied: API key does not have write permission');
          throw new Error('This API key does not have write permission')
        }
        
        const contentTypeId = path[1]
        const contentItemId = path[2]
        
        // First, verify the content item exists and belongs to this user
        const { data: existingItem, error: itemError } = await supabase
          .from('content_items')
          .select('*')
          .eq('id', contentItemId)
          .eq('content_type_id', contentTypeId)
          .eq('user_id', keyData.user_id)
          .single()
        
        if (itemError || !existingItem) {
          console.error('Content item access error:', itemError);
          throw new Error('Content item not found or access denied')
        }
        
        const { error } = await supabase
          .from('content_items')
          .delete()
          .eq('id', contentItemId)
        
        if (error) {
          console.error('Error deleting content item:', error);
          throw error;
        }
        
        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        })
      }
    }
    
    // If we get here, the route was not found
    console.error('Route not found:', path.join('/'));
    throw new Error('Route not found')
    
  } catch (error: any) {
    console.error('API error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: error.message === 'Route not found' ? 404 : 401 
      }
    )
  }
})
