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
    const selectedNumber = Number(value) || null;
 
    const handleSelect = (num: number) => {
        onChange(String(num)); // Only trigger change here
        setOpen(false);        // Close popover
    };
 
    const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
 
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("w-10", className)}
                    onClick={() => setOpen(true)}
                >
                    {selectedNumber !== null ? selectedNumber : ""}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-[80] overflow-y-auto">
                <div className="grid grid-cols-8 max-h-70 lg:grid-cols-20 gap-1">
                    {numbers.map((num) => {
                        const isSelected = selectedNumber === num;
                        return (
                            <button
                                key={num}
                                onClick={() => handleSelect(num)}
                                className={cn(
                                    "text-xs p-1 w-8 text-center rounded transition cursor-pointer",
                                    isSelected
                                        ? "bg-blue-600 text-white border-blue-700"
                                        : "bg-white hover:bg-gray-100 border border-gray-300"
                                )}
                            >
                                {num}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
};
 
export default GridNumber200;