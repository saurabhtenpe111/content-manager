
import React from 'react';
import { Field } from '@/stores/cmsStore';
import { TriStateCheckbox } from './TriStateCheckbox';
import { InputMask } from './InputMask';
import { InputOTPField } from './InputOTP';

interface FieldRendererOptions {
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  disabled?: boolean;
  isPreview?: boolean;
}

export const renderExtendedField = (field: Field, options: FieldRendererOptions) => {
  const { value, onChange, error, disabled, isPreview } = options;
  const fieldId = `field-${field.id}`;
  const isRequired = field.validation?.required;
  
  switch (field.type) {
    case 'tristatecheckbox':
      return (
        <TriStateCheckbox
          id={fieldId}
          label={field.label}
          value={value}
          onChange={onChange}
          description={field.description}
          disabled={disabled || isPreview}
          required={isRequired}
          error={error}
        />
      );
      
    case 'inputmask':
      return (
        <InputMask
          id={fieldId}
          label={field.label}
          value={value}
          onChange={onChange}
          description={field.description}
          placeholder={field.placeholder}
          mask={field.uiOptions?.mask || ''}
          disabled={disabled || isPreview}
          required={isRequired}
          error={error}
        />
      );
      
    case 'inputotp':
      return (
        <InputOTPField
          id={fieldId}
          label={field.label}
          value={value}
          onChange={onChange}
          description={field.description}
          length={field.uiOptions?.length || 6}
          required={isRequired}
          disabled={disabled || isPreview}
          error={error}
          pattern={field.uiOptions?.pattern || '^[0-9]+$'}
          separator={field.uiOptions?.separator !== false}
        />
      );
      
    case 'inputswitch':
      // InputSwitch is similar to toggle, but with a different UI
      // For now, we'll use the built-in toggle functionality
      return null; // Falls back to default toggle
      
    case 'treeselect':
    case 'listbox':
    case 'mention':
    case 'selectbutton':
    case 'rating':
    case 'multistatecheckbox':
    case 'multiselect':
      // These will require more complex implementations
      // For now, return null to use the default handling
      return null;
      
    default:
      // Not a custom field, return null to use default handling
      return null;
  }
};
