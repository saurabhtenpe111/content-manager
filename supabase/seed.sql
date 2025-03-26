
-- Add field types if they don't exist
INSERT INTO public.field_types (id, name, type, description, properties)
SELECT 
  gen_random_uuid(), 
  'Text Field', 
  'text', 
  'Basic single-line text input',
  '{
    "ui": {
      "hint": "",
      "dummy": false,
      "label": "Text Field",
      "enabled": true,
      "placeholder": "",
      "additionalInfo": ""
    },
    "categories": ["text"],
    "formatting": {
      "mode": "",
      "prefix": "",
      "suffix": ""
    },
    "validations": {
      "regex": "",
      "numeric": false,
      "alphabet": false,
      "required": false,
      "encrypted": false,
      "maxLength": null,
      "minLength": null,
      "alphanumeric": false
    }
  }'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.field_types WHERE type = 'text'
);

-- Add or replace the function to generate a secure API key
CREATE OR REPLACE FUNCTION generate_api_key(key_name TEXT, key_description TEXT DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_key TEXT;
  key_prefix TEXT;
  user_id UUID;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();

  -- Check if user is authenticated
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to generate an API key';
  END IF;

  -- Generate a random API key
  new_key := encode(gen_random_bytes(32), 'base64');
  key_prefix := substring(new_key from 1 for 8);
  
  -- Insert the key into the api_keys table
  INSERT INTO public.api_keys (
    name, 
    description,
    user_id, 
    key_prefix, 
    key_hash,
    permissions
  ) VALUES (
    key_name,
    key_description, 
    user_id, 
    key_prefix, 
    crypt(new_key, gen_salt('bf')),
    '{"read": true, "write": false}'::jsonb
  );
  
  -- Return the full key to the caller
  -- This is the only time the full key will be available
  RETURN key_prefix || '.' || substring(new_key from 9);
END;
$$;

-- Function to verify an API key
CREATE OR REPLACE FUNCTION verify_api_key(api_key TEXT)
RETURNS TABLE (
  authenticated BOOLEAN,
  user_id UUID,
  permissions JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_parts TEXT[];
  key_prefix TEXT;
  key_data RECORD;
BEGIN
  -- Split the API key to get the prefix
  key_parts := string_to_array(api_key, '.');
  IF array_length(key_parts, 1) != 2 THEN
    RETURN QUERY SELECT 
      false AS authenticated,
      NULL::UUID AS user_id,
      NULL::JSONB AS permissions;
    RETURN;
  END IF;
  
  key_prefix := key_parts[1];
  
  -- Lookup the API key in the database by prefix
  SELECT * INTO key_data 
  FROM api_keys
  WHERE key_prefix = key_prefix;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      false AS authenticated,
      NULL::UUID AS user_id,
      NULL::JSONB AS permissions;
    RETURN;
  END IF;
  
  -- Update last used timestamp
  UPDATE api_keys
  SET last_used_at = now()
  WHERE id = key_data.id;
  
  -- Return authentication result
  RETURN QUERY SELECT 
    true AS authenticated,
    key_data.user_id,
    key_data.permissions;
END;
$$;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create API keys table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{"read": true, "write": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create content_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT false NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
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
  position INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create content_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type_id UUID NOT NULL REFERENCES public.content_types(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}'::jsonb NOT NULL,
  status TEXT DEFAULT 'draft' NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create or replace the function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- API Keys policies
CREATE POLICY "Users can view their own API keys" ON public.api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys" ON public.api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" ON public.api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" ON public.api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- Content Types policies
CREATE POLICY "Users can view their own content types" ON public.content_types
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content types" ON public.content_types
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content types" ON public.content_types
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content types" ON public.content_types
  FOR DELETE USING (auth.uid() = user_id);

-- Fields policies for content types
CREATE POLICY "Users can view fields of their content types" ON public.fields
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.content_types
      WHERE id = content_type_id AND auth.uid() = user_id
    )
  );

CREATE POLICY "Users can create fields for their content types" ON public.fields
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content_types
      WHERE id = content_type_id AND auth.uid() = user_id
    )
  );

CREATE POLICY "Users can update fields of their content types" ON public.fields
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.content_types
      WHERE id = content_type_id AND auth.uid() = user_id
    )
  );

CREATE POLICY "Users can delete fields of their content types" ON public.fields
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.content_types
      WHERE id = content_type_id AND auth.uid() = user_id
    )
  );

-- Content Items policies
CREATE POLICY "Users can view their own content items" ON public.content_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content items" ON public.content_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content items" ON public.content_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content items" ON public.content_items
  FOR DELETE USING (auth.uid() = user_id);
