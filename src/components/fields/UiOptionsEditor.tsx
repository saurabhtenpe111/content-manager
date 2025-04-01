
import React from 'react';
import { Field, FieldType } from '@/stores/cmsStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { Switch } from '@/components/ui/switch';

interface UiOptionsEditorProps {
  field: Field;
  onChange: (uiOptions: Record<string, any>) => void;
}

export const UiOptionsEditor: React.FC<UiOptionsEditorProps> = ({ 
  field, 
  onChange 
}) => {
  const uiOptions = field.uiOptions || {};
  
  const updateOption = (key: string, value: any) => {
    const updatedOptions = { ...uiOptions, [key]: value };
    onChange(updatedOptions);
  };
  
  // Specific UI options based on field type
  const renderFieldTypeOptions = () => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="size">Field Size</Label>
              <Select
                value={uiOptions.size || 'medium'}
                onValueChange={(value) => updateOption('size', value)}
              >
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select field size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="floatLabel"
                checked={uiOptions.floatLabel || false}
                onCheckedChange={(checked) => updateOption('floatLabel', !!checked)}
              />
              <Label htmlFor="floatLabel">Use floating label</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filled"
                checked={uiOptions.filled || false}
                onCheckedChange={(checked) => updateOption('filled', !!checked)}
              />
              <Label htmlFor="filled">Filled appearance</Label>
            </div>
          </div>
        );
          
      case 'number':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="format">Number Format</Label>
              <Select
                value={uiOptions.format || 'decimal'}
                onValueChange={(value) => updateOption('format', value)}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select number format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decimal">Decimal</SelectItem>
                  <SelectItem value="integer">Integer</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="percent">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {uiOptions.format === 'currency' && (
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={uiOptions.currency || 'USD'}
                  onValueChange={(value) => updateOption('currency', value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Select
                value={uiOptions.locale || 'en-US'}
                onValueChange={(value) => updateOption('locale', value)}
              >
                <SelectTrigger id="locale">
                  <SelectValue placeholder="Select locale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                  <SelectItem value="ja-JP">Japanese</SelectItem>
                  <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
                  <SelectItem value="ru-RU">Russian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="decimalPlaces">Decimal Places</Label>
              <Select
                value={String(uiOptions.decimalPlaces || 2)}
                onValueChange={(value) => updateOption('decimalPlaces', parseInt(value))}
              >
                <SelectTrigger id="decimalPlaces">
                  <SelectValue placeholder="Select decimal places" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Input Controls</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showButtons"
                    checked={uiOptions.showButtons || false}
                    onCheckedChange={(checked) => updateOption('showButtons', !!checked)}
                  />
                  <Label htmlFor="showButtons">Show increment/decrement buttons</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="verticalButtons"
                    checked={uiOptions.verticalButtons || false}
                    onCheckedChange={(checked) => updateOption('verticalButtons', !!checked)}
                  />
                  <Label htmlFor="verticalButtons">Vertical button layout</Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prefix">Prefix</Label>
                <Input 
                  id="prefix"
                  value={uiOptions.prefix || ''}
                  onChange={(e) => updateOption('prefix', e.target.value)}
                  placeholder="e.g. $"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="suffix">Suffix</Label>
                <Input 
                  id="suffix"
                  value={uiOptions.suffix || ''}
                  onChange={(e) => updateOption('suffix', e.target.value)}
                  placeholder="e.g. kg"
                />
              </div>
            </div>
          </div>
        );
      
      case 'date':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select
                value={uiOptions.dateFormat || 'MM/dd/yyyy'}
                onValueChange={(value) => updateOption('dateFormat', value)}
              >
                <SelectTrigger id="dateFormat">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                  <SelectItem value="MMMM d, yyyy">Month D, YYYY</SelectItem>
                  <SelectItem value="d MMMM yyyy">D Month YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showTime"
                checked={uiOptions.showTime || false}
                onCheckedChange={(checked) => updateOption('showTime', !!checked)}
              />
              <Label htmlFor="showTime">Include time picker</Label>
            </div>
            
            {uiOptions.showTime && (
              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <Select
                  value={uiOptions.timeFormat || 'hh:mm a'}
                  onValueChange={(value) => updateOption('timeFormat', value)}
                >
                  <SelectTrigger id="timeFormat">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hh:mm a">12-hour (03:30 PM)</SelectItem>
                    <SelectItem value="HH:mm">24-hour (15:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <p className="text-sm text-muted-foreground">
            No specific UI options available for this field type.
          </p>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base font-medium">Appearance</h3>
        
        <div className="space-y-2">
          <Label htmlFor="width">Field Width</Label>
          <Select
            value={uiOptions.width || 'full'}
            onValueChange={(value) => updateOption('width', value)}
          >
            <SelectTrigger id="width">
              <SelectValue placeholder="Select field width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width</SelectItem>
              <SelectItem value="1/2">Half Width</SelectItem>
              <SelectItem value="1/3">One Third</SelectItem>
              <SelectItem value="2/3">Two Thirds</SelectItem>
              <SelectItem value="1/4">One Quarter</SelectItem>
              <SelectItem value="3/4">Three Quarters</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hidden"
            checked={uiOptions.hidden || false}
            onCheckedChange={(checked) => updateOption('hidden', !!checked)}
          />
          <Label htmlFor="hidden">Hidden field (not visible in form)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="disabled"
            checked={uiOptions.disabled || false}
            onCheckedChange={(checked) => updateOption('disabled', !!checked)}
          />
          <Label htmlFor="disabled">Disabled (read-only in form)</Label>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-base font-medium">Type-specific Options</h3>
        {renderFieldTypeOptions()}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-base font-medium">Accessibility</h3>
        
        <div className="space-y-2">
          <Label htmlFor="ariaLabel">ARIA Label</Label>
          <Input 
            id="ariaLabel"
            value={uiOptions.ariaLabel || ''}
            onChange={(e) => updateOption('ariaLabel', e.target.value)}
            placeholder="Custom accessible label"
          />
          <p className="text-xs text-muted-foreground">
            Screen readers will use this text instead of the field label
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ariaDescription">ARIA Description</Label>
          <Input 
            id="ariaDescription"
            value={uiOptions.ariaDescription || ''}
            onChange={(e) => updateOption('ariaDescription', e.target.value)}
            placeholder="Custom accessible description"
          />
          <p className="text-xs text-muted-foreground">
            Additional description for screen readers
          </p>
        </div>
      </div>
    </div>
  );
};
