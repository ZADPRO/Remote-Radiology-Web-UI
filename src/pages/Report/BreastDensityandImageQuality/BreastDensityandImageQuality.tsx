import React, { useEffect } from "react";
import { ReportQuestion } from "../Report";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import { Label } from "@/components/ui/label";
import GridNumberSelectorPopover from "@/components/ui/CustomComponents/GridNumberSelector";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";

interface QuestionIds {
  imageQuality: number;
  breastDensity: number;
  fibroglandularVolume: number;
  symmetry: number;
  breastSelect: number;
}

interface Props {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  label: string;
}

const BreastDensityandImageQuality: React.FC<Props> = ({
  questionIds,
  reportFormData,
  handleReportInputChange,
  label,
}) => {

  const getAnswer = (id: number) => reportFormData.find((q) => q.questionId === id)?.answer || "";

  useEffect(() => {
    if (!reportFormData || reportFormData.length === 0) return;
    getAnswer(questionIds.breastSelect) === "" && handleReportInputChange(questionIds.breastSelect, "Present");
    getAnswer(questionIds.imageQuality) === "" && handleReportInputChange(questionIds.imageQuality, "Acceptable");
    getAnswer(questionIds.breastDensity) === "" && handleReportInputChange(questionIds.breastDensity, "Heterogeneously Dense");
    getAnswer(questionIds.symmetry) === "" && handleReportInputChange(questionIds.symmetry, "Symmetry");
  }, [])

  return (
    <div className="w-full">
      <div className="flex gap-4 items-center mb-4">
        <div>
          <Checkbox2
            checked={getAnswer(questionIds.breastSelect) === "Present"}
            onCheckedChange={(checked) =>
              handleReportInputChange(
                questionIds.breastSelect,
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

      {getAnswer(questionIds.breastSelect) === "Present" && (
        <div className="py-4 lg:px-10 space-y-4">
          <MultiRadioOptionalInputInline
            label="Breast Density"
            labelClassname="w-[12rem]"
            questionId={questionIds.breastDensity}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Mostly Fatty", value: "Mostly Fatty" },
              { label: "Scattered Density", value: "Scattered Density" },
              {
                label: "Heterogeneously Dense",
                value: "Heterogeneously Dense",
              },
              { label: "Very Dense", value: "Very Dense" },
            ]}
          />

          <div className="flex ">
            <Label className="w-[12rem] font-semibold text-base">
              Fibroglandular Volume
            </Label>
            <GridNumberSelectorPopover
              questionId={questionIds.fibroglandularVolume}
              handleInputChange={handleReportInputChange}
            />
          </div>

          <MultiRadioOptionalInputInline
            label="Symmetry"
            labelClassname="w-[12rem]"
            questionId={questionIds.symmetry}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Symmetry", value: "Symmetry" },
              { label: "Asymmetry", value: "Asymmetry" },
              { label: "Focal Asymmetry", value: "Focal Asymmetry" },
              { label: "Global Asymmetry", value: "Global Asymmetry" },
              { label: "Developing Asymmetry", value: "Developing Asymmetry" },
            ]}
          />

          <MultiRadioOptionalInputInline
            label="Image Quality"
            labelClassname="w-[12rem]"
            questionId={questionIds.imageQuality}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Acceptable", value: "Acceptable" },
              { label: "Artifacts Present", value: "Artifacts Present" },
              { label: "Poor", value: "Poor" },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default BreastDensityandImageQuality;
