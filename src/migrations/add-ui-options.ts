
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
      
      // Use raw SQL query to add the column via RPC
      // Note: We're using a more generic approach that doesn't rely on specific RPC method names
      try {
        // First try direct SQL execution if possible
        const { error } = await supabase.rpc('execute_sql', { 
          sql: 'ALTER TABLE fields ADD COLUMN IF NOT EXISTS ui_options JSONB' 
        });
        
        if (error) {
          // If that fails, try another approach - create a function or use the supabase interface
          console.log('Could not execute SQL directly, trying alternative approach...');
          throw error;
        }
        
        console.log('ui_options column added successfully via RPC');
        return true;
      } catch (rpcError) {
        // Fallback to REST API if RPC is not available
        console.log('Using REST API fallback to check column existence...');
        
        // Check if we can modify the table structure through REST API
        const { error: alterError } = await supabase
          .from('fields')
          .update({ ui_options: {} })
          .eq('id', 'test')
          .select();
        
        if (alterError && alterError.message.includes('column "ui_options" does not exist')) {
          console.log('Migration functionality is not available - please add the ui_options column manually');
          console.log('You can run this SQL in your Supabase SQL editor:');
          console.log('ALTER TABLE fields ADD COLUMN IF NOT EXISTS ui_options JSONB');
          return false;
        } else {
          console.log('ui_options column appears to exist or was added');
          return true;
        }
      }
    } else {
      console.log('ui_options column already exists in fields table');
      return false;
    }
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}
