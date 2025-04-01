import React, { useState, useEffect } from 'react';
import { Field, ValidationOptions } from '@/stores/cmsStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputGroup } from '@/components/fields/InputGroup';
import { MinusCircle, Plus, Calendar, Hash, Asterisk, Mail, Link, Database, ShieldAlert } from 'lucide-react';

export interface AdvancedValidationProps {
  field: Field;
  onUpdate: (validation: ValidationOptions) => void;
}

export const AdvancedValidation: React.FC<AdvancedValidationProps> = ({ field, onUpdate }) => {
  const [validation, setValidation] = useState<ValidationOptions>(
    field.validation || { required: false }
  );
  
  useEffect(() => {
    onUpdate(validation);
  }, [validation, onUpdate]);
  
  const handleCheckboxChange = (key: string, checked: boolean) => {
    setValidation(prev => ({
      ...prev,
      [key]: checked,
    }));
  };
  
  const handleInputChange = (key: string, value: string | number) => {
    setValidation(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="basic">
        <TabsList className="w-full">
          <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
          <TabsTrigger value="database" className="flex-1">Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="required" 
              checked={validation.required || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange('required', checked === true)
              }
            />
            <Label htmlFor="required" className="cursor-pointer">Required field</Label>
          </div>
          
          {(field.type === 'text' || field.type === 'textarea' || field.type === 'password') && (
            <>
              <InputGroup
                label="Minimum length"
                icon={<MinusCircle size={16} />}
              >
                <Input
                  type="number"
                  min={0}
                  value={validation.minLength || ''}
                  onChange={(e) => handleInputChange('minLength', parseInt(e.target.value) || '')}
                  placeholder="0"
                  className="flex-1"
                />
              </InputGroup>
              
              <InputGroup
                label="Maximum length"
                icon={<Plus size={16} />}
              >
                <Input
                  type="number"
                  min={0}
                  value={validation.maxLength || ''}
                  onChange={(e) => handleInputChange('maxLength', parseInt(e.target.value) || '')}
                  placeholder="Unlimited"
                  className="flex-1"
                />
              </InputGroup>
            </>
          )}
          
          {field.type === 'number' && (
            <>
              <InputGroup
                label="Minimum value"
                icon={<MinusCircle size={16} />}
              >
                <Input
                  type="number"
                  value={validation.minValue !== undefined ? validation.minValue : ''}
                  onChange={(e) => handleInputChange('minValue', e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="No minimum"
                  className="flex-1"
                />
              </InputGroup>
              
              <InputGroup
                label="Maximum value"
                icon={<Plus size={16} />}
              >
                <Input
                  type="number"
                  value={validation.maxValue !== undefined ? validation.maxValue : ''}
                  onChange={(e) => handleInputChange('maxValue', e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="No maximum"
                  className="flex-1"
                />
              </InputGroup>
              
              {field.type === 'number' && (
                <InputGroup
                  label="Decimal places"
                  icon={<Hash size={16} />}
                >
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={validation.decimalPlaces || ''}
                    onChange={(e) => handleInputChange('decimalPlaces', parseInt(e.target.value) || '')}
                    placeholder="Integer only"
                    className="flex-1"
                  />
                </InputGroup>
              )}
            </>
          )}
          
          {field.type === 'date' && (
            <>
              <InputGroup
                label="Minimum date"
                icon={<Calendar size={16} />}
              >
                <Input
                  type="date"
                  value={validation.dateRange?.min || ''}
                  onChange={(e) => {
                    const dateRange = validation.dateRange || {};
                    setValidation(prev => ({
                      ...prev, 
                      dateRange: { 
                        ...dateRange, 
                        min: e.target.value 
                      }
                    }));
                  }}
                  className="flex-1"
                />
              </InputGroup>
              
              <InputGroup
                label="Maximum date"
                icon={<Calendar size={16} />}
              >
                <Input
                  type="date"
                  value={validation.dateRange?.max || ''}
                  onChange={(e) => {
                    const dateRange = validation.dateRange || {};
                    setValidation(prev => ({
                      ...prev, 
                      dateRange: { 
                        ...dateRange, 
                        max: e.target.value 
                      }
                    }));
                  }}
                  className="flex-1"
                />
              </InputGroup>
            </>
          )}
          
          {field.type === 'file' && (
            <>
              <InputGroup
                label="Maximum file size (KB)"
                icon={<Plus size={16} />}
              >
                <Input
                  type="number"
                  min={0}
                  value={validation.fileSize || ''}
                  onChange={(e) => handleInputChange('fileSize', parseInt(e.target.value) || '')}
                  placeholder="Unlimited"
                  className="flex-1"
                />
              </InputGroup>
              
              <div className="space-y-2">
                <Label className="block text-sm font-medium text-gray-700">
                  Allowed file types
                </Label>
                <div className="text-xs text-gray-500">
                  Comma separated list of file extensions without dots (e.g. jpg, png, pdf)
                </div>
                <Input
                  value={(validation.fileType || []).join(', ')}
                  onChange={(e) => {
                    const types = e.target.value.split(',').map(t => t.trim().toLowerCase());
                    setValidation(prev => ({
                      ...prev,
                      fileType: types.filter(Boolean)
                    }));
                  }}
                  placeholder="All file types"
                />
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4 pt-4">
          {(field.type === 'text' || field.type === 'textarea' || field.type === 'password') && (
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Validation pattern (RegEx)
              </Label>
              <Input
                value={validation.pattern || ''}
                onChange={(e) => handleInputChange('pattern', e.target.value)}
                placeholder="Regular expression pattern"
              />
              <div className="text-xs text-gray-500">
                Example: ^[a-zA-Z0-9]+$ for alphanumeric characters only
              </div>
              
              <Input
                value={validation.patternMessage || ''}
                onChange={(e) => handleInputChange('patternMessage', e.target.value)}
                placeholder="Error message for pattern validation"
                className="mt-2"
              />
            </div>
          )}
          
          {field.type === 'email' && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="email-validation" 
                checked={validation.email !== false}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('email', checked === true)
                }
              />
              <Label htmlFor="email-validation" className="cursor-pointer">Validate email format</Label>
            </div>
          )}
          
          {field.type === 'text' && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="url-validation" 
                checked={validation.url === true}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('url', checked === true)
                }
              />
              <Label htmlFor="url-validation" className="cursor-pointer">Validate as URL</Label>
            </div>
          )}
          
          <div className="space-y-2">
            <Label className="block text-sm font-medium text-gray-700">
              Default value
            </Label>
            {field.type === 'date' ? (
              <Input
                type="date"
                value={validation.defaultValue || ''}
                onChange={(e) => handleInputChange('defaultValue', e.target.value)}
              />
            ) : field.type === 'number' ? (
              <Input
                type="number"
                value={validation.defaultValue || ''}
                onChange={(e) => handleInputChange('defaultValue', e.target.value ? parseFloat(e.target.value) : '')}
                placeholder="Default value"
              />
            ) : (
              <Input
                type={field.type === 'password' ? 'password' : 'text'}
                value={validation.defaultValue || ''}
                onChange={(e) => handleInputChange('defaultValue', e.target.value)}
                placeholder="Default value"
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="nullable" 
              checked={validation.nullable !== false}
              onCheckedChange={(checked) => 
                handleCheckboxChange('nullable', checked === true)
              }
            />
            <Label htmlFor="nullable" className="cursor-pointer">Allow NULL values in database</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="unique" 
              checked={validation.unique === true}
              onCheckedChange={(checked) => 
                handleCheckboxChange('unique', checked === true)
              }
            />
            <Label htmlFor="unique" className="cursor-pointer">Values must be unique</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="indexed" 
              checked={validation.indexed === true}
              onCheckedChange={(checked) => 
                handleCheckboxChange('indexed', checked === true)
              }
            />
            <Label htmlFor="indexed" className="cursor-pointer">Create database index for this field</Label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
