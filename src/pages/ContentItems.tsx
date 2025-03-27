
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { ContentItemList } from '@/components/content-item/ContentItemList';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const ContentItems: React.FC = () => {
  const { contentTypeId } = useParams<{ contentTypeId: string }>();
  const [contentTypeName, setContentTypeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchContentType = async () => {
      if (!contentTypeId) {
        setError('Content type ID is required');
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('content_types')
          .select('name')
          .eq('id', contentTypeId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setContentTypeName(data.name);
        } else {
          setError('Content type not found');
        }
      } catch (err: any) {
        console.error('Error fetching content type:', err);
        toast.error(`Failed to load content type: ${err.message}`);
        setError('Failed to load content type');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContentType();
  }, [contentTypeId]);
  
  if (loading) {
    return (
      <CMSLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      </CMSLayout>
    );
  }
  
  if (error) {
    return (
      <CMSLayout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </CMSLayout>
    );
  }
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contentTypeName}</h1>
            <p className="text-gray-600 mt-1">
              Manage your {contentTypeName.toLowerCase()} content
            </p>
          </div>
          
          <Button onClick={() => navigate(`/content/${contentTypeId}/new`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
        
        <ContentItemList 
          contentTypeId={contentTypeId!}
          contentTypeName={contentTypeName}
        />
      </div>
    </CMSLayout>
  );
};

export default ContentItems;
