
import React, { useEffect } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useCmsStore } from '@/stores/cmsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Database, FileSymlink } from 'lucide-react';
import { toast } from 'sonner';
import { migrateAddUIOptions } from '@/migrations/add-ui-options';

const FormBuilder: React.FC = () => {
  const { contentTypes, fetchContentTypes } = useCmsStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Run the migration to ensure ui_options column exists
    const runMigration = async () => {
      try {
        const result = await migrateAddUIOptions();
        if (result) {
          console.log('Database migration completed successfully');
        } else {
          console.warn('Database migration failed or was not needed');
        }
      } catch (error) {
        console.error('Error during migration:', error);
      }
    };
    
    runMigration();
    
    // Fetch content types if needed
    if (contentTypes.length === 0) {
      fetchContentTypes()
        .catch(error => {
          console.error('Error fetching content types:', error);
          toast.error('Failed to load content types');
        });
    }
  }, [contentTypes.length, fetchContentTypes]);
  
  const navigateToContentTypeBuilder = (contentTypeId: string) => {
    navigate(`/content-types/builder/${contentTypeId}`);
  };
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Form Builder</h1>
            <p className="text-gray-600">
              Create and manage forms for your content types
            </p>
          </div>
          
          <Link to="/content-types/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Content Type
            </Button>
          </Link>
        </div>
        
        {contentTypes.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Content Types Found</h3>
            <p className="text-gray-500 mb-4">
              You need to create a content type before you can build forms.
            </p>
            <Link to="/content-types/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create your first content type
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((contentType) => (
              <Card key={contentType.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>{contentType.name}</CardTitle>
                  <CardDescription>
                    {contentType.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {contentType.fields.length} fields
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created on {new Date(contentType.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateToContentTypeBuilder(contentType.id)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Link to={`/content/${contentType.id}`}>
                    <Button size="sm">
                      <FileSymlink className="mr-2 h-4 w-4" />
                      View Items
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CMSLayout>
  );
};

export default FormBuilder;
