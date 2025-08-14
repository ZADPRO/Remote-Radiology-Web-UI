import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, {useEffect} from "react";

interface IntakeOption {
  questionId: number;
  answer: string;
}

interface QuestionIds {
  priority: number;
  Adhesive: number;
  Latex: number;
  Chlorine: number;
  Others: number;
  OtherSpecify: number;
  bhrt: number;
  Oral: number;
  Estrogen: number;
  Chemo: number;
  Progesterone: number;
  Neoadjuvant: number;
  Tamoxifen: number;
  Supplements: number;
  Aromatase: number;
  MedicationOthers: number;
  MedicationOtherSpecify: number;
}

interface Props {
  technicianFormData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const AllergiesMedications: React.FC<Props> = ({
  technicianFormData,
  handleInputChange,
  questionIds,
  readOnly,
}) => {
  useEffect(() => {
    handleInputChange(1, "Routine")
  }, []);

  const getAnswer = (id: number) =>
    technicianFormData.find((q) => q.questionId === id)?.answer || "";

  const renderRadioGroup = (
    name: string,
    questionId: number,
    options: string[]
  ) => (
    <div className="flex flex-wrap gap-4">
      {options.map((value) => (
        <div key={value} className="flex items-center space-x-2">
          <input
            type="radio"
            id={`${name}-${value.toLowerCase()}`}
            name={name}
            value={value}
            checked={getAnswer(questionId) === value}
            onChange={(e) => handleInputChange(questionId, e.target.value)}
            className="custom-radio"
          />
          <Label
            className={`text-4xl ${value === "Urgent" ? "text-red-500": "text-green-800"} font-semibold`}
            htmlFor={`${name}-${value.toLowerCase()}`}
          >
            {value}
          </Label>
        </div>
      ))}
    </div>
  );

  const renderCheckbox = (
    label: string,
    id: number,
    className: string = ""
  ) => (
    <div
      className={cn(
        `flex items-center w-30 h-[auto] sm:h-[40px] gap-2 flex-shrink-0 relative`,
        className
      )}
    >
      <Checkbox2
        className="bg-white data-[state=checked]:text-[#f9f4ed]"
        checked={getAnswer(id) === "true"}
        onClick={() =>
          handleInputChange(id, getAnswer(id) === "true" ? "" : "true")
        }
      />
      <div className="text-sm sm:text-base font-medium">{label}</div>
    </div>
  );

  return (
    <div className={`flex h-full flex-col gap-6 p-4 sm:p-6 overflow-y-auto`}>
      <div className={`${readOnly ? "pointer-events-none" : ""} space-y-4`}>
        {/* Priority */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Label className="w-full sm:w-1/3 text-base font-semibold">
            a. What is the priority level of this request?
          </Label>
          <div className="w-full sm:w-2/3">
            {renderRadioGroup("priority", questionIds.priority, [
              "Routine",
              "Urgent",
            ])}
          </div>
        </div>

        {/* Allergies */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Label className="w-full sm:w-1/3 text-base font-semibold">
            b. Allergies
          </Label>
          <div className="w-full sm:w-2/3 flex flex-wrap gap-4">
            {renderCheckbox("Adhesive", questionIds.Adhesive)}
            {renderCheckbox("Latex", questionIds.Latex)}
            {renderCheckbox("Chlorine", questionIds.Chlorine)}
            {renderCheckbox("Others", questionIds.Others)}
            {getAnswer(questionIds.Others) === "true" && (
              <Textarea
                placeholder="Specify"
                className="w-64"
                value={getAnswer(questionIds.OtherSpecify)}
                onChange={(e) =>
                  handleInputChange(questionIds.OtherSpecify, e.target.value)
                }
                required
              />
            )}
          </div>
        </div>

        {/* Medications */}
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <Label className="w-full sm:w-1/3 text-base font-semibold">
            c. Medications
          </Label>
          <div className="w-full sm:w-2/3 flex flex-wrap gap-2">
            {renderCheckbox("bHRT", questionIds.bhrt, "w-60")}
            {renderCheckbox("Oral Contraceptive", questionIds.Oral, "w-60")}
            {renderCheckbox("Estrogen", questionIds.Estrogen, "w-60")}
            {renderCheckbox("Chemo", questionIds.Chemo, "w-60")}
            {renderCheckbox("Progesterone", questionIds.Progesterone, "w-60")}
            {renderCheckbox(
              "Neoadjuvant Therapy",
              questionIds.Neoadjuvant,
              "w-60"
            )}
            {renderCheckbox("Tamoxifen", questionIds.Tamoxifen, "w-60")}
            {renderCheckbox("Supplements", questionIds.Supplements, "w-60")}
            {renderCheckbox(
              "Aromatase Inhibitors",
              questionIds.Aromatase,
              "w-60"
            )}

            {/* Others checkbox and specify input on same line */}
            <div className="flex items-start gap-2">
              {renderCheckbox("Others", questionIds.MedicationOthers, "")}
              {getAnswer(questionIds.MedicationOthers) === "true" && (
                <Textarea
                  placeholder="Specify"
                  className="flex-1 w-64"
                  value={getAnswer(questionIds.MedicationOtherSpecify)}
                  onChange={(e) =>
                    handleInputChange(
                      questionIds.MedicationOtherSpecify,
                      e.target.value
                    )
                  }
                  required
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllergiesMedications;
