
-- Create a function to execute SQL commands safely
CREATE OR REPLACE FUNCTION execute_migration_sql(sql_command TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  EXECUTE sql_command;
END;
$$;

-- Grant usage to authenticated users
GRANT EXECUTE ON FUNCTION execute_migration_sql TO authenticated;
