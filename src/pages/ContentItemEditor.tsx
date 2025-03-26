
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { ContentItemForm } from '@/components/content-item/ContentItemForm';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ContentItemEditor: React.FC = () => {
  const { contentTypeId, contentItemId } = useParams<{ contentTypeId: string; contentItemId: string }>();
  const [contentTypeName, setContentTypeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const isViewMode = location.pathname.includes('/view');
  
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
        <ContentItemForm 
          contentTypeId={contentTypeId!}
          contentTypeName={contentTypeName}
          contentItemId={contentItemId}
          isReadOnly={isViewMode}
        />
      </div>
    </CMSLayout>
  );
};

export default ContentItemEditor;
