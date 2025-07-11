import React, { useEffect } from "react";
import { ReportQuestion } from "../Report";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import { Label } from "@/components/ui/label";
import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";

interface QuestionIds {
  breastImplants: number;
  implantConfiguration: number;
  implantPositon: number;
  implantMaterial: number;
  implantMaterialOther: number;
  displacement: number;
  contracture: number;
  contractureSev: number;
  contractureSide: number;
  rupture: number;
  ruptureLocation: number;
  ruptureSigns: number;
  ruptureSignsOther: number;
  ruptureType: number;
}

interface Props {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  patientFormData: ResponsePatientForm[];
  handlePatientInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const BreastImplantDetails: React.FC<Props> = ({
  questionIds,
  reportFormData,
  handleReportInputChange,
  patientFormData,
}) => {
  console.log(reportFormData);

  const getAnswer = (id: number) => reportFormData.find((q) => q.questionId === id)?.answer || "";
  const getPatientAnswer = (id: number) => patientFormData.find((q) => q.questionId === id)?.answer || "";

  useEffect(() => {
    if (!patientFormData || patientFormData.length === 0) return;

    getAnswer(questionIds.breastImplants) === "" &&
      handleReportInputChange(questionIds.breastImplants, "Present");

    getAnswer(questionIds.implantConfiguration) === "" &&
      handleReportInputChange(
        questionIds.implantConfiguration,
        "Bilateral Similar"
      );

    getAnswer(questionIds.implantPositon) === "" &&
      handleReportInputChange(questionIds.implantPositon, "Subpectoral");

    getAnswer(questionIds.implantMaterial) === "" &&
      handleReportInputChange(
        questionIds.implantMaterial,
        getPatientAnswer(80)
      );

    getAnswer(questionIds.displacement) === "" &&
      handleReportInputChange(questionIds.displacement, "None");

    getAnswer(questionIds.contracture) === "" &&
      handleReportInputChange(questionIds.contracture, "None");

    getAnswer(questionIds.rupture) === "" &&
      handleReportInputChange(questionIds.rupture, "Absent");

    getAnswer(questionIds.implantMaterialOther) === "" &&
      handleReportInputChange(
        questionIds.implantMaterialOther,
        getPatientAnswer(81)
      );
  }, [patientFormData]);

  console.log(getPatientAnswer(80));
  return (
    <div className="w-full">
     <Label
          className="font-semibold text-2xl flex flex-wrap lg:items-center"
          style={{ wordSpacing: "0.2em" }}
        >
        B. BREAST IMPLANT DETAILS
      </Label>

      <div className="py-4 lg:px-10 space-y-4">
        <MultiRadioOptionalInputInline
          label="Breast Implants"
          labelClassname="w-[12rem]"
          questionId={questionIds.breastImplants}
          formData={reportFormData}
          handleInputChange={handleReportInputChange}
          options={[
            { label: "Present", value: "Present" },
            { label: "Absent", value: "Absent" },
          ]}
        />

        {reportFormData.find((q) => q.questionId === questionIds.breastImplants)
          ?.answer === "Present" && (
          <>
            <MultiRadioOptionalInputInline
              label="Implant Configuration"
              labelClassname="w-[12rem]"
              questionId={questionIds.implantConfiguration}
              formData={reportFormData}
              handleInputChange={handleReportInputChange}
              options={[
                { label: "Unilateral Right", value: "Unilateral Right" },
                { label: "Unilateral Left", value: "Unilateral Left" },
                { label: "Bilateral Similar", value: "Bilateral Similar" },
                {
                  label: "Bilateral Dissimilar",
                  value: "Bilateral Dissimilar",
                },
              ]}
            />

            <MultiRadioOptionalInputInline
              label="Implant Position"
              labelClassname="w-[12rem]"
              questionId={questionIds.implantPositon}
              formData={reportFormData}
              handleInputChange={handleReportInputChange}
              options={[
                { label: "Prepectoral", value: "Prepectoral" },
                { label: "Subpectoral", value: "Subpectoral" },
              ]}
            />

            <MultiRadioOptionalInputInline
              label="Implant Material"
              labelClassname="w-[12rem]"
              questionId={questionIds.implantMaterial}
              optionalInputQuestionId={questionIds.ruptureSignsOther}
                  showOptionalForValue="Other"
                  optionalInputWidth="w-60"
              formData={reportFormData}
              handleInputChange={handleReportInputChange}
              options={[
                { label: "Silicone", value: "Silicone" },
                { label: "Saline", value: "Saline" },
                { label: "Other", value: "Other" },
              ]}
            />

            <MultiRadioOptionalInputInline
              label="Displacement"
              labelClassname="w-[12rem]"
              questionId={questionIds.displacement}
              formData={reportFormData}
              handleInputChange={handleReportInputChange}
              options={[
                { label: "None", value: "None" },
                { label: "Left", value: "Left" },
                { label: "Right", value: "Right" },
                { label: "Both", value: "Both" },
              ]}
            />

            <MultiRadioOptionalInputInline
              label="Contracture"
              labelClassname="w-[12rem]"
              questionId={questionIds.contracture}
              formData={reportFormData}
              handleInputChange={handleReportInputChange}
              options={[
                { label: "None", value: "None" },
                { label: "Mild", value: "Mild" },
                { label: "Moderate", value: "Moderate" },
                { label: "Severe", value: "Severe" },
              ]}
            />

            {/* {reportFormData.find(
              (q) => q.questionId === questionIds.contracture
            )?.answer === "Present" && (
              <div className="pl-2 lg:pl-[15rem] space-y-2">
                <MultiRadioOptionalInputInline
                  label="1. Contracture"
                  labelClassname="w-[10rem] font-normal"
                  questionId={questionIds.contractureSev}
                  formData={reportFormData}
                  handleInputChange={handleReportInputChange}
                  options={[
                    { label: "Mild", value: "Mild" },
                    { label: "Moderate", value: "Moderate" },
                    { label: "Severe", value: "Severe" },
                  ]}
                  className="h-auto"
                />

                <MultiRadioOptionalInputInline
                  label="2. Side"
                  labelClassname="w-[10rem] font-normal"
                  questionId={questionIds.contractureSide}
                  formData={reportFormData}
                  handleInputChange={handleReportInputChange}
                  options={[
                    { label: "Left", value: "Left" },
                    { label: "Right", value: "Right" },
                    { label: "Bilateral", value: "Bilateral" },
                  ]}
                />
              </div>
            )} */}

            <MultiRadioOptionalInputInline
              label="Rupture"
              labelClassname="w-[12rem]"
              questionId={questionIds.rupture}
              formData={reportFormData}
              handleInputChange={handleReportInputChange}
              options={[
                { label: "Present", value: "Present" },
                { label: "Absent", value: "Absent" },
              ]}
            />

            {reportFormData.find((q) => q.questionId === questionIds.rupture)
              ?.answer === "Present" && (
              <div className="pl-2 lg:pl-[15rem] space-y-2">
                <MultiRadioOptionalInputInline
                  label="1. Rupture Location"
                  labelClassname="w-[10rem] font-normal"
                  questionId={questionIds.ruptureLocation}
                  formData={reportFormData}
                  handleInputChange={handleReportInputChange}
                  options={[
                    { label: "Left", value: "Left" },
                    { label: "Right", value: "Right" },
                    { label: "Bilateral", value: "Bilateral" },
                    { label: "None", value: "None" },
                  ]}
                  className="h-auto"
                />
{/* 
                <MultiRadioOptionalInputInline
                  label="2. Rupture Signs"
                  labelClassname="w-[10rem] font-normal"
                  questionId={questionIds.ruptureSigns}
                  optionalInputQuestionId={questionIds.ruptureSignsOther}
                  showOptionalForValue="Other"
                  optionalInputWidth="w-60" // 👈 Control width of input
                  formData={reportFormData}
                  handleInputChange={handleReportInputChange}
                  options={[
                    {
                      label: "Snowstorm Appearance",
                      value: "Snowstorm Appearance",
                    },
                    { label: "Linguine Sign", value: "Linguine Sign" },
                    { label: "Other", value: "Other" },
                  ]}
                /> */}

                <MultiRadioOptionalInputInline
                  label="2. Rupture Type"
                  labelClassname="w-[10rem] font-normal"
                  questionId={questionIds.ruptureType}
                  formData={reportFormData}
                  handleInputChange={handleReportInputChange}
                  options={[
                    { label: "Intracapsular", value: "Intracapsular" },
                    { label: "Extracapsular", value: "Extracapsular" },
                  ]}
                  className="h-auto"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BreastImplantDetails;
