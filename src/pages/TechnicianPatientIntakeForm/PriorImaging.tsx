import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/date-picker";
import { uploadService } from "@/services/commonServices";
import { Textarea } from "@/components/ui/textarea";
import { IntakeOption } from "../PatientInTakeForm/MainInTakeForm";
import { ResponsePatientForm } from "./TechnicianPatientIntakeForm";
import { downloadDocumentFile } from "@/lib/commonUtlis";
import { Edit, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { cn } from "@/lib/utils";


interface patientQuestionIds {
  thermogramYesNo: number;
  thermogramDate: number;
  thermogramResult: number;
  thermogramReportAvailable: number;
  thermogramReportDetails: number;

  mammogramYesNo: number;
  mammogramDate: number;
  mammogramResult: number;
  mammogramReportAvailable: number;
  mammogramReportDetails: number;

  breastUltrasoundYesNo: number;
  breastUltrasoundDate: number;
  breastUltrasoundResult: number;
  breastUltrasoundReportAvailable: number;
  breastUltrasoundReportDetails: number;

  breastMRIYesNo: number;
  breastMRIDate: number;
  breastMRIResult: number;
  breastMRIReportAvailable: number;
  breastMRIReportDetails: number;

  petctYesNo: number;
  petctDate: number;
  petctResult: number;
  petctReportAvailable: number;
  petctReportDetails: number;

  qtImagingYesNo: number;
  qtimageDate: number;
  qtimageResult: number;
  qtimageReportAvailable: number;
  qtimageReportDetails: number;

  otherImagingYesNo: number;
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
  setPatientFormData: React.Dispatch<React.SetStateAction<ResponsePatientForm[]>>;
  questionIds: patientQuestionIds;
}

interface ImagingSectionProps {
  label: string;
  idPrefix: string;
  yesNoId: number;
  dateId: number;
  resultId: number;
  reportAvailableId: number;
  reportDetailsId: number;
  formData: IntakeOption[];
  patientFormData: ResponsePatientForm[];
  handleInputChange: (questionId: number, value: string) => void;
  editStatus: boolean;
}

const ImagingSection: React.FC<ImagingSectionProps> = ({
  label,
  idPrefix,
  yesNoId,
  dateId,
  resultId,
  reportAvailableId,
  reportDetailsId,
  patientFormData,
  handleInputChange,
  editStatus,
}) => {
  const getAnswer = (id: number) => {
    const source = patientFormData;
    return source.find((q) => q.questionId === id)?.answer || "";
  };
  const [selectedFileName, setSelectedFileName] = useState("");

  const showDetails = getAnswer(yesNoId) === "Yes";
  const showUpload = showDetails && getAnswer(reportAvailableId) === "Available";
  const uploadedFileName = getAnswer(reportDetailsId);

  let getFile:any;
  if(uploadedFileName != "") {
    getFile =  patientFormData.find((q) => q.questionId === reportDetailsId)?.file;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editStatus) return;

    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name); // Optimistic UI update
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      try {
        const response = await uploadService.uploadFile({
          formFile: formDataObj,
        });
        if (response.status) {
          handleInputChange(reportDetailsId, response.fileName);
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
    <div className="space-y-4">
      <p className="font-semibold text-base">
        {label} <span className="text-red-500">*</span>
      </p>

      {/* First line: YES/NO + DATE + RESULT */}
      <div className="flex flex-wrap items-center gap-6">
        {/* YES/NO */}
        <div className="flex items-center gap-4">
          {["No", "Yes"].map((val) => (
            <label key={val} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`${idPrefix}-yesno`}
                value={val}
                checked={getAnswer(yesNoId) === val}
                onChange={() => handleInputChange(yesNoId, val)}
                className="custom-radio"
                disabled={editStatus}
                required
              />
              <span>{val}</span>
            </label>
          ))}
        </div>

        {/* Date */}
        {showDetails && (
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">DATE</Label>
            <div className="w-48">
              <DatePicker
                value={
                  getAnswer(dateId) ? new Date(getAnswer(dateId)) : undefined
                }
                onChange={(val) =>
                  handleInputChange(
                    dateId,
                    val?.toLocaleDateString("en-CA") || ""
                  )
                }
                required={showDetails}
                disabled={editStatus}
              />
            </div>
          </div>
        )}

        {/* RESULT */}
        {showDetails && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Label className="text-sm font-medium">RESULT</Label>
            {["Normal", "Abnormal", "Unknown"].map((val) => (
              <label key={val} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`${idPrefix}-result`}
                  value={val}
                  checked={getAnswer(resultId) === val}
                  onChange={() => handleInputChange(resultId, val)}
                  className="custom-radio"
                  disabled={editStatus}
                  required={showDetails}
                />
                <span>{val}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Second line: Report Available? */}
      {showDetails && (
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">REPORT AVAILABLE?</Label>
            {["Not Available", "Available"].map((val) => (
              <label key={val} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`${idPrefix}-report`}
                  value={val}
                  checked={getAnswer(reportAvailableId) === val}
                  onChange={() => handleInputChange(reportAvailableId, val)}
                  className="custom-radio"
                  disabled={editStatus}
                  required={showDetails}
                />
                <span>{val}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Upload */}
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
                className="sr-only"
                onChange={handleFileChange}
                disabled={editStatus}
              />
              Upload File
            </label>
            {(selectedFileName || uploadedFileName) && (
              <span
                className="text-sm cursor-pointer"
                onClick={() =>
                  downloadDocumentFile(
                    getFile?.base64Data,
                    getFile?.contentType,
                    "Report"
                  )
                }
              >
                {selectedFileName || "Report.pdf"}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const PriorImaging: React.FC<Props> = ({
  formData,
  handleInputChange,
  handleInputChangePatient,
  patientFormData,
  setPatientFormData,
  questionIds,
}) => {
  const [editStatuses, setEditStatuses] = useState<Record<string, boolean>>({});

  const getPatientFormAnswer = (id: number) =>
    patientFormData?.find((q) => q.questionId === id)?.answer || "";

  const handleEditClick = (imagingKey: string, questionIdsToCopy: number[]) => {
    questionIdsToCopy.forEach((qId) => {
      const patientAnswer = getPatientFormAnswer(qId);
      // Pre-fill technician form with patient's answer
      handleInputChange(qId, patientAnswer);
    });
    // Enable editing for this imaging section
    setEditStatuses((prev) => ({ ...prev, [imagingKey]: true }));
  };

  const handleVerifyChange = (
    symptomMainQuestionId: number,
    checked: boolean
  ) => {
    setPatientFormData((prev: ResponsePatientForm[]) =>
      prev.map((item) =>
        item.questionId === symptomMainQuestionId
          ? { ...item, verifyTechnician: checked }
          : item
      )
    );
  };

  const renderCheckbox = (
    name: string,
    symptomMainQuestionId: number,
    className: string = ""
  ) => (
    <div className={cn(`flex flex-col items-center w-25 gap-2`, className)}>
      <div className="text-xs sm:text-xs font-medium">{name}</div>
      <Checkbox2
        className="bg-white data-[state=checked]:text-[#f9f4ed] rounded-full"
        checked={
          patientFormData.find((q) => q.questionId === symptomMainQuestionId)
            ?.verifyTechnician || false
        }
        onClick={() =>
          handleVerifyChange(
            symptomMainQuestionId,
            !(
              patientFormData.find((q) => q.questionId === symptomMainQuestionId)
                ?.verifyTechnician || false
            )
          )
        }
        required
      />
    </div>
  );

  const renderImagingSectionWithVerification = (
    imagingKey: string,
    symptomMainQuestionId: number,
    patientQuestionIds: number[],
    patientAnswerLabels: string[],
    children: React.ReactNode
  ) => {
    const isEditing = editStatuses[imagingKey] || false;
    const patientAnswers = patientQuestionIds.map((id, index) => ({
      label: patientAnswerLabels[index],
      value: getPatientFormAnswer(id),
    }));

    return (
      <div className="flex w-full items-start border-b border-gray-200 py-4">
        <div className="w-[80%] relative">
          {children}
          {!isEditing && (
            <div className="absolute top-0 left-0 w-full h-full bg-transparent z-10 cursor-not-allowed" />
          )}
        </div>
        <div className="w-[20%] flex justify-center items-start pl-4">
          <div className="flex items-center gap-3">
            {renderCheckbox("Check to Confirm", symptomMainQuestionId)}
            {!isEditing ? (
              <div className="flex w-20 flex-col gap-2 items-center">
                <div className="text-xs sm:text-xs font-medium">Edit</div>
                <Edit
                  onClick={() => handleEditClick(imagingKey, patientQuestionIds)}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
            ) : (
              <div className="flex w-20 flex-col gap-2 items-center">
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
            )}
          </div>
        </div>
      </div>
    );
  };

  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const imagingSections = [
    {
      label: "A. Thermogram",
      idPrefix: "thermogram",
      yesNoId: questionIds.thermogramYesNo,
      dateId: questionIds.thermogramDate,
      resultId: questionIds.thermogramResult,
      reportAvailableId: questionIds.thermogramReportAvailable,
      reportDetailsId: questionIds.thermogramReportDetails,
    },
    {
      label: "B. Mammogram",
      idPrefix: "mammogram",
      yesNoId: questionIds.mammogramYesNo,
      dateId: questionIds.mammogramDate,
      resultId: questionIds.mammogramResult,
      reportAvailableId: questionIds.mammogramReportAvailable,
      reportDetailsId: questionIds.mammogramReportDetails,
    },
    {
      label: "C. Breast Ultrasound / HERscan",
      idPrefix: "ultrasound",
      yesNoId: questionIds.breastUltrasoundYesNo,
      dateId: questionIds.breastUltrasoundDate,
      resultId: questionIds.breastUltrasoundResult,
      reportAvailableId: questionIds.breastUltrasoundReportAvailable,
      reportDetailsId: questionIds.breastUltrasoundReportDetails,
    },
    {
      label: "D. Breast MRI",
      idPrefix: "mri",
      yesNoId: questionIds.breastMRIYesNo,
      dateId: questionIds.breastMRIDate,
      resultId: questionIds.breastMRIResult,
      reportAvailableId: questionIds.breastMRIReportAvailable,
      reportDetailsId: questionIds.breastMRIReportDetails,
    },
    {
      label: "E. PET/CT Scan",
      idPrefix: "petct",
      yesNoId: questionIds.petctYesNo,
      dateId: questionIds.petctDate,
      resultId: questionIds.petctResult,
      reportAvailableId: questionIds.petctReportAvailable,
      reportDetailsId: questionIds.petctReportDetails,
    },
    {
      label: "F. QT Imaging",
      idPrefix: "qt",
      yesNoId: questionIds.qtImagingYesNo,
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
      dateId: questionIds.otherImagingDate,
      resultId: questionIds.otherImagingResult,
      reportAvailableId: questionIds.otherImagingReportAvailable,
      reportDetailsId: questionIds.otherImagingReportDetails,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10 relative">
        {imagingSections.map((sectionProps) => {
          const patientQIds = [
            sectionProps.yesNoId,
            sectionProps.dateId,
            sectionProps.resultId,
            sectionProps.reportAvailableId,
          ];
          const patientLabels = [
            "Answer",
            "Date",
            "Result",
            "Report Available",
          ];
          return renderImagingSectionWithVerification(
            sectionProps.idPrefix,
            sectionProps.yesNoId,
            patientQIds,
            patientLabels,
            <ImagingSection key={sectionProps.idPrefix} {...sectionProps} formData={formData} handleInputChange={handleInputChangePatient} patientFormData={patientFormData} editStatus={!editStatuses[sectionProps.idPrefix]} />
          );
        })}
        <div className="flex flex-col sm:flex-row gap-2">
          <Label className="font-semibold text-base flex flex-wrap gap-1">H. Others / Additional Comments</Label>
          <Textarea className="w-64" value={getAnswer(questionIds.additionalComments)} onChange={(e) => handleInputChange(questionIds.additionalComments, e.target.value)} 
            placeholder="Enter Details"/>
        </div>
      </div>
    </div>
  );
};

export default PriorImaging;