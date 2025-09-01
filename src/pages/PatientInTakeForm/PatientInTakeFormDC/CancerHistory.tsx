import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/date-picker";
import { IntakeOption } from "../PatientInTakeForm";
import { Textarea } from "@/components/ui/textarea";
import { parseLocalDate } from "@/lib/dateUtils";
import SingleBreastPositionPicker from "@/components/ui/CustomComponents/SingleBreastPositionPicker";
import TextEditor from "@/components/TextEditor";
import { Input } from "@/components/ui/input";
import { PatientHistoryReportGenerator } from "@/pages/Report/GenerateReport/PatientHistoryReportGenerator";

interface QuestionIds {
  cancerHistory: number;
  historyPosition: number;
  historyclockposition: number;
  cancerDate: number;
  cancerType: number;
  cancerTreatment: number;
  cancerTreatmentOther: number;
  cancerTreatmentdate: number;
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
  readOnly,
}) => {
  console.log(formData);

  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="Cancer History" className="uppercase" />
      <div className="bg-[#fff]">
        {
          <TextEditor
            value={PatientHistoryReportGenerator(formData)}
            readOnly={true}
          />
        }
      </div>
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
            <>
              <div className="pl-4 flex flex-col lg:flex-row h-auto items-start ml-5 lg:ml-0 lg:items-end gap-3">
                <MultiOptionRadioGroup
                  label="If Yes,"
                  questionId={questionIds.historyPosition}
                  handleInputChange={handleInputChange}
                  formData={formData}
                  options={[
                    { label: "Right", value: "Right" },
                    { label: "Left", value: "Left" },
                    { label: "Both", value: "Both" },
                  ]}
                  required
                />
                <SingleBreastPositionPicker
                  value={getAnswer(questionIds.historyclockposition)}
                  onChange={(val) =>
                    handleInputChange(questionIds.historyclockposition, val)
                  }
                  singleSelect={true}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-bold text-base">
                  B. Date of diagnosis
                </Label>
                <div>
                  <DatePicker
                    value={
                      getAnswer(questionIds.cancerDate)
                        ? parseLocalDate(getAnswer(questionIds.cancerDate))
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

              <MultiOptionRadioGroup
                label="D. Treatment received"
                className="sm:h-0 h-0 mb-3"
                questionId={questionIds.cancerTreatment}
                handleInputChange={handleInputChange}
                formData={formData}
                options={[
                  { label: "Chemotherapy", value: "Chemotherapy" },
                  {
                    label: "Radiation",
                    value: "Radiation",
                  },
                  { label: "Surgery", value: "Surgery" },
                  { label: "Cyroablation", value: "Cyroablation" },
                  { label: "Other", value: "Other" },
                ]}
              />

              {getAnswer(questionIds.cancerTreatment) === "Other" && (
                <Input
                  type="text"
                  value={getAnswer(questionIds.cancerTreatmentOther)}
                  onChange={(e) =>
                    handleInputChange(
                      questionIds.cancerTreatmentOther,
                      e.target.value
                    )
                  }
                  required
                  placeholder="Specify"
                  className="w-64 text-sm"
                />
              )}

              <div className="flex items-center gap-4">
                <Label className="text-bold text-base">
                  Last date of treatment
                </Label>
                <div>
                  <DatePicker
                    value={
                      getAnswer(questionIds.cancerTreatmentdate)
                        ? parseLocalDate(
                            getAnswer(questionIds.cancerTreatmentdate)
                          )
                        : undefined
                    }
                    onChange={(val) =>
                      handleInputChange(
                        questionIds.cancerTreatmentdate,
                        val?.toLocaleDateString("en-CA") || ""
                      )
                    }
                    disabledDates={(date) => date > new Date()}
                  />
                </div>
              </div>

              <MultiOptionRadioGroup
                label="F. Current status"
                questionId={questionIds.cancerStatus}
                handleInputChange={handleInputChange}
                formData={formData}
                options={[
                  { label: "Ongoing treatment", value: "Ongoing treatment" },
                  {
                    label: "Completed treatment",
                    value: "Completed treatment",
                  },
                  {
                    label: "Recurrence suspected",
                    value: "Recurrence suspected",
                  },
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
                    handleInputChange(
                      questionIds.cancerFolowupDate,
                      e.target.value
                    )
                  }
                  className="w-78 text-sm"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancerHistory;
