import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import TwoOptionRadioGroup from "@/components/ui/CustomComponents/TwoOptionRadioGroup";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
  receptorStatus: number;
  Estrogen: number;
  EstrogenPer: number;
  Progesterone: number;
  ProgesteronePer: number;
  HER2: number;
  HER2Per: number;
  Ki: number;
  KiPer: number;
  Oncotype: number;
  Oncotyperesult: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const ReceptorStatus: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="Receptor Status" className="uppercase" />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-10 pb-10">
        <TwoOptionRadioGroup
          label="A. Do you have receptor status?"
          questionId={questionIds.receptorStatus}
          formData={formData}
          handleInputChange={handleInputChange}
          options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
        />

        {getAnswer(questionIds.receptorStatus) === "Yes" && (
        <div className="space-y-10 ">
                  {/* a. Estrogen Receptor (ER) */}

        <div className="ml-4">
          <div className="flex-col gap-4 relative h-[auto] lg:h-[50px]">
            <Label className="font-semibold text-base">
              a. Estrogen Receptor (ER)
            </Label>
            <div className="ml-4 mt-3 lg:mt-0 flex items-center gap-5 h-[auto] lg:h-[50px]">
              <div className="flex flex-col lg:items-center items-start lg:flex-row gap-4 lg:gap-5 ">
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Estrogen"
                    checked={getAnswer(questionIds.Estrogen) === "Unknown"}
                    onChange={() =>
                      handleInputChange(questionIds.Estrogen, "Unknown")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Unknown</Label>
                </div>
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Estrogen"
                    checked={getAnswer(questionIds.Estrogen) === "Negative"}
                    onChange={() =>
                      handleInputChange(questionIds.Estrogen, "Negative")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Negative</Label>
                </div>
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Estrogen"
                    checked={getAnswer(questionIds.Estrogen) === "Positive"}
                    onChange={() =>
                      handleInputChange(questionIds.Estrogen, "Positive")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Positive</Label>
                </div>
                {getAnswer(questionIds.Estrogen) === "Positive" && (
                  <div className=" h-[50px] flex justify-center items-center gap-3">
                    <Label className="font-semibold text-sm">Percentage</Label>
                    <Input
                      type="number"
                      className="w-15"
                      value={getAnswer(questionIds.EstrogenPer)}
                      onChange={(e) =>
                        handleInputChange(
                          questionIds.EstrogenPer,
                          e.target.value
                        )
                      }
                      required
                    />
                    <Label className="font-semibold text-sm">%</Label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* b. Progesterone Receptor (PR) */}
        <div className="ml-4">
          <div className="flex-col gap-4 relative h-[auto] lg:h-[50px]">
            <Label className="font-semibold text-base">
              b. Progesterone Receptor (PR)
            </Label>
            <div className="ml-4 mt-3 lg:mt-0 flex items-center gap-5 h-[auto] lg:h-[50px]">
              <div className="flex flex-col lg:flex-row lg:items-center items-start gap-4 lg:gap-5">
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Progesterone"
                    checked={getAnswer(questionIds.Progesterone) === "Unknown"}
                    onChange={() =>
                      handleInputChange(questionIds.Progesterone, "Unknown")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Unknown</Label>
                </div>
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Progesterone"
                    checked={getAnswer(questionIds.Progesterone) === "Negative"}
                    onChange={() =>
                      handleInputChange(questionIds.Progesterone, "Negative")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Negative</Label>
                </div>
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Progesterone"
                    checked={getAnswer(questionIds.Progesterone) === "Positive"}
                    onChange={() =>
                      handleInputChange(questionIds.Progesterone, "Positive")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Positive</Label>
                </div>
                {getAnswer(questionIds.Progesterone) === "Positive" && (
                  <div className=" h-[auto] justify-center items-center lg:h-[50px] flex gap-3">
                    <Label className="font-semibold text-sm">Percentage</Label>
                    <Input
                      type="number"
                      className="w-15"
                      value={getAnswer(questionIds.ProgesteronePer)}
                      onChange={(e) =>
                        handleInputChange(
                          questionIds.ProgesteronePer,
                          e.target.value
                        )
                      }
                      required
                    />
                    <Label className="font-semibold text-sm">%</Label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* c.HER2/neu */}
        <div className="ml-4">
          <div className="flex-col gap-4 relative h-[auto] lg:h-[50px]">
            <Label className="font-semibold text-base">c. HER2/neu</Label>
            <div className="ml-4 mt-3 lg:mt-0 flex items-center gap-5 h-[auto] lg:h-[50px]">
              <div className="flex flex-col lg:flex-row lg:items-center items-start gap-4 lg:gap-5 ">
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="HER2"
                    checked={getAnswer(questionIds.HER2) === "Unknown"}
                    onChange={() =>
                      handleInputChange(questionIds.HER2, "Unknown")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Unknown</Label>
                </div>
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="HER2"
                    checked={getAnswer(questionIds.HER2) === "Negative"}
                    onChange={() =>
                      handleInputChange(questionIds.HER2, "Negative")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Negative</Label>
                </div>
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="HER2"
                    checked={getAnswer(questionIds.HER2) === "Positive"}
                    onChange={() =>
                      handleInputChange(questionIds.HER2, "Positive")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Positive</Label>
                </div>
                {getAnswer(questionIds.HER2) === "Positive" && (
                  <div className=" h-[50px] flex justify-center items-center gap-3">
                    <Label className="font-semibold text-sm">Percentage</Label>
                    <Input
                      type="number"
                      className="w-15"
                      value={getAnswer(questionIds.HER2Per)}
                      onChange={(e) =>
                        handleInputChange(questionIds.HER2Per, e.target.value)
                      }
                      required
                    />
                    <Label className="font-semibold text-sm">%</Label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* d. Ki-67 */}
        <div className="ml-4">
          <div className="flex-col gap-4 relative h-[auto] lg:h-[50px]">
            <Label className="font-semibold text-base">d. Ki-67</Label>
            <div className="ml-4 mt-3 lg:mt-0 flex items-center gap-5 h-[auto] lg:h-[50px]">
              <div className="flex flex-col lg:items-center items-start lg:flex-row gap-4 lg:gap-5">
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Ki"
                    checked={getAnswer(questionIds.Ki) === "Unknown"}
                    onChange={() =>
                      handleInputChange(questionIds.Ki, "Unknown")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Unknown</Label>
                </div>
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Ki"
                    checked={getAnswer(questionIds.Ki) === "Known"}
                    onChange={() => handleInputChange(questionIds.Ki, "Known")}
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Known</Label>
                </div>
                {getAnswer(questionIds.Ki) === "Known" && (
                  <div className="h-[50px] flex justify-center items-center gap-3">
                    <Label className="font-semibold text-sm">Percentage</Label>
                    <Input
                      type="number"
                      className="w-15"
                      value={getAnswer(questionIds.KiPer)}
                      onChange={(e) =>
                        handleInputChange(questionIds.KiPer, e.target.value)
                      }
                      required
                    />
                    <Label className="font-semibold text-sm">%</Label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* E.Oncotype DX or other genomic testing */}
        <div className="ml-4">
          <div className="flex-col gap-4 relative h-[auto] lg:h-[50px]">
            <Label className="font-semibold text-base">
              e. Oncotype DX or other genomic testing
            </Label>
            <div className="ml-4 mt-3 lg:mt-0 flex items-center gap-5 h-[auto] lg:h-[50px]">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Oncotype"
                    checked={getAnswer(questionIds.Oncotype) === "No"}
                    onChange={() =>
                      handleInputChange(questionIds.Oncotype, "No")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">No</Label>
                </div>
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Oncotype"
                    checked={getAnswer(questionIds.Oncotype) === "Yes"}
                    onChange={() =>
                      handleInputChange(questionIds.Oncotype, "Yes")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Yes</Label>
                </div>
                <div className="flex w-32 gap-1">
                  <input
                    type="radio"
                    name="Oncotype"
                    checked={getAnswer(questionIds.Oncotype) === "Pending"}
                    onChange={() =>
                      handleInputChange(questionIds.Oncotype, "Pending")
                    }
                    className="custom-radio"
                  />
                  <Label className="font-semibold text-sm">Pending</Label>
                </div>
              </div>
            </div>
            <div className="ml-4 flex mt-3 lg:-mt-1 items-center gap-5 h-[50px]">
              {getAnswer(questionIds.Oncotype) === "Yes" && (
                <div className=" h-[50px] flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4">
                  <Label className="font-semibold text-sm">
                    If yes, score/results
                  </Label>
                  <Input
                    type="text"
                    className="w-55"
                    value={getAnswer(questionIds.Oncotyperesult)}
                    onChange={(e) =>
                      handleInputChange(questionIds.Oncotyperesult, e.target.value)
                    }
                    placeholder="Specify"
                    required
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ReceptorStatus;
