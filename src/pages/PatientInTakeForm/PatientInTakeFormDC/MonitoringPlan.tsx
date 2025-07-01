import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { IntakeOption } from "../MainInTakeForm";

interface QuestionIds {
  followingRecommended: number;
  benignFindings: number;
  responseTreatment: number;
  birads3: number;
  otherMonitoring: number;
  otherMonitoringDetails: number;
  underSpecialist: number;
  specialistType: number;
  otherSpecialist: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const MonitoringPlan: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  console.log(formData);

  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="Monitoring Plan" className="uppercase" />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10">
        <Label className="font-semibold text-base">
          A. Current monitoring plan: Check all that apply
        </Label>

        <div className="flex flex-col gap-4 ml-4 mt-2">
          {/* Following recommended */}
          <div className="flex items-center space-x-3">
            <Checkbox2
              id="followingRecommended"
              checked={getAnswer(questionIds.followingRecommended) === "true"}
              onCheckedChange={(checked) =>
                handleInputChange(
                  questionIds.followingRecommended,
                  checked ? "true" : ""
                )
              }
            />
            <Label htmlFor="followingRecommended">
              Following recommended surveillance after cancer treatment
            </Label>
          </div>

          {/* Benign findings */}
          <div className="flex items-center space-x-3">
            <Checkbox2
              id="benignFindings"
              checked={getAnswer(questionIds.benignFindings) === "true"}
              onCheckedChange={(checked) =>
                handleInputChange(
                  questionIds.benignFindings,
                  checked ? "true" : ""
                )
              }
            />
            <Label htmlFor="benignFindings">
              Monitoring known benign finding
            </Label>
          </div>

          {/* Response to treatment */}
          <div className="flex items-center space-x-3">
            <Checkbox2
              id="responseTreatment"
              checked={getAnswer(questionIds.responseTreatment) === "true"}
              onCheckedChange={(checked) =>
                handleInputChange(
                  questionIds.responseTreatment,
                  checked ? "true" : ""
                )
              }
            />
            <Label htmlFor="responseTreatment">
              Evaluating response to treatment
            </Label>
          </div>

          {/* BI-RADS 3 */}
          <div className="flex items-center space-x-3">
            <Checkbox2
              id="birads3"
              checked={getAnswer(questionIds.birads3) === "true"}
              onCheckedChange={(checked) =>
                handleInputChange(questionIds.birads3, checked ? "true" : "")
              }
            />
            <Label htmlFor="birads3">
              Short-term follow-up for BI-RADS 3 finding
            </Label>
          </div>

          {/* Other */}
          <div className="flex flex-col gap-2 lg:h-[20px] lg:flex-row lg:items-center">
            <div className="flex items-center space-x-3">
              <Checkbox2
                id="otherMonitoring"
                checked={getAnswer(questionIds.otherMonitoring) === "true"}
                onCheckedChange={(checked) =>
                  handleInputChange(
                    questionIds.otherMonitoring,
                    checked ? "true" : ""
                  )
                }
              />
              <Label htmlFor="otherMonitoring">Other</Label>
            </div>

            {getAnswer(questionIds.otherMonitoring) === "true" && (
              <Input
                type="text"
                className="w-[250px] mt-2 lg:mt-0"
                placeholder="Specify"
                value={getAnswer(questionIds.otherMonitoringDetails)}
                onChange={(e) =>
                  handleInputChange(
                    questionIds.otherMonitoringDetails,
                    e.target.value
                  )
                }
                required
              />
            )}
          </div>
        </div>

        <MultiOptionRadioGroup
          label="B. Under care of specialist"
          questionId={questionIds.underSpecialist}
          handleInputChange={handleInputChange}
          formData={formData}
          options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
        />
        {getAnswer(questionIds.underSpecialist) === "Yes" && (
          <div className="pl-4 -mt-4">
            <LabeledRadioWithOptionalInput
              name="specialist-type"
              label="If yes,monitor type"
              questionId={questionIds.specialistType}
              optionalInputQuestionId={questionIds.otherSpecialist}
              formData={formData}
              handleInputChange={handleInputChange}
              options={[
                { label: "Breast surgeon", value: "Breast surgeon" },
                { label: "Oncologist", value: "Oncologist" },
                {
                  label: "Integrative Oncologist",
                  value: "Integrative Oncologist",
                },
                { label: "Other", value: "Other" },
              ]}
              showInputWhenValue="Other"
              inputPlaceholder="Specify"
              className="flex-col gap-4 items-start sm:h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringPlan;
