import React from "react";
import BreastDensityandImageQualityRight from "./BreastDensityandImageQuality/BreastDensityandImageQuality";
import NippleAreolaSkin from "./NippleAreolaSkin/NippleAreolaSkin";
import GrandularAndDuctalTissueRight from "./GrandularAndDuctalTissue/GrandularAndDuctalTissueRight";
import TextEditor from "@/components/TextEditor";
import LisonsRight from "./Lisons/LisonsRight";
import ComparisonPriorRight from "./ComparisonPrior/ComparisonPriorRight";
import LymphNodesRight from "./LymphNodes/LymphNodesRight";
import { Label } from "@/components/ui/label";
import { ResponsePatientForm } from "../TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import {
  breastDensityandImageRightQuestions,
  ComparisonPriorRightQuestion,
  grandularAndDuctalTissueRightQuestions,
  lesionsRightQuestions,
  LymphNodesRightQuestions,
  nippleAreolaSkinRightQuestions,
} from "./ReportQuestionsAssignment";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { ChangedOneState } from "./Report";

interface ReportQuestion {
  questionId: number;
  answer: string;
}

interface TextEditorProps {
  breastDensityandImageRight: {
    value: string;
    onChange: (value: string) => void;
  };
  breastDensityandImageRightImage: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinRight: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinRightImage: {
    value: string;
    onChange: (value: string) => void;
  };
  LesionsRight: {
    value: string;
    onChange: (value: string) => void;
  };
  LesionsRightImage: {
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
  grandularAndDuctalTissueRightImage: {
    value: string;
    onChange: (value: string) => void;
  };
  LymphNodesRight: {
    value: string;
    onChange: (value: string) => void;
  };
  LymphNodesRightImage: {
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
  textEditor: TextEditorProps;
  setsyncStatus: any;
  readOnly: boolean;
}

const RightReport: React.FC<RightReportProps> = ({
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
    console.log(
      "GeneralReport.tsx -------------------------- > 108 calling...."
    );
    const isBreastDensityRight = Object.values(
      breastDensityandImageRightQuestions
    ).includes(questionId);
    const isNippleAreolaRight = Object.values(
      nippleAreolaSkinRightQuestions
    ).includes(questionId);
    const isGrandularRight = Object.values(
      grandularAndDuctalTissueRightQuestions
    ).includes(questionId);
    const isLesionsRight = Object.values(lesionsRightQuestions).includes(
      questionId
    );
    const isLymphNodesRight = Object.values(LymphNodesRightQuestions).includes(
      questionId
    );
    const isComparisonPriorRight = Object.values(
      ComparisonPriorRightQuestion
    ).includes(questionId);

    if (isBreastDensityRight) {
      setsyncStatus((prev: any) => ({
        ...prev,
        breastDensityandImageRight: true,
      }));
    }

    if (isNippleAreolaRight) {
      setsyncStatus((prev: any) => ({
        ...prev,
        nippleAreolaSkinRight: true,
      }));
    }

    if (isGrandularRight) {
      setsyncStatus((prev: any) => ({
        ...prev,
        grandularAndDuctalTissueRight: true,
      }));
    }

    if (isLesionsRight) {
      setsyncStatus((prev: any) => ({
        ...prev,
        LesionsRight: true,
      }));
    }

    if (isLymphNodesRight) {
      setsyncStatus((prev: any) => ({
        ...prev,
        LymphNodesRight: true,
      }));
    }

    if (isComparisonPriorRight) {
      setsyncStatus((prev: any) => ({
        ...prev,
        ComparisonPrior: true,
      }));
    }

    setChangedOne((prev: any) => ({
  ...prev,
  breastDensityandImageRightSyncStatus: isBreastDensityRight ? true : prev.breastDensityandImageRightSyncStatus,
  breastDensityandImageRightReportText: isBreastDensityRight ? true : prev.breastDensityandImageRightReportText,

  nippleAreolaSkinRightSyncStatus: isNippleAreolaRight ? true : prev.nippleAreolaSkinRightSyncStatus,
  nippleAreolaSkinRightReportText: isNippleAreolaRight ? true : prev.nippleAreolaSkinRightReportText,

  grandularAndDuctalTissueRightSyncStatus: isGrandularRight ? true : prev.grandularAndDuctalTissueRightSyncStatus,
  grandularAndDuctalTissueRightReportText: isGrandularRight ? true : prev.grandularAndDuctalTissueRightReportText,

  LesionsRightSyncStatus: isLesionsRight ? true : prev.LesionsRightSyncStatus,
  LesionsRightReportText: isLesionsRight ? true : prev.LesionsRightReportText,

  LymphNodesRightSyncStatus: isLymphNodesRight ? true : prev.LymphNodesRightSyncStatus,
  LymphNodesRightReportText: isLymphNodesRight ? true : prev.LymphNodesRightReportText,

  ComparisonPriorSyncStatus: isComparisonPriorRight ? true : prev.ComparisonPriorSyncStatus,
  ComparisonPriorReportText: isComparisonPriorRight ? true : prev.ComparisonPriorReportText,
}));

    handleReportInputChange(questionId, value);
  };

  // useEffect(() => {
  //   setChangedOne((prev: any) => ({
  //     ...prev,
  //     LesionsRightSyncStatus: true,
  //     LesionsRightReportText: true,
  //   }));
  // }, [textEditor.LesionsRight.value]);

  // useEffect(() => {
  //   setChangedOne((prev: any) => ({
  //     ...prev,
  //     ComparisonPriorSyncStatus: true,
  //     ComparisonPriorReportText: true,
  //   }));
  // }, [textEditor.ComparisonPrior.value]);

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
            checked={getAnswer(130) === "Present"}
            onCheckedChange={(checked) =>
              handleReportInputChange(130, checked ? "Present" : "Absent")
            }
            className="w-5 h-5 mt-1"
          />
        </div>
        <Label
          className="font-semibold text-2xl flex flex-wrap lg:items-center"
          style={{ wordSpacing: "0.2em" }}
        >
          D. RIGHT BREAST - DETAILED FINDINGS
        </Label>
      </div>

      {getAnswer(130) === "Present" && (
        <>
          <div className={`${readOnly ? "pointer-events-none" : ""}`}>
            <BreastDensityandImageQualityRight
              label="BREAST DENSITY & IMAGE QUALITY (Right)"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={breastDensityandImageRightQuestions}
            />
            {getAnswer(breastDensityandImageRightQuestions.breastSelect) ===
              "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 space-y-4 leading-7">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Report Preview</span>
                  </div>

                  <TextEditor
                    value={textEditor.breastDensityandImageRight.value}
                    onChange={(val, _, source) => {
                      textEditor.breastDensityandImageRight.onChange(val);
                      if (source === "user") {
                        setsyncStatus((prev: any) => ({
                          ...prev,
                          breastDensityandImageRight: false,
                        }));
                      }
                    }}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        breastDensityandImageRightSyncStatus: true,
                        breastDensityandImageRightReportText: true,
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
                    value={textEditor.breastDensityandImageRightImage.value}
                    onChange={
                      textEditor.breastDensityandImageRightImage.onChange
                    }
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        breastdensityImageText: true,
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
              label="NIPPLE, AREOLA & SKIN (Right)"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={nippleAreolaSkinRightQuestions}
              patientFormData={patientFormData}
              side="Right"
            />
            {getAnswer(nippleAreolaSkinRightQuestions.nippleSelect) ===
              "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 space-y-4 leading-7">
                <div>
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
                    onChange={(val, _, source) => {
                      textEditor.nippleAreolaSkinRight.onChange(val);
                      if (source === "user") {
                        setsyncStatus((prev: any) => ({
                          ...prev,
                          nippleAreolaSkinRight: false,
                        }));
                      }
                    }}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        nippleAreolaSkinRightSyncStatus: true,
                        nippleAreolaSkinRightReportText: true,
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
                    value={textEditor.nippleAreolaSkinRightImage.value}
                    onChange={textEditor.nippleAreolaSkinRightImage.onChange}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        nippleareolaImageText: true,
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
              label="Glandular And Ductal tissue (Right)"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={grandularAndDuctalTissueRightQuestions}
            />
            {getAnswer(
              grandularAndDuctalTissueRightQuestions.grandularSelect
            ) === "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 space-y-4 leading-7">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Report Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.grandularAndDuctalTissueRight.value}
                    onChange={(val, _, source) => {
                      textEditor.grandularAndDuctalTissueRight.onChange(val);
                      if (source === "user") {
                        setsyncStatus((prev: any) => ({
                          ...prev,
                          grandularAndDuctalTissueRight: false,
                        }));
                      }
                    }}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        grandularAndDuctalTissueRightSyncStatus: true,
                        grandularAndDuctalTissueRightReportText: true,
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
                    value={textEditor.grandularAndDuctalTissueRightImage.value}
                    onChange={
                      textEditor.grandularAndDuctalTissueRightImage.onChange
                    }
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        glandularImageText: true,
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
              label="LESIONS (Right)"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={lesionsRightQuestions}
              textEditorVal={textEditor.LesionsRight.value}
              textEditorOnChange={textEditor.LesionsRight.onChange}
            />
            {/* {getAnswer(lesionsRightQuestions.lesionsr) === "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
                <div className="flex items-center justify-between mb-2">
                  {" "}
                  <span className="text-2xl">Report Preview</span>
                </div>
                <TextEditor
                  value={textEditor.LesionsRight.value}
                  // onChange={textEditor.LesionsRight.onChange}
                  // onManualEdit={() => {
                  //   if (syncStatus.LesionsRight) {
                  //     setsyncStatus({
                  //       ...syncStatus,
                  //       LesionsRight: false,
                  //     });
                  //   }
                  // }}
                />
              </div>
            )} */}
          </div>

          <div className={`${readOnly ? "pointer-events-none" : ""}`}>
            <LymphNodesRight
              label="LYMPH NODES (Right)"
              axilaryLabel="Right Axillary Nodes"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={LymphNodesRightQuestions}
            />
            {getAnswer(LymphNodesRightQuestions.Intramammaryr) ===
              "Present" && (
              <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 space-y-4 leading-7">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Report Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.LymphNodesRight.value}
                    onChange={(val, _, source) => {
                      textEditor.LymphNodesRight.onChange(val);
                      if (source === "user") {
                        setsyncStatus((prev: any) => ({
                          ...prev,
                          LymphNodesRight: false,
                        }));
                      }
                    }}
                    onManualEdit={() => {
                      setChangedOne((prev: any) => ({
                        ...prev,
                        LymphNodesRightSyncStatus: true,
                        LymphNodesRightReportText: true,
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
                    value={textEditor.LymphNodesRightImage.value}
                    onChange={textEditor.LymphNodesRightImage.onChange}
                    onManualEdit={() => {
                      setChangedOne((prev:any)=>({
                        ...prev,
                        lymphnodesImageText: true,
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
              label="COMPARISON TO PRIOR STUDIES (Right)"
              reportFormData={reportFormData}
              handleReportInputChange={syncHandleReportChange}
              questionIds={ComparisonPriorRightQuestion}
              side="Right"
              textEditorVal={textEditor.ComparisonPrior.value}
              textEditorOnChange={textEditor.ComparisonPrior.onChange}
            />
            {/* {getAnswer(ComparisonPriorRightQuestion.ComparisonPriorRight) ===
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
            )} */}
          </div>
        </>
      )}
    </div>
  );
};

export default RightReport;
