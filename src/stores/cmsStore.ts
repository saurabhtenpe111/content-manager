import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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
  | 'component';

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  placeholder?: string;
  defaultValue?: any;
  validation?: {
    required: boolean;
    [key: string]: any;
  };
  options?: { label: string; value: string }[];
  subfields?: Field[];
}

export interface ContentType {
  id: string;
  name: string;
  description?: string;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
}

interface CmsState {
  contentTypes: ContentType[];
  activeContentTypeId: string | null;
  activeField: Field | null;
  isDragging: boolean;
  loading: boolean;
  error: string | null;
  
  setIsDragging: (isDragging: boolean) => void;
  fetchContentTypes: () => Promise<void>;
  addContentType: (contentType: Omit<ContentType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContentType: (id: string, contentType: Partial<ContentType>) => void;
  deleteContentType: (id: string) => void;
  setActiveContentType: (id: string | null) => void;
  addField: (contentTypeId: string, field: Omit<Field, 'id'>) => Promise<void>;
  updateField: (contentTypeId: string, fieldId: string, field: Partial<Field>) => Promise<void>;
  deleteField: (contentTypeId: string, fieldId: string) => Promise<void>;
  reorderFields: (contentTypeId: string, fieldIds: string[]) => Promise<void>;
  setActiveField: (field: Field | null) => void;
}

export const useCmsStore = create<CmsState>()(
  persist(
    (set, get) => ({
      contentTypes: [],
      activeContentTypeId: null,
      activeField: null,
      isDragging: false,
      loading: false,
      error: null,
      
      setIsDragging: (isDragging) => set({ isDragging }),
      
      fetchContentTypes: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('content_types')
            .select(`
              *,
              fields(*)
            `)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          if (data) {
            const contentTypes = data.map(ct => {
              const fields = ct.fields.map((field: any) => ({
                id: field.id,
                name: field.name,
                label: field.label,
                type: field.type as FieldType,
                description: field.description,
                placeholder: field.placeholder,
                defaultValue: field.default_value,
                validation: field.validation ? (field.validation as unknown as FieldValidation) : undefined,
                options: field.options ? (field.options as unknown as FieldOption[]) : undefined,
                subfields: field.subfields ? (field.subfields as unknown as Field[]) : undefined,
                isHidden: field.is_hidden
              }));
              
              return {
                id: ct.id,
                name: ct.name,
                description: ct.description,
                createdAt: ct.created_at,
                updatedAt: ct.updated_at,
                fields: fields as Field[]
              };
            });
            
            set({ contentTypes: contentTypes as ContentType[] });
          }
        } catch (error: any) {
          console.error('Error fetching content types:', error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      
      addContentType: async (contentType) => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            throw new Error('You must be logged in to create a content type');
          }
          
          const userId = session.user.id;
          
          const { data, error } = await supabase
            .from('content_types')
            .insert({
              name: contentType.name,
              description: contentType.description,
              user_id: userId
            })
            .select()
            .single();
          
          if (error) throw error;
          
          const id = data.id;
          const now = data.created_at;
          
          set((state) => ({
            contentTypes: [
              ...state.contentTypes,
              {
                ...contentType,
                id,
                fields: [],
                createdAt: now,
                updatedAt: now,
              },
            ],
            activeContentTypeId: id,
          }));
        } catch (error: any) {
          console.error('Error adding content type:', error);
          set({ error: error.message });
        }
      },
      
      updateContentType: async (id, contentType) => {
        try {
          const { error } = await supabase
            .from('content_types')
            .update({
              name: contentType.name,
              description: contentType.description,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);
          
          if (error) throw error;
          
          set((state) => ({
            contentTypes: state.contentTypes.map((ct) => 
              ct.id === id 
                ? { ...ct, ...contentType, updatedAt: new Date().toISOString() } 
                : ct
            ),
          }));
        } catch (error: any) {
          console.error('Error updating content type:', error);
          set({ error: error.message });
        }
      },
      
      deleteContentType: async (id) => {
        try {
          const { error } = await supabase
            .from('content_types')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set((state) => ({
            contentTypes: state.contentTypes.filter((ct) => ct.id !== id),
            activeContentTypeId: state.activeContentTypeId === id ? null : state.activeContentTypeId,
          }));
        } catch (error: any) {
          console.error('Error deleting content type:', error);
          set({ error: error.message });
        }
      },
      
      setActiveContentType: (id) => {
        set({ activeContentTypeId: id });
      },
      
      addField: async (contentTypeId, field) => {
        try {
          const { data, error } = await supabase
            .from('fields')
            .insert([{
              content_type_id: contentTypeId,
              name: field.name,
              label: field.label,
              type: field.type,
              description: field.description,
              placeholder: field.placeholder,
              default_value: field.defaultValue as Json,
              validation: field.validation as unknown as Json,
              options: field.options as unknown as Json,
              is_hidden: field.isHidden
            }])
            .select()
            .single();
          
          if (error) throw error;
          
          const id = data.id;
          
          set((state) => ({
            contentTypes: state.contentTypes.map((ct) => 
              ct.id === contentTypeId
                ? { 
                    ...ct, 
                    fields: [...ct.fields, { ...field, id }],
                    updatedAt: new Date().toISOString(),
                  }
                : ct
            ),
          }));
        } catch (error: any) {
          console.error('Error adding field:', error);
          set({ error: error.message });
        }
      },
      
      updateField: async (contentTypeId, fieldId, field) => {
        try {
          const updateData: any = {};
          
          if (field.name !== undefined) updateData.name = field.name;
          if (field.label !== undefined) updateData.label = field.label;
          if (field.type !== undefined) updateData.type = field.type;
          if (field.description !== undefined) updateData.description = field.description;
          if (field.placeholder !== undefined) updateData.placeholder = field.placeholder;
          if (field.defaultValue !== undefined) updateData.default_value = field.defaultValue;
          if (field.validation !== undefined) updateData.validation = field.validation as unknown as Json;
          if (field.options !== undefined) updateData.options = field.options as unknown as Json;
          if (field.isHidden !== undefined) updateData.is_hidden = field.isHidden;
          
          const { error } = await supabase
            .from('fields')
            .update(updateData)
            .eq('id', fieldId);
          
          if (error) throw error;
          
          set((state) => ({
            contentTypes: state.contentTypes.map((ct) => 
              ct.id === contentTypeId
                ? { 
                    ...ct, 
                    fields: ct.fields.map((f) => f.id === fieldId ? { ...f, ...field } : f),
                    updatedAt: new Date().toISOString(),
                  }
                : ct
            ),
          }));
        } catch (error: any) {
          console.error('Error updating field:', error);
          set({ error: error.message });
        }
      },
      
      deleteField: async (contentTypeId, fieldId) => {
        try {
          const { error } = await supabase
            .from('fields')
            .delete()
            .eq('id', fieldId);
          
          if (error) throw error;
          
          set((state) => ({
            contentTypes: state.contentTypes.map((ct) => 
              ct.id === contentTypeId
                ? { 
                    ...ct, 
                    fields: ct.fields.filter((f) => f.id !== fieldId),
                    updatedAt: new Date().toISOString(),
                  }
                : ct
            ),
            activeField: state.activeField?.id === fieldId ? null : state.activeField,
          }));
        } catch (error: any) {
          console.error('Error deleting field:', error);
          set({ error: error.message });
        }
      },
      
      reorderFields: async (contentTypeId, fieldIds) => {
        try {
          for (let index = 0; index < fieldIds.length; index++) {
            const fieldId = fieldIds[index];
            const { error } = await supabase
              .from('fields')
              .update({ position: index })
              .eq('id', fieldId);
            
            if (error) throw error;
          }
          
          set((state) => {
            const contentType = state.contentTypes.find((ct) => ct.id === contentTypeId);
            if (!contentType) return state;
            
            const fieldMap = new Map(contentType.fields.map((field) => [field.id, field]));
            const reorderedFields = fieldIds
              .map((id) => fieldMap.get(id))
              .filter((field): field is Field => field !== undefined);
            
            return {
              contentTypes: state.contentTypes.map((ct) => 
                ct.id === contentTypeId
                  ? { 
                      ...ct, 
                      fields: reorderedFields,
                      updatedAt: new Date().toISOString(),
                    }
                  : ct
              ),
            };
          });
        } catch (error: any) {
          console.error('Error reordering fields:', error);
          set({ error: error.message });
        }
      },
      
      setActiveField: (field) => {
        set({ activeField: field });
      },
    }),
    {
      name: 'cms-storage',
    }
  )
);

if (typeof window !== 'undefined') {
  const contentTypesChannel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'content_types'
      },
      (payload) => {
        console.log('Content types changed:', payload);
        useCmsStore.getState().fetchContentTypes();
      }
    )
    .subscribe();

  const fieldsChannel = supabase
    .channel('schema-db-changes-fields')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'fields'
      },
      (payload) => {
        console.log('Fields changed:', payload);
        useCmsStore.getState().fetchContentTypes();
      }
    )
    .subscribe();
}
