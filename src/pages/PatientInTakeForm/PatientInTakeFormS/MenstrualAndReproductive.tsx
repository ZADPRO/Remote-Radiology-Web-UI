import React from "react";
import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { IntakeOption } from "../MainInTakeForm";

interface QuestionIds {
  ageFirstMenstrualPeriod: number;
  ageLiveBirth: number;
  liveBirthApplicable: number;
  childrenCount: number;
  breastFeedingHistory: number;
  breastFeedingDuration: number;
  hormoneBirthControlUse: number;
  hormoneBirthControlUseDuration: number;
  hormoneTherapy: number;
  hormoneTherapyDuration: number;
  ageMenopause: number;
  ageMenopauseApplicable: number;
  lactating: number;
  lactatingDuration: number;
  pregnant: number;
  pregnantDuration: number;
  additionalComments: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const MenstrualAndReproductive: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const renderRadioGroup = (
    name: string,
    questionId: number,
    options: string[]
  ) => (
    <div className="flex flex-wrap items-center gap-6">
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
          <Label htmlFor={`${name}-${value.toLowerCase()}`}>{value}</Label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <FormHeader
        FormTitle="Menstrual and Reproductive History"
        className="uppercase"
      />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-6 pb-10 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
          <Label className="text-bold text-base w-[290px]">
            A. Age at first menstrual period
          </Label>
          <Input
            type="number"
            value={getAnswer(questionIds.ageFirstMenstrualPeriod)}
            onChange={(e) =>
              handleInputChange(
                questionIds.ageFirstMenstrualPeriod,
                e.target.value
              )
            }
            className="w-24 h-10 text-sm"
            placeholder="Age"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
          <Label className="text-bold text-base w-[290px]">
            B. Age at first live birth
          </Label>
          <div className="flex items-center gap-2">
<Input
            type="number"
            value={getAnswer(questionIds.ageLiveBirth)}
            onChange={(e) =>
              handleInputChange(questionIds.ageLiveBirth, e.target.value)
            }
            className="w-24 text-sm"
            placeholder="Age"
            disabled={getAnswer(questionIds.liveBirthApplicable) === "YES"}
          />
          <div className="flex items-center ml-0 sm:ml-3 space-x-2">
            <Checkbox2
              id="liveBirthApplicable"
              checked={getAnswer(questionIds.liveBirthApplicable) === "YES"}
              onCheckedChange={(checked) => {
                const newValue = checked ? "YES" : "NO";
                handleInputChange(questionIds.liveBirthApplicable, newValue);
                if (checked) {
                  handleInputChange(questionIds.ageLiveBirth, ""); // Clear age if N/A
                }
              }}
            />
            <Label htmlFor="liveBirthApplicable">N/A</Label>
          </div>
          </div>
          
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 ">
          <Label className="text-bold text-base w-[290px]">C. Number of children</Label>
          <Input
            type="number"
            value={getAnswer(questionIds.childrenCount)}
            onChange={(e) =>
              handleInputChange(questionIds.childrenCount, e.target.value)
            }
            className="w-24 text-sm"
            placeholder="Specify"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center h-[auto] sm:h-[40px] gap-4 sm:gap-0">
          <Label className="text-bold text-base w-[290px]">
            D. Breastfeeding history
          </Label>
          {renderRadioGroup("breastFeedingHistory", questionIds.breastFeedingHistory, ["No", "Yes"])}
          {getAnswer(questionIds.breastFeedingHistory) === "Yes" && (
            <div className="flex items-center  sm:mt-0  gap-2 ml-4">
              <Label className="text-sm">Duration</Label>
              <Input
                type="text"
                value={getAnswer(questionIds.breastFeedingDuration)}
                onChange={(e) =>
                  handleInputChange(
                    questionIds.breastFeedingDuration,
                    e.target.value
                  )
                }
                className="w-24 text-sm"
                placeholder="Months"
                required
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center h-[auto] sm:h-[40px] gap-4 sm:gap-0">
          <Label className="text-bold text-base w-[290px]">
            E. Hormonal birth control use
          </Label>
          {renderRadioGroup("hormoneBirthControlUse", questionIds.hormoneBirthControlUse, ["Never", "Current", "Past"])}
          {getAnswer(questionIds.hormoneBirthControlUse) === "Past" && (
            <div className="flex items-center gap-2 ml-4">
              <Label className="text-sm">Duration</Label>
              <Input
                type="text"
                value={getAnswer(questionIds.hormoneBirthControlUseDuration)}
                onChange={(e) =>
                  handleInputChange(
                    questionIds.hormoneBirthControlUseDuration,
                    e.target.value
                  )
                }
                className="w-24 text-sm"
                placeholder="Months"
                required
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center h-[auto] sm:h-[40px] gap-4 sm:gap-0">
          <Label className="text-bold text-base w-[290px]">
            F. Hormone replacement therapy (HRT)
          </Label>
          {renderRadioGroup("hormoneTherapy", questionIds.hormoneTherapy, ["Never", "Current", "Past"])}
          {getAnswer(questionIds.hormoneTherapy) === "Past" && (
            <div className="flex items-center gap-2 ml-4">
              <Label className="text-sm">Duration</Label>
              <Input
                type="text"
                value={getAnswer(questionIds.hormoneTherapyDuration)}
                onChange={(e) =>
                  handleInputChange(
                    questionIds.hormoneTherapyDuration,
                    e.target.value
                  )
                }
                className="w-24 text-sm"
                placeholder="Months"
                required
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
          <Label className="text-bold text-base w-[290px]">
            G. Age at menopause (if applicable)
          </Label>
          <div className="flex items-center gap-2">
<Input
            type="number"
            value={getAnswer(questionIds.ageMenopause)}
            onChange={(e) =>
              handleInputChange(questionIds.ageMenopause, e.target.value)
            }
            className="w-24 text-sm"
            placeholder="Age"
            disabled={getAnswer(questionIds.ageMenopauseApplicable) === "YES"}
          />
          <div className="flex items-center ml-0 sm:ml-3 space-x-2">
            <Checkbox2
              id="ageMenopauseApplicable"
              checked={getAnswer(questionIds.ageMenopauseApplicable) === "YES"}
              onCheckedChange={(checked) => {
                const newValue = checked ? "YES" : "NO";
                handleInputChange(questionIds.ageMenopauseApplicable, newValue);
                if (checked) {
                  handleInputChange(questionIds.ageMenopause, ""); // Clear age if N/A
                }
              }}
            />
            <Label htmlFor="ageMenopauseApplicable">N/A</Label>
          </div>
          </div>
          
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center h-[auto] sm:h-[40px] gap-4 sm:gap-0">
          <Label className="text-bold text-base w-[290px]">
            H. Are you Lactating / Nursing now?
          </Label>
          {renderRadioGroup("lactating", questionIds.lactating, ["No", "Yes"])}
          {getAnswer(questionIds.lactating) === "Yes" && (
            <div className="flex items-center gap-2 ml-4">
              <Label className="text-sm">Duration</Label>
              <Input
                type="text"
                placeholder="Months"
                value={getAnswer(questionIds.lactatingDuration)}
                onChange={(e) =>
                  handleInputChange(
                    questionIds.lactatingDuration,
                    e.target.value
                  )
                }
                className="w-24 text-sm"
                required
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center h-[auto] sm:h-[40px] gap-4 sm:gap-0">
          <Label className="text-bold text-base w-[290px]">
            I. Are you Pregnant now?
          </Label>
          {renderRadioGroup("pregnant", questionIds.pregnant, ["No", "Yes"])}
          {getAnswer(questionIds.pregnant) === "Yes" && (
            <div className="flex items-center gap-2 ml-4">
              <Label className="text-sm">Duration</Label>
              <Input
                type="text"
                placeholder="Months"
                value={getAnswer(questionIds.pregnantDuration)}
                onChange={(e) =>
                  handleInputChange(
                    questionIds.pregnantDuration,
                    e.target.value
                  )
                }
                className="w-24 text-sm"
                required
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center h-[auto] sm:h-[40px] gap-4 sm:gap-0">
          <Label className="text-bold text-base w-[290px]">G. Others / Additional Comments</Label>
          <Textarea
            className="w-full lg:w-64"
            value={getAnswer(questionIds.additionalComments)}
            onChange={(e) =>
              handleInputChange(questionIds.additionalComments, e.target.value)
            }
            placeholder="Enter Details"
          />
        </div>
      </div>
    </div>
  );
};

export default MenstrualAndReproductive;
