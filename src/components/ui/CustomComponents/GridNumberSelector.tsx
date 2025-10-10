import React, { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GridNumberSelectorPopoverProps {
  questionId: number
  handleInputChange: (questionId: number, value: string) => void
  min?: number
  max?: number
  className?: string
  value?: string
}

const GridNumberSelectorPopover: React.FC<GridNumberSelectorPopoverProps> = ({
  questionId,
  value,
  handleInputChange,
  min = 1,
  max = 100,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (num?: number) => {
    handleInputChange(questionId, num ? String(num) : "")
    setIsOpen(false)
  }

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button onDoubleClick={() => handleSelect()} variant="outline" size="sm" className={cn("w-28", className)}>
          {value ? `${value}%` : "Select %"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <div className="grid grid-cols-10 gap-1">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleSelect(num)}
              className={cn(
                "text-xs p-1 text-center rounded transition cursor-pointer",
                Number(value) === num
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white hover:bg-gray-100 border-gray-300"
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}


export default GridNumberSelectorPopover