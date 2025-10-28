import React from "react";
import BreastDensityandImageQuality from "./BreastDensityandImageQuality/BreastDensityandImageQuality";
import NippleAreolaSkin from "./NippleAreolaSkin/NippleAreolaSkin";
import GrandularAndDuctalTissueRight from "./GrandularAndDuctalTissue/GrandularAndDuctalTissueRight";
import TextEditor from "@/components/TextEditor";
import LisonsRight from "./Lisons/LisonsRight";
import ComparisonPriorRight from "./ComparisonPrior/ComparisonPriorRight";
import LymphNodesRight from "./LymphNodes/LymphNodesRight";
import { Label } from "@/components/ui/label";
import { ResponsePatientForm } from "../TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import {
  breastDensityandImageLeftQuestions,
  ComparisonPriorLeftQuestion,
  grandularAndDuctalTissueLeftQuestions,
  lesionsLeftQuestions,
  LymphNodesLeftQuestions,
  nippleAreolaSkinLeftQuestions,
} from "./ReportQuestionsAssignment";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { ChangedOneState } from "./Report";

interface ReportQuestion {
  questionId: number;
  answer: string;
}

interface TextEditorProps {
  breastDensityandImageLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  breastDensityandImageLeftImage: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinLeftImage: {
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
  grandularAndDuctalTissueLeftImage: {
    value: string;
    onChange: (value: string) => void;
  };
  LymphNodesLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  LymphNodesLeftImage: {
    value: string;
    onChange: (value: string) => void;
  };
}

interface LeftReportProps {
  requestVersionRef: React.MutableRefObject<number>;
  setChangedOne: React.Dispatch<React.SetStateAction<ChangedOneState>>;
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  patientFormData: ResponsePatientForm[];
  textEditor: TextEditorProps;
  setsyncStatus: any;
  readOnly: boolean;
}

const LeftReport: React.FC<LeftReportProps> = ({
  requestVersionRef,
  setChangedOne,
  reportFormData,
  handleReportInputChange,
  patientFormData,
  textEditor,
  setsyncStatus,
  readOnly,
}) => {
  const syncHandleReportChange = (questionId: number, value: string) => {
    const isBreastDensityLeft = Object.values(
      breastDensityandImageLeftQuestions
    ).includes(questionId);
    const isNippleAreolaLeft = Object.values(
      nippleAreolaSkinLeftQuestions
    ).includes(questionId);
    const isGrandularLeft = Object.values(
      grandularAndDuctalTissueLeftQuestions
    ).includes(questionId);
    const isLesionsLeft =
      Object.values(lesionsLeftQuestions).includes(questionId);
    const isLymphNodesLeft = Object.values(LymphNodesLeftQuestions).includes(
      questionId
    );
    const isComparisonPriorLeft = Object.values(
      ComparisonPriorLeftQuestion
    ).includes(questionId);

    if (isBreastDensityLeft) {
      setsyncStatus((prev: any) => ({
        ...prev,
        breastDensityandImageLeft: true,
      }));
    }

    if (isNippleAreolaLeft) {
      setsyncStatus((prev: any) => ({
        ...prev,
        nippleAreolaSkinLeft: true,
      }));
    }

    if (isGrandularLeft) {
      setsyncStatus((prev: any) => ({
        ...prev,
        grandularAndDuctalTissueLeft: true,
      }));
    }

    if (isLesionsLeft) {
      setsyncStatus((prev: any) => ({
        ...prev,
        LesionsLeft: true,
      }));
    }

    if (isLymphNodesLeft) {
      setsyncStatus((prev: any) => ({
        ...prev,
        LymphNodesLeft: true,
      }));
    }

    if (isComparisonPriorLeft) {
      setsyncStatus((prev: any) => ({
        ...prev,
        ComparisonPrior: true,
      }));
    }

    setChangedOne((prev: any) => ({
      ...prev,
      breastDensityandImageLeftSyncStatus: isBreastDensityLeft
        ? true
        : prev.breastDensityandImageLeftSyncStatus,
      breastDensityandImageLeftReportText: isBreastDensityLeft
        ? true
        : prev.breastDensityandImageLeftReportText,
      nippleAreolaSkinLeftSyncStatus: isNippleAreolaLeft
        ? true
        : prev.nippleAreolaSkinLeftSyncStatus,
      nippleAreolaSkinLeftReportText: isNippleAreolaLeft
        ? true
        : prev.nippleAreolaSkinLeftReportText,
      grandularAndDuctalTissueLeftSyncStatus: isGrandularLeft
        ? true
        : prev.grandularAndDuctalTissueLeftSyncStatus,
      grandularAndDuctalTissueLeftReportText: isGrandularLeft
        ? true
        : prev.grandularAndDuctalTissueLeftReportText,
      LesionsLeftSyncStatus: isLesionsLeft ? true : prev.LesionsLeftSyncStatus,
      LesionsLeftReportText: isLesionsLeft ? true : prev.LesionsLeftReportText,
      LymphNodesLeftSyncStatus: isLymphNodesLeft
        ? true
        : prev.LymphNodesLeftSyncStatus,
      LymphNodesLeftReportText: isLymphNodesLeft
        ? true
        : prev.LymphNodesLeftReportText,
      ComparisonPriorLeftSyncStatus: isComparisonPriorLeft
        ? true
        : prev.ComparisonPriorLeftSyncStatus,
      ComparisonPriorLeftReportText: isComparisonPriorLeft
        ? true
        : prev.ComparisonPriorLeftReportText,
    }));

    handleReportInputChange(questionId, value);
  };

  // useEffect(() => {
  //   setChangedOne((prev: any) => ({
  //     ...prev,
  //     LesionsLeftSyncStatus: true,
  //     LesionsLeftReportText: true,
  //   }));
  // }, [textEditor.LesionsLeft.value]);

  // useEffect(() => {
  //   setChangedOne((prev: any) => ({
  //     ...prev,
  //     ComparisonPriorLeftSyncStatus: true,
  //     ComparisonPriorLeftReportText: true,
  //   }));
  // }, [textEditor.ComparisonPriorLeft.value]);

  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="p-5 h-[90vh] space-y-10 overflow-y-scroll">
      <div
        className={`flex gap-4 py-4 items-center mb-4 -ml-2 ${
          readOnly ? "pointer-events-none" : ""
        }`}
      >
        <div>
          <Checkbox2
            checked={getAnswer(131) === "Present"}
            onCheckedChange={(checked) =>
              handleReportInputChange(131, checked ? "Present" : "Absent")
            }
            className="w-5 h-5 mt-1"
          />
        </div>
        <Label
          className="font-semibold text-2xl flex flex-wrap lg:items-center"
          style={{ wordSpacing: "0.2em" }}
        >
          E. LEFT BREAST - DETAILED FINDINGS
        </Label>
      </div>

      {getAnswer(131) === "Present" && (
        <>
          <div className={`${readOnly ? "pointer-events-none" : ""}`}>
            <BreastDensityandImageQuality
              label="BREAST DENSITY & IMAGE QUALITY (Left)"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={breastDensityandImageLeftQuestions}
            />
            {getAnswer(breastDensityandImageLeftQuestions.breastSelect) ===
              "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 space-y-4 leading-7">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Report Preview</span>
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
                    onChange={(val, _, source) => {
                      textEditor.breastDensityandImageLeft.onChange(val);
                      if (source === "user") {
                        setsyncStatus((prev: any) => ({
                          ...prev,
                          breastDensityandImageLeft: false,
                        }));
                      }
                    }}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        breastDensityandImageLeftSyncStatus: true,
                        breastDensityandImageLeftReportText: true,
                      }));
                      ++requestVersionRef.current;
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Image Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.breastDensityandImageLeftImage.value}
                    onChange={
                      textEditor.breastDensityandImageLeftImage.onChange
                    }
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        breastdensityImageTextLeft: true,
                      }));
                      ++requestVersionRef.current;
                    }}
                    placeholder="📷 Paste image..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className={`${readOnly ? "pointer-events-none" : ""}`}>
            <NippleAreolaSkin
              label="NIPPLE, AREOLA & SKIN (Left)"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={nippleAreolaSkinLeftQuestions}
              patientFormData={patientFormData}
              side="Left"
            />
            {getAnswer(nippleAreolaSkinLeftQuestions.nippleSelect) ===
              "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 space-y-4 leading-7">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Report Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.nippleAreolaSkinLeft.value}
                    onChange={(val, _, source) => {
                      textEditor.nippleAreolaSkinLeft.onChange(val);
                      if (source === "user") {
                        setsyncStatus((prev: any) => ({
                          ...prev,
                          nippleAreolaSkinLeft: false,
                        }));
                      }
                    }}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        nippleAreolaSkinLeftSyncStatus: true,
                        nippleAreolaSkinLeftReportText: true,
                      }));
                      ++requestVersionRef.current;
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Image Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.nippleAreolaSkinLeftImage.value}
                    onChange={textEditor.nippleAreolaSkinLeftImage.onChange}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        nippleareolaImageTextLeft: true,
                      }));
                      ++requestVersionRef.current;
                    }}
                    placeholder="📷 Paste image..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className={`${readOnly ? "pointer-events-none" : ""}`}>
            <GrandularAndDuctalTissueRight
              label="Glandular And Ductal tissue (Left)"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={grandularAndDuctalTissueLeftQuestions}
            />
            {getAnswer(
              grandularAndDuctalTissueLeftQuestions.grandularSelect
            ) === "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 space-y-4 leading-7">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Report Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.grandularAndDuctalTissueLeft.value}
                    onChange={(val, _, source) => {
                      textEditor.grandularAndDuctalTissueLeft.onChange(val);
                      if (source === "user") {
                        setsyncStatus((prev: any) => ({
                          ...prev,
                          grandularAndDuctalTissueLeft: false,
                        }));
                      }
                    }}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        grandularAndDuctalTissueLeftSyncStatus: true,
                        grandularAndDuctalTissueLeftReportText: true,
                      }));
                      ++requestVersionRef.current;
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Image Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.grandularAndDuctalTissueLeftImage.value}
                    onChange={
                      textEditor.grandularAndDuctalTissueLeftImage.onChange
                    }
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        glandularImageTextLeft: true,
                      }));
                      ++requestVersionRef.current;
                    }}
                    placeholder="📷 Paste image..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className={`${readOnly ? "pointer-events-none" : ""}`}>
            <LisonsRight
              label="LESIONS (Left)"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={lesionsLeftQuestions}
              textEditorVal={textEditor.LesionsLeft.value}
              textEditorOnChange={textEditor.LesionsLeft.onChange}
            />
            {/* {getAnswer(lesionsLeftQuestions.lesionsr) === "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
                <div className="flex items-center justify-between mb-2">
                  {" "}
                  <span className="text-2xl">Report Preview</span>
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
            )} */}
          </div>

          <div className={`${readOnly ? "pointer-events-none" : ""}`}>
            <LymphNodesRight
              label="LYMPH NODES (Left)"
              axilaryLabel="Left Axillary Nodes"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={LymphNodesLeftQuestions}
            />
            {getAnswer(LymphNodesLeftQuestions.Intramammaryr) === "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 space-y-4 leading-7">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Report Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.LymphNodesLeft.value}
                    onChange={(val, _, source) => {
                      textEditor.LymphNodesLeft.onChange(val);
                      if (source === "user") {
                        setsyncStatus((prev: any) => ({
                          ...prev,
                          LymphNodesLeft: false,
                        }));
                      }
                    }}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        LymphNodesLeftSyncStatus: true,
                        LymphNodesLeftReportText: true,
                      }));
                      ++requestVersionRef.current;
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Image Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.LymphNodesLeftImage.value}
                    onChange={textEditor.LymphNodesLeftImage.onChange}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        lymphnodesImageTextLeft: true,
                      }));
                      ++requestVersionRef.current;
                    }}
                    placeholder="📷 Paste image..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className={`${readOnly ? "pointer-events-none" : ""}`}>
            <ComparisonPriorRight
              label="COMPARISON TO PRIOR STUDIES (Left)"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={ComparisonPriorLeftQuestion}
              side="Left"
              textEditorVal={textEditor.ComparisonPriorLeft.value}
              textEditorOnChange={textEditor.ComparisonPriorLeft.onChange}
            />
            {/* {getAnswer(ComparisonPriorLeftQuestion.ComparisonPriorRight) ===
              "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
                <div className="flex items-center justify-between mb-2">
                  {" "}
                  <span className="text-2xl">Report Preview</span>
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
            )} */}
          </div>
        </>
      )}
    </div>
  );
};

export default LeftReport;
