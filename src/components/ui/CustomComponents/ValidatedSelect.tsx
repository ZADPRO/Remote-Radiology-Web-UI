import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  questionId: number;
  formData: { questionId: number; answer: string }[];
  handleInputChange: (questionId: number, value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string; // passed to the <select>
  required?: boolean;
  description?: string;
  disabled?: boolean;
}

const ValidatedSelect: React.FC<Props> = ({
  label,
  questionId,
  formData,
  handleInputChange,
  options,
  placeholder,
  className,
  required = false,
  description,
  disabled = false,
}) => {
  const value = formData.find((q) => q.questionId === questionId)?.answer || "";

  return (
    <div className="flex flex-col space-y-1">
      {label && (
      <Label className="font-semibold text-base flex flex-wrap gap-1">
        {label}
        {required && label && <span className="text-red-500">*</span>}
        {description && (
          <span className="text-xs text-muted-foreground font-normal">
            ({description})
          </span>
        )}
      </Label>
      )}

      <select
        name={`question-${questionId}`}
        value={value}
        onChange={(e) => handleInputChange(questionId, e.target.value)}
        required={required}
        disabled={disabled}
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", // base styling
          className // additional styling from props
        )}
      >
        {placeholder && (
          <option className="text-muted-foreground" value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ValidatedSelect;
