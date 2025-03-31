
import React from 'react';
import { FieldType } from '@/stores/cmsStore';
import { 
  Type, 
  AlignLeft, 
  Hash, 
  Mail, 
  Lock, 
  Calendar, 
  List, 
  CheckSquare, 
  Radio, 
  Upload, 
  ToggleLeft, 
  Sliders, 
  Palette,
  Component,
  Star,
  ListTree,
  Hash as ListBox,
  AtSign,
  CircleCheck,
  KeySquare,
  SquareStackIcon,
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldTypeItemProps {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
  onSelect: (type: FieldType) => void;
}

const FieldTypeItem: React.FC<FieldTypeItemProps> = ({ type, label, icon, onSelect }) => {
  return (
    <div 
      className="cms-field-box flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-50"
      onClick={() => onSelect(type)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('field-type', type);
      }}
    >
      <div className="w-8 h-8 flex items-center justify-center bg-cms-gray-100 rounded-md text-cms-gray-600">
        {icon}
      </div>
      <span className="font-medium text-cms-gray-700">{label}</span>
    </div>
  );
};

interface FieldTypesProps {
  onSelect: (type: FieldType) => void;
  className?: string;
}

export const FieldTypes: React.FC<FieldTypesProps> = ({ onSelect, className }) => {
  const fieldTypes = [
    // Basic fields
    { type: 'text', label: 'Text Field', icon: <Type size={16} /> },
    { type: 'textarea', label: 'Text Area', icon: <AlignLeft size={16} /> },
    { type: 'number', label: 'Number', icon: <Hash size={16} /> },
    { type: 'email', label: 'Email', icon: <Mail size={16} /> },
    { type: 'password', label: 'Password', icon: <Lock size={16} /> },
    { type: 'date', label: 'Date', icon: <Calendar size={16} /> },
    { type: 'dropdown', label: 'Dropdown', icon: <List size={16} /> },
    { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={16} /> },
    { type: 'radio', label: 'Radio', icon: <Radio size={16} /> },
    { type: 'file', label: 'File Upload', icon: <Upload size={16} /> },
    { type: 'toggle', label: 'Toggle', icon: <ToggleLeft size={16} /> },
    { type: 'slider', label: 'Slider', icon: <Sliders size={16} /> },
    { type: 'color', label: 'Color Picker', icon: <Palette size={16} /> },
    
    // New field types
    { type: 'inputgroup', label: 'Input Group', icon: <SquareStackIcon size={16} /> },
    { type: 'inputmask', label: 'Input Mask', icon: <Hash size={16} /> },
    { type: 'inputswitch', label: 'Input Switch', icon: <SlidersHorizontal size={16} /> },
    { type: 'tristatecheckbox', label: 'Tri-State Checkbox', icon: <CircleCheck size={16} /> },
    { type: 'inputotp', label: 'Input OTP', icon: <KeySquare size={16} /> },
    { type: 'treeselect', label: 'Tree Select', icon: <ListTree size={16} /> },
    { type: 'listbox', label: 'List Box', icon: <ListBox size={16} /> },
    { type: 'mention', label: 'Mention Box', icon: <AtSign size={16} /> },
    { type: 'selectbutton', label: 'Select Button', icon: <Radio size={16} /> },
    { type: 'rating', label: 'Rating', icon: <Star size={16} /> },
    { type: 'multistatecheckbox', label: 'Multi-State Checkbox', icon: <CheckSquare size={16} /> },
    { type: 'multiselect', label: 'Multi Select', icon: <List size={16} /> },
    
    // Advanced components
    { type: 'component', label: 'Component', icon: <Component size={16} /> },
  ];
  
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="cms-section-title text-sm font-semibold mb-3">Available Fields</h3>
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-1">
        {fieldTypes.map((fieldType) => (
          <FieldTypeItem
            key={fieldType.type}
            type={fieldType.type as FieldType}
            label={fieldType.label}
            icon={fieldType.icon}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};
