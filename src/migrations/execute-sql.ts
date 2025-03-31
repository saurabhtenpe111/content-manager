
import { supabase } from '@/integrations/supabase/client';

export const executeSql = async (sql: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase.rpc('execute_migration_sql', { sql_command: sql });
    
    if (error) {
      console.error('SQL execution error:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (err) {
    console.error('Failed to execute SQL:', err);
    return { success: false, error: err };
  }
};
