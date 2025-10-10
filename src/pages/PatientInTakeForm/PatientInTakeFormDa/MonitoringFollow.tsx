import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
  currentRec: number;
  Shorttermother: number;
  otherother: number;
  nextappointment: number;
  additionalRecOther: number; // New ID for "Other" in Additional Imaging
  additionalrec: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const MonitoringFollow: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader
        FormTitle="MONITORING AND FOLLOW-UP PLAN"
        className="uppercase"
      />
      <div className={readOnly ? "pointer-events-none" : ""}>
        <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-6 pb-10">
          {/*A. Current recommendations*/}
          <div className="flex flex-col gap-4">
            <Label className="font-bold text-base">
              A. Current recommendations
            </Label>
            <div className="flex flex-col gap-5 lg:gap-1">
              {[
                "Short-term follow-up imaging",
                "Surgical consultation",
                "Repeat biopsy",
                "Excisional biopsy",
                "Other",
                "Unknown",
              ].map((option) => (
                <div
                  key={option}
                  className="ml-4 gap-4 lg:gap-0 flex flex-col lg:flex-row   h-[auto] lg:h-[40px]"
                >
                  <div className="flex space-x-2 items-center ">
                    <input
                      type="radio"
                      name="Current"
                      value={option}
                      checked={getAnswer(questionIds.currentRec) === option}
                      onChange={() =>
                        handleInputChange(questionIds.currentRec, option)
                      }
                      onDoubleClick={() =>
                        handleInputChange(questionIds.currentRec, "")
                      }
                      className="custom-radio"
                      id={option === "Other" ? "SupportOther" : option}
                    />
                    <Label
                      htmlFor={option === "Other" ? "SupportOther" : option}
                      className="w-[230px]"
                    >
                      {option}
                    </Label>
                  </div>
                  {getAnswer(questionIds.currentRec) ===
                    "Short-term follow-up imaging" &&
                    option === "Short-term follow-up imaging" && (
                      <Input
                        type="text"
                        value={getAnswer(questionIds.Shorttermother)}
                        onChange={(e) =>
                          handleInputChange(
                            questionIds.Shorttermother,
                            e.target.value
                          )
                        }
                        required
                        placeholder="Specify Timeframe"
                        className="w-64 text-sm"
                      />
                    )}

                  {getAnswer(questionIds.currentRec) === "Other" &&
                    option === "Other" && (
                      <Input
                        type="text"
                        value={getAnswer(questionIds.otherother)}
                        onChange={(e) =>
                          handleInputChange(
                            questionIds.otherother,
                            e.target.value
                          )
                        }
                        required={getAnswer(questionIds.currentRec) === "Other"}
                        placeholder="Specify"
                        className="w-64 text-sm"
                      />
                    )}
                </div>
              ))}
            </div>
          </div>

          {/*B. Next appointment date:*/}
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 mt-2">
            <Label className="font-semibold text-base">
              B. Next appointment date:
            </Label>
            <div className="ml-4 flex gap-2 items-center lg:ml-0">
              <Input
                type="text"
                value={getAnswer(questionIds.nextappointment)}
                onChange={(e) =>
                  handleInputChange(questionIds.nextappointment, e.target.value)
                }
                placeholder="Type Date"
                className="w-64 text-sm"
              />
              <Label>Date</Label>
              {/* <DatePicker
              value={
                getAnswer(questionIds.nextappointment)
                  ? parseLocalDate(getAnswer(questionIds.nextappointment))
                  : undefined
              }
              onChange={(val) =>
                handleInputChange(
                  questionIds.nextappointment,
                  val?.toLocaleDateString("en-CA") || ""
                )
              }
              disabledDates={dateDisablers.noPast}
            /> */}
            </div>
          </div>

          {/*C. Additional imaging recommended*/}
          <div className="flex flex-col gap-4">
            <Label className="font-bold text-base">
              C. Additional imaging recommended
            </Label>
            <div className="flex flex-col gap-5">
              {[
                "Diagnostic mammogram",
                "Breast ultrasound",
                "Breast MRI",
                "Follow-up QT scan",
                "Other",
                "Unknown",
              ].map((option) => (
                <div
                  key={option}
                  className="ml-4 flex flex-col lg:flex-row space-x-2 gap-3 lg:gap-0 h-[auto] lg:h-[20px]"
                >
                  <data className="flex space-x-2">
                    <input
                      type="radio"
                      name="additional"
                      value={option}
                      checked={getAnswer(questionIds.additionalrec) === option}
                      onChange={() =>
                        handleInputChange(questionIds.additionalrec, option)
                      }
                      onDoubleClick={() =>
                        handleInputChange(questionIds.additionalrec, "")
                      }
                      className="custom-radio"
                      id={option === "Other" ? "SupportOther" : option}
                    />
                    <Label
                      htmlFor={option === "Other" ? "SupportOther" : option}
                      className="w-[230px]"
                    >
                      {option}
                    </Label>
                  </data>
                  {getAnswer(questionIds.additionalrec) === "Other" &&
                    option === "Other" && (
                      <Input
                        type="text"
                        value={getAnswer(questionIds.additionalRecOther)}
                        onChange={(e) =>
                          handleInputChange(
                            questionIds.additionalRecOther, // Use the new ID here
                            e.target.value
                          )
                        }
                        required={
                          getAnswer(questionIds.additionalrec) === "Other"
                        }
                        placeholder="Specify"
                        className="w-64 text-sm"
                      />
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringFollow;
