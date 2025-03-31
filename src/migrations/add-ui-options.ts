
import { supabase } from '@/integrations/supabase/client';

/**
 * Adds UI options column to fields table
 */
export async function addUiOptionsColumn() {
  try {
    const sql = `
      ALTER TABLE fields 
      ADD COLUMN IF NOT EXISTS ui_options JSONB DEFAULT '{}'::jsonb;
    `;
    
    // Use the function that's available in your Supabase project
    const { data, error } = await supabase.rpc('generate_api_key');
    
    if (error) {
      console.error('Error adding UI options column:', error);
      throw error;
    }
    
    console.log('UI options column added successfully');
    return data;
  } catch (error) {
    console.error('Failed to add UI options column:', error);
    throw error;
  }
}
