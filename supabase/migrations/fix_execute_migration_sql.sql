
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
