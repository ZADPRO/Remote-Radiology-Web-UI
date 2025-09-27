import React from "react";
import { ReportQuestion } from "../Report";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import { Label } from "@/components/ui/label";
import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import { Input } from "@/components/ui/input";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";

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
  bilateraldissimilar: number;
  superior: number;
  inferior: number;
  lateral: number;
  medial: number;
  superiorRight: number;
  inferiorRight: number;
  lateralRight: number;
  medialRight: number;
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
}) => {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

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
            {(getAnswer(questionIds.implantConfiguration) ===
              "Bilateral Dissimilar" ||
              getAnswer(questionIds.implantConfiguration) ===
                "Bilateral Similar") && (
              <Input
                className="w-[300px] ml-[12.5rem]"
                placeholder="Specify"
                value={
                  reportFormData.find(
                    (q) => q.questionId === questionIds.bilateraldissimilar
                  )?.answer
                }
                onChange={(e) => {
                  handleReportInputChange(
                    questionIds.bilateraldissimilar,
                    e.target.value
                  );
                }}
              />
            )}

            <MultiRadioOptionalInputInline
              label="Implant Position"
              labelClassname="w-[12rem]"
              questionId={questionIds.implantPositon}
              formData={reportFormData}
              handleInputChange={handleReportInputChange}
              options={[
                {
                  label: "Pre-pectoral (sub-glandular)",
                  value: "Pre-pectoral (sub-glandular)",
                },
                {
                  label: "Subpectoral (Retro-pectoral)",
                  value: "Subpectoral (Retro-pectoral)",
                },
              ]}
            />

            {getAnswer(questionIds.implantConfiguration) !==
              "Bilateral Dissimilar" &&
              getAnswer(questionIds.implantConfiguration) !==
                "Bilateral Similar" && (
                <MultiRadioOptionalInputInline
                  label="Implant Material"
                  labelClassname="w-[12rem]"
                  questionId={questionIds.implantMaterial}
                  optionalInputQuestionId={questionIds.implantMaterialOther}
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
              )}

            <MultiRadioOptionalInputInline
              label="Displacement Position"
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

            {getAnswer(questionIds.displacement) !== "None" &&
              getAnswer(questionIds.displacement).length > 0 && (
                <>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 relative">
                    <Label className="font-semibold w-[12rem] text-base flex flex-wrap lg:items-center">
                      <span>Displacement</span>
                    </Label>
                    <div>
                      {getAnswer(questionIds.displacement) === "Both" && (
                        <Label className="font-semibold text-sm flex flex-wrap lg:items-center">
                          <span>Left</span>
                        </Label>
                      )}
                      {(getAnswer(questionIds.displacement) === "Left" ||
                        getAnswer(questionIds.displacement) === "Both") && (
                        <>
                          <div className="flex flex-wrap gap-4 h-auto lg:min-h-[40px] items-center">
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="superior"
                                checked={
                                  getAnswer(questionIds.superior) === "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.superior,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="superior"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Superior
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="inferior"
                                checked={
                                  getAnswer(questionIds.inferior) === "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.inferior,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="inferior"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Inferior
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="Lateral"
                                checked={
                                  getAnswer(questionIds.lateral) === "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.lateral,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="Lateral"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Lateral
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="Medial"
                                checked={
                                  getAnswer(questionIds.medial) === "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.medial,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="Medial"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Medial
                              </Label>
                            </div>
                          </div>
                        </>
                      )}
                      {getAnswer(questionIds.displacement) === "Right" && (
                        <>
                          <div className="flex flex-wrap gap-4 h-auto lg:min-h-[40px] items-center">
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="superior"
                                checked={
                                  getAnswer(questionIds.superiorRight) ===
                                  "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.superiorRight,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="superior"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Superior
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="inferior"
                                checked={
                                  getAnswer(questionIds.inferiorRight) ===
                                  "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.inferiorRight,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="inferior"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Inferior
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="Lateral"
                                checked={
                                  getAnswer(questionIds.lateralRight) === "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.lateralRight,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="Lateral"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Lateral
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="Medial"
                                checked={
                                  getAnswer(questionIds.medialRight) === "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.medialRight,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="Medial"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Medial
                              </Label>
                            </div>
                          </div>
                        </>
                      )}
                      {getAnswer(questionIds.displacement) === "Both" && (
                        <>
                          <Label className="font-semibold text-sm flex flex-wrap lg:items-center">
                            <span>Right</span>
                          </Label>
                          <div className="flex flex-wrap gap-4 h-auto lg:min-h-[40px] items-center">
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="superior"
                                checked={
                                  getAnswer(questionIds.superiorRight) ===
                                  "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.superiorRight,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="superior"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Superior
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="inferior"
                                checked={
                                  getAnswer(questionIds.inferiorRight) ===
                                  "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.inferiorRight,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="inferior"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Inferior
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="Lateral"
                                checked={
                                  getAnswer(questionIds.lateralRight) === "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.lateralRight,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="Lateral"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Lateral
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox2
                                className="bg-white h-4.5 w-4.5"
                                id="Medial"
                                checked={
                                  getAnswer(questionIds.medialRight) === "true"
                                }
                                onCheckedChange={(val) =>
                                  handleReportInputChange(
                                    questionIds.medialRight,
                                    val ? "true" : "false"
                                  )
                                }
                                required
                              />
                              <Label
                                htmlFor="Medial"
                                className="text-sm cursor-pointer text-[#3f3f3d]"
                              >
                                Medial
                              </Label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

            <MultiRadioOptionalInputInline
              label="Contracture"
              labelClassname="w-[12rem]"
              questionId={questionIds.contracture}
              formData={reportFormData}
              handleInputChange={handleReportInputChange}
              options={[
                { label: "Left", value: "Left" },
                { label: "Right", value: "Right" },
                { label: "Both", value: "Both" },
                { label: "None", value: "None" },
              ]}
            />

            {reportFormData.find(
              (q) => q.questionId === questionIds.contracture
            )?.answer !== "None" && (
              <div className="pl-2 lg:pl-[13rem] space-y-2">
                <MultiRadioOptionalInputInline
                  label="Severity"
                  labelClassname="w-[5rem]"
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

                {/* <MultiRadioOptionalInputInline
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
                /> */}
              </div>
            )}

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
