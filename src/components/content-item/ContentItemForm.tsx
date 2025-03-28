
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCmsStore, Field } from '@/stores/cmsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FieldRenderer } from '@/components/fields/FieldRenderer';
import { supabase } from '@/integrations/supabase/client';

export interface ContentItemFormProps {
  contentTypeId: string;
  contentTypeName: string;
  contentItemId?: string;
  isReadOnly?: boolean;
  onClose?: () => void;
}

export const ContentItemForm: React.FC<ContentItemFormProps> = ({ 
  contentTypeId, 
  contentTypeName,
  contentItemId,
  isReadOnly = false,
  onClose
}) => {
  const navigate = useNavigate();
  const { contentTypes, fetchContentTypes } = useCmsStore();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const contentType = contentTypes.find((ct) => ct.id === contentTypeId);
  
  // Ensure content types are loaded
  useEffect(() => {
    console.log('ContentItemForm: Loading content types, current count:', contentTypes.length);
    if (contentTypes.length === 0) {
      console.log('ContentItemForm: Fetching content types');
      fetchContentTypes().then(() => {
        console.log('ContentItemForm: Content types fetched successfully');
        setLoading(false);
      }).catch(error => {
        console.error('ContentItemForm: Error fetching content types:', error);
        toast.error('Failed to load content type data');
        setLoading(false);
      });
    } else {
      console.log('ContentItemForm: Content types already loaded');
      setLoading(false);
    }
  }, [contentTypes, fetchContentTypes]);
  
  // Fetch existing content item or initialize with defaults
  useEffect(() => {
    const fetchContentItem = async () => {
      if (contentItemId) {
        try {
          console.log('ContentItemForm: Fetching content item', contentItemId);
          const { data, error } = await supabase
            .from('content_items')
            .select('*')
            .eq('id', contentItemId)
            .eq('content_type_id', contentTypeId)
            .single();
          
          if (error) {
            console.error('ContentItemForm: Error fetching content item:', error);
            throw error;
          }
          
          console.log('ContentItemForm: Content item fetched successfully:', data);
          if (data) {
            const itemData = typeof data.data === 'string' 
              ? JSON.parse(data.data) 
              : data.data;
            
            console.log('ContentItemForm: Parsed content item data:', itemData);
            setFormData(itemData);
          }
        } catch (error) {
          console.error('ContentItemForm: Error fetching content item:', error);
          toast.error('Failed to load content item');
        }
      }
    };
    
    if (contentType) {
      console.log('ContentItemForm: Initializing form data with defaults from content type fields');
      // Initialize form data with default values from the content type's fields
      const initialData: Record<string, any> = {};
      contentType.fields.forEach((field) => {
        initialData[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
        console.log(`ContentItemForm: Setting initial value for ${field.name}:`, initialData[field.name]);
      });
      setFormData(initialData);
      
      if (contentItemId) {
        fetchContentItem();
      }
    }
  }, [contentType, contentTypeId, contentItemId]);
  
  const handleFieldChange = (fieldName: string, value: any) => {
    console.log(`ContentItemForm: Field ${fieldName} changed to:`, value);
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    
    // Clear any existing error for this field
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[fieldName];
      return newErrors;
    });
  };
  
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (!contentType) {
      return false;
    }
    
    console.log('ContentItemForm: Validating form with data:', formData);
    contentType.fields.forEach((field) => {
      const value = formData[field.name];
      const validation = field.validation;
      
      if (validation?.required && !value && value !== 0 && value !== false) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
        return;
      }
      
      if (validation?.min && typeof value === 'string' && value.length < validation.min) {
        newErrors[field.name] = `${field.label} must be at least ${validation.min} characters`;
        isValid = false;
        return;
      }
      
      if (validation?.max && typeof value === 'string' && value.length > validation.max) {
        newErrors[field.name] = `${field.label} must be less than ${validation.max} characters`;
        isValid = false;
        return;
      }
      
      if (validation?.pattern && typeof value === 'string' && !new RegExp(validation.pattern).test(value)) {
        newErrors[field.name] = validation.message || `${field.label} is invalid`;
        isValid = false;
        return;
      }
    });
    
    console.log('ContentItemForm: Validation errors:', newErrors);
    setErrors(newErrors);
    return isValid;
  }, [formData, contentType, setErrors]);
  
  const handleSubmit = async () => {
    if (!contentType) {
      toast.error('Content type not found');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('ContentItemForm: Submitting form with data:', formData);
      const item = {
        content_type_id: contentTypeId,
        data: formData,
        status: 'draft' // Default status
      };
      
      if (contentItemId) {
        // Update existing item
        console.log('ContentItemForm: Updating existing content item:', contentItemId);
        const { error } = await supabase
          .from('content_items')
          .update(item)
          .eq('id', contentItemId);
        
        if (error) throw error;
        
        toast.success('Content item updated successfully!');
      } else {
        // Create new item
        console.log('ContentItemForm: Creating new content item');
        const { error } = await supabase
          .from('content_items')
          .insert([item]);
        
        if (error) throw error;
        
        toast.success('Content item created successfully!');
      }
      
      // Redirect after successful save
      if (onClose) {
        onClose();
      } else {
        navigate(`/content/${contentTypeId}`);
      }
    } catch (error) {
      console.error('ContentItemForm: Error saving content item:', error);
      toast.error('Failed to save content item');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!contentItemId) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('ContentItemForm: Deleting content item:', contentItemId);
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', contentItemId);
      
      if (error) throw error;
      
      toast.success('Content item deleted successfully!');
      
      if (onClose) {
        onClose();
      } else {
        navigate(`/content/${contentTypeId}`);
      }
    } catch (error) {
      console.error('ContentItemForm: Error deleting content item:', error);
      toast.error('Failed to delete content item');
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p>Loading content form...</p>
      </div>
    );
  }
  
  if (!contentType) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Content type not found</p>
        <Button className="mt-4" onClick={() => navigate('/content-types')}>
          Back to Content Types
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {contentItemId ? 'Edit Content Item' : 'Create Content Item'}
            </h1>
            <p className="text-gray-600 mt-1">
              {contentType?.description || 'Fill in the details for this content item.'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            {contentItemId && (
              <Button 
                variant="outline" 
                className="text-red-500 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isReadOnly || isSubmitting}
              >
                Delete
              </Button>
            )}
            
            <Button 
              onClick={handleSubmit} 
              disabled={isReadOnly || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {contentTypeName} Details
        </h2>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {contentType?.fields.map((field) => (
            <div key={field.id} className="mb-6">
              <FieldRenderer
                field={field}
                value={formData[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name] || ''}
                disabled={isReadOnly || isSubmitting}
                isPreview={false}
              />
            </div>
          ))}
        </form>
      </div>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
