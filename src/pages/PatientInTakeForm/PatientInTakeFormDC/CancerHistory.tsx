import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/date-picker";
import { IntakeOption } from "../PatientInTakeForm";
import { Textarea } from "@/components/ui/textarea";

interface QuestionIds {
  cancerHistory: number;
  historyPosition: number;
  cancerDate: number;
  cancerType: number;
  cancerTreatment: number;
  cancerStatus: number;
  cancerFolowupDate: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const CancerHistory: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly
}) => {
  console.log(formData);

  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="Cancer History" className="uppercase" />
      <div className={readOnly ? "pointer-events-none" : ""}>
      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10">
        <MultiOptionRadioGroup
          label="A. Do you have any history of breast cancer?"
          questionId={questionIds.cancerHistory}
          handleInputChange={handleInputChange}
          formData={formData}
          options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
        />

        {getAnswer(questionIds.cancerHistory) === "Yes" && (
          <div className="pl-4">
            <MultiOptionRadioGroup
              label="If Yes,"
              questionId={questionIds.historyPosition}
              handleInputChange={handleInputChange}
              formData={formData}
              options={[
                { label: "Right", value: "Right" },
                { label: "Left", value: "Left" },
                            { label: "Both", value: "Both"}
              ]}
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <Label className="text-bold text-base">B. Date of diagnosis</Label>
          <div>
            <DatePicker
              value={
                getAnswer(questionIds.cancerDate)
                  ? new Date(getAnswer(questionIds.cancerDate))
                  : undefined
              }
              onChange={(val) =>
                handleInputChange(
                  questionIds.cancerDate,
                  val?.toLocaleDateString("en-CA") || ""
                )
              }
              disabledDates={(date) => date > new Date()}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Label className="text-bold text-base">C. Type</Label>
          <Textarea
            value={getAnswer(questionIds.cancerType)}
            onChange={(e) =>
              handleInputChange(questionIds.cancerType, e.target.value)
            }
            placeholder="Specify"
            className="w-78 text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <Label className="text-bold text-base">D. Treatment received</Label>
          <Textarea
            placeholder="Specify"
            value={getAnswer(questionIds.cancerTreatment)}
            onChange={(e) =>
              handleInputChange(questionIds.cancerTreatment, e.target.value)
            }
            className="w-78 text-sm"
          />
        </div>

        <MultiOptionRadioGroup
          label="F. Current status"
          questionId={questionIds.cancerStatus}
          handleInputChange={handleInputChange}
          formData={formData}
          options={[
            { label: "In treatment", value: "In treatment" },
            { label: "Completed treatment", value: "Completed treatment" },
            { label: "Recurrence", value: "Recurrence" },
          ]}
        />

        <div className="flex items-center gap-4">
          <Label className="text-bold text-base">
            G. Last Oncology follow-up
          </Label>
          <Textarea
            placeholder="Specify"
            value={getAnswer(questionIds.cancerFolowupDate)}
            onChange={(e) =>
              handleInputChange(questionIds.cancerFolowupDate, e.target.value)
            }
            className="w-78 text-sm"
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default CancerHistory;
