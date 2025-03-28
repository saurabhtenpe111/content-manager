
-- Add ui_options column to fields table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'fields' AND column_name = 'ui_options'
  ) THEN
    ALTER TABLE public.fields ADD COLUMN ui_options JSONB;
  END IF;
END
$$;

-- Add RPC function to add a column if it doesn't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name text,
  column_name text,
  column_type text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = table_name AND column_name = column_name
  ) THEN
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN %I %s', table_name, column_name, column_type);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
