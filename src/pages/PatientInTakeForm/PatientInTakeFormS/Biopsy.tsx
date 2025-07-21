import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { useState } from "react";
import { uploadService } from "@/services/commonServices";
import DatePicker from "@/components/date-picker";
import { IntakeOption } from "../PatientInTakeForm";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { downloadDocumentFile } from "@/lib/commonUtlis";

interface QuestionIds {
  previousBiopsy: number;
  previousBiopsyDate: number;
  biopsyResults: number;
  biopsyResultsDetails: number;
  reportAvailablity: number;
  reportDetails: number;
  biopsyRight: number
  biopsyLeft: number;
  biopsyRightType: number;
  biopsyLeftType: number;
  additionalComments: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const Biopsy: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly
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

    const getFile =  formData.find((q) => q.questionId === questionIds.reportDetails)?.file;

  return (
    <div className="flex flex-col h-full relative">
      <FormHeader FormTitle="Biopsy" className="uppercase" />
      <div className={readOnly ? "pointer-events-none" : ""}>
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
                    handleInputChange(
                      questionIds.previousBiopsy,
                      e.target.value
                    )
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
                    handleInputChange(
                      questionIds.previousBiopsy,
                      e.target.value
                    )
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
                      disabledDates={(date) => date > new Date()}
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
                    handleInputChange(
                      questionIds.previousBiopsy,
                      e.target.value
                    )
                  }
                  required
                />
                <Label htmlFor="biopsy-unknown">Unknown</Label>
              </div>
            </div>
          </div>

          {getAnswer(questionIds.previousBiopsy) === "Yes" && (
            <div className="pl-4">
              <LabeledRadioWithOptionalInput
                name="morphology-change"
                label="If yes, were any results abnormal?"
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
                optionalInputType="textarea"
                required={showBiopsyDetails}
              />
              <div className="space-y-4 pl-4 py-4">
  {/* Left Biopsy Section */}
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-2">
      <Checkbox2
        id="biopsyLeft"
        checked={getAnswer(questionIds.biopsyLeft) === "true"}
        onCheckedChange={() =>
          handleInputChange(
            questionIds.biopsyLeft,
            getAnswer(questionIds.biopsyLeft) === "true" ? "false" : "true"
          )
        }
      />
      <Label htmlFor="biopsyLeft">Biopsy - Left</Label>
    </div>

    {getAnswer(questionIds.biopsyLeft) === "true" && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
        {["Benign", "Malignant"].map((value) => {
          const id = `biopsy-left-${value.toLowerCase()}`;
          return (
            <div key={id} className="flex items-center gap-2">
              <input
                type="radio"
                id={id}
                name="biopsyLeftType"
                className="custom-radio"
                value={value}
                checked={getAnswer(questionIds.biopsyLeftType) === value}
                onChange={(e) =>
                  handleInputChange(questionIds.biopsyLeftType, e.target.value)
                }
              />
              <Label htmlFor={id}>{value}</Label>
            </div>
          );
        })}
      </div>
    )}
  </div>

  {/* Right Biopsy Section */}
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-2">
      <Checkbox2
        id="biopsyRight"
        checked={getAnswer(questionIds.biopsyRight) === "true"}
        onCheckedChange={() =>
          handleInputChange(
            questionIds.biopsyRight,
            getAnswer(questionIds.biopsyRight) === "true" ? "false" : "true"
          )
        }
      />
      <Label htmlFor="biopsyRight">Biopsy - Right</Label>
    </div>

    {getAnswer(questionIds.biopsyRight) === "true" && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
        {["Benign", "Malignant"].map((value) => {
          const id = `biopsy-right-${value.toLowerCase()}`;
          return (
            <div key={id} className="flex items-center gap-2">
              <input
                type="radio"
                id={id}
                name="biopsyRightType"
                className="custom-radio"
                value={value}
                checked={getAnswer(questionIds.biopsyRightType) === value}
                onChange={(e) =>
                  handleInputChange(questionIds.biopsyRightType, e.target.value)
                }
              />
              <Label htmlFor={id}>{value}</Label>
            </div>
          );
        })}
      </div>
    )}
  </div>
</div>


              <div className="space-y-4">
                <MultiOptionRadioGroup
                  label="Report Available"
                  questionId={questionIds.reportAvailablity}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  options={[
                    { label: "Not Available", value: "Not Available" },
                    { label: "Available", value: "Available" },
                  ]}
                  required={showBiopsyDetails}
                />

                {showBiopsyDetails &&
                  getAnswer(questionIds.reportAvailablity) === "Available" && (
                    <div className="pl-4">
                      <span className="text-sm text-muted-foreground">
                        Please Upload the Report
                      </span>
                      <div className="flex items-center gap-3">
                        <Label className="text-sm font-medium">
                          Upload Report
                        </Label>
                        <label className="cursor-pointer border px-3 py-1 rounded bg-white hover:bg-gray-100">
                          <input
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            required={
                              getAnswer(questionIds.reportAvailablity) ===
                                "Available" &&
                              !(selectedFileName || uploadedFileName)
                            }
                          />
                          Upload File
                        </label>
                        {(selectedFileName || uploadedFileName) && (
                          <span
                                          className={`text-sm ${uploadedFileName && "pointer-events-auto cursor-pointer"}`}
                                          onClick={() => {
                                            console.log(getFile);
                                            getFile &&
                                              downloadDocumentFile(
                                                getFile?.base64Data,
                                                getFile?.contentType,
                                                "Report"
                                              );
                                          }}
                                        >
                                          {selectedFileName || uploadedFileName}
                                        </span>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-2">
            <Label className="font-semibold text-base flex flex-wrap gap-1">
              B. Others / Additional Comments
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

export default Biopsy;
