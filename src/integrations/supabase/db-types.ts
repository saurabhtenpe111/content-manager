
/**
 * Database types from Supabase
 * These types reflect the exact column names and structure in the database
 */

export interface DbContentType {
  id: string;
  name: string;
  description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  api_id?: string;
  api_id_plural?: string;
}

export interface DbField {
  id: string;
  name: string;
  label: string;
  type: string;
  description?: string;
  placeholder?: string;
  default_value?: any;
  validation?: Record<string, any>;
  options?: any;
  ui_options?: Record<string, any>;
  content_type_id: string;
  position: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbContentItem {
  id: string;
  content_type_id: string;
  user_id: string;
  data: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DbApiKey {
  id: string;
  name: string;
  description?: string;
  key_hash: string;
  key_prefix: string;
  permissions: {
    read: boolean;
    write: boolean;
    [key: string]: boolean;
  };
  user_id: string;
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
}

export interface DbUser {
  id: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}
