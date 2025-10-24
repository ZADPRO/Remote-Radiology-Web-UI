import React, { useRef } from "react";
import { Calendar } from "lucide-react";

type Props = {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
};

const DefaultDatePicker: React.FC<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.showPicker?.(); // modern browsers support showPicker() for date inputs
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        className="w-full font-normal bg-background px-3 py-2 rounded-md text-sm shadow-sm border-none outline-none pr-10"
        type="date"
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        disabled={props.disabled}
      />
      <Calendar
        onClick={handleIconClick}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
        size={16}
      />
    </div>
  );
};

export default DefaultDatePicker;
