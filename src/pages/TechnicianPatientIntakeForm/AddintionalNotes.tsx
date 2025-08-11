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

  // const isCorrectFormConfirmed = getAnswer(questionIds.confirmation) === "true";

  // handle manual radio selection
  // const handleRadioSelect = (value: string) => {
  //   if (isCorrectFormConfirmed) return;
  //   handleInputChange(RADIO_QUESTION_ID, value);
  // };

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
        <div className="flex flex-col gap-2yy">
  <Label className="text-base font-semibold">
    Patient has filled out the correct form
  </Label>

  {/* Forms list */}
  <div className="space-y-1">
    {[
      {
        id: "1",
        label:
          "S. Breast QT Screening Form (First-time or Annual checkup – No Abnormal Findings)",
        color: "#741b47",
      },
      {
        id: "2",
        label:
          "Da. Breast QT Diagnostic Evaluation Form (Abnormal result from a previous scan / abnormal symptoms)",
        color: "#366091",
      },
      {
        id: "3",
        label:
          "Db. Breast QT Diagnostic Health Form (Biopsy proven DCIS/Cancer Diagnosis)",
        color: "#4f6228",
      },
      {
        id: "4",
        label:
          "Dc. Breast QT Diagnostic Follow-up Form (Previous QT Comparison)",
        color: "#984806",
      },
    ].map((item) => {
      const filledFormId =
        patientFormData.find(
          (pf: any) => pf.questionId === RADIO_QUESTION_ID
        )?.answer?.toString() ?? null;

      const isFilledForm = filledFormId === item.id;
      const isNoSelected =
        getAnswer(questionIds.confirmation) === "false";

      return (
        <div
          key={item.id}
          className={cn(
            "flex items-center flex-col lg:flex-row justify-between p-1 lg:mx-10 border rounded-md transition-all duration-200",
            isFilledForm
              ? "bg-green-50 border-green-400"
              : ""
          )}
        >
          <span
            className="font-semibold text-sm sm:text-base"
            style={{ color: item.color }}
          >
            {item.label}
            {isFilledForm && (
              <span className="ml-2 text-xs sm:text-sm text-green-600">
                Filled
              </span>
            )}
          </span>

          {isNoSelected && (
            <button
  type="button" // important: prevents form submit
  onClick={(e) => {
    e.preventDefault(); // stop default form behaviour
    // e.stopPropagation(); // stop parent click events
    handleShift(parseInt(item.id));
  }}
  className="px-3 text-xs sm:text-sm rounded bg-yellow-100 min-w-30 self-end cursor-pointer text-yellow-800 hover:bg-yellow-200 transition-colors"
>
  Fill Form
</button>

          )}
        </div>
      );
    })}
  </div>

  {/* Divider */}
  <div className="border-t my-2"></div>

  {/* Yes / No Confirmation */}
  <div className="flex flex-col gap-3">
    {/* <Label className="text-lg font-bold text-gray-800">
      Is this the correct form?
    </Label> */}
    <div className="flex gap-4">
      {/* YES */}
      <label
        className={cn(
          "flex items-center justify-center px-6 py-3 rounded-xl border font-bold cursor-pointer text-lg transition-all duration-200",
          getAnswer(questionIds.confirmation) === "true"
            ? "bg-green-500 text-white border-green-500 shadow-md"
            : "bg-white text-green-600 border-green-400 hover:bg-green-50"
        )}
      >
        <input
          type="radio"
          name="formCorrect"
          className="hidden"
          value="true"
          checked={getAnswer(questionIds.confirmation) === "true"}
          onChange={() =>
            handleInputChange(questionIds.confirmation, "true")
          }
        />
        Yes
      </label>

      {/* NO */}
      <label
        className={cn(
          "flex items-center justify-center px-6 py-3 rounded-xl border font-bold cursor-pointer text-lg transition-all duration-200",
          getAnswer(questionIds.confirmation) === "false"
            ? "bg-red-500 text-white border-red-500 shadow-md"
            : "bg-white text-red-600 border-red-400 hover:bg-red-50"
        )}
      >
        <input
          type="radio"
          name="formCorrect"
          className="hidden"
          value="false"
          checked={getAnswer(questionIds.confirmation) === "false"}
          onChange={() =>
            handleInputChange(questionIds.confirmation, "false")
          }
        />
        No
      </label>
    </div>
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
