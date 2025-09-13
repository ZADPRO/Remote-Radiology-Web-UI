import React from "react";
import FormHeader from "../FormHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Textarea } from "@/components/ui/textarea";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { IntakeOption } from "../PatientInTakeForm";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import DatePicker from "@/components/date-picker";
import { dateDisablers, parseLocalDate } from "@/lib/dateUtils";
import TextEditor from "@/components/TextEditor";
import { PatientHistoryReportGenerator } from "@/pages/Report/GenerateReport/PatientHistoryReportGenerator";

interface QuestionIds {
  previousSurgiries: number;
  mastectomy: number;
  mastectomyPosition: number;
  mastectomyDate: number;
  mastectomyDateAnother: number;
  lumpectomy: number;
  lumpectomyPosition: number;
  lumpectomyDate: number;
  lumpectomyDateAnother: number;
  cystAspiration: number;
  cystAspirationPosition: number;
  cystAspirationDate: number;
  cystAspirationDateAnother: number;
  breastReconstruction: number;
  breastReconstructionPosition: number;
  breastReconstructionDate: number;
  breastReconstructionDateAnother: number;
  augmentation: number;
  augmentationposition: number;
  augmentationDate: number;
  augmentationDateAnother: number;
  breastSurgeryOthers: number;
  breastSurgeryOthersSpecify: number;
  breastSurgeryOthersSpecifyDirection: number;
  breastSurgeryOthersDate: number;
  breastSurgeryOthersDateAnother: number;
  implants: number;
  implantsSpecify: number;
  implantsSpecifyBoth: number;
  implantsOthersSpecify: number;
  implantsOthersSpecifyBoth: number;
  implantLeft: number;
  implantDateLeft: number;
  implantDateBoth: number;
  implantRight: number;
  implantDateRight: number;
  implantsRightSpecify: number;
  implantsRightOthersSpecify: number;
  implantBothDirection: number;
  explants: number;
  explantsBoth: number;
  explantsDate: number;
  explantsDateBoth: number;
  explantsDateKnown: number;
  explantsDateKnownRight: number;
  explantsDateKnownBoth: number;
  denseBreasts: number;
  additionalComments: number;
  explantsRight: number;
  explantsDateRight: number;
  explantsDateRightKnown: number;
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
  readOnly,
}) => {
  console.log(formData);
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";
  return (
    <div className="flex flex-col h-full relative">
      <FormHeader FormTitle="PERSONAL MEDICAL HISTORY" className="uppercase" />
      <div className="bg-[#fff]">
        {
          <TextEditor
            value={PatientHistoryReportGenerator(formData)}
            readOnly={true}
          />
        }
      </div>
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
                  dateId: "mastectomyDate",
                  dateIdAnother: "mastectomyDateAnother",
                },
                {
                  label: "Lumpectomy",
                  id: "lumpectomy",
                  posId: "lumpectomyPosition",
                  dateId: "lumpectomyDate",
                  dateIdAnother: "lumpectomyDateAnother",
                },
                {
                  label: "Cyst Aspiration",
                  id: "cystAspiration",
                  posId: "cystAspirationPosition",
                  dateId: "cystAspirationDate",
                  dateIdAnother: "cystAspirationDateAnother",
                },
                {
                  label: "Breast Reconstruction",
                  id: "breastReconstruction",
                  posId: "breastReconstructionPosition",
                  dateId: "breastReconstructionDate",
                  dateIdAnother: "breastReconstructionDateAnother",
                },
                {
                  label: "Augmentation",
                  id: "augmentation",
                  posId: "augmentationposition",
                  dateId: "augmentationDate",
                  dateIdAnother: "augmentationDateAnother",
                },
              ].map((item) => {
                const checked =
                  getAnswer(questionIds[item.id as keyof QuestionIds]) ===
                  "true";
                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-4"
                  >
                    {/* Checkbox + Label */}
                    <div className="flex items-center gap-2 min-w-[180px]">
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
                      <Label className="whitespace-nowrap" htmlFor={item.id}>
                        {item.label}
                      </Label>
                    </div>

                    {checked && (
                      <>
                        {/* Radio buttons */}
                        <div className="flex flex-wrap gap-4">
                          {["Right", "Left", "Both"].map((pos) => (
                            <div
                              className="flex items-center space-x-2"
                              key={`${item.id}-${pos}`}
                            >
                              <input
                                type="radio"
                                id={`${item.id}-${pos.toLowerCase()}`}
                                name={`position-${item.id}`}
                                value={pos}
                                checked={
                                  getAnswer(
                                    questionIds[item.posId as keyof QuestionIds]
                                  ) === pos
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    questionIds[
                                      item.posId as keyof QuestionIds
                                    ],
                                    e.target.value
                                  )
                                }
                                className="custom-radio"
                                required
                              />
                              <Label
                                htmlFor={`${item.id}-${pos.toLowerCase()}`}
                              >
                                {pos}
                              </Label>
                            </div>
                          ))}
                        </div>

                        {/* Date Picker */}
                        <div className="flex flex-wrap gap-3">
                          <div className="flex-1 flex gap-2 min-w-50 max-w-60">
                            {getAnswer(
                              questionIds[item.posId as keyof QuestionIds]
                            ) === "Both" && <Label>R-</Label>}
                            <Input
                              value={getAnswer(
                                questionIds[item.dateId as keyof QuestionIds]
                              )}
                              onChange={(e) => {
                                handleInputChange(
                                  questionIds[item.dateId as keyof QuestionIds],
                                  e.target.value || ""
                                );
                              }}
                              required
                              placeholder="Date / Duration"
                            />
                          </div>

                          {getAnswer(
                            questionIds[item.posId as keyof QuestionIds]
                          ) === "Both" && (
                            <div className="flex-1 flex gap-2 min-w-50 max-w-60">
                              <Label>L-</Label>
                              <Input
                                value={getAnswer(
                                  questionIds[
                                    item.dateIdAnother as keyof QuestionIds
                                  ]
                                )}
                                onChange={(e) => {
                                  handleInputChange(
                                    questionIds[
                                      item.dateIdAnother as keyof QuestionIds
                                    ],
                                    e.target.value || ""
                                  );
                                }}
                                placeholder="Date / Duration"
                                required
                              />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Others */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Checkbox + Label */}
                <div className="flex items-center gap-2 min-w-[100px]">
                  <Checkbox2
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
                  <Label className="whitespace-nowrap">Others</Label>
                </div>

                {/* When Others is checked */}
                {getAnswer(questionIds.breastSurgeryOthers) === "true" && (
                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 flex-1">
                    {/* Specify input */}
                    <div className="flex flex-col sm:flex-row gap-2 flex-1 min-w-[200px]">
                      <Label className="text-sm font-medium">Specify</Label>
                      <Input
                        value={getAnswer(
                          questionIds.breastSurgeryOthersSpecify
                        )}
                        onChange={(e) =>
                          handleInputChange(
                            questionIds.breastSurgeryOthersSpecify,
                            e.target.value
                          )
                        }
                        className="flex-1"
                        required
                      />
                    </div>

                    {/* Radio buttons */}
                    <div className="flex flex-wrap items-center gap-4">
                      {["Right", "Left", "Both"].map((pos) => (
                        <div className="flex items-center space-x-2" key={pos}>
                          <input
                            type="radio"
                            id={`other-${pos.toLowerCase()}`}
                            name={`position-other`}
                            value={pos}
                            checked={
                              getAnswer(
                                questionIds.breastSurgeryOthersSpecifyDirection
                              ) === pos
                            }
                            onChange={(e) =>
                              handleInputChange(
                                questionIds.breastSurgeryOthersSpecifyDirection,
                                e.target.value
                              )
                            }
                            className="custom-radio"
                            required
                          />
                          <Label htmlFor={`other-${pos.toLowerCase()}`}>
                            {pos}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {/* Date picker */}
                      <div className="flex-1 flex gap-2 min-w-[230px] max-w-[230px]">
                        {getAnswer(
                          questionIds.breastSurgeryOthersSpecifyDirection
                        ) === "Both" && <Label>R-</Label>}
                        <DatePicker
                          value={
                            getAnswer(questionIds.breastSurgeryOthersDate)
                              ? parseLocalDate(
                                  getAnswer(questionIds.breastSurgeryOthersDate)
                                )
                              : undefined
                          }
                          onChange={(e) =>
                            handleInputChange(
                              questionIds.breastSurgeryOthersDate,
                              e?.toLocaleDateString("en-CA") || ""
                            )
                          }
                          disabledDates={dateDisablers.noFuture}
                          required
                        />
                      </div>
                      {getAnswer(
                        questionIds.breastSurgeryOthersSpecifyDirection
                      ) === "Both" && (
                        <div className="flex-1 flex gap-2 min-w-[230px] max-w-[230px]">
                          <Label>L-</Label>
                          <DatePicker
                            value={
                              getAnswer(
                                questionIds.breastSurgeryOthersDateAnother
                              )
                                ? parseLocalDate(
                                    getAnswer(
                                      questionIds.breastSurgeryOthersDateAnother
                                    )
                                  )
                                : undefined
                            }
                            onChange={(e) =>
                              handleInputChange(
                                questionIds.breastSurgeryOthersDateAnother,
                                e?.toLocaleDateString("en-CA") || ""
                              )
                            }
                            disabledDates={dateDisablers.noFuture}
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <MultiOptionRadioGroup
              label="B. Breast Implants"
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

                    {/* Both Checkbox */}
                    <div className="flex items-center gap-4 mt-4">
                      <Checkbox2
                        id="implantBoth"
                        checked={
                          getAnswer(questionIds.implantBothDirection) === "true"
                        }
                        onCheckedChange={(checked) => {
                          const value = checked ? "true" : "false";
                          handleInputChange(
                            questionIds.implantBothDirection,
                            value
                          );
                          handleInputChange(questionIds.implantLeft, "false");
                          handleInputChange(questionIds.implantRight, "false");
                        }}
                      />
                      <Label htmlFor="implantBoth">Both</Label>
                    </div>

                    {getAnswer(questionIds.implantBothDirection) === "true" && (
                      <>
                        <div className="pl-4 space-y-2 border-gray-400">
                          <Label className="mb-4 font-semibold">Left</Label>
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
                                    onChange={(e) => {
                                      handleInputChange(
                                        questionIds.implantsSpecify,
                                        e.target.value
                                      );
                                    }}
                                    required
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
                                onChange={(e) => {
                                  handleInputChange(
                                    questionIds.implantsOthersSpecify,
                                    e.target.value
                                  );
                                }}
                                required
                              />
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="Date / Duration"
                              className="lg:w-38"
                              value={getAnswer(questionIds.implantDateLeft)}
                              onChange={(e) => {
                                handleInputChange(
                                  questionIds.implantDateLeft,
                                  e.target.value
                                );
                              }}
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <MultiRadioOptionalInputInline
                                label="Explants"
                                questionId={questionIds.explants}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                options={[
                                  { label: "No", value: "No" },
                                  { label: "Yes", value: "Yes" },
                                ]}
                                className="w-auto"
                              />
                            </div>

                            {getAnswer(questionIds.explants) === "Yes" && (
                              <div className="flex flex-wrap flex-col lg:flex-row gap-1 lg:gap-4 w-full">
                                <MultiRadioOptionalInputInline
                                  label="Is the date known?"
                                  questionId={questionIds.explantsDateKnown}
                                  formData={formData}
                                  handleInputChange={handleInputChange}
                                  options={[
                                    { label: "No", value: "No" },
                                    { label: "Yes", value: "Yes" },
                                  ]}
                                  className="w-auto"
                                />

                                {getAnswer(questionIds.explantsDateKnown) ===
                                  "Yes" && (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="text"
                                      placeholder="Date / Duration"
                                      className="lg:w-38"
                                      value={getAnswer(
                                        questionIds.explantsDate
                                      )}
                                      onChange={(e) =>
                                        handleInputChange(
                                          questionIds.explantsDate,
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="border-b-2 border-b-gray-300 w-1/3"></div>

                        <div className="pl-4 space-y-2 border-gray-400">
                          <Label className="mb-4 font-semibold">Right</Label>
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
                                    required
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
                                required
                              />
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="Date / Duration"
                              className="lg:w-38"
                              value={getAnswer(questionIds.implantDateRight)}
                              onChange={(e) => {
                                handleInputChange(
                                  questionIds.implantDateRight,
                                  e.target.value
                                );
                              }}
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <MultiRadioOptionalInputInline
                              label="Explants"
                              questionId={questionIds.explantsRight}
                              formData={formData}
                              handleInputChange={handleInputChange}
                              options={[
                                { label: "No", value: "No" },
                                { label: "Yes", value: "Yes" },
                              ]}
                              className="w-auto"
                            />
                            {getAnswer(questionIds.explantsRight) === "Yes" && (
                              <div className="flex flex-wrap gap-1 lg:gap-4 w-full">
                                <MultiRadioOptionalInputInline
                                  label="Is the date known?"
                                  questionId={
                                    questionIds.explantsDateKnownRight
                                  }
                                  formData={formData}
                                  handleInputChange={handleInputChange}
                                  options={[
                                    { label: "No", value: "No" },
                                    { label: "Yes", value: "Yes" },
                                  ]}
                                  className="w-auto"
                                />

                                {getAnswer(
                                  questionIds.explantsDateKnownRight
                                ) === "Yes" && (
                                  <div className="flex gap-2">
                                    <Input
                                      type="text"
                                      placeholder="Date / Duration"
                                      className="lg:w-38"
                                      value={getAnswer(
                                        questionIds.explantsDateRight
                                      )}
                                      onChange={(e) => {
                                        handleInputChange(
                                          questionIds.explantsDateRight,
                                          e.target.value
                                        );
                                      }}
                                      required
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="border-b-2 border-b-gray-300 w-1/3"></div>

                    {/* Left Checkbox */}
                    <div className="flex items-center gap-4">
                      <Checkbox2
                        id="implantLeft"
                        checked={getAnswer(questionIds.implantLeft) === "true"}
                        onCheckedChange={() => {
                          handleInputChange(
                            questionIds.implantLeft,
                            getAnswer(questionIds.implantLeft) === "true"
                              ? "false"
                              : "true"
                          );
                        }}
                        required={
                          getAnswer(questionIds.implants) === "Yes" &&
                          ((getAnswer(questionIds.implantLeft) === "true" &&
                            getAnswer(questionIds.implantRight) === "true") ||
                            (getAnswer(questionIds.implantLeft) !== "true" &&
                              getAnswer(questionIds.implantRight) !== "true"))
                        }
                        disabled={
                          getAnswer(questionIds.implantBothDirection) === "true"
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
                                  onChange={(e) => {
                                    handleInputChange(
                                      questionIds.implantsSpecify,
                                      e.target.value
                                    );
                                  }}
                                  required
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
                              onChange={(e) => {
                                handleInputChange(
                                  questionIds.implantsOthersSpecify,
                                  e.target.value
                                );
                              }}
                              required
                            />
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Date / Duration"
                            className="lg:w-38"
                            value={getAnswer(questionIds.implantDateLeft)}
                            onChange={(e) => {
                              handleInputChange(
                                questionIds.implantDateLeft,
                                e.target.value
                              );
                            }}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <MultiRadioOptionalInputInline
                              label="Explants"
                              questionId={questionIds.explants}
                              formData={formData}
                              handleInputChange={handleInputChange}
                              options={[
                                { label: "No", value: "No" },
                                { label: "Yes", value: "Yes" },
                              ]}
                              className="w-auto"
                            />
                          </div>

                          {getAnswer(questionIds.explants) === "Yes" && (
                            <div className="flex flex-wrap flex-col lg:flex-row gap-1 lg:gap-4 w-full">
                              <MultiRadioOptionalInputInline
                                label="Is the date known?"
                                questionId={questionIds.explantsDateKnown}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                options={[
                                  { label: "No", value: "No" },
                                  { label: "Yes", value: "Yes" },
                                ]}
                                className="w-auto"
                              />

                              {getAnswer(questionIds.explantsDateKnown) ===
                                "Yes" && (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="text"
                                    placeholder="Date / Duration"
                                    className="lg:w-38"
                                    value={getAnswer(questionIds.explantsDate)}
                                    onChange={(e) =>
                                      handleInputChange(
                                        questionIds.explantsDate,
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                </div>
                              )}
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
                        onCheckedChange={() => {
                          handleInputChange(
                            questionIds.implantRight,
                            getAnswer(questionIds.implantRight) === "true"
                              ? "false"
                              : "true"
                          );
                        }}
                        required={
                          getAnswer(questionIds.implants) === "Yes" &&
                          ((getAnswer(questionIds.implantLeft) === "true" &&
                            getAnswer(questionIds.implantRight) === "true") ||
                            (getAnswer(questionIds.implantLeft) !== "true" &&
                              getAnswer(questionIds.implantRight) !== "true"))
                        }
                        disabled={
                          getAnswer(questionIds.implantBothDirection) === "true"
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
                                  required
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
                              required
                            />
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Date / Duration"
                            className="lg:w-38"
                            value={getAnswer(questionIds.implantDateRight)}
                            onChange={(e) => {
                              handleInputChange(
                                questionIds.implantDateRight,
                                e.target.value
                              );
                            }}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <MultiRadioOptionalInputInline
                            label="Explants"
                            questionId={questionIds.explantsRight}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            options={[
                              { label: "No", value: "No" },
                              { label: "Yes", value: "Yes" },
                            ]}
                            className="w-auto"
                          />
                          {getAnswer(questionIds.explantsRight) === "Yes" && (
                            <div className="flex flex-wrap gap-1 lg:gap-4 w-full">
                              <MultiRadioOptionalInputInline
                                label="Is the date known?"
                                questionId={questionIds.explantsDateKnownRight}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                options={[
                                  { label: "No", value: "No" },
                                  { label: "Yes", value: "Yes" },
                                ]}
                                className="w-auto"
                              />

                              {getAnswer(questionIds.explantsDateKnownRight) ===
                                "Yes" && (
                                <div className="flex gap-2">
                                  <Input
                                    type="text"
                                    placeholder="Date / Duration"
                                    className="lg:w-38"
                                    value={getAnswer(
                                      questionIds.explantsDateRight
                                    )}
                                    onChange={(e) => {
                                      handleInputChange(
                                        questionIds.explantsDateRight,
                                        e.target.value
                                      );
                                    }}
                                    required
                                  />
                                </div>
                              )}
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
