
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';

export type Addon = {
  position: 'left' | 'right';
  content: string;
  type: 'text' | 'button';
  onClick?: () => void;
};

export interface InputGroupProps {
  id?: string;
  label?: string;
  placeholder?: string;
  addons?: Addon[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  name?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  id,
  label,
  placeholder,
  addons = [],
  value = '',
  onChange,
  className,
  disabled = false,
  required = false,
  error,
  name,
  children,
  icon,
}) => {
  const leftAddons = addons?.filter(addon => addon.position === 'left') || [];
  const rightAddons = addons?.filter(addon => addon.position === 'right') || [];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  const renderAddon = (addon: Addon) => {
    if (addon.type === 'button') {
      return (
        <Button
          type="button"
          variant="outline"
          className={cn(
            addon.position === 'left' ? 'rounded-r-none' : 'rounded-l-none',
            'border-gray-300'
          )}
          onClick={addon.onClick}
          disabled={disabled}
        >
          {addon.content}
        </Button>
      );
    }
    
    return (
      <div
        className={cn(
          'flex items-center px-3 bg-gray-100 border border-gray-300 text-gray-600',
          addon.position === 'left' ? 'rounded-l-md border-r-0' : 'rounded-r-md border-l-0'
        )}
      >
        {addon.content}
      </div>
    );
  };
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id || name} className="block text-sm font-medium text-gray-700">
          {icon && <span className="mr-1.5 inline-flex items-center">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="flex">
        {leftAddons.map((addon, index) => (
          <div key={`left-addon-${index}`}>{renderAddon(addon)}</div>
        ))}
        
        {children ? (
          children
        ) : (
          <Input
            id={id || name}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={cn(
              'flex-1',
              leftAddons.length > 0 && 'rounded-l-none',
              rightAddons.length > 0 && 'rounded-r-none',
              error && 'border-red-500 focus:ring-red-500'
            )}
          />
        )}
        
        {rightAddons.map((addon, index) => (
          <div key={`right-addon-${index}`}>{renderAddon(addon)}</div>
        ))}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputGroup;
