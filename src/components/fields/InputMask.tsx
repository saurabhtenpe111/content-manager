
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';

interface InputMaskProps {
  id: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  description?: string;
  placeholder?: string;
  mask?: string; // e.g. "999-99-9999" for SSN, "(999) 999-9999" for phone
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export const InputMask: React.FC<InputMaskProps> = ({
  id,
  label,
  value = '',
  onChange,
  description,
  placeholder,
  mask = '',
  disabled = false,
  required = false,
  error,
}) => {
  const [inputValue, setInputValue] = useState(value);
  
  useEffect(() => {
    setInputValue(formatValue(value, mask));
  }, [value, mask]);
  
  // Basic mask formatter function
  const formatValue = (val: string, mask: string): string => {
    if (!mask || !val) return val;
    
    let result = '';
    let valIndex = 0;
    
    for (let i = 0; i < mask.length && valIndex < val.length; i++) {
      const maskChar = mask[i];
      
      if (maskChar === '9') {
        // Only allow digits
        if (/\d/.test(val[valIndex])) {
          result += val[valIndex];
        }
        valIndex++;
      } else if (maskChar === 'a') {
        // Only allow letters
        if (/[a-zA-Z]/.test(val[valIndex])) {
          result += val[valIndex];
        }
        valIndex++;
      } else if (maskChar === '*') {
        // Allow any character
        result += val[valIndex];
        valIndex++;
      } else {
        // Add mask character as is
        result += maskChar;
        
        // Skip the value character if it matches the mask character
        if (val[valIndex] === maskChar) {
          valIndex++;
        }
      }
    }
    
    return result;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatValue(rawValue, mask);
    
    setInputValue(formattedValue);
    if (onChange) {
      onChange(formattedValue);
    }
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Input
        id={id}
        name={id}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || mask}
        disabled={disabled}
        className={error ? "border-red-500" : ""}
      />
      
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
