
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
    // Execute SQL query using the execute_migration_sql RPC function
    // This function must be defined in your Supabase project
    const { data, error } = await supabase.rpc(
      'execute_migration_sql' as any, // Using type assertion to bypass TypeScript error
      { sql_command: sql }
    );
    
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
