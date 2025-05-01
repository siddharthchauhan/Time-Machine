
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
  label: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  minDate?: Date;
  id: string;
}

const DatePickerField = ({
  label,
  date,
  onDateChange,
  minDate,
  id
}: DatePickerFieldProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            id={id}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            disabled={minDate ? (date) => date < minDate : undefined}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerField;
