
import React from 'react';
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export interface InputSwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

export const InputSwitch = React.forwardRef<HTMLButtonElement, InputSwitchProps>(({
  label,
  checked = false,
  onChange,
  disabled = false,
  invalid = false,
  required = false,
  description,
  error,
  className,
  id,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const handleCheckedChange = (value: boolean) => {
    if (onChange) {
      onChange(value);
    }
  };
  
  const uniqueId = id || `switch-${label?.replace(/\s/g, '-').toLowerCase()}`;
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <Label 
            htmlFor={uniqueId}
            className={cn(invalid && "text-destructive")}
          >
            {label}{required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <Switch
          ref={ref}
          id={uniqueId}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          className={cn(invalid && "border-destructive data-[state=checked]:bg-destructive")}
          aria-label={ariaLabel || label}
          aria-invalid={invalid}
          aria-required={required}
          {...props}
        />
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

InputSwitch.displayName = "InputSwitch";
