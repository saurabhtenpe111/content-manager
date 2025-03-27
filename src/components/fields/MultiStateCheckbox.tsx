
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export interface MultiStateCheckboxProps {
  label?: string;
  value?: any;
  onChange?: (value: any) => void;
  options?: any[];
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  id?: string;
  renderOption?: (option: any) => React.ReactNode;
}

export const MultiStateCheckbox = React.forwardRef<HTMLButtonElement, MultiStateCheckboxProps>(({
  label,
  value,
  onChange,
  options = [],
  invalid = false,
  disabled = false,
  required = false,
  description,
  error,
  className,
  id,
  renderOption,
  ...props
}, ref) => {
  const [currentValue, setCurrentValue] = useState<any>(value);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
      const index = options.findIndex(option => 
        typeof option === 'object' ? option.value === value : option === value
      );
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [value, options]);
  
  const handleClick = () => {
    if (disabled) return;
    
    const nextIndex = (currentIndex + 1) % options.length;
    const nextValue = typeof options[nextIndex] === 'object' ? 
      options[nextIndex].value : options[nextIndex];
    
    setCurrentIndex(nextIndex);
    setCurrentValue(nextValue);
    
    if (onChange) {
      onChange(nextValue);
    }
  };
  
  const uniqueId = id || `multistate-${label?.replace(/\s/g, '-').toLowerCase()}`;
  const currentOption = options[currentIndex];
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <button
          ref={ref}
          type="button"
          role="checkbox"
          id={uniqueId}
          className={cn(
            "h-5 w-5 rounded-sm border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "flex items-center justify-center",
            invalid && "border-destructive",
            disabled && "cursor-not-allowed opacity-50"
          )}
          disabled={disabled}
          onClick={handleClick}
          aria-checked={!!currentValue}
          aria-invalid={invalid}
          aria-required={required}
          {...props}
        >
          {renderOption ? (
            renderOption(currentOption)
          ) : (
            <div className="text-xs">
              {typeof currentOption === 'object' ? 
                (currentOption.label || currentOption.value) : 
                currentOption}
            </div>
          )}
        </button>
        
        {label && (
          <Label 
            htmlFor={uniqueId}
            className={cn(
              disabled && "cursor-not-allowed opacity-50",
              invalid && "text-destructive"
            )}
            onClick={disabled ? undefined : handleClick}
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

MultiStateCheckbox.displayName = "MultiStateCheckbox";
