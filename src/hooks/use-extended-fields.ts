
import { useEffect } from 'react';
import { renderExtendedField } from '@/components/fields/FieldRendererExtensions';

// This hook patches the global FieldRenderer component with our extended field types
export const useExtendedFields = () => {
  useEffect(() => {
    // The goal is to extend the existing field renderer functionality
    // This is a custom hook that makes the extended fields available to the renderer
    
    // We can expose our extended field renderer for other components to use
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
