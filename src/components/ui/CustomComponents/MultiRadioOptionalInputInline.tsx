import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  labelClassname?: string;
  questionId: number;
  optionalInputQuestionId?: number;
  showOptionalForValue?: string;
  formData: { questionId: number; answer: string }[];
  handleInputChange: (questionId: number, value: string) => void;
  options: Option[];
  optionalInputWidth?: string; // e.g. "w-40", "w-60", or custom Tailwind width
  className?: string;
  required?: boolean;
  description?: string;
}

const MultiRadioOptionalInputInline: React.FC<Props> = ({
  label,
  labelClassname,
  questionId,
  optionalInputQuestionId,
  showOptionalForValue = "Present",
  formData,
  handleInputChange,
  options,
  optionalInputWidth = "w-40",
  className,
  required = false,
  description,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const selectedValue = getAnswer(questionId);
  const optionalInputValue = optionalInputQuestionId
    ? getAnswer(optionalInputQuestionId)
    : "";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2 relative">
      {label && (
        <Label
          className={cn(
            "font-semibold text-base flex flex-wrap lg:items-center",
            labelClassname
          )}
        >
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
          "flex flex-wrap gap-4 h-auto lg:min-h-[40px] items-start lg:items-center",
          className
        )}
      >
        {options.map(({ label: optLabel, value }) => {
          const id = `opt-${questionId}-${value}`;
          const isSelected = selectedValue === value;
          return (
            <div key={value} className="flex items-center gap-2 min-h-10">
              <input
                type="radio"
                id={id}
                name={`question-${questionId}`}
                value={value}
                checked={isSelected}
                onChange={(e) => handleInputChange(questionId, e.target.value)}
                required={required}
                className="custom-radio"
              />
              <Label
                className={`${
                  optLabel === "S/P Mastectomy" && `text-[#a4b2a1]`
                }`}
                htmlFor={id}
              >
                {optLabel}
              </Label>

              {/* Show input beside selected option */}
              {optionalInputQuestionId &&
                isSelected &&
                value === showOptionalForValue && (
                  <Input
                    className={cn(optionalInputWidth)}
                    placeholder="Enter details"
                    value={optionalInputValue}
                    onChange={(e) =>
                      handleInputChange(optionalInputQuestionId, e.target.value)
                    }
                  />
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiRadioOptionalInputInline;

{
  /* <MultiRadioOptionalInputInline
          label="Implant Configuration"
          labelClassname="w-[10rem]"
          questionId={questionIds.breastImplants}
          optionalInputQuestionId={questionIds.implantConfiguration}
          showOptionalForValue="Present"
          optionalInputWidth="w-60" // 👈 Control width of input
          formData={reportFormData}
          handleInputChange={handleReportInputChange}
          options={[
            { label: "Unilateral Right", value: "Unilateral Right" },
            { label: "Absent", value: "Absent" },
          ]}
        /> */
}
