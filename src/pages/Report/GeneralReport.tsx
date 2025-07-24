import React, { useEffect } from "react";
import BreastImplantDetails from "./BreastImplantDetails/BreastImplantDetails";
import TextEditor from "@/components/TextEditor";
import { generateBreastImplantDetailsHTML } from "./BreastImplantDetails/BreastImplantDetailsEditor";
// import { Button } from "@/components/ui/button";
import { ResponsePatientForm } from "../TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import { Label } from "@/components/ui/label";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import { SFormGeneration } from "./GenerateReport/SFormReportGenerator";
import { ResponseTechnicianForm } from "@/services/technicianServices";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { breastImpantRightQuestions, symmetryQuestions } from "./ReportQuestionsAssignment";

interface ReportQuestion {
  questionId: number;
  answer: string;
}

interface TextEditorProps {
  breastImplant: {
    value: string;
    onChange: (value: string) => void;
  };
  sForm: {
    value: string;
    onChange: (value: string) => void;
  }
}

interface RightReportProps {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  patientFormData: ResponsePatientForm[];
  handlePatientInputChange: (questionId: number, value: string) => void;
  technicianFormData: ResponseTechnicianForm[];
  textEditor: TextEditorProps;
  syncStatus: {
    breastImplant: boolean;
    sForm: boolean;
  };
  setsyncStatus: any;
  readOnly: boolean;
}

const GeneralReport: React.FC<RightReportProps> = ({
  reportFormData,
  handleReportInputChange,
  patientFormData,
  handlePatientInputChange,
  technicianFormData,
  textEditor,
  syncStatus,
  setsyncStatus,
  readOnly
}) => {
  

  useEffect(() => {
    if (syncStatus.breastImplant) {
      textEditor.breastImplant.onChange(
        generateBreastImplantDetailsHTML(
          reportFormData,
          breastImpantRightQuestions
        )
      );
    }

    if(syncStatus.sForm) {
      textEditor.sForm.onChange(
        SFormGeneration(
          patientFormData
        )
      );
    }
  }, [reportFormData, syncStatus]);

  const syncHandleReportChange = (questionId: number, value: string) => {
    const isBreastDensityRight = Object.values(breastImpantRightQuestions).includes(questionId);

    if(isBreastDensityRight) {
      setsyncStatus({
      ...syncStatus,
      breastImplantRight: true,
    });
    }
    handleReportInputChange(questionId, value);
  }
  const getAnswer = (id: number) => reportFormData.find((q) => q.questionId === id)?.answer || "";

    const getTechnicianAnswer = (id: number) => technicianFormData.find((q) => q.questionId === id)?.answer || "";

    console.log(getTechnicianAnswer(22))

  useEffect(() => {
    if (!reportFormData || reportFormData.length === 0 || !technicianFormData || technicianFormData.length === 0) return;
    if(technicianFormData.length > 0) {
    getAnswer(symmetryQuestions.symmetry) == "" && handleReportInputChange(symmetryQuestions.symmetry, getTechnicianAnswer(19) == "true" ? "Asymmetry" : "Symmetrical size and shape");
    getAnswer(symmetryQuestions.symmetryLeft) == "" && handleReportInputChange(symmetryQuestions.symmetryLeft, getTechnicianAnswer(21));
    getAnswer(symmetryQuestions.symmetryRight) == "" && handleReportInputChange(symmetryQuestions.symmetryRight, getTechnicianAnswer(22));
    }
  }, [technicianFormData]);

  return (
    <div className="p-5 h-[90vh] space-y-10 overflow-y-scroll">
      <div className={`${readOnly ? "pointer-events-none" : ""}`}>
        {/* <TextEditor
            value={textEditor.sForm.value}
            onChange={textEditor.sForm.onChange}
            onManualEdit={() => {
              if (syncStatus.sForm) {
                setsyncStatus({
                  ...syncStatus,
                  sForm: false,
                });
              }
            }}
          /> */}
        <BreastImplantDetails
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          patientFormData={patientFormData}
          handlePatientInputChange={handlePatientInputChange}
          questionIds={breastImpantRightQuestions}
        />
        <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
          <div className="flex justify-between mb-2">
            <span className="text-2xl">Report Preview</span>
            {/* {syncStatus.breastImplantRight ? (
              <Button
                className="bg-[#a4b2a1] hover:bg-[#a4b2a1] h-[20px] w-[60px] text-sm"
                onClick={() => {
                  setsyncStatus({ ...syncStatus, breastImplantRight: false });
                }}
              >
                Unsync
              </Button>
            ) : (
              <Button
                className="bg-[#a4b2a1] hover:bg-[#a4b2a1] h-[20px] w-[60px] text-sm"
                onClick={() => {
                  setsyncStatus({ ...syncStatus, breastImplantRight: true });
                }}
              >
                Sync
              </Button>
            )} */}
          </div>
          <TextEditor
            value={textEditor.breastImplant.value}
            onChange={textEditor.breastImplant.onChange}
            onManualEdit={() => {
              if (syncStatus.breastImplant) {
                setsyncStatus({
                  ...syncStatus,
                  breastImplantRight: false,
                });
              }
            }}
          />
        </div>

        <div className="w-full mt-3">
          <Label
            className="font-semibold text-2xl flex flex-wrap lg:items-center"
            style={{ wordSpacing: "0.2em" }}
          >
            C. SYMMETRY
          </Label>

          <div className="py-4 lg:px-10 space-y-4">
            <MultiRadioOptionalInputInline
              label="Symmetry"
              labelClassname="w-[12rem]"
              questionId={symmetryQuestions.symmetry}
              formData={reportFormData}
              handleInputChange={handleReportInputChange}
              options={[
                {
                  label: "Symmetrical size and shape",
                  value: "Symmetrical size and shape",
                },
                { label: "Asymmetry", value: "Asymmetry" },
              ]}
            />

              {getAnswer(symmetryQuestions.symmetry) == "Asymmetry" && (
                <div className="flex flex-col lg:flex-row lg:items-center w-full gap-2 relative">
              <Label className="font-semibold text-base w-[12rem]">Side</Label>
              <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                <Checkbox2 id="symmetryLeft" checked={getAnswer(symmetryQuestions.symmetryLeft) == "true"}/>
                <Label htmlFor="symmetryLeft">Left</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox2 id="symmetryLeft" checked={getAnswer(symmetryQuestions.symmetryRight) == "true"}/>
                <Label htmlFor="symmetryLeft">Right</Label>
              </div>
              </div>
              
            </div>
              )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralReport;
