import React, { useEffect } from "react";
import { ReportQuestion } from "../Report";
import { Label } from "@/components/ui/label";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
// import LesionsOptionsOther from "./LesionsOptionsOther";
import LesionsOptions from "./LesionsOptions";
import { LesionsRightString } from "./LesionsRightString";

interface QuestionIds {
  lesionsr: number;
  simplecrstr: number;
  simplecrstDatar: number;
  complexcrstr: number;
  complexcrstDatar: number;
  Heterogeneousstr: number;
  HeterogeneousDatar: number;
  Hypertrophicstr: number;
  HypertrophicDatar: number;
  Otherstr: number;
  OtherDatar: number;
  fibronodulardensitystr: number;
  fibronodulardensityDatar: number;
  multipleCystsstr: number;
  multipleCystsDatar: number;
}

interface Props {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  label: string;
  textEditorVal: string;
  textEditorOnChange: (value: string) => void;
}

const LisonsRight: React.FC<Props> = ({
  questionIds,
  reportFormData,
  handleReportInputChange,
  label,
  textEditorVal,
  textEditorOnChange,
}) => {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  // useEffect(() => {
  //     if (!reportFormData || reportFormData.length === 0) return;
  //     getAnswer(questionIds.lesionsr) === "" &&
  //         handleReportInputChange(questionIds.lesionsr, "Present");
  // }, []);

  useEffect(() => {
    if (!reportFormData || reportFormData.length === 0) return;
    textEditorOnChange(
      LesionsRightString(reportFormData, questionIds, textEditorVal)
    );
    console.log("Lesions Calling ?");
  }, [
    reportFormData.find((q) => q.questionId === questionIds.lesionsr)?.answer,
    reportFormData.find((q) => q.questionId === questionIds.simplecrstr)
      ?.answer,
    reportFormData.find((q) => q.questionId === questionIds.simplecrstDatar)
      ?.answer,
    reportFormData.find((q) => q.questionId === questionIds.complexcrstr)
      ?.answer,
    reportFormData.find((q) => q.questionId === questionIds.complexcrstDatar)
      ?.answer,
    reportFormData.find((q) => q.questionId === questionIds.Heterogeneousstr)
      ?.answer,
    reportFormData.find((q) => q.questionId === questionIds.HeterogeneousDatar)
      ?.answer,
    reportFormData.find((q) => q.questionId === questionIds.Hypertrophicstr)
      ?.answer,
    reportFormData.find((q) => q.questionId === questionIds.HypertrophicDatar)
      ?.answer,
    reportFormData.find((q) => q.questionId === questionIds.Otherstr)?.answer,
    reportFormData.find((q) => q.questionId === questionIds.OtherDatar)?.answer,
    reportFormData.find(
      (q) => q.questionId === questionIds.fibronodulardensitystr
    )?.answer,
    reportFormData.find(
      (q) => q.questionId === questionIds.fibronodulardensityDatar
    )?.answer,
    reportFormData.find((q) => q.questionId === questionIds.multipleCystsstr)
      ?.answer,
    reportFormData.find((q) => q.questionId === questionIds.multipleCystsDatar)
      ?.answer,
  ]);

  return (
    <div className="w-full">
      {/* <h1 className="text-3xl font-[500]" style={{ wordSpacing: "0.2em" }}>
                F. LESIONS (Right)
            </h1> */}
      <div className="flex gap-4 items-center mb-4">
        <div>
          <Checkbox2
            checked={getAnswer(questionIds.lesionsr) === "Present"}
            onCheckedChange={(checked) =>
              handleReportInputChange(
                questionIds.lesionsr,
                checked ? "Present" : ""
              )
            }
            className="w-5 h-5 mt-1"
          />
        </div>
        <Label
          className="font-semibold text-2xl flex flex-wrap lg:items-center"
          style={{ wordSpacing: "0.2em" }}
        >
          {label}
        </Label>
      </div>

      {getAnswer(questionIds.lesionsr) === "Present" && (
        <>
          <LesionsOptions
            reportFormData={reportFormData}
            handleReportInputChange={handleReportInputChange}
            LabelVal={"Simple Cyst"}
            mainQId={questionIds.simplecrstr}
            DataQId={questionIds.simplecrstDatar}
            textEditorVal={textEditorVal}
            textEditorOnChange={textEditorOnChange}
          />

          <LesionsOptions
            reportFormData={reportFormData}
            handleReportInputChange={handleReportInputChange}
            LabelVal={"Complex Cystic Structure"}
            mainQId={questionIds.complexcrstr}
            DataQId={questionIds.complexcrstDatar}
            textEditorVal={textEditorVal}
            textEditorOnChange={textEditorOnChange}
          />

          <LesionsOptions
            reportFormData={reportFormData}
            handleReportInputChange={handleReportInputChange}
            LabelVal={"Heterogeneous Tissue Prominence"}
            mainQId={questionIds.Heterogeneousstr}
            DataQId={questionIds.HeterogeneousDatar}
            textEditorVal={textEditorVal}
            textEditorOnChange={textEditorOnChange}
          />

          <LesionsOptions
            reportFormData={reportFormData}
            handleReportInputChange={handleReportInputChange}
            LabelVal={"Hypertrophic Tissue with Microcysts"}
            mainQId={questionIds.Hypertrophicstr}
            DataQId={questionIds.HypertrophicDatar}
            textEditorVal={textEditorVal}
            textEditorOnChange={textEditorOnChange}
          />

          <LesionsOptions
            reportFormData={reportFormData}
            handleReportInputChange={handleReportInputChange}
            LabelVal={"Fibronodular Density"}
            mainQId={questionIds.fibronodulardensitystr}
            DataQId={questionIds.fibronodulardensityDatar}
            textEditorVal={textEditorVal}
            textEditorOnChange={textEditorOnChange}
          />

          <LesionsOptions
            reportFormData={reportFormData}
            handleReportInputChange={handleReportInputChange}
            LabelVal={"Multiple Simple Cysts"}
            mainQId={questionIds.multipleCystsstr}
            DataQId={questionIds.multipleCystsDatar}
            textEditorVal={textEditorVal}
            textEditorOnChange={textEditorOnChange}
          />

          {/* <LesionsOptionsOther
                            reportFormData={reportFormData}
                            handleReportInputChange={handleReportInputChange}
                            LabelVal={"Others"}
                            mainQId={questionIds.Otherstr}
                            DataQId={questionIds.OtherDatar}
                        /> */}

          <LesionsOptions
            reportFormData={reportFormData}
            handleReportInputChange={handleReportInputChange}
            LabelVal={"Others"}
            mainQId={questionIds.Otherstr}
            DataQId={questionIds.OtherDatar}
            other={true}
            textEditorVal={textEditorVal}
            textEditorOnChange={textEditorOnChange}
          />
        </>
      )}
    </div>
  );
};

export default LisonsRight;
