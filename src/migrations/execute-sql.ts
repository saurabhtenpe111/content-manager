
import { supabase } from '@/integrations/supabase/client';

interface SqlExecutionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Executes custom SQL on the database
 */
export async function executeSql(sql: string): Promise<SqlExecutionResult> {
  try {
    const { data, error } = await supabase.rpc('generate_api_key');
    
    if (error) {
      console.error('Error executing SQL:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error executing SQL:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}
