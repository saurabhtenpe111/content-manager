
import React from 'react';
import { Field } from '@/stores/cmsStore';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface ValidationPreviewProps {
  field: Field;
}

export const ValidationPreview: React.FC<ValidationPreviewProps> = ({ field }) => {
  const { validation } = field;
  
  if (!validation) return null;
  
  const validationRules = [];
  
  if (validation.required) {
    validationRules.push({ 
      label: 'Required', 
      description: 'This field cannot be empty',
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />
    });
  }
  
  if (validation.minLength) {
    validationRules.push({ 
      label: 'Min Length', 
      description: `Minimum ${validation.minLength} characters`,
      icon: <Info className="h-4 w-4 text-blue-500" />
    });
  }
  
  if (validation.maxLength) {
    validationRules.push({ 
      label: 'Max Length', 
      description: `Maximum ${validation.maxLength} characters`,
      icon: <Info className="h-4 w-4 text-blue-500" />
    });
  }
  
  if (validation.minValue !== undefined) {
    validationRules.push({ 
      label: 'Min Value', 
      description: `Minimum value: ${validation.minValue}`,
      icon: <Info className="h-4 w-4 text-blue-500" />
    });
  }
  
  if (validation.maxValue !== undefined) {
    validationRules.push({ 
      label: 'Max Value', 
      description: `Maximum value: ${validation.maxValue}`,
      icon: <Info className="h-4 w-4 text-blue-500" />
    });
  }
  
  if (validation.pattern) {
    validationRules.push({ 
      label: 'Pattern', 
      description: validation.patternMessage || 'Must match specific pattern',
      icon: <Info className="h-4 w-4 text-blue-500" />
    });
  }
  
  if (validation.email) {
    validationRules.push({ 
      label: 'Email', 
      description: 'Must be a valid email address',
      icon: <Info className="h-4 w-4 text-blue-500" />
    });
  }
  
  if (validation.url) {
    validationRules.push({ 
      label: 'URL', 
      description: 'Must be a valid URL',
      icon: <Info className="h-4 w-4 text-blue-500" />
    });
  }
  
  if (validation.unique) {
    validationRules.push({ 
      label: 'Unique', 
      description: 'Value must be unique in the database',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    });
  }
  
  if (validation.nullable === false) {
    validationRules.push({ 
      label: 'Not Nullable', 
      description: 'NULL values are not allowed',
      icon: <X className="h-4 w-4 text-red-500" />
    });
  }
  
  if (validation.fileSize) {
    validationRules.push({ 
      label: 'Max File Size', 
      description: `Max ${validation.fileSize}MB`,
      icon: <Info className="h-4 w-4 text-blue-500" />
    });
  }
  
  if (validation.fileType && validation.fileType.length > 0) {
    validationRules.push({ 
      label: 'File Types', 
      description: `Allowed: ${validation.fileType.join(', ')}`,
      icon: <Info className="h-4 w-4 text-blue-500" />
    });
  }
  
  if (validationRules.length === 0) {
    return null;
  }
  
  return (
    <Card className="mt-2">
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-xs font-medium">Validation</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3">
        <ul className="space-y-1 text-xs">
          {validationRules.map((rule, index) => (
            <li key={index} className="flex items-center gap-1">
              {rule.icon}
              <span className="font-medium">{rule.label}:</span> {rule.description}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
