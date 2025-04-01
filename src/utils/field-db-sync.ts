
import { supabase } from '@/integrations/supabase/client';
import { Field, ContentType } from '@/stores/cmsStore';

/**
 * Synchronizes fields from a content type to the database
 */
export async function syncFieldsToDatabase(contentTypeId: string, fields: Field[]) {
  try {
    // Get existing fields for this content type
    const { data: existingFields, error: fetchError } = await supabase
      .from('fields')
      .select('*')
      .eq('content_type_id', contentTypeId);
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Create a map of existing fields by their IDs
    const existingFieldsMap = new Map(
      existingFields?.map(field => [field.id, field]) || []
    );
    
    // Prepare batches for operations
    const fieldsToCreate: any[] = [];
    const fieldsToUpdate: any[] = [];
    const fieldsToDelete: string[] = [];
    
    // Identify fields to create or update
    fields.forEach((field, index) => {
      const dbField = {
        content_type_id: contentTypeId,
        name: field.name,
        label: field.label,
        type: field.type,
        description: field.description || null,
        placeholder: field.placeholder || null,
        default_value: field.defaultValue || null,
        validation: field.validation || null,
        options: field.options || null,
        ui_options: field.uiOptions || {},
        position: index,
        is_hidden: false
      };
      
      if (existingFieldsMap.has(field.id)) {
        // Field exists, prepare for update
        fieldsToUpdate.push({
          id: field.id,
          ...dbField
        });
        // Remove from map to track which ones need to be deleted
        existingFieldsMap.delete(field.id);
      } else {
        // New field, prepare for creation
        fieldsToCreate.push({
          id: field.id,
          ...dbField
        });
      }
    });
    
    // Any remaining fields in the map need to be deleted
    existingFieldsMap.forEach((_, id) => {
      fieldsToDelete.push(id);
    });
    
    // Execute operations in batches
    const operations = [];
    
    // Create new fields
    if (fieldsToCreate.length > 0) {
      operations.push(
        supabase
          .from('fields')
          .insert(fieldsToCreate)
          .then(({ error }) => {
            if (error) throw error;
          })
      );
    }
    
    // Update existing fields
    for (const field of fieldsToUpdate) {
      operations.push(
        supabase
          .from('fields')
          .update(field)
          .eq('id', field.id)
          .then(({ error }) => {
            if (error) throw error;
          })
      );
    }
    
    // Delete removed fields
    if (fieldsToDelete.length > 0) {
      operations.push(
        supabase
          .from('fields')
          .delete()
          .in('id', fieldsToDelete)
          .then(({ error }) => {
            if (error) throw error;
          })
      );
    }
    
    // Wait for all operations to complete
    await Promise.all(operations);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error syncing fields to database:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to sync fields to database' 
    };
  }
}

/**
 * Updates a content type with apiId fields in the database
 */
export async function updateContentTypeApiIds(contentType: ContentType) {
  try {
    const { error } = await supabase
      .from('content_types')
      .update({
        api_id: contentType.apiId,
        api_id_plural: contentType.apiIdPlural,
        is_published: contentType.isCollection
      })
      .eq('id', contentType.id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating content type API IDs:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update content type API IDs' 
    };
  }
}
