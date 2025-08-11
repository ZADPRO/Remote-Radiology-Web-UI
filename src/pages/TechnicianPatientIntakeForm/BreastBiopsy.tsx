import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import {
  ResponseAudit,
  ResponsePatientForm,
} from "./TechnicianPatientIntakeForm";
import { Edit, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import { downloadDocumentFile } from "@/lib/commonUtlis";
import { uploadService } from "@/services/commonServices";

interface IntakeOption {
  questionId: number;
  answer: string;
}

interface QuestionIds {
  breastBiopsy: number;
  left: number;
  right: number;
  benign: number;
  malignant: number;
  reportsAttached: number;
}

interface Props {
  technicianFormData: IntakeOption[];
  patientFormData: ResponsePatientForm[];
  auditData: ResponseAudit[];
  handleInputChange: (questionId: number, value: string) => void;
  handlePatientInputChange: (questionId: number, value: string) => void;
  setPatientFormData: any;
  questionIds: QuestionIds;
  readOnly?: boolean;
}

const BreastBiopsy: React.FC<Props> = ({
  technicianFormData,
  patientFormData,
  auditData,
  handleInputChange,
  handlePatientInputChange,
  setPatientFormData,
  readOnly,
}) => {
  const [editStatuses, setEditStatuses] = useState<Record<string, boolean>>({});

  console.log(technicianFormData, handleInputChange);
  // const getTechnicianAnswer = (id: number) => technicianFormData.find((q) => q.questionId === id)?.answer || "";
  const getPatientAnswer = (id: number) =>
    patientFormData.find((q) => q.questionId === id)?.answer || "";

  const handleVerifyChange = (mainQuestionId: number, checked: boolean) => {
    setPatientFormData((prev: ResponsePatientForm[]) =>
      prev.map((item) =>
        item.questionId === mainQuestionId
          ? { ...item, verifyTechnician: checked }
          : item
      )
    );
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: number
  ) => {
    console.log("############Chnaged");
    const file = e.target.files?.[0];
    if (file) {
      // setSelectedFileName(file.name); // Optimistic UI update
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      try {
        const response = await uploadService.uploadFile({
          formFile: formDataObj,
        });
        if (response.status) {
          console.log(questionId, response.status, response.fileName);
          handlePatientInputChange(questionId, response.fileName);
        } else {
          // setSelectedFileName(""); // Revert on failure
        }
      } catch (error) {
        console.error("File upload failed:", error);
        // setSelectedFileName(""); // Revert on failure
      }
    }
  };

  const handleEditClick = (sectionKey: string) => {
    setEditStatuses((prev) => ({ ...prev, [sectionKey]: true }));
  };

  const renderPatientRadioGroup = (
    name: string,
    questionId: number,
    options: string[],
    isEditable: boolean
  ) => (
    <div className="flex flex-wrap gap-4">
      {options.map((value) => (
        <div key={value} className="flex items-center space-x-2">
          <input
            type="radio"
            id={`${name}-${value.toLowerCase()}`}
            name={name}
            value={value}
            checked={getPatientAnswer(questionId) === value}
            onChange={(e) =>
              isEditable && handlePatientInputChange(questionId, e.target.value)
            }
            className="custom-radio"
            disabled={!isEditable}
            required
          />
          <Label htmlFor={`${name}-${value.toLowerCase()}`}>{value}</Label>
        </div>
      ))}
    </div>
  );

  const renderCheckbox = (label: string, id: number, isEditable: boolean) => (
    <div className="flex items-center gap-2">
      <Checkbox2
        className="bg-white data-[state=checked]:text-[#f9f4ed]"
        checked={getPatientAnswer(id) === "true"}
        onClick={() =>
          isEditable &&
          handlePatientInputChange(
            id,
            getPatientAnswer(id) === "true" ? "" : "true"
          )
        }
        disabled={!isEditable}
        required={getPatientAnswer(434) != "true" && getPatientAnswer(435) != "true"}
      />
      <div className="text-sm sm:text-base font-medium">{label}</div>
    </div>
  );

  const renderSectionWithVerification = (
    sectionKey: string,
    mainQuestionId: number, // This will be 160 for Breast Biopsy
    patientQuestionIds: number[],
    patientAnswerLabels: string[],
    children: React.ReactNode
  ) => {
    const isEditing = editStatuses[sectionKey] || false;
    const patientAnswers = patientQuestionIds.map((id, index) => {
      let parsedEntry = null;

      // Loop through auditData to find matching label after parsing refTHData
      for (const entry of auditData || []) {
        try {
          const parsed = JSON.parse(entry.refTHData);
          if (Array.isArray(parsed)) {
            const found = parsed.find((d) => Number(d.label) === id);
            if (found) {
              parsedEntry = found;
              break;
            }
          }
        } catch {
          continue;
        }
      }

      return {
        label: patientAnswerLabels[index],
        value: parsedEntry?.newValue || "",
      };
    });

    return (
      <div className="flex flex-col lg:flex-row w-full items-start py-4">
        <div className="w-full lg:w-[80%] relative">
          {children}
          {!isEditing && (
            <div className="absolute top-0 left-0 w-full h-full bg-transparent z-10 cursor-not-allowed" />
          )}
        </div>
        <div className="lg:w-[20%] w-full flex justify-end lg:justify-center items-end lg:items-start pl-4">
          <div className="flex gap-3">
            {/* Check to Confirm Checkbox */}
            <div className={cn(`flex flex-col items-center w-25 gap-1`)}>
              <div className="text-xs sm:text-xs font-medium">
                Confirm
              </div>
              <Checkbox2
                className="bg-white data-[state=checked]:text-[#f9f4ed] rounded-full"
                checked={
                  patientFormData.find((q) => q.questionId === mainQuestionId)
                    ?.verifyTechnician || false
                }
                onClick={() =>
                  handleVerifyChange(
                    mainQuestionId,
                    !(
                      patientFormData.find(
                        (q) => q.questionId === mainQuestionId
                      )?.verifyTechnician || false
                    )
                  )
                }
                required
              />
            </div>

            {/* Edit / Info Icons */}
            {!readOnly && (
            !isEditing ? (
              <div className="flex w-20 flex-col gap-1 items-center">
                <div className="text-xs sm:text-xs font-medium">Edit</div>
                <Edit
                  onClick={() => handleEditClick(sectionKey)}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
            ) : (
              <div className="flex w-20 flex-col gap-1 items-center">
                <div className="text-xs sm:text-xs font-medium">Info</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Info className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="font-medium text-gray-900 border-b pb-2 mb-2">
                        Patient Response
                      </div>
                      {patientAnswers.map(
                        (pa) =>
                          pa.value && (
                            <div
                              key={pa.label}
                              className="flex justify-between items-center"
                            >
                              <span className="font-medium text-gray-800">
                                {pa.label}:
                              </span>
                              <span className="text-gray-600 text-right">
                                {pa.value}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )
          )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-6 overflow-y-auto relative">
      <div className={`${readOnly ? "pointer-events-none" : ""}`}>
        {/* Breast Biopsy Section with Verification */}
        {renderSectionWithVerification(
          "breastBiopsy",
          160, // Hardcoded main QID for Breast Biopsy for verification and patient data lookup
          [
            160,
            164, // Reports Attached
          ],
          ["Had Biopsy", "Reports Available"],
          <div className="flex flex-col gap-5">
            {/* Title */}
            <Label className="text-base font-semibold">Breast Biopsy</Label>

            {/* Main Biopsy Question - hardcoded 160 */}
            {renderPatientRadioGroup(
              "breastbiopsy",
              160,
              ["No", "Yes", "Unknown"],
              editStatuses["breastBiopsy"]
            )}

            {getPatientAnswer(160) === "Yes" && ( // Check against hardcoded 160
              <>
                {/* Checkboxes for L/R */}
                <div className="flex gap-4">
                  {renderCheckbox("Left", 434, editStatuses["breastBiopsy"])}

                  {getPatientAnswer(434) === "true" && (
                    <MultiRadioOptionalInputInline
                      questionId={436}
                      formData={patientFormData}
                      handleInputChange={handlePatientInputChange}
                      options={[
                        { label: "Benign", value: "Benign" },
                        {
                          label: "Malignant",
                          value: "Malignant",
                        },
                      ]}
                      required
                    />
                  )}
                </div>

                {/* Checkboxes for Benign/Malignant */}
                <div className="flex gap-4">
                  {renderCheckbox("Right", 435, editStatuses["breastBiopsy"])}
                  {getPatientAnswer(435) === "true" && (
                    <MultiRadioOptionalInputInline
                      questionId={437}
                      formData={patientFormData}
                      handleInputChange={handlePatientInputChange}
                      options={[
                        { label: "Benign", value: "Benign" },
                        {
                          label: "Malignant",
                          value: "Malignant",
                        },
                      ]}
                    />
                  )}
                </div>
              </>
            )}

            {/* Reports attached - hardcoded 164 */}
            <div className="flex flex-col lg:flex-row gap-2">
              <Label className="text-base font-semibold">
                Reports available:
              </Label>
              {renderPatientRadioGroup(
                "reportsattached",
                164,
                ["Not Available", "Available"],
                editStatuses["breastBiopsy"]
              )}
            </div>
            {getPatientAnswer(164) === "Available" && (
              <>
                <span className="text-sm text-muted-foreground">
                  Please Upload the Report
                </span>
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium">UPLOAD REPORT</Label>
                  <label className="cursor-pointer border px-3 py-1 rounded bg-white hover:bg-gray-100">
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        handleFileChange(e, 165);
                      }}
                      // disabled={editStatus}
                      required={getPatientAnswer(165) == ""}
                    />
                    Upload File
                  </label>
                  {getPatientAnswer(165) && (
                    <span
                      className="text-sm cursor-pointer pointer-events-auto underline hover:underline-offset-2"
                      onClick={() =>
                        downloadDocumentFile(
                          patientFormData.find((q) => q.questionId === 165)
                            ?.file?.base64Data || "",
                          patientFormData.find((q) => q.questionId === 165)
                            ?.file?.contentType || "",
                          getPatientAnswer(165)
                        )
                      }
                    >
                      {getPatientAnswer(165) || "Report"}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreastBiopsy;
