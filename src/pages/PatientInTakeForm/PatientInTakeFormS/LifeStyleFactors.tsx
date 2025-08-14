import React from "react";
import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { Textarea } from "@/components/ui/textarea";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IntakeOption } from "../PatientInTakeForm";
import ValidatedSelect from "@/components/ui/CustomComponents/ValidatedSelect";

interface QuestionIds {
  alcoholConsumption: number;
  alcoholDrinks: number;
  smokingStatus: number;
  packsPerDay: number;
  smokingYears: number;
  exerciseFrequency: number;
  dietDescription: number;
  bmi: number;
  weightGain: number;
  additionalComments: number;
  height: number;
  heightType: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const LifeStyleFactors: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";
  return (
    <div className="flex flex-col h-full relative">
      <FormHeader FormTitle="Lifestyle Factors" className="uppercase" />

      <div className={readOnly ? "pointer-events-none" : ""}>
        <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10 relative">
          {/* A. Alcohol consumption */}

          <LabeledRadioWithOptionalInput
            name="current-monitoring"
            label="A. Alcohol consumption"
            questionId={questionIds.alcoholConsumption}
            optionalInputQuestionId={questionIds.alcoholDrinks}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "None", value: "None" },
              { label: "Occasional", value: "Occasional" },
              { label: "Regular", value: "Regular" },
            ]}
            showInputWhenValue="Regular"
            inputPlaceholder="Drinks Per Week"
          />

          {/* B. Smoking status */}
          <LabeledRadioWithOptionalInput
            name="family-genetic-condition"
            label="B. Smoking status"
            options={[
              { label: "Never", value: "Never" },
              { label: "Former", value: "Former" },
              { label: "Current", value: "Current" },
            ]}
            formData={formData}
            handleInputChange={handleInputChange}
            optionalInputQuestionId={questionIds.packsPerDay}
            showInputWhenValue="Current"
            inputPlaceholder="Packs/Day"
            questionId={questionIds.smokingStatus}
            secondaryOptionalInputQuestionId={questionIds.smokingYears}
            secondaryInputPlaceholder="Years"
            secondaryinputWidth="w-20"
          />

          <MultiOptionRadioGroup
            label="C. Exercise frequency"
            questionId={questionIds.exerciseFrequency}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "None", value: "None" },
              { label: "1-2 Times/Week", value: "1-2 Times/Week" },
              { label: "3-4 Times/Week", value: "3-4 Times/Week" },
              { label: "5+ Times/Week", value: "5+ Times/Week" },
            ]}
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <Label className="text-bold text-base">D. Diet description</Label>
            <Input
              type="text"
              value={getAnswer(questionIds.dietDescription)}
              onChange={(e) =>
                handleInputChange(questionIds.dietDescription, e.target.value)
              }
              className="w-full lg:w-1/2 text-sm"
              placeholder="Describe your diet"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-base">E. Current BMI</p>

              <Dialog>
                <p className="text-sm text-muted-foreground">
                  Click{" "}
                  <DialogTrigger asChild>
                    <span
                      className="underline text-blue-600 cursor-pointer"
                      title="Open BMI Calculator"
                    >
                      here
                    </span>
                  </DialogTrigger>{" "}
                  to open the BMI Calculator and enter your result below.
                </p>

                <DialogContent className="max-w-[90vw] h-[90vh] p-4">
                  <div className="flex flex-col h-full">
                    <DialogTitle className="text-lg mb-2">
                      BMI Calculator
                    </DialogTitle>
                    <iframe
                      src="https://www.calculator.net/bmi-calculator.html"
                      title="BMI Calculator"
                      className="w-full flex-1 border rounded"
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Score Input */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Label className="text-sm font-medium">BMI</Label>
              <Input
              type="number"
                className="w-full sm:w-64"
                value={getAnswer(questionIds.bmi)}
                onChange={(e) =>
                  handleInputChange(questionIds.bmi, e.target.value)
                }
                placeholder="Specify"
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="font-semibold text-base">F. Height</p>
            <div className="flex gap-2">
              <Input
              type="number"
                id="height"
                placeholder="Height"
                value={getAnswer(questionIds.height)}
                onChange={(e) =>
                  handleInputChange(questionIds.height, e.target.value)
                }
              />
              <ValidatedSelect
                questionId={questionIds.heightType}
                formData={formData}
                handleInputChange={handleInputChange}
                options={[
                  { label: "Cm", value: "Cm" },
                  { label: "In", value: "In" },
                ]}
                required={getAnswer(questionIds.height) != ""}
              />
            </div>
          </div>

          <MultiOptionRadioGroup
            label="F. Significant weight gain in adulthood?"
            questionId={questionIds.weightGain}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <Label className="font-semibold text-base flex flex-wrap gap-1">
              G. Others / Additional Comments
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

export default LifeStyleFactors;
