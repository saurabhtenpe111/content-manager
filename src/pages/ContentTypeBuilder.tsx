import React, { useState, useEffect, useRef } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { useCmsStore, Field, FieldType } from '@/stores/cmsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  Save, 
  Eye, 
  EyeOff,
  PlusCircle,
  Component,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { FieldTypes } from '@/components/fields/FieldTypes';
import { FieldConfigPanel } from '@/components/fields/FieldConfigPanel';
import { FieldRenderer } from '@/components/fields/FieldRenderer';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const ContentTypeBuilder: React.FC = () => {
  const { contentTypeId } = useParams<{ contentTypeId: string }>();
  const navigate = useNavigate();
  const { 
    contentTypes, 
    updateContentType, 
    addField, 
    activeField, 
    setActiveField,
    isDragging,
    reorderFields,
    setActiveContentType,
    fetchContentTypes,
    updateField
  } = useCmsStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddComponentDialogOpen, setIsAddComponentDialogOpen] = useState(false);
  
  const contentType = contentTypes.find((ct) => ct.id === contentTypeId);
  const formAreaRef = useRef<HTMLDivElement>(null);
  
  const [activeDropComponent, setActiveDropComponent] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('ContentTypeBuilder mounted, contentTypeId:', contentTypeId);
    if (contentTypes.length === 0) {
      setLoading(true);
      fetchContentTypes()
        .then(() => {
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching content types:', error);
          toast.error('Failed to load content types');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [contentTypes.length, fetchContentTypes]);
  
  useEffect(() => {
    if (!contentTypeId) {
      navigate('/content-types');
      return;
    }
    
    console.log('Setting active content type in ContentTypeBuilder:', contentTypeId);
    setActiveContentType(contentTypeId);
    
    if (contentType) {
      console.log('Content type found, setting form data:', contentType.name);
      setName(contentType.name);
      setDescription(contentType.description || '');
    } else if (!loading && contentTypes.length > 0) {
      console.log('Content type not found, redirecting');
      toast.error('Content type not found');
      navigate('/content-types');
    }
  }, [contentType, contentTypeId, contentTypes.length, loading, navigate, setActiveContentType]);
  
  useEffect(() => {
    if (activeField) {
      setIsConfigPanelOpen(true);
    }
  }, [activeField]);
  
  if (loading) {
    return (
      <CMSLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading content type...</p>
        </div>
      </CMSLayout>
    );
  }
  
  if (!contentType && !loading) {
    return (
      <CMSLayout>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/content-types')}
            className="mr-4"
          >
            <ChevronLeft size={18} />
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-cms-gray-900">Content Type Not Found</h1>
            <p className="text-cms-gray-600 mt-1">
              The content type you're looking for doesn't exist or has been deleted.
            </p>
          </div>
        </div>
      </CMSLayout>
    );
  }
  
  const handleSave = () => {
    updateContentType(contentType.id, {
      name,
      description,
    });
    
    toast.success('Content type updated successfully!');
  };
  
  const handleAddField = (type: FieldType) => {
    if (!contentType) return;
    
    const fieldLabel = type.charAt(0).toUpperCase() + type.slice(1);
    const fieldCount = contentType.fields.filter((f) => f.type === type).length;
    
    const newField: Omit<Field, 'id'> = {
      name: `${type}${fieldCount + 1}`,
      label: `${fieldLabel} ${fieldCount + 1}`,
      type,
      placeholder: `Enter ${type} value...`,
      validation: {
        required: false,
      },
    };
    
    if (type === 'dropdown' || type === 'radio') {
      newField.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ];
    }
    
    if (type === 'component') {
      newField.subfields = [];
    }
    
    addField(contentType.id, newField);
    toast.success(`Added new ${fieldLabel} field`);
  };

  const handleAddComponent = () => {
    if (!contentType) return;
    
    const componentCount = contentType.fields.filter((f) => f.type === 'component').length;
    
    const newField: Omit<Field, 'id'> = {
      name: `component${componentCount + 1}`,
      label: `Component ${componentCount + 1}`,
      type: 'component',
      placeholder: '',
      validation: {
        required: false,
      },
      subfields: []
    };
    
    addField(contentType.id, newField);
    setIsAddComponentDialogOpen(false);
    toast.success(`Added new component field`);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (formAreaRef.current) {
      formAreaRef.current.classList.add('bg-cms-gray-100');
    }
  };
  
  const handleDragLeave = () => {
    if (formAreaRef.current) {
      formAreaRef.current.classList.remove('bg-cms-gray-100');
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (formAreaRef.current) {
      formAreaRef.current.classList.remove('bg-cms-gray-100');
    }
    
    const fieldType = e.dataTransfer.getData('field-type') as FieldType;
    const fieldId = e.dataTransfer.getData('field-id');
    const fieldIndex = e.dataTransfer.getData('field-index');
    const fieldDataStr = e.dataTransfer.getData('field-data');
    
    if (activeDropComponent) {
      handleDropIntoComponent(activeDropComponent, fieldType, fieldDataStr);
      setActiveDropComponent(null);
      return;
    }
    
    if (fieldDataStr) {
      try {
        const fieldData = JSON.parse(fieldDataStr);
        const fieldCount = contentType.fields.filter((f) => f.type === fieldData.type).length;
        
        const newField: Omit<Field, 'id'> = {
          name: `${fieldData.type}${fieldCount + 1}`,
          label: `${fieldData.label} ${fieldCount + 1}`,
          type: fieldData.type,
          description: fieldData.description,
          placeholder: fieldData.placeholder,
          defaultValue: fieldData.defaultValue,
          validation: fieldData.validation || { required: false },
          options: fieldData.options,
        };
        
        if (fieldData.type === 'component') {
          newField.subfields = [];
        }
        
        addField(contentType.id, newField);
        toast.success(`Added new ${fieldData.label} field`);
        return;
      } catch (err) {
        console.error('Failed to parse field data:', err);
      }
    }
    
    if (fieldType && !fieldId) {
      handleAddField(fieldType);
      return;
    }
    
    if (fieldId && fieldIndex) {
      const sourceIndex = parseInt(fieldIndex, 10);
      let targetIndex = -1;
      
      const fieldElements = formAreaRef.current.querySelectorAll('.field-item');
      const mouseY = e.clientY;
      
      for (let i = 0; i < fieldElements.length; i++) {
        const rect = fieldElements[i].getBoundingClientRect();
        const fieldMiddleY = rect.top + rect.height / 2;
        
        if (mouseY < fieldMiddleY) {
          targetIndex = i;
          break;
        }
      }
      
      if (targetIndex === -1) {
        targetIndex = fieldElements.length;
      }
      
      if (sourceIndex < targetIndex) {
        targetIndex -= 1;
      }
      
      if (sourceIndex === targetIndex) {
        return;
      }
      
      const newOrder = [...contentType.fields.map((f) => f.id)];
      const [movedItem] = newOrder.splice(sourceIndex, 1);
      newOrder.splice(targetIndex, 0, movedItem);
      
      reorderFields(contentType.id, newOrder);
      toast.success("Field order updated");
    }
  };
  
  const handleDropIntoComponent = (componentId: string, fieldType?: FieldType, fieldDataStr?: string) => {
    const componentField = contentType.fields.find(f => f.id === componentId);
    if (!componentField || componentField.type !== 'component') return;
    
    let newSubfield: Field;
    
    if (fieldDataStr) {
      try {
        const fieldData = JSON.parse(fieldDataStr);
        const subfieldCount = componentField.subfields?.length || 0;
        
        newSubfield = {
          id: `${componentId}-subfield-${Date.now()}`,
          name: `${fieldData.type}${subfieldCount + 1}`,
          label: `${fieldData.label} ${subfieldCount + 1}`,
          type: fieldData.type,
          description: fieldData.description,
          placeholder: fieldData.placeholder,
          defaultValue: fieldData.defaultValue,
          validation: fieldData.validation || { required: false },
          options: fieldData.options,
        };
      } catch (err) {
        console.error('Failed to parse field data:', err);
        return;
      }
    } else if (fieldType) {
      const fieldLabel = fieldType.charAt(0).toUpperCase() + fieldType.slice(1);
      const subfieldCount = componentField.subfields?.filter((f) => f.type === fieldType).length || 0;
      
      newSubfield = {
        id: `${componentId}-subfield-${Date.now()}`,
        name: `${fieldType}${subfieldCount + 1}`,
        label: `${fieldLabel} ${subfieldCount + 1}`,
        type: fieldType,
        placeholder: `Enter ${fieldType} value...`,
        validation: {
          required: false,
        },
      };
      
      if (fieldType === 'dropdown' || fieldType === 'radio') {
        newSubfield.options = [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ];
      }
    } else {
      return;
    }
    
    const updatedSubfields = [
      ...(componentField.subfields || []),
      newSubfield
    ];
    
    updateField(contentType.id, componentId, {
      ...componentField,
      subfields: updatedSubfields
    });
    
    toast.success(`Added new ${newSubfield.label} to component`);
  };
  
  const handleComponentDragOver = (e: React.DragEvent, componentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropComponent(componentId);
    
    const el = e.currentTarget as HTMLElement;
    el.classList.add('bg-blue-50', 'border-blue-300');
  };
  
  const handleComponentDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropComponent(null);
    
    const el = e.currentTarget as HTMLElement;
    el.classList.remove('bg-blue-50', 'border-blue-300');
  };
  
  const handleEditField = (field: Field) => {
    setActiveField(field);
    setIsConfigPanelOpen(true);
  };
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/content-types')}
              className="mr-4"
            >
              <ChevronLeft size={18} />
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold text-cms-gray-900">{name}</h1>
              <p className="text-cms-gray-600 mt-1">
                Build the data architecture of your content
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsPreviewDialogOpen(true)}
            >
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setIsAddComponentDialogOpen(true)}
            >
              <Component size={16} className="mr-2" />
              Add Component
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/fields-library')}
            >
              <PlusCircle size={16} className="mr-2" />
              Add Field
            </Button>
            
            <Button onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Save
            </Button>
          </div>
        </div>
        
        <div className="border-t border-cms-gray-200 pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 shrink-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cms-gray-700">Content Type Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter content type name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cms-gray-700">Description (Optional)</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this content type..."
                    rows={3}
                  />
                </div>
                
                <FieldTypes 
                  onSelect={handleAddField}
                  className="mt-6 border-t border-cms-gray-200 pt-6"
                />
              </div>
            </div>
            
            <div 
              className="flex-1 border border-dashed border-cms-gray-300 rounded-md p-6 transition-colors duration-200"
              ref={formAreaRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-cms-gray-800">
                  {contentType.name} Fields
                </h2>
                
                <Button variant="outline" size="sm" onClick={() => setIsAddComponentDialogOpen(true)}>
                  <Plus size={14} className="mr-1" />
                  Add another field
                </Button>
              </div>
              
              <div className="space-y-2">
                {contentType.fields.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-cms-gray-200 rounded-md">
                    <p className="text-cms-gray-500 mb-2">
                      Drag and drop fields here to create your content type
                    </p>
                    <p className="text-cms-gray-400 text-sm">
                      Or click on a field type from the sidebar to add it
                    </p>
                    <div className="mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/fields-library')}
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Browse Field Library
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {contentType.fields.map((field, index) => (
                      <div 
                        key={field.id}
                        className="field-item"
                      >
                        {field.type === 'component' ? (
                          <div
                            onDragOver={(e) => handleComponentDragOver(e, field.id)}
                            onDragLeave={handleComponentDragLeave}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const el = e.currentTarget as HTMLElement;
                              el.classList.remove('bg-blue-50', 'border-blue-300');
                              
                              const fieldType = e.dataTransfer.getData('field-type') as FieldType;
                              const fieldDataStr = e.dataTransfer.getData('field-data');
                              
                              handleDropIntoComponent(field.id, fieldType, fieldDataStr);
                              setActiveDropComponent(null);
                            }}
                          >
                            <FieldRenderer
                              field={field}
                              contentTypeId={contentType.id}
                              index={index}
                              onEdit={handleEditField}
                            />
                          </div>
                        ) : (
                          <FieldRenderer
                            field={field}
                            contentTypeId={contentType.id}
                            index={index}
                            onEdit={handleEditField}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Sheet 
        open={isConfigPanelOpen && !!activeField} 
        onOpenChange={(open) => {
          setIsConfigPanelOpen(open);
          if (!open) {
            setActiveField(null);
          }
        }}
      >
        <SheetContent className="w-[500px] p-0 overflow-hidden">
          {activeField && (
            <FieldConfigPanel
              field={activeField}
              contentTypeId={contentType.id}
              onClose={() => {
                setIsConfigPanelOpen(false);
                setActiveField(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
      
      <Dialog 
        open={isPreviewDialogOpen} 
        onOpenChange={setIsPreviewDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Form Preview</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-6 border border-cms-gray-200 rounded-md bg-white">
              <h2 className="text-2xl font-bold text-cms-gray-900 mb-4">{contentType.name}</h2>
              {contentType.description && (
                <p className="text-cms-gray-600 mb-6">{contentType.description}</p>
              )}
              
              <div className="space-y-6">
                {contentType.fields.length === 0 ? (
                  <p className="text-cms-gray-500 italic">No fields have been added yet.</p>
                ) : (
                  <>
                    {contentType.fields.map((field, index) => (
                      <div key={field.id}>
                        <FieldRenderer
                          field={field}
                          isPreview={true}
                        />
                      </div>
                    ))}
                    
                    <div className="flex justify-end pt-4">
                      <Button>Submit</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={isAddComponentDialogOpen} 
        onOpenChange={setIsAddComponentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Component</DialogTitle>
            <DialogDescription>
              Components allow you to create reusable field groups that can be used in your content types.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div 
              className="p-4 border rounded bg-gray-50 hover:bg-gray-100 cursor-pointer flex flex-col items-center text-center"
              onClick={handleAddComponent}
            >
              <Component size={24} className="text-purple-600 mb-2" />
              <h3 className="font-medium">Create new component</h3>
              <p className="text-sm text-gray-500 mt-1">
                Create a reusable group of fields
              </p>
            </div>
            
            <div 
              className="p-4 border rounded bg-gray-50 hover:bg-gray-100 cursor-pointer flex flex-col items-center text-center"
              onClick={() => {
                setIsAddComponentDialogOpen(false);
                handleAddField('text');
              }}
            >
              <Component size={24} className="text-blue-600 mb-2" />
              <h3 className="font-medium">Use existing component</h3>
              <p className="text-sm text-gray-500 mt-1">
                Reuse a previously created component
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CMSLayout>
  );
};

export default ContentTypeBuilder;
