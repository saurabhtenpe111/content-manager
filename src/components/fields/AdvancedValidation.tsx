
import React, { useState } from 'react';
import { Field, FieldType } from '@/stores/cmsStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Settings, 
  FingerPrint, 
  Check, 
  X, 
  AlertCircle,
  Type,
  Hash
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';

interface ValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  patternMessage?: string;
  unique?: boolean;
  nullable?: boolean;
  indexed?: boolean;
  defaultValue?: any;
  email?: boolean;
  url?: boolean;
  dateRange?: {
    min?: string;
    max?: string;
  };
  fileSize?: number;
  fileType?: string[];
  decimalPlaces?: number;
}

interface AdvancedValidationProps {
  field: Field;
  onChange: (validation: ValidationOptions) => void;
}

export const AdvancedValidation: React.FC<AdvancedValidationProps> = ({ field, onChange }) => {
  const validation = field.validation || {};
  const [activeTab, setActiveTab] = useState("validation");

  // Helper function to update a validation property
  const updateValidation = (key: string, value: any) => {
    const updatedValidation = { ...validation, [key]: value };
    onChange(updatedValidation);
  };

  // Get field-specific validation options based on field type
  const getFieldValidationOptions = () => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minLength">Min Length</Label>
                <Input
                  id="minLength"
                  type="number"
                  min={0}
                  value={validation.minLength || ''}
                  onChange={(e) => updateValidation('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLength">Max Length</Label>
                <Input
                  id="maxLength"
                  type="number"
                  min={0}
                  value={validation.maxLength || ''}
                  onChange={(e) => updateValidation('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="255"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pattern">Pattern (RegEx)</Label>
              <Input
                id="pattern"
                value={validation.pattern || ''}
                onChange={(e) => updateValidation('pattern', e.target.value)}
                placeholder="e.g. ^[a-zA-Z0-9]+$"
              />
              <p className="text-xs text-muted-foreground">
                Regular expression pattern the value must match
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patternMessage">Pattern Error Message</Label>
              <Input
                id="patternMessage"
                value={validation.patternMessage || ''}
                onChange={(e) => updateValidation('patternMessage', e.target.value)}
                placeholder="Please enter a valid value"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="email-validation"
                checked={validation.email || false}
                onCheckedChange={(checked) => updateValidation('email', checked)}
              />
              <Label htmlFor="email-validation">Validate as email address</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="url-validation"
                checked={validation.url || false}
                onCheckedChange={(checked) => updateValidation('url', checked)}
              />
              <Label htmlFor="url-validation">Validate as URL</Label>
            </div>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minValue">Min Value</Label>
                <Input
                  id="minValue"
                  type="number"
                  value={validation.minValue || ''}
                  onChange={(e) => updateValidation('minValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxValue">Max Value</Label>
                <Input
                  id="maxValue"
                  type="number"
                  value={validation.maxValue || ''}
                  onChange={(e) => updateValidation('maxValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="decimalPlaces">Decimal Places</Label>
              <Select
                value={validation.decimalPlaces?.toString() || ''}
                onValueChange={(value) => updateValidation('decimalPlaces', parseInt(value))}
              >
                <SelectTrigger id="decimalPlaces">
                  <SelectValue placeholder="Select decimal places" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 (Integer)</SelectItem>
                  <SelectItem value="1">1 decimal place</SelectItem>
                  <SelectItem value="2">2 decimal places</SelectItem>
                  <SelectItem value="3">3 decimal places</SelectItem>
                  <SelectItem value="4">4 decimal places</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minDate">Min Date</Label>
                <Input
                  id="minDate"
                  type="date"
                  value={validation.dateRange?.min || ''}
                  onChange={(e) => updateValidation('dateRange', { 
                    ...validation.dateRange || {}, 
                    min: e.target.value 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDate">Max Date</Label>
                <Input
                  id="maxDate"
                  type="date"
                  value={validation.dateRange?.max || ''}
                  onChange={(e) => updateValidation('dateRange', { 
                    ...validation.dateRange || {}, 
                    max: e.target.value 
                  })}
                />
              </div>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileSize">Max File Size (MB)</Label>
              <Input
                id="fileSize"
                type="number"
                min={0}
                step={0.1}
                value={validation.fileSize || ''}
                onChange={(e) => updateValidation('fileSize', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label>Allowed File Types</Label>
              <div className="grid grid-cols-2 gap-2">
                {['image/*', 'application/pdf', 'text/*', 'audio/*', 'video/*', '.doc,.docx'].map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`file-type-${type}`}
                      checked={(validation.fileType || []).includes(type)}
                      onCheckedChange={(checked) => {
                        const currentTypes = validation.fileType || [];
                        const newTypes = checked
                          ? [...currentTypes, type]
                          : currentTypes.filter(t => t !== type);
                        updateValidation('fileType', newTypes);
                      }}
                    />
                    <Label htmlFor={`file-type-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Database options for all field types
  const getDatabaseOptions = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nullable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="nullable"
                checked={validation.nullable || false}
                onCheckedChange={(checked) => updateValidation('nullable', checked)}
              />
              <Label htmlFor="nullable">Allow NULL value</Label>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="unique"
                checked={validation.unique || false}
                onCheckedChange={(checked) => updateValidation('unique', checked)}
              />
              <Label htmlFor="unique">Value has to be unique</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Index</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="indexed"
              checked={validation.indexed || false}
              onCheckedChange={(checked) => updateValidation('indexed', checked)}
            />
            <Label htmlFor="indexed">Field is indexed</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Default Value</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={validation.defaultValue !== undefined ? String(validation.defaultValue) : ''}
            onChange={(e) => updateValidation('defaultValue', e.target.value || null)}
            placeholder="NULL"
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="field-required"
          checked={validation.required || false}
          onCheckedChange={(checked) => updateValidation('required', checked)}
        />
        <Label htmlFor="field-required" className="font-medium">
          Required field
        </Label>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="validation" className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Validation
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="validation" className="pt-4">
          {getFieldValidationOptions()}
        </TabsContent>
        
        <TabsContent value="database" className="pt-4">
          {getDatabaseOptions()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
