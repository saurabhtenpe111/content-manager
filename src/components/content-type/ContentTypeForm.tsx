
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useCmsStore } from '@/stores/cmsStore';

export interface ContentTypeFormProps {
  onClose: () => void;
  isComponent?: boolean;
  initialData?: {
    name: string;
    description: string;
    isCollection: boolean;
  };
}

export const ContentTypeForm: React.FC<ContentTypeFormProps> = ({
  onClose,
  isComponent = false,
  initialData = {
    name: '',
    description: '',
    isCollection: true
  }
}) => {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [isCollection, setIsCollection] = useState(initialData.isCollection);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createContentType } = useCmsStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a name for the content type');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const apiId = name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      const apiIdPlural = isCollection ? `${apiId}s` : apiId;
      
      const contentTypeData = {
        name,
        description,
        api_id: apiId,
        api_id_plural: apiIdPlural,
        is_collection: isCollection
      };
      
      console.log('Creating content type with data:', contentTypeData);
      const contentTypeId = await createContentType(contentTypeData);
      console.log('Content type created with ID:', contentTypeId);
      
      toast.success(`${isComponent ? 'Component' : 'Content type'} created successfully!`);
      onClose();
      
      // Redirect to the content type builder for the new content type
      if (contentTypeId) {
        window.location.href = `/content-types/builder/${contentTypeId}`;
      }
    } catch (error) {
      console.error('Error creating content type:', error);
      toast.error('Failed to create content type');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isComponent ? 'Create New Component' : 'Create New Content Type'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isComponent ? "My Component" : "My Content Type"}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isComponent
                  ? "Describe what this component is used for"
                  : "Describe what this content type represents"
              }
              rows={4}
            />
          </div>
          
          {!isComponent && (
            <div className="flex items-center space-x-2">
              <Switch
                id="isCollection"
                checked={isCollection}
                onCheckedChange={setIsCollection}
              />
              <Label htmlFor="isCollection" className="font-normal">
                Is this a collection?
              </Label>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
