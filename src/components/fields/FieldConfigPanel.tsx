
import React, { useState, useEffect } from 'react';
import { X, Copy, Trash, ChevronRight, SlidersHorizontal, Check, AlertTriangle, Info } from 'lucide-react';
import { Field, useCmsStore, FieldType } from '@/stores/cmsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

export interface FieldConfigPanelProps {
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
  const [type, setType] = useState<FieldType>(field.type);
  const [description, setDescription] = useState(field.description || '');
  const [placeholder, setPlaceholder] = useState(field.placeholder || '');
  const [defaultValue, setDefaultValue] = useState<any>(field.defaultValue || '');
  
  const [showRequiredWarning, setShowRequiredWarning] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  
  // Validation settings
  const [isRequired, setIsRequired] = useState(field.validation?.required || false);
  const [minLength, setMinLength] = useState<string>(
    field.validation?.min ? String(field.validation.min) : ''
  );
  const [maxLength, setMaxLength] = useState<string>(
    field.validation?.max ? String(field.validation.max) : ''
  );
  const [pattern, setPattern] = useState<string>(
    field.validation?.pattern || ''
  );
  
  // UI Options
  const [floatingLabel, setFloatingLabel] = useState<boolean>(
    field.uiOptions?.floatingLabel || false
  );
  const [filled, setFilled] = useState<boolean>(
    field.uiOptions?.filled || false
  );
  const [showIcon, setShowIcon] = useState<boolean>(
    field.uiOptions?.showIcon || false
  );
  const [inline, setInline] = useState<boolean>(
    field.uiOptions?.inline || false
  );
  const [multipleMonths, setMultipleMonths] = useState<number | null>(
    field.uiOptions?.multipleMonths || null
  );
  const [showButtons, setShowButtons] = useState<boolean>(
    field.uiOptions?.showButtons || false
  );
  const [showTime, setShowTime] = useState<boolean>(
    field.uiOptions?.showTime || false
  );
  const [autoResize, setAutoResize] = useState<boolean>(
    field.uiOptions?.autoResize || false
  );
  const [multiple, setMultiple] = useState<boolean>(
    field.uiOptions?.multiple || false
  );
  const [checkboxSelection, setCheckboxSelection] = useState<boolean>(
    field.uiOptions?.checkboxSelection || false
  );
  const [filterable, setFilterable] = useState<boolean>(
    field.uiOptions?.filterable || false
  );
  const [showClear, setShowClear] = useState<boolean>(
    field.uiOptions?.showClear || false
  );
  const [range, setRange] = useState<boolean>(
    field.uiOptions?.range || false
  );
  const [count, setCount] = useState<number>(
    field.uiOptions?.count || 5
  );
  const [allowCancel, setAllowCancel] = useState<boolean>(
    field.uiOptions?.allowCancel !== false
  );
  const [triggers, setTriggers] = useState<string>(
    field.uiOptions?.triggers?.join(',') || '@'
  );
  const [dateFormat, setDateFormat] = useState<string>(
    field.uiOptions?.dateFormat || 'MM/dd/yyyy'
  );
  const [monthsOnly, setMonthsOnly] = useState<boolean>(
    field.uiOptions?.monthsOnly || false
  );
  const [optional, setOptional] = useState<boolean>(
    field.uiOptions?.optional || false
  );
  const [slotChar, setSlotChar] = useState<string>(
    field.uiOptions?.slotChar || '_'
  );
  
  // Advanced settings
  const [isHidden, setIsHidden] = useState(field.isHidden || false);
  
  // Options for dropdown, radio, select button
  const [options, setOptions] = useState<{ label: string; value: string; disabled?: boolean }[]>(
    field.options || []
  );
  
  useEffect(() => {
    // Update form state when field changes
    setName(field.name);
    setLabel(field.label);
    setType(field.type);
    setDescription(field.description || '');
    setPlaceholder(field.placeholder || '');
    setDefaultValue(field.defaultValue || '');
    setIsRequired(field.validation?.required || false);
    setIsHidden(field.isHidden || false);
    setOptions(field.options || []);
    
    // Validation
    setMinLength(field.validation?.min ? String(field.validation.min) : '');
    setMaxLength(field.validation?.max ? String(field.validation.max) : '');
    setPattern(field.validation?.pattern || '');
    
    // UI Options
    setFloatingLabel(field.uiOptions?.floatingLabel || false);
    setFilled(field.uiOptions?.filled || false);
    setShowIcon(field.uiOptions?.showIcon || false);
    setInline(field.uiOptions?.inline || false);
    setMultipleMonths(field.uiOptions?.multipleMonths || null);
    setShowButtons(field.uiOptions?.showButtons || false);
    setShowTime(field.uiOptions?.showTime || false);
    setAutoResize(field.uiOptions?.autoResize || false);
    setMultiple(field.uiOptions?.multiple || false);
    setCheckboxSelection(field.uiOptions?.checkboxSelection || false);
    setFilterable(field.uiOptions?.filterable || false);
    setShowClear(field.uiOptions?.showClear || false);
    setRange(field.uiOptions?.range || false);
    setCount(field.uiOptions?.count || 5);
    setAllowCancel(field.uiOptions?.allowCancel !== false);
    setTriggers(field.uiOptions?.triggers?.join(',') || '@');
    setDateFormat(field.uiOptions?.dateFormat || 'MM/dd/yyyy');
    setMonthsOnly(field.uiOptions?.monthsOnly || false);
    setOptional(field.uiOptions?.optional || false);
    setSlotChar(field.uiOptions?.slotChar || '_');
  }, [field]);
  
  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Field name is required');
      return;
    }
    
    if (!label.trim()) {
      toast.error('Field label is required');
      return;
    }
    
    const validation = {
      required: isRequired,
      ...(minLength ? { min: parseInt(minLength, 10) } : {}),
      ...(maxLength ? { max: parseInt(maxLength, 10) } : {}),
      ...(pattern ? { pattern } : {}),
    };
    
    const uiOptions = {
      ...(floatingLabel ? { floatingLabel } : {}),
      ...(filled ? { filled } : {}),
      ...(showIcon ? { showIcon } : {}),
      ...(inline ? { inline } : {}),
      ...(multipleMonths ? { multipleMonths } : {}),
      ...(showButtons ? { showButtons } : {}),
      ...(showTime ? { showTime } : {}),
      ...(autoResize ? { autoResize } : {}),
      ...(multiple ? { multiple } : {}),
      ...(checkboxSelection ? { checkboxSelection } : {}),
      ...(filterable ? { filterable } : {}),
      ...(showClear ? { showClear } : {}),
      ...(range ? { range } : {}),
      ...(count !== 5 ? { count } : {}),
      ...(allowCancel !== true ? { allowCancel } : {}),
      ...(triggers !== '@' ? { triggers: triggers.split(',') } : {}),
      ...(dateFormat !== 'MM/dd/yyyy' ? { dateFormat } : {}),
      ...(monthsOnly ? { monthsOnly } : {}),
      ...(optional ? { optional } : {}),
      ...(slotChar !== '_' ? { slotChar } : {}),
    };
    
    updateField(contentTypeId, field.id, {
      name,
      label,
      type,
      description,
      placeholder,
      defaultValue,
      validation,
      isHidden,
      options,
      uiOptions,
      ...(field._parentFieldId ? { 
        _parentFieldId: field._parentFieldId,
        _subfieldIndex: field._subfieldIndex
      } : {})
    });
    
    toast.success('Field updated successfully!');
    onClose();
  };
  
  const handleDelete = () => {
    deleteField(contentTypeId, field.id);
    setShowDeleteDialog(false);
    toast.success('Field deleted successfully!');
    onClose();
  };
  
  const handleNewOption = () => {
    const newOption = {
      label: `Option ${options.length + 1}`,
      value: `option${options.length + 1}`,
      disabled: false
    };
    setOptions([...options, newOption]);
  };
  
  const handleOptionChange = (index: number, key: 'label' | 'value' | 'disabled', value: string | boolean) => {
    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      [key]: value
    };
    setOptions(newOptions);
  };
  
  const handleDeleteOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };
  
  const supportsOptions = ['dropdown', 'radio', 'selectbutton', 'multistatecheckbox'].includes(type);
  
  const fieldTypeOptions: { value: FieldType; label: string }[] = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
    { value: 'date', label: 'Date' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'file', label: 'File' },
    { value: 'toggle', label: 'Toggle' },
    { value: 'slider', label: 'Slider' },
    { value: 'color', label: 'Color' },
    { value: 'component', label: 'Component' },
    // Advanced fields
    { value: 'calendar', label: 'Calendar' },
    { value: 'inputgroup', label: 'Input Group' },
    { value: 'inputmask', label: 'Input Mask' },
    { value: 'inputswitch', label: 'Input Switch' },
    { value: 'tristatecheckbox', label: 'Tri-State Checkbox' },
    { value: 'inputotp', label: 'OTP Input' },
    { value: 'treeselect', label: 'Tree Select' },
    { value: 'mentionbox', label: 'Mention Box' },
    { value: 'selectbutton', label: 'Select Button' },
    { value: 'rating', label: 'Rating' },
    { value: 'multistatecheckbox', label: 'Multi-State Checkbox' },
  ];
  
  // Get the UI options for the current field type
  const getUIOptionsForType = () => {
    switch (type) {
      case 'text':
      case 'textarea':
      case 'number':
      case 'email':
      case 'password':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Floating Label</Label>
              <Switch checked={floatingLabel} onCheckedChange={setFloatingLabel} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Filled Style</Label>
              <Switch checked={filled} onCheckedChange={setFilled} />
            </div>
          </div>
        );
        
      case 'calendar':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Show Icon</Label>
              <Switch checked={showIcon} onCheckedChange={setShowIcon} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Inline Display</Label>
              <Switch checked={inline} onCheckedChange={setInline} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Buttons</Label>
              <Switch checked={showButtons} onCheckedChange={setShowButtons} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Time</Label>
              <Switch checked={showTime} onCheckedChange={setShowTime} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Date Range</Label>
              <Switch checked={range} onCheckedChange={setRange} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Months Only</Label>
              <Switch checked={monthsOnly} onCheckedChange={setMonthsOnly} />
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Input 
                value={dateFormat} 
                onChange={(e) => setDateFormat(e.target.value)}
                placeholder="MM/dd/yyyy"
              />
            </div>
            <div className="space-y-2">
              <Label>Multiple Months</Label>
              <Input 
                type="number" 
                value={multipleMonths || ''} 
                onChange={(e) => setMultipleMonths(e.target.value ? parseInt(e.target.value, 10) : null)}
                placeholder="1"
              />
            </div>
          </div>
        );
        
      case 'inputmask':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Optional</Label>
              <Switch checked={optional} onCheckedChange={setOptional} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Floating Label</Label>
              <Switch checked={floatingLabel} onCheckedChange={setFloatingLabel} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Filled Style</Label>
              <Switch checked={filled} onCheckedChange={setFilled} />
            </div>
            <div className="space-y-2">
              <Label>Slot Character</Label>
              <Input 
                value={slotChar} 
                onChange={(e) => setSlotChar(e.target.value)}
                placeholder="_"
                maxLength={1}
              />
            </div>
          </div>
        );
        
      case 'treeselect':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Multiple Selection</Label>
              <Switch checked={multiple} onCheckedChange={setMultiple} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Checkbox Selection</Label>
              <Switch checked={checkboxSelection} onCheckedChange={setCheckboxSelection} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Filterable</Label>
              <Switch checked={filterable} onCheckedChange={setFilterable} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Clear Button</Label>
              <Switch checked={showClear} onCheckedChange={setShowClear} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Floating Label</Label>
              <Switch checked={floatingLabel} onCheckedChange={setFloatingLabel} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Filled Style</Label>
              <Switch checked={filled} onCheckedChange={setFilled} />
            </div>
          </div>
        );
        
      case 'mentionbox':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto Resize</Label>
              <Switch checked={autoResize} onCheckedChange={setAutoResize} />
            </div>
            <div className="space-y-2">
              <Label>Triggers</Label>
              <Input 
                value={triggers} 
                onChange={(e) => setTriggers(e.target.value)}
                placeholder="@,#,/"
              />
              <p className="text-xs text-muted-foreground">Comma-separated trigger characters</p>
            </div>
          </div>
        );
        
      case 'selectbutton':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Multiple Selection</Label>
              <Switch checked={multiple} onCheckedChange={setMultiple} />
            </div>
          </div>
        );
        
      case 'rating':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Allow Cancel</Label>
              <Switch checked={allowCancel} onCheckedChange={setAllowCancel} />
            </div>
            <div className="space-y-2">
              <Label>Stars Count</Label>
              <Input 
                type="number" 
                value={count} 
                onChange={(e) => setCount(parseInt(e.target.value || '5', 10))}
                min={1}
                max={10}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">Field Configuration</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            <div className="border rounded-md shadow-sm">
              <Tabs defaultValue="basic" value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
                  <TabsTrigger value="validation" className="flex-1">Validation</TabsTrigger>
                  <TabsTrigger value="uiOptions" className="flex-1">UI Options</TabsTrigger>
                  <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
                </TabsList>
                
                <div className="p-4">
                  <TabsContent value="basic" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="name">API Name</Label>
                      <Input 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter field name"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is used in API and database
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="label">Display Label</Label>
                      <Input 
                        id="label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="Enter field label"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is shown to users in forms
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Field Type</Label>
                      <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value as FieldType)}
                        className="w-full border border-input rounded-md p-2"
                      >
                        {fieldTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea 
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter field description"
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground">
                        Help text shown to users
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="placeholder">Placeholder (Optional)</Label>
                      <Input 
                        id="placeholder"
                        value={placeholder}
                        onChange={(e) => setPlaceholder(e.target.value)}
                        placeholder="Enter field placeholder"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultValue">Default Value (Optional)</Label>
                      <Input 
                        id="defaultValue"
                        value={defaultValue}
                        onChange={(e) => setDefaultValue(e.target.value)}
                        placeholder="Enter default value"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="validation" className="mt-0">
                    <div className="py-4">
                      <h3 className="text-lg font-medium mb-4">Validation Rules</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Required</Label>
                            <p className="text-sm text-muted-foreground">Field must have a value</p>
                          </div>
                          <Switch 
                            checked={isRequired} 
                            onCheckedChange={setIsRequired} 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="minLength">Min Length</Label>
                            <Input 
                              id="minLength"
                              type="number"
                              value={minLength}
                              onChange={(e) => setMinLength(e.target.value)}
                              placeholder="Minimum length"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="maxLength">Max Length</Label>
                            <Input 
                              id="maxLength"
                              type="number"
                              value={maxLength}
                              onChange={(e) => setMaxLength(e.target.value)}
                              placeholder="Maximum length"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pattern">Regex Pattern</Label>
                          <Input 
                            id="pattern"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            placeholder="Regular expression pattern"
                          />
                          <p className="text-xs text-muted-foreground">
                            Value must match this pattern
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="uiOptions" className="mt-0">
                    <div className="py-4">
                      <h3 className="text-lg font-medium mb-4">UI Display Options</h3>
                      {getUIOptionsForType()}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="mt-0">
                    <div className="py-4 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Hide in UI</Label>
                          <p className="text-sm text-muted-foreground">
                            Field will not be visible in the user interface
                          </p>
                        </div>
                        <Switch 
                          checked={isHidden} 
                          onCheckedChange={setIsHidden} 
                        />
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
            
            {supportsOptions && (
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Options</h3>
                  <Button variant="outline" size="sm" onClick={handleNewOption}>
                    Add Option
                  </Button>
                </div>
                
                {options.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Label</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="w-[120px]">Disabled</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {options.map((option, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Input 
                              value={option.label} 
                              onChange={(e) => handleOptionChange(index, 'label', e.target.value)} 
                              placeholder="Label"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={option.value} 
                              onChange={(e) => handleOptionChange(index, 'value', e.target.value)} 
                              placeholder="Value"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch 
                              checked={option.disabled || false} 
                              onCheckedChange={(checked) => handleOptionChange(index, 'disabled', checked)} 
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteOption(index)}>
                              <Trash size={16} className="text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No options defined. Click "Add Option" to create some.
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(true)} className="text-destructive">
            Delete
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
      
      <Dialog open={showRequiredWarning} onOpenChange={setShowRequiredWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Field is Required</DialogTitle>
            <DialogDescription>
              This field is marked as required. If you delete it, it will affect existing content and may cause validation errors.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequiredWarning(false)}>Cancel</Button>
            <Button 
              variant="destructive"
              onClick={() => {
                setShowRequiredWarning(false);
                setShowDeleteDialog(true);
              }}
            >
              Continue Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this field? This action cannot be undone and may affect existing content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
