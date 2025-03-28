
import React, { useState, useEffect, forwardRef } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface DateRange {
  from: Date;
  to?: Date;
}

export interface CalendarProps {
  value?: Date | Date[] | DateRange | null;
  onChange?: (value: Date | Date[] | DateRange | null) => void;
  range?: boolean;
  multiple?: boolean;
  monthsOnly?: boolean;
  showTime?: boolean;
  timeOnly?: boolean;
  inline?: boolean;
  disabled?: boolean;
  multipleMonths?: number;
  showButtons?: boolean;
  dateFormat?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  floatingLabel?: boolean;
  filled?: boolean;
  showIcon?: boolean;
  showClear?: boolean;
}

// Helper function to format date based on format
const formatDate = (date: Date | null | undefined, dateFormat: string = 'PP'): string => {
  if (!date) return '';
  return format(date, dateFormat);
};

// Helper function to format time
const formatTime = (date: Date | null | undefined): string => {
  if (!date) return '';
  return format(date, 'hh:mm a');
};

// Custom footer component for the calendar
const CalendarFooter = ({ 
  date, 
  showTime, 
  onChange 
}: { 
  date?: Date | null; 
  showTime?: boolean; 
  onChange?: (date: Date) => void;
}) => {
  if (!showTime || !date) return null;

  const handleHourChange = (hour: string) => {
    if (!date || !onChange) return;
    const newDate = new Date(date);
    newDate.setHours(parseInt(hour, 10));
    onChange(newDate);
  };

  const handleMinuteChange = (minute: string) => {
    if (!date || !onChange) return;
    const newDate = new Date(date);
    newDate.setMinutes(parseInt(minute, 10));
    onChange(newDate);
  };

  return (
    <div className="p-3 border-t border-gray-200">
      <div className="flex items-center">
        <Clock className="mr-2 h-4 w-4 text-gray-500" />
        <Label className="text-sm text-gray-600">Time:</Label>
        <Select 
          value={date.getHours().toString().padStart(2, '0')} 
          onValueChange={handleHourChange}
        >
          <SelectTrigger className="w-16 h-8 ml-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }).map((_, i) => (
              <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                {i.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="mx-1">:</span>
        <Select 
          value={date.getMinutes().toString().padStart(2, '0')} 
          onValueChange={handleMinuteChange}
        >
          <SelectTrigger className="w-16 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 60 }).map((_, i) => (
              <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                {i.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  ({
    value,
    onChange,
    range = false,
    multiple = false,
    monthsOnly = false,
    showTime = false,
    timeOnly = false,
    inline = false,
    disabled = false,
    multipleMonths = 1,
    showButtons = false,
    dateFormat = 'PP',
    placeholder = 'Select date',
    label,
    helperText,
    errorMessage,
    floatingLabel = false,
    filled = false,
    showIcon = true,
    showClear = false
  }, ref) => {
    // Set up state for the selected date(s)
    const [date, setDate] = useState<Date | Date[] | DateRange | null>(value || null);
    const [isOpen, setIsOpen] = useState(false);

    // Update internal state when the value prop changes
    useEffect(() => {
      setDate(value || null);
    }, [value]);

    // Handle date selection
    const handleSelect = (newDate: Date | Date[] | DateRange | null | undefined) => {
      setDate(newDate || null);
      
      if (onChange) {
        onChange(newDate || null);
      }
      
      if (!range && !multiple && !showButtons) {
        setIsOpen(false);
      }
    };

    // Format for display
    const getFormattedValue = (): string => {
      if (!date) return '';
      
      if (Array.isArray(date)) {
        return date.map(d => formatDate(d, dateFormat)).join(', ');
      }
      
      if (date instanceof Date) {
        return showTime ? `${formatDate(date, dateFormat)} ${formatTime(date)}` : formatDate(date, dateFormat);
      }
      
      // Handle DateRange
      if ('from' in date) {
        const fromFormatted = formatDate(date.from, dateFormat);
        const toFormatted = date.to ? formatDate(date.to, dateFormat) : '';
        return toFormatted ? `${fromFormatted} - ${toFormatted}` : fromFormatted;
      }
      
      return '';
    };

    // Render the inline calendar
    if (inline) {
      return (
        <div className="space-y-2" ref={ref}>
          {label && <Label className="text-sm font-medium">{label}</Label>}
          <DayPicker
            mode={range ? "range" : multiple ? "multiple" : "single"}
            selected={date as any}
            onSelect={handleSelect as any}
            disabled={disabled}
            numberOfMonths={multipleMonths}
            captionLayout={multipleMonths > 1 ? "dropdown" : "buttons"}
            showOutsideDays
            fixedWeeks
            className={cn(
              "border rounded-md bg-white shadow-sm p-3",
              errorMessage && "border-red-500"
            )}
            footer={showTime && !range && !multiple && date instanceof Date ? (
              <CalendarFooter 
                date={date} 
                showTime={showTime} 
                onChange={(newDate) => handleSelect(newDate)} 
              />
            ) : undefined}
          />
          {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
      );
    }

    // Render the popover calendar
    return (
      <div className="space-y-2" ref={ref}>
        {label && <Label className="text-sm font-medium">{label}</Label>}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                value={getFormattedValue()}
                placeholder={placeholder}
                className={cn(
                  "cursor-pointer",
                  (showIcon || showClear) && "pr-10",
                  errorMessage && "border-red-500",
                  filled && "bg-gray-100"
                )}
                readOnly
                onClick={() => !disabled && setIsOpen(true)}
                disabled={disabled}
              />
              {showIcon && (
                <CalendarIcon 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
                />
              )}
              {showClear && date && (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(null);
                  }}
                >
                  &times;
                </Button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DayPicker
              mode={range ? "range" : multiple ? "multiple" : "single"}
              selected={date as any}
              onSelect={handleSelect as any}
              disabled={disabled}
              numberOfMonths={multipleMonths}
              captionLayout={multipleMonths > 1 ? "dropdown" : "buttons"}
              showOutsideDays
              fixedWeeks
              className="border-none shadow-none p-3"
              footer={showTime && !range && !multiple && date instanceof Date ? (
                <CalendarFooter 
                  date={date} 
                  showTime={showTime} 
                  onChange={(newDate) => handleSelect(newDate)} 
                />
              ) : undefined}
            />
            {showButtons && (
              <div className="flex items-center justify-end gap-2 p-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Apply
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>
    );
  }
);

Calendar.displayName = "Calendar";
