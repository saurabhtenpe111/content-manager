import React, { useState, useEffect } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { useNavigate } from 'react-router-dom';
import { useCmsStore, FieldType } from '@/stores/cmsStore';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, FormInput } from 'lucide-react';
import { toast } from 'sonner';

// Use placeholder images with direct URLs instead of local imports
const contactFormImg = "https://placehold.co/600x400/e2e8f0/a3bffa?text=Contact+Form";
const surveyFormImg = "https://placehold.co/600x400/e2e8f0/a3bffa?text=Survey+Form";

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: number;
  thumbnail: string;
  fieldData: {
    name: string;
    label: string;
    type: FieldType;
    description?: string;
    placeholder?: string;
    defaultValue?: any;
    validation?: any;
    options?: { label: string; value: string }[];
  }[];
}

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { contentTypes, fetchContentTypes, addContentType, addField } = useCmsStore();
  const [showNewFormDialog, setShowNewFormDialog] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form templates
  const formTemplates: FormTemplate[] = [
    {
      id: 'contact',
      name: 'Contact Form',
      description: 'Basic contact information collection',
      fields: 4,
      thumbnail: contactFormImg,
      fieldData: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text' as FieldType,
          placeholder: 'John Doe',
          validation: { required: true }
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email' as FieldType,
          placeholder: 'john@example.com',
          validation: { required: true }
        },
        {
          name: 'subject',
          label: 'Subject',
          type: 'text' as FieldType,
          placeholder: 'Your subject here'
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea' as FieldType,
          placeholder: 'Write your message here...',
          validation: { required: true }
        }
      ]
    },
    {
      id: 'survey',
      name: 'Survey Form',
      description: 'Collect feedback and opinions',
      fields: 6,
      thumbnail: surveyFormImg,
      fieldData: [
        {
          name: 'name',
          label: 'Your Name',
          type: 'text' as FieldType,
          placeholder: 'John Doe'
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email' as FieldType,
          placeholder: 'john@example.com'
        },
        {
          name: 'age',
          label: 'Age Group',
          type: 'dropdown' as FieldType,
          options: [
            { label: 'Under 18', value: 'under_18' },
            { label: '18-24', value: '18-24' },
            { label: '25-34', value: '25-34' },
            { label: '35-44', value: '35-44' },
            { label: '45+', value: '45+' }
          ]
        },
        {
          name: 'satisfaction',
          label: 'How satisfied are you with our product?',
          type: 'radio' as FieldType,
          options: [
            { label: 'Very Satisfied', value: 'very_satisfied' },
            { label: 'Satisfied', value: 'satisfied' },
            { label: 'Neutral', value: 'neutral' },
            { label: 'Dissatisfied', value: 'dissatisfied' },
            { label: 'Very Dissatisfied', value: 'very_dissatisfied' }
          ]
        },
        {
          name: 'features',
          label: 'Which features do you use most?',
          type: 'checkboxes' as FieldType,
          options: [
            { label: 'Feature A', value: 'feature_a' },
            { label: 'Feature B', value: 'feature_b' },
            { label: 'Feature C', value: 'feature_c' },
            { label: 'Feature D', value: 'feature_d' }
          ]
        },
        {
          name: 'feedback',
          label: 'Additional Feedback',
          type: 'textarea' as FieldType,
          placeholder: 'Please share any additional feedback...'
        }
      ]
    },
    {
      id: 'registration',
      name: 'Registration Form',
      description: 'User registration and account creation',
      fields: 5,
      thumbnail: 'https://placehold.co/600x400/e2e8f0/a3bffa?text=Registration+Form',
      fieldData: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text' as FieldType,
          validation: { required: true }
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text' as FieldType,
          validation: { required: true }
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email' as FieldType,
          validation: { required: true }
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password' as FieldType,
          validation: { required: true }
        },
        {
          name: 'confirmPassword',
          label: 'Confirm Password',
          type: 'password' as FieldType,
          validation: { required: true }
        }
      ]
    },
    {
      id: 'event',
      name: 'Event Registration',
      description: 'Collect event participation details',
      fields: 7,
      thumbnail: 'https://placehold.co/600x400/e2e8f0/a3bffa?text=Event+Registration',
      fieldData: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text' as FieldType,
          validation: { required: true }
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email' as FieldType,
          validation: { required: true }
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'text' as FieldType
        },
        {
          name: 'eventDate',
          label: 'Event Date',
          type: 'date' as FieldType,
          validation: { required: true }
        },
        {
          name: 'attendees',
          label: 'Number of Attendees',
          type: 'number' as FieldType,
          defaultValue: 1,
          validation: { required: true, min: 1 }
        },
        {
          name: 'dietaryRestrictions',
          label: 'Dietary Restrictions',
          type: 'textarea' as FieldType
        },
        {
          name: 'termsAccepted',
          label: 'I accept the terms and conditions',
          type: 'checkbox' as FieldType,
          validation: { required: true }
        }
      ]
    }
  ];
  
  useEffect(() => {
    // Fetch content types if needed
    fetchContentTypes().catch(err => {
      console.error("Error fetching content types:", err);
      toast.error("Failed to load content types");
    });
  }, [fetchContentTypes]);
  
  const handleCreateForm = () => {
    if (!selectedContentType) {
      toast.error('Please select a content type');
      return;
    }
    
    navigate(`/form-builder/${selectedContentType}`);
  };
  
  const handleTemplateSelect = async (templateId: string) => {
    try {
      setIsLoading(true);
      
      // Find the template
      const template = formTemplates.find(t => t.id === templateId);
      if (!template) {
        toast.error('Template not found');
        return;
      }
      
      // Create a new content type based on the template
      const contentTypeData = {
        name: template.name,
        description: template.description,
        fields: []
      };
      
      // Add the content type
      await addContentType(contentTypeData);
      
      // Get the latest content types to find the new one
      await fetchContentTypes();
      
      // Find the newly created content type (should be the last one added)
      const newContentTypes = useCmsStore.getState().contentTypes;
      const newContentType = newContentTypes.find(ct => ct.name === template.name);
      
      if (!newContentType) {
        throw new Error('Failed to find newly created content type');
      }
      
      // Add all the fields from the template
      for (const fieldData of template.fieldData) {
        // Ensure the field data is properly typed as FieldType
        await addField(newContentType.id, {
          name: fieldData.name,
          label: fieldData.label,
          type: fieldData.type,
          description: fieldData.description,
          placeholder: fieldData.placeholder,
          defaultValue: fieldData.defaultValue,
          validation: fieldData.validation,
          options: fieldData.options
        });
      }
      
      toast.success(`${template.name} created successfully!`);
      
      // Navigate to the form editor
      navigate(`/form-builder/${newContentType.id}`);
    } catch (error: any) {
      console.error('Error creating form from template:', error);
      toast.error(`Failed to create form: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cms-gray-900">Form Builder</h1>
            <p className="text-cms-gray-600 mt-1">
              Create forms based on content types or use templates
            </p>
          </div>
          
          <Button onClick={() => setShowNewFormDialog(true)}>
            <PlusCircle size={16} className="mr-2" />
            New Form
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Templates Section */}
          <h2 className="text-xl font-semibold text-cms-gray-800 col-span-full mt-4 mb-2">
            Form Templates
          </h2>
          
          {formTemplates.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-cms-gray-500">{template.fields} fields</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(template.id)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Use Template'}
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {/* Content Type Based Forms */}
          {contentTypes.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-cms-gray-800 col-span-full mt-6 mb-2">
                Content Type Forms
              </h2>
              
              {contentTypes.map((contentType) => (
                <Card 
                  key={contentType.id} 
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => navigate(`/form-builder/${contentType.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FormInput size={16} className="mr-2 text-primary" />
                      {contentType.name}
                    </CardTitle>
                    <CardDescription>
                      {contentType.description || 'No description provided'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span>Fields: {contentType.fields.length}</span>
                      <span>Created: {new Date(contentType.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Edit Form
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
      
      {/* New Form Dialog */}
      <Dialog open={showNewFormDialog} onOpenChange={setShowNewFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              Select a content type to create a new form
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Select Content Type</Label>
              <div className="grid gap-2">
                {contentTypes.map((type) => (
                  <Card 
                    key={type.id} 
                    className={`cursor-pointer border ${selectedContentType === type.id ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => setSelectedContentType(type.id)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-sm text-cms-gray-500">{type.fields.length} fields</p>
                      </div>
                      {selectedContentType === type.id && (
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {contentTypes.length === 0 && (
                  <p className="text-center py-4 text-cms-gray-500">
                    No content types available. Please create a content type first.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNewFormDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateForm}
              disabled={!selectedContentType || contentTypes.length === 0}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CMSLayout>
  );
};

export default FormBuilder;
