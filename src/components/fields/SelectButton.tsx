
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface SelectButtonOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export interface SelectButtonProps {
  label?: string;
  options: SelectButtonOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  template?: (option: SelectButtonOption) => React.ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  id?: string;
}

export const SelectButton = React.forwardRef<HTMLDivElement, SelectButtonProps>(({
  label,
  options = [],
  value,
  onChange,
  multiple = false,
  template,
  invalid = false,
  disabled = false,
  required = false,
  description,
  error,
  className,
  id,
  ...props
}, ref) => {
  const [selectedValue, setSelectedValue] = useState<string | string[]>(
    multiple ? (Array.isArray(value) ? value : []) : (value || '')
  );
  
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);
  
  const handleValueChange = (newValue: string | string[]) => {
    setSelectedValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };
  
  const uniqueId = id || `select-button-${label?.replace(/\s/g, '-').toLowerCase()}`;
  
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {label && (
        <Label htmlFor={uniqueId} className={cn(invalid && "text-destructive")}>
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <ToggleGroup
        type={multiple ? "multiple" : "single"}
        value={selectedValue as any}
        onValueChange={handleValueChange}
        className={cn(
          "flex flex-wrap gap-1",
          invalid && "ring-1 ring-destructive rounded"
        )}
        disabled={disabled}
        id={uniqueId}
        aria-label={label}
        aria-invalid={invalid}
        aria-required={required}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className={cn(
              "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
              option.disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled || option.disabled}
            aria-label={typeof option.label === 'string' ? option.label : undefined}
          >
            {template ? template(option) : option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      
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

SelectButton.displayName = "SelectButton";
