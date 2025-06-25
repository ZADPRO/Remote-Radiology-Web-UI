import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  questionId: number;
  formData: { questionId: number; answer: string }[];
  handleInputChange: (questionId: number, value: string) => void;
  options: Option[];
  className?: string;
  required?: boolean;
  description?: string;
}

const TwoOptionRadioGroup: React.FC<Props> = ({
  label,
  questionId,
  formData,
  handleInputChange,
  options,
  className = "flex gap-6 mt-3",
  required = false,
  description,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const name = `question-${questionId}`;

  return (
    <div className="flex flex-col">
      <Label className="font-semibold text-base flex flex-wrap gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
        {description && (
          <span className="text-xs text-muted-foreground font-normal">
            ({description})
          </span>
        )}
      </Label>

      <div className={cn("ml-4", className)}>
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
                onChange={(e) =>
                  handleInputChange(questionId, e.target.value)
                }
                required={required}
                className="custom-radio"
              />
              <Label htmlFor={id}>{optLabel}</Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TwoOptionRadioGroup;
