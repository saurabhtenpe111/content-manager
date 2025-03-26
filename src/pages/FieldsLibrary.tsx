import React, { useState, useEffect } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, GripVertical, ChevronDown, AlertCircle } from 'lucide-react';
import { FieldType, Field, useCmsStore, ContentType } from '@/stores/cmsStore';
import { FieldRenderer } from '@/components/fields/FieldRenderer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FieldTemplate {
  id: string;
  type: FieldType;
  name: string;
  label: string;
  description: string;
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  validation?: { required: boolean };
}

const FieldsLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { contentTypes, activeContentTypeId, setActiveContentType, addField, fetchContentTypes } = useCmsStore();
  const [selectedContentTypeId, setSelectedContentTypeId] = useState<string | null>(activeContentTypeId);
  
  useEffect(() => {
    fetchContentTypes();
  }, [fetchContentTypes]);
  
  useEffect(() => {
    if (activeContentTypeId && (!selectedContentTypeId || activeContentTypeId !== selectedContentTypeId)) {
      setSelectedContentTypeId(activeContentTypeId);
    }
  }, [activeContentTypeId, selectedContentTypeId]);
  
  const fieldTemplates: FieldTemplate[] = [
    {
      id: 'text-field',
      type: 'text',
      name: 'textField',
      label: 'Text Field',
      description: 'Single line text input for short text.',
      placeholder: 'Enter text...',
      validation: { required: false },
    },
    {
      id: 'textarea-field',
      type: 'textarea',
      name: 'textareaField',
      label: 'Text Area',
      description: 'Multi-line text input for longer content.',
      placeholder: 'Enter description...',
      validation: { required: false },
    },
    {
      id: 'number-field',
      type: 'number',
      name: 'numberField',
      label: 'Number',
      description: 'Numeric input field with validation.',
      placeholder: 'Enter a number...',
      defaultValue: '',
      validation: { required: false },
    },
    {
      id: 'email-field',
      type: 'email',
      name: 'emailField',
      label: 'Email',
      description: 'Input field with email validation.',
      placeholder: 'email@example.com',
      validation: { required: false },
    },
    {
      id: 'password-field',
      type: 'password',
      name: 'passwordField',
      label: 'Password',
      description: 'Secure password input with masking.',
      placeholder: '••••••••',
      validation: { required: false },
    },
    {
      id: 'url-field',
      type: 'url',
      name: 'urlField',
      label: 'URL',
      description: 'Input field for website URLs.',
      placeholder: 'https://example.com',
      validation: { required: false },
    },
    {
      id: 'date-field',
      type: 'date',
      name: 'dateField',
      label: 'Date',
      description: 'Date picker for selecting dates.',
      validation: { required: false },
    },
    {
      id: 'dropdown-field',
      type: 'dropdown',
      name: 'dropdownField',
      label: 'Dropdown',
      description: 'Select one option from a dropdown list.',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
      validation: { required: false },
    },
    {
      id: 'checkbox-field',
      type: 'checkbox',
      name: 'checkboxField',
      label: 'Checkbox',
      description: 'Boolean input for yes/no or true/false values.',
      validation: { required: false },
    },
    {
      id: 'checkboxes-field',
      type: 'checkboxes',
      name: 'checkboxesField',
      label: 'Checkboxes Group',
      description: 'Select multiple options from choices.',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
      validation: { required: false },
    },
    {
      id: 'radio-field',
      type: 'radio',
      name: 'radioField',
      label: 'Radio Group',
      description: 'Select a single option from multiple choices.',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
      validation: { required: false },
    },
    {
      id: 'file-field',
      type: 'file',
      name: 'fileField',
      label: 'File Upload',
      description: 'Upload files with format validation.',
      validation: { required: false },
    },
    {
      id: 'toggle-field',
      type: 'toggle',
      name: 'toggleField',
      label: 'Toggle Switch',
      description: 'Switch control for boolean values.',
      validation: { required: false },
    },
    {
      id: 'slider-field',
      type: 'slider',
      name: 'sliderField',
      label: 'Slider',
      description: 'Range selector for numeric values.',
      defaultValue: 50,
      validation: { required: false },
    },
    {
      id: 'color-field',
      type: 'color',
      name: 'colorField',
      label: 'Color Picker',
      description: 'Select colors using a visual picker.',
      defaultValue: '#3B82F6',
      validation: { required: false },
    },
  ];
  
  const textFields = fieldTemplates.filter((field) => 
    field.type === 'text' || field.type === 'textarea' || field.type === 'email' || 
    field.type === 'password' || field.type === 'url'
  );
  
  const numberFields = fieldTemplates.filter((field) => 
    field.type === 'number' || field.type === 'slider'
  );
  
  const selectionFields = fieldTemplates.filter((field) => 
    field.type === 'dropdown' || field.type === 'checkbox' || field.type === 'checkboxes' || 
    field.type === 'radio' || field.type === 'toggle'
  );
  
  const otherFields = fieldTemplates.filter((field) => 
    field.type === 'date' || field.type === 'file' || field.type === 'color'
  );
  
  const filteredFields = fieldTemplates.filter((field) => 
    field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToContentType = (field: FieldTemplate) => {
    if (!selectedContentTypeId) {
      toast.error("No content type selected. Please select or create a content type first.");
      return;
    }

    setActiveContentType(selectedContentTypeId);

    const newField = {
      name: field.name,
      label: field.label,
      type: field.type,
      description: field.description,
      placeholder: field.placeholder,
      defaultValue: field.defaultValue,
      options: field.options,
      validation: field.validation
    };

    addField(selectedContentTypeId, newField)
      .then(() => {
        toast.success(`Added ${field.label} field to content type`);
        
        navigate(`/content-types/${selectedContentTypeId}`);
      })
      .catch((error) => {
        toast.error(`Failed to add field: ${error.message}`);
      });
  };
  
  const handleDragStart = (e: React.DragEvent, field: FieldTemplate) => {
    e.dataTransfer.setData('field-type', field.type);
    e.dataTransfer.setData('field-data', JSON.stringify(field));
    
    const dragPreview = document.createElement('div');
    dragPreview.classList.add('bg-white', 'p-2', 'border', 'border-cms-blue', 'rounded', 'text-xs', 'shadow-md');
    dragPreview.textContent = field.label;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };
  
  const handleCreateContentType = () => {
    navigate('/content-types/new');
  };
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-cms-gray-900">Fields Library</h1>
          <p className="text-cms-gray-600 mt-1">
            Explore available field types and their configurations. Drag fields to your content type or click to add them.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cms-gray-400" size={18} />
            <Input 
              placeholder="Search fields..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-auto flex gap-2 items-center">
            <Select 
              value={selectedContentTypeId || ""} 
              onValueChange={(value) => {
                setSelectedContentTypeId(value);
                setActiveContentType(value);
              }}
            >
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">
                    No content types available. Create one first.
                  </div>
                ) : (
                  contentTypes.map((contentType) => (
                    <SelectItem 
                      key={contentType.id} 
                      value={contentType.id}
                    >
                      {contentType.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <Button onClick={handleCreateContentType}>
              <Plus size={16} className="mr-2" />
              New Type
            </Button>
          </div>
        </div>
        
        {contentTypes.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to create a content type before you can add fields. 
              <Button 
                variant="link" 
                onClick={handleCreateContentType} 
                className="px-1 h-auto"
              >
                Create your first content type
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Fields</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="number">Numbers</TabsTrigger>
            <TabsTrigger value="selection">Selection</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredFields.map((field) => (
                <FieldCard 
                  key={field.id} 
                  field={field as Field} 
                  onDragStart={(e) => handleDragStart(e, field)}
                  onAdd={() => handleAddToContentType(field)}
                  selectedContentTypeId={selectedContentTypeId}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="text">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {textFields.filter((field) => 
                field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                field.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((field) => (
                <FieldCard 
                  key={field.id} 
                  field={field as Field} 
                  onDragStart={(e) => handleDragStart(e, field)}
                  onAdd={() => handleAddToContentType(field)}
                  selectedContentTypeId={selectedContentTypeId}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="number">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {numberFields.filter((field) => 
                field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                field.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((field) => (
                <FieldCard 
                  key={field.id} 
                  field={field as Field} 
                  onDragStart={(e) => handleDragStart(e, field)}
                  onAdd={() => handleAddToContentType(field)}
                  selectedContentTypeId={selectedContentTypeId}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="selection">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {selectionFields.filter((field) => 
                field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                field.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((field) => (
                <FieldCard 
                  key={field.id} 
                  field={field as Field} 
                  onDragStart={(e) => handleDragStart(e, field)}
                  onAdd={() => handleAddToContentType(field)}
                  selectedContentTypeId={selectedContentTypeId}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="other">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {otherFields.filter((field) => 
                field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                field.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((field) => (
                <FieldCard 
                  key={field.id} 
                  field={field as Field} 
                  onDragStart={(e) => handleDragStart(e, field)}
                  onAdd={() => handleAddToContentType(field)}
                  selectedContentTypeId={selectedContentTypeId}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CMSLayout>
  );
};

interface FieldCardProps {
  field: Field;
  onDragStart: (e: React.DragEvent) => void;
  onAdd: () => void;
  selectedContentTypeId: string | null;
}

const FieldCard: React.FC<FieldCardProps> = ({ 
  field, 
  onDragStart, 
  onAdd,
  selectedContentTypeId
}) => {
  return (
    <Card 
      className="overflow-hidden border border-cms-gray-200 hover:border-cms-blue transition-colors duration-200 cursor-grab"
      draggable
      onDragStart={onDragStart}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{field.label}</CardTitle>
          <GripVertical size={16} className="text-cms-gray-400" />
        </div>
        <CardDescription className="text-xs">{field.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-cms-gray-100 rounded-md p-3 bg-cms-gray-50">
          <FieldRenderer
            field={field}
            isPreview={true}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onAdd}
          disabled={!selectedContentTypeId}
        >
          <Plus size={16} className="mr-2" />
          Add to Content Type
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FieldsLibrary;
