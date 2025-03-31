
export interface UiOptions {
  // Display options
  floatingLabel?: boolean;
  showLabel?: boolean;
  fullWidth?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  description?: string;
  descriptionPosition?: 'top' | 'bottom';
  
  // Size and appearance
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'underlined' | 'plain';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  
  // Color customization
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  
  // Layout
  layout?: 'horizontal' | 'vertical' | 'inline';
  
  // Number field specific
  minValue?: number;
  maxValue?: number;
  step?: number;
  
  // Text field specific
  minLength?: number;
  maxLength?: number;
  mask?: string;
  
  // Select field specific
  allowClear?: boolean;
  allowSearch?: boolean;
  showCheckboxes?: boolean;
  
  // Calendar field specific
  dateFormat?: string;
  showTime?: boolean;
  multipleMonths?: boolean;
  showWeekNumbers?: boolean;
  
  // Radio and Checkbox specific
  inline?: boolean;
  triState?: boolean;
  multiState?: boolean;
  
  // File upload specific
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  multiple?: boolean;
  
  // Input group specific
  prefix?: string;
  suffix?: string;
  addons?: { position: 'left' | 'right'; content: string }[];
  
  // Rich text specific
  toolbar?: string[];
  height?: number;
  mediaUpload?: boolean;
  
  // Rating specific
  totalStars?: number;
  cancel?: boolean;
  
  // OTP specific
  length?: number;
  otpType?: 'numeric' | 'alphanumeric';
  
  // Tree select specific
  hierarchical?: boolean;
  expandedKeys?: string[];
  
  // Mention specific
  trigger?: string;
  suggestions?: any[];
  
  // Add more options as needed for specific field types
  [key: string]: any;
}

export interface FieldBaseConfig {
  name: string;
  label: string;
  type: string;
  description?: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  validation?: Record<string, any>;
  options?: { label: string; value: string }[];
  uiOptions?: UiOptions;
}
