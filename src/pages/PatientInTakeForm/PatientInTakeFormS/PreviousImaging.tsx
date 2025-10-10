import React from "react";
import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { uploadService } from "@/services/commonServices";
import { Textarea } from "@/components/ui/textarea";
import { IntakeOption } from "../PatientInTakeForm";
import FileView from "@/components/FileView/FileView";
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QuestionIds {
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
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
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
  handleInputChange: (questionId: number, value: string) => void;
  readOnly: boolean;
}

const ImagingSection: React.FC<ImagingSectionProps> = ({
  label,
  idPrefix,
  yesNoId,
  dateKnownId,
  dateId,
  resultId,
  reportAvailableId,
  reportDetailsId,
  formData,
  handleInputChange,
  readOnly,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const showDetails = getAnswer(yesNoId) === "Yes";
  const showUpload =
    showDetails && getAnswer(reportAvailableId) === "Available";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const values = JSON.parse(getAnswer(reportDetailsId) || "[]");

    for (const file of files) {
      if (file) {
        const formDataObj = new FormData();
        formDataObj.append("file", file);
        try {
          const response = await uploadService.uploadFile({
            formFile: formDataObj,
          });
          if (response.status) {
            values.push(response.fileName);
          }
        } catch (error) {
          console.error("File upload failed:", error);
        }
      }
    }
    handleInputChange(reportDetailsId, JSON.stringify(values));
  };

  const handleDeleteFile = (fileToDelete: string) => {
    // parse existing array of file names
    const values: string[] = JSON.parse(getAnswer(reportDetailsId) || "[]");

    // filter out the file to delete
    const updatedValues = values.filter((file) => file !== fileToDelete);

    // save updated list back to formData
    handleInputChange(reportDetailsId, JSON.stringify(updatedValues));
  };

  return (
    <div className="space-y-4">
      <p className="font-semibold text-base">
        {label} <span className="text-red-500">*</span>
      </p>

      {/* First line: YES/NO + DATE + RESULT */}
      <div className="flex flex-col items-start gap-6">
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
                onDoubleClick={() => handleInputChange(yesNoId, "")}
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
            {["Normal", "Abnormal", "Unknown"].map((val) => (
              <label key={val} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`${idPrefix}-result`}
                  value={val}
                  checked={getAnswer(resultId) === val}
                  onChange={() => handleInputChange(resultId, val)}
                  onDoubleClick={() => handleInputChange(resultId, "")}
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
          {["Unknown", "Known"].map((val) => (
            <label key={val} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`${idPrefix}-report-date`}
                value={val}
                checked={getAnswer(dateKnownId) === val}
                onChange={() => handleInputChange(dateKnownId, val)}
                onDoubleClick={() => handleInputChange(dateKnownId, "")}
                className="custom-radio"
                required={showDetails}
              />
              <span>{val}</span>
            </label>
          ))}
          {getAnswer(dateKnownId) === "Known" && (
            <div className="flex items-center gap-2">
              {/* <Label className="text-sm font-medium">DATE</Label> */}
              <div className="w-48">
                <Input
                  type="text"
                  value={getAnswer(dateId)}
                  onChange={(val) =>
                    handleInputChange(dateId, val.target.value)
                  }
                  required={getAnswer(reportAvailableId) == "Available"}
                  placeholder="Date / Duration"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Second line: Report Available? */}
      {showDetails && (
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <Label className="text-sm font-medium lg:w-40">
              REPORT AVAILABLE?
            </Label>
            {["Not Available", "Available"].map((val) => (
              <label key={val} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`${idPrefix}-report`}
                  value={val}
                  checked={getAnswer(reportAvailableId) === val}
                  onChange={() => handleInputChange(reportAvailableId, val)}
                  onDoubleClick={() => handleInputChange(reportAvailableId, "")}
                  className="custom-radio"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-1">
            <Label className="text-sm font-medium">UPLOAD REPORT</Label>

            <label className="cursor-pointer border px-3 py-1 rounded bg-white hover:bg-gray-100 w-fit">
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                className="sr-only"
                multiple
                onChange={handleFileChange}
                required={(() => {
                  let parsed: any[] = [];
                  try {
                    parsed = JSON.parse(getAnswer(reportDetailsId) || "[]");
                  } catch {
                    parsed = [];
                  }
                  return parsed.length === 0;
                })()}
              />
              Upload File
            </label>
          </div>
          {getAnswer(reportDetailsId) &&
            (() => {
              try {
                const fileNames: string[] = JSON.parse(
                  getAnswer(reportDetailsId)
                );

                return fileNames.length > 0 ? (
                  <div className="w-full space-y-2">
                    {fileNames.map((fileName, index) => (
                      <div
                        key={index}
                        className="bg-[#f9f4ed] rounded-lg px-2 py-2 w-full flex justify-between items-center gap-3 text-sm font-medium pointer-events-auto"
                      >
                        {/* File name (downloadable) */}
                        <FileView fileName={fileName} />

                        {/* Delete icon */}
                        <div
                          className="cursor-pointer"
                          onClick={() => handleDeleteFile(fileName)}
                        >
                          {readOnly ? null : (
                            <Trash size={15} className="text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
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
};

const PreviousImaging: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const imagingSections = [
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
  ];

  return (
    <div className="flex flex-col h-full relative">
      <FormHeader
        FormTitle="Previous Imaging in past 3 years"
        className="uppercase"
      />
      <div className={readOnly ? "pointer-events-none" : ""}>
        <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10 relative">
          {imagingSections.map((sectionProps) => (
            <ImagingSection
              key={sectionProps.idPrefix}
              {...sectionProps}
              formData={formData}
              handleInputChange={handleInputChange}
              readOnly={readOnly}
            />
          ))}
          <div className="flex flex-col sm:flex-row gap-2">
            <Label className="font-semibold text-base flex flex-wrap gap-1">
              H. Others / Additional Comments
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

export default PreviousImaging;
