import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { useState } from "react";
import { uploadService } from "@/services/commonServices";
import DatePicker from "@/components/date-picker";
import { IntakeOption } from "../MainInTakeForm";



interface QuestionIds {
  previousBiopsy: number;
  previousBiopsyDate: number;
  biopsyResults: number;
  biopsyResultsDetails: number;
  reportAvailablity: number;
  reportDetails: number;
  additionalComments: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const Biopsy: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  console.log(formData);

  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const [selectedFileName, setSelectedFileName] = useState("");
  const uploadedFileName = getAnswer(questionIds.reportDetails);
  const showBiopsyDetails = getAnswer(questionIds.previousBiopsy) === "Yes";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name); // Optimistic UI update
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      try {
        const response = await uploadService.uploadFile({ formFile: formDataObj });
        if (response.status) {
          handleInputChange(questionIds.reportDetails, response.fileName);
        } else {
          setSelectedFileName(""); // Revert on failure
        }
      } catch (error) {
        console.error("File upload failed:", error);
        setSelectedFileName(""); // Revert on failure
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="Biopsy" className="uppercase" />

      <div className="flex-grow overflow-y-auto p-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10">
        <div className="flex flex-col flex-wrap gap-x-4 gap-y-2">
          <Label className="text-base font-semibold block mb-2">
            <span>A. Previous breast biopsies or procedures?</span>
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="flex flex-col sm:flex-row gap-4 pl-4 h-[auto] lg:h-[40px]">
            {/* Radio Options */}
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="previous-biopsy"
                id="biopsy-no"
                value="No"
                className="custom-radio"
                checked={getAnswer(questionIds.previousBiopsy) === "No"}
                onChange={(e) =>
                  handleInputChange(questionIds.previousBiopsy, e.target.value)
                }
                required
              />
              <Label htmlFor="biopsy-no">No</Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="previous-biopsy"
                id="biopsy-yes"
                value="Yes"
                className="custom-radio"
                checked={getAnswer(questionIds.previousBiopsy) === "Yes"}
                onChange={(e) =>
                  handleInputChange(questionIds.previousBiopsy, e.target.value)
                }
                required
              />
              <Label htmlFor="biopsy-yes">Yes</Label>
            </div>

            {/* Date */}
            {showBiopsyDetails && (
              <div className="flex items-center gap-2">
                <div className="w-36">
                  <DatePicker
                    value={
                      getAnswer(questionIds.previousBiopsyDate)
                        ? new Date(getAnswer(questionIds.previousBiopsyDate))
                        : undefined
                    }
                    onChange={(val) =>
                      handleInputChange(
                        questionIds.previousBiopsyDate,
                        val?.toLocaleDateString("en-CA") || ""
                      )
                    }
                    required={showBiopsyDetails}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="previous-biopsy"
                id="biopsy-unknown"
                value="Unknown"
                className="custom-radio"
                checked={getAnswer(questionIds.previousBiopsy) === "Unknown"}
                onChange={(e) =>
                  handleInputChange(questionIds.previousBiopsy, e.target.value)
                }
                required
              />
              <Label htmlFor="biopsy-unknown">Unknown</Label>
            </div>
          </div>
        </div>

        <LabeledRadioWithOptionalInput
          name="morphology-change"
          label="B. If yes, were any results abnormal?"
          questionId={questionIds.biopsyResults}
          optionalInputQuestionId={questionIds.biopsyResultsDetails}
          formData={formData}
          handleInputChange={handleInputChange}
          options={[
            { label: "No", value: "No" },
            { label: "Unknown", value: "Unknown" },
            { label: "Yes", value: "Yes" },
          ]}
          showInputWhenValue="Yes"
          inputPlaceholder="Details"
          required={showBiopsyDetails}
        />

        <div className="space-y-4">
          <MultiOptionRadioGroup
            label="C. Report Available"
            questionId={questionIds.reportAvailablity}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "Not Available", value: "Not Available" },
              { label: "Available", value: "Available" },
            ]}
            required={showBiopsyDetails}
          />

          {showBiopsyDetails && getAnswer(questionIds.reportAvailablity) === "Available" && (
            <div className="pl-4">
              <span className="text-sm text-muted-foreground">
                Please Upload the Report
              </span>
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium">Upload Report</Label>
                <label className="cursor-pointer border px-3 py-1 rounded bg-white hover:bg-gray-100">
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    required={getAnswer(questionIds.reportAvailablity) === "Available"}
                  />
                  Upload File
                </label>
                {(selectedFileName || uploadedFileName) && (
                  <span className="text-sm">
                    {selectedFileName || uploadedFileName}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-2">
          <Label className="font-semibold text-base flex flex-wrap gap-1">
            D. Others / Additional Comments
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
  );
};

export default Biopsy;
