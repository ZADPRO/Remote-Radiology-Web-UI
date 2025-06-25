import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type TimePickerProps = {
  value: string | null;
  onChange: (val: string) => void;
  className?: string; // allow custom styling, e.g. red border on error
};

function to12HourFormat(time24: string | null) {
  if (!time24) time24 = "00:00";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return { hour: hour.toString(), minute, period };
}

function to24HourFormat(hour: string, minute: string, period: string) {
  let h = parseInt(hour, 10);
  if (period === "AM") {
    h = h === 12 ? 0 : h;
  } else {
    h = h === 12 ? 12 : h + 12;
  }
  return `${h.toString().padStart(2, "0")}:${minute}`;
}

export function CustomTimePicker({ value, onChange, className = "" }: TimePickerProps) {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const periods = ["AM", "PM"];

  const { hour, minute, period } = to12HourFormat(value);

  const handleChange = (newHour = hour, newMinute = minute, newPeriod = period) => {
    const newValue = to24HourFormat(newHour, newMinute, newPeriod);
    onChange(newValue);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={`p-1 ${className}`} variant="outline">
          {`${hour.padStart(2, "0")}:${minute} ${period}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col sm:flex-row sm:space-y-0 sm:space-x-2 p-2 w-auto">
        {/* Hour */}
        <Select
          value={hour}
          onValueChange={(val) => handleChange(val, minute, period)}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Minute */}
        <Select
          value={minute}
          onValueChange={(val) => handleChange(hour, val, period)}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Minute" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* AM/PM */}
        <Select
          value={period}
          onValueChange={(val) => handleChange(hour, minute, val)}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
}
