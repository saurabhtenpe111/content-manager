
import React, { useState, useEffect } from 'react';
import { 
  Field,
  useCmsStore,
  FieldType 
} from '@/stores/cmsStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  X, 
  Plus, 
  Trash2,
  Move,
  CheckCircle,
  AlertTriangle,
  Palette,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedValidation } from './AdvancedValidation';
import { UiOptionsEditor } from './UiOptionsEditor';

interface FieldConfigPanelProps {
  field: Field;
  contentTypeId: string;
  onClose: () => void;
}

export const FieldConfigPanel: React.FC<FieldConfigPanelProps> = ({ 
  field, 
  contentTypeId,
  onClose 
}) => {
  const { updateField, deleteField } = useCmsStore();
  
  const [name, setName] = useState(field.name);
  const [label, setLabel] = useState(field.label);
  const [description, setDescription] = useState(field.description || '');
  const [placeholder, setPlaceholder] = useState(field.placeholder || '');
  const [defaultValue, setDefaultValue] = useState<string>(
    field.defaultValue !== undefined ? String(field.defaultValue) : ''
  );
  const [validation, setValidation] = useState(field.validation || {});
  const [uiOptions, setUiOptions] = useState(field.uiOptions || {});
  const [options, setOptions] = useState<{label: string; value: string}[]>(
    field.options || []
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const isSubfield = '_parentFieldId' in field && '_subfieldIndex' in field;
  const parentFieldId = isSubfield ? (field as any)._parentFieldId : null;
  const subfieldIndex = isSubfield ? (field as any)._subfieldIndex : null;
  
  const fieldLabel = field.type.charAt(0).toUpperCase() + field.type.slice(1);
  
  const handleSave = () => {
    const updatedField = {
      name,
      label,
      description,
      placeholder,
      defaultValue: defaultValue === '' ? undefined : defaultValue,
      validation,
      uiOptions,
      options: field.type === 'dropdown' || field.type === 'radio' ? options : undefined,
    };

    if (isSubfield && parentFieldId !== null && subfieldIndex !== null) {
      // Handle updating a subfield
      const parentField = useCmsStore.getState().contentTypes
        .find(ct => ct.id === contentTypeId)?.fields
        .find(f => f.id === parentFieldId);
      
      if (parentField && parentField.subfields) {
        const updatedSubfields = [...parentField.subfields];
        updatedSubfields[subfieldIndex] = {
          ...updatedSubfields[subfieldIndex],
          ...updatedField
        };
        
        updateField(contentTypeId, parentFieldId, {
          ...parentField,
          subfields: updatedSubfields
        });
        
        toast.success('Subfield updated successfully!');
      }
    } else {
      // Regular field update
      updateField(contentTypeId, field.id, updatedField);
      toast.success('Field updated successfully!');
    }
    
    onClose();
  };
  
  const handleDeleteField = () => {
    if (isSubfield && parentFieldId !== null && subfieldIndex !== null) {
      // Handle deleting a subfield
      const parentField = useCmsStore.getState().contentTypes
        .find(ct => ct.id === contentTypeId)?.fields
        .find(f => f.id === parentFieldId);
      
      if (parentField && parentField.subfields) {
        const updatedSubfields = [...parentField.subfields];
        updatedSubfields.splice(subfieldIndex, 1);
        
        updateField(contentTypeId, parentFieldId, {
          ...parentField,
          subfields: updatedSubfields
        });
        
        toast.success('Subfield deleted successfully!');
      }
    } else {
      // Regular field deletion
      deleteField(contentTypeId, field.id);
      toast.success('Field deleted successfully!');
    }
    
    onClose();
  };
  
  const addOption = () => {
    const newOption = {
      label: `Option ${options.length + 1}`,
      value: `option-${options.length + 1}`,
    };
    setOptions([...options, newOption]);
  };
  
  const updateOption = (index: number, field: 'label' | 'value', value: string) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };
  
  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('option-index', String(index));
  };
  
  const handleOptionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleOptionDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = Number(e.dataTransfer.getData('option-index'));
    
    if (sourceIndex === targetIndex) return;
    
    const newOptions = [...options];
    const [movedOption] = newOptions.splice(sourceIndex, 1);
    newOptions.splice(targetIndex, 0, movedOption);
    setOptions(newOptions);
  };

  const handleValidationChange = (updatedValidation: any) => {
    setValidation(updatedValidation);
  };

  const handleUiOptionsChange = (updatedUiOptions: any) => {
    setUiOptions(updatedUiOptions);
  };
  
  // Generate field ID based on name (for HTML purposes)
  const generateFieldId = (fieldName: string) => {
    return `field-${fieldName.toLowerCase().replace(/\s+/g, '-')}`;
  };
  
  return (
    <>
      <div className="h-full flex flex-col">
        <div className="border-b border-cms-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-cms-gray-800">
              Configure {isSubfield ? "Subfield" : fieldLabel + " Field"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="validation" className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Validation
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              {(field.type === 'dropdown' || field.type === 'radio') && (
                <TabsTrigger value="options">Options</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="basic" className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="field-name">Name (API Key)</Label>
                <Input 
                  id="field-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-cms-gray-500">
                  Used as the field identifier in API responses
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="field-label">Label</Label>
                <Input 
                  id="field-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
                <p className="text-xs text-cms-gray-500">
                  Displayed to the user in the form
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="field-description">Description (Optional)</Label>
                <Textarea 
                  id="field-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more information about this field..."
                  rows={3}
                />
                <p className="text-xs text-cms-gray-500">
                  Help text shown to users when filling out the form
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-placeholder">Placeholder (Optional)</Label>
                <Input 
                  id="field-placeholder"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  placeholder="e.g. Enter your text..."
                />
              </div>
              
              {(field.type === 'text' || field.type === 'textarea' || field.type === 'number') && (
                <div className="space-y-2">
                  <Label htmlFor="field-default-value">Default Value (Optional)</Label>
                  <Input 
                    id="field-default-value"
                    value={defaultValue}
                    onChange={(e) => setDefaultValue(e.target.value)}
                    placeholder="Default value when form loads"
                    type={field.type === 'number' ? 'number' : 'text'}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="validation" className="py-4">
              <AdvancedValidation field={field} onChange={handleValidationChange} />
            </TabsContent>

            <TabsContent value="appearance" className="py-4">
              <UiOptionsEditor field={field} onChange={handleUiOptionsChange} />
            </TabsContent>

            <TabsContent value="options" className="py-4">
              {(field.type === 'dropdown' || field.type === 'radio') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Options</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addOption}
                      className="text-xs"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Option
                    </Button>
                  </div>
                  
                  {options.map((option, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-2 p-2 border border-cms-gray-200 rounded-md"
                      draggable
                      onDragStart={(e) => handleOptionDragStart(e, index)}
                      onDragOver={handleOptionDragOver}
                      onDrop={(e) => handleOptionDrop(e, index)}
                    >
                      <div className="cms-drag-handle text-cms-gray-400 cursor-move">
                        <Move size={16} />
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="Option Label"
                          value={option.label}
                          onChange={(e) => updateOption(index, 'label', e.target.value)}
                          className="text-sm"
                        />
                        <Input 
                          placeholder="Option Value"
                          value={option.value}
                          onChange={(e) => updateOption(index, 'value', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeOption(index)}
                        className="h-8 w-8 text-cms-gray-400 hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                  
                  {options.length === 0 && (
                    <p className="text-sm text-cms-gray-500 italic">
                      No options added yet. Click "Add Option" to create options.
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="border-t border-cms-gray-200 p-4 flex items-center justify-between">
          <Button 
            variant="outline" 
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 size={16} className="mr-2" />
            Delete {isSubfield ? "Subfield" : "Field"}
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <CheckCircle size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {isSubfield ? "Subfield" : "Field"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{field.label}" {isSubfield ? "subfield" : "field"}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteField}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
