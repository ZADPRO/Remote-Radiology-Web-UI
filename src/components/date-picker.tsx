"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Input } from "./ui/input"

interface DatePickerProps {
  className?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  required?: boolean
  name?: string
}

export default function DatePicker({
  className,
  value,
  onChange,
  placeholder = "Select a date",
  required = false,
  // name = "date",
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date)
    if (date) setOpen(false)
  }

  return (
    <div className="w-full relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              type="text"
              required={required}
              onClick={() => setOpen(true)}
              value={value ? format(value, "PPP") : ""}
              placeholder={placeholder}
              className={cn(
                "w-full cursor-pointer text-left font-normal flex flex-row-reverse items-center justify-between border border-input bg-background px-3 py-2 rounded-md text-sm shadow-sm",
                !value && "text-muted-foreground",
                className
              )}
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", className)} align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
