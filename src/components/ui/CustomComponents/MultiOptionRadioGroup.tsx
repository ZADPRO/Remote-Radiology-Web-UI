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
  className?: string;
  required?: boolean;
  description?: string;
  disabled?: boolean;
}

const MultiOptionRadioGroup: React.FC<Props> = ({
  label,
  questionId,
  formData,
  handleInputChange,
  options,
  className,
  required = false,
  description,
  disabled = false,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const name = `question-${questionId}`;

  return (
    <div className="flex flex-col">
      {label && (
        <Label className="font-semibold text-base flex flex-wrap items-center">
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {description && (
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              ({description})
            </span>
          )}
        </Label>
      )}

      <div
        className={cn(
          `ml-4 flex flex-wrap gap-x-6 gap-y-1 ${
            className ? className : "h-[auto] gap-4 sm:gap-4 sm:min-h-[35px]"
          } lg:gap-y-3 mt-3`,
          className
        )}
      >
        {options.map(({ label: optLabel, value }) => {
          const id = `opt-${questionId}-${value}`;
          return (
            <div key={value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={getAnswer(questionId) === value}
                onChange={(e) => handleInputChange(questionId, e.target.value)}
                onDoubleClick={() => handleInputChange(questionId, "")}
                required={required}
                disabled={disabled}
                className={`custom-radio ${
                  disabled ? "pointer-events-none" : ""
                }`}
              />
              <Label htmlFor={id}>{optLabel}</Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiOptionRadioGroup;
