import React from "react";
import { ReportQuestion } from "../Report";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import { Label } from "@/components/ui/label";
import GridNumberSelectorPopover from "@/components/ui/CustomComponents/GridNumberSelector";

interface QuestionIds {
  imageQuality: number;
  breastDensity: number;
  fibroglandularVolume: number;
  symmetry: number;
  nippleRetraction: number;
}

interface Props {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const BreastDensityandImageQualityRight: React.FC<Props> = ({
  questionIds,
  reportFormData,
  handleReportInputChange,
}) => {

  // const getAnswer = (id: number) =>
  //   reportFormData.find((q) => q.questionId === id)?.answer || "";
  return (
    <div className="w-full">
      <h1 className="text-3xl font-[500]" style={{ wordSpacing: "0.2em" }}>
        C. BREAST DENSITY & IMAGE QUALITY (Right)
      </h1>

      <div className="py-4 lg:px-10 space-y-4">
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

        <MultiRadioOptionalInputInline
          label="Breast Density"
          labelClassname="w-[12rem]"
          questionId={questionIds.breastDensity}
          formData={reportFormData}
          handleInputChange={handleReportInputChange}
          options={[
            { label: "Mostly Fatty", value: "Mostly Fatty" },
            { label: "Scattered Density", value: "Scattered Density" },
            { label: "Heterogeneously Dense", value: "Heterogeneously Dense" },
            { label: "Very Dense", value: "Very Dense" },
          ]}
        />

        <div className="flex ">
          <Label className="w-[12rem] font-semibold text-base">
            Fibroglandular Ratio
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
            { label: "None", value: "None" },
            { label: "Symmetric", value: "Symmetric" },
            { label: "Focal Asymmetry", value: "Focal Asymmetry" },
            { label: "Global Asymmetry", value: "Global Asymmetry" },
            { label: "Developing Asymmetry", value: "Developing Asymmetry" },
          ]}
        />

        <MultiRadioOptionalInputInline
          label="Nipple Retraction"
          labelClassname="w-[12rem]"
          questionId={questionIds.nippleRetraction}
          formData={reportFormData}
          handleInputChange={handleReportInputChange}
          options={[
            { label: "Present", value: "Present" },
            { label: "Absent", value: "Absent" },
          ]}
        />
      </div>
    </div>
  );
};

export default BreastDensityandImageQualityRight;
