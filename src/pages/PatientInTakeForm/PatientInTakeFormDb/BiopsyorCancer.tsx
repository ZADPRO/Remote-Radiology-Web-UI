import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import DatePicker from "@/components/date-picker";
import TwoOptionRadioGroup from "@/components/ui/CustomComponents/TwoOptionRadioGroup";
import ValidatedSelect from "../../../components/ui/CustomComponents/ValidatedSelect";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { IntakeOption } from "../MainInTakeForm";

interface QuestionIds {
  datediagnosis: number;
  typediagnosis: number;
  typediagnosisother: number;
  grade: number;
  stage: number;
  tumersize: number;
  breast: number;
  upperOuterQuadrant: number;
  upperInnerQuadrant: number;
  lowerOuterQuadrant: number;
  lowerInnerQuadrant: number;
  centralNippleOuterQuadrant: number;
  unknownQuadrant: number;
  clockposition: number;
  clockpositionstatus: number;
  distancenippleStatus: number;
  distancenipple: number;
  Lymph: number;
  positivenode: number;
  Metastasis: number;
  location: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const BiopsyorCancer: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader
        FormTitle="Biopsy or Cancer Diagnosis Details"
        className="uppercase"
      />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-6 pb-10">
        {/*A. Date of diagnosis */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 mt-2">
          <Label className="font-semibold text-base">
            A. Date of diagnosis <span className="text-red-500">*</span>
          </Label>
          <div className="w-45 ml-4 lg:ml-0">
            <DatePicker
              value={
                getAnswer(questionIds.datediagnosis)
                  ? new Date(getAnswer(questionIds.datediagnosis))
                  : undefined
              }
              onChange={(val) =>
                handleInputChange(
                  questionIds.datediagnosis,
                  val?.toLocaleDateString("en-CA") || ""
                )
              }
              required
            />
          </div>
        </div>

        {/*B. Interest in support resources*/}
        <div className="flex -mt-2 flex-col gap-4">
          <Label className="font-bold text-base">
            B. Type of diagnosis <span className="text-red-500">*</span>{" "}
          </Label>
          <div className="flex flex-col gap-5">
            {[
              "Ductal Carcinoma in Situ (DCIS)",
              "Invasive Ductal Carcinoma (IDC)",
              "Invasive Lobular Carcinoma (ILC)",
              "Inflammatory Breast Cancer",
              "Other",
              "Unknown",
            ].map((option) => (
              <div
                key={option}
                className="ml-4 flex gap-3 lg:gap-0 flex-col lg:flex-row space-x-2 h-[auto] lg:h-[20px]"
              >
                <div className="flex space-x-2">
                  <input
                    type="radio"
                    name="Type"
                    value={option}
                    checked={getAnswer(questionIds.typediagnosis) === option}
                    onChange={() =>
                      handleInputChange(questionIds.typediagnosis, option)
                    }
                    className="custom-radio"
                    id={option === "Other" ? "SupportOther" : option}
                    required
                  />
                  <Label
                    htmlFor={option === "Other" ? "SupportOther" : option}
                    className="w-[230px]"
                  >
                    {option}
                  </Label>
                </div>
                {option === "Other" &&
                  getAnswer(questionIds.typediagnosis) === "Other" && (
                    <Input
                      type="text"
                      value={getAnswer(questionIds.typediagnosisother)}
                      onChange={(e) =>
                        handleInputChange(
                          questionIds.typediagnosisother,
                          e.target.value
                        )
                      }
                      placeholder="Specify"
                      required
                      className="w-64 text-sm"
                    />
                  )}
              </div>
            ))}
          </div>
        </div>

        {/*C. Grade*/}
        <div className="flex -mt-2 flex-col gap-4">
          <Label className="font-bold text-base">C. Grade</Label>
          <div className="flex flex-row flex-wrap gap-5">
            {["1", "2", "3", "Unknown"].map((option) => (
              <div
                key={option}
                className="ml-4.5 flex items-center space-x-2 h-[20px]"
              >
                <input
                  type="radio"
                  name="Grade"
                  value={option}
                  checked={getAnswer(questionIds.grade) === option}
                  onChange={() => handleInputChange(questionIds.grade, option)}
                  className="custom-radio"
                  id={option === "Other" ? "SupportOther" : option}
                />
                <Label
                  htmlFor={option === "Other" ? "SupportOther" : option}
                  className="w-[50px]"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/*D. Stage*/}
        <div className="flex -mt-2 flex-col gap-4">
          <Label className="font-bold text-base">D. Stage</Label>
          <div className="flex flex-row flex-wrap gap-5">
            {["0", "I", "II", "III", "IV", "Unknown"].map((option) => (
              <div
                key={option}
                className="ml-4.5 flex items-center space-x-2 h-[20px]"
              >
                <input
                  type="radio"
                  name="stage"
                  value={option}
                  checked={getAnswer(questionIds.stage) === option}
                  onChange={() => handleInputChange(questionIds.stage, option)}
                  className="custom-radio"
                  id={option === "Other" ? "SupportOther" : option}
                />
                <Label
                  htmlFor={option === "Other" ? "SupportOther" : option}
                  className="w-[50px]"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/*E.Tumor size */}
        <div className="flex items-center gap-5 mt-2">
          <Label className="font-semibold text-base">E. Tumor size</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={getAnswer(questionIds.tumersize)}
              onChange={(e) =>
                handleInputChange(questionIds.tumersize, e.target.value)
              }
              className="w-20 text-sm"
              placeholder="Size"
            />
            <Label className="font-normal text-base">cm</Label>
          </div>
        </div>

        {/*F.Location of cancer*/}
        <div className="flex flex-col gap-4 -mt-2">
          <Label className="font-bold text-base">F. Location of cancer</Label>
          {/* a. Breast */}
          <div className="ml-4">
            <TwoOptionRadioGroup
              label="a. Breast"
              questionId={questionIds.breast}
              formData={formData}
              handleInputChange={handleInputChange}
              options={[
                { label: "Right", value: "Right" },
                { label: "Left", value: "Left" },
                { label: "Both", value: "Both" },
              ]}
              required
            />
          </div>
          {/* b. Quadrant */}
<div className="ml-4">
  <Label className="font-semibold text-base mb-2">b. Quadrant</Label>
  <div className="flex flex-col gap-3 mt-2 relative">

    {/* Upper Outer */}
    <div className="flex items-center space-x-3">
      <Checkbox2
        id="upperOuter"
        checked={getAnswer(questionIds.upperOuterQuadrant) === "true"}
        onCheckedChange={(checked) =>
          handleInputChange(questionIds.upperOuterQuadrant, checked ? "true" : "")
        }
      />
      <Label htmlFor="upperOuter">Upper Outer</Label>
    </div>

    {/* Upper Inner */}
    <div className="flex items-center space-x-3">
      <Checkbox2
        id="upperInner"
        checked={getAnswer(questionIds.upperInnerQuadrant) === "true"}
        onCheckedChange={(checked) =>
          handleInputChange(questionIds.upperInnerQuadrant, checked ? "true" : "")
        }
      />
      <Label htmlFor="upperInner">Upper Inner</Label>
    </div>

    {/* Lower Outer */}
    <div className="flex items-center space-x-3">
      <Checkbox2
        id="lowerOuter"
        checked={getAnswer(questionIds.lowerOuterQuadrant) === "true"}
        onCheckedChange={(checked) =>
          handleInputChange(questionIds.lowerOuterQuadrant, checked ? "true" : "")
        }
      />
      <Label htmlFor="lowerOuter">Lower Outer</Label>
    </div>

    {/* Lower Inner */}
    <div className="flex items-center space-x-3">
      <Checkbox2
        id="lowerInner"
        checked={getAnswer(questionIds.lowerInnerQuadrant) === "true"}
        onCheckedChange={(checked) =>
          handleInputChange(questionIds.lowerInnerQuadrant, checked ? "true" : "")
        }
      />
      <Label htmlFor="lowerInner">Lower Inner</Label>
    </div>

    {/* Central/Nipple Outer */}
    <div className="flex items-center space-x-3">
      <Checkbox2
        id="centralNippleOuter"
        checked={getAnswer(questionIds.centralNippleOuterQuadrant) === "true"}
        onCheckedChange={(checked) =>
          handleInputChange(questionIds.centralNippleOuterQuadrant, checked ? "true" : "")
        }
      />
      <Label htmlFor="centralNippleOuter">Central/Nipple Outer</Label>
    </div>

    { /* Unknown  */}
    <div className="flex items-center space-x-3">
                    <Checkbox2
                      id="unknownQuadrant"
                      checked={getAnswer(questionIds.unknownQuadrant) === "true"}
                      onCheckedChange={(checked) =>
                        handleInputChange(questionIds.unknownQuadrant, checked ? "true" : "")
                      }
                    />
                    <Label htmlFor="unknownQuadrant">Unknown</Label>
                  </div>
  </div>
</div>


          {/* c. Clock position */}
          <div className="ml-4">
            <div className="flex-col gap-4 relative">
              <Label className="font-semibold text-base">
                c. Clock position <span className="text-red-500">*</span>
              </Label>
              <div className=" ml-4.5 flex flex-col lg:flex-row mt-2 lg:mt-0 gap-0 lg:gap-5 h-[auto] lg:h-[50px]">
                <div className="flex flex-row flex-wrap items-start lg:items-center gap-3 lg:gap-5">
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      name="clockpostion"
                      checked={
                        getAnswer(questionIds.clockpositionstatus) === "Unknown"
                      }
                      onChange={() =>
                        handleInputChange(
                          questionIds.clockpositionstatus,
                          "Unknown"
                        )
                      }
                      className="custom-radio"
                      required
                    />
                    <Label className="font-semibold text-sm">Unknown</Label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      name="clockpostion"
                      checked={
                        getAnswer(questionIds.clockpositionstatus) === "known"
                      }
                      onChange={() =>
                        handleInputChange(
                          questionIds.clockpositionstatus,
                          "known"
                        )
                      }
                      className="custom-radio"
                    />
                    <Label className="font-semibold text-sm">known</Label>
                  </div>
                </div>
                {getAnswer(questionIds.clockpositionstatus) === "known" && (
                  <div className="mt-2 h-[50px]">
                    <ValidatedSelect
                      label=""
                      questionId={questionIds.clockposition}
                      formData={formData}
                      className="w-40"
                      placeholder="Select Position"
                      handleInputChange={handleInputChange}
                      options={[
                        { label: "1'o Clock", value: "1" },
                        { label: "2'o Clock", value: "2" },
                        { label: "3'o Clock", value: "3" },
                        { label: "4'o Clock", value: "4" },
                        { label: "5'o Clock", value: "5" },
                        { label: "6'o Clock", value: "6" },
                        { label: "7'o Clock", value: "7" },
                        { label: "8'o Clock", value: "8" },
                        { label: "9'o Clock", value: "9" },
                        { label: "10'o Clock", value: "10" },
                        { label: "11'o Clock", value: "11" },
                        { label: "12'o Clock", value: "12" },
                      ]}
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* d. Distance from nipple */}
          <div className="ml-4 -mt-2">
            <div className="flex-col gap-4 relative">
              <Label className="font-semibold text-base">
                d. Distance from nipple
              </Label>
              <div className=" ml-4.5 flex flex-col lg:flex-row mt-2 lg:mt-0 gap-0 lg:gap-5 h-[auto] lg:h-[50px]">
                <div className="flex flex-row flex-wrap items-start lg:items-center gap-3 lg:gap-5">
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      name="distancenipple"
                      checked={
                        getAnswer(questionIds.distancenippleStatus) ===
                        "Unknown"
                      }
                      onChange={() =>
                        handleInputChange(
                          questionIds.distancenippleStatus,
                          "Unknown"
                        )
                      }
                      className="custom-radio"
                    />
                    <Label className="font-semibold text-sm">Unknown</Label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      name="distancenipple"
                      checked={
                        getAnswer(questionIds.distancenippleStatus) === "known"
                      }
                      onChange={() =>
                        handleInputChange(
                          questionIds.distancenippleStatus,
                          "known"
                        )
                      }
                      className="custom-radio"
                    />
                    <Label className="font-semibold text-sm">known</Label>
                  </div>
                </div>
                {getAnswer(questionIds.distancenippleStatus) === "known" && (
                  <div className=" h-[50px] flex  items-center gap-3">
                    <Input
                      type="number"
                      className="w-30"
                      value={getAnswer(questionIds.distancenipple)}
                      onChange={(e) =>
                        handleInputChange(
                          questionIds.distancenipple,
                          e.target.value
                        )
                      }
                      placeholder="Specify"
                      required
                    />
                    <Label className="font-semibold text-sm">cm</Label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/*G. Lymph node involvement*/}
        <div className="flex flex-col gap-3 -mt-2">
          <MultiOptionRadioGroup
            label="G. Lymph node involvement"
            questionId={questionIds.Lymph}
            handleInputChange={handleInputChange}
            formData={formData}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
              { label: "Unknown", value: "Unknown" },
            ]}
            required
          />

          {getAnswer(questionIds.Lymph) === "Yes" && (
            <>
              <div className="ml-6 -mt-2">
                <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 mt-2">
                  <Label className="font-semibold text-sm">
                    If yes, number of positive nodes
                  </Label>
                  <div className="w-45">
                    <Input
                      type="number"
                      value={getAnswer(questionIds.positivenode)}
                      onChange={(e) =>
                        handleInputChange(
                          questionIds.positivenode,
                          e.target.value
                        )
                      }
                      required
                      className="w-64 text-sm"
                      placeholder="Specify"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/*H. Metastasis*/}
        <div className="flex flex-col gap-3">
          <MultiOptionRadioGroup
            label="H. Metastasis"
            questionId={questionIds.Metastasis}
            handleInputChange={handleInputChange}
            formData={formData}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
              { label: "Unknown", value: "Unknown" },
            ]}
            required
          />

          {getAnswer(questionIds.Metastasis) === "Yes" && (
            <>
              <div className="ml-6 -mt-2">
                <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 mt-2">
                  <Label className="font-semibold text-sm">
                    If yes, location(s)
                  </Label>
                  <div className="w-45">
                    <Input
                      type="text"
                      value={getAnswer(questionIds.location)}
                      onChange={(e) =>
                        handleInputChange(questionIds.location, e.target.value)
                      }
                      required
                      className="w-64 text-sm"
                      placeholder="Specify"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiopsyorCancer;
