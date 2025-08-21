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
  changedOne: ChangedOneState;
  setChangedOne: React.Dispatch<React.SetStateAction<ChangedOneState>>;
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  patientFormData: ResponsePatientForm[];
  textEditor: TextEditorProps;
  syncStatus: {
    breastImplant: boolean;
    breastDensityandImageRight: boolean;
    nippleAreolaSkinRight: boolean;
    LesionsRight: boolean;
    ComparisonPrior: boolean;
    grandularAndDuctalTissueRight: boolean;
    LymphNodesRight: boolean;
  };
  setsyncStatus: any;
  readOnly: boolean;
}

const RightReport: React.FC<RightReportProps> = ({
  changedOne,
  setChangedOne,
  reportFormData,
  handleReportInputChange,
  patientFormData,
  textEditor,
  syncStatus,
  setsyncStatus,
  readOnly,
}) => {
  const syncHandleReportChange = (questionId: number, value: string) => {
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
      setsyncStatus({
        ...syncStatus,
        breastDensityandImageRight: true,
      });
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
        LesionsRight: true,
      });
    }

    if (isLymphNodesRight) {
      setsyncStatus({
        ...syncStatus,
        LymphNodesRight: true,
      });
    }

    if (isComparisonPriorRight) {
      setsyncStatus({
        ...syncStatus,
        ComparisonPrior: true,
      });
    }

    handleReportInputChange(questionId, value);
  };

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
                      setChangedOne({
                        ...changedOne,
                        breastdensityImageText: true,
                      });
                    }}
                    placeholder="Past image..."
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

                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Image Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.nippleAreolaSkinRightImage.value}
                    onChange={textEditor.nippleAreolaSkinRightImage.onChange}
                    onManualEdit={() => {
                      setChangedOne({
                        ...changedOne,
                        nippleareolaImageText: true,
                      });
                    }}
                    placeholder="Past image..."
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
                      setChangedOne({
                        ...changedOne,
                        glandularImageText: true,
                      });
                    }}
                    placeholder="Past image..."
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

                <div>
                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <span className="text-2xl">Image Preview</span>
                  </div>
                  <TextEditor
                    value={textEditor.LymphNodesRightImage.value}
                    onChange={textEditor.LymphNodesRightImage.onChange}
                    onManualEdit={() => {
                      setChangedOne({
                        ...changedOne,
                        lymphnodesImageText: true,
                      });
                    }}
                    placeholder="Past image..."
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
