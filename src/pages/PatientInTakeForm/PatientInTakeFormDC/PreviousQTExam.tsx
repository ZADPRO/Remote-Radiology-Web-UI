import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { IntakeOption } from "../PatientInTakeForm";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Textarea } from "@/components/ui/textarea";

interface QuestionIds {
  previousQTImaging: number;
  facilityQTImaging: number;
  purposeQTImaging: number;
  resultQTImaging: number;
  positionQTImagingRight: number;
  positionQTImagingLeft: number;
  detailsQTImagingRight: number;
  detailsQTImagingLeft: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const PreviousQTExam: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  console.log(formData);

  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="Previous QT Exam Details" className="uppercase" />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10">
        <div className="flex flex-col lg:flex-row gap-4">
          <Label className="text-bold text-base">A. Date of previous QT imaging<span className="text-red-500">*</span></Label>
          <div>
            <DatePicker
              value={
                getAnswer(questionIds.previousQTImaging)
                  ? new Date(getAnswer(questionIds.previousQTImaging))
                  : undefined
              }
              onChange={(val) =>
                handleInputChange(
                  questionIds.previousQTImaging,
                  val?.toLocaleDateString("en-CA") || ""
                )
              }
              required
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <Label className="text-bold text-base">
            <span>B. Facility where previous imaging was performed</span>
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={getAnswer(questionIds.facilityQTImaging)}
            onChange={(e) =>
              handleInputChange(questionIds.facilityQTImaging, e.target.value)
            }
            placeholder="Specify"
            className="w-full lg:w-48 text-sm"
            required
          />
        </div>

        <MultiOptionRadioGroup
          label="C. Purpose of previous QT imaging"
          questionId={questionIds.purposeQTImaging}
          handleInputChange={handleInputChange}
          formData={formData}
          options={[
            { label: "Screening", value: "Screening" },
            { label: "Diagnostic evaluation", value: "Diagnostic evaluation" },
            { label: "Follow-up of known abnormality", value: "Follow-up of known abnormality" },
            { label: "Monitoring of treatment response", value: "Monitoring of treatment response" },
            { label: "Surveillance after cancer treatment", value: "Surveillance after cancer treatment"}
          ]}
className="flex-col gap-2 h-auto"
        />

        <div className="flex flex-col gap-4">
          <MultiOptionRadioGroup
          label="D. Result of previous QT imaging"
          questionId={questionIds.resultQTImaging}
          handleInputChange={handleInputChange}
          formData={formData}
          options={[
            { label: "Normal", value: "Normal" },
            { label: "Abnormal", value: "Abnormal" },
          ]}
        />

        {
          getAnswer(questionIds.resultQTImaging) === "Abnormal" && (

            <div className="flex flex-col gap-3 pl-4 relative">
  {/* Right */}
  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
    <div className="flex items-center space-x-2 w-[70px]">
      <Checkbox2
        id="qtimaging-right"
        checked={!!getAnswer(questionIds.positionQTImagingRight)}
        onCheckedChange={(checked) =>
          handleInputChange(questionIds.positionQTImagingRight, checked ? "1" : "")
        }
      />
      <Label htmlFor="qtimaging-right">Right</Label>
    </div>

    {getAnswer(questionIds.positionQTImagingRight) ? (
      <Textarea
        className="w-100 mt-2 lg:mt-0"
        placeholder="Details for Right"
        value={getAnswer(questionIds.detailsQTImagingRight) || ""}
        onChange={(e) =>
          handleInputChange(questionIds.detailsQTImagingRight, e.target.value)
        }
      />
    ) : null}
  </div>

  {/* Left */}
  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
    <div className="flex items-center space-x-2 w-[70px]">
      <Checkbox2
        id="qtimaging-left"
        checked={!!getAnswer(questionIds.positionQTImagingLeft)}
        onCheckedChange={(checked) =>
          handleInputChange(questionIds.positionQTImagingLeft, checked ? "1" : "")
        }
      />
      <Label htmlFor="qtimaging-left">Left</Label>
    </div>

    {getAnswer(questionIds.positionQTImagingLeft) ? (
      <Textarea
        className="w-100 mt-2 lg:mt-0"
        placeholder="Details for Left"
        value={getAnswer(questionIds.detailsQTImagingLeft) || ""}
        onChange={(e) =>
          handleInputChange(questionIds.detailsQTImagingLeft, e.target.value)
        }
      />
    ) : null}
  </div>
</div>
          )
        }

        </div>
      </div>
    </div>
  );
};

export default PreviousQTExam;
