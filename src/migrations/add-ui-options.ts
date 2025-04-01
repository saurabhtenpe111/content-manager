
import { supabase } from '@/integrations/supabase/client';
import { executeSql } from './execute-sql';

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
    
    return await executeSql(sql);
  } catch (error: any) {
    console.error('Failed to add UI options column:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}
