import React from "react";
import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import DatePicker from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
  previousSurgiries: number;
  mastectomy: number;
  mastectomyPosition: number;
  lumpectomy: number;
  lumpectomyPosition: number;
  cystAspiration: number;
  cystAspirationPosition: number;
  breastReconstruction: number;
  breastReconstructionPosition: number;
  augmentation: number;
  augmentationposition: number;
  breastSurgeryOthers: number;
  breastSurgeryOthersSpecify: number;
  implants: number;
  implantsSpecify: number;
  implantsOthersSpecify: number;
  explants: number;
  explantsDate: number;
  denseBreasts: number;
  additionalComments: number;
  implantLeft: number;
  implantDateLeft: number
  implantRight: number;
  implantDateRight: number;
  implantsRightSpecify: number,
  implantsRightOthersSpecify: number,
  explantsRight: number,
  explantsDateRight: number,
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const PersonalMedicalHistory: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly
}) => {
  console.log(formData);
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";
  return (
    <div className="flex flex-col h-full relative">
      <FormHeader FormTitle="PERSONAL MEDICAL HISTORY" className="uppercase" />
      <div className={readOnly ? "pointer-events-none" : ""}>
        <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-8 pb-10">
          <MultiOptionRadioGroup
            label="A. Previous breast surgeries?"
            required
            questionId={questionIds.previousSurgiries}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
          />

          {getAnswer(questionIds.previousSurgiries) === "Yes" && (
            <div className="space-y-4 pl-4">
              <Label className="text-sm font-medium">If Yes,</Label>

              {[
                {
                  label: "Mastectomy",
                  id: "mastectomy",
                  posId: "mastectomyPosition",
                },
                {
                  label: "Lumpectomy",
                  id: "lumpectomy",
                  posId: "lumpectomyPosition",
                },
                {
                  label: "Cyst Aspiration",
                  id: "cystAspiration",
                  posId: "cystAspirationPosition",
                },
                {
                  label: "Breast Reconstruction",
                  id: "breastReconstruction",
                  posId: "breastReconstructionPosition",
                },
                {
                  label: "Augmentation",
                  id: "augmentation",
                  posId: "augmentationposition",
                },
              ].map((item) => {
                const checked =
                  getAnswer(questionIds[item.id as keyof QuestionIds]) ===
                  "true";
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 h-[20px]"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox2
                        id={item.id}
                        checked={checked}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            questionIds[item.id as keyof QuestionIds],
                            checked ? "true" : "false"
                          )
                        }
                      />
                      <Label className="w-[150px]" htmlFor={item.id}>
                        {item.label}
                      </Label>
                    </div>

                    {checked && (
                      <div className="flex items-center gap-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${item.id}-right`}
                            name={`position-${item.id}`} // Group radios by unique name
                            value="Right"
                            checked={
                              getAnswer(
                                questionIds[item.posId as keyof QuestionIds]
                              ) === "Right"
                            }
                            onChange={(e) =>
                              handleInputChange(
                                questionIds[item.posId as keyof QuestionIds],
                                e.target.value
                              )
                            }
                            className="custom-radio"
                            required
                          />
                          <Label htmlFor={`${item.id}-right`}>Right</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${item.id}-left`}
                            name={`position-${item.id}`}
                            value="Left"
                            checked={
                              getAnswer(
                                questionIds[item.posId as keyof QuestionIds]
                              ) === "Left"
                            }
                            onChange={(e) =>
                              handleInputChange(
                                questionIds[item.posId as keyof QuestionIds],
                                e.target.value
                              )
                            }
                            className="custom-radio"
                            required
                          />
                          <Label htmlFor={`${item.id}-left`}>Left</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${item.id}-both`}
                            name={`position-${item.id}`}
                            value="Both"
                            checked={
                              getAnswer(
                                questionIds[item.posId as keyof QuestionIds]
                              ) === "Both"
                            }
                            onChange={(e) =>
                              handleInputChange(
                                questionIds[item.posId as keyof QuestionIds],
                                e.target.value
                              )
                            }
                            className="custom-radio"
                            required
                          />
                          <Label htmlFor={`${item.id}-both`}>Both</Label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="flex items-center gap-2 h-[20px]">
                <Checkbox2
                  // id={questionIds.breastSurgeryOthers}
                  checked={
                    getAnswer(questionIds.breastSurgeryOthers) === "true"
                  }
                  onCheckedChange={(checked) =>
                    handleInputChange(
                      questionIds.breastSurgeryOthers,
                      checked ? "true" : "false"
                    )
                  }
                />
                <Label className="w-[150px]">Others</Label>
                {getAnswer(questionIds.breastSurgeryOthers) === "true" && (
                  <>
                    <Label className="text-sm font-medium pl-2">Specify</Label>
                    <Input
                      value={getAnswer(questionIds.breastSurgeryOthersSpecify)}
                      onChange={(e) =>
                        handleInputChange(
                          questionIds.breastSurgeryOthersSpecify,
                          e.target.value
                        )
                      }
                      className="w-48"
                      required
                    />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <MultiOptionRadioGroup
              label="B. Implants"
              required
              questionId={questionIds.implants}
              formData={formData}
              handleInputChange={handleInputChange}
              options={[
                { label: "No", value: "No" },
                { label: "Yes", value: "Yes" },
              ]}
            />

            <div className="pl-4 flex flex-col gap-4">
              {getAnswer(questionIds.implants) === "Yes" && (
                <>
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">If Yes,</Label>

                    {/* Left Checkbox */}
                    <div className="flex items-center gap-4">
                      <Checkbox2
                        id="implantLeft"
                        checked={getAnswer(questionIds.implantLeft) === "true"}
                        onCheckedChange={() =>
                          handleInputChange(
                            questionIds.implantLeft,
                            getAnswer(questionIds.implantLeft) === "true"
                              ? "false"
                              : "true"
                          )
                        }
                      />
                      <Label htmlFor="implantLeft">Left</Label>
                    </div>

                    {/* Left Implant Details */}
                    {getAnswer(questionIds.implantLeft) === "true" && (
                      <div className="pl-4 space-y-2 border-gray-400">
                        <div className="flex flex-wrap gap-4">
                          {["Saline", "Silicone", "Other"].map((value) => {
                            const id = `implants-left-${value.toLowerCase()}`;
                            return (
                              <div
                                key={value}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="radio"
                                  id={id}
                                  name="implantsLeftSpecify"
                                  value={value}
                                  className="custom-radio"
                                  checked={
                                    getAnswer(questionIds.implantsSpecify) ===
                                    value
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      questionIds.implantsSpecify,
                                      e.target.value
                                    )
                                  }
                                />
                                <Label htmlFor={id}>{value}</Label>
                              </div>
                            );
                          })}
                          {getAnswer(questionIds.implantsSpecify) ===
                            "Other" && (
                            <Input
                              placeholder="Please specify"
                              value={getAnswer(
                                questionIds.implantsOthersSpecify
                              )}
                              className="w-64"
                              onChange={(e) =>
                                handleInputChange(
                                  questionIds.implantsOthersSpecify,
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </div>

                        <Input
                          placeholder="Duration in Months"
                          className="lg:w-48"
                          value={getAnswer(questionIds.implantDateLeft)}
                          onChange={(e) =>
                            handleInputChange(
                              questionIds.implantDateLeft,
                              e.target.value
                            )
                          }
                        />

                        <div className="flex items-center gap-2">
                          <Checkbox2
                            id="explantsLeft"
                            checked={getAnswer(questionIds.explants) === "true"}
                            onCheckedChange={() =>
                              handleInputChange(
                                questionIds.explants,
                                getAnswer(questionIds.explants) === "true"
                                  ? "false"
                                  : "true"
                              )
                            }
                          />
                          <Label htmlFor="explantsLeft">Explants</Label>
                          {getAnswer(questionIds.explants) === "true" && (
                            <div className="w-64">
                                <DatePicker
                              placeholder="Explants Done On"
                              value={
                                getAnswer(questionIds.explantsDate)
                                  ? new Date(
                                      getAnswer(questionIds.explantsDate)
                                    )
                                  : undefined
                              }
                              onChange={(val) =>
                                handleInputChange(
                                  questionIds.explantsDate,
                                  val?.toLocaleDateString("en-CA") || ""
                                )
                              }
                            />
                            </div>
                            
                          )}
                        </div>
                      </div>
                    )}

                    <div className="border-b-2 border-b-gray-300 w-1/3"></div>
                    {/* Right Checkbox */}
                    <div className="flex items-center gap-4 mt-4">
                      <Checkbox2
                        id="implantRight"
                        checked={getAnswer(questionIds.implantRight) === "true"}
                        onCheckedChange={() =>
                          handleInputChange(
                            questionIds.implantRight,
                            getAnswer(questionIds.implantRight) === "true"
                              ? "false"
                              : "true"
                          )
                        }
                      />
                      <Label htmlFor="implantRight">Right</Label>
                    </div>

                    {/* Right Implant Details */}
                    {getAnswer(questionIds.implantRight) === "true" && (
                      <div className="pl-4 space-y-2 border-gray-400">
                        <div className="flex flex-wrap gap-4">
                          {["Saline", "Silicone", "Other"].map((value) => {
                            const id = `implants-right-${value.toLowerCase()}`;
                            return (
                              <div
                                key={value}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="radio"
                                  id={id}
                                  name="implantsRightSpecify"
                                  className="custom-radio"
                                  value={value}
                                  checked={
                                    getAnswer(
                                      questionIds.implantsRightSpecify
                                    ) === value
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      questionIds.implantsRightSpecify,
                                      e.target.value
                                    )
                                  }
                                />
                                <Label htmlFor={id}>{value}</Label>
                              </div>
                            );
                          })}
                          {getAnswer(questionIds.implantsRightSpecify) ===
                            "Other" && (
                            <Input
                              placeholder="Please specify"
                              value={getAnswer(
                                questionIds.implantsRightOthersSpecify
                              )}
                              className="w-64"
                              onChange={(e) =>
                                handleInputChange(
                                  questionIds.implantsRightOthersSpecify,
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </div>

                        <Input
                          placeholder="Duration in Months"
                          className="lg:w-48"
                          value={getAnswer(questionIds.implantDateRight)}
                          onChange={(e) =>
                            handleInputChange(
                              questionIds.implantDateRight,
                              e.target.value
                            )
                          }
                        />

                        <div className="flex items-center gap-2">
                          <Checkbox2
                            id="explantsRight"
                            checked={
                              getAnswer(questionIds.explantsRight) === "true"
                            }
                            onCheckedChange={() =>
                              handleInputChange(
                                questionIds.explantsRight,
                                getAnswer(questionIds.explantsRight) === "true"
                                  ? "false"
                                  : "true"
                              )
                            }
                          />
                          <Label htmlFor="explantsRight">Explants</Label>
                          {getAnswer(questionIds.explantsRight) === "true" && (
                            <div className="w-64">
                                <DatePicker
                              placeholder="Explants Done On"
                              value={
                                getAnswer(questionIds.explantsDateRight)
                                  ? new Date(
                                      getAnswer(questionIds.explantsDateRight)
                                    )
                                  : undefined
                              }
                              onChange={(val) =>
                                handleInputChange(
                                  questionIds.explantsDateRight,
                                  val?.toLocaleDateString("en-CA") || ""
                                )
                              }
                            />
                            </div>
                            
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <MultiOptionRadioGroup
              label="C. Do you have dense breasts (per previous imaging)?"
              required
              questionId={questionIds.denseBreasts}
              formData={formData}
              handleInputChange={handleInputChange}
              options={[
                { label: "No", value: "No" },
                { label: "Yes", value: "Yes" },
                { label: "Unknown", value: "Unknown" },
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Label className="font-semibold text-base flex flex-wrap gap-1">
              D. Others / Additional Comments
            </Label>
            <Textarea
              className="w-full lg:w-64"
              value={getAnswer(questionIds.additionalComments)}
              onChange={(e) =>
                handleInputChange(
                  questionIds.additionalComments,
                  e.target.value
                )
              }
              placeholder="Enter Details"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalMedicalHistory;
