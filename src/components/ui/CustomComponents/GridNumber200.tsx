import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GridNumberSelectorPopoverProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  className?: string;
}

const GridNumber200: React.FC<GridNumberSelectorPopoverProps> = ({
  value,
  onChange,
  min = 1,
  max = 200,
  className,
}) => {
  const [open, setOpen] = useState(false);
  // const selectedNumber = Number(value) || null;

  const handleSelect = (num: number) => {
    onChange(String(num));
    setOpen(false);
  };

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("w-28", className)}>
          {value ? `${value}%` : "Select %"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 h-[400px] overflow-y-auto w-auto lg:w-[780px]">
        <div className="grid grid-cols-10 lg:grid-cols-20 gap-1">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleSelect(num)}
              className={cn(
                "text-xs sm:text-sm p-1 sm:p-1.5 text-center rounded border transition cursor-pointer",
                Number(value) === num
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white hover:bg-gray-100 border-gray-300"
              )}
              aria-label={`Select ${num} percent`}
            >
              {num}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GridNumber200;
