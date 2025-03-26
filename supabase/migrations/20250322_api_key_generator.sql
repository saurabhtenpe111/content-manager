
-- Add or replace the function to generate a secure API key
CREATE OR REPLACE FUNCTION generate_api_key(key_name TEXT, key_description TEXT DEFAULT NULL)
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
    description,
    user_id, 
    key_prefix, 
    key_hash,
    permissions
  ) VALUES (
    key_name,
    key_description,
    auth.uid(), 
    key_prefix, 
    crypt(new_key, gen_salt('bf')),
    jsonb_build_object('read', true, 'write', false)
  );
  
  -- Return the full key to the caller
  -- This is the only time the full key will be available
  RETURN key_prefix || '.' || substring(new_key from 9);
END;
$$;
