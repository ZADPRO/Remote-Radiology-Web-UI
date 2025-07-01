import React from "react";
import FormHeader from "../FormHeader";
import TwoOptionRadioGroup from "@/components/ui/CustomComponents/TwoOptionRadioGroup";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { IntakeOption } from "../MainInTakeForm";

interface QuestionIds {
  treatmentstatus: number;
  Surgical: number;
  surgery: number;
  successfulStatus: number;
  successful: number;
  Mastectomy: number;
  Bilateral: number;
  Sentinel: number;
  Axillary: number;
  Reconstruction: number;
  ReconstructionType: number;
  Neoadjuvant: number;
  Chemotherapy: number;
  Hormonal: number;
  outcome: number;
  outcomeDuration: number;
  outcomeSpecify: number;
  Targeted: number;
  Immunotherapy: number;
  NeoAxillary: number;
  Radiation: number;
  Adjuvant: number;
  AdjChemotherapy: number;
  AdjHormonal: number;
  AdjTargeted: number;
  AdjImmunotherapy: number;
  AdjRadiation: number;
  Treatmenttimeline: number;
  sideeffects: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const Treatment: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="Treatment" className="uppercase" />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-6 pb-10">
        {/* Treatment */}
        <TwoOptionRadioGroup
          label="A. Have you under gone Treatment?"
          questionId={questionIds.treatmentstatus}
          formData={formData}
          handleInputChange={handleInputChange}
          options={[
            { label: "No", value: "No" },
            { label: "Yes", value: "Yes" },
          ]}
        />

        <div className="flex flex-col gap-2 -mt-2 ml-4">
          {getAnswer(questionIds.treatmentstatus) === "Yes" && (
            <>
              <div className="flex mt-3 flex-col gap-2 lg:gap-0">
                {/* A.Surgical approach */}
                <MultiOptionRadioGroup
                  label="a. Surgical approach"
                  questionId={questionIds.Surgical}
                  formData={formData}
                  //   className="flex flex-col lg:flex-row gap-3 mt-4"
                  handleInputChange={handleInputChange}
                  options={[
                    { label: "Not Applicable", value: "Not Applicable" },
                    { label: "Done", value: "Done" },
                    { label: "Planned", value: "Planned" },
                  ]}
                />
                {(getAnswer(questionIds.Surgical) === "Done" ||
                  getAnswer(questionIds.Surgical) === "Planned") && (
                  <>
                    {/* Lumpectomy/Breast-conserving surgery */}
                    <div className="ml-4.5 mt-0 lg:mt-2 flex gap-3 h-[auto] lg:h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.surgery) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.surgery,
                            getAnswer(questionIds.surgery) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm ">
                        Lumpectomy/Breast-conserving surgery
                      </div>
                    </div>

                    {/* Was the surgery successful in removing all of the tumor? */}
                    <div className="ml-4.5 flex flex-col lg:flex-row gap-3 h-[auto] lg:h-[40px] items-start lg:items-center">
                      <div className="flex gap-3">
                        <Checkbox2
                          checked={
                            getAnswer(questionIds.successfulStatus) === "true"
                          }
                          onClick={() =>
                            handleInputChange(
                              questionIds.successfulStatus,
                              getAnswer(questionIds.successfulStatus) === "true"
                                ? ""
                                : "true"
                            )
                          }
                        />
                        <div className="font-semibold text-sm ">
                          Was the surgery successful in removing all of the
                          tumor?
                        </div>
                      </div>
                      {getAnswer(questionIds.successfulStatus) === "true" && (
                        <MultiOptionRadioGroup
                          questionId={questionIds.successful}
                          handleInputChange={handleInputChange}
                          formData={formData}
                          options={[
                            { label: "No", value: "No" },
                            { label: "Yes", value: "Yes" },
                          ]}
                          required
                          className="mt-0 flex-row"
                        />
                      )}
                    </div>

                    {/*Mastectomy (Partial or Segmental) */}
                    <div className="ml-4.5 flex gap-3  h-[auto] lg:h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.Mastectomy) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.Mastectomy,
                            getAnswer(questionIds.Mastectomy) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm ">
                        Mastectomy (Partial or Segmental)
                      </div>
                    </div>

                    {/*Bilateral mastectomy */}
                    <div className="ml-4.5 flex gap-3  h-[auto] lg:h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.Bilateral) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.Bilateral,
                            getAnswer(questionIds.Bilateral) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm ">
                        Bilateral mastectomy
                      </div>
                    </div>

                    {/* Sentinel lymph node biopsy */}
                    <div className="ml-4.5 flex gap-3 h-[auto] lg:h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.Sentinel) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.Sentinel,
                            getAnswer(questionIds.Sentinel) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm">
                        Sentinel lymph node biopsy
                      </div>
                    </div>

                    {/* Axillary lymph node dissection */}
                    <div className="ml-4.5 flex gap-3 h-[auto] lg:h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.Axillary) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.Axillary,
                            getAnswer(questionIds.Axillary) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm">
                        Axillary lymph node dissection
                      </div>
                    </div>

                    {/* Reconstruction */}

                    <div className="ml-4.5 flex flex-col lg:flex-row gap-3 h-[auto] lg:h-[40px] items-start lg:items-center">
                      <div className="flex gap-3">
                        <Checkbox2
                          checked={
                            getAnswer(questionIds.Reconstruction) === "true"
                          }
                          onClick={() =>
                            handleInputChange(
                              questionIds.Reconstruction,
                              getAnswer(questionIds.Reconstruction) === "true"
                                ? ""
                                : "true"
                            )
                          }
                        />
                        <div className="font-semibold text-sm ">
                          Reconstruction
                        </div>
                      </div>
                      {getAnswer(questionIds.Reconstruction) === "true" && (
                        <MultiOptionRadioGroup
                          questionId={questionIds.ReconstructionType}
                          formData={formData}
                          handleInputChange={handleInputChange}
                          options={[
                            { label: "Immediate", value: "Immediate" },
                            { label: "Delayed", value: "Delayed" },
                            { label: "None", value: "None" },
                          ]}
                          className="mt-0"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>

              <div
                className={`relative flex flex-col gap-2 lg:gap-0 ${
                  getAnswer(questionIds.Surgical) === "Done" ||
                  getAnswer(questionIds.Surgical) === "Planned" ||
                  "mt-3"
                }`}
              >
                {/*b.Neoadjuvant treatment planned (before surgery)*/}
                <MultiOptionRadioGroup
                  label="b. Neoadjuvant treatment planned (before surgery)"
                  questionId={questionIds.Neoadjuvant}
                  formData={formData}
                  //   className="flex flex-col lg:flex-row gap-3 mt-3"
                  handleInputChange={handleInputChange}
                  options={[
                    { label: "Not Applicable", value: "Not Applicable" },
                    { label: "Done", value: "Done" },
                    { label: "Planned", value: "Planned" },
                  ]}
                />

                {(getAnswer(questionIds.Neoadjuvant) === "Done" ||
                  getAnswer(questionIds.Neoadjuvant) === "Planned") && (
                  <>
                    {/* Chemotherapy (e.g., Taxol, Adriamycin, Herceptin) */}
                    <div className="ml-4.5 mt-0 lg:mt-3 flex gap-3 h-[auto] lg:h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.Chemotherapy) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.Chemotherapy,
                            getAnswer(questionIds.Chemotherapy) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm ">
                        Chemotherapy (e.g., Taxol, Adriamycin, Herceptin)
                      </div>
                    </div>

                    {/* Hormonal therapy Herceptin (for HER2-positive cancers), Tamoxifen, Aromatase inhibitors (e.g., Anastrozole), or others */}
                    <div className="ml-4.5 mt-0 lg:mt-2 flex gap-3 h-[auto] lg:h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.Hormonal) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.Hormonal,
                            getAnswer(questionIds.Hormonal) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm ">
                        Hormonal therapy Herceptin (for HER2-positive cancers),
                        Tamoxifen, Aromatase inhibitors (e.g., Anastrozole), or
                        others
                      </div>
                    </div>

                    {/*If yes, for how long and what was the outcome of the treatment? */}
                    <div className="ml-4.5 mt-0 lg:mt-2 flex flex-col">
                        <div className="flex gap-3 h-[auto] lg:h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.outcome) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.outcome,
                            getAnswer(questionIds.outcome) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm ">
                        If yes, for how long and what was the outcome of the
                        treatment?
                      </div>
                    </div>

                    {getAnswer(questionIds.outcome) === "true" && (
                        <div className="flex flex-row gap-2 items-center pl-4">
                            <Input 
                            type="text"
                            className="w-55"
                            value={getAnswer(questionIds.outcomeDuration)}
                            onChange={(e) =>
                              handleInputChange(
                                questionIds.outcomeDuration,
                                e.target.value
                              )
                            }
                            placeholder="Duration"
                            required
                            />

                            <Input 
                            type="text"
                            className="w-55"
                            value={getAnswer(questionIds.outcomeSpecify)}
                            onChange={(e) =>
                              handleInputChange(
                                questionIds.outcomeSpecify,
                                e.target.value
                              )
                            }
                            placeholder="Specify"
                            required
                            />
                        </div>
                    )}
                    </div>

                    {/*Targeted therapy */}
                    <div className="ml-4.5 flex gap-3   h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.Targeted) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.Targeted,
                            getAnswer(questionIds.Targeted) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm ">
                        Targeted therapy
                      </div>
                    </div>

                    {/* Immunotherapy */}
                    <div className="ml-4.5 flex gap-3 h-[40px] items-center">
                      <Checkbox2
                        checked={
                          getAnswer(questionIds.Immunotherapy) === "true"
                        }
                        onClick={() =>
                          handleInputChange(
                            questionIds.Immunotherapy,
                            getAnswer(questionIds.Immunotherapy) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm">Immunotherapy</div>
                    </div>

                    {/* Axillary lymph node dissection */}
                    <div className="ml-4.5 flex gap-3 h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.NeoAxillary) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.NeoAxillary,
                            getAnswer(questionIds.NeoAxillary) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm">
                        Axillary lymph node dissection
                      </div>
                    </div>

                    {/* Radiation therapy */}
                    <div className="ml-4.5 flex gap-3 h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.Radiation) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.Radiation,
                            getAnswer(questionIds.Radiation) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm">
                        Radiation therapy
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div
                className={`relative flex flex-col gap-2 ${
                  getAnswer(questionIds.Neoadjuvant) === "Done" ||
                  getAnswer(questionIds.Neoadjuvant) === "Planned" ||
                  "mt-3"
                }`}
              >
                {/*c.Adjuvant treatment planned (after surgery)*/}
                <MultiOptionRadioGroup
                  label="c. Adjuvant treatment planned (after surgery)"
                  questionId={questionIds.Adjuvant}
                  formData={formData}
                  //   className="flex flex-col lg:flex-row gap-3 mt-3"
                  handleInputChange={handleInputChange}
                  options={[
                    { label: "Not Applicable", value: "Not Applicable" },
                    { label: "Done", value: "Done" },
                    { label: "Planned", value: "Planned" },
                  ]}
                />

                {(getAnswer(questionIds.Adjuvant) === "Done" ||
                  getAnswer(questionIds.Adjuvant) === "Planned") && (
                  <>
                    {/* Chemotherapy */}
                    <div className="ml-4.5 flex gap-3  h-[40px] items-center">
                      <Checkbox2
                        checked={
                          getAnswer(questionIds.AdjChemotherapy) === "true"
                        }
                        onClick={() =>
                          handleInputChange(
                            questionIds.AdjChemotherapy,
                            getAnswer(questionIds.AdjChemotherapy) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm ">Chemotherapy</div>
                    </div>

                    {/* Hormonal therapy */}
                    <div className="ml-4.5 flex -mt-3 gap-3 h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.AdjHormonal) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.AdjHormonal,
                            getAnswer(questionIds.AdjHormonal) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm ">
                        Hormonal therapy
                      </div>
                    </div>

                    {/*Targeted therapy */}
                    <div className="ml-4.5 flex gap-3 -mt-4   h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.AdjTargeted) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.AdjTargeted,
                            getAnswer(questionIds.AdjTargeted) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm ">
                        Targeted therapy
                      </div>
                    </div>

                    {/* Immunotherapy */}
                    <div className="ml-4.5 flex gap-3 -mt-4 h-[40px] items-center">
                      <Checkbox2
                        checked={
                          getAnswer(questionIds.AdjImmunotherapy) === "true"
                        }
                        onClick={() =>
                          handleInputChange(
                            questionIds.AdjImmunotherapy,
                            getAnswer(questionIds.AdjImmunotherapy) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm">Immunotherapy</div>
                    </div>

                    {/* Radiation therapy */}
                    <div className="ml-4.5 flex gap-3 -mt-4 h-[40px] items-center">
                      <Checkbox2
                        checked={getAnswer(questionIds.AdjRadiation) === "true"}
                        onClick={() =>
                          handleInputChange(
                            questionIds.AdjRadiation,
                            getAnswer(questionIds.AdjRadiation) === "true"
                              ? ""
                              : "true"
                          )
                        }
                      />
                      <div className="font-semibold text-sm">
                        Radiation therapy
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div>
                <div
                  className={`flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 ${
                    getAnswer(questionIds.Adjuvant) === "Done" ||
                    getAnswer(questionIds.Adjuvant) === "Planned" ||
                    "mt-3"
                  }`}
                >
                  <Label className="font-semibold text-base flex flex-wrap gap-1">
                    d. Treatment timeline and details
                  </Label>
                  <Textarea
                    className="w-full lg:w-100"
                    value={getAnswer(questionIds.Treatmenttimeline)}
                    onChange={(e) =>
                      handleInputChange(
                        questionIds.Treatmenttimeline,
                        e.target.value
                      )
                    }
                    placeholder="Specify"
                  />
                </div>
              </div>

              <div>
                <div className=" flex flex-col  gap-3 mt-3">
                  <Label className="font-semibold text-base flex flex-wrap gap-1">
                    e. Did you experience any side effects from chemotherapy or
                    radiation? If so, what were they?
                  </Label>
                  <Textarea
                    value={getAnswer(questionIds.sideeffects)}
                    onChange={(e) =>
                      handleInputChange(questionIds.sideeffects, e.target.value)
                    }
                    placeholder="Enter Details"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Treatment;
