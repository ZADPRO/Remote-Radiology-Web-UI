// components/ui/CustomComponents/MultiDateCalendarBody.tsx

import * as React from "react"
import { Calendar } from "@/components/calendar"
import { Button } from "@/components/ui/button"

interface MultiDateCalendarBodyProps {
  value?: Date[]
  onChange: (dates: Date[] | undefined) => void
}

const MultiDateCalendarBody: React.FC<MultiDateCalendarBodyProps> = ({
  value = [],
  onChange,
}) => {
  const handleSelect = (dates: Date[] | undefined) => {
    onChange(dates)
  }

  return (
    <div>
      <Calendar
        mode="multiple"
        selected={value}
        onSelect={handleSelect}
        selectedClassName="[&>button]:bg-[#A3B1A1] [&>button]:hover:bg-[#81927f]"
        autoFocus
      />
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange([])}
          className="text-red-500 hover:text-red-600"
        >
          Clear
        </Button>
      </div>
    </div>
  )
}

export default MultiDateCalendarBody
