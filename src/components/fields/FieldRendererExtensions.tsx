
import React from 'react';
import { Field } from '@/stores/cmsStore';
import { ValidationPreview } from './ValidationPreview';

// Enhanced field renderer extensions to show validation rules
export const FieldRendererExtensions: React.FC<{
  field: Field;
  isPreview?: boolean;
}> = ({ field, isPreview = false }) => {
  if (!isPreview) return null;
  
  return (
    <div className="field-extensions">
      <ValidationPreview field={field} />
    </div>
  );
};
