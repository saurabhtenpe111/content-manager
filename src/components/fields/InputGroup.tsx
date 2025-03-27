
import React from 'react';
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export interface InputGroupProps {
  label?: string;
  description?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  prefixMultiple?: React.ReactNode[];
  suffixMultiple?: React.ReactNode[];
  prefixButton?: React.ReactNode;
  suffixButton?: React.ReactNode;
  prefixCheckbox?: boolean;
  suffixCheckbox?: boolean;
  prefixRadio?: boolean;
  suffixRadio?: boolean;
  radioOptions?: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  onCheckboxChange?: (checked: boolean) => void;
  onRadioChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  type?: string;
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(({
  label,
  description,
  prefix,
  suffix,
  prefixMultiple,
  suffixMultiple,
  prefixButton,
  suffixButton,
  prefixCheckbox,
  suffixCheckbox,
  prefixRadio,
  suffixRadio,
  radioOptions = [],
  value = '',
  onChange,
  onCheckboxChange,
  onRadioChange,
  placeholder = '',
  disabled = false,
  invalid = false,
  required = false,
  error,
  className,
  type = 'text'
}, ref) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const addonClass = cn(
    "flex items-center justify-center px-3 py-0 border bg-muted h-10",
    "text-sm text-muted-foreground",
    invalid && "border-destructive"
  );

  const renderAddon = (content: React.ReactNode, position: 'prefix' | 'suffix') => {
    if (!content) return null;
    
    return (
      <div 
        className={cn(
          addonClass,
          position === 'prefix' ? "rounded-l-md border-r-0" : "rounded-r-md border-l-0"
        )}
      >
        {content}
      </div>
    );
  };

  const renderMultipleAddons = (addons: React.ReactNode[] | undefined, position: 'prefix' | 'suffix') => {
    if (!addons || addons.length === 0) return null;
    
    return (
      <>
        {addons.map((addon, index) => (
          <div 
            key={index}
            className={cn(
              addonClass,
              position === 'prefix' 
                ? index === 0 ? "rounded-l-md" : "",
                : index === addons.length - 1 ? "rounded-r-md" : "",
              position === 'prefix' ? "border-r-0" : "border-l-0"
            )}
          >
            {addon}
          </div>
        ))}
      </>
    );
  };

  const renderButtonAddon = (content: React.ReactNode, position: 'prefix' | 'suffix') => {
    if (!content) return null;
    
    return (
      <Button
        type="button"
        className={cn(
          position === 'prefix' ? "rounded-l-md rounded-r-none" : "rounded-r-md rounded-l-none",
          invalid && "border-destructive",
          "h-10"
        )}
        variant={invalid ? "destructive" : "default"}
        disabled={disabled}
      >
        {content}
      </Button>
    );
  };

  const renderCheckboxAddon = (position: 'prefix' | 'suffix') => {
    if ((position === 'prefix' && !prefixCheckbox) || (position === 'suffix' && !suffixCheckbox)) {
      return null;
    }
    
    return (
      <div 
        className={cn(
          addonClass,
          position === 'prefix' ? "rounded-l-md border-r-0" : "rounded-r-md border-l-0"
        )}
      >
        <Checkbox 
          disabled={disabled}
          onCheckedChange={onCheckboxChange}
        />
      </div>
    );
  };

  const renderRadioAddon = (position: 'prefix' | 'suffix') => {
    if ((position === 'prefix' && !prefixRadio) || (position === 'suffix' && !suffixRadio)) {
      return null;
    }
    
    if (radioOptions.length === 0) return null;
    
    return (
      <div 
        className={cn(
          "flex items-center border bg-muted h-10 px-2",
          position === 'prefix' ? "rounded-l-md border-r-0" : "rounded-r-md border-l-0",
          invalid && "border-destructive"
        )}
      >
        <RadioGroup 
          className="flex items-center space-x-2" 
          onValueChange={onRadioChange}
          disabled={disabled}
        >
          {radioOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-1">
              <RadioGroupItem value={option.value} id={`radio-${option.value}`} />
              <Label htmlFor={`radio-${option.value}`} className="text-xs cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  const hasPrefix = prefix || prefixMultiple || prefixButton || prefixCheckbox || prefixRadio;
  const hasSuffix = suffix || suffixMultiple || suffixButton || suffixCheckbox || suffixRadio;

  return (
    <div ref={ref} className="space-y-2">
      {label && (
        <Label className="block" htmlFor={`input-${label}`}>
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className={cn("flex", className)}>
        {renderCheckboxAddon('prefix')}
        {renderRadioAddon('prefix')}
        {renderAddon(prefix, 'prefix')}
        {renderMultipleAddons(prefixMultiple, 'prefix')}
        {renderButtonAddon(prefixButton, 'prefix')}
        
        <Input
          id={`input-${label}`}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            invalid && "border-destructive focus-visible:ring-destructive",
            !hasPrefix && "rounded-l-md",
            !hasSuffix && "rounded-r-md",
            hasPrefix && "rounded-l-none",
            hasSuffix && "rounded-r-none"
          )}
          type={type}
          aria-invalid={invalid}
          required={required}
        />
        
        {renderButtonAddon(suffixButton, 'suffix')}
        {renderMultipleAddons(suffixMultiple, 'suffix')}
        {renderAddon(suffix, 'suffix')}
        {renderRadioAddon('suffix')}
        {renderCheckboxAddon('suffix')}
      </div>
      
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
});

InputGroup.displayName = "InputGroup";
