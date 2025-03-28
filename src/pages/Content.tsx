
import React, { useEffect, useState } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database, FileText, Loader2 } from 'lucide-react';
import { useCmsStore } from '@/stores/cmsStore';
import { toast } from 'sonner';

const Content: React.FC = () => {
  const { contentTypes, fetchContentTypes } = useCmsStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchContentTypes();
        console.log('Content types loaded in Content page:', contentTypes);
      } catch (error) {
        console.error('Error loading content types:', error);
        toast.error('Failed to load content types');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchContentTypes]);

  if (loading) {
    return (
      <CMSLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading content types...</span>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
            <p className="text-gray-600 mt-1">
              Create, edit, and manage content in your collections
            </p>
          </div>
          <Button asChild>
            <Link to="/content-types">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Content Type
            </Link>
          </Button>
        </div>

        {contentTypes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Content Types Found</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't created any content types yet. Create your first content type to start managing content.
            </p>
            <Button asChild>
              <Link to="/content-types">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Content Type
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((contentType) => (
              <Link 
                key={contentType.id} 
                to={`/content/${contentType.id}`}
                className="block"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-md p-2">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{contentType.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {contentType.description || 'No description provided'}
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {contentType.fields.length} fields
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </CMSLayout>
  );
};

export default Content;
