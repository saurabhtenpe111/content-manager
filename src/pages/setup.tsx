
import React, { useEffect, useState } from 'react';
import { executeSql } from '@/migrations/execute-sql';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import fs from 'fs';

const SetupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const setupDatabase = async () => {
    try {
      setIsLoading(true);
      
      // Get SQL script content
      const sqlScript = `
      -- Drop the existing function if it exists
      DROP FUNCTION IF EXISTS public.execute_migration_sql;

      -- Create a properly formed execute_migration_sql function
      CREATE OR REPLACE FUNCTION public.execute_migration_sql(sql_command TEXT)
      RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
      BEGIN
        EXECUTE sql_command;
        RETURN jsonb_build_object('success', true);
      EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object(
          'success', false,
          'error', SQLERRM
        );
      END;
      $$;

      -- Grant usage to authenticated users
      GRANT EXECUTE ON FUNCTION public.execute_migration_sql TO authenticated;
      `;
      
      // Execute the SQL script
      const result = await executeSql(sqlScript);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to setup database');
      }
      
      toast.success('Database setup completed successfully');
      setIsComplete(true);
    } catch (error: any) {
      console.error('Error setting up database:', error);
      toast.error(error.message || 'Failed to setup database');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Setup Database</h1>
        
        <p className="mb-4 text-gray-600">
          This will setup the necessary database functions for your CMS to work properly.
        </p>
        
        <div className="flex justify-center">
          {isComplete ? (
            <Button onClick={() => navigate('/content-types')}>
              Go to Content Types
            </Button>
          ) : (
            <Button 
              onClick={setupDatabase} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Setup Database'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
