
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isValid, parse, isAfter, isBefore, setMonth, setYear, getYear, getMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { DateRange } from "react-day-picker";

export interface CalendarFieldProps {
  label?: string;
  placeholder?: string;
  value?: Date | Date[] | undefined;
  onChange?: (date: Date | Date[] | null) => void;
  dateFormat?: string;
  locale?: any; // Changed from Locale to any
  showIcon?: boolean;
  minDate?: Date;
  maxDate?: Date;
  multiple?: boolean;
  range?: boolean;
  showButtons?: boolean;
  showTime?: boolean;
  monthsOnly?: boolean;
  yearsOnly?: boolean;
  multipleMonths?: number;
  customTemplate?: (date: Date) => React.ReactNode;
  touchUI?: boolean;
  inline?: boolean;
  filled?: boolean;
  floatingLabel?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  required?: boolean;
  error?: string;
}

export const CalendarField = React.forwardRef<HTMLDivElement, CalendarFieldProps>(({
  label,
  placeholder = "Select date...",
  value,
  onChange,
  dateFormat = "PPP",
  locale,
  showIcon = true,
  minDate,
  maxDate,
  multiple = false,
  range = false,
  showButtons = false,
  showTime = false,
  monthsOnly = false,
  yearsOnly = false,
  multipleMonths = 1,
  customTemplate,
  touchUI = false,
  inline = false,
  filled = false,
  floatingLabel = false,
  invalid = false,
  disabled = false,
  className,
  description,
  required,
  error,
}, ref) => {
  const [date, setDate] = useState<Date | Date[] | DateRange | undefined>(value);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [open, setOpen] = useState(inline);
  
  const handleSelect = (newDate: Date | Date[] | DateRange | undefined) => {
    setDate(newDate);
    if (onChange) {
      if (newDate && 'from' in newDate && 'to' in newDate) {
        // Handle DateRange object for react-day-picker
        if (newDate.from && newDate.to) {
          onChange([newDate.from, newDate.to]);
        } else if (newDate.from) {
          onChange(newDate.from);
        } else {
          onChange(null);
        }
      } else {
        // Handle Date or Date[] directly
        onChange(newDate as Date | Date[] | null);
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setDate(today);
    setCurrentMonth(today);
    if (onChange) {
      onChange(today);
    }
  };

  const handleClear = () => {
    setDate(undefined);
    if (onChange) {
      onChange(null);
    }
  };

  const formatDate = (date: Date | Date[] | DateRange | undefined): string => {
    if (!date) return "";
    
    if (Array.isArray(date)) {
      if (range && date.length === 2) {
        return `${format(date[0], dateFormat)} to ${format(date[1], dateFormat)}`;
      }
      return date.map(d => format(d, dateFormat)).join(', ');
    }
    
    if (date && typeof date === 'object' && 'from' in date) {
      if (date.from && date.to) {
        return `${format(date.from, dateFormat)} to ${format(date.to, dateFormat)}`;
      } else if (date.from) {
        return format(date.from, dateFormat);
      }
      return "";
    }

    return format(date as Date, dateFormat);
  };

  const calendarModeProps = monthsOnly 
    ? { mode: "month" as const } 
    : yearsOnly 
      ? { mode: "year" as const } 
      : { mode: "single" as const };

  const selectionModeProps = range 
    ? { mode: "range" as const } 
    : multiple 
      ? { mode: "multiple" as const } 
      : { mode: "single" as const };

  const renderMonthNavigation = () => (
    <div className="flex justify-between items-center mb-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={handlePrevMonth}
        disabled={minDate && isBefore(subMonths(currentMonth, 1), minDate)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-1">
        <Select
          value={getMonth(currentMonth).toString()}
          onValueChange={(value) => {
            setCurrentMonth(setMonth(currentMonth, parseInt(value)));
          }}
        >
          <SelectTrigger className="h-7 w-[120px]">
            <SelectValue>{format(currentMonth, "MMMM")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }).map((_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {format(setMonth(new Date(), i), "MMMM")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={getYear(currentMonth).toString()}
          onValueChange={(value) => {
            setCurrentMonth(setYear(currentMonth, parseInt(value)));
          }}
        >
          <SelectTrigger className="h-7 w-[90px]">
            <SelectValue>{format(currentMonth, "yyyy")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }).map((_, i) => {
              const year = getYear(new Date()) - 5 + i;
              return (
                <SelectItem key={i} value={year.toString()}>
                  {year}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={handleNextMonth}
        disabled={maxDate && isAfter(addMonths(currentMonth, 1), maxDate)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderCalendarContent = () => (
    <div className={cn("space-y-2", touchUI && "touch-auto")}>
      {renderMonthNavigation()}
      
      <div className="flex space-x-4">
        {Array.from({ length: multipleMonths }).map((_, index) => (
          <Calendar
            key={index}
            {...calendarModeProps}
            {...selectionModeProps}
            selected={date}
            onSelect={handleSelect}
            defaultMonth={addMonths(currentMonth, index)}
            month={addMonths(currentMonth, index)}
            onMonthChange={(month) => index === 0 && setCurrentMonth(month)}
            disabled={disabled || ((day) => {
              if (minDate && isBefore(day, minDate)) return true;
              if (maxDate && isAfter(day, maxDate)) return true;
              return false;
            })}
            className={cn("p-3 pointer-events-auto")}
            components={customTemplate ? {
              Day: (props) => {
                const date = props.date;
                return (
                  <div {...props}>
                    {customTemplate(date)}
                  </div>
                );
              }
            } : undefined}
          />
        ))}
      </div>
      
      {showTime && (
        <div className="pt-4 flex items-center space-x-2">
          <Label className="text-xs">Time:</Label>
          <Input
            type="time"
            className="h-8"
            disabled={disabled}
            value={date instanceof Date ? format(date, "HH:mm") : ""}
            onChange={(e) => {
              if (date instanceof Date) {
                const [hours, minutes] = e.target.value.split(":");
                const newDate = new Date(date);
                newDate.setHours(parseInt(hours, 10));
                newDate.setMinutes(parseInt(minutes, 10));
                handleSelect(newDate);
              }
            }}
          />
        </div>
      )}
      
      {showButtons && (
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleToday}
            disabled={disabled}
          >
            Today
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleClear}
            disabled={disabled}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );

  const fieldClass = cn(
    "w-full",
    filled && "bg-secondary",
    invalid && "border-destructive",
    className
  );

  if (inline) {
    return (
      <div ref={ref} className="space-y-2">
        {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
        {renderCalendarContent()}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-2">
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      
      <Popover open={open} onOpenChange={setOpen}>
        <div className={cn("relative", floatingLabel && "pt-5")}>
          {floatingLabel && (
            <span className={cn(
              "absolute left-3 transition-all duration-150 pointer-events-none",
              open || date ? "text-xs top-0 text-primary" : "top-2.5 text-muted-foreground"
            )}>
              {placeholder}
            </span>
          )}
          
          <PopoverTrigger asChild>
            <div className={cn("flex rounded-md border", invalid && "border-destructive")}> 
              <Input
                className={cn(
                  fieldClass, 
                  showIcon && "rounded-r-none border-r-0",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                placeholder={!floatingLabel ? placeholder : ""}
                readOnly
                disabled={disabled}
                value={formatDate(date)}
              />
              
              {showIcon && (
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "px-2 rounded-l-none", 
                    invalid && "border-destructive",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={disabled}
                >
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0 z-50">
            {renderCalendarContent()}
          </PopoverContent>
        </div>
      </Popover>

      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

CalendarField.displayName = "CalendarField";
