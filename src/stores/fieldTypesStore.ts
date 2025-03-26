
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface FieldTypeProperties {
  categories?: string[];
  validations?: Record<string, any>;
  ui?: Record<string, any>;
  formatting?: Record<string, any>;
  features?: Record<string, any>;
  [key: string]: any; // Add index signature to allow for any additional properties
}

export interface FieldType {
  id: string;
  name: string;
  type: string;
  description: string | null;
  properties: FieldTypeProperties;
  created_at: string;
  updated_at: string;
}

interface FieldTypesState {
  fieldTypes: FieldType[];
  loading: boolean;
  error: string | null;
  fetchFieldTypes: () => Promise<void>;
}

export const useFieldTypesStore = create<FieldTypesState>((set) => ({
  fieldTypes: [],
  loading: false,
  error: null,
  fetchFieldTypes: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('field_types')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      // Ensure data is properly typed as FieldType[]
      const typedData = data?.map(item => ({
        ...item,
        properties: item.properties as FieldTypeProperties,
        description: item.description || null
      })) || [];
      
      set({ fieldTypes: typedData, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message, 
        loading: false 
      });
      console.error('Error fetching field types:', error);
    }
  },
}));
