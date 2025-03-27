
import { Json } from "./types";

export interface ContentType {
  created_at: string;
  description: string;
  id: string;
  is_published: boolean;
  name: string;
  updated_at: string;
  user_id: string;
  api_id: string;
  api_id_plural: string;
  is_collection: boolean;
  fields: ContentTypeField[];
}

export interface ContentTypeField {
  content_type_id: string;
  created_at: string;
  default_value: Json;
  id: string;
  is_required: boolean;
  name: string;
  options: Json;
  order: number;
  type: string;
  updated_at: string;
  user_id: string;
  validation: Json;
}
