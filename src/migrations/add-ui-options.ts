
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const migrateUiOptionsColumn = async () => {
  try {
    // Check if ui_options column already exists
    const { data: columns, error: checkError } = await supabase
      .from('fields')
      .select('ui_options')
      .limit(1);
    
    if (checkError) {
      // Column doesn't exist, proceed with migration
      if (checkError.message.includes('column "ui_options" does not exist')) {
        console.log('Adding ui_options column to fields table...');
        
        // Execute raw SQL to add the column if it doesn't exist
        const { error: alterError } = await supabase.rpc(
          'execute_migration_sql',
          { 
            sql_command: 'ALTER TABLE fields ADD COLUMN IF NOT EXISTS ui_options JSONB DEFAULT \'{}\'::jsonb' 
          }
        );
        
        if (alterError) {
          console.error('Error adding ui_options column:', alterError);
          toast.error('Failed to update database schema');
          return false;
        }
        
        console.log('ui_options column added successfully');
        toast.success('Database schema updated');
        return true;
      }
      
      console.error('Error checking for ui_options column:', checkError);
      return false;
    }
    
    console.log('ui_options column already exists in fields table');
    return true;
  } catch (error) {
    console.error('Migration error:', error);
    toast.error('Failed to update database schema');
    return false;
  }
};
