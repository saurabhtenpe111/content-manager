
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X, Check, ChevronDown, Search } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  id: string;
  label?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  options: Option[];
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  allowSearch?: boolean;
  allowClear?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  label,
  value = [],
  onChange,
  options = [],
  description,
  placeholder = 'Select options',
  disabled = false,
  required = false,
  error,
  allowSearch = true,
  allowClear = true,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    setSelectedValues(value);
  }, [value]);
  
  const handleSelect = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    
    setSelectedValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };
  
  const handleClear = () => {
    setSelectedValues([]);
    if (onChange) {
      onChange([]);
    }
    setOpen(false);
  };
  
  const selectedLabels = options
    .filter(option => selectedValues.includes(option.value))
    .map(option => option.label);
  
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-disabled={disabled}
            className={cn(
              "w-full justify-between font-normal",
              disabled && "opacity-50 cursor-not-allowed",
              error && "border-red-500"
            )}
            onClick={() => !disabled && setOpen(!open)}
          >
            {selectedValues.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
                {selectedValues.length <= 2 ? (
                  selectedLabels.map((label, i) => (
                    <Badge key={i} variant="secondary" className="mr-1">
                      {label}
                    </Badge>
                  ))
                ) : (
                  <>
                    <Badge variant="secondary">
                      {selectedLabels[0]}
                    </Badge>
                    <Badge variant="secondary">
                      +{selectedValues.length - 1} more
                    </Badge>
                  </>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            {allowSearch && (
              <CommandInput placeholder="Search options..." />
            )}
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <div className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            {allowClear && selectedValues.length > 0 && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-xs"
                  onClick={handleClear}
                >
                  Clear all
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      
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
