
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { ContentType as ContentTypeType } from '@/integrations/supabase/contentTypes';
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
  | 'color' 
  | 'slider' 
  | 'toggle'
  | 'component'
  | 'calendar'
  | 'inputgroup'
  | 'inputmask'
  | 'inputswitch'
  | 'tristatecheckbox'
  | 'inputotp'
  | 'treeselect'
  | 'mentionbox'
  | 'selectbutton'
  | 'rating'
  | 'multistatecheckbox';

export interface UiOptions {
  floatingLabel?: boolean;
  filled?: boolean;
  showIcon?: boolean;
  inline?: boolean;
  multipleMonths?: boolean;
  showButtons?: boolean;
  showTime?: boolean;
  autoResize?: boolean;
  showHeader?: boolean;
  checkboxSelection?: boolean;
  filterable?: boolean;
  showClear?: boolean;
  range?: boolean;
  count?: number;
  allowCancel?: boolean;
  triggers?: string[];
  dateFormat?: string;
  monthsOnly?: boolean;
  optional?: boolean;
  slotChar?: string;
  [key: string]: any;
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
  options?: { label: string; value: string }[];
  subfields?: Field[];
  isHidden?: boolean;
  uiOptions?: UiOptions;
  _parentFieldId?: string;
  _subfieldIndex?: number;
}

export interface ContentType {
  id: string;
  name: string;
  description: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  api_id: string;
  api_id_plural: string;
  is_collection: boolean;
  fields: Field[];
}

interface CmsStore {
  contentTypes: ContentType[];
  activeField: Field | null;
  activeContentTypeId: string | null;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  setActiveField: (field: Field | null) => void;
  setActiveContentType: (contentTypeId: string | null) => void;
  fetchContentTypes: () => Promise<void>;
  createContentType: (contentType: Omit<ContentType, 'id' | 'fields' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<string>;
  updateContentType: (contentTypeId: string, updates: Partial<ContentType>) => void;
  deleteContentType: (contentTypeId: string) => void;
  addField: (contentTypeId: string, field: Omit<Field, 'id'>) => Promise<string>;
  updateField: (contentTypeId: string, fieldId: string, updates: Partial<Field>) => void;
  updateSubfield: (contentTypeId: string, parentFieldId: string, subfieldIndex: number, updates: Partial<Field>) => void;
  deleteField: (contentTypeId: string, fieldId: string) => void;
  reorderFields: (contentTypeId: string, newOrder: string[]) => void;
  getFieldById: (contentTypeId: string, fieldId: string) => Field | undefined;
}

export const useCmsStore = create<CmsStore>((set, get) => ({
  contentTypes: [],
  activeField: null,
  activeContentTypeId: null,
  isDragging: false,
  
  setIsDragging: (isDragging) => set({ isDragging }),
  
  setActiveField: (field) => set({ activeField: field }),
  
  setActiveContentType: (contentTypeId) => set({ activeContentTypeId: contentTypeId }),
  
  fetchContentTypes: async () => {
    try {
      console.log('Fetching content types...');
      const { data: contentTypeData, error: contentTypeError } = await supabase
        .from('content_types')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (contentTypeError) throw contentTypeError;
      
      const contentTypes: ContentType[] = [];
      
      for (const contentType of contentTypeData || []) {
        try {
          console.log(`Fetching fields for content type: ${contentType.id}`);
          const { data: fieldData, error: fieldError } = await supabase
            .from('fields')
            .select('*')
            .eq('content_type_id', contentType.id)
            .order('position', { ascending: true });
          
          if (fieldError) throw fieldError;
          
          // Process fields to have proper structure
          const fields: Field[] = (fieldData || []).map(field => {
            // Convert from database representation to app representation
            const validation = typeof field.validation === 'object' 
              ? field.validation as any 
              : { required: false };
            
            const options = typeof field.options === 'object' 
              ? field.options as any
              : [];
            
            // Handle UI options
            let uiOptions: UiOptions = {};
            if (field.ui_options) {
              uiOptions = typeof field.ui_options === 'object'
                ? field.ui_options as UiOptions
                : {};
            }
            
            const defaultValue = field.default_value;
            
            return {
              id: field.id,
              name: field.name,
              label: field.label,
              type: field.type as FieldType,
              description: field.description,
              placeholder: field.placeholder,
              defaultValue,
              validation,
              options,
              uiOptions,
              isHidden: field.is_hidden,
            };
          });
          
          contentTypes.push({
            id: contentType.id,
            name: contentType.name,
            description: contentType.description || '',
            is_published: contentType.is_published,
            created_at: contentType.created_at,
            updated_at: contentType.updated_at,
            user_id: contentType.user_id,
            api_id: contentType.api_id || '',
            api_id_plural: contentType.api_id_plural || '',
            is_collection: contentType.is_collection || false,
            fields,
          });
          
        } catch (fieldErr) {
          console.error(`Error fetching fields for content type ${contentType.id}:`, fieldErr);
        }
      }
      
      set({ contentTypes });
      console.log('Fetched and processed content types:', contentTypes);
      
    } catch (error) {
      console.error('Error fetching content types:', error);
      throw error;
    }
  },
  
  createContentType: async (contentType) => {
    try {
      const newContentType = {
        name: contentType.name,
        description: contentType.description || '',
        is_published: false,
        api_id: contentType.api_id || contentType.name.toLowerCase().replace(/\s+/g, '_'),
        api_id_plural: contentType.api_id_plural || `${contentType.name.toLowerCase().replace(/\s+/g, '_')}s`,
        is_collection: contentType.is_collection || true,
      };
      
      const { data, error } = await supabase
        .from('content_types')
        .insert([newContentType])
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newType: ContentType = {
          ...data,
          description: data.description || '',
          api_id: data.api_id || '',
          api_id_plural: data.api_id_plural || '',
          is_collection: data.is_collection || false,
          fields: [],
        };
        
        set((state) => ({
          contentTypes: [newType, ...state.contentTypes],
        }));
        
        return data.id;
      }
      
      throw new Error('Failed to create content type');
    } catch (error) {
      console.error('Error creating content type:', error);
      throw error;
    }
  },
  
  updateContentType: async (contentTypeId, updates) => {
    try {
      const existingState = get();
      const contentTypeIndex = existingState.contentTypes.findIndex(
        (ct) => ct.id === contentTypeId
      );
      
      if (contentTypeIndex === -1) {
        console.error(`Content type with ID ${contentTypeId} not found`);
        return;
      }
      
      const updatedData = {
        name: updates.name,
        description: updates.description,
        updated_at: new Date().toISOString(),
      };
      
      if (updates.api_id !== undefined) {
        updatedData['api_id'] = updates.api_id;
      }
      
      if (updates.api_id_plural !== undefined) {
        updatedData['api_id_plural'] = updates.api_id_plural;
      }
      
      if (updates.is_collection !== undefined) {
        updatedData['is_collection'] = updates.is_collection;
      }
      
      const { error } = await supabase
        .from('content_types')
        .update(updatedData)
        .eq('id', contentTypeId);
      
      if (error) throw error;
      
      set((state) => {
        const newContentTypes = [...state.contentTypes];
        newContentTypes[contentTypeIndex] = {
          ...newContentTypes[contentTypeIndex],
          ...updates,
        };
        return { contentTypes: newContentTypes };
      });
      
    } catch (error) {
      console.error('Error updating content type:', error);
    }
  },
  
  deleteContentType: async (contentTypeId) => {
    try {
      const { error } = await supabase
        .from('content_types')
        .delete()
        .eq('id', contentTypeId);
      
      if (error) throw error;
      
      set((state) => ({
        contentTypes: state.contentTypes.filter((ct) => ct.id !== contentTypeId),
      }));
      
    } catch (error) {
      console.error('Error deleting content type:', error);
    }
  },
  
  addField: async (contentTypeId, field) => {
    try {
      const contentTypeIndex = get().contentTypes.findIndex(
        (ct) => ct.id === contentTypeId
      );
      
      if (contentTypeIndex === -1) {
        throw new Error(`Content type with ID ${contentTypeId} not found`);
      }
      
      const position = get().contentTypes[contentTypeIndex].fields.length;
      
      // Prepare field data for database
      const dbField = {
        content_type_id: contentTypeId,
        name: field.name,
        label: field.label,
        type: field.type,
        description: field.description || '',
        placeholder: field.placeholder || '',
        default_value: field.defaultValue || null,
        validation: field.validation || { required: false },
        options: field.options || [],
        is_hidden: field.isHidden || false,
        position,
        ui_options: field.uiOptions || {}
      };
      
      console.log('Adding field to database:', dbField);
      
      const { data, error } = await supabase
        .from('fields')
        .insert([dbField])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting field into database:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned from field insertion');
      }
      
      console.log('Field added to database:', data);
      
      // Convert from database representation to app representation
      const newField: Field = {
        id: data.id,
        name: data.name,
        label: data.label,
        type: data.type as FieldType,
        description: data.description,
        placeholder: data.placeholder,
        defaultValue: data.default_value,
        validation: typeof data.validation === 'object' ? data.validation as any : { required: false },
        options: typeof data.options === 'object' ? data.options as any : [],
        isHidden: data.is_hidden,
        uiOptions: data.ui_options ? (typeof data.ui_options === 'object' ? data.ui_options as UiOptions : {}) : {},
        subfields: field.subfields || []
      };
      
      // Update state with the new field
      set((state) => {
        const newContentTypes = [...state.contentTypes];
        newContentTypes[contentTypeIndex].fields.push(newField);
        return { contentTypes: newContentTypes };
      });
      
      return data.id;
    } catch (error) {
      console.error('Error adding field:', error);
      throw error;
    }
  },
  
  updateField: async (contentTypeId, fieldId, updates) => {
    try {
      const contentTypeIndex = get().contentTypes.findIndex(
        (ct) => ct.id === contentTypeId
      );
      
      if (contentTypeIndex === -1) {
        console.error(`Content type with ID ${contentTypeId} not found`);
        return;
      }
      
      const fieldIndex = get().contentTypes[contentTypeIndex].fields.findIndex(
        (f) => f.id === fieldId
      );
      
      if (fieldIndex === -1) {
        console.error(`Field with ID ${fieldId} not found`);
        return;
      }
      
      // Clone the current field
      const currentField = {
        ...get().contentTypes[contentTypeIndex].fields[fieldIndex]
      };
      
      // Merge updates with current field
      const updatedField = {
        ...currentField,
        ...updates,
      };
      
      // Convert to database format
      const dbUpdates = {
        name: updatedField.name,
        label: updatedField.label,
        type: updatedField.type,
        description: updatedField.description || '',
        placeholder: updatedField.placeholder || '',
        default_value: updatedField.defaultValue,
        validation: updatedField.validation || { required: false },
        options: updatedField.options || [],
        is_hidden: updatedField.isHidden || false,
        ui_options: updatedField.uiOptions || {}
      };
      
      console.log('Updating field in database:', dbUpdates);
      
      const { error } = await supabase
        .from('fields')
        .update(dbUpdates)
        .eq('id', fieldId)
        .eq('content_type_id', contentTypeId);
      
      if (error) {
        console.error('Error updating field in database:', error);
        throw error;
      }
      
      // Update in state
      set((state) => {
        const newContentTypes = [...state.contentTypes];
        newContentTypes[contentTypeIndex].fields[fieldIndex] = updatedField;
        return { contentTypes: newContentTypes };
      });
      
    } catch (error) {
      console.error('Error updating field:', error);
    }
  },
  
  updateSubfield: async (contentTypeId, parentFieldId, subfieldIndex, updates) => {
    try {
      const contentTypeIndex = get().contentTypes.findIndex(
        (ct) => ct.id === contentTypeId
      );
      
      if (contentTypeIndex === -1) {
        console.error(`Content type with ID ${contentTypeId} not found`);
        return;
      }
      
      const parentFieldIndex = get().contentTypes[contentTypeIndex].fields.findIndex(
        (f) => f.id === parentFieldId
      );
      
      if (parentFieldIndex === -1) {
        console.error(`Parent field with ID ${parentFieldId} not found`);
        return;
      }
      
      const parentField = get().contentTypes[contentTypeIndex].fields[parentFieldIndex];
      
      if (!parentField.subfields || !parentField.subfields[subfieldIndex]) {
        console.error(`Subfield at index ${subfieldIndex} not found`);
        return;
      }
      
      // Update the subfield in the parent field
      const updatedSubfields = [...(parentField.subfields || [])];
      updatedSubfields[subfieldIndex] = {
        ...updatedSubfields[subfieldIndex],
        ...updates,
      };
      
      // Update parent field with new subfields
      const updatedParentField = {
        ...parentField,
        subfields: updatedSubfields,
      };
      
      // Store subfields in options field for now
      const dbUpdates = {
        options: updatedSubfields,
        ui_options: parentField.uiOptions || {}
      };
      
      console.log('Updating parent field with new subfields:', dbUpdates);
      
      const { error } = await supabase
        .from('fields')
        .update(dbUpdates)
        .eq('id', parentFieldId)
        .eq('content_type_id', contentTypeId);
      
      if (error) {
        console.error('Error updating parent field in database:', error);
        throw error;
      }
      
      // Update in state
      set((state) => {
        const newContentTypes = [...state.contentTypes];
        newContentTypes[contentTypeIndex].fields[parentFieldIndex] = updatedParentField;
        return { contentTypes: newContentTypes };
      });
      
    } catch (error) {
      console.error('Error updating subfield:', error);
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
      
      set((state) => {
        const contentTypeIndex = state.contentTypes.findIndex(
          (ct) => ct.id === contentTypeId
        );
        
        if (contentTypeIndex === -1) return state;
        
        const newContentTypes = [...state.contentTypes];
        newContentTypes[contentTypeIndex] = {
          ...newContentTypes[contentTypeIndex],
          fields: newContentTypes[contentTypeIndex].fields.filter(
            (f) => f.id !== fieldId
          ),
        };
        
        return { contentTypes: newContentTypes };
      });
      
    } catch (error) {
      console.error('Error deleting field:', error);
    }
  },
  
  reorderFields: async (contentTypeId, newOrder) => {
    try {
      const contentTypeIndex = get().contentTypes.findIndex(
        (ct) => ct.id === contentTypeId
      );
      
      if (contentTypeIndex === -1) {
        console.error(`Content type with ID ${contentTypeId} not found`);
        return;
      }
      
      const currentFields = get().contentTypes[contentTypeIndex].fields;
      const reorderedFields = newOrder.map(
        (id) => currentFields.find((f) => f.id === id)
      ).filter((f): f is Field => !!f);
      
      // Update position values in database
      const updates = reorderedFields.map((field, index) => ({
        id: field.id,
        position: index,
      }));
      
      for (const update of updates) {
        const { error } = await supabase
          .from('fields')
          .update({ position: update.position })
          .eq('id', update.id)
          .eq('content_type_id', contentTypeId);
        
        if (error) {
          console.error(`Error updating position for field ${update.id}:`, error);
        }
      }
      
      // Update in state
      set((state) => {
        const newContentTypes = [...state.contentTypes];
        newContentTypes[contentTypeIndex] = {
          ...newContentTypes[contentTypeIndex],
          fields: reorderedFields,
        };
        return { contentTypes: newContentTypes };
      });
      
    } catch (error) {
      console.error('Error reordering fields:', error);
    }
  },
  
  getFieldById: (contentTypeId, fieldId) => {
    const contentType = get().contentTypes.find((ct) => ct.id === contentTypeId);
    if (!contentType) return undefined;
    
    const field = contentType.fields.find((f) => f.id === fieldId);
    return field;
  },
}));
