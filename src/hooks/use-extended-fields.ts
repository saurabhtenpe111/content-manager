
import { useEffect } from 'react';
import { renderExtendedField } from '@/components/fields/FieldRendererExtensions';

// This hook patches the global FieldRenderer component with our extended field types
export const useExtendedFields = () => {
  useEffect(() => {
    // Make the extended field renderer available to the renderer
    if (typeof window !== 'undefined') {
      (window as any).__EXTENDED_FIELD_RENDERER = renderExtendedField;
    }
    
    return () => {
      // Clean up when component unmounts
      if (typeof window !== 'undefined') {
        delete (window as any).__EXTENDED_FIELD_RENDERER;
      }
    };
  }, []);
  
  return {
    renderExtendedField
  };
};
