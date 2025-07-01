import React from "react";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import TwoOptionRadioGroup from "@/components/ui/CustomComponents/TwoOptionRadioGroup";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { IntakeOption } from "../MainInTakeForm";

interface QuestionIds {
  Current: number;
  CurrentOther: number;
  Undercare: number;
  Breastsurgeon: number;
  Oncologist: number;
  Integrativeoncologist: number;
  Other: number;
  othertext: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const FutureMonitoring: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="Future Monitoring Plan" className="uppercase" />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-3 lg:px-20 space-y-6 pb-10">
        {/* A.Current monitoring plan */}
        <div className="flex flex-col gap-2">
          <LabeledRadioWithOptionalInput
            name="current-monitoring"
            label="A. Current monitoring plan"
            questionId={questionIds.Current}
            optionalInputQuestionId={questionIds.CurrentOther}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              {
                label:
                  "Following recommended surveillance after cancer treatment",
                value:
                  "Following recommended surveillance after cancer treatment",
              },
              {
                label: "Evaluating response to treatment",
                value: "Evaluating response to treatment",
              },
              { label: "Other", value: "Other" },
            ]}
            showInputWhenValue="Other"
            inputPlaceholder="Specify"
            className="flex-col items-start sm:h-auto"
            inputWidth="w-[auto] sm:w-100"
          />
        </div>

        <div className="ml-4 relative">
          {/* B.Under care of specialist */}
          <TwoOptionRadioGroup
            label="B.Under care of specialist"
            questionId={questionIds.Undercare}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
          />

          {getAnswer(questionIds.Undercare) === "Yes" && (
            <>
              <div className="ml-4.5 font-semibold mt-4 text-sm ">
                If yes, Check all that apply 
              </div>

              <div className="flex flex-col gap-3 lg:gap-0 mt-2 lg:mt-0">
                {/* Breast surgeon */}
                <div className="ml-8 relative flex gap-3  h-[auto] lg:h-[40px] items-center">
                  <Checkbox2
                    checked={getAnswer(questionIds.Breastsurgeon) === "true"}
                    onClick={() =>
                      handleInputChange(
                        questionIds.Breastsurgeon,
                        getAnswer(questionIds.Breastsurgeon) === "true"
                          ? ""
                          : "true"
                      )
                    }
                  />
                  <div className="font-semibold text-sm ">Breast surgeon</div>
                </div>

                {/* Oncologist */}
                <div className="ml-8 relative flex gap-3  h-[auto] lg:h-[40px] items-center">
                  <Checkbox2
                    checked={getAnswer(questionIds.Oncologist) === "true"}
                    onClick={() =>
                      handleInputChange(
                        questionIds.Oncologist,
                        getAnswer(questionIds.Oncologist) === "true"
                          ? ""
                          : "true"
                      )
                    }
                  />
                  <div className="font-semibold text-sm ">Oncologist</div>
                </div>

                {/* Integrative Oncologist */}
                <div className="ml-8 relative flex gap-3  h-[auto] lg:h-[40px] items-center">
                  <Checkbox2
                    checked={
                      getAnswer(questionIds.Integrativeoncologist) === "true"
                    }
                    onClick={() =>
                      handleInputChange(
                        questionIds.Integrativeoncologist,
                        getAnswer(questionIds.Integrativeoncologist) === "true"
                          ? ""
                          : "true"
                      )
                    }
                  />
                  <div className="font-semibold text-sm ">
                    Integrative Oncologist
                  </div>
                </div>

                {/* Other */}
                <div className="ml-8 relative flex flex-col lg:flex-row gap-1 lg:gap-3 h-[auto] lg:h-[40px] lg:items-center">
                  <div className="flex gap-3">
                    <Checkbox2
                      checked={getAnswer(questionIds.Other) === "true"}
                      onClick={() =>
                        handleInputChange(
                          questionIds.Other,
                          getAnswer(questionIds.Other) === "true" ? "" : "true"
                        )
                      }
                    />
                    <div className="font-semibold text-sm ">Other</div>
                  </div>
                  {getAnswer(questionIds.Other) === "true" && (
                    <>
                      <div className="lg:ml-5 h-[50px] flex lg:justify-center items-center gap-3">
                        <Input
                          placeholder="Specify"
                          type="text"
                          className="w-54"
                          value={getAnswer(questionIds.othertext)}
                          onChange={(e) =>
                            handleInputChange(
                              questionIds.othertext,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FutureMonitoring;
