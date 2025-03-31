
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { generateApiId, generateApiPlural } from '@/utils/api-naming';

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'password' 
  | 'date' 
  | 'dropdown' 
  | 'checkbox' 
  | 'radio' 
  | 'file' 
  | 'toggle' 
  | 'slider' 
  | 'color' 
  | 'component'
  // New field types
  | 'inputgroup'
  | 'inputmask'
  | 'inputswitch'
  | 'tristatecheckbox'
  | 'inputotp'
  | 'treeselect'
  | 'listbox'
  | 'mention'
  | 'selectbutton'
  | 'rating'
  | 'multistatecheckbox'
  | 'multiselect';

export interface Field {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  placeholder?: string;
  defaultValue?: any;
  validation?: Record<string, any>;
  options?: { label: string; value: string }[];
  subfields?: Field[];
  uiOptions?: Record<string, any>;
}

export interface ContentType {
  id: string;
  name: string;
  description?: string;
  apiId?: string;
  apiIdPlural?: string;
  isCollection?: boolean;
  fields: Field[];
  createdAt?: string;
  updatedAt?: string;
}

interface CmsState {
  contentTypes: ContentType[];
  activeContentTypeId: string | null;
  activeField: Field | null;
  isDragging: boolean;
  
  fetchContentTypes: () => Promise<void>;
  setActiveContentType: (id: string | null) => void;
  setActiveField: (field: Field | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  
  addContentType: (contentType: Omit<ContentType, 'id'>) => Promise<void>;
  updateContentType: (id: string, data: Partial<ContentType>) => void;
  deleteContentType: (id: string) => void;
  
  addField: (contentTypeId: string, field: Omit<Field, 'id'>) => void;
  updateField: (contentTypeId: string, fieldId: string, data: Partial<Field>) => void;
  deleteField: (contentTypeId: string, fieldId: string) => void;
  reorderFields: (contentTypeId: string, newOrder: string[]) => void;
}

export const useCmsStore = create<CmsState>((set, get) => ({
  contentTypes: [],
  activeContentTypeId: null,
  activeField: null,
  isDragging: false,
  
  fetchContentTypes: async () => {
    try {
      const { data, error } = await supabase
        .from('content_types')
        .select(`
          *,
          fields (*)
        `)
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      // Convert from database format to our internal format
      const contentTypes: ContentType[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        apiId: generateApiId(item.name), // Generate apiId from name
        apiIdPlural: generateApiPlural(generateApiId(item.name)),
        isCollection: item.is_published !== false, // Use is_published as fallback for isCollection
        fields: (item.fields || []).map((field: any) => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type,
          description: field.description,
          placeholder: field.placeholder,
          defaultValue: field.default_value,
          validation: field.validation,
          options: field.options,
          uiOptions: field.ui_options || {},
        })),
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      
      set({ contentTypes });
    } catch (error) {
      console.error('Error fetching content types:', error);
    }
  },
  
  setActiveContentType: (id) => set({ activeContentTypeId: id }),
  setActiveField: (field) => set({ activeField: field }),
  setIsDragging: (isDragging) => set({ isDragging }),
  
  addContentType: async (contentType) => {
    try {
      const apiId = contentType.apiId || generateApiId(contentType.name);
      const apiIdPlural = contentType.apiIdPlural || generateApiPlural(apiId);
      
      // Match the Supabase schema - use name, description, and is_published
      const { data, error } = await supabase
        .from('content_types')
        .insert([
          { 
            id: uuidv4(), 
            name: contentType.name, 
            description: contentType.description,
            is_published: contentType.isCollection !== false,
            user_id: 'system' // Required field in the schema
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      set((state) => ({
        contentTypes: [...state.contentTypes, { 
          id: data.id, 
          name: data.name, 
          description: data.description,
          apiId: apiId, // Store generated apiId
          apiIdPlural: apiIdPlural, // Store generated apiIdPlural
          isCollection: data.is_published !== false,
          fields: [],
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }],
      }));
    } catch (error: any) {
      console.error('Error creating content type:', error);
      throw error;
    }
  },
  
  updateContentType: (id, data) => {
    set((state) => ({
      contentTypes: state.contentTypes.map((contentType) =>
        contentType.id === id ? { ...contentType, ...data } : contentType
      ),
    }));
  },
  
  deleteContentType: (id) => {
    set((state) => ({
      contentTypes: state.contentTypes.filter((contentType) => contentType.id !== id),
    }));
  },
  
  addField: (contentTypeId, field) => {
    const newField = { id: uuidv4(), ...field };
    
    set((state) => ({
      contentTypes: state.contentTypes.map((contentType) =>
        contentType.id === contentTypeId
          ? { ...contentType, fields: [...contentType.fields, newField] }
          : contentType
      ),
    }));
  },
  
  updateField: (contentTypeId, fieldId, data) => {
    set((state) => ({
      contentTypes: state.contentTypes.map((contentType) =>
        contentType.id === contentTypeId
          ? {
              ...contentType,
              fields: contentType.fields.map((field) =>
                field.id === fieldId ? { ...field, ...data } : field
              ),
            }
          : contentType
      ),
    }));
  },
  
  deleteField: (contentTypeId, fieldId) => {
    set((state) => ({
      contentTypes: state.contentTypes.map((contentType) =>
        contentType.id === contentTypeId
          ? {
              ...contentType,
              fields: contentType.fields.filter((field) => field.id !== fieldId),
            }
          : contentType
      ),
    }));
  },
  
  reorderFields: (contentTypeId, newOrder) => {
    set((state) => ({
      contentTypes: state.contentTypes.map((contentType) => {
        if (contentType.id === contentTypeId) {
          const orderedFields = newOrder.map(id => 
            contentType.fields.find(field => field.id === id)! // ! because we know it exists
          );
          return { ...contentType, fields: orderedFields };
        }
        return contentType;
      }),
    }));
  },
}));
