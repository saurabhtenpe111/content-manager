
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Plus, Minus } from 'lucide-react';
import { FormDescription } from '@/components/ui/form';

interface NumberFieldProps {
  id?: string;
  name?: string;
  label?: string;
  description?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  decimalPlaces?: number;
  showButtons?: boolean;
  buttonLayout?: 'horizontal' | 'vertical';
  currency?: string;
  locale?: string;
  prefix?: string;
  suffix?: string;
  filled?: boolean;
  floatLabel?: boolean;
  className?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  id,
  name,
  label,
  description,
  value = null,
  onChange,
  placeholder = '0',
  disabled = false,
  required = false,
  error,
  min,
  max,
  step = 1,
  decimalPlaces,
  showButtons = false,
  buttonLayout = 'horizontal',
  currency,
  locale = 'en-US',
  prefix,
  suffix,
  filled = false,
  floatLabel = false,
  className,
}) => {
  const [focused, setFocused] = useState(false);
  const [localValue, setLocalValue] = useState<string>(
    formatNumberForDisplay(value, { locale, currency, decimalPlaces })
  );

  // Format number for display based on options
  function formatNumberForDisplay(
    num: number | null, 
    options: { locale: string; currency?: string; decimalPlaces?: number }
  ): string {
    if (num === null) return '';
    
    if (options.currency) {
      return new Intl.NumberFormat(options.locale, {
        style: 'currency',
        currency: options.currency,
        minimumFractionDigits: options.decimalPlaces !== undefined ? options.decimalPlaces : 2,
        maximumFractionDigits: options.decimalPlaces !== undefined ? options.decimalPlaces : 2,
      }).format(num);
    }
    
    if (options.decimalPlaces !== undefined) {
      return new Intl.NumberFormat(options.locale, {
        minimumFractionDigits: options.decimalPlaces,
        maximumFractionDigits: options.decimalPlaces,
      }).format(num);
    }
    
    return new Intl.NumberFormat(options.locale).format(num);
  }

  // Parse string value to number
  function parseNumberValue(val: string): number | null {
    // Replace non-numeric characters except decimal point and minus sign
    const numericValue = val
      .replace(/[^\d.-]/g, '')
      .replace(/(\..*?)\..*/g, '$1') // Allow only one decimal point
      .replace(/^(-?)0+(?=\d)/, '$1'); // Remove leading zeros
    
    if (numericValue === '' || numericValue === '-') return null;
    
    let parsedValue = parseFloat(numericValue);
    
    if (isNaN(parsedValue)) return null;
    
    // Apply min/max constraints
    if (min !== undefined && parsedValue < min) parsedValue = min;
    if (max !== undefined && parsedValue > max) parsedValue = max;
    
    return parsedValue;
  }

  const incrementValue = () => {
    const currentValue = value !== null ? value : 0;
    const newValue = Math.min(
      max !== undefined ? max : Infinity,
      currentValue + step
    );
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Update local display value
    setLocalValue(formatNumberForDisplay(newValue, { locale, currency, decimalPlaces }));
  };

  const decrementValue = () => {
    const currentValue = value !== null ? value : 0;
    const newValue = Math.max(
      min !== undefined ? min : -Infinity,
      currentValue - step
    );
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Update local display value
    setLocalValue(formatNumberForDisplay(newValue, { locale, currency, decimalPlaces }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocalValue(inputValue);
    
    // Only call onChange when we have a valid number
    const parsedValue = parseNumberValue(inputValue);
    if (parsedValue !== null && onChange) {
      onChange(parsedValue);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    
    // Reformat the display value on blur
    if (value !== null) {
      setLocalValue(formatNumberForDisplay(value, { locale, currency, decimalPlaces }));
    } else {
      setLocalValue('');
    }
  };

  // Determine display value considering prefix and suffix
  const displayValue = localValue;
  const hasValue = value !== null && displayValue !== '';

  return (
    <div className={cn("space-y-2", className)}>
      {label && !floatLabel && (
        <Label 
          htmlFor={id || name} 
          className={cn(
            "block text-sm font-medium",
            error ? "text-destructive" : "text-foreground"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      {description && !floatLabel && (
        <FormDescription className="text-xs">{description}</FormDescription>
      )}
      
      <div
        className={cn(
          "relative flex",
          buttonLayout === 'horizontal' ? "flex-row items-center" : "flex-row-reverse items-stretch",
          error ? "border-destructive" : "",
          filled ? "bg-secondary/50" : ""
        )}
      >
        {/* Left side buttons (vertical layout) or prefix */}
        {buttonLayout === 'vertical' && showButtons ? (
          <div className="flex flex-col">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled || (max !== undefined && value !== null && value >= max)}
              onClick={incrementValue}
              className={cn(
                "h-8 w-8 rounded-r-none border-r-0",
                "flex-1 rounded-bl-none px-2"
              )}
              aria-label="Increment value"
            >
              <ChevronUp size={14} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled || (min !== undefined && value !== null && value <= min)}
              onClick={decrementValue}
              className={cn(
                "h-8 w-8 rounded-r-none border-r-0 border-t-0",
                "flex-1 rounded-tl-none px-2"
              )}
              aria-label="Decrement value"
            >
              <ChevronDown size={14} />
            </Button>
          </div>
        ) : prefix ? (
          <div className="flex items-center px-3 bg-muted border border-input border-r-0 rounded-l-md text-muted-foreground">
            {prefix}
          </div>
        ) : null}
        
        {/* Input field */}
        <div className={cn("relative flex-1", floatLabel ? "pt-6" : "")}>
          {floatLabel && label && (
            <Label
              htmlFor={id || name}
              className={cn(
                "absolute text-xs transition-all duration-150",
                hasValue || focused
                  ? "top-1 left-3 text-xs"
                  : "top-1/2 left-3 -translate-y-1/2 text-base",
                focused ? "text-primary" : "text-muted-foreground",
                error ? "text-destructive" : ""
              )}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          
          <Input
            id={id || name}
            name={name}
            value={displayValue}
            onChange={handleInputChange}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            placeholder={floatLabel && (hasValue || focused) ? "" : placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            aria-invalid={!!error}
            aria-describedby={error ? `${id || name}-error` : undefined}
            className={cn(
              "w-full",
              buttonLayout === 'vertical' && showButtons ? "rounded-l-none" : "",
              prefix && "rounded-l-none",
              (suffix || (buttonLayout === 'horizontal' && showButtons)) ? "rounded-r-none" : "",
              floatLabel ? "h-14 pt-4" : "",
              filled ? "bg-muted border-input" : "",
              error ? "border-destructive focus:ring-destructive" : ""
            )}
          />
        </div>
        
        {/* Right side buttons (horizontal layout) or suffix */}
        {buttonLayout === 'horizontal' && showButtons ? (
          <div className="flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled || (min !== undefined && value !== null && value <= min)}
              onClick={decrementValue}
              className="h-10 w-10 rounded-l-none border-l-0"
              aria-label="Decrement value"
            >
              <Minus size={14} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled || (max !== undefined && value !== null && value >= max)}
              onClick={incrementValue}
              className="h-10 w-10 rounded-l-none border-l-0"
              aria-label="Increment value"
            >
              <Plus size={14} />
            </Button>
          </div>
        ) : suffix ? (
          <div className="flex items-center px-3 bg-muted border border-input border-l-0 rounded-r-md text-muted-foreground">
            {suffix}
          </div>
        ) : null}
      </div>
      
      {error && (
        <p 
          id={`${id || name}-error`} 
          className="text-sm text-destructive mt-1"
        >
          {error}
        </p>
      )}
      
      {description && floatLabel && (
        <FormDescription className="text-xs">{description}</FormDescription>
      )}
    </div>
  );
};

export default NumberField;
