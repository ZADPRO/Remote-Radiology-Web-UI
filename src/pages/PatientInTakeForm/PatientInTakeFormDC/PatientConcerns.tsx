import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
  currentConcerns: number;
  secondOpinion: number;
  infoRequested: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const PatientConcerns: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  console.log(formData);

  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="Patient Concerns and Goals" className="uppercase" />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10">
       <div className="flex flex-col lg:items-start gap-2">
          <Label className="font-semibold text-base lg:w-[40rem]">A. Current concerns about previous findings</Label>
         <Textarea 
            value={getAnswer(questionIds.currentConcerns)}
            onChange={(e) =>
              handleInputChange(questionIds.currentConcerns, e.target.value)
            }
            />
        </div>
        
        <MultiOptionRadioGroup
          label="B. Seeking second opinion on previous interpretation"
          questionId={questionIds.secondOpinion}
          handleInputChange={handleInputChange}
          formData={formData}
          options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
        />

        <div className="flex lg:items-start flex-col gap-2">
          <Label className="font-semibold text-base lg:w-[40rem]">C. Specific information requested from current QT imaging</Label>
         <Textarea 
            value={getAnswer(questionIds.infoRequested)}
            onChange={(e) =>
              handleInputChange(questionIds.infoRequested, e.target.value)
            }
            />
        </div>
      </div>
    </div>
  );
};

export default PatientConcerns;
