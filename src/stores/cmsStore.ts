
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
  apiId?: string;
  apiIdPlural?: string;
  isCollection?: boolean;
}

interface CmsStore {
  contentTypes: ContentType[];
  activeContentType: string | null;
  activeField: Field | null;
  isDragging: boolean;
  fieldLibrary: Field[];
  activeContentTypeId?: string;
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

// Utility function to safely parse JSON or return a default value
function safeParseJson(json: any, defaultValue: any = null) {
  if (!json) return defaultValue;
  
  try {
    if (typeof json === 'object') return json;
    return JSON.parse(json);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}

export const useCmsStore = create<CmsStore>((set, get) => ({
  contentTypes: [],
  activeContentType: null,
  activeField: null,
  isDragging: false,
  fieldLibrary: [],
  activeContentTypeId: undefined,

  fetchContentTypes: async () => {
    try {
      console.log('Fetching content types from Supabase...');
      
      const { data: contentTypesData, error: contentTypesError } = await supabase
        .from('content_types')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (contentTypesError) {
        if (contentTypesError.code === '42P01') {
          console.error('Table does not exist. Check your database setup.');
          return;
        }
        throw contentTypesError;
      }
      
      if (!contentTypesData || contentTypesData.length === 0) {
        console.log('No content types found');
        set({ contentTypes: [] });
        return;
      }
      
      console.log('Fetched content types:', contentTypesData);
      
      const contentTypesWithFields = await Promise.all(
        contentTypesData.map(async (contentType) => {
          const { data: fieldsData, error: fieldsError } = await supabase
            .from('fields')
            .select('*')
            .eq('content_type_id', contentType.id)
            .order('position', { ascending: true });
          
          if (fieldsError) {
            if (fieldsError.code === '42P01') {
              console.error('Fields table does not exist. Check your database setup.');
              return {
                id: contentType.id,
                name: contentType.name,
                description: contentType.description || '',
                fields: [],
                createdAt: contentType.created_at,
                updatedAt: contentType.updated_at,
                apiId: contentType.api_id,
                apiIdPlural: contentType.api_id_plural,
                isCollection: contentType.is_collection,
              };
            }
            throw fieldsError;
          }
          
          const fields: Field[] = (fieldsData || []).map((field) => {
            const validationObj = safeParseJson(field.validation, { required: false });
            const optionsObj = safeParseJson(field.options, []);
            const uiOptionsObj = safeParseJson(field.ui_options, {});
            
            return {
              id: field.id,
              name: field.name,
              label: field.label,
              type: field.type as FieldType,
              description: field.description || undefined,
              placeholder: field.placeholder || undefined,
              defaultValue: field.default_value || undefined,
              validation: validationObj,
              options: optionsObj,
              uiOptions: uiOptionsObj,
              isHidden: field.is_hidden || false,
            };
          });
          
          return {
            id: contentType.id,
            name: contentType.name,
            description: contentType.description || '',
            fields,
            createdAt: contentType.created_at,
            updatedAt: contentType.updated_at,
            apiId: contentType.api_id,
            apiIdPlural: contentType.api_id_plural,
            isCollection: contentType.is_collection,
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
          api_id: contentType.apiId,
          api_id_plural: contentType.apiIdPlural,
          is_collection: contentType.isCollection !== false,
        })
        .select()
        .single();
      
      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist yet - create a local content type
          const newContentType: ContentType = {
            id: `local-${Date.now()}`,
            name: contentType.name,
            description: contentType.description || '',
            fields: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            apiId: contentType.apiId,
            apiIdPlural: contentType.apiIdPlural,
            isCollection: contentType.isCollection,
          };
          
          set((state) => ({
            contentTypes: [...state.contentTypes, newContentType],
            activeContentType: newContentType.id,
          }));
          
          return;
        }
        throw error;
      }
      
      if (data) {
        const newContentType: ContentType = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          fields: [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          apiId: data.api_id,
          apiIdPlural: data.api_id_plural,
          isCollection: data.is_collection,
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
          api_id: contentType.apiId,
          api_id_plural: contentType.apiIdPlural,
          is_collection: contentType.isCollection,
        })
        .eq('id', id);
      
      if (error && error.code !== '42P01') throw error;
      
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
      
      if (error && error.code !== '42P01') throw error;
      
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
      
      // Prepare field data for insertion
      const fieldData = {
        content_type_id: contentTypeId,
        name: field.name,
        label: field.label,
        type: field.type,
        description: field.description || null,
        placeholder: field.placeholder || null,
        default_value: field.defaultValue || null,
        validation: field.validation || { required: false },
        options: field.options || null,
        ui_options: field.uiOptions || null,
        position,
        is_hidden: field.isHidden || false,
      };
      
      const { data, error } = await supabase
        .from('fields')
        .insert(fieldData)
        .select()
        .single();
      
      if (error) {
        if (error.code === '42P01' || error.code === '42703') {
          // Table doesn't exist or missing column - create a local field
          const newField: Field = {
            id: `local-${Date.now()}`,
            name: field.name,
            label: field.label,
            type: field.type,
            description: field.description,
            placeholder: field.placeholder,
            defaultValue: field.defaultValue,
            validation: field.validation,
            options: field.options,
            uiOptions: field.uiOptions,
            isHidden: field.isHidden,
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
          
          return;
        }
        throw error;
      }
      
      if (data) {
        const newField: Field = {
          id: data.id,
          name: data.name,
          label: data.label,
          type: data.type as FieldType,
          description: data.description || undefined,
          placeholder: data.placeholder || undefined,
          defaultValue: data.default_value || undefined,
          validation: safeParseJson(data.validation, { required: false }),
          options: safeParseJson(data.options, []),
          uiOptions: safeParseJson(data.ui_options, {}),
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
      // Find the current field to merge with updates
      const currentField = get().contentTypes
        .find(ct => ct.id === contentTypeId)?.fields
        .find(f => f.id === fieldId);
      
      if (!currentField) throw new Error('Field not found');
      
      const updatedField = {
        ...currentField,
        ...field
      };
      
      const fieldToUpdate: any = {
        name: updatedField.name,
        label: updatedField.label,
        type: updatedField.type,
        description: updatedField.description,
        placeholder: updatedField.placeholder,
        default_value: updatedField.defaultValue,
        validation: updatedField.validation,
        options: updatedField.options,
        ui_options: updatedField.uiOptions,
        is_hidden: updatedField.isHidden,
      };
      
      const { error } = await supabase
        .from('fields')
        .update(fieldToUpdate)
        .eq('id', fieldId)
        .eq('content_type_id', contentTypeId);
      
      if (error && error.code !== '42P01' && error.code !== '42703') throw error;
      
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
      
      if (error && error.code !== '42P01') throw error;
      
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
      
      const updatePromises = fieldIds.map((id, index) =>
        supabase
          .from('fields')
          .update({ position: index })
          .eq('id', id)
          .eq('content_type_id', contentTypeId)
      );
      
      try {
        await Promise.all(updatePromises);
      } catch (error: any) {
        if (error.code !== '42P01') throw error;
      }
      
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
    set({ 
      activeContentType: contentTypeId,
      activeContentTypeId: contentTypeId || undefined
    });
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
      
      if (error && error.code !== '42P01') throw error;
      
      if (data && data.length > 0) {
        const fieldLibrary: Field[] = data.map((field) => {
          const properties = field.properties || {};
          return {
            id: field.id,
            name: field.name,
            label: field.name,
            type: field.type as FieldType,
            description: field.description || undefined,
            options: properties.options || undefined,
            validation: properties.validation || undefined,
            defaultValue: properties.defaultValue || undefined,
          };
        });
        
        set({ fieldLibrary });
      } else {
        // If no field library exists or we can't fetch it, create a default one
        const defaultFields: Field[] = [
          {
            id: 'text-field',
            name: 'text',
            label: 'Text',
            type: 'text',
            description: 'Simple text input field'
          },
          {
            id: 'textarea-field',
            name: 'textarea',
            label: 'Text Area',
            type: 'textarea',
            description: 'Multi-line text input'
          },
          {
            id: 'number-field',
            name: 'number',
            label: 'Number',
            type: 'number',
            description: 'Numeric input field'
          },
          {
            id: 'email-field',
            name: 'email',
            label: 'Email',
            type: 'email',
            description: 'Email input field'
          },
          {
            id: 'dropdown-field',
            name: 'dropdown',
            label: 'Dropdown',
            type: 'dropdown',
            description: 'Select from a list of options',
            options: [
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' },
              { label: 'Option 3', value: 'option3' }
            ]
          }
        ];
        
        set({ fieldLibrary: defaultFields });
      }
    } catch (error: any) {
      console.error('Error fetching field library:', error);
      toast.error(`Failed to load field library: ${error.message}`);
      
      // Set default field library if there's an error
      const defaultFields: Field[] = [
        {
          id: 'text-field',
          name: 'text',
          label: 'Text',
          type: 'text',
          description: 'Simple text input field'
        },
        {
          id: 'textarea-field',
          name: 'textarea',
          label: 'Text Area',
          type: 'textarea',
          description: 'Multi-line text input'
        },
        {
          id: 'number-field',
          name: 'number',
          label: 'Number',
          type: 'number',
          description: 'Numeric input field'
        },
        {
          id: 'email-field',
          name: 'email',
          label: 'Email',
          type: 'email',
          description: 'Email input field'
        }
      ];
      
      set({ fieldLibrary: defaultFields });
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
      
      if (error && error.code !== '42P01') throw error;
      
      // Create a new field in local state regardless of DB success
      const newField: Field = {
        id: data?.id || `local-${Date.now()}`,
        name: field.name,
        label: field.name,
        type: field.type,
        description: field.description,
        options: field.options,
        validation: field.validation,
        defaultValue: field.defaultValue,
      };
      
      set((state) => ({
        fieldLibrary: [...state.fieldLibrary, newField],
      }));
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
      
      const { error } = await supabase
        .from('field_types')
        .update(fieldToUpdate)
        .eq('id', fieldId);
      
      if (error && error.code !== '42P01') throw error;
      
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
      
      if (error && error.code !== '42P01') throw error;
      
      set((state) => ({
        fieldLibrary: state.fieldLibrary.filter((f) => f.id !== fieldId),
      }));
    } catch (error: any) {
      console.error('Error deleting field from library:', error);
      toast.error(`Failed to delete field from library: ${error.message}`);
    }
  },
}));
