
import React from 'react';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';

export interface InputGroupProps {
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  prefixButtons?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  }>;
  suffixButtons?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  }>;
  prefixCheckboxes?: Array<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
  }>;
  suffixCheckboxes?: Array<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
  }>;
  id?: string;
}

export const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  prefix,
  suffix,
  className,
  prefixButtons,
  suffixButtons,
  prefixCheckboxes,
  suffixCheckboxes,
  id,
  ...props
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  const uniqueId = id || `input-${label?.replace(/\s/g, '-').toLowerCase()}`;
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={uniqueId}
          className={cn(error && "text-destructive")}
        >
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="flex">
        {/* Prefix Items */}
        {(prefix || prefixButtons || prefixCheckboxes) && (
          <div className="flex items-center border border-r-0 border-input rounded-l-md bg-muted px-3 py-2">
            {prefix && <span className="text-muted-foreground">{prefix}</span>}
            
            {prefixButtons && prefixButtons.map((button, index) => (
              <Button
                key={`prefix-button-${index}`}
                variant={button.variant || 'outline'}
                size="sm"
                onClick={button.onClick}
                className="ml-1 first:ml-0"
              >
                {button.label}
              </Button>
            ))}
            
            {prefixCheckboxes && prefixCheckboxes.map((checkbox, index) => (
              <div key={`prefix-checkbox-${index}`} className="flex items-center ml-2 first:ml-0">
                <div
                  onClick={() => checkbox.onChange(!checkbox.checked)}
                  className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center cursor-pointer",
                    checkbox.checked ? "bg-primary border-primary" : "border-input"
                  )}
                >
                  {checkbox.checked && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                {checkbox.label && (
                  <span className="ml-1 text-xs">{checkbox.label}</span>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Input */}
        <Input
          ref={ref}
          id={uniqueId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            prefix || prefixButtons || prefixCheckboxes ? "rounded-l-none" : "",
            suffix || suffixButtons || suffixCheckboxes ? "rounded-r-none" : "",
          )}
          aria-invalid={!!error}
          {...props}
        />
        
        {/* Suffix Items */}
        {(suffix || suffixButtons || suffixCheckboxes) && (
          <div className="flex items-center border border-l-0 border-input rounded-r-md bg-muted px-3 py-2">
            {suffix && <span className="text-muted-foreground">{suffix}</span>}
            
            {suffixButtons && suffixButtons.map((button, index) => (
              <Button
                key={`suffix-button-${index}`}
                variant={button.variant || 'outline'}
                size="sm"
                onClick={button.onClick}
                className="ml-1 first:ml-0"
              >
                {button.label}
              </Button>
            ))}
            
            {suffixCheckboxes && suffixCheckboxes.map((checkbox, index) => (
              <div key={`suffix-checkbox-${index}`} className="flex items-center ml-2 first:ml-0">
                <div
                  onClick={() => checkbox.onChange(!checkbox.checked)}
                  className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center cursor-pointer",
                    checkbox.checked ? "bg-primary border-primary" : "border-input"
                  )}
                >
                  {checkbox.checked && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                {checkbox.label && (
                  <span className="ml-1 text-xs">{checkbox.label}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});

InputGroup.displayName = "InputGroup";
