
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Database, PlusCircle } from 'lucide-react';

const Content = () => {
  const navigate = useNavigate();
  
  const { data: contentTypes, isLoading } = useQuery({
    queryKey: ['contentTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    }
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
            {contentTypes?.map((contentType) => (
              <div 
                key={contentType.id}
                className="border rounded-lg p-6 hover:border-primary cursor-pointer transition-colors"
                onClick={() => navigate(`/content/${contentType.id}`)}
              >
                <h3 className="text-lg font-semibold mb-2">{contentType.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {contentType.description || 'No description provided'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {new Date(contentType.created_at).toLocaleDateString()}
                  </span>
                  <Button variant="ghost" size="sm">
                    View Items
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CMSLayout>
  );
};

export default Content;
