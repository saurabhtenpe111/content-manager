
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerSingleProps, DayPickerRangeProps } from "react-day-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarMode = "single" | "range" | "multiple";

export interface CalendarProps {
  value?: Date | Date[] | DateRange | null;
  onChange?: (value: Date | Date[] | DateRange | null) => void;
  mode?: CalendarMode;
  className?: string;
  disabled?: boolean;
  initialFocus?: boolean;
  numberOfMonths?: number;
  showOutsideDays?: boolean;
  locale?: any; // Using any for locale to avoid importing date-fns/locale types
  selected?: Date | Date[] | DateRange | null;
  onSelect?: (date: Date | Date[] | DateRange | null) => void;
  range?: boolean;
  monthsOnly?: boolean;
  inline?: boolean;
  showTime?: boolean;
}

function Calendar({
  className,
  mode = "single",
  showOutsideDays = true,
  value,
  onChange,
  selected,
  onSelect,
  numberOfMonths = 1,
  disabled,
  locale,
  range = false,
  ...props
}: CalendarProps) {
  // Merge external state (value/onChange) with internal props (selected/onSelect)
  const finalSelected = selected !== undefined ? selected : value;
  
  const handleSelect = React.useCallback(
    (date: Date | Date[] | DateRange | undefined | null) => {
      if (onSelect) {
        onSelect(date || null);
      }
      if (onChange) {
        onChange(date || null);
      }
    },
    [onChange, onSelect]
  );

  // Create the appropriate props based on the mode
  const calendarProps = React.useMemo(() => {
    if (mode === "range" || range) {
      const rangeProps: DayPickerRangeProps = {
        mode: "range",
        selected: finalSelected as DateRange,
        onSelect: handleSelect as (range: DateRange | undefined) => void,
        disabled,
        numberOfMonths,
      };
      return rangeProps;
    }

    if (mode === "multiple") {
      return {
        mode: "multiple",
        selected: finalSelected as Date[],
        onSelect: handleSelect as (dates: Date[] | undefined) => void,
        disabled,
        numberOfMonths,
      };
    }

    // Default single mode
    return {
      mode: "single",
      selected: finalSelected as Date,
      onSelect: handleSelect as (date: Date | undefined) => void,
      disabled,
      numberOfMonths,
    };
  }, [mode, range, finalSelected, handleSelect, disabled, numberOfMonths]);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      locale={locale}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...calendarProps}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
