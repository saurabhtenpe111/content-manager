
import React from 'react';
import { InputGroup } from './InputGroup';
import { InputMask } from './InputMask';
import { TriStateCheckbox } from './TriStateCheckbox';
import { InputOTPField } from './InputOTP';
import { RatingField } from './Rating';
import { MultiSelect } from './MultiSelect';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';
import { cn } from '@/lib/utils';

export const renderExtendedField = (
  field: any, 
  props: {
    value?: any;
    onChange?: (value: any) => void;
    error?: string;
    disabled?: boolean;
    isPreview?: boolean;
  }
) => {
  const { value, onChange, error, disabled, isPreview } = props;
  
  switch (field.type) {
    case 'inputgroup':
      return (
        <InputGroup
          id={field.id}
          label={field.label}
          value={value}
          onChange={onChange}
          description={field.description}
          placeholder={field.placeholder}
          prefix={field.uiOptions?.prefix}
          suffix={field.uiOptions?.suffix}
          addons={field.uiOptions?.addons}
          disabled={disabled || isPreview}
          required={field.validation?.required}
          error={error}
        />
      );
      
    case 'inputmask':
      return (
        <InputMask
          id={field.id}
          label={field.label}
          value={value}
          onChange={onChange}
          description={field.description}
          placeholder={field.placeholder}
          mask={field.uiOptions?.mask || ''}
          disabled={disabled || isPreview}
          required={field.validation?.required}
          error={error}
        />
      );
      
    case 'inputswitch':
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Switch
              id={field.id}
              checked={!!value}
              onCheckedChange={onChange}
              disabled={disabled || isPreview}
            />
          </div>
          
          {field.description && (
            <FormDescription className="text-xs text-gray-500">
              {field.description}
            </FormDescription>
          )}
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
      );
      
    case 'tristatecheckbox':
      return (
        <TriStateCheckbox
          id={field.id}
          label={field.label}
          value={value}
          onChange={onChange}
          description={field.description}
          disabled={disabled || isPreview}
          required={field.validation?.required}
          error={error}
        />
      );
      
    case 'inputotp':
      return (
        <InputOTPField
          id={field.id}
          label={field.label}
          value={value}
          onChange={onChange}
          description={field.description}
          length={field.uiOptions?.length || 6}
          pattern={field.uiOptions?.otpType === 'alphanumeric' ? '^[a-zA-Z0-9]+$' : '^[0-9]+$'}
          required={field.validation?.required}
          disabled={disabled || isPreview}
          error={error}
        />
      );
      
    case 'rating':
      return (
        <RatingField
          id={field.id}
          label={field.label}
          value={value || 0}
          onChange={onChange}
          description={field.description}
          totalStars={field.uiOptions?.totalStars || 5}
          cancel={field.uiOptions?.cancel !== false}
          disabled={disabled || isPreview}
          required={field.validation?.required}
          error={error}
        />
      );
      
    case 'multiselect':
      return (
        <MultiSelect
          id={field.id}
          label={field.label}
          value={value || []}
          onChange={onChange}
          options={field.options || []}
          description={field.description}
          placeholder={field.placeholder}
          disabled={disabled || isPreview}
          required={field.validation?.required}
          error={error}
          allowSearch={field.uiOptions?.allowSearch !== false}
          allowClear={field.uiOptions?.allowClear !== false}
        />
      );
      
    default:
      return null;
  }
};
