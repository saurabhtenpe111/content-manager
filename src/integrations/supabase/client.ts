// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tpooswmqipisupinkwyt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwb29zd21xaXBpc3VwaW5rd3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDEwMTIsImV4cCI6MjA1ODAxNzAxMn0.1QET_AbCw9dfpXqGEuELnUTJgNlydrNj0XYHLQSzkgE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);