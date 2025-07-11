import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { useEffect } from "react";
import ValidatedSelect from "../../../components/ui/CustomComponents/ValidatedSelect";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
    weightDiff: number;
    weightType: number;
    diffType: number;
    changeHormonal: number;
    changeHormonalDetails: number;
    healthConditions: number;
    healthConditionsDetails: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const RiskFactors: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  console.log(formData);

  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  useEffect(() => {
    if(getAnswer(questionIds.weightType) === "") {
        handleInputChange(questionIds.weightType, "lbs");
    }
  }, [questionIds]);

  return (
    <div className="flex flex-col h-full">
      <FormHeader
        FormTitle="Risk Factors and Health Changes"
        className="uppercase"
      />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10">
        <div className="flex flex-col gap-4">
          <MultiOptionRadioGroup
            label="A. Change in weight since last scan"
            questionId={questionIds.diffType}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "Gain", value: "Gain" },
              { label: "Loss", value: "Loss" },
              { label: "No Change", value: "No Change" },
            ]}
          />
          {(getAnswer(questionIds.diffType) === "Loss" ||
            getAnswer(questionIds.diffType) === "Gain") && (
            <div className="pl-4 flex gap-2">
              <Label>Mention Weight Difference</Label>

              <div className="flex gap-2">
                <Input
                  id="weight"
                  placeholder="Weight"
                  value={getAnswer(questionIds.weightDiff)}
                  onChange={(e) =>
                    handleInputChange(questionIds.weightDiff, e.target.value)
                  }
                />
                <ValidatedSelect
                  questionId={questionIds.weightType}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  options={[
                    { label: "kg", value: "kg" },
                    { label: "lbs", value: "lbs" },
                  ]}
                />
              </div>
            </div>
          )}
        </div>

        <LabeledRadioWithOptionalInput
          name="hormonal-medication"
          label="B. Change in hormonal medication"
          questionId={questionIds.changeHormonal}
          optionalInputQuestionId={questionIds.changeHormonalDetails}
          formData={formData}
          handleInputChange={handleInputChange}
          options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
            showInputWhenValue="Yes"
          inputPlaceholder="Details"
        />

        <LabeledRadioWithOptionalInput
          name="health-conditions"
          label="C. New health conditions diagnosed"
          questionId={questionIds.healthConditions}
          optionalInputQuestionId={questionIds.healthConditionsDetails}
          formData={formData}
          handleInputChange={handleInputChange}
          options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
            showInputWhenValue="Yes"
          inputPlaceholder="Details"
        />
      </div>
    </div>
  );
};

export default RiskFactors;