import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface YearPickerProps {
  value?: number;
  onChange: (year: number) => void;
  startYear?: number;
  endYear?: number;
  className?: string;
}

export function YearPicker({
  value,
  onChange,
  startYear = new Date().getFullYear() - 10,
  endYear = new Date().getFullYear() + 10,
  className,
}: YearPickerProps) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("justify-between", className)}>
          {value ?? "Select year"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-[250px] overflow-y-auto w-[--radix-popover-trigger-width]" // 👈 Matches trigger width
      >
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={year === value ? "default" : "ghost"}
              className={cn("text-sm", year === currentYear && "font-semibold")}
              onClick={() => {
                onChange(year);
                setOpen(false);
              }}
            >
              {year}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
