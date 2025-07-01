import React from "react";
import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import DatePicker from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { IntakeOption } from "../MainInTakeForm";

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
  implantDate: number;
  explants: number;
  explantsDate: number;
  denseBreasts: number;
  additionalComments: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const PersonalMedicalHistory: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  console.log(formData);
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";
  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="PERSONAL MEDICAL HISTORY" className="uppercase" />

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
                getAnswer(questionIds[item.id as keyof QuestionIds]) === "true";
              return (
                <div key={item.id} className="flex items-center gap-4 h-[20px]">
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
                    </div>
                  )}
                </div>
              );
            })}
            <div className="flex items-center gap-2 h-[20px]">
              <Checkbox2
                // id={questionIds.breastSurgeryOthers}
                checked={getAnswer(questionIds.breastSurgeryOthers) === "true"}
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium">If Yes,</Label>
                  <div className="flex gap-4 flex-wrap">
                    {["Saline", "Silicone", "Other"].map((value) => {
                      const id = `implants-${value.toLowerCase()}`;
                      return (
                        <div
                          key={value}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            className="custom-radio"
                            id={id}
                            name="implantsSpecify"
                            value={value}
                            checked={
                              getAnswer(questionIds.implantsSpecify) === value
                            }
                            onChange={(e) =>
                              handleInputChange(
                                questionIds.implantsSpecify,
                                e.target.value
                              )
                            }
                            required
                          />
                          <Label htmlFor={id}>{value}</Label>
                        </div>
                      );
                    })}

                    <div className="flex items-center gap-2">
                      {/* If OTHER selected, show text input */}
                    {getAnswer(questionIds.implantsSpecify) === "Other" && (
                      <div className="flex items-center gap-2">
                        <Input
                          id="implants-others-specify"
                          placeholder="Please Specify"
                          className="lg:w-48"
                          value={getAnswer(questionIds.implantsOthersSpecify)}
                          onChange={(e) =>
                            handleInputChange(
                              questionIds.implantsOthersSpecify,
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                    )}

                    {/* Date Pickers */}
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Duration in Months"
                        className="lg:w-48"
                        value={
                          getAnswer(questionIds.implantDate)
                        }
                        onChange={(e) => handleInputChange(questionIds.implantDate, e.target.value)}
                      />
                    </div>
                    </div>

                    
                  </div>
                </div>

                <div className="flex items-center gap-2 h-[40px]">
                  <div className="flex items-center gap-4 relative">
                    <Checkbox2
                      id="explants"
                      value={getAnswer(questionIds.explants)}
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
                    <Label htmlFor="explants">Explants</Label>
                  </div>
                  {getAnswer(questionIds.explants) === "true" && (
                    <div className="flex items-center gap-2">
                      <DatePicker
                        placeholder="Explants Done On"
                        value={
                          getAnswer(questionIds.explantsDate)
                            ? new Date(getAnswer(questionIds.explantsDate))
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
              handleInputChange(questionIds.additionalComments, e.target.value)
            }
            placeholder="Enter Details"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalMedicalHistory;
