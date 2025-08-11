import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import ValidatedSelect from "../../../components/ui/CustomComponents/ValidatedSelect";
import DatePicker from "@/components/date-picker";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { IntakeOption } from "../PatientInTakeForm";
import { dateDisablers } from "@/lib/dateUtils";

interface QuestionIds {
  abnormality: number;
  support: number;
  supportother: number;
  typeabnormalitymass: number;
  typeabnormalityarchi: number;
  typeabnormalitycal: number;
  typeabnormalityasym: number;
  typeabnormalitycyst: number;
  typeabnormalityfiboc: number;
  typeabnormalitymamo: number;
  typeabnormalityfiboa: number;
  typeabnormalityatyp: number;
  typeabnormalitother: number;
  typeabnormalitotherspe: number;
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
  sizeStatus: number;
  size: number;
  sizeunit: number;
  biradsCat: number;
  biradsCatOther: number;

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
  sizeStatusRight: number;
  sizeRight: number;
  sizeunitRight: number;
  biradsCatRight: number;
  biradsCatOtherRight: number;

  marker: number;
  markerother: number;
  magneticimplants: number;
  magneticimplantsother: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const AbnormalFindings: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  useEffect(() => {
    if (getAnswer(questionIds.sizeunit) == "") {
      handleInputChange(questionIds.sizeunit, "mm");
    }
  }, []);

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
      <Label className="font-semibold text-base">Quadrant</Label>
      <div className="flex flex-wrap gap-5 mt-2 pl-4">
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
              name={`quadrant-${prefix}`}
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
        Clock Position
      </Label>
      <div className="flex gap-4 items-center mt-2 pl-4">
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
        Distance from Nipple
      </Label>
      <div className="flex gap-4 items-center mt-2 pl-4">
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
              placeholder="Specify"
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


 const renderSizeOfAbnormalitySection = (
  prefix: string,
  statusId: number,
  valueId: number,
  unitId: number
) => {
  const isKnown = getAnswer(statusId) === "known";

  return (
    <div className="flex flex-col gap-1 ">
      <Label className="font-bold text-base">
        Size of abnormality
      </Label>
      <div className="flex flex-col lg:flex-row mt-2 gap-4">
        <div className="ml-4 flex gap-5 items-center">
          {["Unknown", "known"].map((val) => (
            <div className="flex gap-2 items-center" key={val}>
              <input
                type="radio"
                name={`sizeofab-${prefix}`}
                checked={getAnswer(statusId) === val}
                onChange={() => handleInputChange(statusId, val)}
                className="custom-radio"
              />
              <Label className="font-semibold text-sm">{val}</Label>
            </div>
          ))}
        </div>

        {isKnown && (
          <div className="flex gap-2 items-center ml-4 lg:ml-0">
            <Input
              type="number"
              className="w-20"
              value={getAnswer(valueId)}
              onChange={(e) => handleInputChange(valueId, e.target.value)}
              required
            />
            <ValidatedSelect
              label=""
              questionId={unitId}
              formData={formData}
              className="w-20 -mt-1"
              handleInputChange={handleInputChange}
              options={[
                { label: "mm", value: "mm" },
                { label: "cm", value: "cm" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const renderBiRadsSection = (
  prefix: string,
  categoryId: number,
  otherId: number
) => {
  const selected = getAnswer(categoryId);

  return (
    <div className="flex flex-col gap-1 ">
      <Label className="font-bold text-base">
        BI-RADS category assigned
      </Label>
      <div className="ml-4 mt-3 flex flex-row gap-3 flex-wrap">
        {["0", "3", "4a", "4b", "4c", "5", "Unknown", "Other"].map((option) => (
          <div key={option} className="flex items-center space-x-2 h-[20px]">
            <input
              type="radio"
              name={`birads-${prefix}`}
              value={option}
              checked={selected === option}
              onChange={() => handleInputChange(categoryId, option)}
              className="custom-radio"
              id={`${prefix}-${option}`}
            />
            <Label htmlFor={`${prefix}-${option}`} className="w-22">
              {option}
            </Label>
          </div>
        ))}
      </div>

      {selected === "Other" && (
        <div className="mt-3 pl-4">
          <Input
            type="text"
            value={getAnswer(otherId)}
            onChange={(e) => handleInputChange(otherId, e.target.value)}
            required
            className="w-64 text-sm"
            placeholder="If Other, Specify"
          />
        </div>
      )}
    </div>
  );
};

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="ABNORMAL FINDINGS(more details)" className="uppercase" />
      <div className={readOnly ? "pointer-events-none" : ""}>
      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-6 pb-10">
        {/*A. Date abnormality was detected */}
        <div className="flex flex-col lg:flex-row gap-2">
          <Label className="font-semibold text-base">
            A. Date abnormality was detected
          </Label>
          {/* <Input
                        className="w-64"
                        value={getAnswer(questionIds.abnormality)}
                        onChange={(e) =>
                            handleInputChange(questionIds.abnormality, e.target.value)
                        }
                    /> */}
          <div className="w-45 ml-4 lg:ml-0">
            <DatePicker
              value={
                getAnswer(questionIds.abnormality)
                  ? new Date(getAnswer(questionIds.abnormality))
                  : undefined
              }
              onChange={(val) =>
                handleInputChange(
                  questionIds.abnormality,
                  val?.toLocaleDateString("en-CA") || ""
                )
              }
              disabledDates={dateDisablers.noFuture}
            />
          </div>
        </div>

        {/* B. Method of detection */}
        <div className="flex -mt-2 flex-col gap-4">
          <Label className="font-bold text-base">B. Method of detection</Label>

          <div className="flex flex-col gap-3 lg:gap-0">
            {[
              "Self-examination",
              "Clinical examination",
              "Mammogram",
              "Ultrasound",
              "MRI",
              "Other",
            ].map((option) => {
              const selectedOptions = JSON.parse(
                getAnswer(questionIds.support) || "[]"
              ) as string[];
              const isChecked = selectedOptions.includes(option);

              const handleCheckboxChange = (checked: boolean) => {
                let updatedOptions = [...selectedOptions];
                if (checked) {
                  updatedOptions.push(option);
                } else {
                  updatedOptions = updatedOptions.filter(
                    (item) => item !== option
                  );
                }
                handleInputChange(
                  questionIds.support,
                  JSON.stringify(updatedOptions)
                );
              };

              return (
                <div
                  key={option}
                  className="ml-4 flex flex-col lg:flex-row space-x-2 h-auto lg:h-[40px]"
                >
                  <div className="flex space-x-2 items-center">
                    <Checkbox2
                      id={option === "Other" ? "SupportOther" : option}
                      checked={isChecked}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label
                      htmlFor={option === "Other" ? "SupportOther" : option}
                      className="w-[160px]"
                    >
                      {option}
                    </Label>
                  </div>

                  {/* Show text input when 'Other' is selected */}
                  {option === "Other" && isChecked && (
                    <Input
                      type="text"
                      value={getAnswer(questionIds.supportother)}
                      onChange={(e) =>
                        handleInputChange(
                          questionIds.supportother,
                          e.target.value
                        )
                      }
                      required
                      className="w-64 text-sm mt-3 lg:mt-0"
                      placeholder="Specify"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/*C. Type of abnormality (check all that apply)*/}
        <div className="flex-col gap-4 relative">
          <Label className="font-semibold text-base">
            C. Type of abnormality (check all that apply)
          </Label>
          <div className="ml-4 flex flex-col space-x-2 gap-1 mt-3">
            <div className="flex gap-3 h-[40px] items-center">
              <Checkbox2
                checked={getAnswer(questionIds.typeabnormalitymass) === "true"}
                onClick={() =>
                  handleInputChange(
                    questionIds.typeabnormalitymass,
                    getAnswer(questionIds.typeabnormalitymass) === "true"
                      ? ""
                      : "true"
                  )
                }
              />
              <Label>Mass/Nodule</Label>
            </div>
            <div className="flex gap-3 h-[40px] items-center">
              <Checkbox2
                checked={getAnswer(questionIds.typeabnormalityarchi) === "true"}
                onClick={() =>
                  handleInputChange(
                    questionIds.typeabnormalityarchi,
                    getAnswer(questionIds.typeabnormalityarchi) === "true"
                      ? ""
                      : "true"
                  )
                }
              />
              <Label>
                Architectural distortion
              </Label>
            </div>
            <div className="flex gap-3 h-[40px] items-center">
              <Checkbox2
                checked={getAnswer(questionIds.typeabnormalitycal) === "true"}
                onClick={() =>
                  handleInputChange(
                    questionIds.typeabnormalitycal,
                    getAnswer(questionIds.typeabnormalitycal) === "true"
                      ? ""
                      : "true"
                  )
                }
              />
             <Label>Calcifications</Label>
            </div>
            <div className="flex gap-3 h-[40px] items-center">
              <Checkbox2
                checked={getAnswer(questionIds.typeabnormalityasym) === "true"}
                onClick={() =>
                  handleInputChange(
                    questionIds.typeabnormalityasym,
                    getAnswer(questionIds.typeabnormalityasym) === "true"
                      ? ""
                      : "true"
                  )
                }
              />
             <Label>Asymmetry</Label>
            </div>
            <div className="flex gap-3 h-[40px] items-center">
              <Checkbox2
                checked={getAnswer(questionIds.typeabnormalitycyst) === "true"}
                onClick={() =>
                  handleInputChange(
                    questionIds.typeabnormalitycyst,
                    getAnswer(questionIds.typeabnormalitycyst) === "true"
                      ? ""
                      : "true"
                  )
                }
              />
              <Label>Cyst</Label>
            </div>
            <div className="flex gap-3 h-[40px] items-center">
              <Checkbox2
                checked={getAnswer(questionIds.typeabnormalityfiboc) === "true"}
                onClick={() =>
                  handleInputChange(
                    questionIds.typeabnormalityfiboc,
                    getAnswer(questionIds.typeabnormalityfiboc) === "true"
                      ? ""
                      : "true"
                  )
                }
              />
              <Label>
                Fibrocystic changes
              </Label>
            </div>
            <div className="flex gap-3 h-[40px] items-center">
              <Checkbox2
                checked={getAnswer(questionIds.typeabnormalitymamo) === "true"}
                onClick={() =>
                  handleInputChange(
                    questionIds.typeabnormalitymamo,
                    getAnswer(questionIds.typeabnormalitymamo) === "true"
                      ? ""
                      : "true"
                  )
                }
              />
             <Label>Mammogram</Label>
            </div>
            <div className="flex gap-3 h-[40px] items-center">
              <Checkbox2
                checked={getAnswer(questionIds.typeabnormalityfiboa) === "true"}
                onClick={() =>
                  handleInputChange(
                    questionIds.typeabnormalityfiboa,
                    getAnswer(questionIds.typeabnormalityfiboa) === "true"
                      ? ""
                      : "true"
                  )
                }
              />
             <Label>Fibroadenomas</Label>
            </div>
            <div className="flex gap-3 items-center h-[40px]">
              <Checkbox2
                checked={getAnswer(questionIds.typeabnormalityatyp) === "true"}
                onClick={() =>
                  handleInputChange(
                    questionIds.typeabnormalityatyp,
                    getAnswer(questionIds.typeabnormalityatyp) === "true"
                      ? ""
                      : "true"
                  )
                }
              />
             <Label>
                Atypical Hyperplasia
              </Label>
            </div>
            <div className="flex flex-col lg:flex-row gap-1 h-[auto] lg:h-[40px]">
              <div className="flex gap-3 items-center h-[40px]">
                <Checkbox2
                  checked={
                    getAnswer(questionIds.typeabnormalitother) === "true"
                  }
                  onClick={() =>
                    handleInputChange(
                      questionIds.typeabnormalitother,
                      getAnswer(questionIds.typeabnormalitother) === "true"
                        ? ""
                        : "true"
                    )
                  }
                />
                <Label className="w-57.5">Other</Label>
              </div>
              {getAnswer(questionIds.typeabnormalitother) === "true" && (
                <Input
                  type="text"
                  value={getAnswer(questionIds.typeabnormalitotherspe)}
                  onChange={(e) =>
                    handleInputChange(
                      questionIds.typeabnormalitotherspe,
                      e.target.value
                    )
                  }
                  required
                  className="w-44 lg:w-64 text-sm"
                  placeholder="Specify"
                />
              )}
            </div>
          </div>
        </div>

        {/*D. Location of abnormality*/}
        <div className="flex flex-col gap-4 -mt-2">
          <Label className="font-bold text-base">
            D. Location of abnormality
          </Label>

          {/* a. Breast Selection */}
          <div className="ml-4">
            {/* <Label className="font-semibold text-base mb-2">a. Breast</Label> */}
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
                <Label htmlFor="breastRight">Right Breast</Label>
              </div>
              {/* --- RIGHT SIDE DETAILS --- */}
              {getAnswer(questionIds.breastRight) === "true" && (
                <div className="ml-6 flex flex-col gap-4 border-b-2 border-gray-200 pb-4">
                  {/* <Label className="font-semibold text-base">
                    Right Side Details
                  </Label> */}
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
                 {renderClockPositionSection("Right", questionIds.clockpositionstatusRight, questionIds.clockpositionRight)}


                  {/* Distance from Nipple */}
                  {renderDistanceFromNippleSection("Right", questionIds.distancenippleStatusRight, questionIds.distancenippleRight)}


                  {/* E. Size of Abnormality (Right) */}
                  {renderSizeOfAbnormalitySection("Right", questionIds.sizeStatusRight, questionIds.sizeRight, questionIds.sizeunitRight)}


                  {/* F. BI-RADS Category (Right) */}
                  {renderBiRadsSection("Right", questionIds.biradsCatRight, questionIds.biradsCatOtherRight)}

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
                <Label htmlFor="breastLeft">Left Breast</Label>
              </div>
              {/* --- LEFT SIDE DETAILS --- */}
              {getAnswer(questionIds.breast) === "true" && (
                <div className="ml-6 flex flex-col gap-4">
                  {/* <Label className="font-semibold text-base">
                    Left Side Details
                  </Label> */}
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
                  {renderClockPositionSection("Left", questionIds.clockpositionstatus, questionIds.clockposition)}


                  {/* Distance from Nipple */}
                  {renderDistanceFromNippleSection("Left", questionIds.distancenippleStatus, questionIds.distancenipple)}


                  {/* E. Size of Abnormality (Left) */}
                  {renderSizeOfAbnormalitySection("Left", questionIds.sizeStatus, questionIds.size, questionIds.sizeunit)}


                  {/* F. BI-RADS Category (Left) */}
                  {renderBiRadsSection("Left", questionIds.biradsCat, questionIds.biradsCatOther)}

                </div>
              )}
            </div>
          </div>
        </div>

        {/* G. Marker (Fiducial) / Magnetic implants [pacemaker] */}
        <LabeledRadioWithOptionalInput
          name="marker"
          label="E.  Clip / Marker (Fiducial)"
          questionId={questionIds.marker}
          optionalInputQuestionId={questionIds.markerother}
          formData={formData}
          handleInputChange={handleInputChange}
          options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
          showInputWhenValue="Yes"
          // inputPlaceholder=""
        />

        {/* H. Magnetic implants [pacemaker] */}
        <LabeledRadioWithOptionalInput
          name="magneticimplants"
          label="F. Magnetic implants (pacemaker)"
          questionId={questionIds.magneticimplants}
          optionalInputQuestionId={questionIds.magneticimplantsother}
          formData={formData}
          handleInputChange={handleInputChange}
          options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
          showInputWhenValue="Yes"
          // inputPlaceholder=""
        />
      </div>
      </div>
    </div>
  );
};

export default AbnormalFindings;
