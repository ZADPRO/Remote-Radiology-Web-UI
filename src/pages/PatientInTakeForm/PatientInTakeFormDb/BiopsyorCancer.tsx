import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import DatePicker from "@/components/date-picker";
import ValidatedSelect from "../../../components/ui/CustomComponents/ValidatedSelect";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
  datediagnosis: number;
  typediagnosis: number;
  typediagnosisother: number;
  grade: number;
  stage: number;
  tumersize: number;
  breast: number;
  breastRight: number;
  upperOuterQuadrant: number;
  upperInnerQuadrant: number;
  lowerOuterQuadrant: number;
  lowerInnerQuadrant: number;
  centralNippleOuterQuadrant: number;
  unknownQuadrant: number;
  clockpositionstatus: number;
  clockposition: number;
  distancenippleStatus: number;
  distancenipple: number;

  upperOuterQuadrantRight: number;
  upperInnerQuadrantRight: number;
  lowerOuterQuadrantRight: number;
  lowerInnerQuadrantRight: number;
  centralNippleOuterQuadrantRight: number;
  unknownQuadrantRight: number;
  clockpositionstatusRight: number;
  clockpositionRight: number;
  distancenippleStatusRight: number;
  distancenippleRight: number;
  Lymph: number;
  positivenode: number;
  Metastasis: number;
  location: number;

  LymphRight: number;
  positivenodeRight: number;
  MetastasisRight: number;
  locationRight: number;
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

  const renderQuadrantSection = (
    prefix: string,
    questionIds: {
      upperOuter: number;
      upperInner: number;
      lowerOuter: number;
      lowerInner: number;
      centralNipple: number;
      unknown: number;
    }
  ) => {
    return (
      <div>
        <Label className="font-semibold text-base">{prefix} - Quadrant</Label>
        <div className="flex flex-wrap gap-5 mt-2">
          {[
            ["Upper Outer", questionIds.upperOuter],
            ["Upper Inner", questionIds.upperInner],
            ["Lower Outer", questionIds.lowerOuter],
            ["Lower Inner", questionIds.lowerInner],
            ["Central/Nipple Outer", questionIds.centralNipple],
            ["Unknown", questionIds.unknown],
          ].map(([label, id]) => (
            <div className="flex items-center gap-3" key={label}>
              <Checkbox2
                checked={getAnswer(id as number) === "true"}
                onCheckedChange={(checked) =>
                  handleInputChange(id as number, checked ? "true" : "")
                }
              />
              <Label>{label}</Label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClockPositionSection = (
    prefix: string,
    statusId: number,
    valueId: number
  ) => {
    const isKnown = getAnswer(statusId) === "known";

    return (
      <div>
        <Label className="font-semibold text-base">
          {prefix} - Clock Position
        </Label>
        <div className="flex gap-4 items-center mt-2">
          {["Unknown", "known"].map((val) => (
            <div className="flex items-center gap-2" key={val}>
              <input
                type="radio"
                name={`clock-${prefix}`}
                checked={getAnswer(statusId) === val}
                onChange={() => handleInputChange(statusId, val)}
                className="custom-radio"
              />
              <Label className="text-sm font-semibold">{val}</Label>
            </div>
          ))}

          {isKnown && (
            <ValidatedSelect
              label=""
              questionId={valueId}
              formData={formData}
              className="w-30"
              handleInputChange={handleInputChange}
              options={Array.from({ length: 12 }, (_, i) => ({
                label: `${i + 1}'o Clock`,
                value: `${i + 1}`,
              }))}
              required
            />
          )}
        </div>
      </div>
    );
  };

  const renderDistanceFromNippleSection = (
    prefix: string,
    statusId: number,
    valueId: number
  ) => {
    const isKnown = getAnswer(statusId) === "known";

    return (
      <div>
        <Label className="font-semibold text-base">
          {prefix} - Distance from Nipple
        </Label>
        <div className="flex gap-4 items-center mt-2">
          {["Unknown", "known"].map((val) => (
            <div className="flex items-center gap-2" key={val}>
              <input
                type="radio"
                name={`distance-${prefix}`}
                checked={getAnswer(statusId) === val}
                onChange={() => handleInputChange(statusId, val)}
                className="custom-radio"
              />
              <Label className="text-sm font-semibold">{val}</Label>
            </div>
          ))}

          {isKnown && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                className="w-30"
                value={getAnswer(valueId)}
                onChange={(e) => handleInputChange(valueId, e.target.value)}
                required
              />
              <Label className="text-sm font-semibold">cm</Label>
            </div>
          )}
        </div>
      </div>
    );
  };

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
            <Label className="font-semibold text-base mb-2">a. Breast</Label>
            <div className="flex flex-col items-start gap-4 relative">
              <div className="flex items-center gap-2">
                <Checkbox2
                  name="breastRight"
                  checked={getAnswer(questionIds.breastRight) === "true"}
                  onCheckedChange={(checked) =>
                    handleInputChange(
                      questionIds.breastRight,
                      checked ? "true" : ""
                    )
                  }
                />
                <Label htmlFor="breastRight">Right</Label>
              </div>
              {/* --- RIGHT SIDE DETAILS --- */}
              {getAnswer(questionIds.breastRight) === "true" && (
                <div className="ml-6 flex flex-col gap-4 border-b-2 border-gray-200 pb-4">
                  <Label className="font-semibold text-base">
                    Right Side Details
                  </Label>
                  {/* Quadrant */}
                  {renderQuadrantSection("Right", {
                    upperOuter: questionIds.upperOuterQuadrantRight,
                    upperInner: questionIds.upperInnerQuadrantRight,
                    lowerOuter: questionIds.lowerOuterQuadrantRight,
                    lowerInner: questionIds.lowerInnerQuadrantRight,
                    centralNipple: questionIds.centralNippleOuterQuadrantRight,
                    unknown: questionIds.unknownQuadrantRight,
                  })}

                  {/* Clock Position */}
                  {renderClockPositionSection(
                    "Right",
                    questionIds.clockpositionstatusRight,
                    questionIds.clockpositionRight
                  )}

                  {/* Distance from Nipple */}
                  {renderDistanceFromNippleSection(
                    "Right",
                    questionIds.distancenippleStatusRight,
                    questionIds.distancenippleRight
                  )}

                  {/*G. Lymph node involvement*/}
                  <div className="flex flex-col gap-3">
                    <MultiOptionRadioGroup
                      label="Lymph node involvement"
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

                    {getAnswer(questionIds.LymphRight) === "Yes" && (
                      <>
                        <div className="ml-6 -mt-2">
                          <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 mt-2">
                            <Label className="font-semibold text-sm">
                              If yes, number of positive nodes
                            </Label>
                            <div className="w-45">
                              <Input
                                type="number"
                                value={getAnswer(questionIds.positivenodeRight)}
                                onChange={(e) =>
                                  handleInputChange(
                                    questionIds.positivenodeRight,
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
                      label="Metastasis"
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
                                  handleInputChange(
                                    questionIds.location,
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
                </div>
              )}
              <div className="flex items-center gap-2">
                <Checkbox2
                  name="breastLeft"
                  checked={getAnswer(questionIds.breast) === "true"}
                  onCheckedChange={(checked) =>
                    handleInputChange(questionIds.breast, checked ? "true" : "")
                  }
                />
                <Label htmlFor="breastLeft">Left</Label>
              </div>
              {/* --- LEFT SIDE DETAILS --- */}
              {getAnswer(questionIds.breast) === "true" && (
                <div className="ml-6 flex flex-col gap-4">
                  <Label className="font-semibold text-base">
                    Left Side Details
                  </Label>
                  {/* Quadrant */}
                  {renderQuadrantSection("Left", {
                    upperOuter: questionIds.upperOuterQuadrant,
                    upperInner: questionIds.upperInnerQuadrant,
                    lowerOuter: questionIds.lowerOuterQuadrant,
                    lowerInner: questionIds.lowerInnerQuadrant,
                    centralNipple: questionIds.centralNippleOuterQuadrant,
                    unknown: questionIds.unknownQuadrant,
                  })}

                  {/* Clock Position */}
                  {renderClockPositionSection(
                    "Left",
                    questionIds.clockpositionstatus,
                    questionIds.clockposition
                  )}

                  {/* Distance from Nipple */}
                  {renderDistanceFromNippleSection(
                    "Left",
                    questionIds.distancenippleStatus,
                    questionIds.distancenipple
                  )}

                  {/*G. Lymph node involvement*/}
                  <div className="flex flex-col gap-3 -mt-2">
                    <MultiOptionRadioGroup
                      label="Lymph node involvement"
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
                      label="Metastasis"
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
                                  handleInputChange(
                                    questionIds.location,
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiopsyorCancer;
