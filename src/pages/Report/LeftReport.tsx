import React, { useEffect } from "react";
import BreastDensityandImageQuality from "./BreastDensityandImageQuality/BreastDensityandImageQuality";
import NippleAreolaSkin from "./NippleAreolaSkin/NippleAreolaSkin";
import GrandularAndDuctalTissueRight from "./GrandularAndDuctalTissue/GrandularAndDuctalTissueRight";
import TextEditor from "@/components/TextEditor";
import LisonsRight from "./Lisons/LisonsRight";
import ComparisonPriorRight from "./ComparisonPrior/ComparisonPriorRight";
import { generateRightBreastReportText } from "./BreastDensityandImageQuality/BreastDensityImageQuality";
import LymphNodesRight from "./LymphNodes/LymphNodesRight";
import { generateGrandularAndDuctalTissueReport } from "./GrandularAndDuctalTissue/GrandularAndDuctalTissueRightReport";
import { LesionsRightString } from "./Lisons/LesionsRightString";
import { ComparisonPriorRightString } from "./ComparisonPrior/ComparisonPriorRightString";
import { generateNippleAreolaBreastEditor } from "./NippleAreolaSkin/NippleAreolaEditor";
import { LymphNodesGenerateString } from "./GenerateReport/LymphNodes";
import { Label } from "@/components/ui/label";
import { ResponsePatientForm } from "../TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";

interface ReportQuestion {
  questionId: number;
  answer: string;
}

interface TextEditorProps {
  breastDensityandImageLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  LesionsLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  ComparisonPriorLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  grandularAndDuctalTissueLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  LymphNodesLeft: {
    value: string;
    onChange: (value: string) => void;
  };
}

interface LeftReportProps {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  patientFormData: ResponsePatientForm[];
  textEditor: TextEditorProps;
  syncStatus: {
    breastDensityandImageLeft: boolean;
    nippleAreolaSkinLeft: boolean;
    LesionsLeft: boolean;
    ComparisonPriorLeft: boolean;
    grandularAndDuctalTissueLeft: boolean;
    LymphNodesLeft: boolean;
  };
  setsyncStatus: any;
  readOnly: boolean
}

const LeftReport: React.FC<LeftReportProps> = ({
  reportFormData,
  handleReportInputChange,
  patientFormData,
  textEditor,
  syncStatus,
  setsyncStatus,
  readOnly
}) => {
  const breastDensityandImageRightQuestions = {
    imageQuality: 57,
    breastDensity: 58,
    fibroglandularVolume: 59,
    symmetry: 60,
    breastSelect: 113,
  };

  const nippleAreolaSkinRightQuestions = {
    skinChanges: 63,
    skinChangesOther: 64,
    nippleDeformity: 65,
    nippleRetraction: 61,
    subAreolarMass: 66,
    architecture: 67,
    architectureOther: 68,
    nippleSelect: 114,
  };

  const grandularAndDuctalTissueRightQuestions = {
    grandularAndDuctalTissue: 69,
    benignMicroCysts: 70,
    benignCapsular: 71,
    benignFibronodular: 72,
    calcificationsPresent: 73,
    macroCalcificationsList: 74,
    microCalcificationsList: 75,
    calcifiedScar: 76,
    calcifiedScarList: 77,
    ductalProminence: 78,
    ductalProminenceList: 79,
    grandularSelect: 115,
  };

  const lesionsRightQuestions = {
    lesionsr: 80,
    simplecrstr: 90,
    simplecrstDatar: 91,
    complexcrstr: 92,
    complexcrstDatar: 93,
    Heterogeneousstr: 94,
    HeterogeneousDatar: 95,
    Hypertrophicstr: 96,
    HypertrophicDatar: 97,
    Otherstr: 98,
    OtherDatar: 99,
  };

  const LymphNodesRightQuestions = {
    Intramammaryr: 100,
    IntramammaryDatar: 101,
    axillarynodes: 102,
    ClipsPresentStatus: 103,
    ClipsPresentdata: 104,
  };

  const ComparisonPriorRightQuestion = {
    ComparisonPriorRight: 105,
    FindingStatus: 106,
    doubletimefrom: 107,
    doubletimeto: 108,
    LesionCompTable: 109,
  };

  useEffect(() => {
    if (syncStatus.breastDensityandImageLeft) {
      textEditor.breastDensityandImageLeft.onChange(
        generateRightBreastReportText(
          reportFormData,
          breastDensityandImageRightQuestions
        )
      );
    }

    if (syncStatus.nippleAreolaSkinLeft) {
      textEditor.nippleAreolaSkinLeft.onChange(
        generateNippleAreolaBreastEditor(
          reportFormData,
          nippleAreolaSkinRightQuestions
        )
      );
    }

    if (syncStatus.grandularAndDuctalTissueLeft) {
      textEditor.grandularAndDuctalTissueLeft.onChange(
        generateGrandularAndDuctalTissueReport(
          reportFormData,
          grandularAndDuctalTissueRightQuestions
        )
      );
    }

    if (syncStatus.LesionsLeft) {
      textEditor.LesionsLeft.onChange(
        LesionsRightString(reportFormData, lesionsRightQuestions)
      );
    }

    if (syncStatus.ComparisonPriorLeft) {
      textEditor.ComparisonPriorLeft.onChange(
        ComparisonPriorRightString(reportFormData, ComparisonPriorRightQuestion, "Left")
      );
    }

    if (syncStatus.LymphNodesLeft) {
          textEditor.LymphNodesLeft.onChange(
            LymphNodesGenerateString(
              reportFormData,
              LymphNodesRightQuestions,
              "Left"
            ));
        }
  }, [reportFormData]);

  const syncHandleReportChange = (questionId: number, value: string) => {
    const isBreastDensityRight = Object.values(breastDensityandImageRightQuestions).includes(questionId);
    const isNippleAreolaRight = Object.values(nippleAreolaSkinRightQuestions).includes(questionId);
    const isGrandularRight = Object.values(grandularAndDuctalTissueRightQuestions).includes(questionId);
    const isLesionsRight = Object.values(lesionsRightQuestions).includes(questionId);
    const isLymphNodesRight = Object.values(LymphNodesRightQuestions).includes(questionId);
    const isComparisonPriorRight = Object.values(ComparisonPriorRightQuestion).includes(questionId);
  
    if (isBreastDensityRight) {
      setsyncStatus({
        ...syncStatus,
        breastDensityandImageRight: true,
      });
      console.log("www", questionId, value)
    }
  
    if (isNippleAreolaRight) {
      setsyncStatus({
        ...syncStatus,
        nippleAreolaSkinRight: true,
      });
    }
  
    if (isGrandularRight) {
      setsyncStatus({
        ...syncStatus,
        grandularAndDuctalTissueRight: true,
      });
    }
  
    if (isLesionsRight) {
      setsyncStatus({
        ...syncStatus,
      LesionsRight : true,
      });
    }
  
    if (isLymphNodesRight) {
      setsyncStatus({
        ...syncStatus,
      LymphNodesRight : true,
      });
    }
  
    if (isComparisonPriorRight) {
      setsyncStatus({
        ...syncStatus,
      ComparisonPrior : true,
      });
    }
  
    handleReportInputChange(questionId, value);
  };
  

  const getAnswer = (id: number) =>
        reportFormData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="p-5 h-[90vh] space-y-10 overflow-y-scroll">
       <Label
          className="font-semibold text-2xl flex flex-wrap lg:items-center"
          style={{ wordSpacing: "0.2em" }}
        >
          E. LEFT BREAST - DETAILED FINDINGS
        </Label>
      <div className={`${readOnly ? "pointer-events-none" : ""}`}>
        <BreastDensityandImageQuality
          label="BREAST DENSITY & IMAGE QUALITY (Left)"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={breastDensityandImageRightQuestions}
        />
        {getAnswer(breastDensityandImageRightQuestions.breastSelect) === "Present" && (
        <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
          <div className="flex items-center justify-between mb-2"> <span className="text-2xl">Report Preview</span>
            {/* {syncStatus.breastDensityandImageLeft ? (
              <Button
                className="bg-[#a4b2a1] hover:bg-[#a4b2a1] h-[20px] w-[60px] text-sm"
                onClick={() => {
                  setsyncStatus({
                    ...syncStatus,
                    breastDensityandImageLeft: false,
                  });
                }}
              >
                Unsync
              </Button>
            ) : (
              <Button
                className="bg-[#a4b2a1] hover:bg-[#a4b2a1] h-[20px] w-[60px] text-sm"
                onClick={() => {
                  setsyncStatus({
                    ...syncStatus,
                    breastDensityandImageLeft: true,
                  });
                }}
              >
                Sync
              </Button>
            )} */}
          </div>
          <TextEditor
            value={textEditor.breastDensityandImageLeft.value}
            onChange={textEditor.breastDensityandImageLeft.onChange}
            onManualEdit={() => {
                if (syncStatus.breastDensityandImageLeft) {
                  setsyncStatus({
                    ...syncStatus,
                    breastDensityandImageLeft: false,
                  });
                }
              }}
          />
        </div>
        )}
      </div>

       <div className={`${readOnly ? "pointer-events-none" : ""}`}>
        <NippleAreolaSkin
          label="NIPPLE, AREOLA & SKIN (Left)"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={nippleAreolaSkinRightQuestions}
          patientFormData={patientFormData}
          side="Left"
        />
        {getAnswer(nippleAreolaSkinRightQuestions.nippleSelect) === "Present" &&
        (
        <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
          <div className="flex items-center justify-between mb-2"> <span className="text-2xl">Report Preview</span>
          </div>
          <TextEditor
            value={textEditor.nippleAreolaSkinLeft.value}
            onChange={textEditor.nippleAreolaSkinLeft.onChange}
            onManualEdit={() => {
                if (syncStatus.nippleAreolaSkinLeft) {
                  setsyncStatus({
                    ...syncStatus,
                    nippleAreolaSkinLeft: false,
                  });
                }
              }}
          />
        </div>
        )}
      </div>

      <div className={`${readOnly ? "pointer-events-none" : ""}`}>
        <GrandularAndDuctalTissueRight
          label="Glandular And Ductal tissue (Left)"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={grandularAndDuctalTissueRightQuestions}
        />
        {getAnswer(grandularAndDuctalTissueRightQuestions.grandularSelect) === "Present" &&
        (
        <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
          <div className="flex items-center justify-between mb-2"> <span className="text-2xl">Report Preview</span>
          </div>
          <TextEditor
            value={textEditor.grandularAndDuctalTissueLeft.value}
            onChange={textEditor.grandularAndDuctalTissueLeft.onChange}
            onManualEdit={() => {
                if (syncStatus.grandularAndDuctalTissueLeft) {
                  setsyncStatus({
                    ...syncStatus,
                    grandularAndDuctalTissueLeft: false,
                  });
                }
              }}
          />
        </div>
        )}
      </div>

       <div className={`${readOnly ? "pointer-events-none" : ""}`}>
        <LisonsRight
          label="LESIONS (Left)"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={lesionsRightQuestions}
        />
        {getAnswer(lesionsRightQuestions.lesionsr) === "Present" && (
        <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
          <div className="flex items-center justify-between mb-2"> <span className="text-2xl">Report Preview</span>
          </div>
          <TextEditor
            value={textEditor.LesionsLeft.value}
            onChange={textEditor.LesionsLeft.onChange}
            onManualEdit={() => {
                if (syncStatus.LesionsLeft) {
                  setsyncStatus({
                    ...syncStatus,
                    LesionsLeft: false,
                  });
                }
              }}
          />
        </div>
        )}
      </div>

       <div className={`${readOnly ? "pointer-events-none" : ""}`}>
        <LymphNodesRight
          label="LYMPH NODES (Left)"
          axilaryLabel="Left Axillary Nodes"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={LymphNodesRightQuestions}
        />
        {getAnswer(LymphNodesRightQuestions.Intramammaryr) === "Present" && (
        <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
          <div className="flex items-center justify-between mb-2"> <span className="text-2xl">Report Preview</span>
          </div>
          <TextEditor
            value={textEditor.LymphNodesLeft.value}
            onChange={textEditor.LymphNodesLeft.onChange}
            onManualEdit={() => {
                if (syncStatus.LymphNodesLeft) {
                  setsyncStatus({
                    ...syncStatus,
                    LymphNodesLeft: false,
                  });
                }
              }}
          />
        </div>
        )}
      </div>

       <div className={`${readOnly ? "pointer-events-none" : ""}`}>
        <ComparisonPriorRight
          label="COMPARISON TO PRIOR STUDIES (Left)"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={ComparisonPriorRightQuestion}
          side="Left"
        />
        {getAnswer(ComparisonPriorRightQuestion.ComparisonPriorRight) === "Present" && (
        <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
          <div className="flex items-center justify-between mb-2"> <span className="text-2xl">Report Preview</span>
          </div>
          <TextEditor
            value={textEditor.ComparisonPriorLeft.value}
            onChange={textEditor.ComparisonPriorLeft.onChange}
            onManualEdit={() => {
                if (syncStatus.ComparisonPriorLeft) {
                  setsyncStatus({
                    ...syncStatus,
                    ComparisonPriorLeft: false,
                  });
                }
              }}
          />
        </div>
        )}
      </div>
    </div>
  );
};

export default LeftReport;
