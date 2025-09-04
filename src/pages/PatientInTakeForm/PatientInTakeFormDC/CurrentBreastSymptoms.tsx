import React, { useEffect } from "react";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { Separator } from "@/components/ui/separator";
import FormHeader from "../FormHeader";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import TextEditor from "@/components/TextEditor";
import { PatientHistoryReportGenerator } from "@/pages/Report/GenerateReport/PatientHistoryReportGenerator";

type Props = {
  data: any;
  setData: any;
  questionIds: QuestionIds;
  readOnly: boolean;
};

interface QuestionIds {
  breastCancerSymptoms: number;
  lumpOrThick: number;
  lumpLeft: number;
  lumpRight: number;
  lumpResult: number;
  lumpResultRight: number;
  lumpDate: number;
  lumpDateRight: number;
  lumpSize: number;
  lumpSizeRight: number;
  skinChanges: number;
  skinRight: number;
  skinLeft: number;
  skinDate: number;
  skinDateRight: number;
  skinResult: number;
  skinResultRight: number;
  nippleDischarge: number;
  nippleRight: number;
  nippleLeft: number;
  nippleDate: number;
  nippleDateRight: number;
  nippleResult: number;
  nippleResultRight: number;
  breastPain: number;
  breastPainRight: number;
  breastPainLeft: number;
  breastPainDate: number;
  breastPainDateRight: number;
  breastPainResult: number;
  breastPainResultRight: number;
  nipplePain: number;
  nipplePainRight: number;
  nipplePainLeft: number;
  nipplePainDate: number;
  nipplePainDateRight: number;
  nipplePainResult: number;
  nipplePainResultRight: number;
  lymphNodes: number;
  lymphNodesRight: number;
  lymphNodesLeft: number;
  lymphNodesDate: number;
  lymphNodesDateRight: number;
  lymphNodesResult: number;
  lymphNodesResultRight: number;
  others: number;
  othersDetails: number;
  additionalcomments: number;
}

const CurrentBreastSymptoms: React.FC<Props> = (Props) => {
  const getAnswerByQuestionId = (questionId: any) => {
    const result = Props.data.find(
      (item: any) => item.questionId === questionId
    );
    console.log(result?.answer ?? "");
    return result?.answer ?? ""; // Return empty string if not found
  };

  const handleInputChange = (questionId: number, value: string) => {
    Props.setData((prev: any) =>
      prev.map((item: any) =>
        item.questionId === questionId ? { ...item, answer: value } : item
      )
    );
  };

  useEffect(() => {
    if (
      getAnswerByQuestionId(87) === "Yes" &&
      getAnswerByQuestionId(Props.questionIds.breastCancerSymptoms) === ""
    ) {
      handleInputChange(Props.questionIds.breastCancerSymptoms, "Yes");
    }

    if (
      getAnswerByQuestionId(88) === "true" &&
      getAnswerByQuestionId(Props.questionIds.lumpOrThick) === ""
    ) {
      handleInputChange(Props.questionIds.lumpOrThick, "true");
    }

    if (
      getAnswerByQuestionId(94) === "true" &&
      getAnswerByQuestionId(Props.questionIds.skinChanges) === ""
    ) {
      handleInputChange(Props.questionIds.skinChanges, "true");
    }

    if (
      getAnswerByQuestionId(99) === "true" &&
      getAnswerByQuestionId(Props.questionIds.nippleDischarge) === ""
    ) {
      handleInputChange(Props.questionIds.nippleDischarge, "true");
    }

    if (
      getAnswerByQuestionId(106) === "true" &&
      getAnswerByQuestionId(Props.questionIds.breastPain) === ""
    ) {
      handleInputChange(Props.questionIds.breastPain, "true");
    }

    if (
      getAnswerByQuestionId(111) === "true" &&
      getAnswerByQuestionId(Props.questionIds.nipplePain) === ""
    ) {
      handleInputChange(Props.questionIds.nipplePain, "true");
    }

    if (
      getAnswerByQuestionId(116) === "true" &&
      getAnswerByQuestionId(Props.questionIds.lymphNodes) === ""
    ) {
      handleInputChange(Props.questionIds.lymphNodes, "true");
    }

    if (
      getAnswerByQuestionId(122) === "true" &&
      getAnswerByQuestionId(Props.questionIds.others) === ""
    ) {
      handleInputChange(Props.questionIds.others, "true");
    }
  }, []);

  return (
    <div className="flex flex-col h-full relative">
      <FormHeader FormTitle="CURRENT BREAST SYMPTOMS" className="uppercase" />
      <div className="bg-[#fff]">
        {
          <TextEditor
            value={PatientHistoryReportGenerator(Props.data)}
            readOnly={true}
          />
        }
      </div>
      <div className={Props.readOnly ? "pointer-events-none" : ""}>
        <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 lg:pr-2 space-y-8 pb-10">
          <MultiOptionRadioGroup
            label="A. Do you have any current breast symptoms?"
            questionId={Props.questionIds.breastCancerSymptoms}
            formData={Props.data}
            handleInputChange={handleInputChange}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
            required={true}
          />

          {getAnswerByQuestionId(Props.questionIds.breastCancerSymptoms) ===
            "Yes" && (
            <>
              <div className="font-bold mb-4">
                B. If yes, check all that apply:{" "}
                <span className="text-red-500">*</span>
              </div>

              <div className="font-semibold mb-4">
                How symptoms compare with your previous symptoms?
                <br />
                Have any of the symptoms you experienced previously now
                resolved?
              </div>

              <div className="w-full flex flex-col lg:flex-row items-center lg:space-x-10">
                <div className="flex justify-start flex-row w-[100%] lg:w-[30%] items-center space-x-2">
                  <Checkbox2
                    checked={
                      getAnswerByQuestionId(Props.questionIds.lumpOrThick) ===
                      "true"
                    }
                    onClick={() => {
                      handleInputChange(
                        Props.questionIds.lumpOrThick,
                        getAnswerByQuestionId(Props.questionIds.lumpOrThick) ===
                          "true"
                          ? "false"
                          : "true"
                      );
                    }}
                  />
                  <Label className="font-semibold text-base">
                    Lump or thickening
                  </Label>
                </div>
                {getAnswerByQuestionId(Props.questionIds.lumpOrThick) ===
                  "true" && (
                  <div className="flex mt-4 lg:mt-0 items-center gap-2 ml-2">
                    {/* <Label className="min-w-[50px]">Result</Label> */}
                    <MultiOptionRadioGroup
                      questionId={Props.questionIds.lumpLeft}
                      handleInputChange={handleInputChange}
                      formData={Props.data}
                      options={[
                        { label: "Unchanged", value: "Unchanged" },
                        { label: "Resolved", value: "Resolved" },
                        { label: "New", value: "New" },
                      ]}
                      className="mt-0 ml-0 sm:min-h-[auto]"
                      required={
                        getAnswerByQuestionId(Props.questionIds.lumpLeft)
                          .length > 0
                          ? false
                          : true
                      }
                      disabled={
                        getAnswerByQuestionId(Props.questionIds.lumpOrThick) ==
                        ""
                      }
                    />
                  </div>
                )}
              </div>
              <Separator className="bg-[#a4b2a1]" />
              <div className="w-full flex flex-col lg:flex-row items-center lg:space-x-10">
                <div className="flex justify-start flex-row w-[100%] lg:w-[30%] items-center space-x-2">
                  <Checkbox2
                    checked={
                      getAnswerByQuestionId(Props.questionIds.skinChanges) ===
                      "true"
                    }
                    onClick={() => {
                      handleInputChange(
                        Props.questionIds.skinChanges,
                        getAnswerByQuestionId(Props.questionIds.skinChanges) ===
                          "true"
                          ? "false"
                          : "true"
                      );
                    }}
                  />
                  <Label className="font-semibold text-base">
                    Skin changes
                  </Label>
                </div>
                {getAnswerByQuestionId(Props.questionIds.skinChanges) ===
                  "true" && (
                  <div className="flex mt-4 lg:mt-0 items-center gap-2 ml-2">
                    {/* <Label className="min-w-[50px]">Result</Label> */}
                    <MultiOptionRadioGroup
                      questionId={Props.questionIds.skinLeft}
                      handleInputChange={handleInputChange}
                      formData={Props.data}
                      options={[
                        { label: "Unchanged", value: "Unchanged" },
                        { label: "Resolved", value: "Resolved" },
                        { label: "New", value: "New" },
                      ]}
                      className="mt-0 ml-0"
                      required={
                        getAnswerByQuestionId(Props.questionIds.skinLeft)
                          .length > 0
                          ? false
                          : true
                      }
                      disabled={
                        getAnswerByQuestionId(Props.questionIds.skinChanges) ==
                        ""
                      }
                    />
                  </div>
                )}
              </div>
              <Separator className="bg-[#a4b2a1]" />
              <div className="w-full flex flex-col lg:flex-row items-center lg:space-x-10">
                <div className="flex justify-start flex-row w-[100%] lg:w-[30%] items-center space-x-2">
                  <Checkbox2
                    checked={
                      getAnswerByQuestionId(
                        Props.questionIds.nippleDischarge
                      ) === "true"
                    }
                    onClick={() => {
                      handleInputChange(
                        Props.questionIds.nippleDischarge,
                        getAnswerByQuestionId(
                          Props.questionIds.nippleDischarge
                        ) === "true"
                          ? "false"
                          : "true"
                      );
                    }}
                  />
                  <Label className="font-semibold text-base">
                    Nipple discharge
                  </Label>
                </div>
                {getAnswerByQuestionId(Props.questionIds.nippleDischarge) ===
                  "true" && (
                  <div className="flex mt-4 lg:mt-0 items-center gap-2 ml-2">
                    {/* <Label className="min-w-[50px]">Result</Label> */}
                    <MultiOptionRadioGroup
                      questionId={Props.questionIds.nippleLeft}
                      handleInputChange={handleInputChange}
                      formData={Props.data}
                      options={[
                        { label: "Unchanged", value: "Unchanged" },
                        { label: "Resolved", value: "Resolved" },
                        { label: "New", value: "New" },
                      ]}
                      className="mt-0 ml-0"
                      required={
                        getAnswerByQuestionId(Props.questionIds.nippleLeft)
                          .length > 0
                          ? false
                          : true
                      }
                      disabled={
                        getAnswerByQuestionId(
                          Props.questionIds.nippleDischarge
                        ) == ""
                      }
                    />
                  </div>
                )}
              </div>
              <Separator className="bg-[#a4b2a1]" />
              <div className="w-full flex flex-col lg:flex-row items-center lg:space-x-10">
                <div className="flex justify-start flex-row w-[100%] lg:w-[30%] items-center space-x-2">
                  <Checkbox2
                    checked={
                      getAnswerByQuestionId(Props.questionIds.breastPain) ===
                      "true"
                    }
                    onClick={() => {
                      handleInputChange(
                        Props.questionIds.breastPain,
                        getAnswerByQuestionId(Props.questionIds.breastPain) ===
                          "true"
                          ? "false"
                          : "true"
                      );
                    }}
                  />
                  <Label className="font-semibold text-base">Breast pain</Label>
                </div>
                {getAnswerByQuestionId(Props.questionIds.breastPain) ===
                  "true" && (
                  <div className="flex mt-4 lg:mt-0 items-center gap-2 ml-2">
                    {/* <Label className="min-w-[50px]">Result</Label> */}
                    <MultiOptionRadioGroup
                      questionId={Props.questionIds.breastPainLeft}
                      handleInputChange={handleInputChange}
                      formData={Props.data}
                      options={[
                        { label: "Unchanged", value: "Unchanged" },
                        { label: "Resolved", value: "Resolved" },
                        { label: "New", value: "New" },
                      ]}
                      className="mt-0 ml-0"
                      required={
                        getAnswerByQuestionId(Props.questionIds.breastPainLeft)
                          .length > 0
                          ? false
                          : true
                      }
                      disabled={
                        getAnswerByQuestionId(Props.questionIds.breastPain) ==
                        ""
                      }
                    />
                  </div>
                )}
              </div>
              <Separator className="bg-[#a4b2a1]" />
              <div className="w-full flex flex-col lg:flex-row items-center lg:space-x-10">
                <div className="flex justify-start flex-row w-[100%] lg:w-[30%] items-center space-x-2">
                  <Checkbox2
                    checked={
                      getAnswerByQuestionId(Props.questionIds.nipplePain) ===
                      "true"
                    }
                    onClick={() => {
                      handleInputChange(
                        Props.questionIds.nipplePain,
                        getAnswerByQuestionId(Props.questionIds.nipplePain) ===
                          "true"
                          ? "false"
                          : "true"
                      );
                    }}
                  />
                  <Label className="font-semibold text-base">
                    Nipple changes
                  </Label>
                </div>
                {getAnswerByQuestionId(Props.questionIds.nipplePain) ===
                  "true" && (
                  <div className="flex mt-4 lg:mt-0 items-center gap-2 ml-2">
                    {/* <Label className="min-w-[50px]">Result</Label> */}
                    <MultiOptionRadioGroup
                      questionId={Props.questionIds.nipplePainLeft}
                      handleInputChange={handleInputChange}
                      formData={Props.data}
                      options={[
                        { label: "Unchanged", value: "Unchanged" },
                        { label: "Resolved", value: "Resolved" },
                        { label: "New", value: "New" },
                      ]}
                      className="mt-0 ml-0"
                      required={
                        getAnswerByQuestionId(Props.questionIds.nipplePainLeft)
                          .length > 0
                          ? false
                          : true
                      }
                      disabled={
                        getAnswerByQuestionId(Props.questionIds.nipplePain) ==
                        ""
                      }
                    />
                  </div>
                )}
              </div>
              <Separator className="bg-[#a4b2a1]" />
              <div className="w-full flex flex-col lg:flex-row items-center lg:space-x-10">
                <div className="flex justify-start flex-row w-[100%] lg:w-[30%] items-center space-x-2">
                  <Checkbox2
                    checked={
                      getAnswerByQuestionId(Props.questionIds.lymphNodes) ===
                      "true"
                    }
                    onClick={() => {
                      handleInputChange(
                        Props.questionIds.lymphNodes,
                        getAnswerByQuestionId(Props.questionIds.lymphNodes) ===
                          "true"
                          ? "false"
                          : "true"
                      );
                    }}
                  />
                  <Label className="font-semibold text-base">
                    Lymph node swelling
                  </Label>
                </div>
                {getAnswerByQuestionId(Props.questionIds.lymphNodes) ===
                  "true" && (
                  <div className="flex mt-4 lg:mt-0 items-center gap-2 ml-2">
                    {/* <Label className="min-w-[50px]">Result</Label> */}
                    <MultiOptionRadioGroup
                      questionId={Props.questionIds.lymphNodesLeft}
                      handleInputChange={handleInputChange}
                      formData={Props.data}
                      options={[
                        { label: "Unchanged", value: "Unchanged" },
                        { label: "Resolved", value: "Resolved" },
                        { label: "New", value: "New" },
                      ]}
                      className="mt-0 ml-0"
                      required={
                        getAnswerByQuestionId(Props.questionIds.lymphNodesLeft)
                          .length > 0
                          ? false
                          : true
                      }
                      disabled={
                        getAnswerByQuestionId(Props.questionIds.lymphNodes) ==
                        ""
                      }
                    />
                  </div>
                )}
              </div>
              <Separator className="bg-[#a4b2a1]" />
              <div className="w-full flex flex-col lg:flex-row items-center lg:space-x-10">
                <div className="flex justify-start flex-row w-[100%] lg:w-[30%] items-center space-x-2">
                  <Checkbox2
                    checked={
                      getAnswerByQuestionId(Props.questionIds.others) === "true"
                    }
                    onClick={() => {
                      handleInputChange(
                        Props.questionIds.others,
                        getAnswerByQuestionId(Props.questionIds.others) ===
                          "true"
                          ? "false"
                          : "true"
                      );
                    }}
                  />
                  <Label className="font-semibold text-base">Others</Label>
                </div>
                {getAnswerByQuestionId(Props.questionIds.others) === "true" && (
                  <div className="flex mt-4 lg:mt-0 items-center gap-2 ml-2">
                    {/* <Label className="min-w-[50px]">Result</Label> */}
                    <MultiOptionRadioGroup
                      questionId={Props.questionIds.othersDetails}
                      handleInputChange={handleInputChange}
                      formData={Props.data}
                      options={[
                        { label: "Unchanged", value: "Unchanged" },
                        { label: "Resolved", value: "Resolved" },
                        { label: "New", value: "New" },
                      ]}
                      className="mt-0 ml-0"
                      required={
                        getAnswerByQuestionId(Props.questionIds.othersDetails)
                          .length > 0
                          ? false
                          : true
                      }
                      disabled={
                        getAnswerByQuestionId(Props.questionIds.others) == ""
                      }
                    />
                  </div>
                )}
              </div>
              {/* <div className="ml-4 flex flex-col gap-5 relative">
                <BreastInput
                  label="Lump or thickening"
                  checkStatusQId={Props.questionIds.lumpOrThick}
                  RQID={Props.questionIds.lumpLeft}
                  LQID={Props.questionIds.lumpRight}
                  SDate={Props.questionIds.lumpDate}
                  SDateRight={Props.questionIds.lumpDateRight}
                  SResult={Props.questionIds.lumpResult}
                  SResultRight={Props.questionIds.lumpResultRight}
                  data={Props.data}
                  setData={Props.setData}
                  Size={Props.questionIds.lumpSize}
                  SizeRight={Props.questionIds.lumpSizeRight}
                />
                <Separator className="bg-[#a4b2a1]" />
                <BreastInput
                  label="Skin changes"
                  checkStatusQId={Props.questionIds.skinChanges}
                  RQID={Props.questionIds.skinRight}
                  LQID={Props.questionIds.skinLeft}
                  SDate={Props.questionIds.skinDate}
                  SDateRight={Props.questionIds.skinDateRight}
                  data={Props.data}
                  setData={Props.setData}
                  SResult={Props.questionIds.skinResult}
                  SResultRight={Props.questionIds.skinResultRight}
                />
                <Separator className="bg-[#a4b2a1]" />
                <BreastInputWithout
                  label="Nipple discharge"
                  checkStatusQId={Props.questionIds.nippleDischarge}
                  RQID={Props.questionIds.nippleRight}
                  LQID={Props.questionIds.nippleLeft}
                  SDate={Props.questionIds.nippleDate}
                  SDateRight={Props.questionIds.nippleDateRight}
                  data={Props.data}
                  setData={Props.setData}
                  SResult={Props.questionIds.nippleResult}
                  SResultRight={Props.questionIds.nippleResultRight}
                />
                <Separator className="bg-[#a4b2a1]" />
                <BreastInput
                  label="Breast pain"
                  checkStatusQId={Props.questionIds.breastPain}
                  RQID={Props.questionIds.breastPainRight}
                  LQID={Props.questionIds.breastPainLeft}
                  SDate={Props.questionIds.breastPainDate}
                  SDateRight={Props.questionIds.breastPainDateRight}
                  data={Props.data}
                  setData={Props.setData}
                  SResult={Props.questionIds.breastPainResult}
                  SResultRight={Props.questionIds.breastPainResultRight}
                />
                <Separator className="bg-[#a4b2a1]" />
                <BreastInputWithout
                  label="Nipple changes"
                  checkStatusQId={Props.questionIds.nipplePain}
                  RQID={Props.questionIds.nipplePainRight}
                  LQID={Props.questionIds.nipplePainLeft}
                  SDate={Props.questionIds.nipplePainDate}
                  SDateRight={Props.questionIds.nipplePainDateRight}
                  data={Props.data}
                  setData={Props.setData}
                  SResult={Props.questionIds.nipplePainResult}
                  SResultRight={Props.questionIds.nipplePainResultRight}
                />
                <Separator className="bg-[#a4b2a1]" />
                <BreastInput
                  label="Lymph node swelling"
                  checkStatusQId={Props.questionIds.lymphNodes}
                  RQID={Props.questionIds.lymphNodesRight}
                  LQID={Props.questionIds.lymphNodesLeft}
                  SDate={Props.questionIds.lymphNodesDate}
                  SDateRight={Props.questionIds.lymphNodesDateRight}
                  data={Props.data}
                  setData={Props.setData}
                  SResult={Props.questionIds.lymphNodesResult}
                  SResultRight={Props.questionIds.lymphNodesResultRight}
                />
                <Separator className="bg-[#a4b2a1]" />
                <div className="flex justify-start flex-row w-[100%] items-center space-x-2">
                  <Checkbox2
                    checked={
                      getAnswerByQuestionId(Props.questionIds.others) === "true"
                    }
                    onClick={() => {
                      handleInputChange(
                        Props.questionIds.others,
                        getAnswerByQuestionId(Props.questionIds.others) ===
                          "true"
                          ? "false"
                          : "true"
                      );
                    }}
                  />
                  <Label className="font-semibold text-base lg:w-[180px]">
                    Others
                  </Label>

                  {getAnswerByQuestionId(Props.questionIds.others) ===
                    "true" && (
                    <Textarea
                      value={getAnswerByQuestionId(
                        Props.questionIds.othersDetails
                      )}
                      onChange={(e) => {
                        handleInputChange(
                          Props.questionIds.othersDetails,
                          e.target.value
                        );
                      }}
                      className="w-1/3"
                      placeholder="Additional Comments"
                      required
                    />
                  )}
                </div>
                <Separator className="bg-[#a4b2a1]" />
                <div className="flex justify-start flex-row w-[100%] items-center space-x-2">
                  <Label className="font-semibold text-base lg:w-[180px]">
                    Additional Comments
                  </Label>

                  <Textarea
                    value={getAnswerByQuestionId(
                      Props.questionIds.additionalcomments
                    )}
                    onChange={(e) => {
                      handleInputChange(
                        Props.questionIds.additionalcomments,
                        e.target.value
                      );
                    }}
                    className="w-1/3"
                    placeholder="Additional Comments"
                  />
                </div>
              </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentBreastSymptoms;
