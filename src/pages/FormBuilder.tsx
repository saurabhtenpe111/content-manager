
import React, { useEffect, useState } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { useNavigate } from 'react-router-dom';
import { useCmsStore } from '@/stores/cmsStore';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileEdit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { contentTypes, fetchContentTypes } = useCmsStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchContentTypes();
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
            <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
            <p className="text-gray-600 mt-1">
              Create and manage forms for your content types
            </p>
          </div>
          
          <Link to="/content-types">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Content Type
            </Button>
          </Link>
        </div>
        
        {contentTypes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FileEdit className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Forms Found</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You need to create content types before you can build forms. Start by creating your first content type.
            </p>
            <Link to="/content-types">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Content Type
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((contentType) => (
              <div key={contentType.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-lg">{contentType.name} Form</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Based on {contentType.name} content type
                </p>
                <Link to={`/form-editor/${contentType.id}`}>
                  <Button variant="outline" className="w-full">
                    <FileEdit className="mr-2 h-4 w-4" />
                    Edit Form
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </CMSLayout>
  );
};

export default FormBuilder;
