
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Star } from "lucide-react";

export interface RatingFieldProps {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  count?: number;
  allowCancel?: boolean;
  template?: (value: number, index: number) => React.ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  id?: string;
}

export const RatingField = React.forwardRef<HTMLDivElement, RatingFieldProps>(({
  label,
  value = 0,
  onChange,
  count = 5,
  allowCancel = true,
  template,
  readOnly = false,
  disabled = false,
  invalid = false,
  required = false,
  description,
  error,
  className,
  id,
  ...props
}, ref) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  const handleClick = (index: number) => {
    if (readOnly || disabled) return;
    
    let newValue = index + 1;
    if (allowCancel && value === newValue) {
      newValue = 0;
    }
    
    if (onChange) {
      onChange(newValue);
    }
  };
  
  const handleMouseEnter = (index: number) => {
    if (readOnly || disabled) return;
    setHoverValue(index + 1);
  };
  
  const handleMouseLeave = () => {
    if (readOnly || disabled) return;
    setHoverValue(0);
  };
  
  const uniqueId = id || `rating-${label?.replace(/\s/g, '-').toLowerCase()}`;
  const displayValue = hoverValue || value;
  
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {label && (
        <Label htmlFor={uniqueId} className={cn(invalid && "text-destructive")}>
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div 
        className={cn(
          "flex items-center gap-1",
          disabled && "opacity-50 cursor-not-allowed",
          readOnly ? "cursor-default" : "cursor-pointer"
        )}
        onMouseLeave={handleMouseLeave}
        id={uniqueId}
        role="radiogroup"
        aria-label={label}
        aria-invalid={invalid}
        aria-required={required}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            role="radio"
            aria-checked={index < displayValue}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            className={cn(
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              (readOnly || disabled) ? "cursor-default" : "cursor-pointer"
            )}
            tabIndex={readOnly || disabled ? -1 : 0}
          >
            {template ? (
              template(displayValue, index)
            ) : (
              <Star 
                className={cn(
                  "h-5 w-5 transition-colors",
                  index < displayValue 
                    ? "fill-current text-yellow-400" 
                    : "text-muted-foreground"
                )}
              />
            )}
          </div>
        ))}
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

RatingField.displayName = "RatingField";
