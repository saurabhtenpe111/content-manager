
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useCmsStore } from '@/stores/cmsStore';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ContentTypeFormProps {
  onClose?: () => void;
}

export const ContentTypeForm: React.FC<ContentTypeFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);

  const { addContentType } = useCmsStore();
  const { user } = useAuth();

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError('Name is required');
      return false;
    }
    
    // Check if name contains only alphanumeric characters and spaces
    if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
      setNameError('Name can only contain letters, numbers, and spaces');
      return false;
    }
    
    setNameError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateName(name)) {
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to create a content type');
      return;
    }
    
    setLoading(true);
    
    try {
      // Add to Supabase
      const { data, error } = await supabase
        .from('content_types')
        .insert({
          name,
          description: description || null,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        // If the table doesn't exist, we'll try to add to local store anyway
        console.error('Supabase error:', error);
        
        if (error.code === '42P01') { // relation does not exist
          toast.error('Database tables are not set up yet. Please contact an administrator.');
        } else {
          throw error;
        }
      }
      
      // Add to local store regardless of DB success
      // This allows the UI to work even if DB isn't fully set up yet
      const newContentType = {
        id: data?.id || crypto.randomUUID(),
        name,
        description,
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addContentType(newContentType);
      
      toast.success('Content type created successfully!');
      
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error('Error creating content type:', error);
      toast.error(`Failed to create content type: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            validateName(e.target.value);
          }}
          placeholder="e.g. Blog Post, Product, User"
          className={nameError ? 'border-red-500' : ''}
          disabled={loading}
        />
        {nameError && <p className="text-sm text-red-500">{nameError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this content type is for..."
          rows={3}
          disabled={loading}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Content Type'}
        </Button>
      </div>
    </form>
  );
};
