
import React, { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface InputGroupProps {
  className?: string;
  type?: string;
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  prefixMultiple?: React.ReactNode[];
  prefixButton?: React.ReactNode;
  prefixButtons?: React.ReactNode[];
  prefixCheckbox?: boolean;
  prefixCheckboxes?: boolean[];
  prefixRadio?: boolean;
  radioOptions?: { label: string; value: string }[];
  suffix?: React.ReactNode;
  suffixMultiple?: string[];
  suffixButton?: React.ReactNode;
  suffixButtons?: React.ReactNode[];
  onCheckboxChange?: (checked: boolean) => void;
  onRadioChange?: (value: string) => void;
  id?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  // Add any other HTML input attributes you need
  [x: string]: any;
}

const InputGroupFixed = forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      className,
      type,
      label,
      error,
      prefix,
      prefixMultiple,
      prefixButton,
      prefixButtons,
      prefixCheckbox,
      prefixCheckboxes,
      prefixRadio,
      radioOptions,
      suffix,
      suffixMultiple,
      suffixButton,
      suffixButtons,
      onCheckboxChange,
      onRadioChange,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <div className="flex items-center">
          {prefix && <div className="mr-2">{prefix}</div>}
          {prefixMultiple && prefixMultiple.map((item, i) => (
            <div key={i} className="mr-2">{item}</div>
          ))}
          {prefixButton && <div className="mr-2">{prefixButton}</div>}
          {prefixButtons && prefixButtons.map((button, i) => (
            <div key={i} className="mr-2">{button}</div>
          ))}
          {prefixCheckbox && (
            <div className="mr-2">
              <input 
                type="checkbox" 
                onChange={(e) => onCheckboxChange?.(e.target.checked)} 
              />
            </div>
          )}
          {prefixCheckboxes && prefixCheckboxes.map((checked, i) => (
            <div key={i} className="mr-2">
              <input 
                type="checkbox" 
                defaultChecked={checked}
              />
            </div>
          ))}
          {prefixRadio && radioOptions && (
            <div className="mr-2 flex flex-col space-y-1">
              {radioOptions.map((option, i) => (
                <label key={i} className="flex items-center">
                  <input 
                    type="radio" 
                    name={`radio-${props.id || ''}`}
                    value={option.value}
                    onChange={(e) => onRadioChange?.(e.target.value)}
                    className="mr-1"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && <div className="ml-2">{suffix}</div>}
          {suffixMultiple && suffixMultiple.map((item, i) => (
            <div key={i} className="ml-2">{item}</div>
          ))}
          {suffixButton && <div className="ml-2">{suffixButton}</div>}
          {suffixButtons && suffixButtons.map((button, i) => (
            <div key={i} className="ml-2">{button}</div>
          ))}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

InputGroupFixed.displayName = "InputGroupFixed";

export { InputGroupFixed };
