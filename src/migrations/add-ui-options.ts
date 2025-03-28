
import { supabase } from '@/integrations/supabase/client';

export async function migrateAddUIOptions() {
  try {
    // Check if the column already exists
    const { data: columns, error: checkError } = await supabase
      .from('fields')
      .select('ui_options')
      .limit(1);
    
    // If there's an error saying the column doesn't exist, we need to add it
    if (checkError && checkError.message.includes('column "ui_options" does not exist')) {
      console.log('Adding ui_options column to fields table...');
      
      try {
        // Use SQL to alter the table
        const { error } = await supabase.rpc('execute_sql', { 
          query: 'ALTER TABLE fields ADD COLUMN IF NOT EXISTS ui_options JSONB'
        });
        
        if (error) {
          // If direct SQL execution fails, try an alternative approach
          console.log('Could not execute SQL directly, trying alternative approach...');
          console.log('Migration functionality is not available - please add the ui_options column manually');
          console.log('You can run this SQL in your Supabase SQL editor:');
          console.log('ALTER TABLE fields ADD COLUMN IF NOT EXISTS ui_options JSONB');
          return false;
        }
        
        console.log('ui_options column added successfully');
        return true;
      } catch (rpcError) {
        // Provide helpful error message if migration fails
        console.log('Migration functionality is not available - please add the ui_options column manually');
        console.log('You can run this SQL in your Supabase SQL editor:');
        console.log('ALTER TABLE fields ADD COLUMN IF NOT EXISTS ui_options JSONB');
        return false;
      }
    } else {
      console.log('ui_options column already exists in fields table');
      return true;
    }
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}
