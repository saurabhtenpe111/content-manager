
import React, { useState, useEffect } from 'react';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot, 
  InputOTPSeparator 
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';

interface InputOTPFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  description?: string;
  placeholder?: string;
  length?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  pattern?: string;
  separator?: boolean;
}

export const InputOTPField: React.FC<InputOTPFieldProps> = ({
  id,
  label,
  value = '',
  onChange,
  description,
  length = 6,
  required = false,
  disabled = false,
  error,
  pattern = '^[0-9]+$', // Default to numeric
  separator = true
}) => {
  const [otpValue, setOtpValue] = useState(value);
  
  useEffect(() => {
    setOtpValue(value);
  }, [value]);
  
  const handleChange = (value: string) => {
    setOtpValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <InputOTP
        maxLength={length}
        value={otpValue}
        onChange={handleChange}
        disabled={disabled}
        pattern={pattern}
        id={id}
        name={id}
      >
        <InputOTPGroup>
          {Array.from({ length }, (_, i) => (
            <React.Fragment key={i}>
              <InputOTPSlot index={i} />
              {separator && i < length - 1 && <InputOTPSeparator />}
            </React.Fragment>
          ))}
        </InputOTPGroup>
      </InputOTP>
      
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
