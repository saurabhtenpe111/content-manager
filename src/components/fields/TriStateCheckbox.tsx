
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tri-state checkbox can have three states: null, false, true
type TriStateValue = null | boolean;

interface TriStateCheckboxProps {
  id: string;
  label?: string;
  value?: TriStateValue;
  onChange?: (value: TriStateValue) => void;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export const TriStateCheckbox: React.FC<TriStateCheckboxProps> = ({
  id,
  label,
  value = null,
  onChange,
  description,
  disabled = false,
  required = false,
  error,
}) => {
  const [checkboxState, setCheckboxState] = useState<TriStateValue>(value);
  
  useEffect(() => {
    setCheckboxState(value);
  }, [value]);
  
  const handleChange = () => {
    if (disabled) return;
    
    // Cycle through states: null -> true -> false -> null
    let nextState: TriStateValue;
    
    if (checkboxState === null) {
      nextState = true;
    } else if (checkboxState === true) {
      nextState = false;
    } else {
      nextState = null;
    }
    
    setCheckboxState(nextState);
    if (onChange) {
      onChange(nextState);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div 
          className={cn(
            "h-4 w-4 rounded border flex items-center justify-center", 
            {
              "border-primary": checkboxState !== null,
              "bg-primary": checkboxState === true,
              "bg-transparent": checkboxState === false,
              "bg-gray-300": checkboxState === null,
              "opacity-50 cursor-not-allowed": disabled,
              "border-red-500": !!error
            }
          )}
          onClick={handleChange}
        >
          {checkboxState === true && <Check className="h-3 w-3 text-white" />}
          {checkboxState === null && <Minus className="h-3 w-3 text-white" />}
        </div>
        
        {label && (
          <Label 
            htmlFor={id} 
            className={cn("text-sm font-medium", {
              "opacity-50": disabled,
              "cursor-pointer": !disabled
            })}
            onClick={handleChange}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
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
