import React, { useState, useCallback, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { uploadService } from "@/services/commonServices";
import { Textarea } from "@/components/ui/textarea";
import {
  ResponseAudit,
  ResponsePatientForm,
} from "./TechnicianPatientIntakeForm";
import { Edit, Info, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import FileView from "@/components/FileView/FileView";
import { Input } from "@/components/ui/input";

// Interfaces
interface IntakeOption {
  questionId: number;
  answer: string;
}

interface PatientQuestionIds {
  thermogramYesNo: number;
  thermogramDateKnown: number;
  thermogramDate: number;
  thermogramResult: number;
  thermogramReportAvailable: number;
  thermogramReportDetails: number;

  mammogramYesNo: number;
  mammogramDateKnown: number;
  mammogramDate: number;
  mammogramResult: number;
  mammogramReportAvailable: number;
  mammogramReportDetails: number;

  breastUltrasoundYesNo: number;
  breastUltrasoundDateKnown: number;
  breastUltrasoundDate: number;
  breastUltrasoundResult: number;
  breastUltrasoundReportAvailable: number;
  breastUltrasoundReportDetails: number;

  breastMRIYesNo: number;
  breastMRIDateKnown: number;
  breastMRIDate: number;
  breastMRIResult: number;
  breastMRIReportAvailable: number;
  breastMRIReportDetails: number;

  petctYesNo: number;
  petctDateKnown: number;
  petctDate: number;
  petctResult: number;
  petctReportAvailable: number;
  petctReportDetails: number;

  qtImagingYesNo: number;
  qtimageDateKnown: number;
  qtimageDate: number;
  qtimageResult: number;
  qtimageReportAvailable: number;
  qtimageReportDetails: number;

  otherImagingYesNo: number;
  otherImagingDateKnown: number;
  otherImagingDate: number;
  otherImagingResult: number;
  otherImagingReportAvailable: number;
  otherImagingReportDetails: number;

  additionalComments: number;
}

interface Props {
  formData: IntakeOption[];
  patientFormData: ResponsePatientForm[];
  handleInputChange: (questionId: number, value: string) => void;
  handleInputChangePatient: (questionId: number, value: string) => void;
  setPatientFormData: React.Dispatch<
    React.SetStateAction<ResponsePatientForm[]>
  >;
  questionIds: PatientQuestionIds;
  auditData: ResponseAudit[];
  readOnly?: boolean;
}

interface ImagingSectionProps {
  label: string;
  idPrefix: string;
  yesNoId: number;
  dateKnownId: number;
  dateId: number;
  resultId: number;
  reportAvailableId: number;
  reportDetailsId: number;
  formData: IntakeOption[];
  patientFormData: ResponsePatientForm[];
  handleInputChange: (questionId: number, value: string) => void;
  editStatus: boolean;
  readOnly?: boolean;
}

interface ImagingSection {
  label: string;
  idPrefix: string;
  yesNoId: number;
  dateKnownId: number;
  dateId: number;
  resultId: number;
  reportAvailableId: number;
  reportDetailsId: number;
}

interface AnswersState {
  yesNo: string;
  dateKnown: string;
  date: string;
  result: string;
  reportAvailable: string;
  reportDetails: string;
}

interface SnapshotItem {
  label: string;
  value: string;
}

// Extract ImagingSection as a separate memoized component
const ImagingSection: React.FC<ImagingSectionProps> = React.memo(
  ({
    label,
    idPrefix,
    yesNoId,
    dateKnownId,
    dateId,
    resultId,
    reportAvailableId,
    reportDetailsId,
    patientFormData,
    handleInputChange,
    editStatus,
    readOnly = false,
  }) => {
    // Memoize the getAnswer function
    const getAnswer = useCallback(
      (id: number): string => {
        return patientFormData.find((q) => q.questionId === id)?.answer || "";
      },
      [patientFormData]
    );

    // Memoize computed values
    const answers: AnswersState = useMemo(
      () => ({
        yesNo: getAnswer(yesNoId),
        dateKnown: getAnswer(dateKnownId),
        date: getAnswer(dateId),
        result: getAnswer(resultId),
        reportAvailable: getAnswer(reportAvailableId),
        reportDetails: getAnswer(reportDetailsId),
      }),
      [
        getAnswer,
        yesNoId,
        dateKnownId,
        dateId,
        resultId,
        reportAvailableId,
        reportDetailsId,
      ]
    );

    const showDetails = answers.yesNo === "Yes";
    const showUpload = showDetails && answers.reportAvailable === "Available";

    // Memoize file handling functions
    const handleFileChange = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const values: string[] = JSON.parse(answers.reportDetails || "[]");

        for (const file of files) {
          if (file) {
            const formDataObj = new FormData();
            formDataObj.append("file", file);
            try {
              const response = await uploadService.uploadFile(file);
              if (response.status) {
                const cleanUrl = response.viewURL.includes("?")
                  ? response.viewURL.split("?")[0]
                  : response.viewURL;
                values.push(cleanUrl);
              }
            } catch (error) {
              console.error("File upload failed:", error);
            }
          }
        }
        handleInputChange(reportDetailsId, JSON.stringify(values));
      },
      [answers.reportDetails, handleInputChange, reportDetailsId]
    );

    const handleDeleteFile = useCallback(
      (fileToDelete: string) => {
        const values: string[] = JSON.parse(answers.reportDetails || "[]");
        const updatedValues = values.filter((file) => file !== fileToDelete);
        handleInputChange(reportDetailsId, JSON.stringify(updatedValues));
      },
      [answers.reportDetails, handleInputChange, reportDetailsId]
    );

    // Memoize radio button handlers
    const handleYesNoChange = useCallback(
      (val: string) => {
        handleInputChange(yesNoId, val);
      },
      [handleInputChange, yesNoId]
    );

    const handleResultChange = useCallback(
      (val: string) => {
        handleInputChange(resultId, val);
      },
      [handleInputChange, resultId]
    );

    const handleDateKnownChange = useCallback(
      (val: string) => {
        handleInputChange(dateKnownId, val);
      },
      [handleInputChange, dateKnownId]
    );

    const handleDateChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(dateId, e.target.value);
      },
      [handleInputChange, dateId]
    );

    const handleReportAvailableChange = useCallback(
      (val: string) => {
        handleInputChange(reportAvailableId, val);
      },
      [handleInputChange, reportAvailableId]
    );

    return (
      <div className="space-y-4">
        <p className="font-semibold text-base">
          {label} <span className="text-red-500">*</span>
        </p>

        <div className="flex flex-col items-start gap-6">
          {/* YES/NO */}
          <div className="flex items-center gap-4">
            {(["No", "Yes"] as const).map((val) => (
              <label key={val} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`${idPrefix}-yesno`}
                  value={val}
                  checked={answers.yesNo === val}
                  onChange={() => handleYesNoChange(val)}
                  onDoubleClick={() => handleYesNoChange("")}
                  className="custom-radio"
                  required
                />
                <span>{val}</span>
              </label>
            ))}
          </div>

          {/* RESULT */}
          {showDetails && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Label className="text-sm font-medium lg:w-40">RESULT</Label>
              {(["Normal", "Abnormal", "Unknown"] as const).map((val) => (
                <label key={val} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`${idPrefix}-result`}
                    value={val}
                    checked={answers.result === val}
                    onChange={() => handleResultChange(val)}
                    onDoubleClick={() => handleResultChange("")}
                    className="custom-radio"
                    required={showDetails}
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {showDetails && (
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 min-h-9">
            <Label className="text-sm font-medium uppercase lg:w-40">
              SCAN DATE?
            </Label>
            {(["Unknown", "Known"] as const).map((val) => (
              <label key={val} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`${idPrefix}-report-date`}
                  value={val}
                  checked={answers.dateKnown === val}
                  onChange={() => handleDateKnownChange(val)}
                  onDoubleClick={() => handleDateKnownChange("")}
                  className="custom-radio"
                  required={showDetails}
                />
                <span>{val}</span>
              </label>
            ))}
            {answers.dateKnown === "Known" && (
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">DATE</Label>
                <div className="w-48">
                  <Input
                    value={answers.date}
                    onChange={handleDateChange}
                    required={answers.reportAvailable === "Available"}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Report Available */}
        {showDetails && (
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <Label className="text-sm font-medium lg:w-40">
                REPORT AVAILABLE?
              </Label>
              {(["Not Available", "Available"] as const).map((val) => (
                <label key={val} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`${idPrefix}-report`}
                    value={val}
                    checked={answers.reportAvailable === val}
                    onChange={() => handleReportAvailableChange(val)}
                    onDoubleClick={() => handleReportAvailableChange("")}
                    className="custom-radio"
                    required={showDetails}
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* File Upload Section */}
        {showUpload && (
          <>
            <span className="text-sm text-muted-foreground">
              Please Upload the Report
            </span>
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium">UPLOAD REPORT</Label>
              <label className="cursor-pointer border px-3 py-1 rounded bg-white hover:bg-gray-100">
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                  disabled={editStatus}
                  required={(() => {
                    try {
                      const parsed: string[] = JSON.parse(
                        answers.reportDetails || "[]"
                      );
                      return parsed.length === 0;
                    } catch {
                      return true;
                    }
                  })()}
                />
                Upload File
              </label>
            </div>
            {answers.reportDetails &&
              (() => {
                try {
                  const fileUrls: string[] = JSON.parse(answers.reportDetails);

                  return fileUrls.length > 0 ? (
                    <div className="w-full space-y-2">
                      {fileUrls.map((fileUrl: string, index: number) => {
                        const displayName =
                          fileUrl.split("/").pop() || "unknown_file";

                        return (
                          <div
                            key={index}
                            className="bg-[#f9f4ed] rounded-lg px-2 py-2 w-full flex justify-between items-center gap-3 text-sm font-medium pointer-events-auto"
                          >
                            <FileView
                              displayName={displayName}
                              fileUrl={fileUrl}
                            />
                            {!readOnly && (
                              <div
                                className="cursor-pointer"
                                onClick={() => handleDeleteFile(fileUrl)} 
                              >
                                <Trash size={15} className="text-red-500" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null;
                } catch (err) {
                  console.error("Invalid reportDetails JSON:", err);
                  return null;
                }
              })()}
          </>
        )}
      </div>
    );
  }
);

// Set display name for React DevTools
ImagingSection.displayName = "ImagingSection";

// Main component
const PriorImaging: React.FC<Props> = ({
  formData,
  handleInputChange,
  handleInputChangePatient,
  patientFormData,
  setPatientFormData,
  questionIds,
  auditData,
  readOnly = false,
}) => {
  console.log(auditData);
  const [editStatuses, setEditStatuses] = useState<Record<string, boolean>>({});
  const [patientSnapshot, setPatientSnapshot] = useState<
    Record<string, SnapshotItem[]>
  >({});

  // Memoize helper functions
  const getPatientFormAnswer = useCallback(
    (id: number): string => {
      return patientFormData?.find((q) => q.questionId === id)?.answer || "";
    },
    [patientFormData]
  );

  const handleEditClick = useCallback(
    (
      imagingKey: string,
      questionIdsToCopy: number[],
      patientAnswerLabels: string[]
    ) => {
      const snapshot: SnapshotItem[] = questionIdsToCopy.map((qId, index) => ({
        label: patientAnswerLabels[index],
        value: getPatientFormAnswer(qId),
      }));
      setPatientSnapshot((prev) => ({ ...prev, [imagingKey]: snapshot }));
      questionIdsToCopy.forEach((qId) => {
        handleInputChange(qId, getPatientFormAnswer(qId));
      });
      setEditStatuses((prev) => ({ ...prev, [imagingKey]: true }));
    },
    [getPatientFormAnswer, handleInputChange]
  );

  const handleVerifyChange = useCallback(
    (mainQId: number, checked: boolean) => {
      setPatientFormData((prev) =>
        prev.map((item) =>
          item.questionId === mainQId
            ? { ...item, verifyTechnician: checked }
            : item
        )
      );
    },
    [setPatientFormData]
  );

  // Memoize imaging sections configuration
  const imagingSections: ImagingSection[] = useMemo(
    () => [
      {
        label: "A. Thermogram",
        idPrefix: "thermogram",
        yesNoId: questionIds.thermogramYesNo,
        dateKnownId: questionIds.thermogramDateKnown,
        dateId: questionIds.thermogramDate,
        resultId: questionIds.thermogramResult,
        reportAvailableId: questionIds.thermogramReportAvailable,
        reportDetailsId: questionIds.thermogramReportDetails,
      },
      {
        label: "B. Mammogram",
        idPrefix: "mammogram",
        yesNoId: questionIds.mammogramYesNo,
        dateKnownId: questionIds.mammogramDateKnown,
        dateId: questionIds.mammogramDate,
        resultId: questionIds.mammogramResult,
        reportAvailableId: questionIds.mammogramReportAvailable,
        reportDetailsId: questionIds.mammogramReportDetails,
      },
      {
        label: "C. Breast Ultrasound / HERscan",
        idPrefix: "ultrasound",
        yesNoId: questionIds.breastUltrasoundYesNo,
        dateKnownId: questionIds.breastUltrasoundDateKnown,
        dateId: questionIds.breastUltrasoundDate,
        resultId: questionIds.breastUltrasoundResult,
        reportAvailableId: questionIds.breastUltrasoundReportAvailable,
        reportDetailsId: questionIds.breastUltrasoundReportDetails,
      },
      {
        label: "D. Breast MRI",
        idPrefix: "mri",
        yesNoId: questionIds.breastMRIYesNo,
        dateKnownId: questionIds.breastMRIDateKnown,
        dateId: questionIds.breastMRIDate,
        resultId: questionIds.breastMRIResult,
        reportAvailableId: questionIds.breastMRIReportAvailable,
        reportDetailsId: questionIds.breastMRIReportDetails,
      },
      {
        label: "E. PET/CT Scan",
        idPrefix: "petct",
        yesNoId: questionIds.petctYesNo,
        dateKnownId: questionIds.petctDateKnown,
        dateId: questionIds.petctDate,
        resultId: questionIds.petctResult,
        reportAvailableId: questionIds.petctReportAvailable,
        reportDetailsId: questionIds.petctReportDetails,
      },
      {
        label: "F. QT Imaging",
        idPrefix: "qt",
        yesNoId: questionIds.qtImagingYesNo,
        dateKnownId: questionIds.qtimageDateKnown,
        dateId: questionIds.qtimageDate,
        resultId: questionIds.qtimageResult,
        reportAvailableId: questionIds.qtimageReportAvailable,
        reportDetailsId: questionIds.qtimageReportDetails,
      },
      {
        label:
          "G. Other Imaging or Scans ( Like Bone scans, Scintimammography, etc)",
        idPrefix: "otherscan",
        yesNoId: questionIds.otherImagingYesNo,
        dateKnownId: questionIds.otherImagingDateKnown,
        dateId: questionIds.otherImagingDate,
        resultId: questionIds.otherImagingResult,
        reportAvailableId: questionIds.otherImagingReportAvailable,
        reportDetailsId: questionIds.otherImagingReportDetails,
      },
    ],
    [questionIds]
  );

  // Memoize checkbox render function
  const renderCheckbox = useCallback(
    (label: string, mainQId: number) => (
      <div className="flex flex-col items-center w-25 gap-1">
        <div className="text-xs font-medium">{label}</div>
        <Checkbox2
          className="bg-white data-[state=checked]:text-[#f9f4ed] rounded-full"
          checked={
            !!patientFormData.find((q) => q.questionId === mainQId)
              ?.verifyTechnician
          }
          onClick={() =>
            handleVerifyChange(
              mainQId,
              !patientFormData.find((q) => q.questionId === mainQId)
                ?.verifyTechnician
            )
          }
          required
        />
      </div>
    ),
    [patientFormData, handleVerifyChange]
  );

  const renderImagingSectionWithVerification = useCallback(
    (sectionProps: ImagingSection) => {
      const isEditing = editStatuses[sectionProps.idPrefix] || false;
      const snapshot = patientSnapshot[sectionProps.idPrefix] || [];

      const patientQIds = [
        sectionProps.yesNoId,
        sectionProps.dateId,
        sectionProps.resultId,
        sectionProps.reportAvailableId,
      ];
      const patientLabels = ["Answer", "Date", "Result", "Report Available"];

      return (
        <div
          key={sectionProps.idPrefix}
          className="flex w-full items-center border-b my-2 pb-4 border-gray-200"
        >
          <div className="w-[80%] relative">
            <ImagingSection
              {...sectionProps}
              formData={formData}
              handleInputChange={handleInputChangePatient}
              patientFormData={patientFormData}
              editStatus={!isEditing}
              readOnly={readOnly}
            />
            {!isEditing && (
              <div className="absolute top-0 left-0 w-full h-full z-10 cursor-not-allowed" />
            )}
          </div>
          <div className="w-[20%] flex justify-center items-start pl-4">
            <div className="flex items-center gap-3">
              {renderCheckbox("Confirm", sectionProps.yesNoId)}
              {!readOnly &&
                (!isEditing ? (
                  <div className="flex flex-col items-center gap-1 w-20">
                    <span className="text-xs font-medium">Edit</span>
                    <Edit
                      className="w-4 h-4 cursor-pointer"
                      onClick={() =>
                        handleEditClick(
                          sectionProps.idPrefix,
                          patientQIds,
                          patientLabels
                        )
                      }
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-20">
                    <span className="text-xs font-medium">Info</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Info className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-4 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="font-medium text-gray-900 border-b pb-2 mb-2">
                            Patient Response
                          </div>
                          {snapshot.map(
                            (pa: SnapshotItem) =>
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
                ))}
            </div>
          </div>
        </div>
      );
    },
    [
      editStatuses,
      patientSnapshot,
      formData,
      handleInputChangePatient,
      patientFormData,
      readOnly,
      renderCheckbox,
      handleEditClick,
    ]
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div
        className={`flex-grow p-4 lg:pt-0 space-y-8 pb-10 relative ${
          readOnly ? "pointer-events-none" : ""
        }`}
      >
        {imagingSections.map((sectionProps) =>
          renderImagingSectionWithVerification(sectionProps)
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Label className="font-semibold text-base flex flex-wrap gap-1">
            H. Others / Additional Comments
          </Label>
          <Textarea
            className="w-full"
            value={getPatientFormAnswer(questionIds.additionalComments)}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleInputChangePatient(
                questionIds.additionalComments,
                e.target.value
              )
            }
            placeholder="Enter Details"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PriorImaging);
