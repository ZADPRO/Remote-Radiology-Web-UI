import React from "react";
import BreastInput from "./BreastInput";
import BreastInputWithout from "./BreastInputWithout";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import { Separator } from "@/components/ui/separator";
import FormHeader from "../FormHeader";

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

  // const updateAnswer = (questionId: number, newAnswer: any) => {
  //   Props.setData((prevData: any[]) =>
  //     prevData.map((item) =>
  //       item.questionId === questionId ? { ...item, answer: newAnswer } : item
  //     )
  //   );
  // };

  return (
    <div className="flex flex-col h-full">
      <FormHeader FormTitle="CURRENT BREAST SYMPTOMS" className="uppercase" />
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

        {getAnswerByQuestionId(Props.questionIds.breastCancerSymptoms) === "Yes" && (
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
              {/* <div className="flex justify-start flex-row w-[100%] items-center space-x-2">
              //   <Checkbox2
              //     checked={getAnswerByQuestionId(Props.questionIds.others) === "true"}
              //     onClick={() => {
              //       updateAnswer(
              //         Props.questionIds.others,
              //         getAnswerByQuestionId(Props.questionIds.others) === "true"
              //           ? "false"
              //           : "true"
              //       );
              //     }}
              //   />
              //   <Label className="font-semibold text-base lg:w-[180px]">Others</Label>

              //   {getAnswerByQuestionId(Props.questionIds.others) === "true" && (
              //     <Input
              //       type="text"
              //       value={getAnswerByQuestionId(Props.questionIds.othersRight)}
              //       onChange={(e) => {
              //         handleInputChange(Props.questionIds.othersRight, e.target.value);
              //       }
              //       }
              //       className="w-1/3"
              //       required
              //     />
              //   )}
              // </div>  */}
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default CurrentBreastSymptoms;