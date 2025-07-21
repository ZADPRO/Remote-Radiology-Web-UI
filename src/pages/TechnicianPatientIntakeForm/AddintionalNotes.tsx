import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

interface IntakeOption {
  questionId: number;
  answer: string;
}

interface QuestionIds {
  postscan: number;
  artifactsstaus: number;
  artifactsother: number;
  reprocessing: number;
  confirmation: number;
}

interface Props {
  technicianFormData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  patientFormData: any;
  setPatientFormData: React.Dispatch<React.SetStateAction<any>>;
  handleShift: (categoryId: number) => void;
  readOnly?: boolean;
}

const AddintionalNotes: React.FC<Props> = ({
  technicianFormData,
  handleInputChange,
  questionIds,
  patientFormData,
  // setPatientFormData,
  handleShift,
  readOnly,
}) => {
  const getAnswer = (id: number) =>
    technicianFormData.find((q) => q.questionId === id)?.answer || "";

  const RADIO_QUESTION_ID = 170;

  // find which questionId has answer "true"
  // const selectedRadioId = patientFormData.find(
  //   (item: any) =>
  //     RADIO_QUESTION_IDS.includes(item.questionId) && item.answer === "true"
  // )?.questionId;

  const isCorrectFormConfirmed = getAnswer(questionIds.confirmation) === "true";

  // handle manual radio selection
  const handleRadioSelect = (value: string) => {
    if (isCorrectFormConfirmed) return;
    handleInputChange(RADIO_QUESTION_ID, value);
  };

  const renderPatientRadioGroup = (
    name: string,
    questionId: number,
    options: string[]
  ) => (
    <div className="flex flex-wrap gap-4">
      {options.map((value) => (
        <div key={value} className="flex items-center space-x-2">
          <input
            type="radio"
            id={`${name}-${value.toLowerCase()}`}
            name={name}
            value={value}
            checked={getAnswer(questionId) === value}
            onChange={(e) => handleInputChange(questionId, e.target.value)}
            className="custom-radio"
          />
          <Label htmlFor={`${name}-${value.toLowerCase()}`}>{value}</Label>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (getAnswer(questionIds.confirmation) == "") {
      handleInputChange(questionIds.confirmation, "true");
    }
  }, []);

  // const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-6 overflow-y-auto relative">
      <div className={`space-y-4 ${readOnly ? "pointer-events-none" : ""}`}>
        <div className="flex flex-col gap-2">
          <Label className="text-base font-semibold">
            Patient has filled out the correct form
          </Label>

          {/* Yes / No radio for confirmation */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="formCorrect"
                className="custom-radio"
                value="false"
                checked={getAnswer(questionIds.confirmation) !== "true"}
                onChange={() =>
                  handleInputChange(questionIds.confirmation, "false")
                }
              />
              <span className="text-sm sm:text-base">No</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="formCorrect"
                className="custom-radio"
                value="true"
                checked={getAnswer(questionIds.confirmation) === "true"}
                onChange={() =>
                  handleInputChange(questionIds.confirmation, "true")
                }
              />
              <span className="text-sm sm:text-base">Yes</span>
            </label>
          </div>

          {/* Radio group: 167–170 */}
          <div className="mt-2 space-y-1">
            {
              // Radio options: 1-4 (stored as string in answer to questionId 170)
              [
                {
                  id: "1",
                  label:
                    "S. Breast QT Screening Form (First-time or Annual checkup – No Abnormal Findings)",
                },
                {
                  id: "2",
                  label:
                    "Da. Breast QT Diagnostic Evaluation Form (Abnormal result from a previous scan / abnormal symptoms)",
                },
                {
                  id: "3",
                  label:
                    "Db. Breast QT Diagnostic Health Form (Biopsy proven DCIS/Cancer Diagnosis)",
                },
                {
                  id: "4",
                  label:
                    "Dc. Breast QT Diagnostic Follow-up Form (Previous QT Comparison)",
                },
              ].map((item) => {
                const isSelected =
                  (
                    patientFormData.find(
                      (item: any) => item.questionId === RADIO_QUESTION_ID
                    ) || {}
                  ).answer.toString() === item.id;
                const isDisabled = isCorrectFormConfirmed;

                return (
                  <label
                    key={item.id}
                    className={cn(
                      "flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm sm:text-base p-1 rounded-md w-full",
                      isSelected && isDisabled
                        ? "bg-[#f0fdf4] border border-green-400"
                        : ""
                    )}
                  >
                    <input
                      type="radio"
                      name="formTypeSelection"
                      className="custom-radio"
                      value={item.id}
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => handleRadioSelect(item.id)}
                    />
                    <span>
                      {item.label}{" "}
                      {!isDisabled && (
                        <span
                          className="ml-2 px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer"
                          onClick={() => handleShift(parseInt(item.id))}
                        >
                          Fill Form
                        </span>
                      )}
                    </span>
                  </label>
                );
              })
            }
          </div>
        </div>

        {/* Additional Notes */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <Label className="w-full lg:w-2/8 text-base font-semibold">
            a. Additional Notes
          </Label>
          <div className="flex flex-col w-full lg:w-4/8 sm:flex-row gap-5">
            <Label className="text-base font-semibold w-full sm:w-20">
              Post Scan
            </Label>
            <Input
              placeholder="Specify"
              className="w-[100%] sm:w-100"
              value={getAnswer(questionIds.postscan)}
              onChange={(e) =>
                handleInputChange(questionIds.postscan, e.target.value)
              }
            />
          </div>
        </div>

        {/* Artifacts present */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <Label className="w-full lg:w-2/8 text-base font-semibold">
            b. Artifacts present
          </Label>
          <div className="flex flex-col h:auto lg:h-[40px] w-full lg:w-4/8 sm:flex-row gap-5">
            {renderPatientRadioGroup(
              "Artifacts present",
              questionIds.artifactsstaus,
              ["No", "Yes"]
            )}
            {getAnswer(questionIds.artifactsstaus) === "Yes" && (
              <>
                <Input
                  placeholder="Specify"
                  className="w-full sm:w-88.5"
                  value={getAnswer(questionIds.artifactsother)}
                  onChange={(e) =>
                    handleInputChange(
                      questionIds.artifactsother,
                      e.target.value
                    )
                  }
                />
              </>
            )}
          </div>
        </div>

        {/* Reprocessing  Done */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <Label className="w-full lg:w-2/8 text-base font-semibold">
            c. Reprocessing Done
          </Label>
          <div className="flex flex-col w-full lg:w-4/8 sm:flex-row gap-5">
            {/* <Label className='text-base font-semibold w-full sm:w-20'>Post Scan</Label> */}
            <Input
              placeholder="Specify"
              className="w-full sm:w-125"
              value={getAnswer(questionIds.reprocessing)}
              onChange={(e) =>
                handleInputChange(questionIds.reprocessing, e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddintionalNotes;
