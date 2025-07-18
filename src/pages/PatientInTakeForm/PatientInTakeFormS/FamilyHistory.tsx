import React from "react";
import FormHeader from "../FormHeader";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
  relatives: number;
  relativesDiagnoses: number;
  familyHistory: number;
  familyHistorySpecify: number;
  familyHistorySpecifyAge: number;
  historyOvarianCancer: number;
  historyFamilySpecify: number;
  historyFamilySpecifyAge: number;
  historyRelativesCancer: number;
  historyRelativesSpecify: number;
  historyRelativesSpecifyAge: number;
  otherCancers: number;
  otherCancerSpecify: number;
  otherCancerSpecifyAge: number;
  additionalComments: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const FamilyHistory: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly
}) => {
  console.log(formData);

  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full relative">
      <FormHeader FormTitle="Family History" className="uppercase" />

      <div className={readOnly ? "pointer-events-none" : ""}>
        <div className="flex-grow overflow-y-auto px-5 py-10 lg:py-0 lg:px-20 space-y-8 pb-10">
          <MultiOptionRadioGroup
            label="A. Do any first-degree or second-degree relatives have breast cancer?"
            questionId={questionIds.relatives}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
          />

          {getAnswer(questionIds.relatives) === "Yes" && (
            <div className="flex items-center -mt-4 ml-4 gap-4">
              <Label className="text-sm font-medium">
                If yes, age(s) at diagnosis
              </Label>
              <Input
                type="text"
                value={getAnswer(questionIds.relativesDiagnoses)}
                onChange={(e) =>
                  handleInputChange(
                    questionIds.relativesDiagnoses,
                    e.target.value
                  )
                }
                className="w-24 h-10 border border-gray-300 rounded-md px-2 text-sm"
                placeholder="Age"
                required
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Label className="font-semibold text-base flex flex-wrap gap-1">
              B. Which family members had breast cancer?
            </Label>
            <Input
            value={getAnswer(questionIds.familyHistorySpecify)}
            onChange={(e) =>
              handleInputChange(
                questionIds.familyHistorySpecify,
                e.target.value
              )
            }
            placeholder="Specify Who"
            className="w-64"
          />
          </div>

          <LabeledRadioWithOptionalInput
            name="ovarian-cancer"
            label="C. Family history of ovarian cancer?"
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
            formData={formData}
            handleInputChange={handleInputChange}
            questionId={questionIds.historyOvarianCancer}
            optionalInputQuestionId={questionIds.historyFamilySpecify}
            secondaryOptionalInputQuestionId={
              questionIds.historyFamilySpecifyAge
            }
            showInputWhenValue="Yes"
            inputPlaceholder="Specify"
            secondaryInputPlaceholder="Age"
            secondaryinputWidth="w-20"
          />

          <LabeledRadioWithOptionalInput
            name="relatives-cancer"
            label="D. Any relatives with both breast and ovarian cancer?"
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
            formData={formData}
            handleInputChange={handleInputChange}
            questionId={questionIds.historyRelativesCancer}
            optionalInputQuestionId={questionIds.historyRelativesSpecify}
            secondaryOptionalInputQuestionId={
              questionIds.historyRelativesSpecifyAge
            }
            showInputWhenValue="Yes"
            inputPlaceholder="Specify"
            secondaryInputPlaceholder="Age"
            secondaryinputWidth="w-20"
          />

          <LabeledRadioWithOptionalInput
            name="family-genetic-condition"
            label="E. History of other cancers in the family?"
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
            formData={formData}
            handleInputChange={handleInputChange}
            questionId={questionIds.otherCancers}
            optionalInputQuestionId={questionIds.otherCancerSpecify}
            secondaryOptionalInputQuestionId={questionIds.otherCancerSpecifyAge}
            showInputWhenValue="Yes"
            inputPlaceholder="Specify"
            secondaryInputPlaceholder="Age"
            secondaryinputWidth="w-20"
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <Label className="font-semibold text-base flex flex-wrap gap-1">
              F. Others / Additional Comments
            </Label>
            <Textarea
              className="w-full lg:w-64"
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

export default FamilyHistory;
