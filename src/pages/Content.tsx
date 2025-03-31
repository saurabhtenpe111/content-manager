
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Database, PlusCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { executeSql } from '@/migrations/execute-sql';
import { generateApiId, generateApiPlural } from '@/utils/api-naming';

const Content: React.FC = () => {
  const navigate = useNavigate();
  const { contentTypeId } = useParams<{ contentTypeId: string }>();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    const runMigration = async () => {
      try {
        // Add UI options column migration
        const sql = `
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'fields' AND column_name = 'ui_options'
            ) THEN
              ALTER TABLE fields ADD COLUMN ui_options JSONB DEFAULT '{}'::jsonb;
            END IF;
          END
          $$;
        `;
        
        const result = await executeSql(sql);
        
        if (result.success) {
          console.log('UI options migration completed successfully');
        } else {
          console.error('UI options migration failed:', result.error);
        }
      } catch (error) {
        console.error('Failed to run UI options migration:', error);
      }
    };
    
    runMigration();
  }, []);
  
  const { data: contentTypes, isLoading, error } = useQuery({
    queryKey: ['contentTypes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('content_types')
          .select('*, fields(*)')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error('Error fetching content types:', error);
        toast.error('Failed to load content types');
        return [];
      }
    }
  });
  
  const contentType = contentTypes?.length > 0 ? contentTypes[0] : null;
  const apiId = contentType?.apiId || generateApiId(contentType?.name || '');
  
  const { data: contentItems, isLoading: isContentItemsLoading } = useQuery({
    queryKey: ['contentItems', contentTypeId, sortField, sortOrder, searchText],
    queryFn: async () => {
      if (!contentTypeId || !apiId) return [];
      
      try {
        let query = supabase
          .from(`content_items`)
          .select('*')
          .eq('content_type_id', contentTypeId);
        
        if (searchText) {
          // Use ilike for basic text search instead of textSearch which might not be available
          query = query
            .or(`name.ilike.%${searchText}%,description.ilike.%${searchText}%`);
        }
        
        if (sortField) {
          query = query.order(sortField, { ascending: sortOrder === 'asc' });
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error('Error fetching content items:', error);
        return [];
      }
    },
    enabled: !!contentTypeId && !!apiId
  });
  
  if (isLoading) {
    return (
      <CMSLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading content types...</span>
        </div>
      </CMSLayout>
    );
  }
  
  if (error) {
    return (
      <CMSLayout>
        <div className="border border-red-200 bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Content Types</h2>
          <p className="text-red-600 mb-4">
            There was a problem retrieving your content types.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </CMSLayout>
    );
  }
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Content</h1>
          <Button onClick={() => navigate('/content-types/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Content Type
          </Button>
        </div>
        
        {contentTypes?.length === 0 ? (
          <div className="border border-dashed rounded-lg p-12 text-center bg-slate-50">
            <Database className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h2 className="text-xl font-semibold mb-2">No Content Types Found</h2>
            <p className="text-muted-foreground mb-6">
              Create your first content type to start managing content
            </p>
            <Button onClick={() => navigate('/content-types/new')}>
              Create Content Type
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentTypes?.map((contentType: any) => (
              <div 
                key={contentType.id}
                className="border rounded-lg p-6 hover:border-primary cursor-pointer transition-colors"
                onClick={() => navigate(`/content-types/${contentType.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{contentType.name}</h3>
                  <div className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                    {contentType.fields?.length || 0} Fields
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {contentType.description || 'No description provided'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {new Date(contentType.created_at).toLocaleDateString()}
                  </span>
                  <Button variant="ghost" size="sm" className="gap-1" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/content/${contentType.id}`);
                  }}>
                    <FileText size={14} />
                    View Items
                  </Button>
                </div>
                {contentType.api_id && (
                  <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                    <span className="font-semibold">API ID:</span> {contentType.api_id}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          <h2 className="text-xl font-bold">Content Items</h2>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-24"
            >
              <option value="created_at">Created At</option>
              <option value="name">Name</option>
              <option value="description">Description</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="border border-gray-300 rounded-lg px-3 py-2 w-24"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          
          {isContentItemsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading content items...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentItems?.map((item: any) => (
                <div 
                  key={item.id}
                  className="border rounded-lg p-6 hover:border-primary cursor-pointer transition-colors"
                  onClick={() => navigate(`/content/${item.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{item.name || 'Untitled Item'}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {item.description || 'No description provided'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" className="gap-1" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/content-item/${item.id}`);
                    }}>
                      <FileText size={14} />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CMSLayout>
  );
};

export default Content;
