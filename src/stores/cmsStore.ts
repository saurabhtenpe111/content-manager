import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'password' 
  | 'checkbox' 
  | 'radio' 
  | 'dropdown' 
  | 'date' 
  | 'time' 
  | 'datetime' 
  | 'file' 
  | 'image' 
  | 'component' 
  | 'group' 
  | 'rich-text' 
  | 'url' 
  | 'color' 
  | 'rating' 
  | 'switch' 
  | 'slider'
  | 'toggle'
  | 'calendar'
  | 'inputgroup'
  | 'inputmask'
  | 'inputswitch'
  | 'tristatecheckbox'
  | 'inputotp'
  | 'treeselect'
  | 'mentionbox'
  | 'selectbutton'
  | 'multistatecheckbox';

export interface UiOptions {
  displayMode?: string;
  labelPosition?: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  cols?: number;
  format?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  pattern?: string;
  autocomplete?: string;
  className?: string;
  style?: Record<string, string>;
  floatingLabel?: boolean;
  filled?: boolean;
  showIcon?: boolean;
  inline?: boolean;
  multipleMonths?: number;
  showButtons?: boolean;
  showTime?: boolean;
  range?: boolean;
  dateFormat?: string;
  monthsOnly?: boolean;
  yearsOnly?: boolean;
  autoResize?: boolean;
  checkboxSelection?: boolean;
  filterable?: boolean;
  showClear?: boolean;
  count?: number;
  allowCancel?: boolean;
  triggers?: string[];
  optional?: boolean;
  slotChar?: string;
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
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: { label: string; value: string; disabled?: boolean }[];
  subfields?: Field[];
  uiOptions?: UiOptions;
  isHidden?: boolean;
  _parentFieldId?: string;
  _subfieldIndex?: number;
}

export interface ContentType {
  id: string;
  name: string;
  description: string;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
}

interface CmsStore {
  contentTypes: ContentType[];
  activeContentType: string | null;
  activeField: Field | null;
  isDragging: boolean;
  fieldLibrary: Field[];
  fetchContentTypes: () => Promise<void>;
  addContentType: (contentType: Omit<ContentType, 'id' | 'fields' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContentType: (id: string, contentType: Partial<Omit<ContentType, 'id' | 'fields'>>) => Promise<void>;
  deleteContentType: (id: string) => Promise<void>;
  addField: (contentTypeId: string, field: Omit<Field, 'id'>) => Promise<void>;
  updateField: (contentTypeId: string, fieldId: string, field: Partial<Field>) => Promise<void>;
  deleteField: (contentTypeId: string, fieldId: string) => Promise<void>;
  reorderFields: (contentTypeId: string, fieldIds: string[]) => Promise<void>;
  setActiveContentType: (contentTypeId: string | null) => void;
  setActiveField: (field: Field | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  fetchFieldLibrary: () => Promise<void>;
  addFieldToLibrary: (field: Omit<Field, 'id'>) => Promise<void>;
  updateFieldInLibrary: (fieldId: string, field: Partial<Field>) => Promise<void>;
  deleteFieldFromLibrary: (fieldId: string) => Promise<void>;
}

export const useCmsStore = create<CmsStore>((set, get) => ({
  contentTypes: [],
  activeContentType: null,
  activeField: null,
  isDragging: false,
  fieldLibrary: [],

  fetchContentTypes: async () => {
    try {
      console.log('Fetching content types from Supabase...');
      
      // Fetch content types
      const { data: contentTypesData, error: contentTypesError } = await supabase
        .from('content_types')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (contentTypesError) throw contentTypesError;
      
      if (!contentTypesData) {
        console.log('No content types found');
        set({ contentTypes: [] });
        return;
      }
      
      console.log('Fetched content types:', contentTypesData);
      
      // Fetch fields for each content type
      const contentTypesWithFields = await Promise.all(
        contentTypesData.map(async (contentType) => {
          const { data: fieldsData, error: fieldsError } = await supabase
            .from('fields')
            .select('*')
            .eq('content_type_id', contentType.id)
            .order('position', { ascending: true });
          
          if (fieldsError) throw fieldsError;
          
          // Map database fields to application fields
          const fields: Field[] = (fieldsData || []).map((field) => ({
            id: field.id,
            name: field.name,
            label: field.label,
            type: field.type as FieldType,
            description: field.description || undefined,
            placeholder: field.placeholder || undefined,
            defaultValue: field.default_value || undefined,
            validation: typeof field.validation === 'object' ? field.validation : undefined,
            options: Array.isArray(field.options) ? field.options : undefined,
            uiOptions: field.ui_options ? field.ui_options : undefined,
            isHidden: field.is_hidden || false,
          }));
          
          return {
            id: contentType.id,
            name: contentType.name,
            description: contentType.description || '',
            fields,
            createdAt: contentType.created_at,
            updatedAt: contentType.updated_at,
          };
        })
      );
      
      console.log('Content types with fields:', contentTypesWithFields);
      set({ contentTypes: contentTypesWithFields });
    } catch (error: any) {
      console.error('Error fetching content types:', error);
      toast.error(`Failed to load content types: ${error.message}`);
    }
  },

  addContentType: async (contentType) => {
    try {
      const { data, error } = await supabase
        .from('content_types')
        .insert({
          name: contentType.name,
          description: contentType.description || '',
          user_id: (await supabase.auth.getUser()).data.user?.id || 'system',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newContentType: ContentType = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          fields: [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set((state) => ({
          contentTypes: [...state.contentTypes, newContentType],
          activeContentType: data.id,
        }));
      }
    } catch (error: any) {
      console.error('Error adding content type:', error);
      toast.error(`Failed to add content type: ${error.message}`);
    }
  },

  updateContentType: async (id, contentType) => {
    try {
      const { error } = await supabase
        .from('content_types')
        .update({
          name: contentType.name,
          description: contentType.description || '',
        })
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        contentTypes: state.contentTypes.map((ct) =>
          ct.id === id
            ? {
                ...ct,
                ...contentType,
                updatedAt: new Date().toISOString(),
              }
            : ct
        ),
      }));
    } catch (error: any) {
      console.error('Error updating content type:', error);
      toast.error(`Failed to update content type: ${error.message}`);
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
        activeContentType: state.activeContentType === id ? null : state.activeContentType,
      }));
    } catch (error: any) {
      console.error('Error deleting content type:', error);
      toast.error(`Failed to delete content type: ${error.message}`);
    }
  },

  addField: async (contentTypeId, field) => {
    try {
      const contentType = get().contentTypes.find((ct) => ct.id === contentTypeId);
      if (!contentType) throw new Error('Content type not found');
      
      const position = contentType.fields.length;
      const { data, error } = await supabase
        .from('fields')
        .insert({
          content_type_id: contentTypeId,
          name: field.name,
          label: field.label,
          type: field.type,
          description: field.description || null,
          placeholder: field.placeholder || null,
          default_value: field.defaultValue || null,
          validation: field.validation || null,
          options: field.options || null,
          ui_options: field.uiOptions || null,
          position,
          is_hidden: field.isHidden || false,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newField: Field = {
          id: data.id,
          name: data.name,
          label: data.label,
          type: data.type as FieldType,
          description: data.description || undefined,
          placeholder: data.placeholder || undefined,
          defaultValue: data.default_value || undefined,
          validation: typeof data.validation === 'object' ? data.validation : undefined,
          options: Array.isArray(data.options) ? data.options : undefined,
          uiOptions: data.ui_options || undefined,
          isHidden: data.is_hidden || false,
          subfields: field.subfields || [],
        };
        
        set((state) => ({
          contentTypes: state.contentTypes.map((ct) =>
            ct.id === contentTypeId
              ? {
                  ...ct,
                  fields: [...ct.fields, newField],
                  updatedAt: new Date().toISOString(),
                }
              : ct
          ),
        }));
      }
    } catch (error: any) {
      console.error('Error adding field:', error);
      toast.error(`Failed to add field: ${error.message}`);
    }
  },

  updateField: async (contentTypeId, fieldId, field) => {
    try {
      const fieldToUpdate: any = {
        name: field.name,
        label: field.label,
        type: field.type,
        description: field.description,
        placeholder: field.placeholder,
        default_value: field.defaultValue,
        validation: field.validation,
        options: field.options,
        ui_options: field.uiOptions,
        is_hidden: field.isHidden,
      };
      
      // Remove undefined values to prevent overwriting with nulls
      Object.keys(fieldToUpdate).forEach(key => {
        if (fieldToUpdate[key] === undefined) {
          delete fieldToUpdate[key];
        }
      });
      
      const { error } = await supabase
        .from('fields')
        .update(fieldToUpdate)
        .eq('id', fieldId)
        .eq('content_type_id', contentTypeId);
      
      if (error) throw error;
      
      set((state) => ({
        contentTypes: state.contentTypes.map((ct) =>
          ct.id === contentTypeId
            ? {
                ...ct,
                fields: ct.fields.map((f) =>
                  f.id === fieldId
                    ? {
                        ...f,
                        ...field,
                      }
                    : f
                ),
                updatedAt: new Date().toISOString(),
              }
            : ct
        ),
      }));
    } catch (error: any) {
      console.error('Error updating field:', error);
      toast.error(`Failed to update field: ${error.message}`);
    }
  },

  deleteField: async (contentTypeId, fieldId) => {
    try {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', fieldId)
        .eq('content_type_id', contentTypeId);
      
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
      toast.error(`Failed to delete field: ${error.message}`);
    }
  },

  reorderFields: async (contentTypeId, fieldIds) => {
    try {
      const contentType = get().contentTypes.find((ct) => ct.id === contentTypeId);
      if (!contentType) throw new Error('Content type not found');
      
      // Create a mapping of field IDs to their new positions
      const positions = fieldIds.reduce(
        (acc, id, index) => ({
          ...acc,
          [id]: index,
        }),
        {}
      );
      
      // Update field positions in the database
      const updatePromises = fieldIds.map((id, index) =>
        supabase
          .from('fields')
          .update({ position: index })
          .eq('id', id)
          .eq('content_type_id', contentTypeId)
      );
      
      await Promise.all(updatePromises);
      
      // Update the local state with the new field order
      set((state) => ({
        contentTypes: state.contentTypes.map((ct) =>
          ct.id === contentTypeId
            ? {
                ...ct,
                fields: fieldIds
                  .map((id) => ct.fields.find((f) => f.id === id))
                  .filter(Boolean) as Field[],
                updatedAt: new Date().toISOString(),
              }
            : ct
        ),
      }));
    } catch (error: any) {
      console.error('Error reordering fields:', error);
      toast.error(`Failed to reorder fields: ${error.message}`);
    }
  },

  setActiveContentType: (contentTypeId) => {
    set({ activeContentType: contentTypeId });
  },

  setActiveField: (field) => {
    set({ activeField: field });
  },

  setIsDragging: (isDragging) => {
    set({ isDragging });
  },

  fetchFieldLibrary: async () => {
    try {
      const { data, error } = await supabase
        .from('field_types')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        const fieldLibrary: Field[] = data.map((field) => ({
          id: field.id,
          name: field.name,
          label: field.name,
          type: field.type as FieldType,
          description: field.description || undefined,
          options: field.properties && typeof field.properties === 'object' && field.properties.options ? field.properties.options : undefined,
          validation: field.properties && typeof field.properties === 'object' && field.properties.validation ? field.properties.validation : undefined,
          defaultValue: field.properties && typeof field.properties === 'object' && field.properties.defaultValue ? field.properties.defaultValue : undefined,
        }));
        
        set({ fieldLibrary });
      }
    } catch (error: any) {
      console.error('Error fetching field library:', error);
      toast.error(`Failed to load field library: ${error.message}`);
    }
  },

  addFieldToLibrary: async (field) => {
    try {
      const { data, error } = await supabase
        .from('field_types')
        .insert({
          name: field.name,
          type: field.type,
          description: field.description || null,
          properties: {
            options: field.options || null,
            validation: field.validation || null,
            defaultValue: field.defaultValue || null,
          },
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newField: Field = {
          id: data.id,
          name: data.name,
          label: data.name,
          type: data.type as FieldType,
          description: data.description || undefined,
          options: data.properties?.options || undefined,
          validation: data.properties?.validation || undefined,
          defaultValue: data.properties?.defaultValue || undefined,
        };
        
        set((state) => ({
          fieldLibrary: [...state.fieldLibrary, newField],
        }));
      }
    } catch (error: any) {
      console.error('Error adding field to library:', error);
      toast.error(`Failed to add field to library: ${error.message}`);
    }
  },

  updateFieldInLibrary: async (fieldId, field) => {
    try {
      const fieldToUpdate = {
        name: field.name,
        type: field.type,
        description: field.description,
        properties: {
          options: field.options,
          validation: field.validation,
          defaultValue: field.defaultValue,
        },
      };
      
      // Remove undefined values
      Object.keys(fieldToUpdate).forEach(key => {
        if (fieldToUpdate[key] === undefined) {
          delete fieldToUpdate[key];
        }
      });
      
      const { error } = await supabase
        .from('field_types')
        .update(fieldToUpdate)
        .eq('id', fieldId);
      
      if (error) throw error;
      
      set((state) => ({
        fieldLibrary: state.fieldLibrary.map((f) =>
          f.id === fieldId
            ? {
                ...f,
                ...field,
              }
            : f
        ),
      }));
    } catch (error: any) {
      console.error('Error updating field in library:', error);
      toast.error(`Failed to update field in library: ${error.message}`);
    }
  },

  deleteFieldFromLibrary: async (fieldId) => {
    try {
      const { error } = await supabase
        .from('field_types')
        .delete()
        .eq('id', fieldId);
      
      if (error) throw error;
      
      set((state) => ({
        fieldLibrary: state.fieldLibrary.filter((f) => f.id !== fieldId),
      }));
    } catch (error: any) {
      console.error('Error deleting field from library:', error);
      toast.error(`Failed to delete field from library: ${error.message}`);
    }
  },
}));
