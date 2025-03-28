
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCmsStore } from '@/stores/cmsStore';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, FileText } from 'lucide-react';

const FormBuilderRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { contentTypes, fetchContentTypes } = useCmsStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchContentTypes();
      } catch (error) {
        console.error('Error loading content types:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    toast.info('Welcome to the form builder');
  }, [fetchContentTypes]);
  
  if (loading) {
    return (
      <CMSLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading form builder...</span>
        </div>
      </CMSLayout>
    );
  }
  
  return (
    <CMSLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Form Builder</h1>
          <div className="flex items-center gap-4">
            <Button 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => navigate('/content-types')}
            >
              Create New Form
            </Button>
          </div>
        </div>
        
        {contentTypes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 border">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-3">No Forms Created Yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first form to get started with collecting data from your users.
              </p>
              <Button 
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => navigate('/content-types')}
              >
                Create Your First Form
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((contentType) => (
              <Card key={contentType.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="text-lg font-medium">{contentType.name} Form</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {contentType.description || `Form based on ${contentType.name} content type`}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {contentType.fields.length} fields
                    </span>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/form-builder/${contentType.id}`)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Build Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CMSLayout>
  );
};

export default FormBuilderRedirect;
