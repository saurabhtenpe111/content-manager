
import { supabase } from '@/integrations/supabase/client';

export async function migrateAddUIOptions() {
  try {
    // Check if the column already exists
    const { data: columns, error: checkError } = await supabase
      .from('fields')
      .select('ui_options')
      .limit(1);
    
    if (checkError) {
      // Column doesn't exist, we need to create it
      console.log('Adding ui_options column to fields table...');
      
      // Use raw SQL to add the column
      const { error } = await supabase.rpc('exec', { 
        query: 'ALTER TABLE fields ADD COLUMN IF NOT EXISTS ui_options JSONB' 
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Migration successful: Added ui_options column to fields table');
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
