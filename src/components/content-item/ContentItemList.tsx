
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Eye, Pencil, Trash2, PlusCircle, Loader2 } from 'lucide-react';

interface ContentItem {
  id: string;
  content_type_id: string;
  data: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface ContentItemListProps {
  contentTypeId: string;
  contentTypeName: string;
}

export const ContentItemList: React.FC<ContentItemListProps> = ({
  contentTypeId,
  contentTypeName,
}) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<{ name: string; label: string }[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !contentTypeId) return;
      
      setLoading(true);
      
      try {
        // Fetch fields for display in the table
        const { data: fieldData, error: fieldError } = await supabase
          .from('fields')
          .select('name, label')
          .eq('content_type_id', contentTypeId)
          .order('position', { ascending: true })
          .limit(5); // Only show first few fields in list view
        
        if (fieldError) throw fieldError;
        
        setFields(fieldData || []);
        
        // Fetch content items
        const { data: itemData, error: itemError } = await supabase
          .from('content_items')
          .select('*')
          .eq('content_type_id', contentTypeId)
          .order('updated_at', { ascending: false });
        
        if (itemError) throw itemError;
        
        // Process the items to ensure data is a proper object
        const processedItems = (itemData || []).map(item => ({
          ...item,
          data: typeof item.data === 'string' ? JSON.parse(item.data) : item.data
        }));
        
        setItems(processedItems);
      } catch (error: any) {
        console.error('Error fetching content items:', error);
        toast.error(`Failed to load content items: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [contentTypeId, user]);
  
  const handleDelete = async (id: string) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id)
        .eq('content_type_id', contentTypeId);
      
      if (error) throw error;
      
      // Remove item from local state
      setItems(prev => prev.filter(item => item.id !== id));
      
      toast.success('Content item deleted successfully');
    } catch (error: any) {
      console.error('Error deleting content item:', error);
      toast.error(`Failed to delete content item: ${error.message}`);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading content items...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{contentTypeName} Items</h2>
        <Link to={`/content/${contentTypeId}/new`}>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-slate-50">
          <p className="text-gray-500 mb-4">No {contentTypeName.toLowerCase()} items found</p>
          <Link to={`/content/${contentTypeId}/new`}>
            <Button>Create your first {contentTypeName.toLowerCase()}</Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {fields.map(field => (
                  <TableHead key={field.name}>{field.label}</TableHead>
                ))}
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  {fields.map(field => (
                    <TableCell key={`${item.id}-${field.name}`} className="max-w-[200px] truncate">
                      {String(item.data[field.name] || '-')}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Badge variant={item.status === 'published' ? 'default' : 'outline'}>
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(item.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/content/${contentTypeId}/${item.id}/view`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/content/${contentTypeId}/${item.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
