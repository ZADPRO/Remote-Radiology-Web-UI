import { Checkbox2 } from '@/components/ui/CustomComponents/checkbox2';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';

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
}

const AddintionalNotes: React.FC<Props> = ({
    technicianFormData,
    handleInputChange,
    questionIds,
    patientFormData,
    // setPatientFormData,
    handleShift
}) => {
    const getAnswer = (id: number) =>
        technicianFormData.find((q) => q.questionId === id)?.answer || "";


    const RADIO_QUESTION_IDS = [167, 168, 169, 170];

// find which questionId has answer "true"
// const selectedRadioId = patientFormData.find(
//   (item: any) =>
//     RADIO_QUESTION_IDS.includes(item.questionId) && item.answer === "true"
// )?.questionId;

const isCorrectFormConfirmed = getAnswer(questionIds.confirmation) === "true";

// handle manual radio selection
const handleRadioSelect = (id: number) => {
  if (isCorrectFormConfirmed) return;
  RADIO_QUESTION_IDS.forEach((qid) =>
    handleInputChange(qid, qid === id ? "true" : "false")
  );
};

useEffect(() => {
  if(getAnswer(questionIds.confirmation)== "") {
    handleInputChange(questionIds.confirmation, "true")
  }
}, [])

// const navigate = useNavigate();


    const renderCheckbox = (label: string, id: number, className: string = "") => (
        <div className={cn(`flex items-center w-30 h-[auto] sm:h-[40px] gap-2 flex-shrink-0`, className)}>
            <Checkbox2
                className="bg-white data-[state=checked]:text-[#f9f4ed]"
                checked={getAnswer(id) === "true"}
                onClick={() =>
                    handleInputChange(id, getAnswer(id) === "true" ? "" : "true")
                }
            />
            <div className="text-sm sm:text-base font-medium">{label}</div>
        </div>
    );

    return (
        <div className="flex h-full flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
            {/* Additional Notes */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                <Label className="w-full lg:w-2/8 text-base font-semibold">
                    a. Additional Notes
                </Label>
                <div className='flex flex-col w-full lg:w-4/8 sm:flex-row gap-5'>
                    <Label className='text-base font-semibold w-full sm:w-20'>Post Scan</Label>
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
                <div className='flex flex-col w-full lg:w-4/8 sm:flex-row gap-5'>
                    {renderCheckbox("None", questionIds.artifactsstaus, "w-full sm:w-20")}
                    {
                        getAnswer(questionIds.artifactsstaus) !== "true" && (
                            <>
                                <Label className='text-base font-semibold w-full sm:w-6'>Yes</Label>
                                <Input
                                    placeholder="Specify"
                                    className="w-full sm:w-88.5"
                                    value={getAnswer(questionIds.artifactsother)}
                                    onChange={(e) =>
                                        handleInputChange(questionIds.artifactsother, e.target.value)
                                    }
                                />
                            </>
                        )
                    }
                </div>
            </div>

            {/* Reprocessing  Done */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                <Label className="w-full lg:w-2/8 text-base font-semibold">
                    c. Reprocessing Done
                </Label>
                <div className='flex flex-col w-full lg:w-4/8 sm:flex-row gap-5'>
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

            <div className="flex flex-col gap-4">
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
        onChange={() => handleInputChange(questionIds.confirmation, "false")}
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
        onChange={() => handleInputChange(questionIds.confirmation, "true")}
      />
      <span className="text-sm sm:text-base">Yes</span>
    </label>
  </div>

  {/* Radio group: 167–170 */}
  <div className="mt-4 space-y-3">
    {[
      {
        id: 167,
        label:
          "S. Breast QT Screening Form (First-time or Annual checkup – No Abnormal Findings)",
      },
      {
        id: 168,
        label:
          "Da. Breast QT Diagnostic Evaluation Form (Abnormal result from a previous scan / abnormal symptoms)",
      },
      {
        id: 169,
        label:
          "Db. Breast QT Diagnostic Health Form (Biopsy proven DCIS/Cancer Diagnosis)",
      },
      {
        id: 170,
        label:
          "Dc. Breast QT Diagnostic Follow-up Form (Previous QT Comparison)",
      },
    ].map((item) => {
      const isSelected =
        patientFormData.find(
          (q: any) => q.questionId === item.id && q.answer === "true"
        ) !== undefined;
      const isDisabled = getAnswer(questionIds.confirmation) === "true";

      return (
        <label
  key={item.id}
  className={cn(
    "flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm sm:text-base p-3 rounded-md w-full",
    isSelected && isDisabled ? "bg-[#f0fdf4] border border-green-400" : ""
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
              <span className="ml-2 px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer" 
                onClick={() => handleShift(item.id)}>
                Fill Form
              </span>
            )}
          </span>
        </label>
      );
    })}
  </div>
</div>

        </div>
    );
};

export default AddintionalNotes;