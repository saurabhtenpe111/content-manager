
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Check, Minus } from "lucide-react";

export type CheckboxState = boolean | null;

export interface TriStateCheckboxProps {
  label?: string;
  value?: CheckboxState;
  onChange?: (value: CheckboxState) => void;
  filled?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

export const TriStateCheckbox = React.forwardRef<HTMLButtonElement, TriStateCheckboxProps>(({
  label,
  value = null,
  onChange,
  filled = false,
  invalid = false,
  disabled = false,
  required = false,
  description,
  error,
  className,
  id,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const [checkState, setCheckState] = useState<CheckboxState>(value);
  
  useEffect(() => {
    setCheckState(value);
  }, [value]);
  
  const handleClick = () => {
    if (disabled) return;
    
    let nextState: CheckboxState;
    if (checkState === null) {
      nextState = true;
    } else if (checkState === true) {
      nextState = false;
    } else {
      nextState = null;
    }
    
    setCheckState(nextState);
    
    if (onChange) {
      onChange(nextState);
    }
  };
  
  const uniqueId = id || `tristate-${label?.replace(/\s/g, '-').toLowerCase()}`;
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <button
          ref={ref}
          type="button"
          role="checkbox"
          id={uniqueId}
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            filled && "bg-muted",
            checkState === true && "bg-primary text-primary-foreground",
            checkState === null && "bg-primary text-primary-foreground",
            invalid && "border-destructive",
            disabled && "cursor-not-allowed opacity-50"
          )}
          disabled={disabled}
          onClick={handleClick}
          aria-checked={checkState === null ? "mixed" : checkState}
          aria-label={ariaLabel || label}
          aria-invalid={invalid}
          aria-required={required}
          {...props}
        >
          {checkState === true && (
            <Check className="h-3 w-3" />
          )}
          {checkState === null && (
            <Minus className="h-3 w-3" />
          )}
        </button>
        
        {label && (
          <Label 
            htmlFor={uniqueId}
            className={cn(
              disabled && "cursor-not-allowed opacity-50",
              invalid && "text-destructive"
            )}
            onClick={handleClick}
          >
            {label}{required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
      </div>
      
      {description && !error && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});

TriStateCheckbox.displayName = "TriStateCheckbox";
