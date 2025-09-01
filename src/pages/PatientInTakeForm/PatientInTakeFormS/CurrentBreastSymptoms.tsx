import React from "react";
import BreastInput from "../BreastInput";
import BreastInputWithout from "../BreastInputWithout";
import BreastInputLocation from "../BreastInputLocation";
import FormHeader from "../FormHeader";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
  lumpDate: number;
  lumpSize: number;
  lumpDateRight: number;
  lumpSizeRight: number;
  lumpDetails: number;
  skinChanges: number;
  skinRight: number;
  skinLeft: number;
  skinDate: number;
  skinDateRight: number;
  skinDetails: number;
  skinOther: number;
  skinOtherRight: number;
  skinChangesType: number;
  skinChangesTypeRight: number;
  nippleDischarge: number;
  nippleRight: number;
  nippleLeft: number;
  nippleDate: number;
  nippleDateRight: number;
  nippleDetails: number;
  breastPain: number;
  breastPainRight: number;
  breastPainLeft: number;
  breastPainDate: number;
  breastPainDateRight: number;
  breastPainDetails: number;
  nipplePain: number;
  nipplePainRight: number;
  nipplePainLeft: number;
  nipplePainDate: number;
  nipplePainDateRight: number;
  nipplePainDetails: number;
  nipplePosition: number;
  nipplePositionDetails: number;
  nipplePositionRight: number;
  nipplePositionRightDetails: number;
  lymphNodes: number;
  lymphNodesRight: number;
  lymphNodesLeft: number;
  locationAxillary: number;
  locationAxillaryDuration: number;
  locationAxillarySize: number;
  locationInBetween: number;
  locationInBetweenDuration: number;
  locationInBetweenSize: number;
  locationOther: number;
  locationOtherSpecify: number;
  locationOtherDuration: number;
  locationOtherSize: number;
  lymphNodesDetails: number;
  others: number;
  othersDetails: number;
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

  const updateAnswer = (questionId: number, newAnswer: any) => {
    Props.setData((prevData: any[]) =>
      prevData.map((item) =>
        item.questionId === questionId ? { ...item, answer: newAnswer } : item
      )
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <FormHeader FormTitle="CURRENT BREAST SYMPTOMS" className="uppercase" />
      <div className="bg-[#fff]">{<TextEditor value={PatientHistoryReportGenerator(Props.data)} readOnly={true} />}</div>
      <div className={Props.readOnly ? "pointer-events-none" : ""}>
        <div className="flex-grow overflow-y-auto px-5 py-10 lg:py-0 lg:px-20 lg:pr-2 space-y-8 pb-10">
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

              <div className="ml-4 flex flex-col gap-5 relative">
                <BreastInput
                  label="Lump or thickening"
                  checkStatusQId={Props.questionIds.lumpOrThick}
                  RQID={Props.questionIds.lumpLeft}
                  LQID={Props.questionIds.lumpRight}
                  SDate={Props.questionIds.lumpDate}
                  Size={Props.questionIds.lumpSize}
                  SDateRight={Props.questionIds.lumpDateRight}
                  SizeRight={Props.questionIds.lumpSizeRight}
                  data={Props.data}
                  setData={Props.setData}
                  OtherInputQId={Props.questionIds.lumpDetails}
                  requiredStatus={
                    getAnswerByQuestionId(Props.questionIds.lumpOrThick) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.skinChanges) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nippleDischarge) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.breastPain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nipplePain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.lymphNodes) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.others) === "true"
                  }
                />
                <Separator className="bg-[#a4b2a1]" />
                <BreastInput
                  label="Skin changes"
                  checkStatusQId={Props.questionIds.skinChanges}
                  RQID={Props.questionIds.skinRight}
                  LQID={Props.questionIds.skinLeft}
                  SDate={Props.questionIds.skinDate}
                  SDateRight={Props.questionIds.skinDateRight}
                  skinChangesType={Props.questionIds.skinChangesType}
                  skinChangesTypeRight={Props.questionIds.skinChangesTypeRight}
                  data={Props.data}
                  setData={Props.setData}
                  OtherInputQId={Props.questionIds.skinDetails}
                  skinOther={Props.questionIds.skinOther}
                  skinOtherRight={Props.questionIds.skinOtherRight}
                  requiredStatus={
                    getAnswerByQuestionId(Props.questionIds.lumpOrThick) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.skinChanges) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nippleDischarge) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.breastPain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nipplePain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.lymphNodes) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.others) === "true"
                  }
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
                  OtherInputQId={Props.questionIds.nippleDetails}
                  requiredStatus={
                    getAnswerByQuestionId(Props.questionIds.lumpOrThick) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.skinChanges) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nippleDischarge) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.breastPain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nipplePain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.lymphNodes) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.others) === "true"
                  }
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
                  OtherInputQId={Props.questionIds.breastPainDetails}
                  requiredStatus={
                    getAnswerByQuestionId(Props.questionIds.lumpOrThick) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.skinChanges) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nippleDischarge) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.breastPain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nipplePain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.lymphNodes) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.others) === "true"
                  }
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
                  OtherInputQId={Props.questionIds.nipplePainDetails}
                  nipplePosition={Props.questionIds.nipplePosition}
                  nipplePositionDetails={
                    Props.questionIds.nipplePositionDetails
                  }
                  nipplePositionRight={Props.questionIds.nipplePositionRight}
                  nipplePositionRightDetails={
                    Props.questionIds.nipplePositionRightDetails
                  }
                  requiredStatus={
                    getAnswerByQuestionId(Props.questionIds.lumpOrThick) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.skinChanges) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nippleDischarge) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.breastPain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nipplePain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.lymphNodes) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.others) === "true"
                  }
                />
                <Separator className="bg-[#a4b2a1]" />
                <BreastInputLocation
                  label="Lymph node swelling"
                  checkStatusQId={Props.questionIds.lymphNodes}
                  RQID={Props.questionIds.lymphNodesRight}
                  LQID={Props.questionIds.lymphNodesLeft}
                  LocationAxillary={Props.questionIds.locationAxillary}
                  LocationAxillaryDuration={
                    Props.questionIds.locationAxillaryDuration
                  }
                  LocationAxillarySize={Props.questionIds.locationAxillarySize}
                  LocationInBetween={Props.questionIds.locationInBetween}
                  LocationInBetweenDuration={
                    Props.questionIds.locationInBetweenDuration
                  }
                  LocationInBetweenSize={
                    Props.questionIds.locationInBetweenSize
                  }
                  LocationOther={Props.questionIds.locationOther}
                  LocationOtherSpecify={Props.questionIds.locationOtherSpecify}
                  LocationOtherDuration={
                    Props.questionIds.locationOtherDuration
                  }
                  LocationOtherSize={Props.questionIds.locationOtherSize}
                  data={Props.data}
                  setData={Props.setData}
                  OtherInputQId={Props.questionIds.lymphNodesDetails}
                  requiredStatus={
                    getAnswerByQuestionId(Props.questionIds.lumpOrThick) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.skinChanges) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nippleDischarge) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.breastPain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.nipplePain) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.lymphNodes) === "true" ||
                    getAnswerByQuestionId(Props.questionIds.others) === "true"
                  }
                />
                <Separator className="bg-[#a4b2a1]" />
                <div className="flex justify-start flex-row w-[100%] items-center space-x-2">
                  <div className="flex gap-2 items-center lg:w-[20%]">
                    <Checkbox2
                      checked={
                        getAnswerByQuestionId(Props.questionIds.others) ===
                        "true"
                      }
                      onClick={() => {
                        updateAnswer(
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
                      required
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentBreastSymptoms;
