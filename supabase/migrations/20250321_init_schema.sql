
-- Create content_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_published BOOLEAN NOT NULL DEFAULT false
);

-- Create fields table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type_id UUID NOT NULL REFERENCES public.content_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  placeholder TEXT,
  default_value JSONB,
  validation JSONB,
  options JSONB,
  is_hidden BOOLEAN DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type_id UUID NOT NULL REFERENCES public.content_types(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft'
);

-- Create api_keys table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  permissions JSONB NOT NULL DEFAULT '{"read": true, "write": false}'::jsonb
);

-- Enable Row Level Security on all tables
ALTER TABLE IF EXISTS public.content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for content_types if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'content_types' AND policyname = 'Users can view their own content types'
  ) THEN
    CREATE POLICY "Users can view their own content types" ON public.content_types
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'content_types' AND policyname = 'Users can insert their own content types'
  ) THEN
    CREATE POLICY "Users can insert their own content types" ON public.content_types
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'content_types' AND policyname = 'Users can update their own content types'
  ) THEN
    CREATE POLICY "Users can update their own content types" ON public.content_types
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'content_types' AND policyname = 'Users can delete their own content types'
  ) THEN
    CREATE POLICY "Users can delete their own content types" ON public.content_types
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Add or replace the function to generate a secure API key
CREATE OR REPLACE FUNCTION generate_api_key(key_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_key TEXT;
  key_prefix TEXT;
BEGIN
  -- Generate a random API key
  new_key := encode(gen_random_bytes(32), 'base64');
  key_prefix := substring(new_key from 1 for 8);
  
  -- Insert the key into the api_keys table
  INSERT INTO public.api_keys (
    name, 
    user_id, 
    key_prefix, 
    key_hash
  ) VALUES (
    key_name, 
    auth.uid(), 
    key_prefix, 
    crypt(new_key, gen_salt('bf'))
  );
  
  -- Return the full key to the caller
  -- This is the only time the full key will be available
  RETURN key_prefix || '.' || substring(new_key from 9);
END;
$$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_content_types_user_id') THEN
    CREATE INDEX idx_content_types_user_id ON public.content_types(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_fields_content_type_id') THEN
    CREATE INDEX idx_fields_content_type_id ON public.fields(content_type_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_content_items_content_type_id') THEN
    CREATE INDEX idx_content_items_content_type_id ON public.content_items(content_type_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_content_items_user_id') THEN
    CREATE INDEX idx_content_items_user_id ON public.content_items(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_api_keys_user_id') THEN
    CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
  END IF;
END
$$;

-- Add function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_content_types_modtime') THEN
    CREATE TRIGGER update_content_types_modtime
    BEFORE UPDATE ON public.content_types
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_fields_modtime') THEN
    CREATE TRIGGER update_fields_modtime
    BEFORE UPDATE ON public.fields
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_content_items_modtime') THEN
    CREATE TRIGGER update_content_items_modtime
    BEFORE UPDATE ON public.content_items
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  END IF;
END
$$;
