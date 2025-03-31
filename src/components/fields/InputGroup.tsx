
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Addon {
  position: 'left' | 'right';
  content: string;
  type?: 'text' | 'button';
  onClick?: () => void;
}

interface InputGroupProps {
  id: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  description?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  addons?: Addon[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  id,
  label,
  value = '',
  onChange,
  description,
  placeholder,
  prefix,
  suffix,
  addons = [],
  disabled = false,
  required = false,
  error,
}) => {
  const [inputValue, setInputValue] = useState(value);
  
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  const leftAddons = [...(prefix ? [{ position: 'left', content: prefix, type: 'text' }] : []), 
                     ...addons.filter(addon => addon.position === 'left')];
                     
  const rightAddons = [...(suffix ? [{ position: 'right', content: suffix, type: 'text' }] : []),
                      ...addons.filter(addon => addon.position === 'right')];
  
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="flex">
        {leftAddons.map((addon, index) => (
          addon.type === 'button' ? (
            <Button
              key={`left-${index}`}
              onClick={addon.onClick}
              disabled={disabled}
              className="rounded-r-none"
              variant="secondary"
            >
              {addon.content}
            </Button>
          ) : (
            <div 
              key={`left-${index}`}
              className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-gray-50 text-gray-500"
            >
              {addon.content}
            </div>
          )
        ))}
        
        <Input
          id={id}
          name={id}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            error ? "border-red-500" : "",
            leftAddons.length > 0 ? "rounded-l-none" : "",
            rightAddons.length > 0 ? "rounded-r-none" : ""
          )}
        />
        
        {rightAddons.map((addon, index) => (
          addon.type === 'button' ? (
            <Button
              key={`right-${index}`}
              onClick={addon.onClick}
              disabled={disabled}
              className="rounded-l-none"
              variant="secondary"
            >
              {addon.content}
            </Button>
          ) : (
            <div 
              key={`right-${index}`}
              className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-gray-50 text-gray-500"
            >
              {addon.content}
            </div>
          )
        ))}
      </div>
      
      {description && (
        <FormDescription className="text-xs text-gray-500">
          {description}
        </FormDescription>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};
