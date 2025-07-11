import React, { useEffect } from "react";
import BreastDensityandImageQualityRight from "./BreastDensityandImageQuality/BreastDensityandImageQuality";
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
  breastDensityandImageRight: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinRight: {
    value: string;
    onChange: (value: string) => void;
  };
  LesionsRight: {
    value: string;
    onChange: (value: string) => void;
  };
  ComparisonPrior: {
    value: string;
    onChange: (value: string) => void;
  };
  grandularAndDuctalTissueRight: {
    value: string;
    onChange: (value: string) => void;
  };
  LymphNodesRight: {
    value: string;
    onChange: (value: string) => void;
  };
}

interface RightReportProps {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  patientFormData: ResponsePatientForm[];
  textEditor: TextEditorProps;
  syncStatus: {
    breastImplantRight: boolean;
    breastDensityandImageRight: boolean;
    nippleAreolaSkinRight: boolean;
    LesionsRight: boolean;
    ComparisonPrior: boolean;
    grandularAndDuctalTissueRight: boolean;
    LymphNodesRight: boolean;
  };
  setsyncStatus: any;
  readOnly: boolean
}

const RightReport: React.FC<RightReportProps> = ({
  reportFormData,
  handleReportInputChange,
  patientFormData,
  textEditor,
  syncStatus,
  setsyncStatus,
  readOnly
}) => {

  const breastDensityandImageRightQuestions = {
    imageQuality: 14,
    breastDensity: 15,
    fibroglandularVolume: 16,
    symmetry: 17,
    breastSelect: 110,
  };

  const nippleAreolaSkinRightQuestions = {
    skinChanges: 19,
    skinChangesOther: 20,
    nippleDeformity: 21,
    nippleRetraction: 18,
    subAreolarMass: 22,
    architecture: 23,
    architectureOther: 24,
    nippleSelect: 111,
  };

  const grandularAndDuctalTissueRightQuestions = {
    grandularAndDuctalTissue: 25,
    benignMicroCysts: 26,
    benignCapsular: 27,
    benignFibronodular: 28,
    calcificationsPresent: 29,
    macroCalcificationsList: 30,
    microCalcificationsList: 31,
    calcifiedScar: 32,
    calcifiedScarList: 33,
    ductalProminence: 34,
    ductalProminenceList: 35,
    grandularSelect: 112
  };

  const lesionsRightQuestions = {
    lesionsr: 36,
    simplecrstr: 37,
    simplecrstDatar: 38,
    complexcrstr: 39,
    complexcrstDatar: 40,
    Heterogeneousstr: 41,
    HeterogeneousDatar: 42,
    Hypertrophicstr: 43,
    HypertrophicDatar: 44,
    Otherstr: 45,
    OtherDatar: 46,
  }

  const LymphNodesRightQuestions = {
    Intramammaryr: 47,
    IntramammaryDatar: 48,
    axillarynodes: 49,
    ClipsPresentStatus: 50,
    ClipsPresentdata: 51,
  }

  const ComparisonPriorRightQuestion = {
    ComparisonPriorRight: 52,
    FindingStatus: 53,
    doubletimefrom: 54,
    doubletimeto: 55,
    LesionCompTable: 56,
  }

  useEffect(() => {

    if (syncStatus.breastDensityandImageRight) {
      textEditor.breastDensityandImageRight.onChange(
        generateRightBreastReportText(
          reportFormData,
          breastDensityandImageRightQuestions
        )
      );
    }

    if (syncStatus.nippleAreolaSkinRight) {
      textEditor.nippleAreolaSkinRight.onChange(
        generateNippleAreolaBreastEditor(
          reportFormData,
          nippleAreolaSkinRightQuestions
        )
      );
    }

    if (syncStatus.grandularAndDuctalTissueRight) {
      textEditor.grandularAndDuctalTissueRight.onChange(
        generateGrandularAndDuctalTissueReport(
          reportFormData,
          grandularAndDuctalTissueRightQuestions
        )
      );
    }

    if (syncStatus.LesionsRight) {
      textEditor.LesionsRight.onChange(
        LesionsRightString(
          reportFormData,
          lesionsRightQuestions
        ));
    }

    if (syncStatus.ComparisonPrior) {
      textEditor.ComparisonPrior.onChange(
        ComparisonPriorRightString(
          reportFormData,
          ComparisonPriorRightQuestion,
          "Right"
        ));
    }

    if (syncStatus.LymphNodesRight) {
      textEditor.LymphNodesRight.onChange(
        LymphNodesGenerateString(
          reportFormData,
          LymphNodesRightQuestions,
          "Right"
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
  console.log("aaaa", syncStatus.ComparisonPrior)
  return (
    <div className="p-5 h-[90vh] space-y-10 overflow-y-scroll">
      <Label
          className="font-semibold text-2xl flex flex-wrap lg:items-center"
          style={{ wordSpacing: "0.2em" }}
        >
          D. RIGHT BREAST - DETAILED FINDINGS
        </Label>
      <div className={`${readOnly ? "pointer-events-auto" : ""}`}>
        <BreastDensityandImageQualityRight
          label="BREAST DENSITY & IMAGE QUALITY (Right)"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={breastDensityandImageRightQuestions}
        />
        {getAnswer(breastDensityandImageRightQuestions.breastSelect) ===
          "Present" && (
          <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
            <div className="flex items-center justify-between mb-2">
              {" "}
              <span className="text-2xl">Report Preview</span>
            </div>

            <TextEditor
              value={textEditor.breastDensityandImageRight.value}
              onChange={textEditor.breastDensityandImageRight.onChange}
              onManualEdit={() => {
                if (syncStatus.breastDensityandImageRight) {
                  setsyncStatus({
                    ...syncStatus,
                    breastDensityandImageRight: false,
                  });
                }
              }}
            />
          </div>
        )}
      </div>

      <div>
        <NippleAreolaSkin
          label="NIPPLE, AREOLA & SKIN (Right)"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={nippleAreolaSkinRightQuestions}
          patientFormData={patientFormData}
          side="Right"
        />
        {getAnswer(nippleAreolaSkinRightQuestions.nippleSelect) ===
          "Present" && (
          <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
            <div className="flex items-center justify-between mb-2">
              {" "}
              <span className="text-2xl">Report Preview</span>
              {/* {syncStatus.nippleAreolaSkinRight ? (
                <Button
                  className="bg-[#a4b2a1] hover:bg-[#a4b2a1] h-[20px] w-[60px] text-sm"
                  onClick={() => {
                    setsyncStatus({
                      ...syncStatus,
                      nippleAreolaSkinRight: false,
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
                      nippleAreolaSkinRight: true,
                    });
                  }}
                >
                  Sync
                </Button>
              )} */}
            </div>
            <TextEditor
              value={textEditor.nippleAreolaSkinRight.value}
              onChange={textEditor.nippleAreolaSkinRight.onChange}
              onManualEdit={() => {
                if (syncStatus.nippleAreolaSkinRight) {
                  setsyncStatus({
                    ...syncStatus,
                    nippleAreolaSkinRight: false,
                  });
                }
              }}
            />
          </div>
        )}
      </div>

      <div>
        <GrandularAndDuctalTissueRight
          label="Glandular And Ductal tissue (Right)"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={grandularAndDuctalTissueRightQuestions}
        />
        {getAnswer(grandularAndDuctalTissueRightQuestions.grandularSelect) ===
          "Present" && (
          <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
            <div className="flex items-center justify-between mb-2">
              {" "}
              <span className="text-2xl">Report Preview</span>
            </div>
            <TextEditor
              value={textEditor.grandularAndDuctalTissueRight.value}
              onChange={textEditor.grandularAndDuctalTissueRight.onChange}
              onManualEdit={() => {
                if (syncStatus.grandularAndDuctalTissueRight) {
                  setsyncStatus({
                    ...syncStatus,
                    grandularAndDuctalTissueRight: false,
                  });
                }
              }}
            />
          </div>
        )}
      </div>

      <div>
        <LisonsRight
          label="LESIONS (Right)"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={lesionsRightQuestions}
        />
        {getAnswer(lesionsRightQuestions.lesionsr) === "Present" && (
          <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
            <div className="flex items-center justify-between mb-2">
              {" "}
              <span className="text-2xl">Report Preview</span>
            </div>
            <TextEditor
              value={textEditor.LesionsRight.value}
              onChange={textEditor.LesionsRight.onChange}
              onManualEdit={() => {
                if (syncStatus.LesionsRight) {
                  setsyncStatus({
                    ...syncStatus,
                    LesionsRight: false,
                  });
                }
              }}
            />
          </div>
        )}
      </div>

      <div>
        <LymphNodesRight
          label="LYMPH NODES (Right)"
          axilaryLabel="Right Axillary Nodes"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={LymphNodesRightQuestions}
        />
        {getAnswer(LymphNodesRightQuestions.Intramammaryr) === "Present" && (
          <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
            <div className="flex items-center justify-between mb-2">
              {" "}
              <span className="text-2xl">Report Preview</span>
            </div>
            <TextEditor
              value={textEditor.LymphNodesRight.value}
              onChange={textEditor.LymphNodesRight.onChange}
              onManualEdit={() => {
                if (syncStatus.LymphNodesRight) {
                  setsyncStatus({
                    ...syncStatus,
                    LymphNodesRight: false,
                  });
                }
              }}
            />
          </div>
        )}
      </div>

      <div>
        <ComparisonPriorRight
          label="COMPARISON TO PRIOR STUDIES (Right)"
          reportFormData={reportFormData}
          handleReportInputChange={syncHandleReportChange}
          questionIds={ComparisonPriorRightQuestion}
          side="Right"
        />
        {getAnswer(ComparisonPriorRightQuestion.ComparisonPriorRight) ===
          "Present" && (
          <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
            <div className="flex items-center justify-between mb-2">
              {" "}
              <span className="text-2xl">Report Preview</span>
            </div>
            <TextEditor
              value={textEditor.ComparisonPrior.value}
              onChange={textEditor.ComparisonPrior.onChange}
              onManualEdit={() => {
                if (syncStatus.ComparisonPrior) {
                  setsyncStatus({
                    ...syncStatus,
                    ComparisonPrior: false,
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

export default RightReport;
