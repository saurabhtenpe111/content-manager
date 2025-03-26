import React from 'react';
import { 
  Field,
  useCmsStore,
  FieldType
} from '@/stores/cmsStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { 
  Pencil, 
  GripVertical, 
  Copy, 
  Trash2,
  Component,
  Plus,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FieldRendererProps {
  field: Field;
  contentTypeId?: string;
  index?: number;
  onEdit?: (field: Field) => void;
  isPreview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ 
  field, 
  contentTypeId,
  index = 0,
  onEdit,
  isPreview = false,
  value,
  onChange,
  error,
  disabled = false
}) => {
  const { 
    deleteField, 
    addField, 
    setActiveField,
    isDragging,
    setIsDragging,
    updateField
  } = useCmsStore();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contentTypeId) return;
    
    deleteField(contentTypeId, field.id);
    toast.success('Field deleted successfully!');
  };
  
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contentTypeId) return;
    
    const newField = {
      ...field,
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`,
    };
    
    delete (newField as any).id;
    
    addField(contentTypeId, newField);
    toast.success('Field duplicated successfully!');
  };
  
  const handleDragStart = (e: React.DragEvent) => {
    if (!contentTypeId) return;
    
    setIsDragging(true);
    e.dataTransfer.setData('field-id', field.id);
    e.dataTransfer.setData('field-index', String(index));
    
    const dragPreview = document.createElement('div');
    dragPreview.classList.add('bg-white', 'p-2', 'border', 'border-cms-blue', 'rounded', 'text-xs', 'shadow-md');
    dragPreview.textContent = field.label;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleValueChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleAddSubfield = () => {
    if (!contentTypeId || !field.id) return;
    
    const subfieldCount = field.subfields?.length || 0;
    const newSubfield: Omit<Field, 'id'> = {
      name: `field${subfieldCount + 1}`,
      label: `Field ${subfieldCount + 1}`,
      type: 'text' as FieldType,
      placeholder: `Enter text...`,
      validation: {
        required: false,
      },
    };
    
    const updatedSubfields = [
      ...(field.subfields || []),
      { ...newSubfield, id: `temp-${Date.now()}` }
    ];
    
    updateField(contentTypeId, field.id, {
      ...field,
      subfields: updatedSubfields
    });
    
    toast.success('Added new field to component');
  };

  const handleRemoveSubfield = (subfieldIndex: number) => {
    if (!contentTypeId || !field.id || !field.subfields) return;
    
    const updatedSubfields = [...field.subfields];
    updatedSubfields.splice(subfieldIndex, 1);
    
    updateField(contentTypeId, field.id, {
      ...field,
      subfields: updatedSubfields
    });
    
    toast.success('Removed field from component');
  };

  const handleEditSubfield = (subfield: Field, subfieldIndex: number) => {
    if (!contentTypeId || !field.id || !field.subfields) return;
    
    const enrichedSubfield = {
      ...subfield,
      _parentFieldId: field.id,
      _subfieldIndex: subfieldIndex
    };
    
    setActiveField(enrichedSubfield);
    
    if (onEdit) {
      onEdit(enrichedSubfield);
    }
  };
  
  const getFieldComponent = () => {
    const fieldId = `field-${field.id}`;
    const isRequired = field.validation?.required;
    const currentValue = value !== undefined ? value : field.defaultValue;
    const isDisabled = disabled || isPreview;
    
    switch (field.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            <Input 
              id={fieldId}
              placeholder={field.placeholder}
              value={currentValue || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={isDisabled}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            <Textarea 
              id={fieldId}
              placeholder={field.placeholder}
              value={currentValue || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              rows={4}
              disabled={isDisabled}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            <Input 
              id={fieldId}
              type="number"
              placeholder={field.placeholder}
              value={currentValue || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={isDisabled}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'email':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            <Input 
              id={fieldId}
              type="email"
              placeholder={field.placeholder || 'example@email.com'}
              value={currentValue || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={isDisabled}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'password':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            <Input 
              id={fieldId}
              type="password"
              placeholder={field.placeholder || '••••••••'}
              value={currentValue || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={isDisabled}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'date':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            <Input 
              id={fieldId}
              type="date"
              value={currentValue || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={isDisabled}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'dropdown':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            <Select 
              disabled={isDisabled} 
              value={currentValue || ''} 
              onValueChange={handleValueChange}
            >
              <SelectTrigger id={fieldId} className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={fieldId} 
                disabled={isDisabled}
                checked={!!currentValue}
                onCheckedChange={handleValueChange}
              />
              <Label htmlFor={fieldId} className="font-normal">
                {field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'radio':
        return (
          <div className="space-y-2">
            <Label>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            <RadioGroup 
              value={currentValue || ''} 
              onValueChange={handleValueChange}
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`${fieldId}-${option.value}`}
                    disabled={isDisabled}
                  />
                  <Label htmlFor={`${fieldId}-${option.value}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'file':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            <Input 
              id={fieldId}
              type="file"
              disabled={isDisabled}
              className={error ? 'border-red-500' : ''}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleValueChange(e.target.files[0]);
                }
              }}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'toggle':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor={fieldId}>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
                {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
              </div>
              <Switch 
                id={fieldId} 
                disabled={isDisabled}
                checked={!!currentValue}
                onCheckedChange={handleValueChange}
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'slider':
        return (
          <div className="space-y-4">
            <div>
              <Label>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
              {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            </div>
            <Slider
              defaultValue={[currentValue !== undefined ? Number(currentValue) : 50]}
              max={100}
              step={1}
              disabled={isDisabled}
              onValueChange={(values) => handleValueChange(values[0])}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'color':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}</Label>
            {field.description && <p className="text-xs text-cms-gray-500">{field.description}</p>}
            <div className="flex items-center space-x-2">
              <Input
                id={fieldId}
                type="color"
                className="w-12 h-9 p-1"
                value={currentValue || "#000000"}
                onChange={(e) => handleValueChange(e.target.value)}
                disabled={isDisabled}
              />
              <Input
                type="text"
                className={cn("flex-1", error ? 'border-red-500' : '')}
                placeholder="#000000"
                value={currentValue || ""}
                onChange={(e) => handleValueChange(e.target.value)}
                disabled={isDisabled}
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'component':
        return (
          <Card className="border rounded-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">{field.label}</CardTitle>
                {!isPreview && contentTypeId && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSubfield();
                    }}
                    className="h-8"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Field
                  </Button>
                )}
              </div>
              {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {field.subfields && field.subfields.length > 0 ? (
                field.subfields.map((subfield, subfieldIndex) => (
                  <div key={subfield.id || subfieldIndex} className="relative border p-3 rounded-md">
                    {!isPreview && contentTypeId && (
                      <div className="absolute top-2 right-2 z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditSubfield(subfield, subfieldIndex);
                            }}>
                              <Pencil size={14} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSubfield(subfieldIndex);
                            }}>
                              <Trash2 size={14} className="mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                    <FieldRenderer
                      field={subfield}
                      isPreview={isPreview}
                      disabled={isDisabled}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  {!isPreview 
                    ? "No fields added yet. Click 'Add Field' to build your component." 
                    : "This component has no fields yet."}
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <div className="p-4 border border-cms-gray-300 rounded-md bg-cms-gray-50">
            <p className="text-cms-gray-600">Unsupported field type: {field.type}</p>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
    }
  };
  
  return (
    <div
      className={cn(
        "relative border border-cms-gray-200 rounded-md p-4 mb-4 bg-white",
        "group transition-all duration-200 hover:border-cms-blue hover:shadow-sm",
        { "border-cms-blue ring-2 ring-cms-blue/20": field.id === useCmsStore.getState().activeField?.id },
        { "border-red-500": error }
      )}
      onClick={() => {
        if (!isPreview && onEdit) {
          setActiveField(field);
          onEdit(field);
        }
      }}
      draggable={!isPreview && !!contentTypeId}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {!isPreview && contentTypeId && (
        <div className="absolute top-0 -left-7 h-full flex items-center opacity-50 group-hover:opacity-100">
          <div className="p-1 cursor-move text-cms-gray-400 hover:text-cms-gray-600">
            <GripVertical size={18} />
          </div>
        </div>
      )}
      
      {getFieldComponent()}
      
      {!isPreview && contentTypeId && onEdit && field.type !== 'component' && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-md shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(field);
            }}
          >
            <Pencil size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleDuplicate}
          >
            <Copy size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={handleDelete}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  );
};
