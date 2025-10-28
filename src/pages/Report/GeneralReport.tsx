import React from "react";
import BreastImplantDetails from "./BreastImplantDetails/BreastImplantDetails";
import TextEditor from "@/components/TextEditor";
// import { generateBreastImplantDetailsHTML } from "./BreastImplantDetails/BreastImplantDetailsEditor";
// import { Button } from "@/components/ui/button";
import { ResponsePatientForm } from "../TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import { Label } from "@/components/ui/label";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import { ResponseTechnicianForm } from "@/services/technicianServices";
import {
  breastImpantQuestions,
  symmetryQuestions,
} from "./ReportQuestionsAssignment";
import PatientHistory from "./PatientHistory";
import { ChangedOneState } from "./Report";

interface ReportQuestion {
  questionId: number;
  answer: string;
}

interface TextEditorProps {
  breastImplant: {
    value: string;
    onChange: (value: string) => void;
  };
  breastImplantImage: {
    value: string;
    onChange: (value: string) => void;
  };
  patientHistory: {
    value: string;
    onChange: (value: string) => void;
  };
  symmetry: {
    value: string;
    onChange: (value: string) => void;
  };
  symmetryImage: {
    value: string;
    onChange: (value: string) => void;
  };
}

interface RightReportProps {
  requestVersionRef: React.MutableRefObject<number>;
  setChangedOne: React.Dispatch<React.SetStateAction<ChangedOneState>>;
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  patientFormData: ResponsePatientForm[];
  handlePatientInputChange: (questionId: number, value: string) => void;
  technicianFormData: ResponseTechnicianForm[];
  textEditor: TextEditorProps;
  setsyncStatus: any;
  readOnly: boolean;
}

const GeneralReport: React.FC<RightReportProps> = ({
  requestVersionRef,
  setChangedOne,
  reportFormData,
  handleReportInputChange,
  patientFormData,
  handlePatientInputChange,
  // technicianFormData,
  textEditor,
  setsyncStatus,
  readOnly,
}) => {
  const syncHandleReportChange = (questionId: number, value: string) => {
    console.log(
      "GeneralReport.tsx -------------------------- > 79 calling...."
    );

    const isBreastImplant = Object.values(breastImpantQuestions).includes(
      questionId
    );
    const isSymmetry = Object.values(symmetryQuestions).includes(questionId);

    setsyncStatus((prev: any) => ({
      ...prev,
      breastImplant: isBreastImplant ? true : prev.breastImplant,
      symmetry: isSymmetry ? true : prev.symmetry,
    }));

    setChangedOne((prev) => ({
      ...prev,
      breastImplantSyncStatus: isBreastImplant
        ? true
        : prev.breastImplantSyncStatus,
      breastImplantReportText: isBreastImplant
        ? true
        : prev.breastImplantReportText,
      symmetrySyncStatus: isSymmetry ? true : prev.symmetrySyncStatus,
      symmetryReportText: isSymmetry ? true : prev.symmetryReportText,
    }));

    handleReportInputChange(questionId, value);
  };

  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  // const getTechnicianAnswer = (id: number) =>
  //   technicianFormData.find((q) => q.questionId === id)?.answer || "";

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

        <PatientHistory
          requestVersionRef={requestVersionRef}
          setsyncStatus={setsyncStatus}
          setChangedOne={setChangedOne}
          patientHistoryNotes={textEditor.patientHistory.value}
          setPatientHistoryNotes={textEditor.patientHistory.onChange}
        />

        <BreastImplantDetails
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          patientFormData={patientFormData}
          handlePatientInputChange={handlePatientInputChange}
          questionIds={breastImpantQuestions}
        />
        <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 space-y-4 leading-7">
          <div>
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
              onChange={(val, _, source) => {
                textEditor.breastImplant.onChange(val);
                if (source === "user") {
                  setsyncStatus((prev: any) => ({
                    ...prev,
                    breastImplant: false,
                  }));
                }
              }}
              onManualEdit={() => {
                setChangedOne((prev: any) => ({
                  ...prev,
                  breastImplantSyncStatus: true,
                  breastImplantReportText: true,
                }));
                ++requestVersionRef.current;
              }}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-2xl">Image Preview</span>
            </div>
            <TextEditor
              value={textEditor.breastImplantImage.value}
              onChange={textEditor.breastImplantImage.onChange}
              onManualEdit={() => {
                setChangedOne((prev: any) => ({
                  ...prev,
                  breastimplantImageText: true,
                }));
                ++requestVersionRef.current;
              }}
              placeholder="📷 Paste image..."
            />
          </div>
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
              handleInputChange={syncHandleReportChange}
              options={[
                {
                  label: "Symmetrical size and shape",
                  value: "Symmetrical size and shape",
                },
                { label: "Asymmetry", value: "Asymmetry" },
              ]}
            />

            {getAnswer(symmetryQuestions.symmetry) == "Asymmetry" && (
              <MultiRadioOptionalInputInline
                label="Bigger Side"
                labelClassname="w-[12rem]"
                questionId={symmetryQuestions.symmetryLeft}
                formData={reportFormData}
                handleInputChange={syncHandleReportChange}
                options={[
                  {
                    label: "Right Breast",
                    value: "right breast bigger than left breast",
                  },
                  {
                    label: "Left Breast",
                    value: "left breast bigger than right breast",
                  },
                ]}
              />
            )}
          </div>
        </div>
        <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 space-y-4 leading-7">
          <div>
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
              value={textEditor.symmetry.value}
              onChange={(val, _, source) => {
                textEditor.symmetry.onChange(val);
                if (source === "user") {
                  setsyncStatus((prev: any) => ({
                    ...prev,
                    symmetry: false,
                  }));
                }
              }}
              onManualEdit={() => {
                setChangedOne((prev: any) => ({
                  ...prev,
                  symmetrySyncStatus: true,
                  symmetryReportText: true,
                }));
                ++requestVersionRef.current;
              }}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-2xl">Image Preview</span>
            </div>
            <TextEditor
              value={textEditor.symmetryImage.value}
              onChange={textEditor.symmetryImage.onChange}
              onManualEdit={() => {
                setChangedOne((prev:any) => ({
                  ...prev,
                  symmetryImageText: true,
                }));
                ++requestVersionRef.current;
              }}
              placeholder="📷 Paste image..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralReport;