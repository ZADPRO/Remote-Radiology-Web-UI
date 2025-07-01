import React, { useState } from "react";
import BreastInput from "../PatientInTakeForm/BreastInput";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import BreastInputWithout from "../PatientInTakeForm/BreastInputWithout";
import BreastInputLocation from "../PatientInTakeForm/BreastInputLocation";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { Edit, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { ResponsePatientForm } from "./TechnicianPatientIntakeForm";
import { Textarea } from "@/components/ui/textarea";

interface IntakeOption {
  questionId: number;
  answer: string;
  
}

interface QuestionIds {
  clinicalExam: number;
  deformity: number;
  deformityBig: number;
  deformityRight: number;
  deformityLeft: number;
  deformityDuration: number;
  scar: number;
  scarRight: number;
  scarLeft: number;
  scarDuration: number;
  sore: number;
  soreRight: number;
  soreLeft: number;
  soreDuration: number;
  additionalComments: number;
}

interface Props {
  technicianFormData: IntakeOption[];
  patientFormData: ResponsePatientForm[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  setTechnicianFormData: any;
  setPatientFormData: any;
}

const BreastSymptoms: React.FC<Props> = ({
  technicianFormData,
  patientFormData,
  handleInputChange,
  questionIds,
  setTechnicianFormData,
  setPatientFormData,
}) => {
  const [editStatuses, setEditStatuses] = useState<Record<string, boolean>>({});

  const handlePatientDataChange = (questionId: number, value: string) => {
    setPatientFormData((prev: ResponsePatientForm[]) =>
      prev.map((item) =>
        item.questionId === questionId ? { ...item, answer: value } : item
      )
    );
  };

  const handleEditClick = (symptomKey: string, questionIdsToCopy: number[]) => {
    // Atomically update the technician form data to prevent race conditions
    // and handle cases where the questionId might not exist yet.
    setTechnicianFormData((prevData: IntakeOption[]) => {
      const newData = [...prevData];
      questionIdsToCopy.forEach((qId) => {
        const patientAnswer = getPatientFormAnswer(qId);
        const index = newData.findIndex((item) => item.questionId === qId);
        if (index !== -1) {
          newData[index] = { ...newData[index], answer: patientAnswer };
        } else {
          newData.push({ questionId: qId, answer: patientAnswer });
        }
      });
      return newData;
    });
    setEditStatuses((prev) => ({ ...prev, [symptomKey]: true }));
  };

  const handleVerifyChange = (symptomMainQuestionId: number, checked: boolean) => {
    setPatientFormData((prev: ResponsePatientForm[]) =>
      prev.map((item) =>
        item.questionId === symptomMainQuestionId
          ? { ...item, verifyTechnician: checked }
          : item
      )
    );
  };
  const getAnswer = (id: number) =>
    technicianFormData.find((q) => q.questionId === id)?.answer || "";

  const getPatientFormAnswer = (id: number) =>
    patientFormData?.find((q) => q.questionId === id)?.answer || "";

  console.log(patientFormData);
  const renderCheckbox = (
    name: string,
    symptomMainQuestionId: number, // This will be the main QID of the symptom, e.g., 88 for lump
    className: string = ""
  ) => (
    <div className={cn(`flex flex-col items-center w-25 gap-2`, className)}>
      <div className="text-xs sm:text-xs font-medium">{name}</div>
      <Checkbox2
        className="bg-white data-[state=checked]:text-[#f9f4ed] rounded-full"
        checked={patientFormData.find(q => q.questionId === symptomMainQuestionId)?.verifyTechnician || false}
        onClick={() =>
          handleVerifyChange(symptomMainQuestionId, !(patientFormData.find(q => q.questionId === symptomMainQuestionId)?.verifyTechnician || false))
        }
      />
    </div>
  );

  console.log(patientFormData.find(q => q.questionId === 88))

  const renderSymptomWithVerification = (
    symptomKey: string,
    symptomMainQuestionId: number, // This is the main QID for the symptom, e.g., 88 for lump
    patientQuestionIds: number[],
    patientAnswerLabels: string[],
    children: React.ReactNode
  ) => {
    const isEditing = editStatuses[symptomKey] || false;
    const patientAnswers = patientQuestionIds.map((id, index) => ({
      label: patientAnswerLabels[index],
      value: getPatientFormAnswer(id),
    }));

    return (
      <div className="flex flex-col lg:flex-row w-full items-start py-4">
        <div className="w-full lg:w-[80%] relative">
          {children}
          {!isEditing && (
            <div className="absolute top-0 left-0 w-full h-full bg-transparent z-10 cursor-not-allowed" />
          )}
        </div>
        <div className="lg:w-[20%] w-full flex justify-end lg:justify-center items-end lg:items-start pt-2 pl-4">
          <div className="flex gap-3">
            {renderCheckbox("Check to Confirm", symptomMainQuestionId)}
            {!isEditing ? (
              <div className="flex w-20 flex-col gap-2 items-center">
                <div className="text-xs sm:text-xs font-medium">Edit</div>
                <Edit
                  onClick={() => handleEditClick(symptomKey, patientQuestionIds)}
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

  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-2 overflow-y-auto relative">
      {/* Priority */}
      {renderSymptomWithVerification(
        "clinicalExam",
        87,
        [87],
        ["Has Symptoms"],
        <MultiOptionRadioGroup
          label="a. Clinical Exam notes"
          questionId={87}
          formData={
            editStatuses["clinicalExam"]
              ? technicianFormData
              : patientFormData
          }
          handleInputChange={
            editStatuses["clinicalExam"]
              ? handleInputChange
              : handlePatientDataChange
          }
          options={[
            { label: "Asymptomatic", value: "No" },
            { label: "Symptoms", value: "Yes" },
          ]}
          required={true}
        />
      )}

      <div className="space-y-6">
        {getPatientFormAnswer(87) === "Yes" && (
          <>
            {/* Deformity - Technician Only */}
            <BreastInputWithout
              technician={true}
              label="Deformity / Asymmetry"
              checkStatusQId={questionIds.deformity}
              biggerSide={questionIds.deformityBig}
              RQID={questionIds.deformityRight}
              LQID={questionIds.deformityLeft}
              SDate={questionIds.deformityDuration}
              data={technicianFormData}
              setData={setTechnicianFormData}
            />

            {/* Fields with patient data verification */}
            {renderSymptomWithVerification("lump", 88, [88, 89, 90, 91, 92, 93], ["Checked", "R", "L", "Duration", "Size", "Details"],
              <BreastInput
                technician={true}
                label="Lump or thickening"
                checkStatusQId={88} RQID={89} LQID={90} SDate={91} Size={92} OtherInputQId={93}
                data={patientFormData} setData={setPatientFormData}
                patientData={patientFormData} setPatientData={setPatientFormData}
                editStatus={!editStatuses["lump"]}
              />
            )}
            {renderSymptomWithVerification("skin", 94, [94, 95, 96, 97, 98], ["Checked", "R", "L", "Duration", "Details"],
              <BreastInput
                technician={true}
                label="Skin changes"
                checkStatusQId={94} RQID={95} LQID={96} SDate={97} OtherInputQId={98}
                data={patientFormData} setData={setPatientFormData}
                patientData={patientFormData} setPatientData={setPatientFormData}
                editStatus={!editStatuses["skin"]}
              />
            )}
            {renderSymptomWithVerification("nippleDischarge", 99, [99, 100, 101, 102, 103], ["Checked", "R", "L", "Duration", "Details"],
              <BreastInputWithout
                technician={true}
                label="Nipple discharge"
                checkStatusQId={99} RQID={100} LQID={101} SDate={102} OtherInputQId={103}
                data={patientFormData} setData={setPatientFormData}
                patientData={patientFormData} setPatientData={setPatientFormData}
                editStatus={!editStatuses["nippleDischarge"]}
              />
            )}
            {renderSymptomWithVerification("pain", 106, [106, 107, 108, 109, 110], ["Checked", "R", "L", "Duration", "Details"],
              <BreastInput
                technician={true}
                label="Pain On Palpation" //Breast Pain
                checkStatusQId={106} RQID={107} LQID={108} SDate={109} OtherInputQId={110}
                data={patientFormData} setData={setPatientFormData}
                patientData={patientFormData} setPatientData={setPatientFormData}
                editStatus={!editStatuses["pain"]}
              />
            )}
            {renderSymptomWithVerification("nippleRetraction", 111, [111, 112, 113, 114, 115, 104, 105], ["Checked", "R", "L", "Duration", "Details", "Position", "Position Details"],
              <BreastInputWithout
                technician={true}
                label="Nipple Retraction" //Nipple Changes
                checkStatusQId={111} RQID={112} LQID={113} SDate={114} OtherInputQId={115}
                nipplePosition={104} nipplePositionDetails={105}
                data={patientFormData} setData={setPatientFormData}
                patientData={patientFormData} setPatientData={setPatientFormData}
                editStatus={!editStatuses["nippleRetraction"]}
              />
            )}

            {/* Scar and Sore - Technician Only */}
            <BreastInput
              technician={true}
              label="Scar"
              checkStatusQId={questionIds.scar}
              RQID={questionIds.scarRight}
              LQID={questionIds.scarLeft}
              SDate={questionIds.scarDuration}
              data={technicianFormData}
              setData={setTechnicianFormData}
            />
            <BreastInput
              technician={true}
              label="Sore"
              checkStatusQId={questionIds.sore}
              RQID={questionIds.soreRight}
              LQID={questionIds.soreLeft}
              SDate={questionIds.soreDuration}
              data={technicianFormData}
              setData={setTechnicianFormData}
            />

            {/* Lymph Node Swelling - with verification */}
            {renderSymptomWithVerification("lymph", 116, [116, 117, 118, 119, 120, 121], ["Checked", "R", "L", "Duration", "Location", "Details"],
              <BreastInputLocation
                label="Lymph node swelling"
                technician={true}
                checkStatusQId={116} RQID={117} LQID={118} SDate={119} Location={120} OtherInputQId={121}
                data={patientFormData} setData={setPatientFormData}
                patientData={patientFormData} setPatientData={setPatientFormData}
                editStatus={!editStatuses["lymph"]}
              />
            )}
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
          <Label className="font-semibold text-base flex flex-wrap gap-1">
            b. Others / Additional Comments
          </Label>
          <Textarea
            className=""
            value={getAnswer(questionIds.additionalComments)}
            onChange={(e) =>
              handleInputChange(questionIds.additionalComments, e.target.value)
            }
            placeholder="Enter Details"
          />
        </div>
    </div>
  );
};

export default BreastSymptoms;
