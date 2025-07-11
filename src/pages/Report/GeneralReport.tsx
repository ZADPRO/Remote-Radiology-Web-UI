import React, { useEffect } from "react";
import BreastImplantDetails from "./BreastImplantDetails/BreastImplantDetails";
import TextEditor from "@/components/TextEditor";
import { generateBreastImplantDetailsHTML } from "./BreastImplantDetails/BreastImplantDetailsEditor";
// import { Button } from "@/components/ui/button";
import { ResponsePatientForm } from "../TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import { Label } from "@/components/ui/label";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";

interface ReportQuestion {
  questionId: number;
  answer: string;
}

interface TextEditorProps {
  breastImplant: {
    value: string;
    onChange: (value: string) => void;
  };
}

interface RightReportProps {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  patientFormData: ResponsePatientForm[];
  handlePatientInputChange: (questionId: number, value: string) => void;
  textEditor: TextEditorProps;
  syncStatus: {
    breastImplantRight: boolean;
  };
  setsyncStatus: any;
  readOnly: boolean;
}

const GeneralReport: React.FC<RightReportProps> = ({
  reportFormData,
  handleReportInputChange,
  patientFormData,
  handlePatientInputChange,
  textEditor,
  syncStatus,
  setsyncStatus,
  readOnly
}) => {
  const breastImpantRightQuestions = {
    breastImplants: 1,
    implantConfiguration: 2,
    implantPositon: 3,
    implantMaterial: 4,
    displacement: 5,
    contracture: 6,
    contractureSev: 7,
    contractureSide: 8,
    rupture: 9,
    ruptureLocation: 10,
    ruptureSigns: 11,
    ruptureSignsOther: 12,
    ruptureType: 13,
    implantMaterialOther: 116,
    symmetry: 117,
  };

  useEffect(() => {
    if (syncStatus.breastImplantRight) {
      textEditor.breastImplant.onChange(
        generateBreastImplantDetailsHTML(
          reportFormData,
          breastImpantRightQuestions
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

  return (
    <div className="p-5 h-[90vh] space-y-10 overflow-y-scroll">
      <div className={`${readOnly ? "pointer-events-none" : ""}`}>
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
              if (syncStatus.breastImplantRight) {
                setsyncStatus({
                  ...syncStatus,
                  breastDensityandImageRight: false,
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
              questionId={breastImpantRightQuestions.symmetry}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralReport;
