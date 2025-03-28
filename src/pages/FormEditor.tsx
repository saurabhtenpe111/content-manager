
import React, { useState, useEffect } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { useCmsStore } from '@/stores/cmsStore';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Save, LayoutGrid, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { FieldRenderer } from '@/components/fields/FieldRenderer';
import { supabase } from '@/integrations/supabase/client';

const FormEditor: React.FC = () => {
  const { contentTypeId } = useParams<{ contentTypeId: string }>();
  const navigate = useNavigate();
  const { contentTypes, fetchContentTypes, setActiveField } = useCmsStore();
  
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const contentType = contentTypes.find(ct => ct.id === contentTypeId);
  
  useEffect(() => {
    // Fetch content types if needed
    const loadContentTypes = async () => {
      console.log('FormEditor: Loading content types');
      try {
        await fetchContentTypes();
        console.log('FormEditor: Content types loaded successfully');
      } catch (err) {
        console.error("FormEditor: Error fetching content types:", err);
        toast.error("Failed to load content types");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (contentTypes.length === 0) {
      loadContentTypes();
    } else {
      console.log('FormEditor: Content types already loaded');
      setIsLoading(false);
    }
  }, [contentTypes.length, fetchContentTypes]);
  
  useEffect(() => {
    if (!contentType && !isLoading && contentTypes.length > 0) {
      console.log('FormEditor: Content type not found, redirecting');
      toast.error('Content type not found');
      navigate('/form-builder');
      return;
    }
    
    if (contentType) {
      console.log('FormEditor: Initializing form with content type defaults:', contentType.name);
      // Initialize form with content type defaults
      setFormName(`${contentType.name} Form`);
      setFormDescription(`Form for creating ${contentType.name}`);
      setSelectedFields(contentType.fields.map(field => field.id));
      setIsLoading(false);
    }
  }, [contentType, navigate, contentTypes.length, isLoading]);
  
  const handleSave = async () => {
    if (!contentType) {
      toast.error('Content type not found');
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log('FormEditor: Saving form with name:', formName);
      
      // Here you would save the form to your store or database
      const formData = {
        name: formName,
        description: formDescription,
        content_type_id: contentType.id,
        fields: selectedFields,
        created_at: new Date().toISOString()
      };
      
      // Example of saving to Supabase
      const { data, error } = await supabase
        .from('forms')
        .insert([formData])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      console.log('FormEditor: Form saved successfully:', data);
      toast.success('Form created successfully!');
      navigate('/form-builder');
    } catch (error) {
      console.error('FormEditor: Error saving form:', error);
      toast.error('Failed to save form. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddField = () => {
    if (!contentType) return;
    
    console.log('FormEditor: Navigating to content type builder to add fields');
    // Navigate to content type builder to add fields
    navigate(`/content-types/builder/${contentTypeId}`);
  };
  
  const handleEditField = (field: any) => {
    if (!contentType) return;
    
    console.log('FormEditor: Setting active field for editing:', field.label);
    setActiveField(field);
    navigate(`/content-types/builder/${contentTypeId}`);
  };
  
  if (isLoading) {
    return (
      <CMSLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading form...</p>
        </div>
      </CMSLayout>
    );
  }
  
  if (!contentType) {
    return (
      <CMSLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/form-builder')}
              className="mr-4"
            >
              <ChevronLeft size={18} />
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Form Not Found</h1>
              <p className="text-gray-600 mt-1">
                The form you're looking for doesn't exist or has been deleted.
              </p>
            </div>
          </div>
        </div>
      </CMSLayout>
    );
  }
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/form-builder')}
              className="mr-4"
            >
              <ChevronLeft size={18} />
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Form</h1>
              <p className="text-gray-600 mt-1">
                Based on {contentType.name} content type
              </p>
            </div>
          </div>
          
          <Button onClick={handleSave}>
            <Save size={16} className="mr-2" />
            Save Form
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="form-name">Form Name</Label>
                  <Input
                    id="form-name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter form name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="form-description">Description</Label>
                  <Textarea
                    id="form-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter form description"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Type Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-gray-800">{contentType.name}</p>
                </div>
                
                {contentType.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-gray-800">{contentType.description}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Fields</p>
                  <p className="text-gray-800">{contentType.fields.length} fields available</p>
                </div>
                
                {contentType.fields.length === 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddField}
                    className="mt-2"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Add Fields to Content Type
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LayoutGrid size={18} className="mr-2" />
                  Form Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contentType.fields.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-gray-300 rounded-md">
                    <p className="text-gray-500 mb-4">No fields available for this content type</p>
                    <Button variant="outline" onClick={handleAddField}>
                      <PlusCircle size={16} className="mr-2" />
                      Add Fields to Content Type
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 border border-gray-200 rounded-md space-y-6">
                    <h2 className="text-xl font-bold">{formName}</h2>
                    {formDescription && <p className="text-gray-600">{formDescription}</p>}
                    
                    <div className="space-y-6">
                      {contentType.fields.map((field, index) => (
                        <div key={field.id} onClick={() => handleEditField(field)} className="cursor-pointer">
                          <FieldRenderer 
                            field={field} 
                            contentTypeId={contentType.id} 
                            index={index}
                            onEdit={handleEditField}
                            isPreview={true}
                          />
                        </div>
                      ))}
                      
                      <div className="pt-4">
                        <Button className="w-full sm:w-auto">Submit</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default FormEditor;
