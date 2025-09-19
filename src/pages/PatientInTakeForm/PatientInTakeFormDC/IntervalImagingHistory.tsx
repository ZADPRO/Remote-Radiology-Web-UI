import React from "react";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { IntakeOption } from "../PatientInTakeForm";
import { Textarea } from "@/components/ui/textarea";

interface QuestionIds {
  noneCheckbox: number;

  mammogramCheckbox: number;
  mammogramDate: number;
  mammogramResult: number;

  ultrasoundCheckbox: number;
  ultrasoundDate: number;
  ultrasoundResult: number;

  mriCheckbox: number;
  mriDate: number;
  mriResult: number;

  otherCheckbox: number;
  otherText: number;
  otherDate: number;
  otherResult: number;

  intervalBiopsy: number;
  intervalBiopsyType: number;
  intervalBiopsyDate: number;
  intervalBiopsyResult: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const IntervalImagingHistory: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const isChecked = (id: number) => getAnswer(id) === "true";
  const isNoneSelected = isChecked(questionIds.noneCheckbox);

  const clearAllFields = () => {
    const idsToClear = [
      questionIds.mammogramCheckbox,
      questionIds.mammogramDate,
      questionIds.mammogramResult,
      questionIds.ultrasoundCheckbox,
      questionIds.ultrasoundDate,
      questionIds.ultrasoundResult,
      questionIds.mriCheckbox,
      questionIds.mriDate,
      questionIds.mriResult,
      questionIds.otherCheckbox,
      questionIds.otherText,
      questionIds.otherDate,
      questionIds.otherResult,
    ];
    idsToClear.forEach((id) => handleInputChange(id, ""));
  };

  const handleNoneToggle = (checked: boolean) => {
    handleInputChange(questionIds.noneCheckbox, String(checked));
    if (checked) clearAllFields();
  };

  return (
    <div className="flex flex-col h-full relative">
      <FormHeader FormTitle="Interval Imaging History" className="uppercase" />
      <div className={readOnly ? "pointer-events-none" : ""}>
        <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10">
          <div className="flex flex-col gap-4">
            <Label className="text-base font-semibold">
              A. Additional breast imaging since last QT scan (check all that
              apply):
            </Label>

            <div className="flex flex-col gap-4 pl-4">
              {/* None */}
              <div className="flex items-center gap-4 min-h-10">
                <div className="flex items-center w-full lg:w-64 gap-2">
                  <Checkbox2
                    checked={isNoneSelected}
                    onCheckedChange={(checked) =>
                      handleNoneToggle(Boolean(checked))
                    }
                  />
                  <label>None</label>
                </div>
              </div>

              {/* Mammogram */}
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-center min-h-10">
                <div className="flex items-center w-full lg:w-64 gap-2">
                  <Checkbox2
                    disabled={isNoneSelected}
                    checked={isChecked(questionIds.mammogramCheckbox)}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        questionIds.mammogramCheckbox,
                        String(checked)
                      )
                    }
                  />
                  <label>Mammogram</label>
                </div>
                {isChecked(questionIds.mammogramCheckbox) &&
                  !isNoneSelected && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                      <div className="w-full sm:w-48">
                        <Input
                          value={getAnswer(questionIds.mammogramDate)}
                          onChange={(val) =>
                            handleInputChange(
                              questionIds.mammogramDate,
                              val.target.value
                            )
                          }
                          placeholder="Date / Duration"
                        />
                      </div>
                      <Input
                        placeholder="Results"
                        value={getAnswer(questionIds.mammogramResult)}
                        onChange={(e) =>
                          handleInputChange(
                            questionIds.mammogramResult,
                            e.target.value
                          )
                        }
                        className="w-full sm:w-64"
                      />
                    </div>
                  )}
              </div>

              {/* Ultrasound */}
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-center min-h-10">
                <div className="flex items-center w-full lg:w-64 gap-2">
                  <Checkbox2
                    disabled={isNoneSelected}
                    checked={isChecked(questionIds.ultrasoundCheckbox)}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        questionIds.ultrasoundCheckbox,
                        String(checked)
                      )
                    }
                  />
                  <label>Ultrasound</label>
                </div>
                {isChecked(questionIds.ultrasoundCheckbox) &&
                  !isNoneSelected && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                      <div className="w-full sm:w-48">
                        <Input
                          value={getAnswer(questionIds.ultrasoundDate)}
                          onChange={(val) =>
                            handleInputChange(
                              questionIds.ultrasoundDate,
                              val.target.value
                            )
                          }
                          placeholder="Date / Duration"
                        />
                      </div>
                      <Input
                        placeholder="Results"
                        value={getAnswer(questionIds.ultrasoundResult)}
                        onChange={(e) =>
                          handleInputChange(
                            questionIds.ultrasoundResult,
                            e.target.value
                          )
                        }
                        className="w-full sm:w-64"
                      />
                    </div>
                  )}
              </div>

              {/* MRI */}
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-center min-h-10">
                <div className="flex items-center w-full lg:w-64 gap-2">
                  <Checkbox2
                    disabled={isNoneSelected}
                    checked={isChecked(questionIds.mriCheckbox)}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        questionIds.mriCheckbox,
                        String(checked)
                      )
                    }
                  />
                  <label>MRI</label>
                </div>
                {isChecked(questionIds.mriCheckbox) && !isNoneSelected && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                    <div className="w-full sm:w-48">
                      <Input
                        value={getAnswer(questionIds.mriDate)}
                        onChange={(val) =>
                          handleInputChange(
                            questionIds.mriDate,
                            val.target.value
                          )
                        }
                        placeholder="Date / Duration"
                      />
                    </div>
                    <Input
                      placeholder="Results"
                      value={getAnswer(questionIds.mriResult)}
                      onChange={(e) =>
                        handleInputChange(questionIds.mriResult, e.target.value)
                      }
                      className="w-full sm:w-64"
                    />
                  </div>
                )}
              </div>

              {/* Other */}
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-center min-h-10">
                <div className="flex items-center w-full lg:w-64 gap-2">
                  <Checkbox2
                    disabled={isNoneSelected}
                    checked={isChecked(questionIds.otherCheckbox)}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        questionIds.otherCheckbox,
                        String(checked)
                      )
                    }
                  />
                  <Input
                    placeholder="Other"
                    className="w-full"
                    disabled={
                      !isChecked(questionIds.otherCheckbox) || isNoneSelected
                    }
                    value={getAnswer(questionIds.otherText)}
                    onChange={(e) =>
                      handleInputChange(questionIds.otherText, e.target.value)
                    }
                  />
                </div>
                {isChecked(questionIds.otherCheckbox) && !isNoneSelected && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                    <div className="w-full sm:w-48">
                      <Input
                        value={getAnswer(questionIds.otherDate)}
                        onChange={(val) =>
                          handleInputChange(
                            questionIds.otherDate,
                            val.target.value
                          )
                        }
                        placeholder="Date / Duration"
                      />
                    </div>
                    <Input
                      placeholder="Results"
                      value={getAnswer(questionIds.otherResult)}
                      onChange={(e) =>
                        handleInputChange(
                          questionIds.otherResult,
                          e.target.value
                        )
                      }
                      className="w-full sm:w-64"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <MultiOptionRadioGroup
            label="B. Interval biopsy or procedure"
            questionId={questionIds.intervalBiopsy}
            handleInputChange={handleInputChange}
            formData={formData}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
          />

          {getAnswer(questionIds.intervalBiopsy) === "Yes" && (
            <div className="pl-4 space-y-4">
              <Label>If yes,</Label>

              <div className="flex flex-col lg:flex-col gap-2 lg:gap-4 items-start min-h-10">
                <div className="space-y-2">
                  <Label>Type</Label>

                  <Textarea
                    placeholder="Type"
                    value={getAnswer(questionIds.intervalBiopsyType)}
                    onChange={(e) =>
                      handleInputChange(
                        questionIds.intervalBiopsyType,
                        e.target.value
                      )
                    }
                    className="w-64"
                  />
                </div>

                <div className="w-full space-y-2 sm:w-48">
                  <Label>Date</Label>
                  <Input
                    value={
                      getAnswer(questionIds.intervalBiopsyDate)
                       }
                    onChange={(val) =>
                      handleInputChange(
                        questionIds.intervalBiopsyDate,
                        val.target.value
                      )
                    }
                    placeholder="Date / Duration"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Results</Label>
                  <Textarea
                    placeholder="Results"
                    value={getAnswer(questionIds.intervalBiopsyResult)}
                    onChange={(e) =>
                      handleInputChange(
                        questionIds.intervalBiopsyResult,
                        e.target.value
                      )
                    }
                    className="w-full sm:w-64"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntervalImagingHistory;
