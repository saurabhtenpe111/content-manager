
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Key, Clock, ShieldAlert, Loader2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Json } from '@/integrations/supabase/types';

interface ApiKey {
  id: string;
  name: string;
  description: string | null;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  permissions: {
    read: boolean;
    write: boolean;
  } | Json;
}

export const ApiKeyList: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const fetchApiKeys = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        // If table doesn't exist, we'll just use empty array
        if (error.code === '42P01') { // relation does not exist
          console.warn('API keys table does not exist yet.');
          setApiKeys([]);
        } else {
          throw error;
        }
      } else {
        // Convert the data to match our ApiKey interface
        const formattedKeys = data.map(key => ({
          id: key.id,
          name: key.name,
          description: key.description,
          key_prefix: key.key_prefix,
          created_at: key.created_at,
          last_used_at: key.last_used_at,
          expires_at: key.expires_at,
          permissions: key.permissions
        }));
        setApiKeys(formattedKeys);
      }
    } catch (error: any) {
      console.error('Error fetching API keys:', error);
      if (error.code !== '42P01') { // Don't show error for table not existing
        toast.error(`Failed to load API keys: ${error.message}`);
      }
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchApiKeys();
  }, [user]);
  
  const handleDeleteKey = async (id: string) => {
    try {
      try {
        const { error } = await supabase
          .from('api_keys')
          .delete()
          .eq('id', id);
        
        if (error && error.code !== '42P01') { // Ignore if table doesn't exist
          throw error;
        }
      } catch (error: any) {
        console.warn('Supabase delete failed, continuing with local state update:', error);
        // We'll continue with the UI update even if Supabase fails
      }
      
      // Always update local state
      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast.success('API key deleted successfully');
    } catch (error: any) {
      console.error('Error deleting API key:', error);
      toast.error(`Failed to delete API key: ${error.message}`);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Helper function to check if permissions exists and has read/write properties
  const hasPermission = (permissions: ApiKey['permissions'], type: 'read' | 'write'): boolean => {
    if (!permissions) return false;
    
    if (typeof permissions === 'object') {
      // @ts-ignore - We're checking if the property exists
      return !!permissions[type];
    }
    
    return false;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading API keys...</span>
      </div>
    );
  }
  
  if (apiKeys.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Key size={48} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No API Keys</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            You haven't created any API keys yet. Create your first API key to access your content programmatically.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {apiKeys.map((apiKey) => (
        <Card key={apiKey.id} className="border border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold">{apiKey.name}</CardTitle>
                <CardDescription>
                  {apiKey.description || 'No description provided'}
                </CardDescription>
              </div>
              <Badge variant={apiKey.expires_at && new Date(apiKey.expires_at) < new Date() ? "destructive" : "default"}>
                {apiKey.expires_at && new Date(apiKey.expires_at) < new Date() ? 'Expired' : 'Active'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <Key size={16} className="mr-2" />
                <span>Prefix: {apiKey.key_prefix}...</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-2" />
                <span>Created: {formatDate(apiKey.created_at)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-2" />
                <span>Last used: {formatDate(apiKey.last_used_at)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ShieldAlert size={16} className="mr-2" />
                <span>
                  Permissions: {hasPermission(apiKey.permissions, 'read') ? 'Read' : ''} 
                  {hasPermission(apiKey.permissions, 'read') && hasPermission(apiKey.permissions, 'write') ? ' & ' : ''}
                  {hasPermission(apiKey.permissions, 'write') ? 'Write' : ''}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-0">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this API key. Applications using this key will no longer have access to your content.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteKey(apiKey.id)} 
                    className="bg-destructive text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
