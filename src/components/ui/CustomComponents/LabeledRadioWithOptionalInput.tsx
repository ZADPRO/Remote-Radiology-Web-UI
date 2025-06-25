import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface Props {
  name: string;
  label?: string;
  questionId: number;
  optionalInputQuestionId?: number;
  secondaryOptionalInputQuestionId?: number;
  formData: { questionId: number; answer: string }[];
  handleInputChange: (questionId: number, value: string) => void;
  options: Option[];
  showInputWhenValue?: string;
  inputPlaceholder?: string;
  secondaryInputPlaceholder?: string;
  className?: string;
  inputWidth?: string;
  secondaryinputWidth?: string;
  required?: boolean;
}

const LabeledRadioWithOptionalInput: React.FC<Props> = ({
  name,
  label,
  questionId,
  optionalInputQuestionId,
  secondaryOptionalInputQuestionId,
  formData,
  handleInputChange,
  options,
  showInputWhenValue,
  inputPlaceholder = "Specify",
  secondaryInputPlaceholder = "Additional details",
  className,
  inputWidth = "w-fit lg:w-64",
  secondaryinputWidth = "w-fit lg:w-64",
  required = false,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const selectedValue = getAnswer(questionId);
  const optionalValue = optionalInputQuestionId
    ? getAnswer(optionalInputQuestionId)
    : "";
  const secondaryOptionalValue = secondaryOptionalInputQuestionId
    ? getAnswer(secondaryOptionalInputQuestionId)
    : "";

  // Ensure each group of radios is scoped uniquely
  const radioGroupName = `${name}-${questionId}`;

  return (
    <div>
      {label && (
        <Label className="text-base font-semibold block mb-2">
          <span>{label}</span>
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div
        className={cn(
          `ml-4 flex flex-wrap gap-x-6 gap-y-1 ${
            className ? className : "h-[auto] gap-4 sm:gap-4 sm:h-[35px]"
          } lg:gap-y-3 mt-3`,
          className
        )}
      >
        {options.map(({ label, value }) => {
          const id = `${radioGroupName}-${value}`;
          const isShowInput =
            (!showInputWhenValue && selectedValue === value) ||
            (showInputWhenValue === value && selectedValue === value);

          return (
            <div
              key={value}
              className="flex items-center h-[auto] sm:h-[35px] flex-wrap gap-2"
            >
              <input
                type="radio"
                id={id}
                name={radioGroupName}
                value={value}
                checked={selectedValue === value}
                onChange={(e) => handleInputChange(questionId, e.target.value)}
                className="custom-radio"
              />
              <Label htmlFor={id}>{label}</Label>

              {isShowInput && (
                <>
                  {optionalInputQuestionId && (
                    <Input
                      className={cn("ml-2", inputWidth)}
                      placeholder={inputPlaceholder}
                      value={optionalValue}
                      onChange={(e) =>
                        handleInputChange(
                          optionalInputQuestionId,
                          e.target.value
                        )
                      }
                      required
                    />
                  )}
                  {secondaryOptionalInputQuestionId && (
                    <Input
                      className={cn("ml-2", secondaryinputWidth)}
                      placeholder={secondaryInputPlaceholder}
                      value={secondaryOptionalValue}
                      onChange={(e) =>
                        handleInputChange(
                          secondaryOptionalInputQuestionId,
                          e.target.value
                        )
                      }
                      required
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LabeledRadioWithOptionalInput;
