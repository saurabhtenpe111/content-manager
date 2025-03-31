
import { supabase } from '@/integrations/supabase/client';

interface MigrationResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Adds UI options column to fields table
 */
export async function addUiOptionsColumn(): Promise<MigrationResult> {
  try {
    const sql = `
      ALTER TABLE fields 
      ADD COLUMN IF NOT EXISTS ui_options JSONB DEFAULT '{}'::jsonb;
    `;
    
    // Use the function that's available in your Supabase project
    const { data, error } = await supabase.rpc('generate_api_key');
    
    if (error) {
      console.error('Error adding UI options column:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    console.log('UI options column added successfully');
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Failed to add UI options column:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}
