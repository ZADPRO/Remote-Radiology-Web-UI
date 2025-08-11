import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import ValidatedSelect from "../../../components/ui/CustomComponents/ValidatedSelect";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { useEffect } from "react";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
  changesFindings: number;
  sizeChange: number;
  currentSize: number;
  currentSizeType: number;
  morphologyChange: number;
  morphologyChangeDetails: number;
  newFindings: number;
  newFindingsDeatils: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const ChangesFromPreviousImaging: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly
}) => {
  console.log(formData);

  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  useEffect(() => {
    if(getAnswer(questionIds.currentSizeType) === "") {
        handleInputChange(questionIds.currentSizeType, "mm");
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <FormHeader
        FormTitle="Changes Since Previous QT Imaging"
        className="uppercase"
      />
      <div className={readOnly ? "pointer-events-none" : ""}>
      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10">
        <MultiOptionRadioGroup
          label="A. Changes in finding(s) on other imaging / scans ( like Ultrasound, MRI etc) since previous QT"
          questionId={questionIds.changesFindings}
          handleInputChange={handleInputChange}
          formData={formData}
          options={[
            { label: "Unknown", value: "Unknown" },
            { label: "Known", value: "Known" },
          ]}
        />

       {
        getAnswer(questionIds.changesFindings) === "Known" && (
           <div className="pl-4 flex flex-col gap-6">
          <div>
            <MultiOptionRadioGroup
              label="a. Size change"
              questionId={questionIds.sizeChange}
              handleInputChange={handleInputChange}
              formData={formData}
              options={[
                { label: "Increased", value: "Increased" },
                { label: "Decreased", value: "Decreased" },
                { label: "Stable", value: "Stable" },
                { label: "Unknown", value: "Unknown" },
              ]}
              className="flex-col gap-2"
            />

            <div className="flex gap-2">
              <Label>Current size (if known)</Label>

              <div className="flex gap-2">
                <Input
                  id="size"
                  value={getAnswer(questionIds.currentSize)}
                  onChange={(e) =>
                    handleInputChange(questionIds.currentSize, e.target.value)
                  }
                  className="w-28"
                  placeholder="Size"
                />
                <ValidatedSelect
                  questionId={questionIds.currentSizeType}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  options={[
                    { label: "mm", value: "mm" },
                    { label: "cm", value: "cm" },
                  ]}
                />
              </div>
            </div>
          </div>
          <LabeledRadioWithOptionalInput
            name="morphology-change"
            label="b. Morphology change"
            questionId={questionIds.morphologyChange}
            optionalInputQuestionId={questionIds.morphologyChangeDetails}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "No", value: "No" },
              { label: "Unknown", value: "Unknown" },
              { label: "Yes", value: "Yes" },
            ]}
            showInputWhenValue="Yes"
            inputPlaceholder="Details"
            optionalInputType="textarea"
          />

          <LabeledRadioWithOptionalInput
            name="new-findings"
            label="c. New findings"
            questionId={questionIds.newFindings}
            optionalInputQuestionId={questionIds.newFindingsDeatils}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "No", value: "No" },
              { label: "Unknown", value: "Unknown" },
              { label: "Yes", value: "Yes" },
            ]}
            showInputWhenValue="Yes"
            inputPlaceholder="Details"
            optionalInputType="textarea"
          />
        </div>
        )
       }
      </div>
      </div>
    </div>
  );
};

export default ChangesFromPreviousImaging;
