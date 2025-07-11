import React, { useEffect } from "react";
import { ReportQuestion } from "../Report";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";

interface QuestionIds {
  skinChanges: number;
  skinChangesOther: number;
  nippleDeformity: number;
  nippleRetraction: number;
  subAreolarMass: number;
  architecture: number;
  architectureOther: number;
  nippleSelect: number;
}

interface Props {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  patientFormData: ResponsePatientForm[];
  questionIds: QuestionIds;
  label: string;
  side: string;
}

const NippleAreolaSkin: React.FC<Props> = ({
  questionIds,
  reportFormData,
  handleReportInputChange,
  label,
  patientFormData,
  side,
}) => {
  useEffect(() => {
    if (!reportFormData || reportFormData.length === 0) return;

    getAnswer(questionIds.nippleSelect) === "" &&
      handleReportInputChange(questionIds.nippleSelect, "Present");
    getAnswer(questionIds.skinChanges) === "" &&
      handleReportInputChange(questionIds.skinChanges, "Normal");
    getAnswer(questionIds.nippleDeformity) === "" &&
      handleReportInputChange(questionIds.nippleDeformity, "Absent");
    getAnswer(questionIds.architecture) === "" &&
      handleReportInputChange(questionIds.architecture, "Normal");
    getAnswer(questionIds.nippleRetraction) === "" && handleReportInputChange(questionIds.nippleRetraction, getPatientAnswer(side === "Right" ? 112 : 113));
  }, []);

  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";
  const getPatientAnswer = (id: number) => patientFormData.find((q) => q.questionId === id)?.answer || "";
  return (
    <div className="w-full">
      <div className="flex gap-4 items-center mb-4">
        <div>
          <Checkbox2
            checked={getAnswer(questionIds.nippleSelect) === "Present"}
            onCheckedChange={(checked) =>
              handleReportInputChange(
                questionIds.nippleSelect,
                checked ? "Present" : ""
              )
            }
            className="w-5 h-5 mt-1"
          />
        </div>
        <Label
          className="font-semibold text-2xl flex flex-wrap lg:items-center"
          style={{ wordSpacing: "0.2em" }}
        >
          {label}
        </Label>
      </div>
      {getAnswer(questionIds.nippleSelect) === "Present" && (
        <div className="py-4 lg:px-10 space-y-4">
          <MultiRadioOptionalInputInline
            label="Skin Changes"
            labelClassname="w-[12rem]"
            questionId={questionIds.skinChanges}
            optionalInputQuestionId={questionIds.skinChangesOther}
            showOptionalForValue="Other"
            optionalInputWidth="w-60" // 👈 Control width of input
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              {
                label: "Normal",
                value: "Normal",
              },
              { label: "Thickening", value: "Thickening" },
              { label: "Retraction", value: "Retraction" },
              { label: "Peau d'orange", value: "Peau d'orange" },
              { label: "Other", value: "Other" },
            ]}
            className="lg:h-auto items-center"
          />

          <MultiRadioOptionalInputInline
            label="Nipple Deformity"
            labelClassname="w-[12rem]"
            questionId={questionIds.nippleDeformity}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Absent", value: "Absent" },

              { label: "Present", value: "Present" },
            ]}
          />

          <MultiRadioOptionalInputInline
            label="Nipple Retraction"
            labelClassname="w-[12rem]"
            questionId={questionIds.nippleRetraction}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Present", value: "Present" },
              { label: "Absent", value: "Absent" },
            ]}
          />

          {/* <MultiRadioOptionalInputInline
            label="Sub Areolar Mass"
            labelClassname="w-[12rem]"
            questionId={questionIds.subAreolarMass}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Absent", value: "Absent" },
              { label: "Present", value: "Present" },
            ]}
          /> */}

          <MultiRadioOptionalInputInline
            label="Architecture of Vascular and connective tissues"
            labelClassname="w-full lg:w-[12rem]"
            questionId={questionIds.architecture}
            optionalInputQuestionId={questionIds.architectureOther}
            showOptionalForValue="Other"
            optionalInputWidth="w-60" // 👈 Control width of input
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              {
                label: "Normal",
                value: "Normal",
              },
              { label: "Abnormal", value: "Abnormal" },
              { label: "Other", value: "Other" },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default NippleAreolaSkin;
