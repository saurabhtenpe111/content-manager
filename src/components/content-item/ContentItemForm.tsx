
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
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FieldRenderer } from '@/components/fields/FieldRenderer';

export interface ContentItemFormProps {
  contentTypeId: string;
  contentTypeName: string;
  contentItemId?: string;
  isReadOnly?: boolean;
  onClose?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export const ContentItemForm: React.FC<ContentItemFormProps> = ({ 
  contentTypeId, 
  contentTypeName,
  contentItemId,
  isReadOnly = false,
  onClose
}) => {
  const navigate = useNavigate();
  const { contentTypes } = useCmsStore();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const contentType = contentTypes.find((ct) => ct.id === contentTypeId);
  
  useEffect(() => {
    if (contentType) {
      // Initialize form data with default values from the content type's fields
      const initialData: Record<string, any> = {};
      contentType.fields.forEach((field) => {
        initialData[field.name] = field.defaultValue || '';
      });
      setFormData(initialData);
    }
  }, [contentType, contentTypeId]);
  
  const handleFieldChange = (fieldName: string, value: any) => {
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
    
    contentType.fields.forEach((field) => {
      const value = formData[field.name];
      const validation = field.validation;
      
      if (validation?.required && !value) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
        return;
      }
      
      if (validation?.minLength && typeof value === 'string' && value.length < validation.minLength) {
        newErrors[field.name] = `${field.label} must be at least ${validation.minLength} characters`;
        isValid = false;
        return;
      }
      
      if (validation?.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
        newErrors[field.name] = `${field.label} must be less than ${validation.maxLength} characters`;
        isValid = false;
        return;
      }
      
      // Handle minValue validation (ensure both values are numbers for comparison)
      if (validation?.minValue !== undefined && typeof value === 'number') {
        const minVal = Number(validation.minValue);
        if (value < minVal) {
          newErrors[field.name] = `${field.label} must be at least ${minVal}`;
          isValid = false;
          return;
        }
      }
      
      // Handle maxValue validation (ensure both values are numbers for comparison)
      if (validation?.maxValue !== undefined && typeof value === 'number') {
        const maxVal = Number(validation.maxValue);
        if (value > maxVal) {
          newErrors[field.name] = `${field.label} must be less than ${maxVal}`;
          isValid = false;
          return;
        }
      }
      
      if (validation?.pattern && typeof value === 'string' && !new RegExp(validation.pattern).test(value)) {
        newErrors[field.name] = validation.message || `${field.label} is invalid`;
        isValid = false;
        return;
      }
    });
    
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
    
    // Handle form submission logic here
    console.log('Form data:', formData);
    toast.success('Form submitted successfully!');
  };
  
  const handleDelete = () => {
    // Handle delete logic here
    console.log('Deleting content item');
    toast.success('Content item deleted successfully!');
    onClose?.();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })
  
  return (
    <div className="space-y-6">
      <div className="border-b border-cms-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cms-gray-900">
              {contentItemId ? 'Edit Content Item' : 'Create Content Item'}
            </h1>
            <p className="text-cms-gray-600 mt-1">
              {contentType?.description || 'Fill in the details for this content item.'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            {contentItemId && (
              <Button 
                variant="outline" 
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isReadOnly}
              >
                Delete
              </Button>
            )}
            
            <Button onClick={handleSubmit} disabled={isReadOnly}>
              Save
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-md p-6">
        <h2 className="text-xl font-semibold text-cms-gray-800 mb-4">
          {contentTypeName} Details
        </h2>
        
        <form onSubmit={form.handleSubmit((values) => {
          console.log(values)
        })} className="space-y-4">
          {contentType?.fields.map((field) => (
            <div key={field.id} className="mb-6">
              <FieldRenderer
                field={field}
                value={formData[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name] || ''}
                disabled={isReadOnly}
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
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
