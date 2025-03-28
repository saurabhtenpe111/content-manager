
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCmsStore } from '@/stores/cmsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentTypeFormProps {
  onClose?: () => void;
}

export const ContentTypeForm: React.FC<ContentTypeFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { createContentType } = useCmsStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const contentTypeId = await createContentType({
        name,
        description,
        is_published: false,
        api_id: name.toLowerCase().replace(/\s+/g, '_'),
        api_id_plural: `${name.toLowerCase().replace(/\s+/g, '_')}s`,
        is_collection: true
      });
      
      toast.success('Content type created successfully!');
      
      if (onClose) {
        onClose();
      }
      
      navigate(`/content-types/${contentTypeId}`);
    } catch (error: any) {
      console.error('Error creating content type:', error);
      toast.error(`Failed to create content type: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Content Type</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Blog Post, Product, FAQ"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this content type is for"
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Content Type'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
