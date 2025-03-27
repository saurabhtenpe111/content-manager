
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface InputMaskProps {
  label?: string;
  mask?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  slotChar?: string;
  autoClear?: boolean;
  optional?: boolean;
  floatingLabel?: boolean;
  filled?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const InputMask = React.forwardRef<HTMLInputElement, InputMaskProps>(({
  label,
  mask = '',
  value = '',
  onChange,
  placeholder = '',
  slotChar = '_',
  autoClear = true,
  optional = false,
  floatingLabel = false,
  filled = false,
  disabled = false,
  invalid = false,
  required = false,
  description,
  error,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const [inputValue, setInputValue] = useState(value);
  const [focused, setFocused] = useState(false);
  
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const formatValue = (val: string, mask: string, slotChar: string): string => {
    if (!mask || !val) return val;
    
    let result = '';
    let valIndex = 0;
    
    for (let i = 0; i < mask.length && valIndex < val.length; i++) {
      const maskChar = mask[i];
      
      if (maskChar === '9') {
        // Only digits
        if (/\d/.test(val[valIndex])) {
          result += val[valIndex];
          valIndex++;
        } else {
          valIndex++;
          i--;
        }
      } else if (maskChar === 'a') {
        // Only letters
        if (/[a-zA-Z]/.test(val[valIndex])) {
          result += val[valIndex];
          valIndex++;
        } else {
          valIndex++;
          i--;
        }
      } else if (maskChar === '*') {
        // Any character
        result += val[valIndex];
        valIndex++;
      } else {
        // Fixed character in mask
        result += maskChar;
        if (val[valIndex] === maskChar) {
          valIndex++;
        }
      }
    }
    
    if (!optional) {
      // Fill the rest with slot characters
      while (result.length < mask.length) {
        const maskChar = mask[result.length];
        result += (maskChar === '9' || maskChar === 'a' || maskChar === '*') ? slotChar : maskChar;
      }
    }
    
    return result;
  };
  
  const unformatValue = (val: string, mask: string): string => {
    if (!mask || !val) return val;
    
    let result = '';
    for (let i = 0; i < val.length; i++) {
      const maskChar = mask[i];
      const valChar = val[i];
      
      if ((maskChar === '9' && /\d/.test(valChar)) || 
          (maskChar === 'a' && /[a-zA-Z]/.test(valChar)) || 
          (maskChar === '*' && valChar !== slotChar)) {
        result += valChar;
      } else if (valChar !== maskChar && valChar !== slotChar) {
        result += valChar;
      }
    }
    
    return result;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const unformatted = unformatValue(rawValue, mask);
    const formatted = formatValue(unformatted, mask, slotChar);
    
    setInputValue(formatted);
    
    if (onChange) {
      onChange(unformatted);
    }
  };
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  const handleBlur = () => {
    setFocused(false);
    
    if (autoClear && inputValue.includes(slotChar)) {
      setInputValue('');
      if (onChange) {
        onChange('');
      }
    }
  };
  
  const displayValue = inputValue ? formatValue(inputValue, mask, slotChar) : '';
  const uniqueId = id || `input-mask-${label?.replace(/\s/g, '-').toLowerCase()}`;
  
  return (
    <div className="space-y-2">
      {label && !floatingLabel && (
        <Label htmlFor={uniqueId}>
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className={cn("relative", floatingLabel && "pt-5")}>
        {floatingLabel && (
          <Label 
            htmlFor={uniqueId}
            className={cn(
              "absolute left-3 transition-all duration-150 pointer-events-none",
              (focused || displayValue) ? "text-xs top-0 text-primary" : "top-2.5 text-muted-foreground"
            )}
          >
            {label}{required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <Input
          ref={ref}
          id={uniqueId}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={!floatingLabel ? placeholder : ""}
          disabled={disabled}
          className={cn(
            className,
            filled && "bg-secondary",
            invalid && "border-destructive focus-visible:ring-destructive"
          )}
          aria-label={ariaLabel || label}
          aria-describedby={ariaDescribedBy || (error ? `${uniqueId}-error` : undefined)}
          aria-invalid={invalid}
          aria-required={required}
          {...props}
        />
      </div>
      
      {description && !error && (
        <p className="text-xs text-muted-foreground" id={`${uniqueId}-description`}>
          {description}
        </p>
      )}
      
      {error && (
        <p className="text-xs text-destructive" id={`${uniqueId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

InputMask.displayName = "InputMask";
