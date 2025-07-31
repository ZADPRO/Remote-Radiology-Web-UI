import React from "react";
import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { IntakeOption } from "../PatientInTakeForm";

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
  readOnly: boolean;
  name?: string;
  custId?: string;
}

const MenstrualAndReproductive: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly,
  name,
  custId,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const renderRadioGroup = (
    name: string,
    questionId: number,
    options: string[]
  ) => (
    <div className="flex flex-wrap items-center gap-4">
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
    <div className="flex flex-col h-full relative">
      <FormHeader
        FormTitle="Menstrual and Reproductive History"
        className="uppercase"
        name={name}
        custId={custId}
      />
      <div className={readOnly ? "pointer-events-none" : ""}>
        <div className="flex-grow overflow-y-auto px-4 py-6 sm:px-6 lg:px-20 space-y-6 pb-10 w-full">
          {/* A */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label className="font-medium text-sm sm:text-base w-full sm:w-[290px]">
              A. Age at first menstrual period
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                value={getAnswer(questionIds.ageFirstMenstrualPeriod)}
                onChange={(e) =>
                  handleInputChange(
                    questionIds.ageFirstMenstrualPeriod,
                    e.target.value
                  )
                }
                className="w-24 text-sm"
                placeholder="Age"
              />
              <Label className="text-sm sm:text-base">Age</Label>
            </div>
          </div>

          {/* B */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label className="font-medium text-sm sm:text-base w-full sm:w-[290px]">
              B. Age at first live birth
            </Label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={getAnswer(questionIds.ageLiveBirth)}
                  onChange={(e) =>
                    handleInputChange(
                      questionIds.ageLiveBirth,
                      e.target.value
                    )
                  }
                  className="w-24 text-sm"
                  placeholder="Age"
                  disabled={getAnswer(questionIds.liveBirthApplicable) === "YES"}
                />
                <Label className="text-sm sm:text-base">Age</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox2
                  id="liveBirthApplicable"
                  checked={getAnswer(questionIds.liveBirthApplicable) === "YES"}
                  onCheckedChange={(checked) => {
                    const newValue = checked ? "YES" : "NO";
                    handleInputChange(
                      questionIds.liveBirthApplicable,
                      newValue
                    );
                    if (checked) {
                      handleInputChange(questionIds.ageLiveBirth, "");
                    }
                  }}
                />
                <Label htmlFor="liveBirthApplicable">N/A</Label>
              </div>
            </div>
          </div>

          {/* C */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label className="font-medium text-sm sm:text-base w-full sm:w-[290px]">
              C. Number of children
            </Label>
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

          {/* D */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <Label className="font-medium text-sm sm:text-base w-full sm:w-[290px]">
              D. Breastfeeding history
            </Label>
            <div className="flex flex-col gap-3">
              {renderRadioGroup(
                "breastFeedingHistory",
                questionIds.breastFeedingHistory,
                ["No", "Yes"]
              )}
              {getAnswer(questionIds.breastFeedingHistory) === "Yes" && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Duration (Months)</Label>
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
          </div>

          {/* E */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <Label className="font-medium text-sm sm:text-base w-full sm:w-[290px]">
              E. Hormonal birth control use
            </Label>
            <div className="flex flex-col gap-3">
              {renderRadioGroup(
                "hormoneBirthControlUse",
                questionIds.hormoneBirthControlUse,
                ["Never", "Current", "Past"]
              )}
              {getAnswer(questionIds.hormoneBirthControlUse) === "Past" && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Duration (Months)</Label>
                  <Input
                    type="text"
                    value={getAnswer(
                      questionIds.hormoneBirthControlUseDuration
                    )}
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
          </div>

          {/* F */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <Label className="font-medium text-sm sm:text-base w-full sm:w-[290px]">
              F. Hormone replacement therapy (HRT)
            </Label>
            <div className="flex flex-col gap-3">
              {renderRadioGroup("hormoneTherapy", questionIds.hormoneTherapy, [
                "Never",
                "Current",
                "Past",
              ])}
              {getAnswer(questionIds.hormoneTherapy) === "Past" && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Duration (Months)</Label>
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
          </div>

          {/* G */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label className="font-medium text-sm sm:text-base w-full sm:w-[290px]">
              G. Age at menopause (if applicable)
            </Label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={getAnswer(questionIds.ageMenopause)}
                  onChange={(e) =>
                    handleInputChange(
                      questionIds.ageMenopause,
                      e.target.value
                    )
                  }
                  className="w-24 text-sm"
                  placeholder="Age"
                  disabled={
                    getAnswer(questionIds.ageMenopauseApplicable) === "YES"
                  }
                />
                <Label className="text-sm sm:text-base">Age</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox2
                  id="ageMenopauseApplicable"
                  checked={
                    getAnswer(questionIds.ageMenopauseApplicable) === "YES"
                  }
                  onCheckedChange={(checked) => {
                    const newValue = checked ? "YES" : "NO";
                    handleInputChange(
                      questionIds.ageMenopauseApplicable,
                      newValue
                    );
                    if (checked) {
                      handleInputChange(questionIds.ageMenopause, "");
                    }
                  }}
                />
                <Label htmlFor="ageMenopauseApplicable">N/A</Label>
              </div>
            </div>
          </div>

          {/* H */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <Label className="font-medium text-sm sm:text-base w-full sm:w-[290px]">
              H. Are you Lactating / Nursing now?
            </Label>
            <div className="flex flex-col gap-3">
              {renderRadioGroup("lactating", questionIds.lactating, [
                "No",
                "Yes",
              ])}
              {getAnswer(questionIds.lactating) === "Yes" && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Duration (Months)</Label>
                  <Input
                    type="text"
                    value={getAnswer(questionIds.lactatingDuration)}
                    onChange={(e) =>
                      handleInputChange(
                        questionIds.lactatingDuration,
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
          </div>

          {/* I */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <Label className="font-medium text-sm sm:text-base w-full sm:w-[290px]">
              I. Are you Pregnant now?
            </Label>
            <div className="flex flex-col gap-3">
              {renderRadioGroup("pregnant", questionIds.pregnant, [
                "No",
                "Yes",
              ])}
              {getAnswer(questionIds.pregnant) === "Yes" && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Duration (Months)</Label>
                  <Input
                    type="text"
                    value={getAnswer(questionIds.pregnantDuration)}
                    onChange={(e) =>
                      handleInputChange(
                        questionIds.pregnantDuration,
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
          </div>

          {/* J */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <Label className="font-medium text-sm sm:text-base w-full sm:w-[290px]">
              J. Others / Additional Comments
            </Label>
            <Textarea
              className="w-full sm:w-2/3"
              value={getAnswer(questionIds.additionalComments)}
              onChange={(e) =>
                handleInputChange(
                  questionIds.additionalComments,
                  e.target.value
                )
              }
              placeholder="Enter Details"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenstrualAndReproductive;
