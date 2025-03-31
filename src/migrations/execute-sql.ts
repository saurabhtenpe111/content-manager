
import { supabase } from '@/integrations/supabase/client';

/**
 * Executes custom SQL on the database
 */
export async function executeSql(sql: string) {
  const { data, error } = await supabase.rpc('generate_api_key');
  
  if (error) {
    console.error('Error executing SQL:', error);
    throw error;
  }
  
  return data;
}
