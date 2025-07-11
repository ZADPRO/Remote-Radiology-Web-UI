import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
    newTreatment: number;
    newTreatmentDetails: number;
    treatmentDiscontnued: number;
    treatmentDiscontinuedDetails: number;
    changedDose: number;
    changedDoseDetails: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const CurrentClinicalStatus: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  console.log(formData);

  // const getAnswer = (id: number) =>
  //   formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="Current Clinical Status" className="uppercase" />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-4">
        <Label className="text-bold text-base">
          A. Changes in treatment since last QT scan
        </Label>

        <div className="pl-4 space-y-6">
          <LabeledRadioWithOptionalInput
            label="a. Started New Treatment"
            name="new-treatment"
            questionId={questionIds.newTreatment}
            optionalInputQuestionId={questionIds.newTreatmentDetails}
            formData={formData}
            handleInputChange={handleInputChange}
           options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
            showInputWhenValue="Yes"
            inputPlaceholder="Details"
            required
          />

          <LabeledRadioWithOptionalInput
            label="b. Discontinued Treatment"
            name="discontinued-treatment"
            questionId={questionIds.treatmentDiscontnued}
            optionalInputQuestionId={questionIds.treatmentDiscontinuedDetails}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
            showInputWhenValue="Yes"
            inputPlaceholder="Details"
            required
          />

          <LabeledRadioWithOptionalInput
            label="c. Changed dosage"
            name="changed-dosage"
            questionId={questionIds.changedDose}
            optionalInputQuestionId={questionIds.changedDoseDetails}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
            showInputWhenValue="Yes"
            inputPlaceholder="Details"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentClinicalStatus;
