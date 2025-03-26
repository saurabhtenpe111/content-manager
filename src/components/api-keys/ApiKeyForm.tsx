
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { CopyIcon, CheckIcon } from 'lucide-react';

interface ApiKeyFormProps {
  onKeyCreated?: () => void;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onKeyCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('API key name is required');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to create an API key');
      return;
    }
    
    setLoading(true);
    
    try {
      // Use the database function to generate a key
      const { data, error } = await supabase.rpc(
        'generate_api_key',
        { 
          key_name: name,
          key_description: description.trim() || null 
        }
      );
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }
      
      if (data) {
        // Convert data to string and set as API key
        setApiKey(String(data));
        setShowKeyDialog(true);
        
        // Clear form
        setName('');
        setDescription('');
        
        if (onKeyCreated) {
          onKeyCreated();
        }
        
        toast.success('API key created successfully');
      }
    } catch (error: any) {
      console.error('Error creating API key:', error);
      toast.error(`Failed to create API key: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">API Key Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production API Key"
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this API key will be used for..."
            rows={3}
            disabled={loading}
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Generate API Key'}
          </Button>
        </div>
      </form>
      
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your New API Key</DialogTitle>
            <DialogDescription>
              This is your new API key. It will only be shown once, so please copy it now and store it securely.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
            {apiKey}
          </div>
          
          <DialogFooter>
            <Button 
              variant={copied ? "outline" : "default"} 
              onClick={handleCopyKey}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
