import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import TwoOptionRadioGroup from "@/components/ui/CustomComponents/TwoOptionRadioGroup";
import ValidatedSelect from "../../../components/ui/CustomComponents/ValidatedSelect";
import DatePicker from "@/components/date-picker";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { IntakeOption } from "../MainInTakeForm";

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
  marker: number;
  markerother: number;
  magneticimplants: number;
  magneticimplantsother: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const AbnormalFindings: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  useEffect(() => {
    if(getAnswer(questionIds.sizeunit)  == "") {
      handleInputChange(questionIds.sizeunit, 'mm');
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="ABNORMAL FINDINGS" className="uppercase" />

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
            />
          </div>
        </div>

        {/*B. Method of detection*/}
        <div className="flex -mt-2 flex-col gap-4">
          <Label className="font-bold text-base">
            B. Method of detection
          </Label>
          <div className="flex flex-col gap-3 lg:gap-0">
            {[
              "Self-examination",
              "Clinical examination",
              "Mammogram",
              "Ultrasound",
              "MRI",
              "Other",
              "None",
            ].map((option) => (
              <div
                key={option}
                className="ml-4 flex flex-col lg:flex-row space-x-2 h-[auto] lg:h-[40px]"
              >
                <div className="flex space-x-2 items-center">
                  <input
                    type="radio"
                    name="support"
                    value={option}
                    checked={getAnswer(questionIds.support) === option}
                    onChange={() =>
                      handleInputChange(questionIds.support, option)
                    }
                    className="custom-radio"
                    id={option === "Other" ? "SupportOther" : option}
                  />
                  <Label
                    htmlFor={option === "Other" ? "SupportOther" : option}
                    className="w-[160px]"
                  >
                    {option}
                  </Label>
                </div>
                {option === "Other" &&
                  getAnswer(questionIds.support) === "Other" && (
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
            ))}
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
              <div className="font-semibold text-base w-52">Mass/Nodule</div>
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
              <div className="font-semibold text-base w-52">
                Architectural distortion
              </div>
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
              <div className="font-semibold text-base w-52">Calcifications</div>
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
              <div className="font-semibold text-base w-52">Asymmetry</div>
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
              <div className="font-semibold text-bas w-52e">Cyst</div>
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
              <div className="font-semibold text-base w-52">
                Fibrocystic changes
              </div>
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
              <div className="font-semibold text-base w-52">Mammogram</div>
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
              <div className="font-semibold text-base w-52">Fibroadenomas</div>
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
              <div className="font-semibold text-base w-52">
                Atypical Hyperplasia
              </div>
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
                <div className="font-semibold text-base w-57.5">Other</div>
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
                c. Clock position
              </Label>
              <div className=" ml-4 mt-2 mb-3 lg:mb-0 lg:mt-0 flex flex-col lg:flex-row items-start lg:items-center gap-2 h-[auto] lg:h-[40px]">
                <div className="flex gap-5">
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
                      className="w-30"
                      placeholder=""
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
                    // placeholder="Country Code"
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
              <div className=" ml-4 mt-2 mb-3 lg:mb-0 lg:mt-0 flex flex-col lg:flex-row items-start lg:items-center gap-2 h-[auto] lg:h-[40px]">
                <div className="flex gap-5">
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
                  <div className=" mt-2 h-[50px] flex justify-center items-center gap-3">
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
                      required
                    />
                    <Label className="font-semibold text-sm">cm</Label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/*E. Size of abnormality*/}
        <div className="flex flex-col gap-1">
          <Label className="font-bold text-base">E. Size of abnormality</Label>
          <div className=" flex flex-col lg:flex-row mt-2 h-[auto] lg:h-[40px] gap-4 ">
            <div className="ml-4 flex gap-5 items-center">
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="sizeofab"
                  checked={getAnswer(questionIds.sizeStatus) === "Unknown"}
                  onChange={() =>
                    handleInputChange(questionIds.sizeStatus, "Unknown")
                  }
                  className="custom-radio"
                />
                <Label className="font-semibold text-sm">Unknown</Label>
              </div>
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="sizeofab"
                  checked={getAnswer(questionIds.sizeStatus) === "known"}
                  onChange={() =>
                    handleInputChange(questionIds.sizeStatus, "known")
                  }
                  className="custom-radio"
                />
                <Label className="font-semibold text-sm">known</Label>
              </div>
            </div>
            {getAnswer(questionIds.sizeStatus) === "known" && (
              <div className="flex gap-2 h-[40px] ml-4 lg:ml-0 items-center">
                <Input
                  type="number"
                  className="w-20"
                  value={getAnswer(questionIds.size)}
                  onChange={(e) =>
                    handleInputChange(questionIds.size, e.target.value)
                  }
                  required
                />
                <ValidatedSelect
                  label=""
                  questionId={questionIds.sizeunit}
                  formData={formData}
                  className="w-20 -mt-1"
                  handleInputChange={handleInputChange}
                  options={[
                    { label: "mm", value: "mm" },
                    { label: "cm", value: "cm" },
                  ]}
                // placeholder="Country Code"
                />
              </div>
            )}
          </div>
        </div>

        {/*F. BI-RADS category assigned (if known)*/}
        <div className="flex flex-col gap-1 ">
          <Label className="font-bold text-base">
            F. BI-RADS category assigned (if known)
          </Label>
          <div className="ml-4 mt-3 flex flex-row gap-3 flex-wrap">
            {["0", "3", "4a", "4b", "4c", "5", "Unknown", "Other"].map((option) => (
              <div
                key={option}
                className="flex items-center space-x-2 h-[20px]"
              >
                <input
                  type="radio"
                  name="birads"
                  value={option}
                  checked={getAnswer(questionIds.biradsCat) === option}
                  onChange={() =>
                    handleInputChange(questionIds.biradsCat, option)
                  }
                  className="custom-radio"
                  id={option === "Other" ? "SupportOther" : option}
                />
                <Label
                  htmlFor={option === "Other" ? "SupportOther" : option}
                  className="w-22"
                >
                  {option}
                </Label>
              </div>
              
            ))}
          </div>

          <div className="mt-3 pl-4">
                 { getAnswer(questionIds.biradsCat) === "Other" && (
                    <Input
                      type="text"
                      value={getAnswer(questionIds.biradsCatOther)}
                      onChange={(e) =>
                        handleInputChange(
                          questionIds.biradsCatOther,
                          e.target.value
                        )
                      }
                      required
                      className="w-64 text-sm mt-3 lg:mt-0"
                      placeholder="If Other, Specify"
                      />
                  )}
              </div>
        </div>

        {/* G. Marker (Fiducial) / Magnetic implants [pacemaker] */}
        <LabeledRadioWithOptionalInput
            name="marker"
            label="G.  Clip / Marker (Fiducial)"
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
            label="H. Magnetic implants (pacemaker)"
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
  );
};

export default AbnormalFindings;
