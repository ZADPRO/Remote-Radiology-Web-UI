import React from "react";
import FormHeader from "../FormHeader";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
  ibisScore: number;
  auriaStatus: number;
  auriaResult: number;
  geneticTest: number;
  mutationFound: number;
  mutationType: number;
  familyGeneticCondition: number;
  familyGeneticConditionSpecify: number;
  mutationOtherSpecify: number;
  additionalComments: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const RiskStratification: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full relative">
      <FormHeader FormTitle="RISK STRATIFICATION" />
    <div className={readOnly ? "pointer-events-none" : ""}>
      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-6 pb-10">
        {/* A. IBIS Calculator */}
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-base">
              A. IBIS/Tyrer-Cuzick Breast Cancer Risk Calculator completed?
            </p>

            <Dialog>
              <p className="text-sm text-muted-foreground">
                Click{" "}
                <DialogTrigger asChild>
                  <span
                    className="underline text-blue-600 cursor-pointer"
                    title="Open IBIS Calculator"
                  >
                    here
                  </span>
                </DialogTrigger>{" "}
                to open the IBIS Risk Calculator and enter the percentage score
                below.
              </p>

              <DialogContent className="max-w-[90vw] h-[90vh] p-4">
                <div className="flex flex-col h-full">
                  <DialogTitle className="text-lg mb-2">
                    IBIS Risk Calculator
                  </DialogTitle>
                  <iframe
                    src="https://magview.com/ibis-risk-calculator/"
                    title="IBIS Risk Calculator"
                    className="w-full flex-1 border rounded"
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Score Input */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Label className="text-sm font-medium">SCORE (%)</Label>
            <Input
              className="w-full sm:w-64"
              placeholder="Enter percentage score"
              value={getAnswer(questionIds.ibisScore)}
              onChange={(e) =>
                handleInputChange(questionIds.ibisScore, e.target.value)
              }
            />
          </div>
        </div>

        {/* B. AURIA Breast Cancer Tear Test */}
        <div>
          <MultiOptionRadioGroup
            label="B. AURIA Breast Cancer Tear Test"
            questionId={questionIds.auriaStatus}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "Done", value: "Done" },
              { label: "Not Done", value: "Not Done" },
            ]}
          />

          {getAnswer(questionIds.auriaStatus) === "Done" && (
            <div className="flex flex-col gap-2 mt-3 pl-4">
              <label className="text-sm font-semibold flex flex-wrap gap-1">
                If Done, Results:
                <span className="text-red-500">*</span>
              </label>

              <div className="ml-4 flex flex-col sm:flex-row gap-3 sm:gap-6">
                {["Clinically Significant", "Negative"].map((value) => {
                  const id = `auria-result-${value.toLowerCase()}`;
                  return (
                    <div key={value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={id}
                        name={`auria-result`}
                        value={value}
                        checked={
                          formData.find(
                            (q) => q.questionId === questionIds.auriaResult
                          )?.answer === value
                        }
                        onChange={(e) =>
                          handleInputChange(
                            questionIds.auriaResult,
                            e.target.value
                          )
                        }
                        required
                        className="custom-radio"
                      />
                      <label htmlFor={id}>{value}</label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* C. Genetic Testing */}
        <MultiOptionRadioGroup
          label="C. Genetic testing for breast cancer genes"
          questionId={questionIds.geneticTest}
          formData={formData}
          handleInputChange={handleInputChange}
          options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
        />

        {/* Mutation Found */}
        {getAnswer(questionIds.geneticTest) === "Yes" && (
        <div className="pl-4">
          <MultiOptionRadioGroup
            label="Mutation found?"
            questionId={questionIds.mutationFound}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
          />

          {getAnswer(questionIds.mutationFound) === "Yes" && (
            <div className="mt-3 space-y-2 pl-4">
              <p className="text-sm font-medium">
                If Yes, Specify: <span className="text-red-500">*</span>
              </p>
              <LabeledRadioWithOptionalInput
                name="mutation-type"
                questionId={questionIds.mutationType}
                optionalInputQuestionId={questionIds.mutationOtherSpecify}
                formData={formData}
                handleInputChange={handleInputChange}
                options={[
                  { label: "BRCA1", value: "BRCA1" },
                  { label: "BRCA2", value: "BRCA2" },
                  { label: "Other", value: "Other" },
                  { label: "Unknown", value: "Unknown" },
                ]}
                showInputWhenValue="Other"
                inputPlaceholder="Specify"
                required
              />
            </div>
          )}
        </div>
        )}

        {/* D. Family Genetic Conditions */}
        <div>
          <LabeledRadioWithOptionalInput
            name="family-genetic-condition"
            label="D. Known genetic conditions in the family?"
            questionId={questionIds.familyGeneticCondition}
            optionalInputQuestionId={questionIds.familyGeneticConditionSpecify}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
            showInputWhenValue="Yes"
            inputPlaceholder="Specify"
            optionalInputType="textarea"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Label className="font-semibold text-base flex flex-wrap gap-1">
            E. Others / Additional Comments
          </Label>
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
    </div>
  );
};

export default RiskStratification;
