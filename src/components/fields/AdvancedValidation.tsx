
import React, { useState } from 'react';
import { Field, ValidationOptions } from '@/stores/cmsStore';
import { InputGroup } from './InputGroup';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  AlertCircle, 
  FileText, 
  AtSign, 
  Link, 
  Hash,
  Fingerprint,
  Ban
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface AdvancedValidationProps {
  field: Field;
  onUpdate: (validation: ValidationOptions) => void;
}

export const AdvancedValidation: React.FC<AdvancedValidationProps> = ({ field, onUpdate }) => {
  const [validation, setValidation] = useState<ValidationOptions>(field.validation || {});
  
  const handleUpdateValidation = (updates: Partial<ValidationOptions>) => {
    const updatedValidation = { ...validation, ...updates };
    setValidation(updatedValidation);
    onUpdate(updatedValidation);
  };
  
  const getValidationFields = () => {
    // Common validation for all field types
    const common = (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="required" 
            checked={validation.required || false}
            onCheckedChange={(checked) => 
              handleUpdateValidation({ required: checked === true })
            }
          />
          <Label htmlFor="required" className="font-normal cursor-pointer flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Required
          </Label>
        </div>
      </div>
    );
    
    // Fields specific to text inputs
    if (field.type === 'text' || field.type === 'textarea' || field.type === 'email' || field.type === 'password') {
      return (
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="format">Format</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            {common}
            
            <InputGroup 
              label="Min Length" 
              icon={<FileText className="h-4 w-4" />}
            >
              <Input
                type="number"
                min="0"
                placeholder="Minimum length"
                value={validation.minLength || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  handleUpdateValidation({ minLength: value });
                }}
              />
            </InputGroup>
            
            <InputGroup 
              label="Max Length" 
              icon={<FileText className="h-4 w-4" />}
            >
              <Input
                type="number"
                min="0"
                placeholder="Maximum length"
                value={validation.maxLength || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  handleUpdateValidation({ maxLength: value });
                }}
              />
            </InputGroup>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="unique" 
                checked={validation.unique || false}
                onCheckedChange={(checked) => 
                  handleUpdateValidation({ unique: checked === true })
                }
              />
              <Label htmlFor="unique" className="font-normal cursor-pointer flex items-center gap-1.5">
                <Fingerprint className="h-4 w-4 text-green-500" />
                Unique Value
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="nullable" 
                checked={validation.nullable === false}
                onCheckedChange={(checked) => 
                  handleUpdateValidation({ nullable: !checked })
                }
              />
              <Label htmlFor="nullable" className="font-normal cursor-pointer flex items-center gap-1.5">
                <Ban className="h-4 w-4 text-red-500" />
                Not Nullable
              </Label>
            </div>
          </TabsContent>
          
          <TabsContent value="format" className="space-y-4 pt-4">
            {field.type === 'email' && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="email" 
                  checked={validation.email || false}
                  onCheckedChange={(checked) => 
                    handleUpdateValidation({ email: checked === true })
                  }
                />
                <Label htmlFor="email" className="font-normal cursor-pointer flex items-center gap-1.5">
                  <AtSign className="h-4 w-4 text-blue-500" />
                  Validate Email Format
                </Label>
              </div>
            )}
            
            <InputGroup 
              label="Pattern" 
              icon={<Hash className="h-4 w-4" />}
            >
              <Input
                placeholder="Regular expression pattern"
                value={validation.pattern || ''}
                onChange={(e) => handleUpdateValidation({ pattern: e.target.value })}
              />
            </InputGroup>
            
            <InputGroup 
              label="Pattern Message" 
              icon={<AlertCircle className="h-4 w-4" />}
            >
              <Input
                placeholder="Error message for pattern"
                value={validation.patternMessage || ''}
                onChange={(e) => handleUpdateValidation({ patternMessage: e.target.value })}
              />
            </InputGroup>
          </TabsContent>
        </Tabs>
      );
    }
    
    // Fields specific to number inputs
    if (field.type === 'number') {
      return (
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            {common}
            
            <InputGroup 
              label="Min Value" 
              icon={<FileText className="h-4 w-4" />}
            >
              <Input
                type="number"
                placeholder="Minimum value"
                value={validation.minValue !== undefined ? validation.minValue : ''}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  handleUpdateValidation({ minValue: value });
                }}
              />
            </InputGroup>
            
            <InputGroup 
              label="Max Value" 
              icon={<FileText className="h-4 w-4" />}
            >
              <Input
                type="number"
                placeholder="Maximum value"
                value={validation.maxValue !== undefined ? validation.maxValue : ''}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  handleUpdateValidation({ maxValue: value });
                }}
              />
            </InputGroup>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="unique" 
                checked={validation.unique || false}
                onCheckedChange={(checked) => 
                  handleUpdateValidation({ unique: checked === true })
                }
              />
              <Label htmlFor="unique" className="font-normal cursor-pointer flex items-center gap-1.5">
                <Fingerprint className="h-4 w-4 text-green-500" />
                Unique Value
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="nullable" 
                checked={validation.nullable === false}
                onCheckedChange={(checked) => 
                  handleUpdateValidation({ nullable: !checked })
                }
              />
              <Label htmlFor="nullable" className="font-normal cursor-pointer flex items-center gap-1.5">
                <Ban className="h-4 w-4 text-red-500" />
                Not Nullable
              </Label>
            </div>
          </TabsContent>
        </Tabs>
      );
    }
    
    // Fields specific to file inputs
    if (field.type === 'file') {
      return (
        <div className="space-y-4">
          {common}
          
          <InputGroup 
            label="Max File Size (MB)" 
            icon={<FileText className="h-4 w-4" />}
          >
            <Input
              type="number"
              min="0"
              placeholder="Maximum file size in MB"
              value={validation.fileSize || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : undefined;
                handleUpdateValidation({ fileSize: value });
              }}
            />
          </InputGroup>
          
          <InputGroup 
            label="Allowed File Types" 
            icon={<FileText className="h-4 w-4" />}
          >
            <Input
              placeholder="e.g., .jpg, .pdf, .png"
              value={validation.fileType ? validation.fileType.join(', ') : ''}
              onChange={(e) => {
                const types = e.target.value
                  .split(',')
                  .map(t => t.trim())
                  .filter(t => t !== '');
                handleUpdateValidation({ fileType: types.length > 0 ? types : undefined });
              }}
            />
          </InputGroup>
        </div>
      );
    }
    
    // Default for other field types
    return common;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Validation Rules</CardTitle>
      </CardHeader>
      <CardContent>
        {getValidationFields()}
      </CardContent>
    </Card>
  );
};
