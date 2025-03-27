
import { supabase } from '@/integrations/supabase/client';

export async function migrateAddUIOptions() {
  try {
    // Check if the column already exists
    const { data: columns, error: checkError } = await supabase
      .from('fields')
      .select('ui_options')
      .limit(1);
    
    if (checkError && checkError.message.includes('column "ui_options" does not exist')) {
      console.log('Adding ui_options column to fields table...');
      
      // Use raw SQL query to add the column - this works with PostgreSQL in Supabase
      const { error } = await supabase.rpc('execute_sql', { 
        sql: 'ALTER TABLE fields ADD COLUMN IF NOT EXISTS ui_options JSONB' 
      });
      
      if (error) {
        console.error('Migration error:', error);
        // Fallback method if rpc is not available
        console.log('Migration functionality is not available - please add the ui_options column manually');
        return false;
      }
      
      console.log('ui_options column added successfully');
      return true;
    } else {
      console.log('ui_options column already exists in fields table');
      return false;
    }
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}
